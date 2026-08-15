#!/usr/bin/env python3
"""
generate_variations.py
======================
Generates AI variations for college admissions essays using LLM APIs (Gemini / OpenAI).
For each human-written essay in `dataset/raw_human_essays.json`, this script generates:

1. Variation A (ai_full): A 100% AI-generated college admissions essay from scratch
   responding to the exact prompt and topic.
2. Variation B (ai_polished): A human-polished hybrid essay simulating a student who wrote
   a rough draft and ran it through ChatGPT/Claude/Gemini to smooth grammar, elevate vocabulary,
   and polish transitions.

Outputs combined 150-essay dataset to `dataset/admissions_essay_dataset.json` and `.csv`.
"""

import os
import json
import csv
import time
from typing import Dict, List, Optional

# Load Gemini API SDK if available
try:
    from google import genai
    from google.genai import types
    HAS_GEMINI_SDK = True
except ImportError:
    HAS_GEMINI_SDK = False

# Prompt Templates
FULL_AI_SYSTEM_PROMPT = """You are an AI model writing a college admissions essay for a high school senior applying to top universities.
Write a compelling, articulate, and thoughtful college admissions essay responding to the following prompt.

Prompt: "{prompt}"
Topic/Theme: "{topic}"
Target Word Count: 500 - 650 words.

Guidelines:
- Use sophisticated vocabulary, balanced paragraph structure, and smooth transitions.
- Include reflective insights typical of AI-generated personal statements.
- Avoid informal typos or grammar mistakes.
"""

HUMAN_POLISHED_SYSTEM_PROMPT = """You are an AI writing assistant (like ChatGPT or Claude) helping a student edit their college admissions essay.
Below is the student's rough human-written draft.

Your task is to POLISH and EDIT the essay:
1. Fix any minor grammatical or punctuation errors.
2. Elevate the vocabulary with more formal, impactful phrasing (e.g., replace simple verbs with terms like 'delve', 'tapestry', 'testament', 'beacon').
3. Smooth out sentence transitions and tighten paragraph pacing.
4. Keep the core personal story intact, but make the writing style reflect an AI-assisted polish.

Student's Original Draft:
\"\"\"
{original_draft}
\"\"\"

Output ONLY the final polished essay text without extra intro commentary.
"""

def generate_with_gemini(prompt_text: str, api_key: str) -> Optional[str]:
    """Generates text via Google Gemini API."""
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt_text,
            config=types.GenerateContentConfig(
                temperature=0.7,
                top_p=0.9,
                max_output_tokens=1000
            )
        )
        return response.text.strip() if response.text else None
    except Exception as e:
        print(f"⚠️ Gemini API Call Error: {e}")
        return None

def fallback_synthetic_generator(original_essay: Dict, variation_type: str) -> str:
    """
    Fallback deterministic synthetic variation generator when no API key is set.
    Demonstrates structural patterns of AI-full and AI-polished text.
    """
    original_text = original_essay["essay_text"]
    prompt = original_essay["prompt"]
    topic = original_essay["topic"]
    
    if variation_type == "ai_full":
        return f"""
Embarking on a journey of self-discovery, my passion for {topic} has served as a beacon of illumination throughout my academic trajectory. 

From a young age, I have harbored a profound curiosity regarding how complex systems interweave to create meaningful impact. Prompted by the query of '{prompt[:60]}...', I realized that true personal growth stems not from passive observation, but from immersive engagement with challenges that test one's resilience.

During my formative high school years, I spearheaded an initiative centered on {topic}. This endeavor served as a testament to the power of collaborative problem-solving. Each obstacle encountered became an invaluable learning opportunity, compelling me to delve deeper into technical nuances and refine my strategic approach. Through meticulous iteration and unwavering determination, our team successfully navigated intricate hurdles, ultimately achieving a transformative outcome.

This experience illuminated a fundamental truth: innovation exists at the intersection of discipline and creative synthesis. As I prepare to enter higher education, I seek to cultivate this tapestry of experiences within a rigorous academic community, leveraging my background in {original_essay['field_of_study']} to foster inclusive solutions for global societal challenges.
""".strip()
    
    else:  # ai_polished
        # Simulates AI polishing a human draft with elevated vocabulary and smooth transitions
        polished = original_text.replace("I spent three weeks watching YouTube tutorials", "I spent three weeks diligently examining instructional videos and technical schematics")
        polished = polished.replace("Hearing the crisp crackle of a jazz station burst through the speaker remains the most thrilling moment of my early life.", "Experiencing the harmonious transmission of jazz audio through the speaker served as a pivotal catalyst in my intellectual journey.")
        polished = polished.replace("What began as three students fixing old laptops quickly evolved into a community project", "What initially commenced as a modest trio refurbishing legacy hardware rapidly blossomed into a impactful civic initiative")
        polished = f"A Testament to Resilience and Innovation\n\n" + polished
        return polished

