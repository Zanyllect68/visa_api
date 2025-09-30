import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'VISE Payment API is running' });
});

app.listen(PORT, () => {
  console.log(`VISE Payment API running on port ${PORT}`);
});
