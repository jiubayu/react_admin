import type {AppRouteObject} from '#/router';
import {ErrorBoundary} from 'react-error-boundary';
import PageError from '@/pages/sys/error/PageError';
import Login from '@/pages/sys/login/Login';
import {createHashRouter, Navigate, type RouteObject} from 'react-router';
import {ERROR_ROUTE} from './routes/error-routes';
import {RouterProvider} from 'react-router-dom';
import ProtectedRoute from './components/protected-route';
import {usePermissionRoutes} from './hooks/use-permission-routes';
import DashboardLayout from '@/layouts/dashboard';

const {VITE_APP_HOMEPAGE: HOMEPAGE} = import.meta.env;

const PUBLIC_ROUTE: AppRouteObject = {
  path: '/login',
  element: (
    <ErrorBoundary FallbackComponent={PageError}>
      <Login />
    </ErrorBoundary>
  ),
};

const NO_MATCHED_ROUTE: AppRouteObject = {
  path: '*',
  element: <Navigate to='/404' replace />,
};

export default function Router() {
  const permissionRoutes = usePermissionRoutes();
  console.log('🚀 ~ Router ~ permissionRoutes:', permissionRoutes);

  const PROTECTED_ROUTE: AppRouteObject = {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    // index: true
    // 1 无路径参数：index 路由不能有 path 属性
    // 2 精确匹配：只在父路由路径被精确匹配时渲染
    // 3 唯一性：一个父路由下只能有一个 index 路由
    // 4 渲染位置：在父路由的 <Outlet /> 组件位置渲染
    children: [
      {index: true, element: <Navigate to={HOMEPAGE} replace />},
      ...permissionRoutes,
    ],
  };

  const routes = [
    PUBLIC_ROUTE,
    PROTECTED_ROUTE,
    ERROR_ROUTE,
    NO_MATCHED_ROUTE,
  ] as RouteObject[];
  // todo browserROute test
  const router = createHashRouter(routes);
  console.log('🚀 ~ Router ~ routes:', routes);

  return <RouterProvider router={router} />;
}
