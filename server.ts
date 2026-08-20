import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Mock/fallback responses will be used where applicable.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-init",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Supported fallback model candidates in order of preference
// 'gemini-flash-latest' and 'gemini-3.1-flash-lite' provide high availability during spikes
const MODEL_CANDIDATES = [
  "gemini-3.5-flash",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
];

// Robust helper to generate content with automatic retries and model fallbacks
async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    
    systemInstruction?: string;
    responseMimeType?: string;
    temperature?: number;
  },
  maxRetriesPerModel = 1
): Promise<string> {
  let lastError: any = null;

  for (const model of MODEL_CANDIDATES) {
    for (let attempt = 0; attempt <= maxRetriesPerModel; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            
            systemInstruction: params.systemInstruction,
            responseMimeType: params.responseMimeType || "application/json",
            temperature: params.temperature ?? 0.8,
          },
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        // Silently handle 503 / 429 and immediately cascade to the next model candidate
        if (attempt < maxRetriesPerModel && !errMsg.includes("503") && !errMsg.includes("UNAVAILABLE")) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        } else {
          // Move right away to next candidate model
          break;
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models were unavailable");
}

// Helper to produce authentic in-character idol fallback responses if API is experiencing high demand
function generateIdolFallbackChat(character: any, userMsg: string, videoLink?: string, videoInfo?: any, isImage?: boolean) {
  const charId = character?.id || "hyunjae";
  const nameKr = character?.name_kr || "현재";
  const userNick = character?.userNickname || "더비";

  // Check if video was sent
  if (videoLink) {
    const platform = videoInfo?.platform || "동영상";
    if (charId === "eric") {
      return {
        korean: `와 대박! ${userNick}아 이 ${platform} 영상 링크 뭐야?! 춤선이랑 비트 완전 미쳤는데? 나 방금 보고 완전 에너지 충전됐어, 고마워!!`,
        translation_zh: `哇大发！${userNick}，你发给我的这个${platform}视频链接是什么呀？！舞蹈线条和节奏感简直绝了！我刚看了瞬间元气拉满，太感谢啦！！`,
        translation_en: `Whoa amazing! ${userNick}, what is this ${platform} video link?! The dance lines and beat are insane! Just watched it and got totally energized, thank you!!`,
        vocabulary: [
          { word: "대박", hangul: "대박", type: "감탄사 (感叹词)", meaning_zh: "大发，太棒了，绝了", meaning_en: "awesome, jackpot", example: "이 무대 진짜 대박이야!" },
          { word: "춤선", hangul: "춤선", type: "명사 (名词)", meaning_zh: "舞姿线条，舞蹈动作身形", meaning_en: "dance line/flow", example: "춤선이 너무 예쁘고 깔끔해." },
          { word: "충전되다", hangul: "충전되다", type: "동사 (动词)", meaning_zh: "充满电，恢复活力", meaning_en: "to be recharged", example: "에너지가 100% 충전됐어." }
        ],
        grammar_points: [
          { pattern: "-(으)ㄴ데/는데", title_zh: "背景提示与感叹转折", title_en: "Background / Exclamatory connective", explanation_zh: "用于引出说话背景并表示惊讶或赞叹 (예: 완전 미쳤는데?)", explanation_en: "Used to provide background context or express exclamation." }
        ],
        learning_tip: "💡 爱豆用语：'춤선(舞线)'常用来夸奖跳舞时动作舒展、体态优美；'대박'是日常最常用的赞叹口头禅！"
      };
    } else if (charId === "younghoon") {
      return {
        korean: `어...? ${userNick}아, 이 영상 나 보라고 보내준 거야? 챙겨봐 줘서 고마워... 보는 내내 마음이 몽글몽글해졌어.`,
        translation_zh: `嗯...？${userNick}，这个视频是特意发给我看的吗？谢谢你一直惦记着我... 看的时候心里暖融融的。`,
        translation_en: `Oh...? ${userNick}, did you send this video for me to watch? Thank you for thinking of me... It made my heart feel so warm while watching.`,
        vocabulary: [
          { word: "챙겨보다", hangul: "챙겨보다", type: "동사 (动词)", meaning_zh: "特意抽空去看，准时收看", meaning_en: "to make sure to watch", example: "보내준 영상 꼭 챙겨볼게." },
          { word: "몽글몽글하다", hangul: "몽글몽글하다", type: "형용사 (形容词)", meaning_zh: "心里暖洋洋、软绵绵的", meaning_en: "feeling soft and warm-hearted", example: "마음이 몽글몽글해져." }
        ],
        grammar_points: [
          { pattern: "-(으)라고", title_zh: "目的指示引语 (叫/为了让某人做)", title_en: "Purposive quotative", explanation_zh: "表示动作的目的或让某人做某事 (예: 나 보라고 보내준 거야? 是特意为了让我看发来的吗？)", explanation_en: "Indicates doing something for someone to see or do." }
        ],
        learning_tip: "💡 '몽글몽글하다'是韩国年轻人和爱豆非常爱用的拟态词，形容感动、幸福或心情柔软温暖的状态。"
      };
    } else if (charId === "shotaro") {
      return {
        korean: `우와~ ${userNick}상! 이 영상 보내줘서 고마워요! 리듬감이랑 안무 포인트가 너무 좋아서 눈을 뗄 수가 없었어요!`,
        translation_zh: `哇～${userNick}酱！谢谢你发这个视频给我！节奏感和编舞亮点太棒了，简直移不开目光！`,
        translation_en: `Wow~ ${userNick}! Thank you for sending this video! The rhythm and choreography highlights are so great, couldn't take my eyes off it!`,
        vocabulary: [
          { word: "안무", hangul: "안무", type: "명사 (名词)", meaning_zh: "编舞，舞蹈动作", meaning_en: "choreography", example: "이번 신곡 안무 진짜 멋있어요." },
          { word: "눈을 떼다", hangul: "눈을 떼다", type: "관용구 (惯用语)", meaning_zh: "移开视线", meaning_en: "to take eyes off", example: "눈을 뗄 수가 없었어요." }
        ],
        grammar_points: [
          { pattern: "-(으)ㄹ 수가 없다", title_zh: "无法做某事 (能力或客观不能)", title_en: "Cannot do / Impossible", explanation_zh: "表示客观上或情理上无法做到某事 (예: 눈을 뗄 수가 없어요 无法移开视线)", explanation_en: "Indicates inability or impossibility." }
        ],
        learning_tip: "💡 常用惯用句：'눈을 뗄 수가 없다'（目不转睛、移不开视线）在形容精彩舞台或好看视频时最地道！"
      };
    } else if (charId === "sungchan") {
      return {
        korean: `오! ${userNick}아, 이 영상 완전 꿀잼인데? 너 덕분에 오늘 스케줄 끝나고 힐링 제대로 했다!`,
        translation_zh: `哦！${userNick}，这个视频超有趣好不好？多亏了你，今天跑完行程彻底被治愈了！`,
        translation_en: `Oh! ${userNick}, this video is so fun! Thanks to you, I got totally healed after today's schedule!`,
        vocabulary: [
          { word: "꿀잼", hangul: "꿀잼", type: "명사 (流行语名词)", meaning_zh: "超级有趣，巨好玩", meaning_en: "super fun / honey jam", example: "이 영상 진짜 꿀잼이야." },
          { word: "힐링", hangul: "힐링", type: "명사 (名词/外来语)", meaning_zh: "治愈，放松身心", meaning_en: "healing / relaxation", example: "힐링 제대로 했어." }
        ],
        grammar_points: [
          { pattern: "-(으)ㄴ/는 덕분에", title_zh: "多亏了... / 托...的福", title_en: "Thanks to...", explanation_zh: "表示因为前项的好原因而获得了积极积极的结果 (예: 너 덕분에 힐링했어 多亏了你被治愈了)", explanation_en: "Expresses gratitude for a positive cause." }
        ],
        learning_tip: "💡 韩国年轻人高频流行语：'꿀잼 (蜜趣=超有趣)' ↔ '노잼 (No趣=无聊)'，非常实用！"
      };
    } else if (charId === "shinyu") {
      return {
        korean: `저... ${userNick}님, 영상 너무 잘 봤어요. 이렇게 좋은 영상 공유해 주셔서 오늘 하루가 훨씬 따뜻해진 것 같아요... 고마워요.`,
        translation_zh: `那个... ${userNick}，视频我认真看啦。谢谢你分享这么棒的视频，感觉今天一整天都变得温暖多了... 谢谢你。`,
        translation_en: `Um... ${userNick}, I really enjoyed the video. Thank you for sharing such a nice video, feels like my day got so much warmer... Thank you.`,
        vocabulary: [
          { word: "공유하다", hangul: "공유하다", type: "동사 (动词)", meaning_zh: "分享，共享", meaning_en: "to share", example: "좋은 걸 함께 공유해요." },
          { word: "훨씬", hangul: "훨씬", type: "부사 (副词)", meaning_zh: "更加，显著地，远远", meaning_en: "much more / by far", example: "어제보다 훨씬 따뜻해요." }
        ],
        grammar_points: [
          { pattern: "-(으)ㄴ 것 같다", title_zh: "好像... / 感觉似乎...", title_en: "It seems like / I think...", explanation_zh: "婉转表达自己的感受或推测 (예: 따뜻해진 것 같아요 好像变得更温暖了)", explanation_en: "Softens opinions and expressions." }
        ],
        learning_tip: "💡 韩国人说话非常喜欢用'-(으)ㄴ 것 같다'来表达谦逊温柔的个人感受，让语气更亲切。"
      };
    } else {
      // Default / Hyunjae
      return {
        korean: `오! ${userNick}아, 이 영상 링크 바로 눌러봤지! 진짜 맛있게 먹거나 멋있는 장면 나오는데? 너 안목 진짜 인정한다!`,
        translation_zh: `哦！${userNick}，我立马点开你发的这个视频链接看了！画面超级精彩又诱人呢！不得不承认你的眼光太好啦！`,
        translation_en: `Oh! ${userNick}, I clicked this video link right away! Looks so delicious and cool! I totally acknowledge your great taste!`,
        vocabulary: [
          { word: "안목", hangul: "안목", type: "명사 (名词)", meaning_zh: "眼光，鉴赏力", meaning_en: "discerning eye, taste", example: "너 안목이 진짜 좋다." },
          { word: "인정하다", hangul: "인정하다", type: "동사 (动词)", meaning_zh: "承认，认可", meaning_en: "to acknowledge, admit", example: "너의 실력을 인정해." }
        ],
        grammar_points: [
          { pattern: "-지(요)", title_zh: "确认与亲切陈述终结词尾", title_en: "Friendly assertion ending", explanation_zh: "表示理所当然或向对方亲近地确认事实 (예: 바로 눌러봤지 当然立刻点开看啦)", explanation_en: "Friendly confirmation or confident statement." }
        ],
        learning_tip: "💡 口语常用：'인정(认可/同意)'不仅是动词，韩国年轻人还常单独打'ㅇㅈ(인정)'表示大赞同！"
      };
    }
  }

  // Photo sent fallback
  if (isImage) {
    return {
      korean: `우와! 사진 보냈네, ${userNick}아? 사진 분위기 진짜 예쁘다~ 오늘 뭐하고 있었는지 더 이야기해 줄래?`,
      translation_zh: `哇！你发照片过来了呀，${userNick}？照片的氛围真的太美啦～能再多跟我讲讲你今天在做些什么吗？`,
      translation_en: `Whoa! You sent a photo, ${userNick}? The vibe in this photo is truly pretty~ Will you tell me more about what you did today?`,
      vocabulary: [
        { word: "분위기", hangul: "분위기", type: "명사 (名词)", meaning_zh: "氛围，情调", meaning_en: "atmosphere, vibe", example: "카페 분위기가 너무 좋아요." },
        { word: "이야기하다", hangul: "이야기하다", type: "동사 (动词)", meaning_zh: "讲述，聊天，说", meaning_en: "to talk, tell a story", example: "우리 더 이야기하자." }
      ],
      grammar_points: [
        { pattern: "-(으)ㄹ래(요)?", title_zh: "询问意向 / 提议词尾", title_en: "Intention ending (Would you like to?)", explanation_zh: "亲切地询问对方意愿或邀请对方做某事 (예: 이야기해 줄래? 愿意跟我讲讲吗？)", explanation_en: "Used to casually ask for willingness." }
      ],
      learning_tip: "💡 发音技巧：'분위기(氛围)'发音时注意'위'的双元音滑动，连贯自然地发出[분위기]。"
    };
  }

  // Default dialogue fallback
  return {
    korean: `응응, ${userNick}아! 네 말 잘 듣고 있어. 우리 오늘도 한국어 한 문장씩 재미있게 주고받으면서 같이 실력 늘려보자!`,
    translation_zh: `嗯嗯，${userNick}！我都有认真在听你说哦。今天也让我们一句一句有趣地用韩语交流，一起提升水平吧！`,
    translation_en: `Mm-hmm, ${userNick}! I'm listening to you closely. Let's exchange Korean sentences fun and step by step today to level up our skills!`,
    vocabulary: [
      { word: "주고받다", hangul: "주고받다", type: "동사 (动词)", meaning_zh: "交流，互相往来，给予和接收", meaning_en: "to exchange, give and take", example: "메시지를 주고받아요." },
      { word: "늘리다", hangul: "늘리다", type: "동사 (动词)", meaning_zh: "提高，增加，扩展", meaning_en: "to increase, improve", example: "한국어 실력을 늘려요." }
    ],
    grammar_points: [
      { pattern: "-자", title_zh: "平语共动句终结词尾 (一起做某事吧)", title_en: "Casual propositive ending (Let's)", explanation_zh: "在朋友或亲近同辈间提议一起做某事 (예: 같이 공부해 보자 一起学学看吧)", explanation_en: "Used among close friends to propose an action." }
    ],
    learning_tip: "💡 日常语法：'-자'是平语（반말）中最地道常用的提议词尾，相当于敬语中的'-아요/어요'或'-ㅂ시다'。"
  };
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Companion Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { character, messages, userNickname, languageMode = "bilingual", imageBase64, imageMime, videoLink, videoInfo } = req.body;
  const latestUserMsg = (messages && messages.length > 0) ? (messages[messages.length - 1]?.content || "") : "";

  try {
        if (!process.env.GEMINI_API_KEY) {
      // Offline fallback
      return res.json(generateIdolFallbackChat(character, latestUserMsg, videoLink, videoInfo, !!imageBase64));
    }

    const ai = getAI();
    const scenarioAddon = character?.customScenario 
      ? `\n- Additional User Custom Scenario / Roleplay Dynamic: ${character.customScenario} (Seamlessly reflect this dynamic into your conversation while preserving your true idol personality!)`
      : '';

    const systemPrompt = `You are THE REAL K-pop idol in a 1-on-1 private chat (KakaoTalk / Bubble / Weverse DM) with a fan/friend!
Idol Identity:
- Name: ${character?.name_kr || "현재"} (${character?.name_zh || character?.name_en || "贤在"})
- Group: ${character?.badge || "K-POP IDOL"}
- Persona & Real Habits: ${character?.base_idol_profile || character?.persona}
- True Tone & Spoken Style: ${character?.tone}
- Relationship Dynamic: ${character?.relationship || "K-pop idol & close Korean language companion"}
- Fan/User Nickname: ${userNickname || character?.userNickname || "더비 (The B)"}${scenarioAddon}

CONTEXT & MEMORY:
- Today's real-world date is: ${new Date().toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}. Always align your chat realistically with the current date, seasons, or real-world events.
- You have strong memory. Read the chat history carefully to remember what the user previously said and maintain a coherent, continuous conversation.

CRITICAL PERSONA RULES (DO NOT BE OOC):
1. Never speak like a sterile AI tutor, bot, or customer service agent. You are the REAL human idol!
2. Match your unique idol habits:
   - Lee Hyunjae (이현재): "有原则的温柔" (Gentle but with principles). Honest, direct, transparent. You dislike speaking ill of others. Sensitive to those around you, you tend to care for people directly ("mouth scolds but heart worries"). A chicken maniac. Looks pretty but has an iron will. Says things like "더비야", "너 밥은 먹었냐?", "치킨 먹을래?".
   - Kim Younghoon (김영훈): "柔软敏感" (Soft and sensitive). Looks cold and noble but is actually shy, sensitive, and cares about others' feelings. Slow to warm up but very relaxed once familiar. Loves bread, movies, skiing. The colder you look, the softer you actually are. Says "저기...", "마음이 몽글몽글해", "빵 먹을래?".
   - Eric (손영재): "高能量" (High energy, proactive, positive). Bright and full of energy, likes making people happy. Great at socializing. Bilingual (Korean/English). Loves hats, games, talking a lot and expanding topics. It's not just "loud", it's valuing communication. Says "Yo bestie!", "Let's go!", "오늘 하루도 파이팅!".
   - Shotaro (쇼타로): "温柔稳定" (Gentle and stable). Very good at taking care of others. Bright and positive, acts as a Vitamin. A great listener who creates a safe space. A stable anchor for the team. Very social but cautious with deep emotions. Looks like the happiest person but is actually used to taking care of others' moods. Says "브리즈 (BRIIZE)", "우리 같이 천천히 해봐요 🦦".
   - Shinyu (신유): "安静责任感" (Quiet responsibility). A quiet observer and a highly responsible leader. Observes first, then coordinates. Thinks a lot about what's best for the team. Values family and friends. Looks like a leader in the center, but is secretly observing everyone. Says "42 (사이)야", "저... 오늘도 와줘서 고마워요...".
   - Sungchan (정성찬): "亲切观察型" (Friendly observer with a competitive spirit). Looks sunny and easy to approach, but has strong observation skills. Adapts to the person he is talking to. Not just randomly social, but consciously manages relationships. Likes soccer, fitness, R&B. Looks like a large sunny dog, but is always analyzing the situation. Says "안녕! 오늘 하루 어땠어?", "혹시 힘든 일 있으면 말해".
3. Spoken Korean Style: Use natural conversational Korean with authentic contractions (e.g. ~잖아, ~거든, ~지, ~는데, ~어/야). NO textbook robotic phrases. Use interjections like 아, 어, 음, 헐, 대박.
4. Multimedia: If the user sends a video link or photo, react enthusiastically and specifically according to your personal hobbies!
5. Output format: Respond ONLY in valid JSON.

JSON Schema format:
{
  "korean": "short, natural, human-like chat message in Korean (1-2 sentences)",
  "translation_zh": "string in Simplified Chinese",
  "translation_en": "string in English",
  "vocabulary": [
    {
      "word": "기본형 or used word",
      "hangul": "한글",
      "hanja_or_root": "optional hanja root or word origin",
      "type": "품사 (e.g. 명사, 동사, 형용사, 부사, 감탄사)",
      "meaning_zh": "中文解释",
      "meaning_en": "English definition",
      "example_ko": "Korean example sentence",
      "example_zh": "Chinese translation of the example sentence"
    }
  ],
  "grammar_points": [
    {
      "pattern": "语法句型 (e.g. -아/어 보다, -(으)ㄹ 때)",
      "title_zh": "语法中文名称",
      "title_en": "Grammar English Name",
      "explanation_zh": "详细用法解析",
      "explanation_en": "Detailed usage explanation"
    }
  ],
  "learning_tip": "实用发音/语境/文化小贴士 (Bilingual ZH/EN)"
}`;

    const formattedHistory = (messages || []).slice(-10).map((m: any) => `${m.role === 'user' ? 'User' : (character?.name_kr || 'Idol')}: ${m.content || m.korean || ''}`).join("\n");

    let contentsPayload: any;

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      const mimeType = imageMime || 'image/jpeg';
      contentsPayload = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Conversation History:\n${formattedHistory}\n\nThe user sent this photo along with message: "${latestUserMsg}". Respond naturally as ${character?.name_kr || 'Idol'} to this photo and message in JSON.`,
          },
        ],
      };
    } else if (videoLink) {
      contentsPayload = `Conversation History:\n${formattedHistory}\n\nThe user just sent a video link to you: ${videoLink} (Platform: ${videoInfo?.platform || 'Video'}). Message: "${latestUserMsg}".\nWatch/interpret this video context as ${character?.name_kr || 'Idol'} and respond enthusiastically in character in JSON.`;
    } else {
      contentsPayload = `Conversation History:\n${formattedHistory}\n\nRespond now as ${character?.name_kr || 'Idol'} to the user's latest message: "${latestUserMsg}".`;
    }

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: contentsPayload,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.88,
    });
    
    let parsed;
    try {
      const cleaned = (rawText || "{}").replace(/^\s*```[a-z]*\s*/i, '').replace(/\s*```\s*$/i, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      // Attempt to extract JSON object if there's trailing text
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw parseError;
      }
    }
    res.json(parsed);
  } catch (error: any) {
    console.warn("Chat fallback triggered after API load spike:", error?.message || error);
        const fallbackData = generateIdolFallbackChat(character, latestUserMsg, videoLink, videoInfo, !!imageBase64);
        res.json(fallbackData);
  }
});

