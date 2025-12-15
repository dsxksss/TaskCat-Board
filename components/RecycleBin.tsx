
import React from 'react';
import { X, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface RecycleBinProps {
  isOpen: boolean;
  onClose: () => void;
  deletedTasks: (Task & { originalColumnId: string })[];
  onRestore: (taskId: string) => void;
  onPermanentDelete: (taskId: string) => void;
}

export const RecycleBin: React.FC<RecycleBinProps> = ({ 
  isOpen, 
  onClose, 
  deletedTasks, 
  onRestore, 
  onPermanentDelete 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Trash2 size={20} className="text-gray-700" />
            <h2 className="text-lg font-bold text-gray-800">回收站</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {deletedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Trash2 size={32} className="opacity-50" />
               </div>
               <p>回收站为空</p>
            </div>
          ) : (
            deletedTasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800 line-through decoration-gray-400 decoration-2">{task.title}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">已删除</span>
                </div>
                
                {task.tags.length > 0 && (
                   <div className="flex gap-1 mb-3 opacity-50">
                     {task.tags.map((t, i) => (
                       <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: getSimpleColor(t.color) }}></span>
                     ))}
                   </div>
                )}

                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => onRestore(task.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <RefreshCw size={12} />
                    恢复
                  </button>
                  <button 
                    onClick={() => onPermanentDelete(task.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} />
                    彻底删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {deletedTasks.length > 0 && (
            <div className="p-3 bg-yellow-50 text-yellow-700 text-xs text-center border-t border-yellow-100 flex items-center justify-center gap-2">
                <AlertCircle size={12} />
                彻底删除后将无法恢复
            </div>
        )}
      </div>
    </div>
  );
};

function getSimpleColor(color: string) {
    const map: Record<string, string> = {
      purple: '#a855f7',
      pink: '#ec4899',
      cyan: '#06b6d4',
      orange: '#f97316',
      green: '#22c55e',
      blue: '#3b82f6',
    };
    return map[color] || '#9ca3af';
}
