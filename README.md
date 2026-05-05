# AI Commit Message Generator

An intelligent, agentic AI system that automatically generates clear, concise, and meaningful Git commit messages from git diff output. Built with FastAPI, React, and a multi-agent AI architecture.

## 🎯 Features

- **Multi-Agent AI Pipeline**: Four specialized agents work together to analyze, classify, generate, and review commit messages
- **Conventional Commits**: Automatically follows Conventional Commits format (feat:, fix:, refactor:, etc.)
- **Smart Analysis**: Understands file changes, code intent, and change types
- **Quality Assurance**: Built-in reviewer agent validates grammar, clarity, and best practices
- **Multiple Styles**: Support for conventional, short, and detailed commit message styles
- **Developer-Friendly UI**: Clean, modern interface with copy-to-clipboard functionality

## 🏗️ Architecture

### Agentic AI Design

The system uses a 4-stage agent pipeline:

1. **Diff Analyzer Agent** - Analyzes raw git diff and extracts:
   - Modified files
   - Nature of changes (additions, deletions, modifications)
   - High-level intent of changes

2. **Commit Type Classifier Agent** - Determines commit type:
   - `feat`: New features
   - `fix`: Bug fixes
   - `refactor`: Code restructuring
   - `docs`: Documentation changes
   - `test`: Test additions/modifications
   - `chore`: Maintenance tasks

3. **Message Generator Agent** - Generates:
   - Commit title (≤72 characters)
   - Optional detailed commit body
   - Follows specified style (conventional/short/detailed)

4. **Quality Reviewer Agent** - Validates and improves:
   - Grammar and spelling
   - Clarity and specificity
   - Adherence to best practices
   - Confidence scoring

### Tech Stack

**Backend:**
- FastAPI (Python)
- OpenAI API (configurable)
- Pydantic for type safety
- Clean architecture with separation of concerns

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Axios for API communication
- Modern, responsive UI

## 📁 Project Structure

```
.
├── backend/
│   ├── agents/              # AI agents
│   │   ├── diff_analyzer.py
│   │   ├── type_classifier.py
│   │   ├── message_generator.py
│   │   └── quality_reviewer.py
│   ├── api/                 # API routes
│   │   └── routes.py
│   ├── schemas/             # Pydantic models
│   │   └── commit.py
│   ├── services/            # Business logic
│   │   └── llm_service.py
│   ├── config.py            # Configuration
│   ├── main.py              # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API key (or compatible API)

### Backend Setup

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
   
   # Edit .env and add your OpenAI API key:
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4o-mini  # or gpt-4, gpt-3.5-turbo, etc.
   ```

5. **Run the server:**
   ```bash
   # From backend directory
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API docs available at `http://localhost:8000/docs`

### Frontend Setup

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
   # Create .env file if API URL differs from default
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 📖 Usage

### Via Web UI

1. Open `http://localhost:5173` in your browser
2. Paste your git diff in the text area (or click "Load Example")
3. Select your preferred commit style
4. Click "Generate Commit Message"
5. Copy the generated message to your clipboard

### Via API

```bash
curl -X POST "http://localhost:8000/api/generate-commit" \
  -H "Content-Type: application/json" \
  -d '{
    "git_diff": "diff --git a/file.py b/file.py\n...",
    "style": "conventional"
  }'
```

**Response:**
```json
{
  "commit_title": "feat: add email validation with regex",
  "commit_body": "Replace simple string check with proper regex validation\nfor email format to improve accuracy.",
  "confidence": 0.92
}
```

## 📝 Example Inputs & Outputs

### Example 1: Feature Addition

**Input (git diff):**
```diff
diff --git a/src/utils/validator.ts b/src/utils/validator.ts
index 1234567..abcdefg 100644
--- a/src/utils/validator.ts
+++ b/src/utils/validator.ts
@@ -10,6 +10,8 @@ export function validateEmail(email: string): boolean {
   if (!email) {
     return false;
   }
+  // Check for valid email format
+  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
-  return email.includes('@');
+  return emailRegex.test(email);
 }
```

**Output:**
```
feat: improve email validation with regex pattern

Replace simple string inclusion check with proper regex validation
to ensure email format correctness.
```

### Example 2: Bug Fix

**Input (git diff):**
```diff
diff --git a/src/api/client.ts b/src/api/client.ts
--- a/src/api/client.ts
+++ b/src/api/client.ts
@@ -45,7 +45,7 @@ async function fetchUser(id: string) {
     const response = await fetch(`${API_URL}/users/${id}`);
     const data = await response.json();
-    return data.user;
+    return data;
   }
 }
```

**Output:**
```
fix: correct user data extraction from API response

Remove incorrect .user property access as API returns user object directly.
```

### Example 3: Refactoring

**Input (git diff):**
```diff
diff --git a/src/components/Button.tsx b/src/components/Button.tsx
--- a/src/components/Button.tsx
+++ b/src/components/Button.tsx
@@ -1,15 +1,20 @@
-export function Button({ text, onClick }) {
+interface ButtonProps {
+  text: string;
+  onClick: () => void;
+  variant?: 'primary' | 'secondary';
+}
+
+export function Button({ text, onClick, variant = 'primary' }: ButtonProps) {
   return (
-    <button onClick={onClick}>{text}</button>
+    <button className={`btn btn-${variant}`} onClick={onClick}>
+      {text}
+    </button>
   );
 }
```

**Output:**
```
refactor: add TypeScript types and variant prop to Button component

Add proper TypeScript interface and variant prop for better type safety
and component flexibility.
```

## 🔧 Configuration

### LLM Provider Configuration

The system supports configurable LLM providers. Currently supports:
- OpenAI (default)
- Compatible APIs (via `OPENAI_BASE_URL`)

**Environment Variables:**
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_BASE_URL=https://api.openai.com/v1  # Optional, for compatible APIs
OPENAI_MODEL=gpt-4o-mini  # or gpt-4, gpt-3.5-turbo, etc.
```

### API Configuration

```bash
# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🧪 Development

### Running Tests

```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

### Code Quality

```bash
# Backend linting
cd backend
flake8 .  # or your preferred linter

# Frontend linting
cd frontend
npm run lint
```

## 🏭 Production Deployment

### Backend

1. Set production environment variables
2. Use a production ASGI server:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```
3. Configure reverse proxy (nginx, etc.)

### Frontend

1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve `dist/` directory with a web server
3. Configure API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code quality and tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- AI capabilities via OpenAI API

---

**Note:** This tool requires an OpenAI API key (or compatible API) to function. Ensure you have proper API credentials configured before use.

