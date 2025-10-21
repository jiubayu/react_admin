import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import type {KeepAliveTab} from '../types';
import {USER_LIST} from '@/_mock/assets';

export function useTabLabelRender() {
  const {t} = useTranslation();

  const spacialTabRenderMap = useMemo<
    Record<string, (tab: KeepAliveTab) => React.ReactNode>
  >(
    () => ({
      'sys.menu,system.user_detail': (tab: KeepAliveTab) => {
        const userId = tab.params?.id;
        const defaultLabel = t(tab.label);

        if (userId) {
          const user = USER_LIST.find((user) => user.id === userId);
          return `${user?.username} - ${defaultLabel}`;
        }

        return defaultLabel;
      },
    }),
    [t]
  );

  const renderTabLabel = (tab: KeepAliveTab) => {
    const specialRender = spacialTabRenderMap[tab.key as string];
    if (specialRender) return specialRender(tab);

    return t(tab.label);
  };

  return renderTabLabel;
}
