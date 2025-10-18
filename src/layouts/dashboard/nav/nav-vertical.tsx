import { Layout, theme } from "antd";
import { useMemo, useState } from "react";
import { NAV_WIDTH } from '../config';
import { useSettings } from "@/store/settingStore";
import { ThemeMode } from "#/enum";

// 侧边栏
const { Sider } = Layout;

function NavVertical() {
  const [collapsed, setCollapsed] = useState(false);
  const settings = useSettings();
  const {themeLayout, themeMode, darkSidebar} = settings;

  const sidebarTheme = useMemo(() => {
    if (themeMode === ThemeMode.Dark) {
      return darkSidebar ? 'light' : 'dark';
    } 
    return darkSidebar ? 'dark' : 'light';
  }, [themeMode, darkSidebar]);

  return <Sider trigger={null} collapsible collapsed={collapsed} width={NAV_WIDTH} theme={sidebarTheme}></Sider>;
}

export default NavVertical;