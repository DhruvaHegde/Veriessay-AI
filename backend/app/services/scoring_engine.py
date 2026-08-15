#!/usr/bin/env bash
#!/usr/bin/env python3
"""
scoring_engine.py
=================
Multi-Signal Logic Engine & Human-Readable Explanation Generator for VeriEssay AI.

Fixes false negatives on AI-generated admissions essays:
- Detects abstract admissions value spam (resilience, leadership, growth, passion).
- Detects generic 'challenge -> lesson -> growth' structural AI narrative arcs.
- Ensures polished AI essays with invented personal details score >= 70% (Full AI) or 40-69% (Moderate AI).
- Preserves short conversational human text safety rule for informal chat messages.
- Exact Unified Thresholds:
     0 - 10  -> Likely Human Written / Probably Human (Green)
    11 - 69  -> Moderate / Mixed AI / Mixed AI/Human (Orange)
    70 - 100 -> Full AI / Probably AI (Red)
"""

from typing import Dict, List, Any, Optional

LLM_ANALYSIS_SYSTEM_PROMPT = """
You are an expert Admissions Essay Authenticity Evaluator. Analyze the essay text for stylistic consistency, token predictability, and AI generation patterns.

STRICT EVALUATION RULES:
1. Do NOT classify an essay as human only because it contains first-person voice, emotional language, personal stories, specific nouns, or good grammar. AI generates all of these easily.
2. Flag text as AI if it shows overly smooth admissions structure, generic 'challenge -> lesson -> growth' arcs, repeated abstract values (resilience, leadership, patience, growth), uniform sentence rhythm, or robotic transitions.
3. One or two concrete details (names, places, objects) MUST NOT force the result to Human if structural AI patterns or abstract tropes are present.
4. Only classify as Likely Human Written when strong authentic human evidence exists (e.g., informal conversational tone, raw messy style) and AI evidence is low.
"""

