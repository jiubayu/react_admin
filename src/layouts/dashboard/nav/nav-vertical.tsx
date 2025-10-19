import {Layout, Menu} from 'antd';
import {useEffect, useMemo, useState} from 'react';
import {NAV_WIDTH} from '../config';
import {useSettingActions, useSettings} from '@/store/settingStore';
import {ThemeLayout, ThemeMode} from '#/enum';
import NavLogo from './nav-logo';
import Scrollbar from '@/components/scrollbar';
import {usePermissionRoutes} from '@/router/hooks/use-permission-routes';
import {menuFilter} from '@/router/utils';
import {useRouteToMenuFn} from '@/router/hooks/use-route-to-menu';
import {useMatches, useNavigate} from 'react-router';
import {usePathname} from '@/router/hooks/use-pathname';
import type {MenuProps} from 'antd/lib';
import {useFlattenedRoutes} from '@/router/hooks/use-flattened-routes';

// 侧边栏
const {Sider} = Layout;

type Props = {
  closeSideBarDrawer?: () => void;
};
function NavVertical(props: Props) {
  const settings = useSettings();
  const {setSettings} = useSettingActions();
  const {themeLayout, themeMode, darkSidebar} = settings;

  const matches = useMatches();
  const pathname = usePathname();
  const navigate = useNavigate();

  const returnToMenuFn = useRouteToMenuFn();
  const permissionRoutes = usePermissionRoutes();

  const flattenedRoutes = useFlattenedRoutes();

  const menuList = useMemo(() => {
    const menuRoutes = menuFilter(permissionRoutes);
    return returnToMenuFn(menuRoutes);
  }, [permissionRoutes, returnToMenuFn]);

  const collapsed = useMemo(
    () => themeLayout === ThemeLayout.Mini,
    [themeLayout]
  );

  const selectedKeys = useMemo(() => [pathname], [pathname]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 首次加载时设置openKeys
  useEffect(() => {
    if (!collapsed) {
      const keys = matches
        .filter(
          (match) => match.pathname !== '/' && match.pathname !== pathname
        )
        .map((m) => m.pathname);
      setOpenKeys(keys);
    }
  }, [pathname, collapsed, matches]);

  const sidebarTheme = useMemo(() => {
    // 如果是暗黑模式，就把侧边栏变成亮色
    if (themeMode === ThemeMode.Dark) {
      return darkSidebar ? 'light' : 'dark';
    }
    return darkSidebar ? 'dark' : 'light';
  }, [themeMode, darkSidebar]);

  const handleToggleCollapsed = () => {
    setSettings({
      ...settings,
      themeLayout: collapsed ? ThemeLayout.Vertical : ThemeLayout.Mini,
    });
  };

  const handleOpenChange: MenuProps['onOpenChange'] = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const handleClick: MenuProps['onClick'] = ({key}) => {
    const nextLink = flattenedRoutes?.find((item) => item.key === key);
    // 如果是新窗口打开
    if (nextLink?.hideTab && nextLink?.frameSrc) {
      window.open(nextLink.frameSrc, '_blank');
      return;
    }

    navigate(key);
    props?.closeSideBarDrawer?.();
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={NAV_WIDTH}
      theme={sidebarTheme}
      className='!fixed left-0 top-0 h-screen border-r border-dashed border-border'
    >
      <div className='flex h-full flex-col'>
        <NavLogo collapsed={collapsed} onToggle={handleToggleCollapsed} />

        <Scrollbar>
          <Menu
            mode='inline'
            items={menuList}
            theme={sidebarTheme}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            className='!border-none'
            onClick={handleClick}
          />
        </Scrollbar>
      </div>
    </Sider>
  );
}

export default NavVertical;
