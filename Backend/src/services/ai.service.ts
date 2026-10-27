import { GoogleGenAI } from "@google/genai";
import { comprehensiveStudyMaterialSchema } from "../schemas/ai.schemas";
import { EmptyModelResponseError, withModelFallback } from "./ai-fallback";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

export async function generateFullStudyPack(courseContent: string) {
  return withModelFallback(async (model, signal) => {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyse le cours et génère un pack complet. Découpe d'abord le contenu en 3 à 8 pages progressives (coursePages), chacune avec un titre clair, une explication accessible, des exemples concrets et 2 à 4 points clés. Puis génère résumé, flashcards, quiz, rappels actifs et questions d'examen cohérents avec ces pages : \n\n ${courseContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: comprehensiveStudyMaterialSchema,
        temperature: 0.2, // Garde une valeur basse pour assurer la précision par rapport au cours
        abortSignal: signal,
      },
    });

    if (!response.text) throw new EmptyModelResponseError();
    // Un JSON invalide lève une SyntaxError : le modèle suivant sera essayé.
    return JSON.parse(response.text);
  });
}
