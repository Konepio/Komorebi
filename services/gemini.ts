
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCuratorialFeedback = async (intent: string, title: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an art curator for the KOMOREBI platform. 
      Analyze the author's intent for their work titled "${title}": "${intent}".
      Provide a brief reflective commentary (max 3 sentences) that helps the author deepen their aesthetic responsibility.
      Maintain a poetic, serious, and minimalist tone. Response must be in English.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting with intelligent curatorship.";
  }
};
