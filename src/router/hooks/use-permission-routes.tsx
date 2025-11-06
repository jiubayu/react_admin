import {Suspense, useMemo, lazy} from 'react';
import {getRoutesFromModules} from '../utils';
import {useUserPermission} from '@/store/userStore';
import {flattenTrees} from '@/utils/tree';
import type {Permission} from '#/entity';
import type {AppRouteObject} from '#/router';
import {BasicStatus, PermissionType} from '#/enum';
import {Navigate, Outlet} from 'react-router';
import {CircleLoading} from '@/components/loading';
import {ENTITY_PATH, PAGES} from '@/consts/route';
import {Tag} from 'antd';
import {Iconify} from '@/components/icon';
import {isEmpty} from 'ramda';

// 动态导入组件

const loadComponentFromPath = (path: string) => PAGES[ENTITY_PATH + path];

// # 权限路由模式 permission | module
// VITE_APP_ROUTER_MODE=permission
const RouteMode = import.meta.env.VITE_APP_ROUTER_MODE;

export function usePermissionRoutes() {
  if (RouteMode === 'module') {
    // 从modules中动态过去路由
    return getRoutesFromModules();
  }

  const permissions = useUserPermission();
  // console.log("🚀 ~ usePermissionRoutes ~ permissions:", permissions)
  return useMemo(() => {
    if (!permissions) return [];

    const flattenPermissions = flattenTrees(permissions);
    return transformPermissionsToRoutes(permissions, flattenPermissions);
  }, [permissions]);
}

function transformPermissionsToRoutes(
  permissions: Permission[],
  flattenedPermissions: Permission[] = []
): AppRouteObject[] {
  return permissions.map((permission) => {
    if (permission.type === PermissionType.CATALOGUE) {
      return createCatalogueRoute(permission, flattenedPermissions);
    }

    return createMenuRoute(permission, flattenedPermissions);
  });
}

function createMenuRoute(
  permission: Permission,
  flattenedPermissions: Permission[]
): AppRouteObject {
  const baseRoute = createBaseRoute(
    permission,
    buildCompleteRoute(permission, flattenedPermissions)
  );

  if (permission.component) {
    const Element = lazy(loadComponentFromPath(permission.component) as any);

    if (permission.frameSrc) {
      baseRoute.element = <Element src={permission.frameSrc} />;
    } else {
      baseRoute.element = (
        <Suspense fallback={<CircleLoading />}>
          <Element />
        </Suspense>
      );
    }
  }

  return baseRoute;
}

function createCatalogueRoute(
  permission: Permission,
  flattenedPermissions: Permission[]
): AppRouteObject {
  const baseRoute = createBaseRoute(
    permission,
    buildCompleteRoute(permission, flattenedPermissions)
  );

  if (baseRoute.meta) {
    baseRoute.meta.hideTab = true;
  }

  const {parentId, children = []} = permission;
  if (!parentId) {
    baseRoute.element = (
      <Suspense fallback={<CircleLoading />}>
        <Outlet />
      </Suspense>
    );
  }

  //递归处理children 子路由
  baseRoute.children = transformPermissionsToRoutes(
    children,
    flattenedPermissions
  );

  if (!isEmpty(children)) {
    baseRoute.children.unshift({
      index: true,
      element: <Navigate to={children[0].route} replace />,
    });
  }

  return baseRoute;
}

// route transformers
function createBaseRoute(
  permission: Permission,
  completeRoute: string
): AppRouteObject {
  const {
    route,
    label,
    icon,
    order,
    hide,
    hideTab,
    status,
    frameSrc,
    newFeature,
  } = permission;

  const baseRoute: AppRouteObject = {
    path: route,
    meta: {
      label,
      key: completeRoute,
      hideMenu: !!hide,
      hideTab,
      disabled: status === BasicStatus.DISABLE,
    },
  };

  if (order) baseRoute.order = order;
  if (baseRoute.meta) {
    if (icon) baseRoute.meta.icon = icon;
    if (frameSrc) baseRoute.meta.frameSrc = frameSrc;
    if (newFeature) baseRoute.meta.suffix = <NewFeatureTag />;
  }

  return baseRoute;
}

// Components
function NewFeatureTag() {
  return (
    <Tag color='cyan' className='!ml-2'>
      <div className='flex items-center gap-1'>
        <Iconify icon='solar:bell-bing-bold-duotone' size={12} />
        <span className='ms-1'>NEW</span>
      </div>
    </Tag>
  );
}

/**
 * Build complete route path by traversing from current permission to root
 * @param permission current permission
 * @param flattenedPermissions  flattened permission array
 * @param segments route segments accumulator
 * @returns normalized complete route path
 */
function buildCompleteRoute(
  permission: Permission,
  flattenedPermissions: Permission[],
  segments: string[] = []
): string {
  // add current route segment
  segments.unshift(permission.route);

  if (!permission.parentId) {
    return '/' + segments.join('/');
  }

  // find parent and continue recursion
  const parent = flattenedPermissions.find((p) => p.id === permission.parentId);
  if (!parent) {
    console.warn(`Parent permission not found for ID: ${permission.parentId}`);
    return '/' + segments.join('/');
  }

  return buildCompleteRoute(parent, flattenedPermissions, segments);
}
