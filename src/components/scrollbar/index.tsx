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
  shouldForwardProp: (prop) => !['fillContainer'].includes(prop),
  displayName: 'ScrollbarRoot',
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
