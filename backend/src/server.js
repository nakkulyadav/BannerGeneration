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
import textToolsRouter from './routes/textTools.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// CORS — allow requests from the frontend dev server and production URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',  // Frontend actual port
    'http://localhost:5173',  // Vite default port
    'https://banner-generation.vercel.app',
  ],
}));

// Increase JSON body limit to 50MB — default 100KB rejects base64 image payloads
// from device uploads sent to Remove BG / Enhance endpoints
app.use(express.json({ limit: '50mb' }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Image search proxy
app.use('/api', imageSearchRouter);

// Text tools (translate + spell-check)
app.use('/api', textToolsRouter);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
