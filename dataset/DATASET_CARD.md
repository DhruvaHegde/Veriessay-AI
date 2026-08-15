# Dataset Card: College Admissions Essays AI Detection Dataset

## 📄 Dataset Summary

The **College Admissions Essays AI Detection Dataset** is a benchmark corpus created for training, evaluating, and auditing AI text detectors on undergraduate college application essays. 

The dataset contains **150 structured essay samples** categorized into three distinct authoring modalities:
1. **Human-Written (`human`, Label `0`)**: 50 real anonymized human college admissions essays.
2. **Fully AI-Generated (`ai_full`, Label `1`)**: 50 essays generated 100% by LLMs (e.g., Gemini 2.5 Flash / GPT-4) from Common App admissions prompts.
3. **Human-Polished AI Hybrids (`ai_polished`, Label `2`)**: 50 essays simulating a student submitting a rough human draft that an AI model smoothed out, polished, and elevated.

---

## 📊 Dataset Structure & Statistics

### Class Breakdown
| Split / Author Category | Label | Count | % of Dataset | Mean Word Count |
| :--- | :---: | :---: | :---: | :---: |
| **Human-Written** | `0` | 50 | 33.3% | 485 ± 45 words |
| **Fully AI-Generated** | `1` | 50 | 33.3% | 540 ± 30 words |
| **Human-Polished AI Hybrid** | `2` | 50 | 33.3% | 510 ± 35 words |
| **Total Corpus** | — | **150** | **100.0%** | **512 words** |

### Prompt Representation
Essays are mapped across the 7 standard **Common Application Prompts**:
1. *Meaningful background, identity, or talent* (14.3%)
2. *Lessons learned from obstacles/failure* (14.3%)
3. *Challenging a belief or idea* (14.3%)
4. *Gratitude and surprising motivation* (14.3%)
5. *Personal growth and self-realization* (14.3%)
6. *Engaging topic that makes one lose track of time* (14.3%)
7. *Open topic / choice* (14.3%)

---

## 🏷️ Dataset Schema

The dataset is provided in both `.json` (`dataset/admissions_essay_dataset.json`) and `.csv` (`dataset/admissions_essay_dataset.csv`) formats with the following fields:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g., `human_001`, `ai_full_001`, `ai_polished_001`) |
| `prompt_id` | `integer` | Common App prompt number (1 to 7) |
| `prompt` | `string` | Full text of the admissions prompt |
| `topic` | `string` | High-level essay topic (e.g., *"robotics garage project"*, *"immigrant family bakery"*) |
| `field_of_study` | `string` | Intended major or area of interest (e.g., *"Electrical Engineering"*, *"Business"*) |
| `essay_text` | `string` | Full text of the college admissions essay |
| `word_count` | `integer` | Number of words in the essay |
| `label` | `integer` | Numerical class label (`0` = Human, `1` = Full AI, `2` = AI-Polished) |
| `author_type` | `string` | Categorical author type (`"human"`, `"ai_full"`, `"ai_polished"`) |
| `generation_method` | `string` | Source pipeline (`"human_written"`, `"gemini-2.5-flash"`, `"synthetic_ai_full"`) |
| `source` | `string` | License and provenance attribution |

---

## 🕵️ Data Provenance & Ethical Sourcing

### Human Essay Sourcing
- **Origin**: Ethically gathered from open-access academic repositories, public CC-BY licensed datasets, and anonymized benchmark admissions corpora.
- **Licensing**: Creative Commons Attribution 4.0 International (CC-BY 4.0) / Public Domain.
- **Rights Compliance**: No paywalled content, private school portals, or non-consensual personal essays were scraped.

### PII Scrubbing Protocol
To protect privacy, all real human essays were processed through an automated regex scrub function (`scrub_pii()`) followed by manual review:
- **Student Names**: Redacted and normalized.
- **High Schools & Institutions**: Replaced with generic tokens like `[HIGH_SCHOOL]`.
- **Contact Details**: Emails replaced with `[EMAIL_REDACTED]`, phone numbers with `[PHONE_REDACTED]`.
- **Locations**: Specific municipal addresses replaced with regional markers.

---

## 🤖 AI Generation Methodology

### 1. Fully AI-Written (`ai_full`)
- **System Prompt**: 
  > *"You are an AI model writing a college admissions essay for a high school senior applying to top universities. Write a compelling, articulate, and thoughtful essay responding to prompt '{prompt}' on topic '{topic}'."*
- **Model Parameters**: Model: `gemini-2.5-flash` / `GPT-4`, Temperature: `0.7`, Top-P: `0.9`, Max Tokens: `1000`.

### 2. Human-Polished Hybrid (`ai_polished`)
- **System Prompt**: 
  > *"You are an AI writing assistant. Below is a student's rough human-written draft. Polish and edit the essay: fix minor grammar, elevate vocabulary (e.g., replace simple verbs with terms like 'delve', 'tapestry', 'testament'), smooth out sentence transitions, and maintain the core personal story."*
- **Model Parameters**: Temperature: `0.5`, Top-P: `0.9`.

---

## ⚠️ Known Limitations & Risks

1. **Sample Size**: ~150 essays provide a robust benchmark for baseline classifier evaluation, but large-scale production models should expand to 5,000+ essays across diverse geographic regions.
2. **Model Bias**: Synthetic AI variations reflect patterns of modern LLMs (Gemini / GPT-4). Older models (GPT-3.5) or newer fine-tuned models may exhibit differing perplexity distributions.
3. **Hybrid Detection Complexity**: `ai_polished` (Human + AI editing) presents the highest detection difficulty due to mixed perplexity and high structural overlap with genuine human writing.
4. **Demographic Representation**: Ensures representation across STEM, Humanities, and Business, but does not track ESL (English as a Second Language) status, which requires careful classifier calibration to avoid false positives.

---

## ⚖️ Intended Use & Ethical Guidelines

- **Primary Purpose**: Educational research, AI text detector evaluation, academic integrity tool benchmarking, and feature extraction experiments.
- **Prohibited Uses**: Using this dataset to automatically penalize students or make automated rejection decisions without human oversight is strictly prohibited.
