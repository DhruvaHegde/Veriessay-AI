# Veriessay-AI

**Veriessay-AI** is an AI-powered admission essay analysis platform designed to evaluate and analyze essays using linguistic analysis, scoring techniques, sentence-level analysis, and local AI models.

The platform helps students understand the quality of their admission essays by providing scores, detailed feedback, highlighted segments, explanations, reports, and historical analysis.

---

## 🚀 Features

* 🤖 AI-powered essay analysis
* 📊 Admission essay scoring
* 📝 Text quality and linguistic analysis
* 🔍 Sentence-level analysis
* 🎯 Segment highlighting
* 💡 Explanation panel for detected issues
* 📚 Essay history
* 📈 Reports and analytics dashboard
* 🧠 Local AI model analysis support
* 🧪 Dataset-based experimentation
* 📊 Dataset-driven evaluation
* ⚡ React + TypeScript frontend
* 🚀 FastAPI backend
* 💾 SQLite database

---

## 🏗️ Project Architecture

```text
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
│   │
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
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite

### AI / NLP

* Local AI model analysis
* Natural Language Processing
* Text analysis
* Scoring engine
* Dataset-driven evaluation

---

## 📂 Dataset

The `dataset/` directory contains admission essay data used for analysis, testing, and experimentation.

It includes:

* Human-written essays
* Processed essay datasets
* CSV and JSON formats
* Dataset documentation
* Essay variation generation scripts
* Dataset gathering utilities

### Dataset Files

```text
dataset/
├── admissions_essay_dataset.csv
├── admissions_essay_dataset.json
├── raw_human_essays.csv
├── raw_human_essays.json
├── DATASET_CARD.md
├── gather_essays.py
└── generate_variations.py
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AshrithGowda-codes/Veriessay-AI.git
cd Veriessay-AI
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

---

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the required Node.js dependencies:

```bash
npm install
```

---

## ▶️ Running the Application

### Backend

From the `backend` directory:

```bash
python run.py
```

The FastAPI backend will start locally.

---

### Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will display the frontend URL in the terminal.

Typically, it will be available at:

```text
http://localhost:5173
```

---

## ⚡ Quick Start — Windows

The project includes a Windows startup script:

```text
start.bat
```

Run it from the project root:

```powershell
.\start.bat
```

This can be used to start the application without manually running each component.

---

## 🧩 Main Components

### Essay Form

Allows users to submit their admission essays for analysis.

### Detector Dashboard

Provides the primary interface for submitting and analyzing essays.

### Results Dashboard

Displays:

* Essay score
* Analysis results
* Detected issues
* Linguistic metrics
* Feedback

### Sentence Highlighter

Highlights sentences and sections identified as important or problematic during analysis.

### Segment Analysis

Provides detailed analysis of individual essay segments.

### Essay History

Stores previous essay analysis results so users can review their earlier submissions.

### Reports

Provides reports and metrics related to essay analysis.

### Explanation Panel

Explains detected patterns, issues, and scoring results to help users understand how their essay was evaluated.

---

## 🧠 Backend Analysis Pipeline

The backend contains three primary analysis services:

### `local_model_analyzer.py`

Handles analysis using locally available AI models.

### `scoring_engine.py`

Processes analysis results and calculates essay scores.

### `text_analyzer.py`

Performs linguistic and text-level analysis.

Together, these services form the core essay-processing pipeline:

```text
User Essay
    │
    ▼
Text Analyzer
    │
    ▼
Local AI Model
    │
    ▼
Scoring Engine
    │
    ▼
Analysis Results
    │
    ├── Essay Score
    ├── Linguistic Analysis
    ├── Sentence Analysis
    ├── Segment Detection
    └── Explanations
```

---

## 📊 Analysis Workflow

```text
          ┌───────────────────┐
          │    User Essay     │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │   Text Analysis   │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │   Local AI Model  │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │   Scoring Engine  │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ Analysis Results  │
          └─────────┬─────────┘
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Score     Feedback   Reports
```

---

## 🔬 Dataset-Based Experimentation

Veriessay-AI supports experimentation using admission essay datasets.

The dataset can be used for:

* Testing analysis techniques
* Evaluating scoring methods
* Comparing essay characteristics
* Generating essay variations
* Benchmarking analysis approaches
* Improving NLP-based analysis

---

## 📌 Project Status

🚧 **Active Development**

Veriessay-AI is currently under development.

Features, AI models, scoring methods, analysis techniques, and UI components may continue to evolve.

---

## 🔮 Future Improvements

Planned improvements include:

* 🤖 Improved AI detection and classification
* 🧠 Advanced NLP models
* 📊 More accurate essay scoring
* 💬 Detailed AI-generated feedback
* 🧪 Model benchmarking
* 🔐 Authentication and user management
* ☁️ Cloud deployment
* 📈 Advanced analytics
* 📄 Improved report generation
* 🎓 Personalized admission essay recommendations

---

## 🔐 Disclaimer

Veriessay-AI is intended for **educational, research, and development purposes**.

Essay scores and AI-generated analysis should be treated as guidance rather than as an official admission decision.

---

## 📜 License

This project is currently intended for educational, research, and development purposes.

---

## 👨‍💻 Author

**Dhruva Hegde**

GitHub:
https://github.com/DhruvaHegde

---

## ⭐ Acknowledgements

This project was developed as an educational and research-oriented platform for exploring:

* Artificial Intelligence
* Natural Language Processing
* Essay evaluation
* Machine learning experimentation
* Full-stack web development

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
