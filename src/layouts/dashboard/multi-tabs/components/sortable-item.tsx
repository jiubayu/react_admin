import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import type {KeepAliveTab} from '../types';
import {cn} from '@/utils';
import {useMultiTabsContext} from '../providers/multi-tabs-provider';
import {TabItem} from './tab-item';

type Props = {
  tab: KeepAliveTab;
  onClick: () => void;
};

export function SortableItem({tab, onClick}: Props) {
  const {activeTabRoutePath, closeTab} = useMultiTabsContext();

  const isActive = tab.key === activeTabRoutePath;

  const {setNodeRef, attributes, listeners, transform, transition} =
    useSortable({
      id: tab.key,
      data: {type: 'tab', tab},
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      id={`tab${tab.key.split('/').join('-')}`}
      onClick={onClick}
      className={cn(
        'flex-shrink-0 rounded-t-lg border border-border',
        isActive && 'text-primary'
      )}
    >
      <TabItem tab={tab} onClose={() => closeTab(tab.key)} />
    </li>
  );
}
