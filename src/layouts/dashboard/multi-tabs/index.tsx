import {Tabs} from 'antd';
import {useRef} from 'react';
import styled from 'styled-components';
import {useMultiTabsContext} from './providers/multi-tabs-provider';
import {useMultiTabsStyle} from './hooks/use-tab-style';
import SortableContainer from './components/sortable-container';
import {useRouter} from '@/router/hooks';
import type {KeepAliveTab} from './types';
import {replaceDynamicParams} from '@/router/hooks/use-current-route-meta';
import {SortableItem} from './components/sortable-item';
import {TabItem} from './components/tab-item';

function MultiTabs() {
  const scrollContainer = useRef<HTMLUListElement>(null);

  const {tabs, activeTabRoutePath, setTabs} = useMultiTabsContext();
  const style = useMultiTabsStyle();
  const {push} = useRouter();

  const handleTabClick = ({key, params = {}}: KeepAliveTab) => {
    console.log('🚀 ~ handleTabClick ~ key:', key, params);
    const tabKey = replaceDynamicParams(key, params);
    push(tabKey);
  };

  const handleDragEnd = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const newTabs = Array.from(tabs);
    const [removed] = newTabs.splice(oldIndex, 1);
    newTabs.splice(newIndex, 0, removed);
    setTabs([...newTabs]);
  };

  const renderOverlay = (id: string | number) => {
    const tab = tabs.find((tab) => tab.key === id);

    if (!tab) return null;
    return <TabItem tab={tab} />;
  };

  return (
    <StyledMultiTabs>
      <Tabs
        size='small'
        type='card'
        tabBarGutter={4}
        activeKey={activeTabRoutePath}
        items={tabs.map((tab) => ({
          ...tab,
          children: <div key={tab.timeStamp}>{tab.children}</div>,
        }))}
        renderTabBar={() => {
          return (
            <div style={style}>
              <SortableContainer
                items={tabs}
                onSortEnd={handleDragEnd}
                renderOverlay={renderOverlay}
              >
                <ul
                  ref={scrollContainer}
                  className='flex overflow-x-auto w-full px-2 h-[32px] hide-scrollbar'
                >
                  {tabs.map((tab) => (
                    <SortableItem
                      tab={tab}
                      key={tab.key}
                      onClick={() => handleTabClick(tab)}
                    />
                  ))}
                </ul>
              </SortableContainer>
            </div>
          );
        }}
      ></Tabs>
    </StyledMultiTabs>
  );
}

export default MultiTabs;

const StyledMultiTabs = styled.div`
  height: 100%;
  margin-top: 2px;

  .anticon {
    margin: 0px !important;
  }

  .ant-tabs {
    height: 100%;
    .ant-tabs-content {
      height: 100%;
    }

    .ant-tabs-tabpane {
      height: 100%;
      & > div {
        height: 100%;
      }
    }
  }

  .hide-scrollbar {
    overflow: scroll;
    // none：不显示滚动条，但是该元素依然可以滚动
    scrollbar-width: none;
    -ms-overflow-style: none;
    will-change: transform;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
