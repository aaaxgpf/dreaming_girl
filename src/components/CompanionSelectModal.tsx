import React, { useState } from 'react';
import { PERSONAS, Persona } from '../constants/personas';
import { X, ChevronLeft, ChevronRight, Volume2, Check, Sparkles } from 'lucide-react';

interface CompanionSelectModalProps {
  isOpen: boolean;
  currentPersonaId: string;
  onSelectPersona: (persona: Persona) => void;
  onClose: () => void;
}

export const CompanionSelectModal: React.FC<CompanionSelectModalProps> = ({
  isOpen,
  currentPersonaId,
  onSelectPersona,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = PERSONAS.findIndex((p) => p.id === currentPersonaId);
    return idx >= 0 ? idx : 0;
  });

  if (!isOpen) return null;

  const currentPersona = PERSONAS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : PERSONAS.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < PERSONAS.length - 1 ? prev + 1 : 0));
  };

  const playVoiceSample = (greeting: string) => {
    const pureKorean = greeting.replace(/\([^)]*\)/g, '').trim();
    if ('speechSynthesis' in window && pureKorean) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(pureKorean);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="app-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bg-card)',
          padding: '20px',
          position: 'relative',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题与关闭 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} color="var(--accent-color)" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'var(--text-main)' }}>
              选择伴聊角色 ({currentIndex + 1}/{PERSONAS.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', opacity: 0.6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 轮播主体区 */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* 左切换箭头 */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '-12px',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* 角色卡片 */}
          <div
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--card-radius)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}
          >
            <img
              src={currentPersona.avatar}
              alt={currentPersona.name}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>
              {currentPersona.title}
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', opacity: 0.7, color: 'var(--text-main)' }}>
              {currentPersona.tagline}
            </p>

            <div
              className="chat-bubble"
              style={{
                background: 'var(--bg-card)',
                padding: '10px 14px',
                fontSize: '13px',
                border: '1px solid var(--border-color)',
                textAlign: 'left',
                lineHeight: 1.4,
                marginBottom: '12px'
              }}
            >
              {currentPersona.greeting}
            </div>

            <button
              onClick={() => playVoiceSample(currentPersona.greeting)}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--bubble-radius)',
                padding: '6px 12px',
                fontSize: '12px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Volume2 size={14} /> 试听开场语音
            </button>
          </div>

          {/* 右切换箭头 */}
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '-12px',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 底部确认选择按钮 */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => {
              onSelectPersona(currentPersona);
              onClose();
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--bubble-radius)',
              background: 'var(--bubble-sent)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} />
            <span>确认与 {currentPersona.koreanName} 对话</span>
          </button>
        </div>
      </div>
    </div>
  );
};
