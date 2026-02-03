# DigiHaat Banner Generator

Promotional banner generator (722×312px) for DigiHaat employees with AI-powered image search.

## Project Structure

```
├── frontend/   → React + Vite app (banner UI & generation)
├── backend/    → Express.js API (Pixabay image search proxy)
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
cp .env.example .env   # then add your Pixabay API key
npm install
npm run dev            # starts on http://localhost:5000
```

Get a free Pixabay API key at https://pixabay.com/api/docs/
