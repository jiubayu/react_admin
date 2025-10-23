import {useSettings} from '@/store/settingStore';
import type {UILibraryAdapter} from './type';
import {layoutClass} from './layout.css';
import {useEffect} from 'react';
import {presetsColors} from './tokens/color';
import {hexToRgbChannel, rgbAlpha} from '@/utils/theme';
import {ThemeMode} from '#/enum';

interface ThemeProviderProps {
  children: React.ReactNode;
  adapters?: UILibraryAdapter[];
}

export function ThemeProvider({children, adapters = []}: ThemeProviderProps) {
  const {themeMode, themeColorPresets, fontSize, fontFamily} = useSettings();

  // Update HTML class to support Tailwind dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(ThemeMode.Light, ThemeMode.Dark);
    root.classList.add(themeMode);
  }, [themeMode]);

  // Dynamically update theme color related CSS variables
  useEffect(() => {
    const root = window.document.documentElement;
    const primaryColors = presetsColors[themeColorPresets];
    // 定义全部的css变量，在后续节点的css中可以通过var(--colors-palette-primary-key)来使用
    for (const [key, value] of Object.entries(primaryColors)) {
      root.style.setProperty(`--colors-palette-primary-${key}`, value);
      root.style.setProperty(
        `--colors-palette-primary-${key}Channel`,
        hexToRgbChannel(value)
      );
    }

    root.style.setProperty(
      '--shadows-primary',
      `box-shadow: 0 8px 16px 0 ${rgbAlpha(primaryColors.default, 0.24)}`
    );
  }, [themeColorPresets]);

  // Update font size and font family
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = `${fontSize}px`;

    const body = window.document.body;
    body.style.fontFamily = fontFamily;
  }, [fontSize, fontFamily]);

  const wrappedWithAdapters = adapters.reduce(
    (children, Adapter) => (
      <Adapter mode={themeMode} key={Adapter.name}>
        {children}
      </Adapter>
    ),
    children
  );

  return <div className={layoutClass}>{wrappedWithAdapters}</div>;
}