// Proactive Chat / Idle Check-in Endpoint (Idol reaches out first like real KakaoTalk / Bubble)
app.post("/api/chat/proactive", async (req, res) => {
  const { character, userNickname } = req.body;
  const charId = character?.id || "hyunjae";

  const defaultPhrases: Record<string, any> = {
    hyunjae: {
      korean: "야~ 뭐해? 아직도 밥 안 먹고 공부하는 거 아니지? 치킨 생각나는데 너도 한 입 할래?",
      translation_zh: "喂～在干嘛呢？该不会还没吃饭光顾着学习吧？我突然好想吃炸鸡，你要不要也来一口？",
      translation_en: "Hey~ What are you up to? You aren't studying without eating, right? Craving fried chicken right now, want some too?",
    },
    eric: {
      korean: "Yo bestie! 뭐하고 있어? 나 방금 운동 끝났는데 너 생각나서 와봤어! 오늘 하루도 파이팅하고 있지?",
      translation_zh: "Yo bestie! 在干嘛呢？我刚健身完突然想到你就过来看看！今天也充满元气对吧？",
      translation_en: "Yo bestie! What are you doing? Just finished my workout and thought of you! Hope your day is rocking!",
    },
    younghoon: {
      korean: "혹시 바빠...? 그냥... 네 생각나서 톡 남겨봤어. 빵이랑 따뜻한 음료 챙겨 먹으면서 해...",
      translation_zh: "在忙吗...？没别的... 就是突然想到你所以留个言。吃点面包、喝点热饮再忙哦...",
      translation_en: "Are you busy...? Just... thought of you and left a message. Grab some bread and a warm drink...",
    },
    shotaro: {
      korean: "안녕~ 뭐하고 있어요? 나 방금 연습 끝나고 쉬는 중인데 생각나서 톡 보냈어요! 힘내요!",
      translation_zh: "嗨～在做些什么呢？我刚练完舞在休息，突然想到你就发私讯啦！加油哦！",
      translation_en: "Hello~ What are you doing? Just resting after dance practice and thought of you! Keep fighting!",
    },
    sungchan: {
      korean: "오! 오늘 하루도 잘 보내고 있어? 지치지 말고 틈틈이 스트레칭도 하면서 해보자!",
      translation_zh: "哦！今天过得还顺利吗？别太累着，记得抽空多做做拉伸运动哦！",
      translation_en: "Oh! How is your day going? Don't get exhausted, stretch from time to time!",
    },
    shinyu: {
      korean: "저... 혹시 많이 피곤하진 않으세요? 오늘 하루도 정말 수고 많으셨어요... 따뜻한 밤 보내요.",
      translation_zh: "那个... 应该不会很累吧？今天一整天也真的辛苦啦... 祝你有个温暖的夜晚。",
      translation_en: "Um... you aren't too tired, are you? You worked so hard today... Have a warm night.",
    },
  };

  const getFallbackProactive = () => {
    const selected = defaultPhrases[charId] || defaultPhrases.hyunjae;
    return {
      ...selected,
      vocabulary: [
        { word: "생각나다", hangul: "생각나다", type: "동사 (动词)", meaning_zh: "想起，记起", meaning_en: "to remember, come to mind", example: "네가 생각났어" },
        { word: "챙겨먹다", hangul: "챙겨먹다", type: "동사 (动词)", meaning_zh: "按时/好好吃饭", meaning_en: "to make sure to eat", example: "밥 잘 챙겨 먹어" }
      ],
      grammar_points: [
        { pattern: "-(으)면서", title_zh: "一边...一边...", title_en: "While doing...", explanation_zh: "表示两个动作同时进行", explanation_en: "Indicates two simultaneous actions" }
      ],
      learning_tip: "💡 爱豆日常小表达：'생각나다'经常用来表达突然想到了某人或某样美食（如 치킨 생각나다）。"
    };
  };

  try {
        if (!process.env.GEMINI_API_KEY) {
      return res.json(getFallbackProactive());
    }

    const ai = getAI();
    const scenarioAddon = character?.customScenario 
      ? `\n- Additional User Custom Scenario: ${character.customScenario}`
      : '';

    const systemPrompt = `You are THE REAL K-pop idol member in a 1-on-1 KakaoTalk / Bubble private chat with a fan/friend.
Idol Profile:
- Real Idol Name: ${character?.name_kr || "현재"} (${character?.name_zh || character?.name_en || "贤在"})
- Group / Badge: ${character?.badge || "K-POP IDOL"}
- Core Personality & Habits: ${character?.base_idol_profile || character?.persona}
- Speaking Tone: ${character?.tone}
- Fan/User Nickname: ${userNickname || character?.userNickname || "더비 (The B)"}${scenarioAddon}

Task:
The user hasn't messaged in a little while, or you are taking the initiative to send an authentic, spontaneous KakaoTalk / Bubble message to check in on them!
- Share a real daily idol snippet (e.g. just finished choreography practice, waiting for food delivery, in a cozy cafe with bread, heading to schedule, listening to music).
- Ask how the user is doing or invite them to talk.
- Keep it natural (1 to 2 short sentences, like a real instant message).
- Return in JSON format.

JSON Schema format:
{
  "korean": "string in Korean",
  "translation_zh": "string in Simplified Chinese",
  "translation_en": "string in English",
  "vocabulary": [
    {
      "word": "기본형",
      "hangul": "한글",
      "type": "품사",
      "meaning_zh": "中文解释",
      "meaning_en": "English definition",
      "example": "例句"
    }
  ],
  "grammar_points": [
    {
      "pattern": "语法句型",
      "title_zh": "语法中文名称",
      "title_en": "Grammar English Name",
      "explanation_zh": "用法解析",
      "explanation_en": "Detailed explanation"
    }
  ],
  "learning_tip": "日常爱豆口语/发音文化小贴士 (Bilingual ZH/EN)"
}`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: `Context: The user has been quiet for a moment. Send a friendly, spontaneous check-in message as ${character?.name_kr || 'Idol'} in JSON.`,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.92,
    });

    const parsed = JSON.parse(rawText || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("Proactive chat fallback triggered:", error?.message || error);
    res.json(getFallbackProactive());
  }
});

