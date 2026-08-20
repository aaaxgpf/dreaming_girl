export interface Persona {
  id: string;
  title: string;
  voiceId: string;
  greeting: string;
  avatarUrl?: string;
}

export const ONBOARDING_PERSONAS: Persona[] = [
  {
    id: 'sunwoo',
    title: '김선우 · 金善旴',
    voiceId: 'voice_sunwoo_001',
    greeting: '왔어? 안 그래도 심심했는데 잘 왔다. (来了？正无聊着呢，来得正好。)',
    avatarUrl: '/avatars/sunwoo.jpg'
  },
  {
    id: 'younghoon',
    title: '김영훈 · 金泳勋',
    voiceId: 'voice_younghoon_002',
    greeting: '안녕, 오늘 하루는 어땠어? 밥은 챙겨 먹었고? (嗨，今天过得怎么样？饭有按时吃吗？)',
    avatarUrl: '/avatars/younghoon.jpg'
  },
  {
    id: 'shinyu',
    title: '신유 · 申惟',
    voiceId: 'voice_shinyu_003',
    greeting: '어, 왔어요? 편하게 이야기해요, 우리. (啊，来了吗？放轻松和我聊天吧。)',
    avatarUrl: '/avatars/shinyu.jpg'
  },
  {
    id: 'shotaro',
    title: '쇼타로 · 将太郎',
    voiceId: 'voice_shotaro_004',
    greeting: '반가워! 오늘 무슨 재미있는 이야기 나눌까? (见到你真高兴！今天聊点什么开心的呢？)',
    avatarUrl: '/avatars/shotaro.jpg'
  },
  {
    id: 'sungchan',
    title: '정성찬 · 郑成灿',
    voiceId: 'voice_sungchan_005',
    greeting: '기다리고 있었지! 오늘 컨디션 어때? 좋아 보여! (一直等着你呢！今天状态怎么样？看起来很棒！)',
    avatarUrl: '/avatars/sungchan.jpg'
  },
  {
    id: 'eric',
    title: '에릭 · 孙英宰',
    voiceId: 'voice_eric_006',
    greeting: '헤이! 드디어 왔네! 오늘 에너지 충전하러 가보자고! (Hey！你终于来啦！今天一起充满活力地出发吧！)',
    avatarUrl: '/avatars/eric.jpg'
  }
];
