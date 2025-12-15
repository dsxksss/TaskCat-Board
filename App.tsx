
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Minus, Square, X, Mail, Trash2, Cat, PlusCircle } from 'lucide-react';
import { INITIAL_DATA } from './constants';
import { Column as ColumnType, Task, DragItem } from './types';
import { Column } from './components/Column';
import { Modal } from './components/Modal';
import { Menu } from './components/Menu';
import { RecycleBin } from './components/RecycleBin';
import { SettingsModal } from './components/SettingsModal';
import { MailModal } from './components/MailModal';
import autoAnimate from '@formkit/auto-animate';

const App: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>(INITIAL_DATA);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  
  // Deleted Tasks State (Recycle Bin)
  const [deletedTasks, setDeletedTasks] = useState<(Task & { originalColumnId: string })[]>([]);
  
  // Active Aux Modal State
  const [activeAuxModal, setActiveAuxModal] = useState<'none' | 'settings' | 'mail' | 'recycle'>('none');

  const dragTimeoutRef = useRef<number | null>(null);
  const columnsContainerRef = useRef<HTMLDivElement>(null);

  // Enable auto-animate for smooth column reordering
  useEffect(() => {
    if (columnsContainerRef.current) {
        autoAnimate(columnsContainerRef.current, { duration: 200, easing: 'ease-in-out' });
    }
  }, [columnsContainerRef]);

  // --- UI State ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    columnId?: string;
    taskId?: string;
    initialData?: Task;
  }>({ isOpen: false, mode: 'add' });

  const [menuState, setMenuState] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    type: 'task' | 'column';
    id: string;
  } | null>(null);

  // --- CRUD Operations ---
  
  const handleAddTaskClick = (colId: string) => {
    setModalState({
      isOpen: true,
      mode: 'add',
      columnId: colId
    });
  };

  const handleEditTaskClick = (taskId: string) => {
    // Find task
    let task: Task | undefined;
    let colId: string | undefined;
    
    for (const col of columns) {
      const t = col.tasks.find(t => t.id === taskId);
      if (t) {
        task = t;
        colId = col.id;
        break;
      }
    }

    if (task && colId) {
      setModalState({
        isOpen: true,
        mode: 'edit',
        taskId: taskId,
        columnId: colId,
        initialData: task
      });
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    setColumns(prev => prev.map(col => {
      // Add Mode
      if (modalState.mode === 'add' && col.id === modalState.columnId) {
        const newTask: Task = {
            id: `new-${Date.now()}`,
            title: taskData.title || '新任务',
            description: taskData.description,
            content: taskData.content,
            imageUrl: taskData.imageUrl,
            hasRedDot: true,
            tags: taskData.tags || [],
            date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            statusBadge: { text: '待办', type: 'todo' }
        };
        return { ...col, tasks: [newTask, ...col.tasks] };
      }
      
      // Edit Mode
      if (modalState.mode === 'edit' && col.id === modalState.columnId) {
        return {
          ...col,
          tasks: col.tasks.map(t => t.id === modalState.taskId ? { ...t, ...taskData } : t)
        };
      }
      return col;
    }));
  };

  // --- Recycle Bin Logic ---

  const handleDelete = (type: 'task' | 'column', id: string) => {
    if (type === 'task') {
      // Find the task and its column first to save for restore
      let taskToDelete: Task | undefined;
      let sourceColId: string | undefined;

      columns.forEach(col => {
        const t = col.tasks.find(task => task.id === id);
        if (t) {
            taskToDelete = t;
            sourceColId = col.id;
        }
      });

      if (taskToDelete && sourceColId) {
          // Move to recycle bin
          setDeletedTasks(prev => [{ ...taskToDelete!, originalColumnId: sourceColId! }, ...prev]);
          
          // Remove from board
          setColumns(prev => prev.map(col => ({
            ...col,
            tasks: col.tasks.filter(t => t.id !== id)
          })));
      }
    } else {
      // For columns, we just delete permanently for this version (or could add to a separate bin)
      if (window.confirm('确定要删除此列表吗？列表内的任务也将被删除。')) {
          setColumns(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const handleRestoreTask = (taskId: string) => {
    const taskToRestore = deletedTasks.find(t => t.id === taskId);
    if (!taskToRestore) return;

    // Remove from recycle bin
    setDeletedTasks(prev => prev.filter(t => t.id !== taskId));

    // Add back to board
    setColumns(prev => {
        // Try to find original column
        const colExists = prev.some(c => c.id === taskToRestore.originalColumnId);
        
        if (colExists) {
            return prev.map(col => {
                if (col.id === taskToRestore.originalColumnId) {
                    // Remove the extra meta property before adding back
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { originalColumnId, ...cleanTask } = taskToRestore;
                    return { ...col, tasks: [cleanTask, ...col.tasks] };
                }
                return col;
            });
        } else {
            // If original column deleted, add to the first available column
             if (prev.length > 0) {
                 const newCols = [...prev];
                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
                 const { originalColumnId, ...cleanTask } = taskToRestore;
                 newCols[0] = { ...newCols[0], tasks: [cleanTask, ...newCols[0].tasks] };
                 return newCols;
             }
             return prev;
        }
    });
  };

  const handlePermanentDelete = (taskId: string) => {
      setDeletedTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // --- Menu Handlers ---
  const openMenu = (e: React.MouseEvent, type: 'task' | 'column', id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuState({
      isOpen: true,
      x: rect.right + 5,
      y: rect.top,
      type,
      id
    });
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, type: 'TASK' | 'COLUMN', id: string, sourceColId?: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    
    if (menuState) setMenuState(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);

    // Defer state update to allow browser to capture the snapshot of the element *before* React updates visuals
    dragTimeoutRef.current = window.setTimeout(() => {
        if (type === 'TASK' && sourceColId) {
            setDraggedItem({ type: 'TASK', taskId: id, sourceColId });
        } else {
            setDraggedItem({ type: 'COLUMN', colId: id });
        }
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = null;
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Live Task Reordering Logic
  const handleMoveTask = (targetColId: string, targetTaskId?: string) => {
    if (!draggedItem || draggedItem.type !== 'TASK') return;
    
    const { taskId: draggedId, sourceColId: currentSourceColId } = draggedItem;

    if (draggedId === targetTaskId) return;
    
    setColumns(prev => {
        const newCols = [...prev];
        const sColIdx = newCols.findIndex(c => c.id === currentSourceColId);
        const tColIdx = newCols.findIndex(c => c.id === targetColId);

        if (sColIdx === -1 || tColIdx === -1) return prev;

        // Clone columns
        const sCol = { ...newCols[sColIdx], tasks: [...newCols[sColIdx].tasks] };
        const tCol = (sColIdx === tColIdx) 
            ? sCol 
            : { ...newCols[tColIdx], tasks: [...newCols[tColIdx].tasks] };
        
        // Find indices in ORIGINAL state (before modification)
        const sTaskIdx = sCol.tasks.findIndex(t => t.id === draggedId);
        if (sTaskIdx === -1) return prev;

        // 1. Remove from source
        const [movedTask] = sCol.tasks.splice(sTaskIdx, 1);

        // 2. Determine Insertion Index
        let tTaskIdx = tCol.tasks.length; // Default to end

        if (targetTaskId) {
            const idx = tCol.tasks.findIndex(t => t.id === targetTaskId);
            
            if (idx !== -1) {
                tTaskIdx = idx;
                // Simple directional heuristic for same-column sort
                if (sColIdx === tColIdx && sTaskIdx <= idx) {
                    tTaskIdx = idx + 1;
                }
            }
        }

        // 3. Insert into target
        tCol.tasks.splice(tTaskIdx, 0, movedTask);

        // 4. Update state
        newCols[sColIdx] = sCol;
        if (sColIdx !== tColIdx) newCols[tColIdx] = tCol;

        return newCols;
    });

    // CRITICAL: Update draggedItem to reflect its new "home" so subsequent moves are calculated correctly
    setDraggedItem(prev => prev ? { ...prev, sourceColId: targetColId } : null);
  };

  // Live Column Reordering Logic
  const handleMoveColumn = (targetColId: string) => {
    if (!draggedItem || draggedItem.type !== 'COLUMN') return;
    if (draggedItem.colId === targetColId) return;

    setColumns(prev => {
        const newCols = [...prev];
        const sourceIdx = newCols.findIndex(c => c.id === draggedItem.colId);
        const targetIdx = newCols.findIndex(c => c.id === targetColId);

        if (sourceIdx === -1 || targetIdx === -1) return prev;

        const [movedCol] = newCols.splice(sourceIdx, 1);
        newCols.splice(targetIdx, 0, movedCol);
        
        return newCols;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Logic is handled live by handleMoveTask/handleMoveColumn
    handleDragEnd();
  };

  return (
    <div 
        className="h-screen w-screen bg-cover bg-center overflow-hidden flex flex-col font-sans"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3270&auto=format&fit=crop')` }}
        onClick={() => setMenuState(null)} 
    >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full bg-white/30 backdrop-blur-xl shadow-2xl m-0 md:m-4 md:rounded-2xl border border-white/20 overflow-hidden text-gray-800">
            
            <header className="flex-shrink-0 h-14 bg-white/40 border-b border-white/30 flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        <Cat size={20} className="text-gray-800" />
                    </div>
                    <div className="flex items-center text-sm font-semibold text-gray-800">
                        <span>默认</span>
                        <span className="mx-2 text-gray-400">▼</span>
                        <span className="text-lg">事项猫</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-gray-700">
                    <div className="relative group">
                        <Trash2 
                            size={18} 
                            onClick={() => setActiveAuxModal('recycle')}
                            className={`cursor-pointer transition-colors ${activeAuxModal === 'recycle' ? 'text-red-500' : 'hover:text-red-500'}`} 
                        />
                        {deletedTasks.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm pointer-events-none">
                                {deletedTasks.length}
                            </span>
                        )}
                    </div>
                    
                    <Mail 
                        size={18} 
                        onClick={() => setActiveAuxModal('mail')}
                        className={`cursor-pointer transition-colors ${activeAuxModal === 'mail' ? 'text-blue-500' : 'hover:text-blue-500'}`} 
                    />
                    
                    <Settings 
                        size={18} 
                        onClick={() => setActiveAuxModal('settings')}
                        className={`cursor-pointer transition-colors ${activeAuxModal === 'settings' ? 'text-gray-900' : 'hover:text-gray-900'}`} 
                    />
                    
                    <div className="h-4 w-px bg-gray-400/50 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <Minus size={18} className="cursor-pointer hover:bg-black/5 rounded" />
                        <Square size={16} className="cursor-pointer hover:bg-black/5 rounded" />
                        <X size={20} className="cursor-pointer hover:bg-red-500 hover:text-white rounded" />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div 
                    ref={columnsContainerRef}
                    className="flex gap-6 h-full w-max mx-auto md:mx-0"
                >
                    {columns.map(col => (
                        <Column 
                            key={col.id} 
                            column={col}
                            draggedItem={draggedItem}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onMoveTask={handleMoveTask}
                            onMoveColumn={handleMoveColumn}
                            onAddTask={handleAddTaskClick}
                            onTaskMenuClick={(e, id) => openMenu(e, 'task', id)}
                            onColumnMenuClick={(e, id) => openMenu(e, 'column', id)}
                            onTaskClick={handleEditTaskClick}
                        />
                    ))}
                    <div className="w-8"></div>
                </div>
            </main>

            <div className="absolute bottom-8 right-8">
                <button 
                  onClick={() => handleAddTaskClick(columns[0]?.id || 'col-1')}
                  className="w-14 h-14 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
                >
                    <div className="relative">
                        <div className="absolute -top-1 -right-1">
                            <PlusCircle size={14} className="text-white fill-current" />
                        </div>
                        <span className="text-2xl font-bold leading-none mb-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </div>
                </button>
            </div>

            {/* Main Task Modal */}
            <Modal 
              isOpen={modalState.isOpen}
              mode={modalState.mode}
              initialData={modalState.initialData}
              onClose={() => setModalState({ ...modalState, isOpen: false })}
              onSave={handleSaveTask}
            />

            {/* Auxiliary Modals */}
            <RecycleBin 
                isOpen={activeAuxModal === 'recycle'}
                onClose={() => setActiveAuxModal('none')}
                deletedTasks={deletedTasks}
                onRestore={handleRestoreTask}
                onPermanentDelete={handlePermanentDelete}
            />
            
            <SettingsModal 
                isOpen={activeAuxModal === 'settings'}
                onClose={() => setActiveAuxModal('none')}
            />

            <MailModal 
                isOpen={activeAuxModal === 'mail'}
                onClose={() => setActiveAuxModal('none')}
            />

            {/* Context Menu */}
            {menuState && (
              <Menu 
                x={menuState.x}
                y={menuState.y}
                type={menuState.type}
                onClose={() => setMenuState(null)}
                onEdit={() => {
                  if (menuState.type === 'task') handleEditTaskClick(menuState.id);
                }}
                onDelete={() => handleDelete(menuState.type, menuState.id)}
              />
            )}
        </div>
    </div>
  );
};

export default App;
