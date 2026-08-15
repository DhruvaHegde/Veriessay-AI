#!/usr/bin/env python3
"""
text_analyzer.py
================
Senior Statistical NLP Text Analysis Engine for VeriEssay AI.
Detects statistical signals & structural AI patterns in college admissions essays:

1. Perplexity Proxy & Predictability (N-gram Character & Word Entropy).
2. Burstiness Index (Sentence length variance σ / μ & rhythm distribution).
3. Vocabulary Diversity (Type-Token Ratio - TTR, Root TTR, MATTR).
4. Syntactic Repetition & Parallel Sentence Openings.
5. LLM Admissions Clichés & Abstract Value Tropes (e.g. resilience, growth, passion, journey).
6. Structural AI Narrative Arc Detection (generic challenge -> lesson -> growth).
7. Short Human Text Safety Rule (protects casual, simple human text while catching AI).
8. Unified Thresholds:
     0 - 10  -> Likely Human Written / Full Human
    11 - 69  -> Moderate / Mixed AI
    70 - 100 -> Full AI
"""

import math
import re
from typing import Dict, List, Any, Tuple
from app.services.scoring_engine import score_and_explain_sentence, LLM_ANALYSIS_SYSTEM_PROMPT

# Try loading spaCy, NLTK, and textstat gracefully
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
        HAS_SPACY = True
    except Exception:
        nlp = None
        HAS_SPACY = False
except ImportError:
    nlp = None
    HAS_SPACY = False

try:
    import nltk
    from nltk.tokenize import sent_tokenize, word_tokenize
    HAS_NLTK = True
except ImportError:
    HAS_NLTK = False

try:
    import textstat
    HAS_TEXTSTAT = True
except ImportError:
    HAS_TEXTSTAT = False

# Known LLM Admissions Clichés, Buzzwords, and Abstract Value Tropes
LLM_CLICHES = {
    "delve", "delving", "tapestry", "testament", "beacon", "unwavering",
    "foster", "fostering", "resonate", "resonated", "realm", "pivotal",
    "transformative", "paradigm", "multifaceted", "intertwined", "interwoven",
    "in conclusion", "it is important to note", "serves as a", "stands as a",
    "beacon of hope", "rich tapestry", "testament to the power", "journey of self-discovery",
    "delve deeper into", "vital role", "profound impact", "spearheaded", "culminated",
    "catalyst", "cornerstone", "quintessential", "myriad", "embark", "embarking",
    "deeply rooted", "passion for", "sparked my interest", "tapestry of life"
}

# Abstract AI Values & Generic Narrative Tropes
AI_ABSTRACT_VALUES = {
    "resilience", "leadership", "patience", "responsibility", "independence",
    "personal growth", "valuable lesson", "invaluable lesson", "formative years",
    "overcoming challenges", "creative synthesis", "higher education", "rigorous academic",
    "discipline and", "stepping stone", "life-changing", "broader perspective",
    "holistic approach", "passion and dedication"
}

def tokenize_sentences_with_offsets(text: str) -> List[Dict[str, Any]]:
    sentences = []
    sentence_regex = re.compile(r'([^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$)')
    matches = list(sentence_regex.finditer(text))
    
    for idx, match in enumerate(matches):
        sent_str = match.group(0).strip()
        if not sent_str:
            continue
        start = match.start()
        end = match.end()
        sentences.append({
            "sentence_index": idx,
            "text": sent_str,
            "start_char": start,
            "end_char": end,
            "word_count": len(re.findall(r'\b\w+\b', sent_str))
        })
    return sentences

def compute_ttr_metrics(words: List[str]) -> Dict[str, float]:
    total_tokens = len(words)
    if total_tokens == 0:
        return {"ttr": 0.0, "root_ttr": 0.0, "mattr": 0.0}

    unique_tokens = len(set(w.lower() for w in words))
    ttr = unique_tokens / total_tokens
    root_ttr = unique_tokens / math.sqrt(total_tokens)

    window_size = min(25, total_tokens)
    if window_size > 0 and total_tokens >= window_size:
        mattr_scores = []
        for i in range(total_tokens - window_size + 1):
            window = words[i:i + window_size]
            mattr_scores.append(len(set(w.lower() for w in window)) / window_size)
        mattr = sum(mattr_scores) / len(mattr_scores)
    else:
        mattr = ttr

    return {
        "ttr": round(ttr, 4),
        "root_ttr": round(root_ttr, 4),
        "mattr": round(mattr, 4)
    }

