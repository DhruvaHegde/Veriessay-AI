import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from app.db.database import Base

class EssayAnalysis(Base):
    __tablename__ = "essay_analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, default="Admissions Essay Analysis")
    essay_prompt = Column(Text, nullable=True)
    essay_text = Column(Text, nullable=False)
    ai_score = Column(Float, nullable=False)
    risk_level = Column(String(100), nullable=False)
    word_count = Column(Integer, nullable=False)
    flesch_score = Column(Float, nullable=True)
    metrics = Column(JSON, nullable=False)
    sentences = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
