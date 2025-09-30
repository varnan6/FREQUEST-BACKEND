import { Router } from 'express';
import prisma from '../prismaSchema';
import { hash, compare } from '../utils/hash';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../utils/validate';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) return res.status(400).json({ message: 'Email already used' });

    const passwordHash = await hash(parsed.password);
    const user = await prisma.user.create({ data: { email: parsed.email, passwordHash } });
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, player: null } });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ 
      where: { email: parsed.email },
      include: { player: true },
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await compare(parsed.password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;