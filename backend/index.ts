import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import enrichRouter from './routes/enrich';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/enrich', enrichRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
