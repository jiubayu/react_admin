import type {EventInput} from '@fullcalendar/core';

export type CalendarEventFieldType = Pick<EventInput, 'title' | 'allDay' | 'color'> & {
  id: string;
  description?: string;
  start?: Date;
  end?: Date;
};

type Props = {
  type: 'edit' | 'add';
  open: boolean;
  onCancel: VoidFunction;
  onEdit: (event: CalendarEventFieldType) => void;
  onCreate: (event: CalendarEventFieldType) => void;
  onDelete: (id: string) => void;
  initValues: CalendarEventFieldType;
};

const COLORS = [
  '#00a76f',
  '#8e33ff',
  '#00b8d9',
  '#003768',
  '#22c55e',
  '#ffab00',
  '#ff5630',
  '#7a0916',
];

export default function CalendarEventForm({
  type,
  open,
  onCancel,
  onEdit,
  onCreate,
  onDelete,
  initValues,
}: Props) {}