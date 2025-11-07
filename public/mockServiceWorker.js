
/* eslint-disable prefer-arrow-callback */

/**
 * Service Worker 本质上是一个位于浏览器和网络之间的客户端脚本，它充当一个可编程的网络代理。它的主要特点是：

  独立的线程：它运行在浏览器后台的独立线程，与主 JavaScript 线程分离，不会阻塞 DOM。

  可拦截请求：可以拦截、修改和缓存网络请求。

  离线优先：是实现Progressive Web App (PWA) 核心技术，提供离线体验。

  生命周期：拥有自己独立的、完全异步的生命周期。

  需要 HTTPS：为了安全（防止中间人攻击），在生产环境中必须使用 HTTPS（localhost 除外，用于开发）。
*/


const PACKAGE_VERSION = '2.6.4';
const INTEGRITY_CHECKSUM = 'ca7800994cc8bfb5eb961e037c877074';
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse');
const activeClientIds = new Set();

/**
 * 2. 生命周期
  理解生命周期是掌握 Service Worker 的关键。它包含以下几个阶段：
 */

// 1 注册 (Register)：你的主站 JavaScript 告诉浏览器 Service Worker 文件的位置。
//  "msw": {
//    "workerDirectory": "public"
//  },


// 2 安装 (Install)
// 浏览器下载并解析 SW 文件，然后触发 install 事件。这是预缓存关键资源的理想时机。
// 如果 event.waitUntil() 中的 Promise 被 reject，安装会失败，SW 不会被激活
self.addEventListener('install', function (event) {
  // 如果已存在一个旧的 SW，新的 SW 会进入 waiting 状态，直到所有已打开的页面都关闭（释放了对旧 SW 的控制）。
  // 可以通过 self.skipWaiting() 来强制立即激活。
  self.skipWaiting();
})

// 3 激活 (Activate)：新的 SW 被激活，控制页面，并触发 activate 事件。这是清理旧缓存的理想时机。
self.addEventListener('activate', function (event) {
  // 可以通过 event.waitUntil() 确保清理工作完成
  event.waitUntil(self.clients.claim());
})

/**
 * 每个 Service Worker 都有一个作用域（scope），它只能控制在该作用域下的客户端
 * Client 是 Service Worker 与页面之间通信的桥梁。
 *
 *
 */

// 接收来自 Service Worker 的消息
self.addEventListener('message', async function (event) {
  const clientId = event.source.id;

  if (!clientId || !self.clients) return;

  // 向特定 Client 发送消息
  const client = await self.clients.get(clientId);

  if (!client) return;

  // 向所有控制的 Clients 广播消息
  // clients.forEach(client => {
  //   client.postMessage(message);
  // });

  const allClients = await self.clients.matchAll({
    type: 'window',
  });

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, { type: 'KEEPALIVE_RESPONSE' });
      break;
    };

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: {
          packageVersion: PACKAGE_VERSION,
          checksum: INTEGRITY_CHECKSUM
        }
      });
      break;
    };

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId);

      sendToClient(client,
        {
          type: 'MOCKING_ENABLED',
          payload: {
            client: {
              id: client.id,
              frameType: client.frameType
            }
          }
        });

      break;
    };

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId);
      break;
    };

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId);

      const remainingClients = allClients.filter((client) => client.id !== clientId);

      if (remainingClients.length === 0) {
        self.registration.unregister();
      }

      break;
    };

  }
})

// 拦截请求
self.addEventListener('fetch', function (event) {
  const { request } = event;
  // Bypass navigation requests.
  if (request.mode === 'navigate') {
    return;
  }

  // Opening the Devtools triggers the 'only-if-cached' request;
  // that cannot be handled by the service worker.Bypass such requests.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been deleted (still remains active until the next reload).
  if (activeClientIds.size === 0) {
    return;
  }

  // Generate unique request ID.
  const requestId = crypto.randomUUID();
  event.respondWith(handleRequest(event, requestId));
})

/**
 * 进阶- 缓存策略和高级功能
 * 1 高级缓存策略
 * - 缓存优先 (Cache First)
 *   适用于不常变化的静态资源（如图片、CSS、JS）。
 *    if (response) {
          return response; // 有缓存，直接返回
        }
      没有缓存，去网络获取

 * - 网络优先 (Network First)
    适用于需要最新数据的请求（如 API 调用）
  - 仅网络 (Network Only)
    适用于必须实时获取的数据（如支付请求）。
  - 仅缓存 (Cache Only)
    适用于那些你确定已预缓存的资源。

  - stale-while-revalidate (SWR)
    一个非常强大的策略：立即返回缓存内容（即使已过期），同时在后台更新缓存，用于下一次请求

    返回缓存的响应（如果存在），否则等待网络
      return cachedResponse || fetchPromise;
 */


