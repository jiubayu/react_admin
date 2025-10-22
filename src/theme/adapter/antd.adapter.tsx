import {App, ConfigProvider, theme} from 'antd';
import type {ThemeConfig} from 'antd/lib';
import {StyleProvider} from '@ant-design/cssinjs';
import {removePx} from '@/utils/theme';
import useLocale from '@/locales/useLocale';

import {useSettings} from '@/store/settingStore';
import {baseThemeTokens} from '../tokens/base';
import {ThemeMode} from '#/enum';
import {
  darkColorTokens,
  lightColorTokens,
  presetsColors,
} from '../tokens/color';
import {darkShadowTokens, lightShadowTokens} from '../tokens/shadow';

import type {UILibraryAdapter} from '../type';

export const AntdAdapter: UILibraryAdapter = ({mode, children}) => {
  const {language} = useLocale();
  const {themeColorPresets, fontSize, fontFamily} = useSettings();
  const algorithm =
    mode === ThemeMode.Light ? theme.defaultAlgorithm : theme.darkAlgorithm;

  const colorToken =
    mode === ThemeMode.Light ? lightColorTokens : darkColorTokens;
  const shadowToken =
    mode === ThemeMode.Light ? lightShadowTokens : darkShadowTokens;

  const primaryColorToken = presetsColors[themeColorPresets];

  const token: ThemeConfig['token'] = {
    colorPrimary: primaryColorToken.default,
    colorSuccess: colorToken.palette.success.default,
    colorWarning: colorToken.palette.warning.default,
    colorError: colorToken.palette.error.default,
    colorInfo: colorToken.palette.info.default,

    colorBgLayout: colorToken.background.default,
    colorBgContainer: colorToken.background.default,
    colorBgElevated: colorToken.background.paper,

    wireframe: false,
    fontFamily: fontFamily,
    fontSize: fontSize,

    borderRadiusSM: removePx(baseThemeTokens.borderRadius.sm),
    borderRadius: removePx(baseThemeTokens.borderRadius.default),
    borderRadiusLG: removePx(baseThemeTokens.borderRadius.lg),
  };

  const components: ThemeConfig['components'] = {
    Breadcrumb: {
      separatorMargin: removePx(baseThemeTokens.spacing[1]),
    },
    Menu: {
      colorFillAlter: 'transparent',
      itemColor: colorToken.text.secondary,
      motionDurationMid: '0.125s',
      motionDurationSlow: '0.200s',
      darkItemBg: colorToken.background.neutral,
    },
    Layout: {
      siderBg: darkColorTokens.background.default,
    },
    Card: {
      boxShadow: shadowToken.card,
    },
  };

  return (
    <ConfigProvider
      locale={language.antdLocal}
      theme={{algorithm, token, components}}
      tag={{
        style: {
          borderRadius: removePx(baseThemeTokens.borderRadius.md),
          fontWeight: 700,
          padding: `0 ${baseThemeTokens.spacing[1]}`,
          margin: `0 ${baseThemeTokens.spacing[1]}`,
          borderWidth: 0,
        },
      }}
    >
      <StyleProvider hashPriority="high">
        <App>{children}</App>
      </StyleProvider>
    </ConfigProvider>
  );
};
