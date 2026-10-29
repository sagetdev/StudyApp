import { Type } from "@google/genai";

const stringArray = { type: Type.ARRAY, items: { type: Type.STRING } };
const referenceImage = {
  type: Type.OBJECT,
  description: "Référence existante uniquement. Ne jamais fabriquer ou deviner une URL.",
  properties: {
    url: { type: Type.STRING, description: "URL directe existante fournie dans les sources; sinon ne pas inclure l'image." },
    alt: { type: Type.STRING, description: "Texte alternatif descriptif accessible." },
    caption: { type: Type.STRING, description: "Légende courte." },
    sourceTitle: { type: Type.STRING, description: "Titre de la source, uniquement s'il est connu." },
    sourceUrl: { type: Type.STRING, description: "URL de provenance vérifiée, uniquement si connue." },
    license: { type: Type.STRING, description: "Licence ou attribution, uniquement si connue." },
  },
  required: ["url", "alt", "caption"],
};

export const comprehensiveStudyMaterialSchema = {
  type: Type.OBJECT,
  properties: {
    coursePages: {
      type: Type.ARRAY,
      description: "8 à 14 pages progressives si la matière le permet. Chaque page doit être substantielle, pédagogique et distincte.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          objective: { type: Type.STRING, description: "Objectif d'apprentissage clair pour cette page." },
          content: { type: Type.STRING, description: "Explication approfondie en plusieurs paragraphes, avec définitions, raisonnement étape par étape et transitions." },
          examples: { ...stringArray, description: "2 à 4 exemples concrets; inclure un exemple résolu étape par étape lorsque pertinent." },
          keyPoints: { ...stringArray, description: "3 à 6 points essentiels." },
          commonMistakes: { ...stringArray, description: "Erreurs fréquentes et corrections; tableau vide si non pertinent." },
          checkQuestions: {
            type: Type.ARRAY,
            description: "2 à 4 questions de vérification avec réponses et explications.",
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                expectedAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["question", "expectedAnswer", "explanation"],
            },
          },
          referenceImages: {
            type: Type.ARRAY,
            description: "Images éducatives déjà existantes dont les URL directes sont explicitement présentes dans les sources. Tableau vide sinon. Ne jamais inventer d'URL.",
            items: referenceImage,
          },
        },
        required: ["title", "objective", "content", "examples", "keyPoints", "commonMistakes", "checkQuestions", "referenceImages"],
      },
    },
    overview: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Titre principal du cours." },
        summary: { type: Type.STRING, description: "Résumé utile en 2 à 4 paragraphes." },
        keyTakeaways: { ...stringArray, description: "5 à 8 points essentiels." },
        estimatedStudyTimeMinutes: { type: Type.INTEGER },
      },
      required: ["title", "summary", "keyTakeaways"],
    },
    glossary: {
      type: Type.ARRAY,
      description: "12 à 20 termes si le sujet le permet.",
      items: {
        type: Type.OBJECT,
        properties: { term: { type: Type.STRING }, definition: { type: Type.STRING } },
        required: ["term", "definition"],
      },
    },
    flashcards: {
      type: Type.ARRAY,
      description: "Cible 20 à 30 flashcards distinctes si la matière le permet.",
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING },
          back: { type: Type.STRING },
          category: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["EASY", "MEDIUM", "HARD"] },
        },
        required: ["front", "back", "difficulty"],
      },
    },
    multipleChoiceQuiz: {
      type: Type.ARRAY,
      description: "Cible 20 à 30 QCM variés, chacun avec quatre options, une seule réponse correcte et une explication.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { ...stringArray, description: "Exactement 4 choix distincts." },
          correctAnswer: { type: Type.STRING, description: "Doit correspondre exactement à une option." },
          explanation: { type: Type.STRING, description: "Explique la bonne réponse et les pièges courants." },
        },
        required: ["question", "options", "correctAnswer", "explanation"],
      },
    },
    activeRecallQuestions: {
      type: Type.ARRAY,
      description: "Cible 15 à 20 questions ouvertes distinctes.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          expectedAnswer: { type: Type.STRING },
          hint: { type: Type.STRING },
        },
        required: ["question", "expectedAnswer"],
      },
    },
    examQuestions: {
      type: Type.ARRAY,
      description: "Cible 8 à 12 problèmes ou questions d'examen progressifs.",
      items: {
        type: Type.OBJECT,
        properties: { question: { type: Type.STRING }, gradingCriteria: stringArray },
        required: ["question", "gradingCriteria"],
      },
    },
    aiTutorPrompts: stringArray,
  },
  required: ["overview", "coursePages", "glossary", "flashcards", "multipleChoiceQuiz", "activeRecallQuestions", "examQuestions", "aiTutorPrompts"],
};
