import {Iconify} from '@/components/icon';
import {useFlattenedRoutes} from '@/router/hooks/use-flattened-routes';
import {usePermissionRoutes} from '@/router/hooks/use-permission-routes';
import {menuFilter} from '@/router/utils';
import {Breadcrumb, type BreadcrumbProps, type GetProp} from 'antd';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useMatches} from 'react-router';

type MenuItem = GetProp<BreadcrumbProps, 'items'>[number];

/**
 * 动态面包屑解决方案：https://github.com/MinjieChang/myblog/issues/29
 */
function BreadCrumb() {
  const {t} = useTranslation();
  const matches = useMatches();
  // console.log('🚀 ~ BreadCrumb ~ matches:', matches);
  const flattenedRoutes = useFlattenedRoutes();
  const permissionRoutes = usePermissionRoutes();

  const breadCrumbs = useMemo(() => {
    const menuRoutes = menuFilter(permissionRoutes);
    const paths = matches
      .filter((item) => item.pathname !== '/')
      .map((item) => item.pathname);

    const pathRouteMetaList = flattenedRoutes.filter((item) =>
      paths.includes(item.key)
    );

    let currentMenuItems = [...menuRoutes];

    return pathRouteMetaList.map((routeMeta): MenuItem => {
      const {label, key} = routeMeta;

      // find current level menu items
      const currentRoute = currentMenuItems.find(
        (item) => item.meta?.key === key
      );

      currentMenuItems =
        currentRoute?.children?.filter((item) => !item.meta?.hideMenu) ?? [];

      // items -> item[]
      // item -> href/path/title/menu
      // menu ->
      return {
        key,
        title: t(label),
        ...(currentMenuItems.length > 0 && {
          menu: {
            items: currentMenuItems.map((item) => ({
              key: item.meta?.key,
              label: item.meta?.key ? (
                <Link to={item.meta.key}>{t(item.meta.label)}</Link>
              ) : null,
            })),
          },
        }),
      };
    });
  }, [matches, flattenedRoutes, permissionRoutes, t]);

  return (
    <Breadcrumb
      items={breadCrumbs}
      className='!text-sm'
      separator={<Iconify icon='ph:dot-duotone' />}
    />
  );
}

export default BreadCrumb;
