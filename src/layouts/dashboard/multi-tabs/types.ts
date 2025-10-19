import type {ReactNode} from 'react';

export type KeepAliveTab = {
  children: ReactNode;
  timestamp?: string;
};

export type MultiTabsContextType = {
  tabs: KeepAliveTab[];
  activeTabRoutePath?: string;
  setTabs: (tabs: KeepAliveTab[]) => void;
  closeTab: (path?: string) => void;
  closeOthersTab: (path?: string) => void;
  closeAll: () => void;
  closeLeft: (path?: string) => void;
  closeRight: (path?: string) => void;
  refreshTab: (path: string) => void;
};
