import { ThemeLayout } from "#/enum";
import { CircleLoading } from "@/pages/components/loading";
import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import { Layout } from "antd";
import { Suspense, useMemo, type CSSProperties } from "react";
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH } from "./config";
import { down, useMediaQuery } from "@/hooks";
import Header from "./header";
import Nav from "./nav";
import Main from "./main";

function DashboardLayout() {
  const { themeLayout } = useSettings();
  
  const mobileOrTablet = useMediaQuery(down('md'));

  const layoutClassName = useMemo(() => {
    return cn('flex h-screen overflow-hidden', themeLayout === ThemeLayout.Horizontal ? 'flex-col' : 'flex-row');
  }, [themeLayout])

  const innerLayoutStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    // transition: 属性 持续时间 运动函数 delay延迟时间
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    paddingLeft: mobileOrTablet 
      ? 0 
      : themeLayout === ThemeLayout.Horizontal  // 水平
        ? 0 
        : themeLayout === ThemeLayout.Mini  // 折叠
          ? NAV_COLLAPSED_WIDTH
          : NAV_WIDTH,
  };

  return (
    <Layout className={layoutClassName}>
      <Suspense fallback={<CircleLoading />}>
        <Layout style={innerLayoutStyle}>
          <Header />
          <Nav />
          <Main />
        </Layout>
      </Suspense>
    </Layout>
  );
}

export default DashboardLayout;