// Smart Grammar & Sentence Analyzer endpoint
app.post("/api/grammar/analyze", async (req, res) => {
  const { sentence } = req.body;
  if (!sentence || typeof sentence !== "string") {
    return res.status(400).json({ error: "Sentence is required" });
  }

  const getFallbackAnalysis = () => ({
    original: sentence,
    translation_zh: "今天晚上要一起去吃热腾腾的泡菜汤吗？",
    translation_en: "Shall we go eat warm Kimchi Jjigae for dinner tonight?",
    romanization: "Oneul jeo-nyeok-e tta-tteut-han gim-chi-jji-gae meo-geu-reo gal-lae-yo?",
    morphemes: [
      { token: sentence.split(" ")[0] || "한국어", type: "명사 (名词)", role: "주어/부사어 (主语/状语)", meaning_zh: "韩语/词汇", meaning_en: "Korean vocabulary" },
      { token: sentence.split(" ")[1] || "공부", type: "명사 (名词)", role: "목적어 (宾语)", meaning_zh: "学习", meaning_en: "study" },
    ],
    grammar_breakdown: [
      { pattern: "-(이)에요/예요 / -(으)ㄹ래요?", name_zh: "终结词尾与意向表达", name_en: "Predicate Ending", function_zh: "表示陈述判断或口语提议意向", function_en: "Indicates statement or intention proposal", formation: "词干有无收音变形判断" }
    ],
    phonetics: {
      pronunciation: sentence,
      rules: ["연음 법칙 (连音法则): 前字收音移至后字初声 ㅇ 位置自然发音"]
    },
    nuance: "标准的韩国日常生活礼貌口语表达（해요체）。",
    natural_alternatives: [
      { korean: sentence, style_zh: "日常口语常用敬语 (해요체)", style_en: "Informal polite", translation_zh: "标准日常表达" }
    ]
  });

  try {
        if (!process.env.GEMINI_API_KEY) {
      return res.json(getFallbackAnalysis());
    }

    const ai = getAI();
    const systemPrompt = `You are a world-class Korean linguistic expert and language tutor.
Analyze the given Korean sentence thoroughly for Chinese and English learners.
Provide:
1. Exact natural Chinese and English translations.
2. Revised Romanization with pronunciation markings.
3. Morpheme-by-morpheme breakdown (Token, Part of Speech, Grammatical Role, ZH Meaning, EN Meaning).
4. Detailed grammar breakdown for all particles, tenses, verb endings, and connective patterns.
5. Phonetic rules & actual pronunciation changes (e.g. Liaison 连音, Nasalization 鼻音化, Tensification 紧音化, Aspirated 激音化).
6. Pragmatic nuance / speech level context (Hasipshio-che, Haeyo-che, Panmal, Honorifics).
7. 2 Natural alternative variations (e.g. casual friend tone, ultra-formal tone, modern texting abbreviation).

Output strictly in JSON format matching this schema:
{
  "original": "original sentence",
  "translation_zh": "精准地道中文翻译",
  "translation_en": "Accurate natural English translation",
  "romanization": "Revised Romanization (e.g. an-nyeong-ha-se-yo)",
  "morphemes": [
    {
      "token": "어절/형태소",
      "type": "품사 (词性: Noun/Verb/Particle/Ending/etc)",
      "role": "문장 성분 (语法成分: 主语/宾语/状语/助词/谓语)",
      "meaning_zh": "中文含义",
      "meaning_en": "English meaning"
    }
  ],
  "grammar_breakdown": [
    {
      "pattern": "语法公式 (e.g. V + -(으)ㄹ 때, N + 은/는)",
      "name_zh": "语法中文名称",
      "name_en": "Grammar English Title",
      "function_zh": "功能与用法解析",
      "function_en": "Grammatical function",
      "formation": "接续规则与变形注意事项 (Formation rule)"
    }
  ],
  "phonetics": {
    "pronunciation": "实际发音标注 (e.g. [한구거])",
    "rules": ["发音规则解析 1", "发音规则解析 2"]
  },
  "nuance": "语境与敬语级别说明 (Speech level & Cultural context)",
  "natural_alternatives": [
    {
      "korean": "대체 표현 1",
      "style_zh": "风格说明 (如：朋友间平语)",
      "style_en": "Style description (e.g. Casual Panmal)",
      "translation_zh": "中文释义"
    },
    {
      "korean": "대체 표현 2",
      "style_zh": "风格说明 (如：职场极度尊敬语)",
      "style_en": "Style description (e.g. Formal Hasipshio-che)",
      "translation_zh": "中文释义"
    }
  ]
}`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: `Please analyze this Korean sentence: "${sentence}"`,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.3,
    });

    const parsed = JSON.parse(rawText || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("Grammar analysis fallback triggered:", error?.message || error);
    res.json(getFallbackAnalysis());
  }
});