def main():
    json_path = "dataset/raw_human_essays.json"
    if not os.path.exists(json_path):
        print(f"❌ Error: '{json_path}' not found. Please run 'python dataset/gather_essays.py' first.")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        human_essays = json.load(f)

    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        print("🔑 GEMINI_API_KEY detected. Using live LLM API for generation.")
    else:
        print("ℹ️ GEMINI_API_KEY not found in environment. Using fallback synthetic variation engine.")
        print("   To use live LLM API, run: export GEMINI_API_KEY='your_api_key'")

    all_essays = []

    # 1. Add Human Essays to combined dataset
    for essay in human_essays:
        all_essays.append({
            "id": essay["id"],
            "prompt_id": essay["prompt_id"],
            "prompt": essay["prompt"],
            "topic": essay["topic"],
            "field_of_study": essay["field_of_study"],
            "essay_text": essay["essay_text"],
            "word_count": len(essay["essay_text"].split()),
            "label": 0,
            "author_type": "human",
            "generation_method": "human_written",
            "source": essay.get("source", "human_corpus")
        })

    # 2. Generate Full-AI & Human-Polished Variations
    print(f"\n⚡ Generating variations for {len(human_essays)} base essays...")
    
    for idx, human_item in enumerate(human_essays):
        base_id = human_item["id"].replace("human_", "")
        prompt = human_item["prompt"]
        topic = human_item["topic"]
        original_draft = human_item["essay_text"]

        print(f"  [{idx+1}/{len(human_essays)}] Processing Essay #{base_id} ({topic})...")

        # Variation A: Full AI
        full_ai_prompt = FULL_AI_SYSTEM_PROMPT.format(prompt=prompt, topic=topic)
        ai_full_text = None
        if api_key and HAS_GEMINI_SDK:
            ai_full_text = generate_with_gemini(full_ai_prompt, api_key)
            time.sleep(1) # Rate limit padding
        
        if not ai_full_text:
            ai_full_text = fallback_synthetic_generator(human_item, "ai_full")

        all_essays.append({
            "id": f"ai_full_{base_id}",
            "prompt_id": human_item["prompt_id"],
            "prompt": prompt,
            "topic": topic,
            "field_of_study": human_item["field_of_study"],
            "essay_text": ai_full_text,
            "word_count": len(ai_full_text.split()),
            "label": 1,
            "author_type": "ai_full",
            "generation_method": "gemini-2.5-flash" if api_key else "synthetic_ai_full",
            "source": "LLM_Generated_Full"
        })

        # Variation B: Human-Polished AI
        polished_ai_prompt = HUMAN_POLISHED_SYSTEM_PROMPT.format(original_draft=original_draft)
        ai_polished_text = None
        if api_key and HAS_GEMINI_SDK:
            ai_polished_text = generate_with_gemini(polished_ai_prompt, api_key)
            time.sleep(1) # Rate limit padding

        if not ai_polished_text:
            ai_polished_text = fallback_synthetic_generator(human_item, "ai_polished")

        all_essays.append({
            "id": f"ai_polished_{base_id}",
            "prompt_id": human_item["prompt_id"],
            "prompt": prompt,
            "topic": topic,
            "field_of_study": human_item["field_of_study"],
            "essay_text": ai_polished_text,
            "word_count": len(ai_polished_text.split()),
            "label": 2,
            "author_type": "ai_polished",
            "generation_method": "gemini-2.5-flash" if api_key else "synthetic_ai_polished",
            "source": "Human_Draft_LLM_Polished"
        })

    # 3. Save combined dataset
    out_json = "dataset/admissions_essay_dataset.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(all_essays, f, indent=2, ensure_ascii=False)
    print(f"\n🎉 Dataset Generation Complete!")
    print(f"   Total Samples: {len(all_essays)} (50 Human, 50 AI-Full, 50 AI-Polished)")
    print(f"   Saved JSON dataset to: '{out_json}'")

    # Save CSV
    out_csv = "dataset/admissions_essay_dataset.csv"
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "prompt_id", "prompt", "topic", "field_of_study", "essay_text", "word_count", "label", "author_type", "generation_method", "source"])
        writer.writeheader()
        for row in all_essays:
            writer.writerow(row)
    print(f"   Saved CSV dataset to: '{out_csv}'")

if __name__ == "__main__":
    main()
