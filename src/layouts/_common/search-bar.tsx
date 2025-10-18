import {useEffect, useMemo, useRef, useState, type CSSProperties} from 'react';
import {Empty, Input, Modal, Tag, type InputRef} from 'antd';
import {useBoolean, useEvent, useKeyPressEvent} from 'react-use';
import {useTranslation} from 'react-i18next';

// 专注于在自动建议或搜索建议组件中高亮显示文本。它能够高效地在输入字符串中突出关键词，从而提升用户体验
// var matches = match('Pretty cool text', 'co');
// var parts = parse('Pretty cool text', matches);
// parts => [{ text: 'Pretty ', highlight: false },{ text: 'co', highlight: true },{ text: 'ol text', highlight: false }]
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import {IconButton, SvgIcon} from '@/components/icon';
import {useRouter} from '@/router/hooks';
import {useFlattenedRoutes} from '@/router/hooks/use-flattened-routes';
import Scrollbar from '@/components/scrollbar';
import styled from 'styled-components';
import {themeVars} from '@/theme/theme.css';
import {rgbAlpha} from '@/utils/theme';

function SearchBar() {
  const {t} = useTranslation();
  const {replace} = useRouter();

  const inputRef = useRef<InputRef>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const flattenedRoutes = useFlattenedRoutes();

  const [search, toggle] = useBoolean(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const searchResult = useMemo(() => {
    return flattenedRoutes.filter((item) =>
      t(item.label).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [flattenedRoutes, searchQuery, t]);

  const activeStyle: CSSProperties = {
    border: `1px dashed ${themeVars.colors.palette.primary.default}`,
    backgroundColor: rgbAlpha(
      themeVars.colors.palette.primary.defaultChannel,
      0.1
    ),
  };

  useEffect(() => {
    // 默认选中第一个
    setSelectedItemIndex(0);
  }, [searchResult.length]);

  /**
   * 进行快捷键的处理
   */
  useEvent('keydown', handleMetaK);

  function handleMetaK(event: KeyboardEvent) {
    // metaKey: ⌘ or ⌃
    if (event.metaKey && event.key === 'k') {
      handleOpen();
    }
  }
  // 向上选中
  useKeyPressEvent('ArrowUp', (event) => {
    if (!search) return;
    event.preventDefault();
    // 循环滚动
    const nextIndex =
      selectedItemIndex === 0 ? searchResult.length - 1 : selectedItemIndex - 1;
    setSelectedItemIndex(nextIndex);
    // 滚动到选中的元素
    scrollSelectedItemIntoView(nextIndex);
  });

  useKeyPressEvent('ArrowDown', (event) => {
    if (!search) return;
    event.preventDefault();
    // 循环滚动
    const nextIndex =
      selectedItemIndex === searchResult.length - 1 ? 0 : selectedItemIndex + 1;
    setSelectedItemIndex(nextIndex);
    // 滚动到选中的元素
    scrollSelectedItemIntoView(nextIndex);
  });
  // 点击回车，进行跳转
  useKeyPressEvent('Enter', (event) => {
    if (!search || searchResult.length === 0) return;
    event.preventDefault();

    const selectedKey = searchResult[selectedItemIndex].key;
    if (selectedKey) {
      handleSelect(selectedKey);
      toggle(false); // 关闭弹窗
    }
  });

  useKeyPressEvent('Escape', () => {
    handleCancel();
  });

  const scrollSelectedItemIntoView = (index: number) => {
    if (listRef.current) {
      const selectedItem = listRef.current.children[index];
      // 滚动元素的父容器, 使被调用 scrollIntoView() 的元素对用户可见。
      selectedItem.scrollIntoView({
        block: 'center', // 定义垂直方向的对齐
        behavior: 'smooth', // smooth 平滑/instant 立即
      });
    }
  };

  const handleOpen = () => {
    toggle(true);
    setSearchQuery('');
    setSelectedItemIndex(0);
  };

  const handleCancel = () => {
    toggle(false);
  };

  const handleAfterOpenChange = (open: boolean) => {
    if (open) {
      // auto focus
      inputRef.current?.focus();
    }
  };

  const handleSelect = (key: string) => {
    replace(key); // 跳转到指定路由
    handleCancel(); // 关闭搜索框
  };

  const handleHover = (index: number) => {
    if (index === selectedItemIndex) return;
    setSelectedItemIndex(index);
  };
  return (
    <>
      <div className='flex items-center justify-center'>
        <IconButton
          className='h-8 rounded-xl bg-hover py-2 text-xs font-bold'
          onClick={handleOpen}
        >
          <div className='flex items-center justify-center gap-2'>
            <SvgIcon icon='ic-search' size='20' />
            <span className='flex h-6 items-center justify-center rounded-md bg-common-white px-1.5 font-bold text-gray-800'>
              {' '}
              ⌘K{' '}
            </span>
          </div>
        </IconButton>
      </div>

      <Modal
        centered
        keyboard
        open={search}
        onCancel={handleCancel}
        closeIcon={false}
        afterOpenChange={handleAfterOpenChange}
        styles={{
          body: {
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }}
        title={
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search...'
            variant='borderless'
            autoFocus
            prefix={<SvgIcon icon='ic-search' size='20' />}
            suffix={
              <IconButton
                className='h-6 rounded-md bg-hover text-xs'
                onClick={handleCancel}
              >
                Esc
              </IconButton>
            }
          />
        }
        footer={
          <div className='flex flex-wrap'>
            <div className='flex'>
              <Tag color='cyan'>↑</Tag>
              <Tag color='cyan'>↓</Tag>
              <span>to navigate</span>
            </div>
            <div className='flex'>
              <Tag color='cyan'>↵</Tag>
              <span>to select</span>
            </div>
            <div className='flex'>
              <Tag color='cyan'>ESC</Tag>
              <span>to close</span>
            </div>
          </div>
        }
      >
        {searchResult.length === 0 ? (
          <Empty />
        ) : (
          <Scrollbar>
            <div ref={listRef} className='py-2'>
              {searchResult.map(({key, label}, index) => {
                const matches = match(t(label), searchQuery);
                const partsTitle = parse(t(label), matches);
                const partsKey = parse(key, match(key, searchQuery));

                return (
                  <StyledListItemButton
                    key={key}
                    style={index === selectedItemIndex ? activeStyle : {}}
                    onClick={() => handleSelect(key)}
                    onMouseMove={() => handleHover(index)}
                  >
                    <div className='flex justify-between'>
                      <div>
                        <div className='font-medium'>
                          {
                            // { text: 'co', highlight: true }
                            partsTitle.map((item: any) => (
                              <span
                                key={item.text}
                                style={{
                                  color: item.highlight
                                    ? themeVars.colors.palette.primary.default
                                    : themeVars.colors.text.primary,
                                }}
                              >
                                {item.text}
                              </span>
                            ))
                          }
                        </div>
                        <div className='text-xs'>
                          {partsKey.map((item: any) => (
                            <span
                              key={item.text}
                              style={{
                                color: item.highlight
                                  ? themeVars.colors.palette.primary.default
                                  : themeVars.colors.text.secondary,
                              }}
                            >
                              {item.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </StyledListItemButton>
                );
              })}
            </div>
          </Scrollbar>
        )}
      </Modal>
    </>
  );
}

export default SearchBar;

const StyledListItemButton = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 100%;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${themeVars.colors.text.secondary};
`;
