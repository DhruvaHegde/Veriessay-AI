export type MixedClassificationType = 
  | 'Probably Human' 
  | 'Probably AI' 
  | 'Mixed AI/Human' 
  | 'Possibly Humanized AI' 
  | 'Uncertain';

export interface CalculationBreakdown {
  original_text: string;
  num_segments: number;
  segment_ai_score: number;
  base_model_score: number;
  human_signals_detected: string[];
  ai_signals_detected: string[];
  uncertainty_penalty: number;
  short_text_penalty: number;
  final_ai_likelihood: number;
  final_label: string;
}

export interface SentenceReport {
  sentence_index: number;
  text: string;
  start_char?: number;
  end_char?: number;
  word_count: number;
  classification: 'human' | 'ai' | 'mixed';
  confidence_score: number;
  ai_score?: number;
  perplexity: number;
  pos_signature?: string;
  dep_tree_depth?: number;
  primary_contributor?: string;
  flags: string[];
  reasons_and_explanations?: string[];
  mixed_classification?: MixedClassificationType;
  ai_probability?: number;
  human_probability?: number;
  reason?: string;
  confidence?: 'High' | 'Medium' | 'Low';
  suggested_action?: string;
  calculation_breakdown?: CalculationBreakdown;
}

export interface EssayMetrics {
  perplexity: number;
  burstiness_score: number;
  sentence_length_cv: number;
  mean_sentence_length: number;
  ttr: number;
  root_ttr: number;
  mattr: number;
  syntactic_repetition_rate: number;
  cliche_count: number;
  identified_cliches: string[];
}

export interface EssaySummary {
  total_words: number;
  total_sentences: number;
  total_paragraphs: number;
  ai_sentence_count: number;
  flesch_reading_ease: number;
}

export interface EssayAnalysisResponse {
  id?: number;
  title: string;
  essay_prompt?: string;
  essay_text: string;
  overall_ai_score: number;
  risk_level: string;
  summary: EssaySummary;
  metrics: EssayMetrics;
  sentences: SentenceReport[];
  calculation_breakdown?: CalculationBreakdown;
  created_at?: string;
}

export interface EssayHistoryItem {
  id: number;
  title: string;
  ai_score: number;
  risk_level: string;
  word_count: number;
  created_at: string;
}
