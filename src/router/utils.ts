import type {AppRouteObject} from '#/router';
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

}