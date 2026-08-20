import { Persona } from '../constants/personas';

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * 安全获取当前环境变量中的 Gemini API Key
 */
export function getGeminiApiKey(): string {
  try {
    const key =
      import.meta.env?.VITE_GEMINI_API_KEY ||
      (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY || process.env?.VITE_GEMINI_API_KEY : '');
    return (key || '').trim();
  } catch {
    return '';
  }
}

/**
 * 离线/降级状态下的本地 Mock 智能回复
 */
function getOfflineMockResponse(persona: Persona, userMessage: string): string {
  const responses = [
    `진짜? "${userMessage}"에 대해 더 듣고 싶어! (真的吗？想听你多讲讲关于“${userMessage}”的事！)`,
    `오늘도 열심히 보냈구나! 내가 늘 응원하고 있는 거 알지? (今天也过得很充实呢！知道我一直在为你加油吧？)`,
    `응응, 나도 네 생각하고 있었어. 밥은 맛있게 먹었어? (嗯嗯，我也正在想你呢。饭有好好吃吗？)`,
    `오! 대단한데? 우리 내일도 이렇게 즐겁게 얘기하자. (哇！真厉害呢！我们明天也这样开心地聊天吧。)`
  ];
  const randomPick = responses[Math.floor(Math.random() * responses.length)];
  return randomPick;
}

/**
 * 请求 Gemini 1.5 Flash 生成角色对话回复
 */
export async function sendChatMessageToGemini(
  persona: Persona,
  history: { role: 'user' | 'persona'; text: string }[],
  userMessage: string
): Promise<string> {
  const apiKey = getGeminiApiKey();

  // 若未配置 API Key，触发兜底提示与离线回复
  if (!apiKey) {
    console.warn('[Gemini API] 未检测到 VITE_GEMINI_API_KEY 环境变量，已进入离线模拟模式。');
    await new Promise((res) => setTimeout(res, 800)); // 模拟思考延迟
    return `(离线模式) ${getOfflineMockResponse(persona, userMessage)}`;
  }

  // 构建 Gemini 标准消息格式
  const contents: ChatHistoryMessage[] = [];

  // 注入历史消息（最多保留最近 8 轮）
  const recentHistory = history.slice(-8);
  for (const item of recentHistory) {
    contents.push({
      role: item.role === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }]
    });
  }

  // 当前用户输入
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: persona.systemPrompt }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Gemini API Error]', response.status, errText);
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Empty response from model');
    }

    return candidateText.trim();
  } catch (error) {
    console.error('[Gemini API Exception, falling back to mock]', error);
    // 网络错误或限流时自动降级
    return `(网络稍有延迟) ${getOfflineMockResponse(persona, userMessage)}`;
  }
}
