import {forwardRef} from 'react';
import {cn} from '@/utils';

import SimpleBar, {type Props as SimplebarProps} from 'simplebar-react';
import styled from 'styled-components';

export type ScrollbarProps = SimplebarProps & {
  fillContainer?: boolean;
};

const Scrollbar = forwardRef<HTMLElement, ScrollbarProps>(
  ({children, className, fillContainer = true, ...other}, ref) => {
    return (
      <ScrollbarRoot
        fillContainer={fillContainer}
        {...other}
        scrollableNodeProps={{ref}}
        clickOnTrack={false}
        className={cn('', className)}
      >
        {children}
      </ScrollbarRoot>
    );
  }
);

export default Scrollbar;

const ScrollbarRoot = styled(SimpleBar).withConfig({
  // 一个过滤器函数，用于控制哪些 props 应该被传递给底层的 DOM 元素。这可以避免非标准的 props 被传递给 DOM
  shouldForwardProp: (prop) => !['fillContainer'].includes(prop),
  displayName: 'ScrollbarRoot', // 为组件设置一个显示名称，便于调试
})<Pick<ScrollbarProps, 'fillContainer'>>`
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  ${({fillContainer}) =>
    fillContainer &&
    `
    & .simplebar-content {
      display: flex;
      flex: 1 1 auto;
      min-height: 100%;
      flex-direction: column;
    }
  `}
`;
