# Quick Start Guide

Get the AI Commit Message Generator up and running in 5 minutes!

## Prerequisites Check

- [ ] Python 3.11 or 3.12 installed (`python --version`) - **Note:** Python 3.13 may have compatibility issues
- [ ] Node.js 18+ installed (`node --version`)
- [ ] OpenAI API key (get one at https://platform.openai.com/api-keys)

**⚠️ Important:** If you're using Python 3.13 and encounter Rust compilation errors, see [TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md) for solutions.

## Step-by-Step Setup

### 1. Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Upgrade pip and install dependencies
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Create .env file
echo OPENAI_API_KEY=your_api_key_here > .env
echo OPENAI_MODEL=gpt-4o-mini >> .env

# Start server (use python -m if uvicorn command not found)
python -m uvicorn main:app --reload --port 8000
# OR if virtual environment is activated:
uvicorn main:app --reload --port 8000
```

✅ Backend running at `http://localhost:8000`

### 2. Frontend Setup (2 minutes)

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### 3. Test It Out (1 minute)

1. Open `http://localhost:5173` in your browser
2. Click "Load Example" to see a sample diff
3. Click "Generate Commit Message"
4. Copy the result!

## Troubleshooting

### Backend Issues

**Error: "OPENAI_API_KEY environment variable is required"**
- Make sure you created `.env` file in the `backend/` directory
- Check that the file contains: `OPENAI_API_KEY=sk-...`

**Error: Module not found**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Port 8000 already in use**
- Change port: `uvicorn main:app --reload --port 8001`
- Update frontend `.env`: `VITE_API_URL=http://localhost:8001`

### Frontend Issues

**Error: Cannot connect to API**
- Verify backend is running on port 8000
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend `.env` matches backend URL

**npm install fails**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
- Customize commit styles and LLM models in backend `.env`

## Production Deployment

For production use, see the "Production Deployment" section in [README.md](README.md).

