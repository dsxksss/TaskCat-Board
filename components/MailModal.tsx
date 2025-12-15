
import React from 'react';
import { X, Mail, Check, Circle } from 'lucide-react';

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MailModal: React.FC<MailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const messages = [
    { id: 1, from: '系统通知', subject: '欢迎使用 TaskCat Board', preview: '开始管理你的第一个任务吧！你可以拖拽卡片...', time: '刚刚', unread: true },
    { id: 2, from: '团队助手', subject: '每周进度汇报提醒', preview: '别忘了在周五前提交本周的任务进度...', time: '1小时前', unread: true },
    { id: 3, from: '安全中心', subject: '新设备登录提醒', preview: '您的账号在新的浏览器上登录了...', time: '昨天', unread: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[600px] flex flex-col overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Mail size={20} className="text-gray-700" />
            <h2 className="text-lg font-bold text-gray-800">收件箱</h2>
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
            {messages.map(msg => (
                <div key={msg.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${msg.unread ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            <span className={`font-medium text-sm ${msg.unread ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{msg.from}</span>
                        </div>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <h4 className={`text-sm mb-1 ${msg.unread ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{msg.subject}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{msg.preview}</p>
                </div>
            ))}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1">全部标记为已读</button>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1">查看全部消息</button>
        </div>
      </div>
    </div>
  );
};
