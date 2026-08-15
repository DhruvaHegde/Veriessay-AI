from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class EssayAnalyzeRequest(BaseModel):
    title: Optional[str] = "Admissions Essay Analysis"
    essay_prompt: Optional[str] = None
    essay_text: str = Field(..., min_length=5, description="The college application essay text to analyze.")

class SentenceReportSchema(BaseModel):
    sentence_index: int
    text: str
    start_char: int
    end_char: int
    word_count: int
    classification: str  # human | ai | mixed
    confidence_score: float
    perplexity: float
    pos_signature: Optional[str] = None
    dep_tree_depth: Optional[int] = None
    flags: List[str] = []
    mixed_classification: str = "Uncertain"
    ai_probability: float = 0.0
    human_probability: float = 100.0
    reason: str = "Standard statistical signal evaluation"
    confidence: str = "Medium"  # High | Medium | Low
    suggested_action: str = "Proceed with standard application review"
    calculation_breakdown: Optional[Dict[str, Any]] = None

class EssayMetricsSchema(BaseModel):
    perplexity: float
    burstiness_score: float
    sentence_length_cv: float
    mean_sentence_length: float
    ttr: float
    root_ttr: float
    mattr: float
    syntactic_repetition_rate: float
    cliche_count: int
    identified_cliches: List[str] = []

class EssaySummarySchema(BaseModel):
    total_words: int
    total_sentences: int
    total_paragraphs: int
    ai_sentence_count: int
    flesch_reading_ease: float

class EssayAnalyzeResponse(BaseModel):
    id: Optional[int] = None
    title: str
    essay_prompt: Optional[str] = None
    essay_text: str
    overall_ai_score: float
    risk_level: str
    summary: EssaySummarySchema
    metrics: EssayMetricsSchema
    sentences: List[SentenceReportSchema]
    calculation_breakdown: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None

class EssayHistoryItem(BaseModel):
    id: int
    title: str
    ai_score: float
    risk_level: str
    word_count: int
    created_at: datetime
