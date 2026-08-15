from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete

from app.db.database import get_db
from app.db.models import EssayAnalysis
from app.schemas.essay import (
    EssayAnalyzeRequest,
    EssayAnalyzeResponse,
    EssayHistoryItem
)
from app.services.text_analyzer import analyze_essay

router = APIRouter()

@router.get("/health", tags=["System"])
async def health_check():
    return {"status": "ok", "service": "AI Detector for College Admissions Essays Backend"}

@router.post("/analyze", response_model=EssayAnalyzeResponse, status_code=status.HTTP_201_CREATED, tags=["Analysis"])
async def analyze_essay_endpoint(
    payload: EssayAnalyzeRequest,
    db: AsyncSession = Depends(get_db)
):
    if len(payload.essay_text.strip().split()) < 15:
        raise HTTPException(
            status_code=400,
            detail="Essay text is too short. Please provide at least 15 words for meaningful AI detection."
        )

    # Perform Statistical NLP analysis
    analysis_result = analyze_essay(payload.essay_text)

    # Create Database Model
    db_record = EssayAnalysis(
        title=payload.title or "Admissions Essay Analysis",
        essay_prompt=payload.essay_prompt,
        essay_text=payload.essay_text,
        ai_score=analysis_result["overall_ai_score"],
        risk_level=analysis_result["risk_level"],
        word_count=analysis_result["summary"]["total_words"],
        flesch_score=analysis_result["summary"]["flesch_reading_ease"],
        metrics=analysis_result["metrics"],
        sentences=analysis_result["sentences"]
    )

    db.add(db_record)
    await db.commit()
    await db.refresh(db_record)

    return EssayAnalyzeResponse(
        id=db_record.id,
        title=db_record.title,
        essay_prompt=db_record.essay_prompt,
        essay_text=db_record.essay_text,
        overall_ai_score=analysis_result["overall_ai_score"],
        risk_level=analysis_result["risk_level"],
        summary=analysis_result["summary"],
        metrics=analysis_result["metrics"],
        sentences=analysis_result["sentences"],
        created_at=db_record.created_at
    )

@router.get("/essays", response_model=List[EssayHistoryItem], tags=["History"])
async def get_essay_history(
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(EssayAnalysis).order_by(desc(EssayAnalysis.created_at)).limit(limit)
    result = await db.execute(stmt)
    records = result.scalars().all()

    return [
        EssayHistoryItem(
            id=rec.id,
            title=rec.title,
            ai_score=rec.ai_score,
            risk_level=rec.risk_level,
            word_count=rec.word_count,
            created_at=rec.created_at
        )
        for rec in records
    ]

@router.get("/essays/{essay_id}", response_model=EssayAnalyzeResponse, tags=["History"])
async def get_essay_detail(
    essay_id: int,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(EssayAnalysis).where(EssayAnalysis.id == essay_id)
    result = await db.execute(stmt)
    rec = result.scalar_one_or_none()

    if not rec:
        raise HTTPException(status_code=404, detail="Essay analysis record not found.")

    words = len(rec.essay_text.split())
    ai_sentence_count = sum(1 for s in rec.sentences if s.get("classification") == "ai")

    return EssayAnalyzeResponse(
        id=rec.id,
        title=rec.title,
        essay_prompt=rec.essay_prompt,
        essay_text=rec.essay_text,
        overall_ai_score=rec.ai_score,
        risk_level=rec.risk_level,
        summary={
            "total_words": words,
            "total_sentences": len(rec.sentences),
            "total_paragraphs": max(1, len([p for p in rec.essay_text.split("\n") if p.strip()])),
            "ai_sentence_count": ai_sentence_count,
            "flesch_reading_ease": rec.flesch_score or 65.0
        },
        metrics=rec.metrics,
        sentences=rec.sentences,
        created_at=rec.created_at
    )

@router.delete("/essays/{essay_id}", status_code=204, tags=["History"])
async def delete_essay(
    essay_id: int,
    db: AsyncSession = Depends(get_db)
):
    stmt = delete(EssayAnalysis).where(EssayAnalysis.id == essay_id)
    await db.execute(stmt)
    await db.commit()
    return None
