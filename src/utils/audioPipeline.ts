/**
 * MiniMax Audio Pipeline Guardrail:
 * 过滤所有括号及中文释义内容，确保 MiniMax T2A 仅输入纯韩文文本
 */
export function sanitizeForMiniMaxTTS(rawText: string): string {
  return rawText.replace(/\([^)]*\)/g, '').trim();
}

/**
 * 示例 MiniMax T2A 请求封装
 */
export async function synthesizeVoice(text: string, voiceId: string) {
  const pureKoreanText = sanitizeForMiniMaxTTS(text);
  
  if (!pureKoreanText) return null;

  // 调用 MiniMax TTS 接口
  /*
  const response = await fetch('/api/minimax/t2a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      voice_id: voiceId,
      text: pureKoreanText,
      model: "speech-01-turbo"
    })
  });
  return response.arrayBuffer();
  */
}
