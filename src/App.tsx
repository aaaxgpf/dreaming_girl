import React, { useState, useEffect } from 'react';
import { PERSONAS, Persona, DEFAULT_PERSONA } from './constants/personas';
import { CompanionChat } from './components/CompanionChat';
import { CompanionSelectModal } from './components/CompanionSelectModal';
import { FlashcardsView } from './components/FlashcardsView';
import { MessageSquare, BookOpen, Users } from 'lucide-react';
import './styles/theme.css';

export type ThemeKey = 'wechat' | 'kakaotalk' | 'bubble' | 'midnight' | 'paper';
export type TabKey = 'chat' | 'flashcards';

export const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('wechat');
  const [currentTab, setCurrentTab] = useState<TabKey>('chat');

  // 安全状态初始化：永远保证默认值有效，防止 null / undefined 引起崩溃
  const [selectedPersona, setSelectedPersona] = useState<Persona>(() => {
    return (PERSONAS && PERSONAS.length > 0) ? PERSONAS[0] : DEFAULT_PERSONA;
  });

  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const activePersona = selectedPersona || DEFAULT_PERSONA;
  const avatarSrc = activePersona?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const koreanName = activePersona?.koreanName || activePersona?.name || '伴聊伙伴';

  const themes: { key: ThemeKey; name: string }[] = [
    { key: 'wechat', name: 'WeChat' },
    { key: 'kakaotalk', name: 'Kakao' },
    { key: 'bubble', name: 'Bubble' },
    { key: 'midnight', name: 'Midnight' },
    { key: 'paper', name: 'Paper' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* 顶部全局导航 */}
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

        {/* 角色与主题控制 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsSelectModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--card-radius)',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt={koreanName} style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <Users size={13} />
            )}
            <span>{koreanName}</span>
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
            persona={activePersona}
            onBack={() => setIsSelectModalOpen(true)}
            onOpenSelectModal={() => setIsSelectModalOpen(true)}
          />
        ) : (
          <div style={{ height: 'calc(100vh - 58px)', overflowY: 'auto' }}>
            <FlashcardsView />
          </div>
        )}
      </main>

      {/* 角色选择弹窗 */}
      <CompanionSelectModal
        isOpen={isSelectModalOpen}
        currentPersonaId={activePersona?.id}
        onSelectPersona={(p) => setSelectedPersona(p || DEFAULT_PERSONA)}
        onClose={() => setIsSelectModalOpen(false)}
      />
    </div>
  );
};

export default App;
