import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import playersRoutes from './routes/players';
import leaderboardRoutes from './routes/leaderboard';
// import gameRoutes   from './routes/games';


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/game', gameRoutes);


app.get('/', (req, res) => res.json({ ok: true }));


export default app;