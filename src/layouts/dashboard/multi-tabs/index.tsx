import {Tabs} from 'antd';
import {useRef} from 'react';
import styled from 'styled-components';

function MultiTabs() {
  const scrollContainer = useRef<HTMLUListElement>(null);

  const {activeTabRoutePath} = useMultiTabsContext();

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
                  {Tabs.map((tab) => (
                    <SortableItem
                      tab={tab}
                      key={tab.key}
                      onClick={() => handleTabClick(tab)}
                    ></SortableItem>
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