def compute_perplexity_proxy(text: str) -> float:
    words = re.findall(r'\b\w+\b', text.lower())
    if len(words) < 2:
        return 50.0

    bigrams = [(words[i], words[i+1]) for i in range(len(words)-1)]
    bigram_counts: Dict[Tuple[str, str], int] = {}
    for bg in bigrams:
        bigram_counts[bg] = bigram_counts.get(bg, 0) + 1

    total_bigrams = len(bigrams)
    entropy = 0.0
    for count in bigram_counts.values():
        p = count / total_bigrams
        entropy -= p * math.log2(p)

    perplexity_proxy = round(math.pow(2, entropy) * 5.0, 2)
    return min(100.0, max(5.0, perplexity_proxy))

def compute_burstiness(sentence_lengths: List[int]) -> Dict[str, float]:
    n = len(sentence_lengths)
    if n == 0:
        return {"burstiness_score": 0.0, "cv": 0.0, "mean_len": 0.0, "std_dev": 0.0}

    mean_len = sum(sentence_lengths) / n
    if mean_len == 0:
        return {"burstiness_score": 0.0, "cv": 0.0, "mean_len": 0.0, "std_dev": 0.0}

    variance = sum((x - mean_len) ** 2 for x in sentence_lengths) / n
    std_dev = math.sqrt(variance)

    cv = std_dev / mean_len
    burstiness_b = (std_dev - mean_len) / (std_dev + mean_len) if (std_dev + mean_len) > 0 else 0.0

    return {
        "burstiness_score": round(burstiness_b, 4),
        "cv": round(cv, 4),
        "mean_len": round(mean_len, 2),
        "std_dev": round(std_dev, 2)
    }

