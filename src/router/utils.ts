import type {AppRouteObject, RouteMeta} from '#/router';
import {ascend} from 'ramda';

/**
 * return menu routes
 */
export const menuFilter = (items: AppRouteObject[]) => {
  return items
    .filter((item) => {
      const show = item.meta?.key;
      if (show && item.children) {
        item.children = menuFilter(item.children);
      }
      return show;
    })
    .sort(ascend((item) => item.order || Number.POSITIVE_INFINITY)); //ascend 由返回值可与 < 和 > 比较的函数，创建一个升序比较函数。
};

/**
 * 基于 src/router/routes/modules 文件结构动态生成路由
 */
export function getRoutesFromModules() {
  const menuModules: AppRouteObject[] = [];
  /**
   * import.meta 是 JavaScript 模块系统中的一个特殊对象，它提供了关于当前模块的元数据信息
   * import.meta.url: 返回当前模块的 URL
   * import.meta.resolve(类似 require.resolve) 动态获取模块的绝对位置而不导入
   * import.meta.env 获取配置环境变量。
   * import.meta.glob 自动化导入目录下的所有模块，实现代码分割和懒加载
   */
  const modules = import.meta.glob('./routes/modules/**/*.tsx', {
    eager: true,
  });

  Object.keys(modules).forEach((key) => {
    const mod = (modules as any)[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    menuModules.push(...modList);
  });
  console.log('🚀 ~ getRoutesFromModules ~ menuModules:', menuModules);
  return menuModules;
}

/**
 * return the routes will be used in sidebar menu
 */
export function getMenuRoutes(appRouteObject: AppRouteObject[]) {
  return menuFilter(appRouteObject);
}

/**
 * return flatten routes
 * 1 全部排平 用push+扩展运算符
 * 1 depth控制 concat 处理
 */
export function flattenMenuRoutes(routes: AppRouteObject[]) {
  return routes.reduce<RouteMeta[]>((prev, item) => {
    const {meta, children} = item;
    if (meta) prev.push(meta);
    if (children) prev.push(...flattenMenuRoutes(children));
    return prev;
  }, []);
}
