import { Router } from 'express';
import prisma from '../prismaSchema';

const router = Router();

router.get('/', async (req, res) => {
  const topPlayers = await prisma.player.findMany({
    orderBy: { score: 'desc' },
    take: 10,
  });
  res.json(topPlayers);
});

export default router;