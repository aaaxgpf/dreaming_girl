import React, { useState } from 'react';
import { ONBOARDING_PERSONAS, Persona } from '../constants/personas';
import { sanitizeForMiniMaxTTS } from '../utils/audioPipeline';

interface OnboardingDeckProps {
  onSelectPersona: (persona: Persona) => void;
}

export const OnboardingDeck: React.FC<OnboardingDeckProps> = ({ onSelectPersona }) => {
  const [selectedId, setSelectedId] = useState<string>(ONBOARDING_PERSONAS[0].id);

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-header">
        <h2>대화 상대 선택 / 选择对话人物</h2>
        <p>함께 대화하고 싶은 멤버를 선택해 주세요.</p>
      </div>

      <div className="card-deck-grid">
        {ONBOARDING_PERSONAS.map((persona) => {
          const isSelected = persona.id === selectedId;
          const koreanGreeting = sanitizeForMiniMaxTTS(persona.greeting);

          return (
            <div
              key={persona.id}
              className={`app-card persona-card ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedId(persona.id)}
            >
              <div className="persona-info">
                <h3 className="persona-title">{persona.title}</h3>
                <span className="voice-tag">Voice: {persona.voiceId}</span>
              </div>
              <div className="greeting-box chat-bubble">
                <p className="korean-text">{koreanGreeting}</p>
                <p className="translation-text">
                  {persona.greeting.match(/\(([^)]+)\)/)?.[1] || ''}
                </p>
              </div>
              <button
                className="select-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPersona(persona);
                }}
              >
                시작하기 / 开始对话
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        .onboarding-overlay {
          padding: 24px;
          background: var(--bg-primary);
          min-height: 100vh;
          box-sizing: border-box;
          font-family: var(--font-wechat);
        }
        .onboarding-header {
          text-align: center;
          margin-bottom: 24px;
          color: var(--text-main);
        }
        .onboarding-header h2 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .onboarding-header p {
          font-size: 13px;
          opacity: 0.7;
        }
        .card-deck-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .persona-card {
          background: var(--bg-card);
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          cursor: pointer;
          border: 1px solid transparent;
          transition: border-color 0.2s ease;
        }
        .persona-card.active {
          border-color: var(--accent-color);
        }
        .persona-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-main);
          margin: 0 0 4px 0;
        }
        .voice-tag {
          font-size: 11px;
          color: #888;
        }
        .greeting-box {
          background: var(--bg-primary);
          padding: 10px 12px;
          margin: 12px 0;
        }
        .korean-text {
          font-size: 13px;
          color: var(--text-main);
          margin: 0;
          font-weight: 500;
        }
        .translation-text {
          font-size: 11px;
          color: #777;
          margin: 4px 0 0 0;
        }
        .select-btn {
          width: 100%;
          padding: 8px;
          border: none;
          background: var(--accent-color);
          color: #fff;
          font-size: 13px;
          border-radius: var(--bubble-radius);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
