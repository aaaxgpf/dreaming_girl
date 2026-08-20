export interface VocabItem {
  id: string;
  category: string; // 对应分类标签
  korean: string;
  hanja?: string;
  pronunciation: string;
  chinese: string;
  exampleKorean: string;
  exampleChinese: string;
}

export const VOCAB_CATEGORIES = [
  'All Lists',
  'TOPIK Beginner',
  'TOPIK Intermediate',
  'TOPIK Advanced',
  'Yonsei Vocab',
  'SNU Vocab',
  'K-POP Vocab',
  'Daily Vocab'
] as const;

export const VOCABULARY_LIST: VocabItem[] = [
  // 1. Daily Vocab
  {
    id: 'v_daily_1',
    category: 'Daily Vocab',
    korean: '약속',
    hanja: '約束',
    pronunciation: '[약쏙]',
    chinese: '约定、约会',
    exampleKorean: '오늘 저녁에 친구랑 약속이 있어요.',
    exampleChinese: '今天晚上我和朋友有约。'
  },
  {
    id: 'v_daily_2',
    category: 'Daily Vocab',
    korean: '퇴근',
    hanja: '退勤',
    pronunciation: '[퇴ː근]',
    chinese: '下班',
    exampleKorean: '몇 시에 퇴근하세요?',
    exampleChinese: '您几点下班？'
  },
  {
    id: 'v_daily_3',
    category: 'Daily Vocab',
    korean: '산책',
    hanja: '散策',
    pronunciation: '[산책]',
    chinese: '散步',
    exampleKorean: '날씨가 좋아서 공원에서 산책했어요.',
    exampleChinese: '天气很好，所以在公园散了步。'
  },
  {
    id: 'v_daily_4',
    category: 'Daily Vocab',
    korean: '배달',
    hanja: '配達',
    pronunciation: '[배달]',
    chinese: '外卖、配送',
    exampleKorean: '저녁으로 치킨을 배달시켰어요.',
    exampleChinese: '晚餐点了炸鸡外卖。'
  },
  {
    id: 'v_daily_5',
    category: 'Daily Vocab',
    korean: '충전',
    hanja: '充電',
    pronunciation: '[충전]',
    chinese: '充电、充值',
    exampleKorean: '휴대폰 배터리를 충전해야 해요.',
    exampleChinese: '手机得充电了。'
  },

  // 2. TOPIK Beginner
  {
    id: 'v_beg_1',
    category: 'TOPIK Beginner',
    korean: '선생님',
    pronunciation: '[선생님]',
    chinese: '老师',
    exampleKorean: '선생님, 질문이 있습니다.',
    exampleChinese: '老师，我有一个问题。'
  },
  {
    id: 'v_beg_2',
    category: 'TOPIK Beginner',
    korean: '도서관',
    hanja: '圖書館',
    pronunciation: '[도서관]',
    chinese: '图书馆',
    exampleKorean: '주말에 도서관에서 공부해요.',
    exampleChinese: '周末在图书馆学习。'
  },
  {
    id: 'v_beg_3',
    category: 'TOPIK Beginner',
    korean: '식당',
    hanja: '食堂',
    pronunciation: '[식땅]',
    chinese: '餐厅、食堂',
    exampleKorean: '학교 앞 식당에서 밥을 먹었어요.',
    exampleChinese: '在学校前面的餐厅吃了饭。'
  },
  {
    id: 'v_beg_4',
    category: 'TOPIK Beginner',
    korean: '감사하다',
    hanja: '感謝--',
    pronunciation: '[감사하다]',
    chinese: '感谢',
    exampleKorean: '도와주셔서 진심으로 감사합니다.',
    exampleChinese: '非常感谢您的帮助。'
  },
  {
    id: 'v_beg_5',
    category: 'TOPIK Beginner',
    korean: '사과',
    pronunciation: '[사과]',
    chinese: '苹果 / 道歉',
    exampleKorean: '맛있는 사과를 샀어요.',
    exampleChinese: '买了美味的苹果。'
  },

  // 3. TOPIK Intermediate
  {
    id: 'v_int_1',
    category: 'TOPIK Intermediate',
    korean: '경험',
    hanja: '經驗',
    pronunciation: '[경험]',
    chinese: '经验、经历',
    exampleKorean: '다양한 경험을 쌓는 것이 중요합니다.',
    exampleChinese: '积累多样化的经验非常重要。'
  },
  {
    id: 'v_int_2',
    category: 'TOPIK Intermediate',
    korean: '환경',
    hanja: '環境',
    pronunciation: '[환경]',
    chinese: '环境',
    exampleKorean: '자연환경을 보호해야 합니다.',
    exampleChinese: '我们必须保护自然环境。'
  },
  {
    id: 'v_int_3',
    category: 'TOPIK Intermediate',
    korean: '성공',
    hanja: '成功',
    pronunciation: '[성공]',
    chinese: '成功',
    exampleKorean: '노력 끝에 프로젝트를 성공시켰다.',
    exampleChinese: '经过努力终于使项目获得了成功。'
  },
  {
    id: 'v_int_4',
    category: 'TOPIK Intermediate',
    korean: '결과',
    hanja: '結果',
    pronunciation: '[결과]',
    chinese: '结果',
    exampleKorean: '좋은 결과를 기대하고 있어요.',
    exampleChinese: '正期待着好的结果。'
  },
  {
    id: 'v_int_5',
    category: 'TOPIK Intermediate',
    korean: '발전',
    hanja: '發展',
    pronunciation: '[발쩐]',
    chinese: '发展、进步',
    exampleKorean: '한국어 실력이 많이 발전했어요.',
    exampleChinese: '韩语水平进步了许多。'
  },

  // 4. TOPIK Advanced
  {
    id: 'v_adv_1',
    category: 'TOPIK Advanced',
    korean: '불가피하다',
    hanja: '不可避--',
    pronunciation: '[불가피하다]',
    chinese: '不可避免的',
    exampleKorean: '일정 변경이 불가피한 상황입니다.',
    exampleChinese: '日程变更处于不可避免的情况。'
  },
  {
    id: 'v_adv_2',
    category: 'TOPIK Advanced',
    korean: '추진하다',
    hanja: '推進--',
    pronunciation: '[추진하다]',
    chinese: '推进、推动',
    exampleKorean: '새로운 정책을 적극적으로 추진하고 있다.',
    exampleChinese: '正在积极推进新政策。'
  },
  {
    id: 'v_adv_3',
    category: 'TOPIK Advanced',
    korean: '타협',
    hanja: '妥協',
    pronunciation: '[타협]',
    chinese: '妥协',
    exampleKorean: '양측은 오랜 협상 끝에 타협점에 도달했다.',
    exampleChinese: '双方经过漫长谈判达成了妥协点。'
  },

  // 5. K-POP Vocab
  {
    id: 'v_kpop_1',
    category: 'K-POP Vocab',
    korean: '컴백',
    pronunciation: '[컴백]',
    chinese: '回归 (Comeback)',
    exampleKorean: '다음 달에 정규 앨범으로 컴백해요!',
    exampleChinese: '下个月带着正规专辑回归！'
  },
  {
    id: 'v_kpop_2',
    category: 'K-POP Vocab',
    korean: '음방',
    pronunciation: '[음방]',
    chinese: '音乐打歌节目 (음악방송)',
    exampleKorean: '오늘 음방 1위 후보에 올랐어요.',
    exampleChinese: '今天登上了音放一位候补。'
  },
  {
    id: 'v_kpop_3',
    category: 'K-POP Vocab',
    korean: '팬싸',
    pronunciation: '[팬싸]',
    chinese: '粉丝签名会 (팬사인회)',
    exampleKorean: '주말에 대면 팬싸에 다녀왔어.',
    exampleChinese: '周末去了线下签售会。'
  },
  {
    id: 'v_kpop_4',
    category: 'K-POP Vocab',
    korean: '응원봉',
    hanja: '應援棒',
    pronunciation: '[응원봉]',
    chinese: '应援棒',
    exampleKorean: '콘서트에 응원봉을 챙겨갔어요.',
    exampleChinese: '带了应援棒去看演唱会。'
  },

  // 6. Yonsei Vocab
  {
    id: 'v_yonsei_1',
    category: 'Yonsei Vocab',
    korean: '수강신청',
    hanja: '受講申請',
    pronunciation: '[수강신청]',
    chinese: '选课',
    exampleKorean: '내일 아침 9시에 수강신청이 시작됩니다.',
    exampleChinese: '明天上午9点开始选课。'
  },
  {
    id: 'v_yonsei_2',
    category: 'Yonsei Vocab',
    korean: '장학금',
    hanja: '奬學金',
    pronunciation: '[장학끔]',
    chinese: '奖学金',
    exampleKorean: '이번 학기에 성적 장학금을 받았어요.',
    exampleChinese: '这学期拿到了成绩奖学金。'
  },

  // 7. SNU Vocab
  {
    id: 'v_snu_1',
    category: 'SNU Vocab',
    korean: '학술대회',
    hanja: '學術大會',
    pronunciation: '[학쑬대회]',
    chinese: '学术研讨会',
    exampleKorean: '국제 학술대회에서 논문을 발표했습니다.',
    exampleChinese: '在国际学术研讨会上发表了论文。'
  },
  {
    id: 'v_snu_2',
    category: 'SNU Vocab',
    korean: '과제',
    hanja: '課題',
    pronunciation: '[과제]',
    chinese: '课题、作业',
    exampleKorean: '오늘 밤까지 제출해야 하는 과제가 있어요.',
    exampleChinese: '有今晚之前必须提交的课题作业。'
  }
];
