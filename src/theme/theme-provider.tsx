import {useSettings} from '@/store/settingStore';
import type {UILibraryAdapter} from './type';

interface ThemeProviderProps {
  children: React.ReactNode;
  adapter: UILibraryAdapter;
}

export function ThemeProvider({children, adapter}: ThemeProviderProps) {
  const {themeMode, themeColorPresets, fontSize, fontFamily} = useSettings();

  return <div className={layoutClass}></div>;
}
