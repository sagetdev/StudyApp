import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Note, Prisma } from '../generated/client';

export async function listNotes(req: Request, res: Response): Promise<void> {
  try {
    const items = await prisma.note.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, body: true, createdAt: true, updatedAt: true },
    });
    res.json({ items });
  } catch (error) {
    console.error('Failed to list notes', error);
    res.status(500).json({ message: 'Impossible de charger les notes.' });
  }
}

export async function createNote(req: Request, res: Response): Promise<void> {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const body = typeof req.body?.body === 'string' ? req.body.body.trim() : '';
  if (!title || !body) {
    res.status(400).json({ message: 'Le titre et le contenu sont requis.' });
    return;
  }
  if (title.length > 180 || body.length > 50000) {
    res.status(400).json({ message: 'Le titre ou le contenu dépasse la longueur autorisée.' });
    return;
  }
  try {
    const item = await prisma.note.create({
      data: { userId: req.user!.id, title, body },
      select: { id: true, title: true, body: true, createdAt: true, updatedAt: true },
    });
    res.status(201).json(item);
  } catch (error) {
    console.error('Failed to save note', error);
    res.status(500).json({ message: 'Impossible d’enregistrer cette note.' });
  }
}

export async function deleteNote(req: Request, res: Response): Promise<void> {
  try {
    const noteId = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const result = await prisma.note.deleteMany({where: { id: noteId , userId: req.user!.id } });
    if (!result.count) {
      res.status(404).json({ message: 'Note introuvable.' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete note', error);
    res.status(500).json({ message: 'Impossible de supprimer cette note.' });
  }
}
