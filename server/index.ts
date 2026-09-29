import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy skeleton for real API integration later
app.get('/api/indices', (req, res) => {
  res.status(501).json({ error: 'Not implemented. Use mock mode.' });
});

app.listen(PORT, () => {
  console.log(`Sahmy proxy server running on port ${PORT}`);
});
