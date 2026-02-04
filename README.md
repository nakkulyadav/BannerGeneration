# DigiHaat Banner Generator

Promotional banner generator (722×312px) for DigiHaat employees with AI-powered image search, background removal, and image enhancement.

## Features

- 🎨 Real-time banner preview with customizable elements
- 🔍 AI-powered image search via Google (SerpAPI)
- ✂️ Background removal for logos and product images (remove.bg)
- ✨ AI image enhancement for quality improvement (Cloudinary)
- 📱 Mobile responsive design
- 💾 Export as high-quality WEBP

## Project Structure

```
├── frontend/   → React + Vite app (banner UI & generation)
├── backend/    → Express.js API (image search, background removal, enhancement)
└── docs/       → Implementation plans & documentation
```

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:3000
```

### Backend

```bash
cd backend
cp .env.example .env   # then add your API keys (see below)
npm install
npm run dev            # starts on http://localhost:5000
```

#### Required API Keys

1. **SerpAPI** (Image Search) - Free tier: 100 searches/month
   - Sign up at https://serpapi.com
   - Add `SERPAPI_KEY` to `.env`

2. **remove.bg** (Background Removal) - Free tier: 50 removals/month
   - Sign up at https://www.remove.bg/api
   - Add `REMOVE_BG_API_KEY` to `.env`

3. **Cloudinary** (Image Enhancement) - Free tier: 25 credits/month
   - Sign up at https://cloudinary.com
   - Get Cloud Name, API Key, and API Secret from dashboard
   - Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `.env`
