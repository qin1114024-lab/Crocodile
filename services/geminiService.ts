import { GoogleGenAI } from "@google/genai";
import { MOCK_AI_RESPONSE } from './mockData';

export const isRealAIMode = (): boolean => {
  // Check process.env.API_KEY directly as per guidelines
  return !!process.env.API_KEY && process.env.API_KEY.length > 0;
};

export const getMarketAnalysis = async (symbol: string, price: number, change: number): Promise<string> => {
  if (!isRealAIMode()) {
    console.log("[System] API_KEY missing, using Mock AI.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_AI_RESPONSE), 1000));
  }

  try {
    // Correct initialization: Use process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      你是資深的華爾街金融分析師。請針對股票代號 ${symbol} 進行分析。
      目前價格: ${price}, 今日漲跌幅: ${change}%。
      
      請提供：
      1. 簡短的市場趨勢總結。
      2. 給予投資人的具體操作建議 (做多/做空/觀望)。
      
      嚴格規定：
      - 請使用繁體中文。
      - 直接輸出純文字，不要使用任何 Markdown 格式 (如 **粗體**, # 標題 等)。
      - 不要列點符號，使用自然段落。
      - 字數控制在 200 字以內。
    `;

    // Correct usage of generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "無法取得分析資料。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "連線繁忙，無法進行即時 AI 分析。請稍後再試。(可能原因: API Key 無效或配額已滿)";
  }
};