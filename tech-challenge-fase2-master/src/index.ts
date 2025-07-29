import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRouter';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
