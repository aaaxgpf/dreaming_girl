export interface Companion {
  [key: string]: any;
  id?: string;
  name_zh?: string;
  name_ko?: string;
  remark?: string; // 用户自定义备注
  avatar?: string; // Emoji
  customAvatarUrl?: string; // 自定义头像
  persona_prompt?: string;
  greeting_zh?: string;
  greeting_ko?: string;
  status_msg?: string;
  system_prompt_appendix?: string;
  tts_voice?: string;
  tts_rate?: number;
  tts_pitch?: number;
}

export interface ChatMessage {
  [key: string]: any;
  id?: string;
  role?: 'user' | 'model' | 'assistant';
  content?: string;
  timestamp?: number;
  translation_zh?: string;
  translation_en?: string;
  vocabulary?: VocabItem[];
  grammar_points?: GrammarPointItem[];
  learning_tip?: string;
  isBookmarked?: boolean;
  isRead?: boolean; // For tracking if user has read it
}

export interface VocabItem {
  [key: string]: any;
  id?: string;
  word?: string;
  hangul?: string;
  type?: string;
  meaning_zh?: string;
  meaning_en?: string;
  isBookmarked?: boolean;
  masteryLevel?: number;
  source?: string; // e.g., 'Yonsei Vol.1'
}

export interface GrammarPointItem {
  [key: string]: any;
  id?: string;
  point?: string;
  explanation_zh?: string;
  explanation_en?: string;
  example_ko?: string;
  example_zh?: string;
}

export interface GrammarCard {
  [key: string]: any;
  id?: string;
  title?: string;
  level?: string;
  description?: string;
  formula?: string;
  examples?: { ko: string; zh?: string; en?: string }[];
  isBookmarked?: boolean;
}

export interface DictationItem {
  [key: string]: any;
  id?: string;
  korean?: string;
  translation_zh?: string;
  translation_en?: string;
  audioUrl?: string;
}

export interface SpeakingTask {
  [key: string]: any;
  id?: string;
  title?: string;
  scenario?: string;
  target_phrase?: string;
  translation_zh?: string;
}

export interface CompanionSparkRecord {
  [key: string]: any;
  companionId?: string;
  sparkCount?: number;
  lastIgnited?: number;
  streakDays?: number;
  lastInteractionDate?: string;
  isIgnitedToday?: boolean;
  totalInteractions?: number;
}

export interface AppSettings {
  [key: string]: any;
  theme?: 'default' | 'kkt' | 'wechat';
  dailyVocabGoal?: number;
  languageMode?: 'bilingual' | 'zh' | 'en';
}

export interface UserProfile {
  [key: string]: any;
  name?: string;
  status?: string;
  avatar?: string;
  avatarUrl?: string;
}

export interface GrammarAnalysisResult {
  [key: string]: any;
}
export interface SpeakingEvaluation {
  [key: string]: any;
}
