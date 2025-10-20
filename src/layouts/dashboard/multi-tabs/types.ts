import type {RouteMeta} from '#/router';
import type {CSSProperties, ReactNode} from 'react';

export type KeepAliveTab = RouteMeta & {
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
  closeLeft: (path: string) => void;
  closeRight: (path: string) => void;
  refreshTab: (path: string) => void;
};

export type TabItemProps = {
  tab: KeepAliveTab;
  style?: CSSProperties;
  className?: string;
  onClose?: () => void;
};
