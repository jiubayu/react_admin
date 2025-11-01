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

self.addEventListener('message', async function (event) {
  const clientId = event.source.id;

  if (!clientId || !self.clients) return;

  const client = await self.clients.get(clientId);

  if (!client) return;

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
        type: 'INTEGRITY_CHECK_REQUEST',
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

  const requestId = crypto.randomUUID();
  event.respondWith(handleRequest(event, requestId));
})

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

      sendToClient(client, {
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

    return response;
  }
}

async function resolveMainClient(event) {
  const client = await self.clients.get(event.clientId);
}


