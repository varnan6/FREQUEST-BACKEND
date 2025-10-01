import { Router } from 'express';
import prisma from '../prismaSchema';

const router = Router();

router.get('/', async (req, res) => {
  const players = await prisma.player.findMany({
    orderBy: { score: 'desc' },
  });
  res.json(players);
});

export default router;