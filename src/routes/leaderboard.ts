import { Router } from 'express';
import prisma from '../prismaSchema';


const router = Router();


router.get('/', async (req, res) => {
// top 10
const top = await prisma.player.findMany({ orderBy: { score: 'desc' }, take: 10 });
res.json(top);
});


export default router;