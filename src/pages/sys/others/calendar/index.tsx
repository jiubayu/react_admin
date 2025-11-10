import {useEffect, useRef, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import Card from '@/components/card';
import CalendarHeader, {type HandleMoveArg, type ViewType} from './calendar-header';
import {useSettings} from '@/store/settingStore';
import {StyledCalendar} from './styles';
import {down, useMediaQuery} from '@/hooks';
import {INITIAL_EVENTS} from './event-utils';
import CalendarEvent from './calendar-event';
import {type DateSelectArg} from '@fullcalendar/core';

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
  const [eventInitValue, setEventInitValue] = useState<CalendarEventFromFieldType>(DefaultEventInitValue);

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

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    setOpen(true);
    setEventFormType('add');
    setEventInitValue({

    })
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
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
    </Card>
  );
}

export default Calender;
