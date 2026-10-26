import express from "express";

import { generateFullStudyPack } from "../controllers/ai.controller";

const router = express.Router();

router.post('/ask', generateFullStudyPack);

export default router;