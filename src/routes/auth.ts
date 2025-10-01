import { Router } from 'express';
import prisma from '../prismaSchema';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();

const entrySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name cannot exceed 20 characters"),
});

router.post('/enter', async (req, res) => {
  try {
    const parsed = entrySchema.parse(req.body);

    const player = await prisma.player.upsert({
      where: { name: parsed.name },
      update: {},
      create: { name: parsed.name },
    });

    const token = jwt.sign({ id: player.id, name: player.name }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({ token, player });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;