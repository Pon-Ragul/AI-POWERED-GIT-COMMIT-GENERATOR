# Setup Instructions

## Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB (running locally or connection string)
- Git

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env with your configuration:
   # - LLM provider settings (Ollama/OpenAI/Gemini)
   # - MongoDB connection string
   # - Secret key for JWT
   ```

5. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or ensure your MongoDB instance is running
   ```

6. **Run the server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API docs available at `http://localhost:8000/docs`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env if API URL differs from default
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## LLM Provider Configuration

### Option 1: Ollama (Default)
1. Install Ollama: https://ollama.ai/
2. Pull a model: `ollama pull llama3.2`
3. Ensure Ollama is running: `ollama serve`

### Option 2: OpenAI
1. Get API key from https://platform.openai.com/
2. Set in .env: `OPENAI_API_KEY=your_key_here`
3. Set provider: `LLM_PROVIDER=openai`

### Option 3: Gemini
1. Get API key from https://ai.google.dev/
2. Set in .env: `GEMINI_API_KEY=your_key_here`
3. Set provider: `LLM_PROVIDER=gemini`

## Usage

1. **Sign up** for a new account or **login** to existing account
2. **Generate Commit Messages:**
   - Go to Generator page
   - Select commit style (Developer/Normal)
   - Paste git diff or load example
   - Click "Generate Commit Message"
   - Copy result or push to GitHub

3. **View Commit History:**
   - Go to Dashboard
   - Filter by repository or search
   - View all your generated commits

4. **Push to GitHub:**
   - Enter repository path
   - Generate a commit message
   - Click "Push to GitHub"
   - Changes will be staged, committed, and pushed

## API Endpoints

### Public
- `POST /api/generate-commit` - Generate commit message
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Protected (Require Authentication)
- `GET /api/commits` - Get commit history
- `POST /api/commits` - Save commit
- `POST /api/git/repository-info` - Get repository info
- `POST /api/git/push` - Push to GitHub
- `GET /api/profile` - Get user profile

## Features Implemented

✅ **Commit Style Options**
- Developer Style (Conventional Commits)
- Normal English Style
- Dynamic AI prompt adjustment

✅ **Authentication System**
- User registration and login
- JWT-based authentication
- Protected routes

✅ **Database Integration**
- MongoDB for commit history
- User and commit models
- Filtering and sorting

✅ **Git Integration**
- Repository information
- Stage, commit, and push functionality
- Error handling

✅ **Modern UI**
- React with TypeScript
- Tailwind CSS styling
- Responsive design
- Authentication flow

## Production Deployment

### Backend
1. Set production environment variables
2. Use production ASGI server:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```
3. Configure reverse proxy (nginx)

### Frontend
1. Build for production:
   ```bash
   npm run build
   ```
2. Serve `dist/` directory
3. Configure API URL

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **LLM Provider Error**
   - Verify API keys are correct
   - Check provider is set in .env
   - Ensure Ollama is running (if using Ollama)

3. **Git Push Fails**
   - Check repository path is correct
   - Ensure git remote is configured
   - Verify authentication with remote

4. **Frontend Build Errors**
   - Run `npm install` to ensure dependencies
   - Check Node.js version (18+)

### Development Tips

- Use the API docs at `http://localhost:8000/docs` for testing
- Check browser console for frontend errors
- Review backend logs for API issues
- Use example git diff for testing
