import {useEffect, useState} from 'react';
import {useRouter} from './use-router';
import {useMatches, useOutlet, type Params} from 'react-router';
import {useFlattenedRoutes} from './use-flattened-routes';
import {isEmpty} from 'ramda';
import type {RouteMeta} from '#/router';
import {HOMEPAGE} from '@/consts/global';

export function useCurrentRouteMeta() {
  const {push} = useRouter();
  const matches = useMatches();

  // 获取路由组件实例
  // useOutlet 返回路由层次结构中此级别的子路由元素 由 <Outlet> 内部使用以渲染子路由。
  const children = useOutlet();
  console.log('🚀 ~ useCurrentRouteMeta ~ children:', children);

  // 获取拍平后的路由列表
  const flattenedRoutes = useFlattenedRoutes();

  const [currentRouteMeta, setCurrentRouteMeta] = useState<RouteMeta>();

  useEffect(() => {
    // 获取当前匹配的路由
    const lastRoute = matches.at(-1);
    if (!lastRoute) return;

    const {pathname, params} = lastRoute;
    const matchedRouteMeta = flattenedRoutes.find((route) => {
      const replacedKey = replaceDynamicParams(route.key, params);
      return replacedKey === pathname || replacedKey + '/' === pathname;
    });

    if (matchedRouteMeta) {
      matchedRouteMeta.outlet = children;

      if (!isEmpty(params)) {
        matchedRouteMeta.params = params;
      }

      setCurrentRouteMeta(matchedRouteMeta);
    } else {
      push(HOMEPAGE);
    }
  }, [matches, flattenedRoutes, children, push]);

  return currentRouteMeta;
}

// 动态路由匹配
export function replaceDynamicParams(menuKey: string, params: Params<string>) {
  // return key.replace(/:\w+/g, (match) => params[match.slice(1)] || '');
  let replacedPathname = menuKey;
  // 解析路由路径中的参数名称
  const paramsNames = menuKey.match(/:\w+/g);

  if (paramsNames) {
    for (const paramName of paramsNames) {
      // 去掉冒号，获取参数名称
      const paramValue = params[paramName.slice(1)];
      if (!paramValue) continue;
      replacedPathname = replacedPathname.replace(paramName, paramValue || '');
    }
  }

  return replacedPathname;
}
