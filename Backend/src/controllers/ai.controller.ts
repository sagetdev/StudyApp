import { Request, Response } from "express";
import * as aiServices from "../services/ai.service";

export const generateFullStudyPack = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Correction de la déstructuration (on extrait depuis req.body)
        const { question } = req.body;

        if (!question || typeof question !== "string") {
            // 2. Ajout du 'return' pour stopper l'exécution ici si la validation échoue
            res.status(400).json({ error: "Question has to be specified and has to be a string" });
            return;
        }

        // 3. Appel du service avec 'await' pour récupérer le résultat de l'IA
        const studyPack = await aiServices.generateFullStudyPack(question);

        // 4. Renvoyer la réponse au client
        res.status(200).json(studyPack);

    } catch (e: any) {
        // 5. Implémentation du catch pour éviter que la requête ne plante sans rien dire
        console.error("Erreur lors de la génération du study pack :", e);
        res.status(500).json({ error: e.message || "Erreur interne du serveur." });
    }
};