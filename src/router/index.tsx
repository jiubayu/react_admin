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

  const PROTECTED_ROUTE: AppRouteObject = {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
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

  return <RouterProvider router={router} />;
}
