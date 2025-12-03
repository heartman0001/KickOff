import { GoogleGenAI } from "@google/genai";

// 1. ตรวจสอบว่ามี API Key อยู่หรือไม่ (API_KEY ถูกกำหนดใน vite.config.ts)
const API_KEY = process.env.API_KEY;

// 2. เริ่มต้นใช้งาน AI instance เฉพาะเมื่อมี Key
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateSmartDescription = async (prompt: string): Promise<string> => {
    // 3. ตรวจสอบว่าบริการ AI พร้อมใช้งานหรือไม่
    if (!ai) {
        console.error("Gemini API Key is missing. Skipping AI feature.");
        return "Sorry, the AI description generator is currently unavailable (API Key missing).";
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating smart description:", error);
        return "An error occurred while generating the description.";
    }
};