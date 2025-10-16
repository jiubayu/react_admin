import {useMemo} from 'react';

// # 权限路由模式 permission | module
// VITE_APP_ROUTER_MODE=permission
const RouteMode = import.meta.env.VITE_APP_ROUTER_MODE;
export function usePermissionRoutes() {
  if (RouteMode === 'module') {
    return getRoutesFromModules();
  }

  const permissions = useUserPermission();
  return useMemo(() => {
    if (!permissions) return [];

    const flattenPermissions = flattenTrees(permissions);
    return transformPermissionsToRoutes(flattenPermissions);
  }, [permissions]);
}
