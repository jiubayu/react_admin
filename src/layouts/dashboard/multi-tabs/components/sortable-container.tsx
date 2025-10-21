import type React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  type DragStartEvent,
  type DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {useState} from 'react';

interface SortableContainerProps {
  items: any[];
  onSortEnd?: (oldIndex: number, newIndex: number) => void;
  renderOverlay?: (activeId: string | number) => React.ReactNode;
  children: React.ReactNode;
}

const SortableContainer: React.FC<SortableContainerProps> = ({
  items,
  onSortEnd,
  renderOverlay,
  children,
}) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 的移动距离后才触发拖拽
      },
    })
  );

  // 开始拖拽，设置拖拽的元素
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  // 结束拖拽 获取 拖拽id 和 目标id，传递给回调函数进行处理
  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.key === active.id); // 拖拽对象
      const newIndex = items.findIndex((item) => item.key === over.id); // 目标对象

      if (oldIndex !== -1 && newIndex !== -1) {
        onSortEnd?.(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      // sensors 用于检测不同的输入方式，以便触发拖动操作、响应移动、结束或取消操作
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      measuring={{droppable: {strategy: MeasuringStrategy.Always}}}
    >
      <SortableContext
        items={items.map((item) => item.key)}
        strategy={horizontalListSortingStrategy}
      >
        {children}
      </SortableContext>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: ' 0.5',
              },
            },
          }),
        }}
      >
        {activeId && renderOverlay ? renderOverlay(activeId) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableContainer;
