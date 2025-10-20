import {useCallback, type Dispatch, type SetStateAction} from 'react';
import type {KeepAliveTab} from '../types';
import {useRouter} from '@/router/hooks';
import {HOMEPAGE} from '@/consts/global';

export function useTabOperations(
  tabs: KeepAliveTab[],
  setTabs: Dispatch<SetStateAction<KeepAliveTab[]>>,
  activeTabRoutePath: string
) {
  const {push} = useRouter();

  const closeTab = useCallback(
    (path = activeTabRoutePath) => {
      const tempTabs = [...tabs];
      if (tempTabs.length === 1) return;

      const deleteTabIndex = tempTabs.findIndex((tab) => tab.key === path);
      if (deleteTabIndex === -1) return;

      // 删除当前的tab页面
      if (deleteTabIndex === 0) {
        // push(1);
        push(tempTabs[deleteTabIndex + 1].key);
      } else {
        push(tempTabs[deleteTabIndex - 1].key);
      }

      tempTabs.splice(deleteTabIndex, 1);
      setTabs(tempTabs);
    },
    [tabs, setTabs, activeTabRoutePath, push]
  );

  const closeAll = useCallback(() => {
    setTabs([]);
    push(HOMEPAGE);
  }, [push, setTabs]);

  const closeOthersTab = useCallback(
    (path = activeTabRoutePath) => {
      setTabs((prev) => prev.filter((tab) => tab.key === path));
      if (path === activeTabRoutePath) push(path);
    },
    [setTabs, activeTabRoutePath, push]
  );

  const closeLeft = useCallback(
    (path: string) => {
      const currentTabIndex = tabs.findIndex((tab) => tab.key === path);
      const newTabs = tabs.slice(0, currentTabIndex + 1);
      setTabs(newTabs);
      push(path);
    },
    [tabs, setTabs, push]
  );

  const closeRight = useCallback(
    (path: string) => {
      const currentTabIndex = tabs.findIndex((tab) => tab.key === path);
      const newTabs = tabs.slice(currentTabIndex);
      setTabs(newTabs);
      push(path);
    },
    [tabs, setTabs, push]
  );

  const refreshTab = useCallback(
    (path = activeTabRoutePath) => {
      setTabs((prev) => {
        const newTabs = [...prev];
        let refreshTab = newTabs.find((tab) => tab.key === path);
        if (refreshTab) {
          refreshTab = {
            ...refreshTab,
            timestamp: new Date().getTime().toString(),
          };
        }
        return newTabs;
      });
    },
    [setTabs, activeTabRoutePath]
  );

  return {
    closeTab,
    closeOthersTab,
    closeAll,
    closeLeft,
    closeRight,
    refreshTab,
  };
}
