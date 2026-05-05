# Architecture Documentation

## System Overview

The AI Commit Message Generator uses a **multi-agent architecture** where specialized AI agents collaborate to transform raw git diff output into high-quality commit messages.

## Agent Pipeline

### 1. Diff Analyzer Agent (`agents/diff_analyzer.py`)

**Purpose:** Understand the nature and scope of code changes

**Input:**
- Raw git diff text

**Output:**
- Structured analysis containing:
  - List of modified files
  - Change types per file (additions, deletions, modifications)
  - High-level intent of changes

**LLM Prompt Strategy:**
- System prompt: Establishes role as code analysis expert
- User prompt: Requests structured analysis of the diff
- Temperature: 0.2 (low for consistency)

### 2. Commit Type Classifier Agent (`agents/type_classifier.py`)

**Purpose:** Determine the appropriate Conventional Commits type

**Input:**
- Analysis from Diff Analyzer Agent

**Output:**
- Commit type: `feat`, `fix`, `refactor`, `docs`, `test`, or `chore`
- Reasoning: Brief justification for the classification

**LLM Prompt Strategy:**
- System prompt: Defines Conventional Commits types
- User prompt: Requests classification with justification
- Temperature: 0.1 (very low for deterministic classification)
- Validation: Ensures output matches valid commit types

### 3. Message Generator Agent (`agents/message_generator.py`)

**Purpose:** Generate the actual commit message

**Input:**
- Diff analysis
- Commit type
- Style preference (conventional/short/detailed)

**Output:**
- Commit title (≤72 characters)
- Optional commit body

**LLM Prompt Strategy:**
- System prompt: Establishes commit message best practices
- User prompt: Provides context and style requirements
- Temperature: 0.4 (balanced for creativity and consistency)
- Format enforcement: Ensures title follows `type: description` format

### 4. Quality Reviewer Agent (`agents/quality_reviewer.py`)

**Purpose:** Validate and improve message quality

**Input:**
- Generated commit title and body
- Original diff analysis (for context)

**Output:**
- Reviewed/improved commit message
- Confidence score (0.0-1.0)
- Issues found (if any)

**LLM Prompt Strategy:**
- System prompt: Defines quality criteria
- User prompt: Requests review with specific checks
- Temperature: 0.2 (low for consistency)
- Validation: Ensures confidence score is in valid range

## Service Layer

### LLM Service (`services/llm_service.py`)

**Purpose:** Abstract LLM provider interactions

**Features:**
- Configurable provider support (OpenAI, compatible APIs)
- Unified interface for all agents
- Environment-based configuration
- Error handling

**Configuration:**
- Provider selection via `LLM_PROVIDER`
- API key management via environment variables
- Model selection via `OPENAI_MODEL`
- Base URL customization for compatible APIs

## API Layer

### Routes (`api/routes.py`)

**Endpoint:** `POST /api/generate-commit`

**Request Schema:**
```python
{
  "git_diff": str,
  "style": "conventional" | "short" | "detailed"
}
```

**Response Schema:**
```python
{
  "commit_title": str,
  "commit_body": str,
  "confidence": float  # 0.0-1.0
}
```

**Flow:**
1. Initialize all agents with LLM service
2. Execute agent pipeline sequentially
3. Return final reviewed message

## Frontend Architecture

### Component Structure

**App Component (`App.tsx`)**
- Root component
- Layout and header

**CommitGenerator Component (`components/CommitGenerator.tsx`)**
- Main UI component
- State management for:
  - Git diff input
  - Style selection
  - Loading states
  - Results and errors
- User interactions:
  - Diff input/paste
  - Style selection
  - Generate action
  - Copy to clipboard

### Service Layer

**API Service (`services/api.ts`)**
- Axios-based HTTP client
- Type-safe request/response handling
- Environment-based API URL configuration

## Data Flow

```
User Input (git diff)
    ↓
Frontend (React)
    ↓
API Request (POST /api/generate-commit)
    ↓
Backend (FastAPI)
    ↓
Agent Pipeline:
    1. Diff Analyzer → Analysis
    2. Type Classifier → Commit Type
    3. Message Generator → Draft Message
    4. Quality Reviewer → Final Message
    ↓
API Response
    ↓
Frontend Display
    ↓
User (Copy to clipboard)
```

## Error Handling

**Backend:**
- ValueError → 400 Bad Request
- General exceptions → 500 Internal Server Error
- LLM service errors → Propagated with context

**Frontend:**
- Network errors → User-friendly error messages
- Validation errors → Inline feedback
- Loading states → Visual indicators

## Configuration Management

**Backend:**
- `config.py`: Centralized settings via Pydantic
- Environment variables with `.env` support
- Type-safe configuration access

**Frontend:**
- Environment variables via Vite (`VITE_*` prefix)
- Default values for development
- Type-safe configuration

## Extensibility

### Adding New LLM Providers

1. Extend `LLMService` with provider detection
2. Implement provider-specific client initialization
3. Maintain unified `generate()` interface

### Adding New Commit Styles

1. Update `CommitStyle` type in schemas
2. Add style instructions in `MessageGeneratorAgent`
3. Update frontend dropdown options

### Adding New Agents

1. Create agent class in `agents/`
2. Implement async `execute()` method
3. Integrate into pipeline in `api/routes.py`

## Performance Considerations

- **Sequential Agent Execution:** Agents run sequentially to maintain context
- **Token Management:** Each agent uses appropriate `max_tokens` limits
- **Temperature Tuning:** Optimized per agent for desired output characteristics
- **Caching:** Future enhancement opportunity for repeated diffs

## Security Considerations

- **API Keys:** Never hardcoded, always from environment
- **Input Validation:** Pydantic schemas validate all inputs
- **CORS:** Configurable origins for frontend access
- **Error Messages:** Sanitized to avoid information leakage

