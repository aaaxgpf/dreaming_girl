import React, { useEffect, useState } from 'react';

export type ThemeKey = 'wechat' | 'kakaotalk' | 'bubble' | 'midnight' | 'paper';

const THEMES: { key: ThemeKey; name: string; color: string }[] = [
  { key: 'wechat', name: 'WeChat Green', color: '#95EC69' },
  { key: 'kakaotalk', name: 'Kakao Yellow', color: '#FEE500' },
  { key: 'bubble', name: 'Bubble Lavender', color: '#8E7CFF' },
  { key: 'midnight', name: 'Midnight AMOLED', color: '#1F2430' },
  { key: 'paper', name: 'Vintage Paper', color: '#E3E0D8' },
];

export const ThemeSelector: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('wechat');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="theme-switcher-bar">
      {THEMES.map((theme) => (
        <button
          key={theme.key}
          className={`theme-btn ${currentTheme === theme.key ? 'active' : ''}`}
          onClick={() => setCurrentTheme(theme.key)}
          title={theme.name}
        >
          <span className="dot" style={{ backgroundColor: theme.color }} />
          <span>{theme.name.split(' ')[0]}</span>
        </button>
      ))}

      <style>{`
        .theme-switcher-bar {
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-card);
          border-radius: var(--card-radius);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .theme-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid #ddd;
          padding: 4px 8px;
          border-radius: var(--bubble-radius);
          cursor: pointer;
          font-size: 12px;
          color: var(--text-main);
        }
        .theme-btn.active {
          border-color: var(--accent-color);
          font-weight: 600;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};