def detect_ai_structural_patterns(text: str, sentences: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Detects macro AI structure:
    1. Generic 'challenge -> lesson -> growth' arc
    2. Overly balanced paragraph distributions & clean transitions
    3. High density of repeated abstract values (resilience, leadership, passion)
    4. Parallel sentence openings (e.g. 'Through...', 'By...', 'Through...', 'As I...')
    5. Generic moral conclusion / philosophical ending
    """
    text_lower = text.lower()
    all_words = re.findall(r'\b\w+\b', text_lower)
    total_words = max(1, len(all_words))

    # Abstract AI values count
    found_abstract = [val for val in AI_ABSTRACT_VALUES if val in text_lower]
    abstract_count = len(found_abstract)

    # Cliché matches
    found_cliches = [c for c in LLM_CLICHES if c in text_lower]

    # Sentence opening patterns (e.g., repeated starting POS or words like 'Through', 'By', 'As', 'From')
    starts = []
    for s in sentences:
        words = re.findall(r'\b\w+\b', s["text"].lower())
        if words:
            starts.append(words[0])

    repeated_starts = 0
    if len(starts) > 2:
        for i in range(1, len(starts)):
            if starts[i] == starts[i-1] or (starts[i] in ["through", "by", "as", "from", "with"] and starts[i-1] in ["through", "by", "as", "from", "with"]):
                repeated_starts += 1

    # Generic moral conclusion check (last paragraph/sentence contains generic reflection)
    has_generic_conclusion = False
    if len(sentences) > 0:
        last_sent = sentences[-1]["text"].lower()
        if any(term in last_sent for term in ["in conclusion", "fundamental truth", "higher education", "rich tapestry", "creative synthesis", "prepared to", "future endeavours", "looking forward"]):
            has_generic_conclusion = True

    # Generic AI Arc Flag
    is_generic_ai_arc = (
        (abstract_count >= 2 or len(found_cliches) >= 1) and
        (has_generic_conclusion or repeated_starts >= 1 or len(sentences) >= 4)
    )

    return {
        "found_abstract_values": found_abstract,
        "abstract_count": abstract_count,
        "cliche_matches": found_cliches,
        "repeated_starts": repeated_starts,
        "has_generic_conclusion": has_generic_conclusion,
        "is_generic_ai_arc": is_generic_ai_arc
    }

def compute_human_specificity_signals(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    first_person_count = len(re.findall(r'\b(i|my|me|mine|we|our|us)\b', text_lower))
    specific_details = len(re.findall(r'\b(garage|solder|resin|breadboard|synth|club|tuesday|laptops|speaker|radio|tinkering|hammer|dust|classroom|dentist|kitchen|attic|basement|dad|mom|grandma|brother|sister|teacher|night|c major|analog|copper|crackle|guy|guys|friend|dog|cat|house|car|school)\b', text_lower))
    numeric_specifics = len(re.findall(r'\b(\d+|19\d\d|20\d\d|first|second|three|four|five|six|seven|eight|nine|ten)\b', text_lower))
    
    conversational_markers = len(re.findall(r"\b(guys|lets|let's|see|done|better|tomorrow|because|near|time|try|all|individually|i'm|don't|can't|it's|you're|we're|they're|wasn't|didn't|gonna|wanna|yeah|cool|stuff|anyway|pretty|really|kind of|sort of|like|lol|tbh)\b", text_lower))
    
    cliche_matches = [c for c in LLM_CLICHES if c in text_lower]
    abstract_matches = [a for a in AI_ABSTRACT_VALUES if a in text_lower]
    total_words = len(re.findall(r'\b\w+\b', text))

    is_short_conversational = (total_words <= 35 and conversational_markers >= 1 and len(cliche_matches) == 0 and len(abstract_matches) == 0)
    is_casual_or_simple = (conversational_markers >= 1 or total_words < 15 or is_short_conversational)

    # Note Rule 3: Do NOT let one or two concrete details force the result to Human if AI clichés or abstract values are present!
    has_ai_evidence = (len(cliche_matches) > 0 or len(abstract_matches) > 0)
    has_human_override = (not has_ai_evidence) and (specific_details >= 2 or is_short_conversational)

    multiplier = 0.0 if (is_short_conversational and not has_ai_evidence) else (0.20 if has_human_override else 1.0)
    is_generic_abstract = (specific_details == 0 and numeric_specifics == 0 and conversational_markers == 0 and not has_human_override)

    return {
        "has_human_override": has_human_override,
        "human_override_multiplier": multiplier,
        "is_generic_abstract": is_generic_abstract,
        "is_casual_or_simple": is_casual_or_simple,
        "is_short_conversational": is_short_conversational,
        "has_ai_evidence": has_ai_evidence,
        "cliche_count": len(cliche_matches),
        "abstract_count": len(abstract_matches)
    }

def analyze_syntactic_repetition(sentence_texts: List[str]) -> Tuple[float, List[Dict[str, Any]]]:
    sentence_analysis = []
    pos_signatures = []

    for sent_text in sentence_texts:
        if HAS_SPACY and nlp:
            doc = nlp(sent_text)
            pos_seq = [token.pos_ for token in doc[:6]]
            pos_sig = "-".join(pos_seq)
            
            def get_depth(node):
                if not list(node.children):
                    return 1
                return 1 + max(get_depth(child) for child in node.children)
            
            roots = [t for t in doc if t.head == t]
            tree_depth = get_depth(roots[0]) if roots else 1
        else:
            words = re.findall(r'\b\w+\b', sent_text)
            pos_seq = ["WORD" for _ in words[:5]]
            pos_sig = "-".join(pos_seq)
            tree_depth = min(6, max(2, len(words) // 4))

        pos_signatures.append(pos_sig)
        sentence_analysis.append({
            "pos_signature": pos_sig,
            "dep_tree_depth": tree_depth
        })

    repeated_count = 0
    for i in range(1, len(pos_signatures)):
        if pos_signatures[i] == pos_signatures[i-1] and pos_signatures[i] != "":
            repeated_count += 1

    repetition_rate = round(repeated_count / max(1, len(pos_signatures) - 1), 3)
    return repetition_rate, sentence_analysis

def analyze_essay(text: str) -> Dict[str, Any]:
    if not text or not text.strip():
        empty_breakdown = {
            "original_text": text,
            "num_segments": 0,
            "segment_ai_score": 0.0,
            "base_model_score": 0.0,
            "human_signals_detected": ["Empty text"],
            "ai_signals_detected": [],
            "uncertainty_penalty": 0.0,
            "short_text_penalty": 0.0,
            "final_ai_likelihood": 0.0,
            "final_label": "Likely Human Written"
        }
        return {
            "error": "Empty text provided",
            "overall_ai_score": 0.0,
            "risk_level": "Likely Human Written",
            "metrics": {},
            "sentences": [],
            "paragraphs": [],
            "calculation_breakdown": empty_breakdown
        }

    raw_paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    sentences = tokenize_sentences_with_offsets(text)
    sentence_texts = [s["text"] for s in sentences]
    sentence_lengths = [s["word_count"] for s in sentences]
    all_words = re.findall(r'\b\w+\b', text)

    ttr_metrics = compute_ttr_metrics(all_words)
    overall_perplexity = compute_perplexity_proxy(text)
    overall_burstiness = compute_burstiness(sentence_lengths)
    repetition_rate, syn_data = analyze_syntactic_repetition(sentence_texts)
    ai_struct = detect_ai_structural_patterns(text, sentences)

    text_lower = text.lower()
    found_cliches = list(set(ai_struct["cliche_matches"] + [c for c in LLM_CLICHES if c in text_lower]))
    found_abstract = ai_struct["found_abstract_values"]

    sentence_reports = []
    ai_sentence_count = 0

    for idx, sent_obj in enumerate(sentences):
        s_text = sent_obj["text"]
        s_len = sent_obj["word_count"]
        s_perplexity = compute_perplexity_proxy(s_text)
        syn_info = syn_data[idx] if idx < len(syn_data) else {"pos_signature": "", "dep_tree_depth": 3}

        s_cliches = [c for c in LLM_CLICHES if c in s_text.lower()]
        s_abstract = [a for a in AI_ABSTRACT_VALUES if a in s_text.lower()]
        is_repetitive = bool(idx > 0 and syn_data[idx-1]["pos_signature"] == syn_info["pos_signature"])
        human_spec = compute_human_specificity_signals(s_text)

        stat_features = {
            "word_count": s_len,
            "paragraph_cv": overall_burstiness["cv"],
            "mean_paragraph_len": overall_burstiness["mean_len"],
            "pos_signature": syn_info["pos_signature"],
            "is_syntactically_repetitive": is_repetitive,
            "cliches_found": s_cliches,
            "abstract_found": s_abstract,
            "is_generic_ai_arc": ai_struct["is_generic_ai_arc"],
            "has_human_override": human_spec["has_human_override"],
            "human_override_multiplier": human_spec["human_override_multiplier"],
            "is_generic_abstract": human_spec["is_generic_abstract"],
            "is_casual_or_simple": human_spec["is_casual_or_simple"],
            "is_short_conversational": human_spec["is_short_conversational"]
        }

        lm_data = {
            "mean_loss": round(math.log(max(1.1, s_perplexity / 5.0)), 2),
            "perplexity": s_perplexity
        }

        scored = score_and_explain_sentence(s_text, stat_features, lm_data)

        if scored["classification"] == "ai":
            ai_sentence_count += 1

        sentence_reports.append({
            "sentence_index": idx,
            "text": s_text,
            "start_char": sent_obj["start_char"],
            "end_char": sent_obj["end_char"],
            "word_count": s_len,
            "classification": scored["classification"],
            "confidence_score": scored["confidence_score"],
            "perplexity": s_perplexity,
            "pos_signature": syn_info["pos_signature"],
            "dep_tree_depth": syn_info["dep_tree_depth"],
            "flags": scored["reasons_and_explanations"],
            "mixed_classification": scored["mixed_classification"],
            "ai_probability": scored["ai_probability"],
            "human_probability": scored["human_probability"],
            "reason": scored["reason"],
            "confidence": scored["confidence"],
            "suggested_action": scored["suggested_action"],
            "calculation_breakdown": scored["calculation_breakdown"]
        })

    # Macro AI Fusion Score:
    # If structural AI patterns, clichés, or abstract values exist, ensure overall score reflects AI patterns!
    segment_ai_avg = sum(s["ai_probability"] for s in sentence_reports) / max(1, len(sentence_reports))
    
    # Structural AI Boost
    macro_boost = 0.0
    if len(found_cliches) >= 1:
        macro_boost += 25.0 + (10.0 * len(found_cliches))
    if len(found_abstract) >= 1:
        macro_boost += 15.0 + (10.0 * len(found_abstract))
    if ai_struct["is_generic_ai_arc"]:
        macro_boost += 20.0
    if overall_burstiness["cv"] < 0.25 and len(sentence_reports) >= 3:
        macro_boost += 15.0

    if macro_boost > 0 and not any(s.get("calculation_breakdown", {}).get("is_short_conversational", False) for s in sentence_reports):
        overall_ai_score_raw = max(segment_ai_avg, min(95.0, segment_ai_avg + macro_boost))
    else:
        overall_ai_score_raw = segment_ai_avg

    overall_ai_score = round(min(99.0, max(0.0, overall_ai_score_raw)), 1)

    # EXACT UNIFIED THRESHOLDS RULE:
    # 0 <= overall_ai_score <= 10 -> "Likely Human Written"
    # 11 <= overall_ai_score <= 69 -> "Moderate / Mixed AI"
    # 70 <= overall_ai_score <= 100 -> "Full AI"
    if overall_ai_score <= 10.0:
        risk_level = "Likely Human Written"
    elif overall_ai_score <= 69.0:
        risk_level = "Moderate / Mixed AI"
    else:
        risk_level = "Full AI"

    # Transparent Overall Calculation Output Breakdown
    all_human_signals = []
    all_ai_signals = []
    for s in sentence_reports:
        cb = s.get("calculation_breakdown", {})
        all_human_signals.extend(cb.get("human_signals_detected", []))
        all_ai_signals.extend(cb.get("ai_signals_detected", []))

    if len(found_cliches) > 0:
        all_ai_signals.append(f"Admissions LLM tropes detected ({len(found_cliches)} matches)")
    if len(found_abstract) > 0:
        all_ai_signals.append(f"Generic abstract values detected ({', '.join(found_abstract[:3])})")
    if ai_struct["is_generic_ai_arc"]:
        all_ai_signals.append("Generic 'challenge -> lesson -> growth' structural arc detected")

    overall_breakdown = {
        "original_text": text,
        "num_segments": len(sentence_reports),
        "segment_ai_score": overall_ai_score,
        "base_model_score": round(sum(s.get("calculation_breakdown", {}).get("base_model_score", 0.0) for s in sentence_reports) / max(1, len(sentence_reports)), 1),
        "human_signals_detected": list(set(all_human_signals)),
        "ai_signals_detected": list(set(all_ai_signals)),
        "uncertainty_penalty": 0.0,
        "short_text_penalty": 0.0,
        "final_ai_likelihood": overall_ai_score,
        "final_label": risk_level
    }

    flesch_reading_ease = 65.0
    if HAS_TEXTSTAT:
        try:
            flesch_reading_ease = round(textstat.flesch_reading_ease(text), 1)
        except Exception:
            pass

    return {
        "overall_ai_score": overall_ai_score,
        "risk_level": risk_level,
        "system_prompt_rules": LLM_ANALYSIS_SYSTEM_PROMPT,
        "summary": {
            "total_words": len(all_words),
            "total_sentences": len(sentences),
            "total_paragraphs": len(raw_paragraphs),
            "ai_sentence_count": ai_sentence_count,
            "flesch_reading_ease": flesch_reading_ease
        },
        "metrics": {
            "perplexity": overall_perplexity,
            "burstiness_score": overall_burstiness["burstiness_score"],
            "sentence_length_cv": overall_burstiness["cv"],
            "mean_sentence_length": overall_burstiness["mean_len"],
            "ttr": ttr_metrics["ttr"],
            "root_ttr": ttr_metrics["root_ttr"],
            "mattr": ttr_metrics["mattr"],
            "syntactic_repetition_rate": repetition_rate,
            "cliche_count": len(found_cliches),
            "identified_cliches": found_cliches
        },
        "sentences": sentence_reports,
        "calculation_breakdown": overall_breakdown
    }
