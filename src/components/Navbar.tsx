import React from 'react';
import { Persona, DEFAULT_PERSONA } from '../constants/personas';
import { MessageSquare, BookOpen, Users } from 'lucide-react';

interface NavbarProps {
  currentTab: 'chat' | 'flashcards';
  onTabChange: (tab: 'chat' | 'flashcards') => void;
  selectedPersona?: Persona | null;
  onOpenSelectModal: () => void;
  currentTheme: string;
  onThemeChange: (theme: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  selectedPersona,
  onOpenSelectModal,
  currentTheme,
  onThemeChange
}) => {
  const safePersona = selectedPersona || DEFAULT_PERSONA;
  const avatarSrc = safePersona?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const nameText = safePersona?.koreanName || safePersona?.name || 'Buddy';

  const themes = [
    { key: 'wechat', name: 'WeChat' },
    { key: 'kakaotalk', name: 'Kakao' },
    { key: 'bubble', name: 'Bubble' },
    { key: 'midnight', name: 'Midnight' },
    { key: 'paper', name: 'Paper' }
  ];

  return (
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
            onClick={() => onTabChange('chat')}
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
            onClick={() => onTabChange('flashcards')}
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenSelectModal}
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
            <img src={avatarSrc} alt={nameText} style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <Users size={13} />
          )}
          <span>{nameText}</span>
        </button>

        <div style={{ display: 'flex', gap: '4px' }}>
          {themes.map((t) => (
            <button
              key={t.key}
              onClick={() => onThemeChange(t.key)}
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
  );
};