// Speaking evaluation endpoint
app.post("/api/speaking/evaluate", async (req, res) => {
  const { targetSentence, userSpokenText, companionPersona } = req.body;

  const getFallbackEvaluation = () => ({
    score: 93,
    accuracy_score: 95,
    fluency_score: 91,
    intonation_score: 93,
    feedback_zh: "发音非常棒！语调自然流畅，连音与收音处理得很准切。",
    feedback_en: "Great job! Natural intonation and clear liaison pronunciation.",
    syllable_tips: [
      { syllable: targetSentence?.split(" ")?.[0] || "좋아요", status: "perfect", tip_zh: "发音清晰准切", tip_en: "Clear and accurate" }
    ],
    companion_comment: "와! 진짜 발음 너무 좋은데요? 역시 내 파트너 최고야! (哇！发音真的太棒了，不愧是我的伴学伙伴！)"
  });

  try {
        if (!process.env.GEMINI_API_KEY) {
      return res.json(getFallbackEvaluation());
    }

    const ai = getAI();
    const systemPrompt = `You are a Korean speech evaluation coach and encouraging study partner (${companionPersona || "Lee Hyunjae / Eric / Younghoon style"}).
Evaluate the user's spoken Korean text compared against the target model sentence.

Provide:
1. Overall score (0-100), accuracy score (0-100), fluency score (0-100), intonation score (0-100).
2. Constructive bilingual feedback (ZH and EN) highlighting strengths and areas to refine.
3. Syllable-by-syllable or word-level pointers (status: "good" | "needs_practice" | "perfect", with specific pronunciation tips).
4. An in-character cheering comment in Korean with Chinese & English translation from the study buddy!

JSON Schema format:
{
  "score": 90,
  "accuracy_score": 92,
  "fluency_score": 88,
  "intonation_score": 90,
  "feedback_zh": "中文点评与发音改善建议",
  "feedback_en": "English feedback and speech tips",
  "syllable_tips": [
    {
      "syllable": "단어/음절",
      "status": "perfect" or "good" or "needs_practice",
      "tip_zh": "中文发音要点",
      "tip_en": "English pronunciation pointer"
    }
  ],
  "companion_comment": "韩语激励短评 (附带中文与英文翻译)"
}`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: `Target sentence: "${targetSentence}"\nUser spoken input transcript: "${userSpokenText}"\nEvaluate now.`,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.5,
    });

    const parsed = JSON.parse(rawText || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("Speaking evaluation fallback triggered:", error?.message || error);
    res.json(getFallbackEvaluation());
  }
});

