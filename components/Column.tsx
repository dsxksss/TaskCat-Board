
import React, { useRef, useEffect } from 'react';
import { MoreHorizontal, Plus, CheckCircle, Clipboard, Briefcase, Layout, GripVertical } from 'lucide-react';
import { Column as ColumnType, DragItem } from '../types';
import { TaskCard } from './TaskCard';
import autoAnimate from '@formkit/auto-animate';

interface ColumnProps {
  column: ColumnType;
  draggedItem: DragItem | null;
  onDragStart: (e: React.DragEvent, type: 'TASK' | 'COLUMN', id: string, sourceColId?: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onMoveTask: (targetColId: string, targetTaskId?: string) => void;
  onMoveColumn: (targetColId: string) => void;
  onAddTask: (colId: string) => void;
  onTaskMenuClick: (e: React.MouseEvent, taskId: string) => void;
  onColumnMenuClick: (e: React.MouseEvent, colId: string) => void;
  onTaskClick: (taskId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ 
    column, 
    draggedItem,
    onDragStart, 
    onDragEnd, 
    onDragOver, 
    onDrop, 
    onMoveTask,
    onMoveColumn,
    onAddTask,
    onTaskMenuClick,
    onColumnMenuClick,
    onTaskClick
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  
  // Enable auto-animate for smooth reordering of tasks within column
  useEffect(() => {
    if (listRef.current) {
        autoAnimate(listRef.current, { duration: 200, easing: 'ease-in-out' });
    }
  }, [listRef]);

  const getIcon = () => {
    switch (column.iconType) {
      case 'todo': return <Clipboard size={16} />;
      case 'progress': return <Layout size={16} />;
      case 'done': return <CheckCircle size={16} />;
      case 'manage': return <Briefcase size={16} />;
      default: return <Clipboard size={16} />;
    }
  };

  const isDraggingColumn = draggedItem?.type === 'COLUMN' && draggedItem.colId === column.id;
  const draggedTaskId = draggedItem?.type === 'TASK' ? draggedItem.taskId : undefined;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Live Column Reordering
    if (draggedItem?.type === 'COLUMN' && !isDraggingColumn) {
        onMoveColumn(column.id);
    }

    // Task Reordering - Handle drop into empty column OR dragging into whitespace
    if (draggedItem?.type === 'TASK') {
        const isTaskInColumn = column.tasks.some(t => t.id === draggedTaskId);

        // Case 1: Empty column. Always accept.
        if (column.tasks.length === 0) {
            onMoveTask(column.id);
        } 
        // Case 2: Hovering over the container background (whitespace) at the bottom
        else if (!isTaskInColumn && e.target === e.currentTarget) {
             onMoveTask(column.id); // Moves to end
        }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      onDragOver(e);
  };

  return (
    <div 
        draggable
        onDragStart={(e) => onDragStart(e, 'COLUMN', column.id)}
        onDragEnd={onDragEnd}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDrop={onDrop}
        className={`flex flex-col min-w-[280px] w-[280px] md:w-[320px] h-full transition-all duration-300 relative
            ${isDraggingColumn ? 'opacity-20 scale-95 grayscale' : 'opacity-100'}
        `}
    >
        {/* Column Header */}
        <div className="bg-white rounded-xl p-3 mb-3 shadow-sm flex flex-col gap-3 transition-transform hover:scale-[1.01] duration-200 cursor-grab active:cursor-grabbing group border border-gray-100">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <GripVertical size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`w-1 h-4 rounded-full ${column.accentColor}`}></div>
                    <span className="text-gray-500">{getIcon()}</span>
                    <span>{column.title}</span>
                    <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium ml-1">
                        {column.tasks.length}
                    </span>
                </div>
                <button 
                  onClick={(e) => onColumnMenuClick(e, column.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>
            
            <button 
                onClick={() => onAddTask(column.id)}
                className="w-full border border-gray-200 rounded-lg py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center gap-1 active:bg-gray-100"
            >
                <Plus size={16} />
                添加待办
            </button>
        </div>

        {/* Tasks List Container */}
        <div 
            ref={listRef} 
            className="flex-1 overflow-y-auto scrollbar-hide pb-4 px-1 -mx-1"
        >
            {column.tasks.map(task => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    columnId={column.id}
                    isDragging={task.id === draggedTaskId}
                    draggedItemType={draggedItem?.type}
                    onDragStart={(e, taskId, colId) => onDragStart(e, 'TASK', taskId, colId)}
                    onDragEnd={onDragEnd}
                    onDrop={(e, targetColId) => onDrop(e)}
                    onMoveTask={onMoveTask}
                    onMenuClick={onTaskMenuClick}
                    onClick={onTaskClick}
                />
            ))}
            
            {/* Empty State Visual */}
            {column.tasks.length === 0 && !isDraggingColumn && (
                <div className="h-24 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-sm transition-colors hover:bg-gray-50/50">
                    {draggedItem?.type === 'TASK' ? '放入此处' : '暂无任务'}
                </div>
            )}
        </div>
    </div>
  );
};
