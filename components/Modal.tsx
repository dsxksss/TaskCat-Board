import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Tag as TagIcon, AlignLeft, Image as ImageIcon, Eye, Edit3, Trash2 } from 'lucide-react';
import { Task, Tag, TagColor } from '../types';
import { marked } from 'marked';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Task;
  mode: 'add' | 'edit';
}

const COLORS: TagColor[] = ['purple', 'pink', 'cyan', 'orange', 'green', 'blue'];

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData, mode }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Markdown content
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState<TagColor>('blue');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Preview HTML state
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content || initialData.description || '');
      setCoverImage(initialData.imageUrl || '');
      setTags(initialData.tags || []);
    } else if (isOpen && !initialData) {
      setTitle('');
      setContent('');
      setCoverImage('');
      setTags([]);
    }
    setActiveTab('write');
  }, [isOpen, initialData]);

  // Update markdown preview when content changes
  useEffect(() => {
    if (activeTab === 'preview') {
      const html = marked.parse(content || '*No content*') as string;
      setPreviewHtml(html);
    }
  }, [content, activeTab]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title,
      description: content.slice(0, 100) + (content.length > 100 ? '...' : ''), // Auto-generate short desc
      content,
      imageUrl: coverImage,
      tags
    });
    onClose();
  };

  const addTag = () => {
    if (newTagLabel.trim()) {
      setTags([...tags, { label: newTagLabel, color: selectedColor }]);
      setNewTagLabel('');
    }
  };

  const removeTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            // Insert markdown image at cursor or end
            const imageMarkdown = `\n![Image](${base64})\n`;
            setContent(prev => prev + imageMarkdown);
            
            // Auto-set cover image if none exists
            if (!coverImage) {
              setCoverImage(base64);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden transform transition-all animate-[scaleIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <AlignLeft size={20} />
             </div>
             <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="任务标题"
                className="text-lg font-bold bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 w-full"
             />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
            
            {/* Left Column: Main Editor */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Cover Image Preview */}
                {coverImage && (
                    <div className="relative mb-6 rounded-xl overflow-hidden group h-48 border border-gray-200 bg-gray-50 shrink-0">
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => setCoverImage('')}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-md hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        详细内容 (支持 Markdown & 粘贴图片)
                    </label>
                    <div className="flex bg-gray-100 p-0.5 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('write')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'write' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Edit3 size={12} /> 编辑
                        </button>
                        <button 
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Eye size={12} /> 预览
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    {activeTab === 'write' ? (
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onPaste={handlePaste}
                            placeholder="在这里输入 Markdown 内容，或直接粘贴截图..."
                            className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-gray-800 text-sm leading-relaxed font-mono"
                        />
                    ) : (
                        <div 
                            className="w-full h-full p-4 overflow-y-auto markdown-body bg-white"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                    )}
                </div>
            </div>

            {/* Right Column: Metadata */}
            <div className="w-full md:w-72 flex-shrink-0 space-y-6">
                 {/* Cover Image Input */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <ImageIcon size={16} />
                        封面图片
                    </label>
                    <div className="flex gap-2">
                         <input 
                            type="text" 
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="图片 URL..."
                            className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">也可以直接在编辑器中粘贴图片自动设置为封面。</p>
                </div>

                 {/* Tags */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <TagIcon size={16} />
                        标签
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, idx) => (
                            <span 
                                key={idx} 
                                className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getTagColorClasses(tag.color)}`}
                            >
                                {tag.label}
                                <button onClick={() => removeTag(idx)} className="hover:text-red-600">
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className="space-y-2">
                         <div className="flex gap-1.5 flex-wrap p-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-5 h-5 rounded transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                                    style={{ backgroundColor: getCssColor(color) }}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={newTagLabel}
                                onChange={(e) => setNewTagLabel(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                placeholder="新标签..."
                                className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button 
                                onClick={addTag}
                                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            >
                                添加
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex items-center gap-2"
          >
            <Save size={16} />
            保存任务
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for color display
function getCssColor(color: string) {
  const map: Record<string, string> = {
    purple: '#a855f7',
    pink: '#ec4899',
    cyan: '#06b6d4',
    orange: '#f97316',
    green: '#22c55e',
    blue: '#3b82f6',
  };
  return map[color] || '#3b82f6';
}

function getTagColorClasses(color: string) {
  const map: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-red-100 text-red-500',
    cyan: 'bg-cyan-100 text-cyan-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  return map[color] || map.blue;
}
