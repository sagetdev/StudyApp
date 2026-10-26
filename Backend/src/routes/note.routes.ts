import { Router } from 'express';
import { createNote, deleteNote, listNotes } from '../controllers/note.controller';

const router = Router();
router.get('/', listNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;
