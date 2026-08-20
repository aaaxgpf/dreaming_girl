export interface VocabularyItem {
  id: string;
  korean: string;
  hanja?: string;
  romaja: string;
  meaning: string;
  category: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  level?: string;
}

export const INITIAL_VOCABULARY: VocabularyItem[] = [
  // Daily Vocab
  {
    id: 'd1',
    korean: '안녕하세요',
    romaja: 'annyeonghaseyo',
    meaning: '你好',
    category: 'Daily Vocab',
    exampleSentence: '안녕하세요, 만나서 반갑습니다.',
    exampleTranslation: '你好，很高兴认识你。'
  },
  {
    id: 'd2',
    korean: '감사합니다',
    romaja: 'gamsahamnida',
    meaning: '谢谢',
    category: 'Daily Vocab',
    exampleSentence: '도와주셔서 감사합니다.',
    exampleTranslation: '谢谢你的帮助。'
  },
  {
    id: 'd3',
    korean: '물',
    romaja: 'mul',
    meaning: '水',
    category: 'Daily Vocab',
    exampleSentence: '물 한 잔 주세요.',
    exampleTranslation: '请给我一杯水。'
  },
  {
    id: 'd4',
    korean: '밥',
    romaja: 'bap',
    meaning: '饭 / 米饭',
    category: 'Daily Vocab',
    exampleSentence: '밥 먹었어요?',
    exampleTranslation: '吃饭了吗？'
  },
  {
    id: 'd5',
    korean: '친구',
    hanja: '親舊',
    romaja: 'chingu',
    meaning: '朋友',
    category: 'Daily Vocab',
    exampleSentence: '우리는 좋은 친구예요.',
    exampleTranslation: '我们是好朋友。'
  },

  // TOPIK Beginner
  {
    id: 'tb1',
    korean: '학교',
    hanja: '學校',
    romaja: 'hakgyo',
    meaning: '学校',
    category: 'TOPIK Beginner',
    exampleSentence: '저는 매일 학교에 갑니다.',
    exampleTranslation: '我每天去学校。'
  },
  {
    id: 'tb2',
    korean: '공부하다',
    hanja: '工夫--',
    romaja: 'gongbuhada',
    meaning: '学习',
    category: 'TOPIK Beginner',
    exampleSentence: '한국어를 열심히 공부해요.',
    exampleTranslation: '努力学习韩语。'
  },

  // TOPIK Intermediate
  {
    id: 'ti1',
    korean: '경험',
    hanja: '經驗',
    romaja: 'gyeongheom',
    meaning: '经验 / 经历',
    category: 'TOPIK Intermediate',
    exampleSentence: '다양한 경험을 쌓고 싶어요.',
    exampleTranslation: '想积累各种各样的经验。'
  },

  // TOPIK Advanced
  {
    id: 'ta1',
    korean: '모순',
    hanja: '矛盾',
    romaja: 'mosun',
    meaning: '矛盾',
    category: 'TOPIK Advanced',
    exampleSentence: '그의 말에는 모순이 있다.',
    exampleTranslation: '他的话里有矛盾。'
  },

  // K-POP Vocab
  {
    id: 'kp1',
    korean: '대박',
    romaja: 'daebak',
    meaning: '绝了 / 超赞 / 大发',
    category: 'K-POP Vocab',
    exampleSentence: '이번 신곡 진짜 대박이다!',
    exampleTranslation: '这次的新歌真是绝了！'
  },
  {
    id: 'kp2',
    korean: '최애',
    hanja: '最愛',
    romaja: 'choeae',
    meaning: '本命 / 最爱',
    category: 'K-POP Vocab',
    exampleSentence: '너의 최애 멤버는 누구야?',
    exampleTranslation: '你最喜欢的成员是谁？'
  },

  // Yonsei Vocab
  {
    id: 'y1',
    korean: '약속',
    hanja: '約束',
    romaja: 'yaksok',
    meaning: '约定 / 约会',
    category: 'Yonsei Vocab',
    exampleSentence: '오늘 친구와 약속이 있어요.',
    exampleTranslation: '今天和朋友有约。'
  },

  // SNU Vocab
  {
    id: 's1',
    korean: '발전',
    hanja: '發展',
    romaja: 'baljeon',
    meaning: '发展 / 进步',
    category: 'SNU Vocab',
    exampleSentence: '실력이 많이 발전했어요.',
    exampleTranslation: '实力进步了很多。'
  }
];
