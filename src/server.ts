import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { startGame, addPlayer, removePlayer, updatePlayerFrequency } from './gameManager';

import entryRoutes from './routes/auth';
import playersRoutes from './routes/players';
import leaderboardRoutes from './routes/leaderboard';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

app.use('/api', entryRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('playerJoin', (playerId: string) => {
    addPlayer(socket, playerId);
  });

  socket.on('playerUpdate', (data: { frequency: number }) => {
    updatePlayerFrequency(socket, data.frequency);
  });

  socket.on('disconnect', () => {
    removePlayer(socket);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
  startGame(io);
});