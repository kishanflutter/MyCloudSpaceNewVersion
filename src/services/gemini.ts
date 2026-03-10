import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY;

export async function chatWithGemini(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ urlContext: {} }],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
