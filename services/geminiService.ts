import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartDescription = async (
  title: string,
  baseNotes: string,
  location: string
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    const prompt = `
      You are a hype-man for a football (soccer) meetup app.
      Create a short, exciting, and engaging description (max 50 words) for a football match.
      Use emojis. make it sound fun and inviting.
      
      Event Title: ${title}
      Location: ${location}
      User Notes: ${baseNotes}
      
      Return ONLY the description text.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Join us for an awesome game! ⚽️🔥";
  } catch (error) {
    console.error("Error generating description:", error);
    return baseNotes || "Join us for a game!";
  }
};