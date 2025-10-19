import {createContext} from 'react';
import type {MultiTabsContextType} from '../types';

const multiTabsContext = createContext<MultiTabsContextType>({
  tabs: [],
  activeTabRoutePath: '',
  setTabs: () => {},
  closeTab: () => {},
  closeOthersTab: () => {},
  closeAll: () => {},
  closeLeft: () => {},
  closeRight: () => {},
  refreshTab: () => {},
});

export function MultiTabsProvider({children}: {children: React.ReactNode}) {}
