
import React, { useState } from 'react';
import { X, Settings, Moon, Bell, Volume2, Shield, User } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-gray-700" />
            <h2 className="text-lg font-bold text-gray-800">设置</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
            {/* Account Section */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">账户</h3>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                        M
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-800">My User</div>
                        <div className="text-xs text-gray-500">user@example.com</div>
                    </div>
                    <button className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors">
                        编辑
                    </button>
                </div>
            </div>

            {/* Preferences */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">偏好设置</h3>
                
                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Bell size={18} /></div>
                        <span className="text-gray-700 font-medium">推送通知</span>
                    </div>
                    <button 
                        onClick={() => setNotifications(!notifications)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-500' : 'bg-gray-200'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${notifications ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Volume2 size={18} /></div>
                        <span className="text-gray-700 font-medium">应用音效</span>
                    </div>
                    <button 
                        onClick={() => setSound(!sound)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${sound ? 'bg-blue-500' : 'bg-gray-200'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${sound ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Moon size={18} /></div>
                        <span className="text-gray-700 font-medium">深色模式</span>
                    </div>
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-500' : 'bg-gray-200'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${darkMode ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            {/* Other */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">关于</h3>
                <div className="flex items-center gap-3 p-2 text-gray-600 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                    <Shield size={18} />
                    <span>隐私政策</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
