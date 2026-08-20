import React, { useState, useEffect } from 'react';
import { Persona, Message } from '../types';
import { sanitizeForMiniMaxTTS, playMiniMaxVoice } from '../utils/audioPipeline';

interface Props {
  persona: Persona;
  onBack: () => void;
}

export const ChatWindow: React.FC<Props> = ({ persona, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // 首次进入自动发送问候语
    setMessages([
      {
        id: 'msg_0',
        sender: 'persona',
        text: persona.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    playMiniMaxVoice(persona.greeting, persona.voiceId);
  }, [persona]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // 模拟回复
    setTimeout(() => {
      const replyText = `그래, "${userMsg.text}" 말이지? 나도 그렇게 생각해! (是的，你说“${userMsg.text}”吗？我也这么觉得！)`;
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now() + 1}`,
          sender: 'persona',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playMiniMaxVoice(replyText, persona.voiceId);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* 聊天顶栏 */}
      <div
        className="app-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          ← 切换人物
        </button>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>{persona.title}</div>
        <div style={{ width: '40px' }} />
      </div>

      {/* 消息区域 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                className="chat-bubble"
                style={{
                  maxWidth: '75%',
                  padding: '8px 12px',
                  background: isUser ? 'var(--bubble-sent)' : 'var(--bubble-received)',
                  border: '1px solid var(--border-color)',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  wordBreak: 'break-word'
                }}
              >
                {m.text}
                {!isUser && (
                  <button
                    onClick={() => playMiniMaxVoice(m.text, persona.voiceId)}
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      background: 'none',
                      border: 'none',
                      fontSize: '11px',
                      opacity: 0.6,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    🔊 播放纯韩语语音
                  </button>
                )}
              </div>
              <span style={{ fontSize: '10px', opacity: 0.4, marginTop: '2px' }}>{m.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* 输入栏 */}
      <div style={{ padding: '12px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 'var(--bubble-radius)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '13px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '8px 16px',
            background: 'var(--bubble-sent)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--bubble-radius)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-main)'
          }}
        >
          전송 / 发送
        </button>
      </div>
    </div>
  );
};
