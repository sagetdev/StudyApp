import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function listStudyPacks(req: Request, res: Response): Promise<void> {
  try {
    const items = await prisma.studyPack.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, sourceText: true, content: true, createdAt: true, updatedAt: true },
    });
    res.json({ items });
  } catch (error) {
    console.error('Failed to list study packs', error);
    res.status(500).json({ message: 'Impossible de charger les cours enregistrés.' });
  }
}

export async function createStudyPack(req: Request, res: Response): Promise<void> {
  const { content, sourceText } = req.body ?? {};
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    res.status(400).json({ message: 'Le contenu du cours est invalide.' });
    return;
  }
  const title = typeof content.overview?.title === 'string' ? content.overview.title.trim().slice(0, 180) : 'Cours sans titre';
  try {
    const item = await prisma.studyPack.create({
      data: {
        userId: req.user!.id,
        title: title || 'Cours sans titre',
        sourceText: typeof sourceText === 'string' ? sourceText.slice(0, 100000) : null,
        content,
      },
      select: { id: true, title: true, sourceText: true, content: true, createdAt: true, updatedAt: true },
    });
    res.status(201).json(item);
  } catch (error) {
    console.error('Failed to save study pack', error);
    res.status(500).json({ message: 'Impossible d’enregistrer ce cours.' });
  }
}

export async function deleteStudyPack(req: Request, res: Response): Promise<void> {
  try {
    const result = await prisma.studyPack.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
    if (!result.count) {
      res.status(404).json({ message: 'Cours introuvable.' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete study pack', error);
    res.status(500).json({ message: 'Impossible de supprimer ce cours.' });
  }
}
