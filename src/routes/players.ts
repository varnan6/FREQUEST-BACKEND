import { Router } from 'express';
import prisma from '../prismaSchema';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const { name } = req.body;
  const userId = req.user!.id;

  if (!name) return res.status(400).json({ message: 'Name required' });
  
  const existingPlayer = await prisma.player.findUnique({ where: { userId } });
  if (existingPlayer) {
    return res.status(400).json({ message: 'Player profile already exists' });
  }

  const player = await prisma.player.create({
    data: { name, userId },
  });
  res.status(201).json(player);
});

router.get('/', async (req, res) => {
  const players = await prisma.player.findMany({
    orderBy: { score: 'desc' },
  });
  res.json(players);
});

export default router;