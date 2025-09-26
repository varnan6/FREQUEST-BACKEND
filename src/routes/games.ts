import { Router } from 'express';
import prisma from '../prismaSchema';
import { requireAuth, requireOrganizer } from '../middleware/auth';


const router = Router();


// Update player score (record history)
router.post('/score', requireAuth, requireOrganizer, async (req, res) => {
const { playerId, delta, reason } = req.body;
if (!playerId || typeof delta !== 'number') return res.status(400).json({ message: 'playerId and delta required' });


const player = await prisma.player.findUnique({ where: { id: playerId } });
if (!player) return res.status(404).json({ message: 'Player not found' });


const updated = await prisma.player.update({
where: { id: playerId },
data: {
score: { increment: delta },
streak: delta > 0 ? { increment: 1 } : 0,
histories: {
create: { delta, reason }
}
}
});


res.json(updated);
});


export default router;