import type {AppRouteObject} from '#/router';
import {Iconify} from '@/components/icon';
import {CircleLoading} from '@/components/loading';
import ToastPage from '@/pages/components/toast';
import ScrollPage from '@/pages/components/scroll';
import {lazy, Suspense} from 'react';
import {
  Navigate,
  Outlet,
  type ShouldRevalidateFunctionArgs,
} from 'react-router';

// lazy 大多数属性都可以懒加载导入，以减少初始包的大小
const AnimatePage = lazy(() => import('@/pages/components/animate'));
const EditorPage = lazy(() => import('@/pages/components/editor'));
const MarkdownPage = lazy(() => import('@/pages/components/markdown'));
const MultiLanguagePage = lazy(
  () => import('@/pages/components/multi-language')
);
const IconPage = lazy(() => import('@/pages/components/icon'));
const UploadPage = lazy(() => import('@/pages/components/upload'));
const ChartPage = lazy(() => import('@/pages/components/chart'));

const components: AppRouteObject = {
  order: 3,
  path: 'components',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  // 路由中间件在导航前后按顺序运行。这为您提供了一个统一的地方来执行诸如日志记录和身份验证之类的操作。
  // next 函数会继续向下执行链，在叶子路由上，next 函数会执行导航的加载器/操作。
  unstable_middleware: [loggingMiddleware],
  // 路由加载器在路由组件渲染之前为其提供数据
  loader: loader,
  // 路由操作允许进行服务器端数据修改，并在从 <Form>、useFetcher 和 useSubmit 调用时自动重新验证页面上的所有加载器数据。
  // action: action,

  // 加载器数据会在某些事件（如导航和表单提交）后自动重新验证。
  // 此钩子使您可以选择加入或退出默认的重新验证行为。
  shouldRevalidate: shouldRevalidate,

  meta: {
    label: 'sys.menu.components',
    icon: (
      <Iconify
        icon='solar:widget-5-bold-duotone'
        className='ant-menu-item-icon'
        size='24'
      />
    ),
    key: '/components',
  },
  children: [
    {
      index: true,
      element: <Navigate to='icon' replace />,
    },
    {
      path: 'icon',
      element: <IconPage />,
      meta: {label: 'sys.menu.icon', key: '/components/icon'},
    },
    {
      path: 'animate',
      element: <AnimatePage />,
      meta: {label: 'sys.menu.animate', key: '/components/animate'},
    },
    {
      path: 'scroll',
      element: <ScrollPage />,
      meta: {label: 'sys.menu.scroll', key: '/components/scroll'},
    },
    {
      path: 'markdown',
      element: <MarkdownPage />,
      meta: {label: 'sys.menu.markdown', key: '/components/markdown'},
    },
    {
      path: 'editor',
      element: <EditorPage />,
      meta: {label: 'sys.menu.editor', key: '/components/editor'},
    },
    {
      path: 'i18n',
      element: <MultiLanguagePage />,
      meta: {label: 'sys.menu.i18n', key: '/components/i18n'},
    },
    {
      path: 'upload',
      element: <UploadPage />,
      meta: {label: 'sys.menu.upload', key: '/components/upload'},
    },
    {
      path: 'chart',
      element: <ChartPage />,
      meta: {label: 'sys.menu.chart', key: '/components/chart'},
    },
    {
      path: 'toast',
      element: <ToastPage />,
      meta: {label: 'sys.menu.toast', key: '/components/toast'},
    },
  ],
};

export default components;

async function loggingMiddleware({request}: any, next: any) {
  const url = new URL(request.url);
  console.log(`Navigating to ${url.pathname}`);
  const start = performance.now();
  await next();
  const end = performance.now();
  console.log(`Navigation to ${url.pathname} took ${end - start} ms`);
}

function loader({params}: any) {
  return {message: params || 'hello'};
}

function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  console.log('🚀 ~ shouldRevalidate ~ arg:', arg);
  return true; // false
}
