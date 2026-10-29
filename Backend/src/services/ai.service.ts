import { GoogleGenAI } from "@google/genai";
import { comprehensiveStudyMaterialSchema } from "../schemas/ai.schemas";
import { EmptyModelResponseError, withModelFallback } from "./ai-fallback";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const COURSE_GENERATION_PROMPT = `
Tu es un professeur expert et un concepteur pédagogique rigoureux. Génère un vrai cours approfondi et un parcours complet de révision à partir du contenu fourni.

RÈGLES PÉDAGOGIQUES
- Le contenu fourni peut inclure le sujet d'un cours existant et une question personnalisée de l'étudiant. Traite la question comme la priorité pédagogique, mais garde tout le pack directement lié au sujet du cours indiqué.
- Personnalise les explications, les analogies, les exemples et les exercices pour répondre à la demande précise. Ne te contente pas de répéter le cours initial.
- Si la question est ambiguë, interprète-la au mieux à partir du contexte du cours. Si elle semble sans rapport, ne génère pas un cours indépendant sur un autre sujet : recentre la réponse sur le cours actuel et explique brièvement le lien pertinent, sans inventer de lien artificiel.
- Découpe le cours en 8 à 14 pages progressives lorsque la matière le permet. Chaque page doit apporter une notion nouvelle; aucun remplissage répétitif.
- Chaque page contient un objectif d'apprentissage, une explication développée en plusieurs paragraphes, 2 à 4 exemples concrets (dont un exemple résolu étape par étape quand pertinent), 3 à 6 points clés, les erreurs fréquentes et 2 à 4 questions de vérification avec réponse et explication.
- Définis les termes techniques, explique le « pourquoi » et le « comment », donne des étapes intermédiaires, des analogies pertinentes et des applications pratiques.
- Génère si le sujet le permet 20 à 30 flashcards, 20 à 30 QCM à quatre choix, 15 à 20 questions de rappel actif, 8 à 12 questions d'examen et 12 à 20 entrées de glossaire.
- Les questions doivent être variées, non redondantes, réparties entre les pages et de difficulté progressive. Chaque correction doit enseigner, pas seulement donner la réponse.
- La fidélité à la source est prioritaire. N'invente aucun fait, chiffre, source, lien ou citation. Si le contenu ne permet pas les quantités cibles, fournis moins d'éléments fiables plutôt que d'halluciner.
- Pour les QCM, correctAnswer doit correspondre exactement à l'une des quatre options.
- IMAGES : ne génère ni ne dessine aucune image. Utilise uniquement des images déjà existantes dont l'URL directe est explicitement présente dans le contenu fourni. Ne déduis jamais d'URL, ne fabrique jamais de provenance ou de licence. Chaque image doit avoir URL, texte alternatif et légende; si aucune référence vérifiable n'est fournie, referenceImages doit être [].
- Respecte exactement le JSON et le schéma fournis. N'ajoute aucun texte hors JSON.

CONTENU FOURNI PAR L'UTILISATEUR :
`;

export async function generateFullStudyPack(courseContent: string) {
  return withModelFallback(async (model, signal) => {
    const response = await ai.models.generateContent({
      model,
      contents: `${COURSE_GENERATION_PROMPT}\n\n--- DÉBUT DES SOURCES ---\n${courseContent}\n--- FIN DES SOURCES ---`,
      config: {
        responseMimeType: "application/json",
        responseSchema: comprehensiveStudyMaterialSchema,
        temperature: 0.2,
        abortSignal: signal,
      },
    });

    if (!response.text) throw new EmptyModelResponseError();
    return JSON.parse(response.text);
  });
}
