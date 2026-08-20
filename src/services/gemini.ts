import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function sendChatMessageToGemini(
  systemPrompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userMessage: string
): Promise<string> {
  if (!apiKey || !ai) {
    return '（本地模式）你好！请在 Vercel 环境变量中配置 VITE_GEMINI_API_KEY 以开启完整 AI 对话功能。';
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(item => ({
          role: item.role,
          parts: item.parts
        })),
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
        }
      ]
    });

    return response.text || '对不起，我现在无法回答。';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return '抱歉，服务暂时出现异常，请稍后再试。';
  }
}

// 兼容默认导出与别名导出
export const sendMessageToGemini = sendChatMessageToGemini;
export default { sendChatMessageToGemini, sendMessageToGemini };
