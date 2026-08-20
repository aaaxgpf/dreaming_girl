import React, { useState, useMemo } from 'react';
import { VOCAB_CATEGORIES, VOCABULARY_LIST, VocabItem } from '../data/vocabulary';
import { Volume2, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Lists');
  const [learnedMap, setLearnedMap] = useState<Record<string, boolean>>({});

  // 过滤逻辑：支持全量展示与分类精准匹配
  const filteredList = useMemo(() => {
    if (selectedCategory === 'All Lists') {
      return VOCABULARY_LIST;
    }
    return VOCABULARY_LIST.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const toggleLearned = (id: string) => {
    setLearnedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const playPronunciation = (korean: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(korean);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      {/* 头部标题 */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={22} color="var(--accent-color)" />
        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>
          단어장 / 词书卡片
        </h2>
      </div>

      {/* 分类标签横向滑动条 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px'
        }}
      >
        {VOCAB_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                whiteSpace: 'nowrap',
                padding: '6px 14px',
                borderRadius: 'var(--card-radius)',
                border: `1px solid ${isActive ? 'var(--text-main)' : 'var(--border-color)'}`,
                background: isActive ? 'var(--bubble-sent)' : 'var(--bg-card)',
                color: 'var(--text-main)',
                fontWeight: isActive ? 600 : 'normal',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 词汇卡片网格 */}
      {filteredList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.6 }}>
          <Layers size={36} style={{ margin: '0 auto 10px' }} />
          <p>해당 카테고리에 단어가 없습니다. / 暂无该分类词汇</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredList.map((item: VocabItem) => {
            const isLearned = learnedMap[item.id];
            return (
              <div
                key={item.id}
                className="app-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  opacity: isLearned ? 0.75 : 1
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>{item.korean}</span>
                        {item.hanja && <span style={{ fontSize: '12px', opacity: 0.5 }}>({item.hanja})</span>}
                      </div>
                      <span style={{ fontSize: '12px', opacity: 0.6 }}>{item.pronunciation}</span>
                    </div>

                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>
                    {item.chinese}
                  </div>

                  <div
                    className="chat-bubble"
                    style={{
                      background: 'var(--bg-primary)',
                      padding: '8px 10px',
                      marginTop: '10px',
                      fontSize: '12px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{item.exampleKorean}</div>
                    <div style={{ opacity: 0.7, marginTop: '2px' }}>{item.exampleChinese}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => playPronunciation(item.korean)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '4px 0'
                    }}
                  >
                    <Volume2 size={15} /> 发音
                  </button>

                  <button
                    onClick={() => toggleLearned(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: isLearned ? '#10B981' : 'var(--text-main)',
                      opacity: isLearned ? 1 : 0.6,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={15} /> {isLearned ? '已掌握' : '标为已学'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
