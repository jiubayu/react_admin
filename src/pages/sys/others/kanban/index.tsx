import React, {useRef, useState} from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type {InputRef} from 'antd';

// 对于一些特定的网站，滚动条要自定义样式，一般谷歌浏览器可以生效，但是当用户使用火狐时，就没有办法自定义了，因此借助插件SimpleBa
import SimpleBar from 'simplebar-react';
import {initialData} from './task-utils';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import KanbanColumn from './kanban-column';
import type {Column, Columns, DndDataType, Task, Tasks} from './types';

function Kanban() {
  const [state, setState] = useState(initialData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'column' | 'task' | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const inputRef = useRef<InputRef>(null);

  // 与手动为每个可拖动节点添加事件监听器相比，这可以提高性能
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const {active} = event;
    setActiveId(active.id as string);
    // 通过判断 id 格式来确定拖拽类型
    setActiveType(active.id.toString().startsWith('task-') ? 'task' : 'column');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    if (active.id !== over.id) {
      if (activeType === 'column') {
        // 处理列的拖拽
        const oldIndex = state.columnOrder.indexOf(active.id as string);
        const newIndex = state.columnOrder.indexOf(over.id as string);

        setState({
          ...state,
          columnOrder: arrayMove(state.columnOrder, oldIndex, newIndex),
        });
      }
    } else {
      // 处理任务的拖拽
      const activeColumn = Object.values(state.columns).find((col) =>
        col.taskIds.includes(active.id as string)
      );
      const overColumn = Object.values(state.columns).find(
        (col) => col.taskIds.includes(over.id as string) || col.id === over.id
      );

      if (!activeColumn || !overColumn) {
        return;
      }

      if (activeColumn === overColumn) {
        // 同列内移动
        const newTaskIds = arrayMove(
          activeColumn.taskIds,
          activeColumn.taskIds.indexOf(active.id as string),
          overColumn.taskIds.indexOf(over.id as string)
        );

        setState({
          ...state,
          columns: {
            ...state.columns,
            [activeColumn.id]: {
              ...activeColumn,
              taskIds: newTaskIds,
            },
          },
        });
      } else {
        // 跨列移动
        // 从源列中移除任务
        const sourceTaskIds = activeColumn.taskIds.filter(
          (id) => id !== active.id
        );
        // 向目标列中添加任务
        const destinationTaskIds = [...overColumn.taskIds, active.id as string];
        const overTaskIndex = overColumn.taskIds.indexOf(over.id as string);

        destinationTaskIds.splice(
          overTaskIndex >= 0 ? overTaskIndex : destinationTaskIds.length,
          0,
          active.id as string
        );

        setState({
          ...state,
          columns: {
            ...state.columns,
            [activeColumn.id]: {
              ...activeColumn,
              taskIds: sourceTaskIds,
            },
            [overColumn.id]: {
              ...overColumn,
              taskIds: destinationTaskIds,
            },
          },
        });
      }
    }

    setActiveId(null);
    setActiveType(null);
  };

  const createTask = (columnId: string, task: Task) => {
    const column = state.columns[columnId];
    const newState: DndDataType = {
      ...state,
      tasks: {
        ...state.tasks,
        [task.id]: task,
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...column,
          taskIds: [...column.taskIds, task.id],
        },
      },
    };
    setState(newState);
  };

  const deleteColumn = (columnId: string) => {
    const column = state.columns[columnId];
    const newTasks = Object.keys(state.tasks)
      .filter((taskId) => !column.taskIds.includes(taskId))
      .reduce((result, key) => {
        result[key] = state.tasks[key];
        return result;
      }, {} as Tasks);

    const newColumns = {};
  };

  return (
    <SimpleBar title='看板'>
      <div className='flex'>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className='flex h-full items-start gap-6 p-1'>
            <SortableContext
              items={state.columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              {state.columnOrder.map((columnId, index) => {
                const column = state.columns[columnId];
                const tasks = column.taskIds.map(
                  (taskId) => state.tasks[taskId]
                );

                return (
                  <KanbanColumn
                    key={columnId}
                    id={columnId}
                    index={index}
                    column={column}
                    tasks={tasks}
                    createTask={createTask}
                    clearColumn={clearColumn}
                    deleteColumn={deleteColumn}
                    renameColumn={renameColumn}
                  />
                );
              })}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </SimpleBar>
  );
}

export default Kanban;
