# AI-Powered Git Commit Generator

Generate clear, conventional commit messages from a `git diff` using a web UI backed by an Express API and Google Gemini.

## Features

- **AI commit message generation** from pasted diff output
- **Conventional Commits-style titles** (e.g. `feat: ...`, `fix: ...`)
- **Auth endpoints** for signup/login and protected profile route
- **Commit history endpoint** backed by MongoDB
- **Modern frontend** built with React + Vite

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), Google Gemini (`@google/generative-ai`)
- **Frontend**: React, Vite, TailwindCSS, Axios, React Router

## Project Structure

```text
.
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── commitRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (local or Atlas)
- A Google Gemini API key

### Backend Setup (Express)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `backend/.env` with the following variables:
   ```bash
   PORT=8001
   GOOGLE_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-pro
   MONGODB_URI=your_mongodb_connection_string
   ```

   Notes:
   - The server reads `.env` from `backend/.env`.
   - Mongo env key can also be `MONGODB_URL` (fallback supported).

3. Start the backend:
   ```bash
   npm run dev
   ```

4. Verify health:
   - `GET http://localhost:8001/health`

### Frontend Setup (React + Vite)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Open the app:
   - `http://localhost:5173`

## API Endpoints

Base URL (dev): `http://localhost:8001`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile` (requires auth)

### Commits

- `POST /api/generate-commit`
- `GET /api/commits`

## Troubleshooting

- **403 when pushing to GitHub**
  - Use SSH remote and ensure `ssh -T git@github.com` succeeds.

- **MongoDB connection error**
  - Ensure `MONGODB_URI` (or `MONGODB_URL`) is set in `backend/.env`.

- **Gemini key not detected**
  - Ensure `GOOGLE_API_KEY` is set in `backend/.env`.

## License

MIT

