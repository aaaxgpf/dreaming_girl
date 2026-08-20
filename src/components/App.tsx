import React, { useState, useEffect } from 'react';
import { PERSONAS, Persona } from './constants/personas';
import { CompanionChat } from './components/CompanionChat';
import { CompanionSelectModal } from './components/CompanionSelectModal';
import { FlashcardsView } from './components/FlashcardsView';
import { MessageSquare, BookOpen, Palette, Users } from 'lucide-react';
import './styles/theme.css';

type ThemeKey = 'wechat' | 'kakaotalk' | 'bubble' | 'midnight' | 'paper';
type TabKey = 'chat' | 'flashcards';

export const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('wechat');
  const [currentTab, setCurrentTab] = useState<TabKey>('chat');
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const themes: { key: ThemeKey; name: string }[] = [
    { key: 'wechat', name: 'WeChat' },
    { key: 'kakaotalk', name: 'Kakao' },
    { key: 'bubble', name: 'Bubble' },
    { key: 'midnight', name: 'Midnight' },
    { key: 'paper', name: 'Paper' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* 顶部全局导航栏 */}
      <header
        style={{
          padding: '10px 16px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)' }}>Dreaming Girl</span>
          {/* Tab 切换 */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setCurrentTab('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: 'var(--card-radius)',
                background: currentTab === 'chat' ? 'var(--bubble-sent)' : 'transparent',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              <MessageSquare size={13} /> 对话
            </button>
            <button
              onClick={() => setCurrentTab('flashcards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: 'var(--card-radius)',
                background: currentTab === 'flashcards' ? 'var(--bubble-sent)' : 'transparent',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              <BookOpen size={13} /> 词书
            </button>
          </div>
        </div>

        {/* 角色与主题控制栏 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsSelectModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: 'var(--card-radius)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <Users size={13} />
            <span>{selectedPersona.koreanName}</span>
          </button>

          {/* 5 款主题切换 */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => setCurrentTheme(t.key)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--card-radius)',
                  border: `1px solid ${currentTheme === t.key ? 'var(--text-main)' : 'var(--border-color)'}`,
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '11px',
                  fontWeight: currentTheme === t.key ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 主屏区域 */}
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {currentTab === 'chat' ? (
          <CompanionChat
            persona={selectedPersona}
            onBack={() => setIsSelectModalOpen(true)}
            onOpenSelectModal={() => setIsSelectModalOpen(true)}
          />
        ) : (
          <div style={{ height: 'calc(100vh - 58px)', overflowY: 'auto' }}>
            <FlashcardsView />
          </div>
        )}
      </main>

      {/* 角色选择浮层弹窗 */}
      <CompanionSelectModal
        isOpen={isSelectModalOpen}
        currentPersonaId={selectedPersona.id}
        onSelectPersona={(persona) => setSelectedPersona(persona)}
        onClose={() => setIsSelectModalOpen(false)}
      />
    </div>
  );
};

export default App;
