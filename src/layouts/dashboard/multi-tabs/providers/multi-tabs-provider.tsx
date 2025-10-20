import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import type {KeepAliveTab, MultiTabsContextType} from '../types';
import {useCurrentRouteMeta} from '@/router/hooks';
import {isEmpty} from 'ramda';
import {useTabOperations} from '../hooks/use-tab-operations';
import {replaceDynamicParams} from '@/router/hooks/use-current-route-meta';

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

export function MultiTabsProvider({children}: {children: React.ReactNode}) {
  const [tabs, setTabs] = useState<KeepAliveTab[]>([]);
  const currentRouteMeta = useCurrentRouteMeta();

  const activeTabRoutePath = useMemo(() => {
    if (!currentRouteMeta) return '';

    const {key, params = {}} = currentRouteMeta;
    return isEmpty(params) ? key : replaceDynamicParams(key, params);
  }, [currentRouteMeta]);

  const operations = useTabOperations(tabs, setTabs, activeTabRoutePath);

  useEffect(() => {
    if (!currentRouteMeta) return;

    setTabs((prev) => {
      const filtered = prev.filter((tab) => !tab.hideTab);

      let {key} = currentRouteMeta;
      const {outlet: children, params = {}} = currentRouteMeta;

      if (!isEmpty(params)) key = replaceDynamicParams(key, params);

      const isExists = filtered.find((tab) => tab.key === key);
      if (isExists) {
        return [
          ...filtered,
          {
            ...currentRouteMeta,
            key,
            children,
            timestamp: new Date().getTime().toString(),
          },
        ];
      }

      return filtered;
    });
  }, [currentRouteMeta]);

  const contextValue = useMemo(
    () => ({
      tabs,
      activeTabRoutePath,
      setTabs,
      ...operations,
    }),
    [tabs, activeTabRoutePath, operations]
  );

  return (
    <multiTabsContext.Provider value={contextValue}>
      {children}
    </multiTabsContext.Provider>
  );
}

export function useMultiTabsContext() {
  return useContext(multiTabsContext);
}
