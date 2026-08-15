# AI Detector for College Admissions Essays - Tech Stack & Architecture Prompt

## 📦 Context
Act as a Senior Software Architect & Full-Stack Engineer. We are building a modern, full-stack web application: **AI Detector for College Admissions Essays**.

The application helps admissions officers, educators, and applicants analyze college essays for AI-generated patterns, stylistic consistency, perplexity, burstiness, and clichés typical of LLMs (e.g., ChatGPT, Claude).

---

## 🛠️ Recommended Tech Stack

### 1. Frontend: Next.js 14+ (App Router) / React + TypeScript + Modern Vanilla CSS
- **Framework**: Next.js 14+ (App Router with Client/Server Components) or React (Vite)
- **Styling**: Vanilla CSS / CSS Modules with glassmorphism design system, dark mode, responsive layout, dynamic gauge meters, and highlighted sentence analysis.
- **State & Data Fetching**: React Hooks + Axios / native `fetch` API.

### 2. Backend: Python FastAPI + Uvicorn + Pydantic v2
- **Framework**: FastAPI (Python 3.10+) for high-performance, asynchronous REST API.
- **NLP / Analysis**: NLTK / custom statistical NLP models evaluating:
  - AI Probability Score (0 - 100%)
  - Perplexity & Burstiness metrics
  - Sentence-level classification (AI, Human, Mixed)
  - LLM Cliche & Buzzword Detector (e.g., "delve", "tapestry", "testament", "beacon")
- **Data Validation**: Pydantic v2 models.

### 3. Database: SQLite + SQLAlchemy (Async ORM)
- **Database Engine**: SQLite (`admissions_ai.db`) for lightweight, single-file persistent store.
- **ORM**: SQLAlchemy 2.0 with async engine for managing essay submission logs, analysis records, and stats.

---

## 🎯 Target Folder Structure

```
project-2/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py         # FastAPI REST API routes (/api/analyze, /api/essays)
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py         # App settings & CORS config
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── database.py       # SQLAlchemy engine & session setup
│   │   │   └── models.py         # SQLAlchemy EssayAnalysis model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── essay.py          # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── text_analyzer.py  # AI detection algorithm (perplexity, burstiness, cliches)
│   │   └── main.py               # FastAPI initialization & CORS middleware
│   ├── requirements.txt          # Python dependencies
│   └── setup.sh                  # Backend setup script
├── frontend/
│   ├── app/ (or src/)
│   │   ├── components/
│   │   │   ├── EssayForm.tsx     # Text input & file upload
│   │   │   ├── ScoreMeter.tsx    # Animated AI score dial/gauge
│   │   │   ├── HighlightView.tsx # Color-coded sentence breakdown
│   │   │   └── EssayHistory.tsx  # History table of past analyses
│   │   ├── page.tsx (or App.tsx) # Main Admissions Dashboard UI
│   │   ├── globals.css           # Modern design system tokens & layout
│   │   └── layout.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── prompt.md
```

---

## 🔒 Constraints & Best Practices
1. Enable CORS middleware in FastAPI to allow cross-origin requests from the Next.js frontend (`http://localhost:3000` or `http://localhost:5173`).
2. Automatic database initialization on backend startup to ensure `EssayAnalysis` table exists.
3. Clean error handling for empty strings, word count limits (< 50 words prompt warning), and backend exceptions.
4. Rich interactive UI with real-time text analysis dashboard, score gauge, color-coded highlights, and past analysis history.