function sendToClient(client, message, transferrables = []) {

  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error);
      }

      resolve(event.data);
    };

    client.postMessage(message, [channel.port2, ...transferrables.filter(Boolean)]);
  })
}

async function handleRequest(event, requestId) {
  const client = await resolveMainClient(event);
  const response = await getResponse(event, client, requestId);

  // Send back the response clone for the "response:*" life-cycle events.
  // Ensure MSW is active and ready to handle the message, otherwise
  // this message will pend indefinitely.
  if (client && activeClientIds.has(client.id)) {
    ; (async function () {
      const responseClone = response.clone();

      sendToClient(client,
        {
          type: 'RESPONSE',
          payload: {
            requestId,
            isMockedResponse: IS_MOCKED_RESPONSE in response,
            type: responseClone.type,
            status: responseClone.status,
            statusText: responseClone.statusText,
            headers: Object.fromEntries(responseClone.headers.entries()),
            body: responseClone.body,
          }
        },
        [responseClone.body]
      );
    })()
  }

  return response;
}

async function resolveMainClient(event) {
  const client = await self.clients.get(event.clientId);

  if (activeClientIds.has(event.clientId)) {
    return client
  }

  // "top-level", "nested", "none"
  if (client?.frameType === 'top-level') {
    return client
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  });

  return allClients
    .filter((client) => client.visibilityState === 'visible')
    .find((client) => activeClientIds.has(client.id));
}

async function getResponse(event, client, requestId) {
  const { request } = event;

  // Clone the request because it might've been already used
  // (i.e. its body has been read and sent to the client).
  const requestClone = request.clone();

  function passthrough() {
    // Cast the request headers to a new Headers instance
    // so the headers can be manipulated with.
    const headers = new Headers(requestClone.headers);

    // Remove the "accept" header value that marked this request as passthrough.
    // This prevents request alteration and also keeps it compliant with the
    // user-defined CORS policies.
    headers.delete('accept', 'msw/passthrough');

    // Bypass initial page load requests (i.e. static assets).
    // The absence of the immediate/parent client in the map of the active clients
    // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
    // and is not ready to handle requests.
    return fetch(requestClone, { headers });
  }

  // Bypass mocking when the client is not active.
  if (!client) {
    return passthrough();
  }

  if (!activeClientIds.has(client.id)) {
    return passthrough();
  }

  // Notify the client that a request has been intercepted.
  const requestBuffer = await request.arrayBuffer();
  const clientMessage = await sendToClient(
    client,
    {
      type: 'REQUEST',
      payload: {
        id: requestId,
        url: request.url,
        mode: request.mode,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        cache: request.cache,
        credentials: request.credentials,
        destination: request.destination,
        integrity: request.integrity,
        referrer: request.referrer,
        redirect: request.redirect,
        referrerPolicy: request.referrerPolicy,
        body: requestBuffer,
        keepalive: request.keepalive,
      }
    },
    [requestBuffer]
  )


  switch (clientMessage.type) {
    case 'MOCK_RESPONSE': {
      return responseWithMock(clientMessage.data);
    }

    case 'PASSTHROUGH': {
      return passthrough();
    }
  }

  return passthrough();
}

async function responseWithMock(response) {
  // Setting response status code to 0 is a no-op.
  // However, when responding with a "Response.error()", the produced Response
  // instance will have status code set to 0. Since it's not possible to create
  // a Response instance with status code 0, handle that use-case separately.
  if (response.status === 0) {
    return Response.error();
  }

  const mockedResponse = new Response(response.body, response);

  Reflect.defineProperty(mockedResponse, IS_MOCKED_RESPONSE, {
    value: true,
    enumerable: true,
  })

  return mockedResponse;
}


