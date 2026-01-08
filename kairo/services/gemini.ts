
import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiAdvice = async (tasks: any[], habits: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Basándote en mis tareas actuales: ${JSON.stringify(tasks)} y mis hábitos: ${JSON.stringify(habits)}, dame un consejo motivacional corto y un consejo de productividad en español de España. Que no supere las 60 palabras en total. Formato JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            motivationalTip: { type: Type.STRING },
            productivityAdvice: { type: Type.STRING },
          },
          required: ["motivationalTip", "productivityAdvice"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      motivationalTip: "¡Sigue así, lo estás haciendo genial!",
      productivityAdvice: "Céntrate hoy primero en tu tarea de mayor prioridad."
    };
  }
};