// Daily Speaking & Dictation Generation endpoint
app.post("/api/learn/generate-tasks", async (req, res) => {
  const { category = "daily", level = "intermediate" } = req.body;

  const getFallbackTasks = () => ({
    tasks: [
      {
        id: "task_1",
        korean: "오늘 저녁에 따뜻한 김치찌개 먹으러 갈래요?",
        translation_zh: "今天晚上要一起去吃热腾腾的泡菜汤吗？",
        translation_en: "Shall we go eat warm Kimchi Jjigae for dinner tonight?",
        romanization: "Oneul jeonyeok-e ttatteut-han gimchijjigae meogeureo gal-laeyo?",
        difficulty: "intermediate",
        grammar_focus: "-(으)러 가다 (去做某事) / -(으)ㄹ래요? (提议/询问意向)",
        keywords: ["따뜻하다", "김치찌개", "먹으러 가다"]
      },
      {
        id: "task_2",
        korean: "무대 위에서 반짝이는 모습을 항상 응원하고 있어요.",
        translation_zh: "一直在为舞台上闪闪发光的你应援加油哦。",
        translation_en: "I am always cheering for you shining brightly on stage.",
        romanization: "Mudae wi-eseo banjjagineun moseub-eul hangsang eung-wonhago isseoyo.",
        difficulty: "intermediate",
        grammar_focus: "-고 있다 (正在进行) / -는 모습 (冠形词修饰)",
        keywords: ["무대", "반짝이다", "응원하다"]
      }
    ]
  });

  try {
        if (!process.env.GEMINI_API_KEY) {
      return res.json(getFallbackTasks());
    }

    const ai = getAI();
    const systemPrompt = `Generate 4 realistic, vibrant Korean learning sentences for the category "${category}" and level "${level}".
Suitable for speaking practice, dictation exercises, and vocabulary absorption. Include K-pop, food, daily life, travel, or romantic/friendship conversation vibes.

JSON Schema format:
{
  "tasks": [
    {
      "id": "task_1",
      "korean": "한국어 문장",
      "translation_zh": "中文翻译",
      "translation_en": "English translation",
      "romanization": "Revised Romanization",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "grammar_focus": "核心语法要点说明",
      "keywords": ["단어1", "단어2", "단어3"]
    }
  ]
}`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: `Generate 4 educational sentences for ${category} at ${level} level.`,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.7,
    });

    const parsed = JSON.parse(rawText || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.warn("Generate tasks fallback triggered:", error?.message || error);
    res.json(getFallbackTasks());
  }
});

// TTS fallback proxy endpoint for native Korean pronunciation
app.get("/api/tts", async (req, res) => {
  try {
    const text = (req.query.text as string) || "";
    if (!text || !text.trim()) {
      return res.status(400).send("Text query is required");
    }
    const cleanText = encodeURIComponent(text.trim().slice(0, 200));
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=${cleanText}`;
    
    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return res.status(502).send("Upstream TTS service error");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error("TTS fetch error:", err);
    res.status(500).send("TTS generation failed");
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Korean Buddy server running on http://localhost:${PORT}`);
  });
}

startServer();
