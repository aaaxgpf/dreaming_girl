import React, { useState, useEffect } from 'react';
import { Persona, ThemeKey } from './types';
import { ThemeSelector } from './components/ThemeSelector';
import { OnboardingDeck } from './components/OnboardingDeck';
import { ChatWindow } from './components/ChatWindow';

export const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('wechat');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部全局导航 / 主题切换 */}
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
        <div style={{ fontWeight: 600, fontSize: '14px' }}>K-Persona Chat Studio</div>
        <ThemeSelector currentTheme={currentTheme} onSelectTheme={setCurrentTheme} />
      </header>

      {/* 主屏切换 */}
      <main style={{ flex: 1 }}>
        {!selectedPersona ? (
          <OnboardingDeck onSelect={(p) => setSelectedPersona(p)} />
        ) : (
          <ChatWindow persona={selectedPersona} onBack={() => setSelectedPersona(null)} />
        )}
      </main>
    </div>
  );
};
export default App;
