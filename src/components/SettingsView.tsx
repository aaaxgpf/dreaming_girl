import React from 'react';
import { Settings, Palette, Target, Globe, Save } from 'lucide-react';
import { AppSettings, UserProfile } from '../types';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  userProfile: UserProfile;
}

export const SettingsView: React.FC<Props> = ({ settings, onUpdateSettings, userProfile }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32 space-y-8 animate-in fade-in duration-300 h-full overflow-y-auto">
      <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
        <Settings className="text-stone-800" size={28} />
        <h1 className="text-2xl font-bold text-stone-800">Settings</h1>
      </div>

      {/* User Info Readonly */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
         <div className="w-16 h-16 rounded-[20px] bg-stone-100 text-stone-800 text-[#FFEB3B] flex items-center justify-center font-bold text-2xl shadow-sm overflow-hidden shrink-0">
           {userProfile.avatarUrl ? <img src={userProfile.avatarUrl} className="w-full h-full object-cover" /> : userProfile.avatar}
         </div>
         <div>
           <div className="font-bold text-lg text-stone-800">{userProfile.name}</div>
           <div className="text-sm text-stone-500">{userProfile.status}</div>
         </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
        <div className="flex items-center gap-2 text-stone-800 font-bold mb-2">
          <Palette size={20} className="text-stone-800" />
          <span>App Theme</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => onUpdateSettings({...settings, theme: 'default'})}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${settings.theme === 'default' ? 'border-[#3E2723] bg-transparent' : 'border-transparent bg-stone-50 hover:bg-stone-50'}`}
          >
            <div className="w-12 h-12 rounded-full bg-transparent border border-stone-300 flex items-center justify-center text-stone-800">
              Aa
            </div>
            <span className="font-bold text-sm">Default (Light)</span>
          </button>
          
          <button 
            onClick={() => onUpdateSettings({...settings, theme: 'kkt'})}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${settings.theme === 'kkt' ? 'border-[#FFEB3B] bg-[#FFEB3B]/10' : 'border-transparent bg-stone-50 hover:bg-stone-50'}`}
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#FFEB3B] flex items-center justify-center text-stone-800 font-bold">
              TALK
            </div>
            <span className="font-bold text-sm">KakaoTalk</span>
          </button>
          <button 
            onClick={() => onUpdateSettings({...settings, theme: 'wechat'})}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${settings.theme === 'wechat' ? 'border-[#95EC69] bg-[#EDEDED]' : 'border-transparent bg-stone-50 hover:bg-stone-50'}`}
          >
            <div className="w-12 h-12 rounded-[16px] bg-[#95EC69] flex items-center justify-center text-stone-800 font-bold">
              WeChat
            </div>
            <span className="font-bold text-sm">WeChat</span>
          </button>
        </div>
      </div>

      {/* Study Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
        <div className="flex items-center gap-2 text-stone-800 font-bold mb-2">
          <Target size={20} className="text-stone-800" />
          <span>Study Goals</span>
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-2">Daily Vocab Goal</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="10"
              value={settings.dailyVocabGoal}
              onChange={(e) => onUpdateSettings({...settings, dailyVocabGoal: Number(e.target.value)})}
              className="flex-1 accent-stone-800"
            />
            <span className="font-bold text-stone-800 w-12 text-right">{settings.dailyVocabGoal} words</span>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
        <div className="flex items-center gap-2 text-stone-800 font-bold mb-2">
          <Globe size={20} className="text-stone-800" />
          <span>Translation Language</span>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => onUpdateSettings({...settings, languageMode: 'zh'})}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${settings.languageMode === 'zh' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Chinese
          </button>
          <button
            onClick={() => onUpdateSettings({...settings, languageMode: 'en'})}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${settings.languageMode === 'en' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
          >
            English
          </button>
          <button
            onClick={() => onUpdateSettings({...settings, languageMode: 'bilingual'})}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${settings.languageMode === 'bilingual' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Bilingual
          </button>
        </div>
      </div>
    </div>
  );
};
