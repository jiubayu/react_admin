import { breakpointsTokens } from "@/theme/tokens/breakpoints";
import { useEffect, useState } from "react";
import { removePx } from '@/utils/theme';

interface MediaQueryConfig {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;

  orientation?: 'landscape' | 'portrait'; // 横竖屏 portrait: 竖屏 landscape: 横屏
  prefersColorScheme?: 'dark' | 'light'; // dark: 深色模式 light: 浅色模式
  prefersReducedMotion?: boolean; // reduce: 减速模式 no-preference: 不偏好
  devicePixelRatio?: number; //
  pointerType?: 'coarse' | 'fine'; // coarse: 粗略的 fine: 精细的
}

const buildMediaQuery = (config: MediaQueryConfig | string) => {
  if (typeof config === 'string') return config;

  const conditions: string[] = [];

  if (config.minWidth) conditions.push(`(min-width: ${config.minWidth}px)`);
  if (config.maxWidth) conditions.push(`(max-width: ${config.maxWidth}px)`);
  if (config.minHeight) conditions.push(`(min-height: ${config.minHeight}px)`);
  if (config.maxHeight) conditions.push(`(max-height: ${config.maxHeight}px)`);

  if (config.orientation)
    conditions.push(`(orientation: ${config.orientation})`);
  if (config.prefersColorScheme)
    conditions.push(`(prefers-color-scheme: ${config.prefersColorScheme})`);
  if (config.prefersReducedMotion)
    conditions.push('(prefers-reduced-motion: reduce)');
  if (config.devicePixelRatio)
    conditions.push(
      `(-webkit-min-device-pixel-ratio: ${config.devicePixelRatio})`
    );
  if (config.pointerType) conditions.push(`(pointer: ${config.pointerType})`);

  return conditions.join(' and ');
};

/**
 * React hooks for handling media queries
 * 
 * @param config Media query configuration object for query string
 * @returns boolean: Return true if the media query is matched
 * 
 *  @example
 *  Basic usage - Mobile detection
 *  const isMobile = useMediaQuery({ maxWidth: 768 });
 * 
 *  * @example
 *  Using predefined breakpoints
 *  const isDesktop = useMediaQuery(up('lg'));
 * 
 *  @example
 *  Complex query - Tablet in landscape mode
 *  const isTabletLandscape = useMediaQuery({
 *    minWidth: 768,
 *    maxWidth: 1024,
 *    orientation: 'landscape'
 *  });
 * 
 *  @example
 *  User preferences
 *  const isDarkMode = useMediaQuery({ prefersColorScheme: 'dark' });
 *  const prefersReducedMotion = useMediaQuery({ prefersReducedMotion: true });
 * 
 *  @example
 *  Device capabilities
 *  const isTouchDevice = useMediaQuery({ pointerType: 'coarse' });
 *  const isRetina = useMediaQuery({ devicePixelRatio: 2 });
 * 
 *  @example
 *  Range queries using helpers
 *  const isTablet = useMediaQuery(between('sm', 'md'));
 * 
 *  @example
 *  Raw media query string
 *  const isPortrait = useMediaQuery('(orientation: portrait)');
 * 
 *  @see {@link MediaQueryConfig} for all supported configuration options
 */
export const useMediaQuery = (config: MediaQueryConfig | string):boolean => {
  // 服务端渲染时默认为false
  const [matches, setMatches] = useState(false);

  // 将config转换成media query字符串
  const mediaQueryString = buildMediaQuery(config);

  useEffect(() => {
    // matchMedia 指定的媒体查询字符串解析后的结果
    // 返回的 MediaQueryList 可被用于判定 Document 是否匹配媒体查询
    const mediaQuery = window.matchMedia(mediaQueryString);
    setMatches(mediaQuery.matches);

    // 如果你需要始终了解 document 是否与媒体查询匹配，则可以查看将要传递给对象的change 事件。
    // 监听媒体查询的变化
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // 使用新旧两种两种API，以确保最大的兼容性
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    // 清理函数
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [mediaQueryString]);

  return matches;
};


type Breakpoints = typeof breakpointsTokens;
type BreakpointsKeys = keyof Breakpoints;

// 辅助函数
export const up = (key: BreakpointsKeys) => ({
  minWidth: removePx(breakpointsTokens[key]),
});

export const down = (key: BreakpointsKeys) => ({
  maxWidth: removePx(breakpointsTokens[key]) - 0.05, // 减去0.05px 避免断点重叠
});

export const between = (start: BreakpointsKeys, end: BreakpointsKeys) => ({
  minWidth: removePx(breakpointsTokens[start]),
  maxWidth: removePx(breakpointsTokens[end]) - 0.05,
});