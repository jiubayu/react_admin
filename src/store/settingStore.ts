import {StorageEnum, ThemeColorPresets, ThemeLayout, ThemeMode} from '#/enum';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type SettingsType = {
  themeColorPresets: ThemeColorPresets;
  themeMode: ThemeMode;
  themeLayout: ThemeLayout;
  themeStretch: boolean;
  breadCrumb: boolean;
  multiTab: boolean;
  darkSidebar: boolean;
  fontFamily: string;
  fontSize: number;
  direction: 'ltr' | 'rtl';
};

type SettingStore = {
  settings: SettingsType;
  // 使用 actions 命名空间来存放所有的action
  actions: {
    setSettings: (settings: SettingsType) => void;
    clearSettings: () => void;
  };
};

const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      settings: {
        themeColorPresets: ThemeColorPresets.Default,
        themeMode: ThemeMode.Light,
        themeLayout: ThemeLayout.Vertical,
        themeStretch: false,
        breadCrumb: true,
        multiTab: true,
        darkSidebar: false,
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        direction: 'ltr',
      },
      actions: {
        setSettings: (settings) => set({settings}),
        clearSettings() {
          useSettingStore.persist.clearStorage();
        },
      },
    }),
    {
      name: StorageEnum.Settings, // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      // Enables you to pick some of the state's fields to be stored in the storage.
      // 使您能够选择一些要存储在存储中的状态字段
      partialize: (state) => ({
        [StorageEnum.Settings]: state.settings,
      }),
    }
  )
);

export const useSettings = () => useSettingStore((state) => state.settings);
export const useSettingActions = () => useSettingStore((state) => state.actions);