class AIScoringEngine:
    WEIGHT_LM_PERPLEXITY = 0.35
    WEIGHT_BURSTINESS = 0.20
    WEIGHT_SYNTAX_REPETITION = 0.15
    WEIGHT_CLICHES = 0.30

    def score_sentence(
        self,
        sentence_text: str,
        stat_features: Dict[str, Any],
        lm_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        explanations = []
        human_signals = []
        ai_signals = []
        signal_scores = {}

        word_count = stat_features.get("word_count", 15)
        cliches = stat_features.get("cliches_found", [])
        abstract_found = stat_features.get("abstract_found", [])
        is_generic_ai_arc = stat_features.get("is_generic_ai_arc", False)
        has_human_override = stat_features.get("has_human_override", False)
        is_generic_abstract = stat_features.get("is_generic_abstract", False)
        is_casual_or_simple = stat_features.get("is_casual_or_simple", False)
        is_short_conversational = stat_features.get("is_short_conversational", False)

        has_ai_tropes = bool(cliches or abstract_found or is_generic_ai_arc)

        # 1. Base Model Perplexity & Predictability (35% Weight)
        if lm_data and "perplexity" in lm_data and lm_data["perplexity"] > 0:
            perplexity = lm_data["perplexity"]
            mean_loss = lm_data.get("mean_loss", 2.5)

            if cliches or abstract_found:
                lm_ai_subscore = 0.90
                ai_signals.append("Predictable token transitions paired with generic AI tropes/abstract values.")
            elif is_generic_abstract and not has_human_override:
                lm_ai_subscore = 0.70
                ai_signals.append("Generic abstract phrasing lacking unique personal depth.")
            elif perplexity < 20.0 or mean_loss < 1.9:
                lm_ai_subscore = 0.85
                ai_signals.append("Unusually low token entropy indicating predictable text generation.")
            else:
                lm_ai_subscore = 0.05
                human_signals.append("High organic word choice entropy.")
        else:
            lm_ai_subscore = 0.85 if has_ai_tropes else (0.65 if is_generic_abstract and not has_human_override else 0.05)

        signal_scores["lm_predictability"] = lm_ai_subscore
        base_model_score = round(lm_ai_subscore * 100.0, 1)

        # 2. Evaluate Burstiness & Rhythm (20% Weight)
        paragraph_cv = stat_features.get("paragraph_cv", 0.35)

        if paragraph_cv < 0.25 and has_ai_tropes:
            burst_ai_subscore = 0.85
            ai_signals.append("Repetitive sentence rhythm with flat length variance.")
        elif has_ai_tropes:
            burst_ai_subscore = 0.65
        else:
            burst_ai_subscore = 0.05
            human_signals.append("Natural sentence length rhythm variance.")

        signal_scores["burstiness"] = burst_ai_subscore

        # 3. Evaluate Syntactic Repetition (15% Weight)
        is_repetitive = stat_features.get("is_syntactically_repetitive", False)
        pos_sig = stat_features.get("pos_signature", "")

        if is_repetitive and has_ai_tropes:
            syntax_ai_subscore = 0.85
            ai_signals.append(f"Repetitive POS pattern matching preceding sentence ('{pos_sig}').")
        elif has_ai_tropes:
            syntax_ai_subscore = 0.60
        else:
            syntax_ai_subscore = 0.05

        signal_scores["syntax_repetition"] = syntax_ai_subscore

        # 4. Evaluate LLM Admissions Clichés & Abstract Value Tropes (30% Weight)
        if cliches or abstract_found:
            cliche_ai_subscore = min(1.0, 0.70 + (0.15 * (len(cliches) + len(abstract_found))))
            all_trope_str = "', '".join(set(cliches + abstract_found))
            ai_signals.append(f"Contains AI admissions trope phrase(s)/abstract value(s): '{all_trope_str}'.")
            explanations.append(f"Contains AI admissions trope phrase(s)/abstract value(s): '{all_trope_str}'.")
        elif is_generic_ai_arc:
            cliche_ai_subscore = 0.75
            ai_signals.append("Generic 'challenge -> lesson -> growth' structural AI narrative arc.")
            explanations.append("Generic 'challenge -> lesson -> growth' structural AI narrative arc.")
        else:
            cliche_ai_subscore = 0.0
            human_signals.append("Zero AI admissions clichés or trope phrases detected.")

        signal_scores["cliches"] = cliche_ai_subscore

        # 5. Raw AI Score Calculation
        final_ai_score_raw = (
            (self.WEIGHT_LM_PERPLEXITY * signal_scores["lm_predictability"]) +
            (self.WEIGHT_BURSTINESS * signal_scores["burstiness"]) +
            (self.WEIGHT_SYNTAX_REPETITION * signal_scores["syntax_repetition"]) +
            (self.WEIGHT_CLICHES * signal_scores["cliches"])
        ) * 100.0

        short_text_penalty = 0.0
        uncertainty_penalty = 0.0

        # SHORT HUMAN TEXT SAFETY RULE (Only applies if zero AI tropes/clichés exist!)
        if is_short_conversational and not has_ai_tropes:
            final_ai_score_raw = 0.0
            base_model_score = 0.0
            human_signals.append("Short conversational human text safety rule active ('guys', 'lets', casual syntax).")
        elif is_casual_or_simple and not has_ai_tropes:
            final_ai_score_raw = min(10.0, final_ai_score_raw * 0.20)
            human_signals.append("Conversational tone & informal phrasing detected.")
        elif has_human_override and not has_ai_tropes:
            final_ai_score_raw = min(10.0, final_ai_score_raw * 0.25)
            human_signals.append("Personal narrative markers & concrete detail override active.")

        final_ai_score = round(min(99.0, max(0.0, final_ai_score_raw)), 1)
        ai_prob = final_ai_score
        human_prob = round(100.0 - ai_prob, 1)

        # 6. EXACT THRESHOLD LOGIC:
        # 0 <= ai_prob <= 10   -> Probably Human
        # 11 <= ai_prob <= 69  -> Mixed AI/Human
        # 70 <= ai_prob <= 100 -> Probably AI
        has_humanizer_artifacts = stat_features.get("has_humanizer_artifacts", False)

        if has_humanizer_artifacts and has_ai_tropes:
            mixed_classification = "Possibly Humanized AI"
            classification = "mixed"
            if not explanations:
                explanations.append("Structural AI baseline paired with forced synonym replacements typical of humanizer tools.")
        elif ai_prob <= 10.0:
            mixed_classification = "Probably Human"
            classification = "human"
        elif ai_prob <= 69.0:
            mixed_classification = "Mixed AI/Human"
            classification = "mixed"
        else:
            mixed_classification = "Probably AI"
            classification = "ai"

        confidence_score = round(min(0.99, max(0.05, ai_prob / 100.0)), 3)
        confidence_level = "High" if (ai_prob >= 70.0 or human_prob >= 70.0 or has_ai_tropes) else "Medium"

        if mixed_classification == "Probably Human":
            reason_summary = "Well-structured human writing with natural personal style."
        elif mixed_classification == "Probably AI":
            reason_summary = explanations[0] if explanations else "Generic admissions structure with predictable AI phrasing and abstract value repetition."
        elif mixed_classification == "Possibly Humanized AI":
            reason_summary = "AI base template with automated synonym cycling or altered phrasing."
        else:
            reason_summary = explanations[0] if explanations else "Combination of authentic narrative and generic AI phrasing."

        suggested_action = "Recommend holistic admissions review & candidate interview regarding technical essay details." if mixed_classification == "Probably AI" else ("Inspect highlighted AI segments and verify stylistic consistency across application." if mixed_classification in ["Mixed AI/Human", "Possibly Humanized AI"] else "Proceed with standard application review.")

        max_signal = max(signal_scores, key=signal_scores.get)
        contributor_map = {
            "lm_predictability": "Predictable LLM Token Sequence",
            "burstiness": "Flat Sentence Length Rhythm",
            "syntax_repetition": "Repetitive POS Structure",
            "cliches": "Admissions LLM Tropes & Abstract Values"
        }
        primary_contributor = contributor_map.get(max_signal, "Balanced Signals")
        if classification == "human":
            primary_contributor = "Human Stylistic Variance"

        calculation_breakdown = {
            "original_text": sentence_text,
            "num_segments": 1,
            "segment_ai_score": ai_prob,
            "base_model_score": base_model_score,
            "human_signals_detected": human_signals,
            "ai_signals_detected": ai_signals,
            "uncertainty_penalty": uncertainty_penalty,
            "short_text_penalty": short_text_penalty,
            "final_ai_likelihood": ai_prob,
            "final_label": mixed_classification
        }

        return {
            "sentence_text": sentence_text,
            "ai_score": final_ai_score,
            "classification": classification,
            "confidence_score": confidence_score,
            "primary_contributor": primary_contributor,
            "reasons_and_explanations": explanations if explanations else ["Well-structured human writing."],
            "signal_subscores": {k: round(v, 3) for k, v in signal_scores.items()},
            "mixed_classification": mixed_classification,
            "ai_probability": ai_prob,
            "human_probability": human_prob,
            "reason": reason_summary,
            "confidence": confidence_level,
            "suggested_action": suggested_action,
            "calculation_breakdown": calculation_breakdown
        }

engine_instance = AIScoringEngine()

def score_and_explain_sentence(
    sentence_text: str,
    stat_features: Dict[str, Any],
    lm_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    return engine_instance.score_sentence(sentence_text, stat_features, lm_data)
