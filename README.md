Veriessay-AI
Veriessay-AI is an AI-powered admission essay analysis platform designed to evaluate essays using linguistic analysis, scoring techniques, and local AI models.

Features
AI-powered essay analysis
Admission essay scoring
Text quality and linguistic analysis
Sentence-level analysis
Segment highlighting
Explanation panel for detected issues
Essay history
Reports and metrics dashboard
Local model analysis support
Dataset-based experimentation
React + TypeScript frontend
FastAPI backend
SQLite database
Project Architecture
Veriessay-AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   ├── schemas/
│   │   │   └── essay.py
│   │   ├── services/
│   │   │   ├── local_model_analyzer.py
│   │   │   ├── scoring_engine.py
│   │   │   └── text_analyzer.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   ├── run.py
│   └── setup.sh
│
├── dataset/
│   ├── admissions_essay_dataset.csv
│   ├── admissions_essay_dataset.json
│   ├── raw_human_essays.csv
│   ├── raw_human_essays.json
│   ├── DATASET_CARD.md
│   ├── gather_essays.py
│   └── generate_variations.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── package.json
├── prompt.md
├── start.bat
├── start.sh
└── README.md
Technology Stack
Frontend
React
TypeScript
Vite
CSS
Backend
Python
FastAPI
SQLAlchemy
SQLite
AI / NLP
Local AI model analysis
Text analysis
Scoring engine
Dataset-driven evaluation
Dataset

The dataset/ directory contains admission essay data used for analysis and experimentation.

It includes:

Human-written essays
Processed essay datasets
JSON and CSV formats
Dataset documentation
Essay variation generation scripts
Installation
1. Clone the repository
git clone https://github.com/AshrithGowda-codes/Veriessay-AI.git
cd Veriessay-AI
2. Backend setup
cd backend
python -m venv venv

Activate the virtual environment on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt
3. Frontend setup

Open another terminal:

cd frontend
npm install
Running the Application
Backend

From the backend directory:

python run.py
Frontend

From the frontend directory:

npm run dev

The Vite development server will provide the frontend URL in the terminal.

Quick Start

For Windows, the project also includes:

start.bat

Run:

.\start.bat
Main Components
Essay Form

Allows users to submit admission essays for analysis.

Detector Dashboard

Provides the main essay analysis interface.

Results Dashboard

Displays analysis results and scoring information.

Sentence Highlighter

Highlights relevant sections and sentences identified during analysis.

Segment Analysis

Provides detailed analysis at the segment level.

Essay History

Stores and displays previous essay analysis results.

Reports

Provides analysis reports and metrics.

Explanation Panel

Provides explanations for detected patterns and scoring results.

Backend Services

The backend contains three primary analysis services:

local_model_analyzer.py
scoring_engine.py
text_analyzer.py

These services form the core processing pipeline for essay analysis.

Project Status

🚧 Active Development

Veriessay-AI is currently under development. Features, models, scoring methods, and UI components may continue to evolve.

Future Improvements
Improved AI detection and classification
Advanced NLP models
Better essay scoring
More detailed feedback generation
Model benchmarking
Authentication and user management
Cloud deployment
Advanced analytics
Improved report generation
License

This project is currently intended for educational, research, and development purposes.

Author

Dhruva Hegde 

GitHub:
https://github.com/DhruvaHegde