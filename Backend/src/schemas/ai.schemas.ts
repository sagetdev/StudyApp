import { Type } from "@google/genai";
import * as z from "zod";

export const comprehensiveStudyMaterialSchema = {
  type: Type.OBJECT,
  properties: {
    coursePages: { type: Type.ARRAY, description: "Découpe le cours en 3 à 8 pages pédagogiques progressives, avec explications courtes, exemples et points clés.", items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, examples: { type: Type.ARRAY, items: { type: Type.STRING } }, keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "content", "examples", "keyPoints"] } },
    // 1. Métadonnées & Résumé du cours
    overview: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Titre principal du cours ou sujet" },
        summary: { type: Type.STRING, description: "Résumé concis du cours (2-3 paragraphes)" },
        keyTakeaways: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Les 3 à 5 points essentiels à retenir absolument",
        },
        estimatedStudyTimeMinutes: {
          type: Type.INTEGER,
          description: "Temps d'étude estimé en minutes pour maîtriser ce cours",
        },
      },
      required: ["title", "summary", "keyTakeaways"],
    },

    // 2. Glossaire des concepts clés
    glossary: {
      type: Type.ARRAY,
      description: "Mots-clés, définitions et concepts fondamentaux",
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "Le terme ou concept" },
          definition: { type: Type.STRING, description: "La définition claire et précise" },
        },
        required: ["term", "definition"],
      },
    },

    // 3. Flashcards (Répétition espacée)
    flashcards: {
      type: Type.ARRAY,
      description: "Flashcards pour le rappel actif",
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "Question, formule ou terme" },
          back: { type: Type.STRING, description: "Réponse ou explication détaillée" },
          category: { type: Type.STRING, description: "Sous-thème de la flashcard" },
          difficulty: {
            type: Type.STRING,
            enum: ["EASY", "MEDIUM", "HARD"],
            description: "Niveau de difficulté estimé",
          },
        },
        required: ["front", "back", "difficulty"],
      },
    },

    // 4. Quiz à Choix Multiples (QCM)
    multipleChoiceQuiz: {
      type: Type.ARRAY,
      description: "Quiz auto-évaluatif sous forme de QCM",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Énoncé de la question" },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "4 options de réponse",
          },
          correctAnswer: { type: Type.STRING, description: "La bonne réponse exacte" },
          explanation: { type: Type.STRING, description: "Explication pédagogique de la réponse" },
        },
        required: ["question", "options", "correctAnswer", "explanation"],
      },
    },

    // 5. Rappel actif & Questions ouvertes (Fill-in-the-blank / Short Answer)
    activeRecallQuestions: {
      type: Type.ARRAY,
      description: "Questions ouvertes pour tester la restitution de mémoire sans indices",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Question ouverte ou texte à trou" },
          expectedAnswer: { type: Type.STRING, description: "Réponse attendue ou mots-clés obligatoires" },
          hint: { type: Type.STRING, description: "Indice optionnel en cas de blocage" },
        },
        required: ["question", "expectedAnswer"],
      },
    },

    // 6. Préparation aux examens (Sujets complexes)
    examQuestions: {
      type: Type.ARRAY,
      description: "Questions de type examen/essai nécessitant une réflexion approfondie",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Énoncé complexe type sujet d'examen" },
          gradingCriteria: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Critères de correction et points à aborder dans la réponse",
          },
        },
        required: ["question", "gradingCriteria"],
      },
    },

    // 7. Pistes pour l'Aide au Chatbot (AI Tutor Prompts)
    aiTutorPrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Questions suggérées à poser à un assistant IA pour approfondir le cours",
    },
  },
  required: [
    "overview",
    "coursePages",
    "glossary",
    "flashcards",
    "multipleChoiceQuiz",
    "activeRecallQuestions",
    "examQuestions",
    "aiTutorPrompts",
  ],
};