import React, { useState, useEffect, useRef } from 'react';
import { Persona, DEFAULT_PERSONA } from '../constants/personas';
import { sendChatMessageToGemini } from '../services/gemini';
import { Send, Volume2, ArrowLeft, RefreshCw, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'persona';
  text: string;
  timestamp: string;
}

interface CompanionChatProps {
  persona?: Persona | null;
  onBack: () => void;
  onOpenSelectModal: () => void;
}

export const CompanionChat: React.FC<CompanionChatProps> = ({
  persona: rawPersona,
  onBack,
  onOpenSelectModal
}) => {
  // 安全守护：若传入为空，则自动回退至默认角色，坚决不崩溃
  const persona: Persona = rawPersona || DEFAULT_PERSONA;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 当角色切换或首次加载时，重置开场白
  useEffect(() => {
    const greetingText = persona?.greeting || '안녕하세요! (你好！)';
    setMessages([
      {
        id: `init_${Date.now()}`,
        role: 'persona',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [persona?.id]);

  // 消息自动滚底
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 纯韩语过滤与语音合成
  const handlePlayVoice = (text: string) => {
    const pureKorean = (text || '').replace(/\([^)]*\)/g, '').trim();
    if ('speechSynthesis' in window && pureKorean) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(pureKorean);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const reply = await sendChatMessageToGemini(persona, messages, userText);
      const personaMsg: ChatMessage = {
        id: `persona_${Date.now()}`,
        role: 'persona',
        text: reply || '네, 그렇군요! (是的，原来是这样！)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, personaMsg]);
    } catch (err) {
      console.error('[CompanionChat Error]', err);
    } finally {
      setIsTyping(false);
    }
  };

  const avatarSrc = persona?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const displayName = persona?.title || persona?.name || '伴聊好友';
  const taglineText = persona?.tagline || 'AI 伴聊角色';
  const koreanName = persona?.koreanName || '친구';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      {/* 顶部导航栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          borderRadius: 'var(--card-radius) var(--card-radius) 0 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={displayName}
              onError={(e) => {
                // 图片加载失败时优雅降级
                (e.target as HTMLElement).style.display = 'none';
              }}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
          )}

          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{displayName}</div>
            <div style={{ fontSize: '11px', opacity: 0.6, color: 'var(--text-main)' }}>{taglineText}</div>
          </div>
        </div>

        <button
          onClick={onOpenSelectModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--bubble-radius)',
            padding: '6px 10px',
            fontSize: '12px',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={13} />
          <span>切换角色</span>
        </button>
      </div>

      {/* 聊天气泡列表 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: 'var(--bubble-radius)',
                  background: isUser ? 'var(--bubble-sent)' : 'var(--bubble-received)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                <div>{msg.text}</div>
                {!isUser && (
                  <button
                    onClick={() => handlePlayVoice(msg.text)}
                    style={{
                      marginTop: '6px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      opacity: 0.6,
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    <Volume2 size={13} /> 语音朗读
                  </button>
                )}
              </div>
              <span style={{ fontSize: '10px', opacity: 0.45, marginTop: '3px' }}>{msg.timestamp}</span>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6, fontSize: '12px', padding: '4px 0' }}>
            <Sparkles size={14} className="animate-spin" />
            <span>{koreanName}正在输入中...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入框 */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '8px'
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`给 ${koreanName} 发送消息...`}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 'var(--bubble-radius)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-main)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
          style={{
            padding: '10px 18px',
            background: 'var(--bubble-sent)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--bubble-radius)',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: inputText.trim() ? 1 : 0.6
          }}
        >
          <Send size={15} />
          <span>发送</span>
        </button>
      </div>
    </div>
  );
};
