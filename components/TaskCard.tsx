
import React from 'react';
import { MoreHorizontal, Clock, AlignLeft } from 'lucide-react';
import { Task } from '../types';
import { TagPill } from './TagPill';

interface TaskCardProps {
  task: Task;
  columnId: string;
  isDragging: boolean;
  draggedItemType?: 'TASK' | 'COLUMN';
  onDragStart: (e: React.DragEvent, taskId: string, sourceColId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetColId: string, targetTaskId: string) => void;
  onMoveTask: (targetColId: string, targetTaskId: string) => void;
  onMenuClick: (e: React.MouseEvent, taskId: string) => void;
  onClick: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
    task, 
    columnId, 
    isDragging, 
    draggedItemType,
    onDragStart, 
    onDragEnd, 
    onDrop,
    onMoveTask,
    onMenuClick,
    onClick
}) => {

  const handleDragStartInternal = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart(e, task.id, columnId);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Live Reordering: If we drag a task over this card, swap positions immediately
    // Using simple swap logic creates the "push away" effect when combined with FLIP animation
    if (draggedItemType === 'TASK' && !isDragging) {
       onMoveTask(columnId, task.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation(); 
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Drop logic is mostly handled by state updates during drag, but we pass up for cleanup
      if (draggedItemType === 'TASK') {
          onDrop(e, columnId, task.id);
      }
  };

  // Dragging Visuals
  // If ANY drag is happening, disable the hover lift effect to make reordering stable
  const containerStyle = isDragging 
    ? 'opacity-40 scale-[0.98] grayscale' 
    : draggedItemType 
        ? 'opacity-100' // No hover effect during drag of other items
        : 'opacity-100 hover:-translate-y-0.5';

  return (
    <div
      draggable
      onDragStart={handleDragStartInternal}
      onDragEnd={onDragEnd}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        rounded-xl transition-all duration-200 ease-out cursor-grab active:cursor-grabbing
        group relative select-none
        ${containerStyle}
        ${isDragging ? 'pointer-events-none' : ''} 
      `}
    >
      {/* Actual Card Content */}
      <div 
        onClick={() => onClick(task.id)}
        className={`
          bg-white p-4 shadow-sm border border-transparent rounded-xl transition-all duration-200
          hover:shadow-md hover:border-gray-200 mb-3
      `}>
        {/* Header */}
        <div className="flex justify-between items-start mb-2 pointer-events-none">
            <div className="flex items-center gap-2">
                {task.hasRedDot && (
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                )}
                <h3 className="text-gray-800 font-medium text-sm leading-snug">{task.title}</h3>
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onMenuClick(e, task.id);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 pointer-events-auto transition-colors"
            >
                <MoreHorizontal size={16} />
            </button>
        </div>

        {/* Image Attachment */}
        {task.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-lg border border-gray-100 pointer-events-none">
            <img src={task.imageUrl} alt="Task attachment" className="w-full h-32 object-cover" />
            </div>
        )}

        {/* Description Indicator */}
        {task.description && (
            <div className="mb-2 text-gray-400 pointer-events-none">
            <AlignLeft size={14} />
            </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 pointer-events-none">
            {task.tags.map((tag, idx) => (
            <TagPill key={idx} tag={tag} />
            ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-3 w-full"></div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 pointer-events-none">
            <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            <span>{task.date}</span>
            </div>
            
            {task.statusBadge && (
                <div className={`px-2 py-0.5 rounded-full border ${
                    task.statusBadge.type === 'done' 
                        ? 'border-green-200 text-green-600 bg-green-50' 
                        : 'border-orange-200 text-orange-500 bg-orange-50'
                }`}>
                    {task.statusBadge.text}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
