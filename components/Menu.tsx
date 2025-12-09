import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, X } from 'lucide-react';

interface MenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  type: 'task' | 'column';
}

export const Menu: React.FC<MenuProps> = ({ x, y, onClose, onEdit, onDelete, type }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position to prevent overflow
  const style = {
    top: y,
    left: x,
  };

  return (
    <div 
      ref={menuRef}
      style={style}
      className="fixed z-50 min-w-[160px] bg-white rounded-lg shadow-xl border border-gray-100 p-1.5 animate-[fadeIn_0.2s_ease-out] origin-top-left"
    >
      <button 
        onClick={() => { onEdit(); onClose(); }}
        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
      >
        <Edit2 size={14} />
        编辑{type === 'task' ? '任务' : '列表'}
      </button>
      <button 
        onClick={() => { onDelete(); onClose(); }}
        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <Trash2 size={14} />
        删除{type === 'task' ? '任务' : '列表'}
      </button>
    </div>
  );
};