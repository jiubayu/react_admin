import {up, useMediaQuery} from '@/hooks';
import {useSettings} from '@/store/settingStore';
import {useMemo, type CSSProperties} from 'react';
import {
  HEADER_HEIGHT,
  MULTI_TABS_HEIGHT,
  NAV_COLLAPSED_WIDTH,
  NAV_HORIZONTAL_HEIGHT,
  NAV_WIDTH,
} from '../../config';
import {rgbAlpha} from '@/utils/theme';
import {themeVars} from '@/theme/theme.css';
import {ThemeLayout} from '#/enum';

export function useMultiTabsStyle() {
  const {themeLayout} = useSettings();
  const isPc = useMediaQuery(up('md'));

  return useMemo(() => {
    const style: CSSProperties = {
      position: 'fixed',
      top: HEADER_HEIGHT,
      right: 0,
      height: MULTI_TABS_HEIGHT,
      width: '100%',
      backgroundColor: rgbAlpha(
        themeVars.colors.background.defaultChannel,
        0.9
      ),
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    };

    if (themeLayout === ThemeLayout.Horizontal) {
      style.top = HEADER_HEIGHT + NAV_HORIZONTAL_HEIGHT - 2;
    } else if (isPc) {
      style.width = `calc(100% - ${
        themeLayout === ThemeLayout.Vertical ? NAV_WIDTH : NAV_COLLAPSED_WIDTH
      }px)`;
    }
    return style;
  }, [themeLayout, isPc]);
}
