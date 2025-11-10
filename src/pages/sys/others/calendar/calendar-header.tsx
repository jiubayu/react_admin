import React, {useMemo, type ReactNode} from 'react';
import {Dropdown, type MenuProps} from 'antd';
import {Iconify} from '@/components/icon';
import {up, useMediaQuery} from '@/hooks';

export type HandleMoveArg = 'next' | 'prev' | 'today';
export type ViewType =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek';

type ViewTypeMenu = {
  key: string;
  label: string;
  view: ViewType;
  icon: ReactNode;
};
type Props = {
  now: Date;
  view: ViewType;
  onMove: (action: HandleMoveArg) => void;
  onCreate: VoidFunction;
  onViewTypeChange: (view: ViewType) => void;
};

function CalendarHeader({
  now,
  view,
  onMove,
  onCreate,
  onViewTypeChange,
}: Props) {
  const lgBreakPoint = useMediaQuery(up('lg'));

  const items = useMemo<ViewTypeMenu[]>(
    () => [
      {
        key: '1',
        label: 'Month',
        view: 'dayGridMonth',
        icon: <Iconify icon='mdi:calendar-month-outline' size={18} />,
      },
      {
        key: '2',
        label: 'Week',
        view: 'timeGridWeek',
        icon: <Iconify icon='mdi:calendar-weekend-outline' size={18} />,
      },
      {
        key: '3',
        label: 'Day',
        view: 'timeGridDay',
        icon: <Iconify icon='mdi:calendar-today-outline' size={18} />,
      },
      {
        key: '4',
        label: 'List',
        view: 'listWeek',
        icon: <Iconify icon='mdi:view-agenda-outline' size={18} />,
      },
    ],
    []
  );

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selectedViewType = items.find((item) => item.key === e.key);
    if (selectedViewType) {
      onViewTypeChange(selectedViewType.view);
    }
  };

  return (
    <div className='relative flex items-center justify-between py-5'>
      {lgBreakPoint && (
        <Dropdown menu={{items, onClick: handleMenuClick}}></Dropdown>
      )}
    </div>
  );
}

export default CalendarHeader;
