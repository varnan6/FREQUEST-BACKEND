import { Router } from 'express';
import prisma from '../prismaSchema';
import { requireAuth, requireOrganizer } from '../middleware/auth';

const router = Router();


// Create player
router.post('/', requireAuth, requireOrganizer, async (req, res) => {
const { name } = req.body;
if (!name) return res.status(400).json({ message: 'Name required' });
const player = await prisma.player.create({ data: { name } });
res.json(player);
});


// List players
router.get('/', async (req, res) => {
const players = await prisma.player.findMany({ orderBy: { score: 'desc' } });
res.json(players);
});


// Get a player
router.get('/:id', async (req, res) => {
const { id } = req.params;
const player = await prisma.player.findUnique({ where: { id } });
if (!player) return res.status(404).json({ message: 'Not found' });
res.json(player);
});


// Update player (score, status) only organizer
router.patch('/:id', requireAuth, requireOrganizer, async (req, res) => {
const { id } = req.params;
const data: any = {};
if (typeof req.body.score === 'number') data.score = req.body.score;
if (typeof req.body.streak === 'number') data.streak = req.body.streak;
if (typeof req.body.status === 'string') data.status = req.body.status;
const updated = await prisma.player.update({ where: { id }, data });
res.json(updated);
});


// Delete player
router.delete('/:id', requireAuth, requireOrganizer, async (req, res) => {
const { id } = req.params;
await prisma.player.delete({ where: { id } });
res.json({ success: true });
});


export default router;