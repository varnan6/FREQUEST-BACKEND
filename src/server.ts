import app from './app';
import dotenv from 'dotenv';
import prisma from './prismaSchema';


dotenv.config();


const PORT = process.env.PORT || 4000;


const start = async () => {
try {
await prisma.$connect();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
} catch (err) {
console.error('Failed to start server', err);
process.exit(1);
}
};


start();