/**
 * DigiHaat Banner Generator — Backend Server
 *
 * Express server that proxies Pixabay API requests,
 * keeping the API key secure on the server side.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import imageSearchRouter from './routes/imageSearch.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// CORS — allow requests from the frontend dev server and production URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://banner-generation.vercel.app',
  ],
}));

app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Image search proxy
app.use('/api', imageSearchRouter);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
