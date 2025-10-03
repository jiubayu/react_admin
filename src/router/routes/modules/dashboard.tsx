import type {AppRouteObject} from '#/router';
import {SvgIcon} from '@/components/icon';
import {CircleLoading} from '@/components/loading';
import {lazy, Suspense} from 'react';
import {Navigate, Outlet} from 'react-router';

const HomePage = lazy(() => import('@/pages/dashboard/workbench'));
const Analysis = lazy(() => import('@/pages/dashboard/analysis'));

export const dashboard: AppRouteObject = {
  order: 1,
  path: 'dashboard',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  // 为路由定义额外信息的机制，例如页面标题、图标、权限等
  meta: {
    label: 'sys.menu.dashboard',
    icon: (
      <SvgIcon icon='ic-analysis' className='ant-menu-item-icon' size='24' />
    ),
    key: '/dashboard',
  },
  children: [
    {
      index: true,
      element: <Navigate to='workbench' replace />,
    },
    {
      path: 'workbench',
      element: <HomePage />,
      meta: {label: 'sys.menu.workbench', key: '/dashboard/workbench'},
    },
    {
      path: 'analysis',
      element: <Analysis />,
      meta: {label: 'sys.menu.analysis', key: '/dashboard/analysis'},
    },
  ],
};
