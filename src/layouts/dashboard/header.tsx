import { useState, type CSSProperties } from 'react';

import {ThemeLayout} from '#/enum';
import {useSettings} from '@/store/settingStore';
import {themeVars} from '@/theme/theme.css';
import {cn} from '@/utils';
import {rgbAlpha} from '@/utils/theme';
import { HEADER_HEIGHT, NAV_COLLAPSED_WIDTH, NAV_WIDTH } from './config';

import {IconButton, SvgIcon} from '@/components/icon';
import Logo from '@/components/logo';

import BreadCrumb from '../_common/bread-crumb';
import SearchBar from '../_common/search-bar';
import LocalePicker from '@/components/locale-picker';
import NoticeButton from '../_common/notice';
import SettingButton from '../_common/setting-button';
import AccountDropdown from '../_common/account-dropdown';
import { Drawer, theme } from 'antd';



function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // themeLayout 默认是Vertical，即垂直模式
  // breadCrumb 默认是true，即显示面包屑
  const {themeLayout, breadCrumb} = useSettings();

  const headerStyle: CSSProperties = {
    borderBottom:
      themeLayout === ThemeLayout.Horizontal
        ? `1px dashed ${rgbAlpha(themeVars.colors.palette.gray['500'], 0.2)}`
        : '',
    backgroundColor: rgbAlpha(themeVars.colors.background.defaultChannel, 0.9),
    width: '100%',
  };

  return (
    <>
      <header
        className={cn(
          themeLayout === ThemeLayout.Horizontal
            ? 'relative'
            : 'sticky top-0 right-0 left-auto'
        )}
        style={headerStyle}
      >
        {/* backdrop-filter CSS 属性可以让你为一个元素后面区域添加图形效果（如模糊或颜色偏移） */}
        <div
          className='flex flex-grow items-center justify-between px-4 text-gray-200 backdrop-blur xl:px-6 2xl:px-10'
          style={{
            height: HEADER_HEIGHT,
            transition: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          }}
        >
          <div className='flex items-baseline'>
            {themeLayout === ThemeLayout.Horizontal ? (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                className='h-10 w-10 md:hidden'
              >
                <SvgIcon icon='ic-menu' size='24' />
              </IconButton>
            ) : (
              <Logo />
            )}

            <div className='ml-4 hidden md:block'>
              {breadCrumb ? <BreadCrumb /> : null}
            </div>
          </div>

          <div className="flex">
            <SearchBar />
            <LocalePicker />
            <NoticeButton />
            <SettingButton />
            <AccountDropdown />
          </div>
        </div>
      </header>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closeIcon={false}
        width={themeLayout === ThemeLayout.Mini ? NAV_COLLAPSED_WIDTH : NAV_WIDTH}
      >
        <NavVertical closeSidebarDrawer={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
}

export default Header;