/**
 * 第三部分：精通-性能优化与最佳实践
 * 1. 使用 Workbox
 *  手动管理缓存非常复杂且容易出错。 强烈推荐使用 Workbox
    * // sw.js
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

    workbox.setConfig({
      debug: false, // 生产环境设为 false
    });

    // 预缓存
    workbox.precaching.precacheAndRoute([
      {url: '/index.html', revision: 'v1'},
      {url: '/styles/main.css', revision: 'v1'},
      // ... 其他资源
    ]);

    // 对图片使用缓存优先策略
    workbox.routing.registerRoute(
      ({request}) => request.destination === 'image',
      new workbox.strategies.CacheFirst({
        cacheName: 'images',
      })
    );

    // 对 API 请求使用网络优先策略
    workbox.routing.registerRoute(
      ({url}) => url.pathname.startsWith('/api/'),
      new workbox.strategies.NetworkFirst({
        cacheName: 'api-cache',
      })
    );

    // 对 CSS 和 JS 使用 Stale-While-Revalidate 策略
    workbox.routing.registerRoute(
      ({request}) => request.destination === 'style' || request.destination === 'script',
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
      })
    );


    2. 性能优化技巧
      a. 仅缓存必要资源：过度缓存会占用用户磁盘空间，并减慢安装过程。
      b. 版本化缓存：每次更新资源或 SW 逻辑时，都要更改
      c. 除了预缓存，还可以在 fetch 事件中动态缓存不重要的资源（如用户访问过的页面图片)
      d. 使用 clients.claim()：在 activate 事件中调用，可以让 Service Worker 在激活后立即控制所有客户端（页面），而不用等下次页面加载
        self.addEventListener('activate', event => {
          event.waitUntil(clients.claim());
        });
 */

// /* eslint-disable */
// /* tslint:disable */

// /**
//  * Mock Service Worker.
//  * @see https://github.com/mswjs/msw
//  * - Please do NOT modify this file.
//  * - Please do NOT serve this file on production.
//  */

// const PACKAGE_VERSION = '2.6.4'
// const INTEGRITY_CHECKSUM = 'ca7800994cc8bfb5eb961e037c877074'
// const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
// const activeClientIds = new Set()

// self.addEventListener('install', function () {
//   self.skipWaiting()
// })

// self.addEventListener('activate', function (event) {
//   event.waitUntil(self.clients.claim())
// })

// self.addEventListener('message', async function (event) {
//   const clientId = event.source.id

//   if (!clientId || !self.clients) {
//     return
//   }

//   const client = await self.clients.get(clientId)

//   if (!client) {
//     return
//   }

//   const allClients = await self.clients.matchAll({
//     type: 'window',
//   })

//   switch (event.data) {
//     case 'KEEPALIVE_REQUEST': {
//       sendToClient(client, {
//         type: 'KEEPALIVE_RESPONSE',
//       })
//       break
//     }

//     case 'INTEGRITY_CHECK_REQUEST': {
//       sendToClient(client, {
//         type: 'INTEGRITY_CHECK_RESPONSE',
//         payload: {
//           packageVersion: PACKAGE_VERSION,
//           checksum: INTEGRITY_CHECKSUM,
//         },
//       })
//       break
//     }

//     case 'MOCK_ACTIVATE': {
//       activeClientIds.add(clientId)

//       sendToClient(client, {
//         type: 'MOCKING_ENABLED',
//         payload: {
//           client: {
//             id: client.id,
//             frameType: client.frameType,
//           },
//         },
//       })
//       break
//     }

//     case 'MOCK_DEACTIVATE': {
//       activeClientIds.delete(clientId)
//       break
//     }

//     case 'CLIENT_CLOSED': {
//       activeClientIds.delete(clientId)

//       const remainingClients = allClients.filter((client) => {
//         return client.id !== clientId
//       })

//       // Unregister itself when there are no more clients
//       if (remainingClients.length === 0) {
//         self.registration.unregister()
//       }

//       break
//     }
//   }
// })

// self.addEventListener('fetch', function (event) {
//   const { request } = event

//   // Bypass navigation requests.
//   if (request.mode === 'navigate') {
//     return
//   }

//   // Opening the DevTools triggers the "only-if-cached" request
//   // that cannot be handled by the worker. Bypass such requests.
//   if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
//     return
//   }

//   // Bypass all requests when there are no active clients.
//   // Prevents the self-unregistered worked from handling requests
//   // after it's been deleted (still remains active until the next reload).
//   if (activeClientIds.size === 0) {
//     return
//   }

//   // Generate unique request ID.
//   const requestId = crypto.randomUUID()
//   event.respondWith(handleRequest(event, requestId))
// })

// async function handleRequest(event, requestId) {
//   const client = await resolveMainClient(event)
//   const response = await getResponse(event, client, requestId)

