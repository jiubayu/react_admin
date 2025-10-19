import {ThemeLayout} from '#/enum';
import type {AppRouteObject} from '#/router';
import {Iconify, SvgIcon} from '@/components/icon';
import {useSettings} from '@/store/settingStore';
import {cn} from '@/utils';
import type {GetProp, MenuProps} from 'antd';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

type MenuItem = GetProp<MenuProps, 'items'>[number];

const renderIcon = (icon: string | React.ReactNode): React.ReactNode => {
  if (typeof icon !== 'string') return icon;
  return icon.startsWith('ic') ? (
    <SvgIcon icon={icon} size={24} className='ant-menu-item-icon' />
  ) : (
    <Iconify icon={icon} size={24} className='ant-menu-item-icon' />
  );
};

export function useRouteToMenuFn() {
  const {t} = useTranslation();
  const {themeLayout} = useSettings();

  const routeToMenuFn = useCallback(
    (items: AppRouteObject[]): MenuItem[] => {
      return items
        .filter((item) => !item.meta?.hideMenu)
        .map((item) => {
          const {meta, children} = item;
          if (!meta) return {} as MenuItem;

          // 需要根据meta自带的key和label生成对应的菜单项
          const menuItem: MenuItem = {
            key: meta.key,
            disabled: meta.disabled,
            label: (
              // Horizontal 模式下，菜单项需要左对齐
              <div
                className={cn(
                  'inline-flex items-center overflow-hidden',
                  themeLayout === ThemeLayout.Horizontal
                    ? 'justify-start'
                    : 'justify-between'
                )}
              >
                <div className=''>{t(meta.label)}</div>
                {meta.suffix}
              </div>
            ),
            ...(meta.icon && {icon: renderIcon(meta.icon)}),
            ...(children && {children: routeToMenuFn(children)}),
          };

          return menuItem as MenuItem;
        });
    },
    [t, themeLayout]
  );

  return routeToMenuFn;
}
