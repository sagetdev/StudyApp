import { Router } from 'express';
import { createStudyPack, deleteStudyPack, listStudyPacks } from '../controllers/study-pack.controller';

const router = Router();
router.get('/', listStudyPacks);
router.post('/', createStudyPack);
router.delete('/:id', deleteStudyPack);

export default router;