//   // Send back the response clone for the "response:*" life-cycle events.
//   // Ensure MSW is active and ready to handle the message, otherwise
//   // this message will pend indefinitely.
//   if (client && activeClientIds.has(client.id)) {
//     ; (async function () {
//       const responseClone = response.clone()

//       sendToClient(
//         client,
//         {
//           type: 'RESPONSE',
//           payload: {
//             requestId,
//             isMockedResponse: IS_MOCKED_RESPONSE in response,
//             type: responseClone.type,
//             status: responseClone.status,
//             statusText: responseClone.statusText,
//             body: responseClone.body,
//             headers: Object.fromEntries(responseClone.headers.entries()),
//           },
//         },
//         [responseClone.body],
//       )
//     })()
//   }

//   return response
// }

// // Resolve the main client for the given event.
// // Client that issues a request doesn't necessarily equal the client
// // that registered the worker. It's with the latter the worker should
// // communicate with during the response resolving phase.
// async function resolveMainClient(event) {
//   const client = await self.clients.get(event.clientId)

//   if (activeClientIds.has(event.clientId)) {
//     return client
//   }

//   if (client?.frameType === 'top-level') {
//     return client
//   }

//   const allClients = await self.clients.matchAll({
//     type: 'window',
//   })

//   return allClients
//     .filter((client) => {
//       // Get only those clients that are currently visible.
//       return client.visibilityState === 'visible'
//     })
//     .find((client) => {
//       // Find the client ID that's recorded in the
//       // set of clients that have registered the worker.
//       return activeClientIds.has(client.id)
//     })
// }

// async function getResponse(event, client, requestId) {
//   const { request } = event

//   // Clone the request because it might've been already used
//   // (i.e. its body has been read and sent to the client).
//   const requestClone = request.clone()

//   function passthrough() {
//     // Cast the request headers to a new Headers instance
//     // so the headers can be manipulated with.
//     const headers = new Headers(requestClone.headers)

//     // Remove the "accept" header value that marked this request as passthrough.
//     // This prevents request alteration and also keeps it compliant with the
//     // user-defined CORS policies.
//     headers.delete('accept', 'msw/passthrough')

//     return fetch(requestClone, { headers })
//   }

//   // Bypass mocking when the client is not active.
//   if (!client) {
//     return passthrough()
//   }

//   // Bypass initial page load requests (i.e. static assets).
//   // The absence of the immediate/parent client in the map of the active clients
//   // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
//   // and is not ready to handle requests.
//   if (!activeClientIds.has(client.id)) {
//     return passthrough()
//   }

//   // Notify the client that a request has been intercepted.
//   const requestBuffer = await request.arrayBuffer()
//   const clientMessage = await sendToClient(
//     client,
//     {
//       type: 'REQUEST',
//       payload: {
//         id: requestId,
//         url: request.url,
//         mode: request.mode,
//         method: request.method,
//         headers: Object.fromEntries(request.headers.entries()),
//         cache: request.cache,
//         credentials: request.credentials,
//         destination: request.destination,
//         integrity: request.integrity,
//         redirect: request.redirect,
//         referrer: request.referrer,
//         referrerPolicy: request.referrerPolicy,
//         body: requestBuffer,
//         keepalive: request.keepalive,
//       },
//     },
//     [requestBuffer],
//   )

//   switch (clientMessage.type) {
//     case 'MOCK_RESPONSE': {
//       return respondWithMock(clientMessage.data)
//     }

//     case 'PASSTHROUGH': {
//       return passthrough()
//     }
//   }

//   return passthrough()
// }

// function sendToClient(client, message, transferrables = []) {
//   return new Promise((resolve, reject) => {
//     const channel = new MessageChannel()

//     channel.port1.onmessage = (event) => {
//       if (event.data && event.data.error) {
//         return reject(event.data.error)
//       }

//       resolve(event.data)
//     }

//     client.postMessage(
//       message,
//       [channel.port2].concat(transferrables.filter(Boolean)),
//     )
//   })
// }

// async function respondWithMock(response) {
//   // Setting response status code to 0 is a no-op.
//   // However, when responding with a "Response.error()", the produced Response
//   // instance will have status code set to 0. Since it's not possible to create
//   // a Response instance with status code 0, handle that use-case separately.
//   if (response.status === 0) {
//     return Response.error()
//   }

//   const mockedResponse = new Response(response.body, response)

//   Reflect.defineProperty(mockedResponse, IS_MOCKED_RESPONSE, {
//     value: true,
//     enumerable: true,
//   })

//   return mockedResponse
// }
