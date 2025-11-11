import {useEffect, useRef, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {
  type DateSelectArg,
  type EventClickArg,
  type EventInput,
} from '@fullcalendar/core';
import dayjs from 'dayjs';
import {faker} from '@faker-js/faker';

import Card from '@/components/card';
import CalendarHeader, {
  type HandleMoveArg,
  type ViewType,
} from './calendar-header';
import {useSettings} from '@/store/settingStore';
import {StyledCalendar} from './styles';
import {down, useMediaQuery} from '@/hooks';
import {INITIAL_EVENTS} from './event-utils';
import CalendarEvent from './calendar-event';

import type {CalendarEventFormFieldType} from './calendar-event-form';
import CalendarEventForm from './calendar-event-form';

const DefaultEventInitValue = {
  id: faker.string.uuid(),
  title: '',
  description: '',
  allDay: false,
  start: dayjs(),
  end: dayjs(),
  color: '',
};

function Calender() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('dayGridMonth');
  const [eventFormType, setEventFormType] = useState<'add' | 'edit'>('add');
  const [eventInitValue, setEventInitValue] =
    useState<CalendarEventFormFieldType>(DefaultEventInitValue);

  const fullCalendarRef = useRef<FullCalendar>(null);

  const {themeMode} = useSettings();
  const xsBreakPoint = useMediaQuery(down('xs'));

  const handleMove = (action: HandleMoveArg) => {
    const calendarApi = fullCalendarRef.current?.getApi();
    if (!calendarApi) return;

    switch (action) {
      case 'prev':
        calendarApi.prev();
        break;
      case 'next':
        calendarApi.next();
        break;
      case 'today':
        calendarApi.today();
        break;
      default:
        break;
    }

    setDate(calendarApi.getDate());
  };

  const handleViewTypeChange = (viewType: ViewType) => {
    setView(viewType);
  };

  // 处理日期选择事件
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    setOpen(true);
    setEventFormType('add');
    setEventInitValue({
      id: faker.string.uuid(),
      title: '',
      description: '',
      start: dayjs(selectInfo.startStr),
      end: dayjs(selectInfo.endStr),
      allDay: selectInfo.allDay,
    });
  };

  // 处理事件点击事件
  const handleEventClick = (arg: EventClickArg) => {
    const {title, extendedProps, allDay, start, end, backgroundColor, id} =
      arg.event;
    setOpen(true);
    setEventFormType('edit');

    const newEventValue: CalendarEventFormFieldType = {
      id,
      title,
      allDay,
      description: extendedProps?.description || '',
      color: backgroundColor || '',
    };

    if (start) {
      newEventValue.start = dayjs(start);
    }

    if (end) {
      newEventValue.end = dayjs(end);
    }

    setEventInitValue(newEventValue);
  };

  const handleCancel = () => {
    setOpen(false);
    setEventInitValue(DefaultEventInitValue);
  };

  // 处理创建事件
  const handleCreate = (values: CalendarEventFormFieldType) => {
    const calendarApi = fullCalendarRef.current?.getApi();
    if (!calendarApi) return;

    const {title = '', description, start, end, allDay = false, color} = values;

    const newEvent: EventInput = {
      id: faker.string.uuid(),
      title,
      allDay,
      color,
      extendedProps: {
        description,
      },
    };
    if (start) newEvent.start = start.toDate();
    if (end) newEvent.end = end.toDate();

    // 刷新日历显示
    calendarApi.addEvent(newEvent);
  };

  // 编辑日历
  const handleEdit = (values: CalendarEventFormFieldType) => {
    const calendarApi = fullCalendarRef.current?.getApi();
    if (!calendarApi) return;

    const { id, title = '', description, start, end, allDay = false, color } = values;
    
    const oldEvent = calendarApi.getEventById(id);

    const newEvent: EventInput = {
      id,
      title,
      allDay,
      color,
      extendedProps: {
        description,
      },
    };
    if (start) newEvent.start = start.toDate();
    if (end) newEvent.end = end.toDate();

    // 刷新日历显示
    oldEvent?.remove();
    calendarApi.addEvent(newEvent);
  };

  // 删除日历事件
  const handleDelete = (id: string) => {
    const calendarApi = fullCalendarRef.current?.getApi();
    if (!calendarApi) return;

    const event = calendarApi.getEventById(id);
    event?.remove();
  };

  useEffect(() => {
    const calendarApi = fullCalendarRef.current?.getApi();
    if (!calendarApi) return;

    setTimeout(() => {
      calendarApi.changeView(view);
    });
  }, [view]);

  return (
    <Card className='h-full w-full'>
      <div className='h-full w-full'>
        <StyledCalendar $themeMode={themeMode}>
          <CalendarHeader
            now={date}
            view={view}
            onMove={handleMove}
            onCreate={() => setOpen(true)}
            onViewTypeChange={handleViewTypeChange}
          />
          <FullCalendar
            ref={fullCalendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialDate={date}
            initialView={xsBreakPoint ? 'listWeek' : view}
            events={INITIAL_EVENTS}
            eventContent={CalendarEvent}
            editable
            selectable
            selectMirror
            dayMaxEvents
            headerToolbar={false}
            select={handleDateSelect}
            eventClick={handleEventClick}
          />
        </StyledCalendar>
      </div>
      <CalendarEventForm
        type={eventFormType}
        open={open}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
        initValues={eventInitValue}
      />
    </Card>
  );
}

export default Calender;
