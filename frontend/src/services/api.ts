import { EssayAnalysisResponse, EssayHistoryItem } from '../types';

const API_BASE = '/api';

export async function analyzeEssay(essayText: string, title?: string, prompt?: string): Promise<EssayAnalysisResponse> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      essay_text: essayText,
      title: title || 'Admissions Essay Analysis',
      essay_prompt: prompt,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Analysis request failed' }));
    throw new Error(errorData.detail || 'Failed to analyze essay');
  }

  return response.json();
}

export async function getEssayHistory(): Promise<EssayHistoryItem[]> {
  const response = await fetch(`${API_BASE}/essays`);
  if (!response.ok) {
    throw new Error('Failed to fetch essay history');
  }
  return response.json();
}

export async function getEssayDetail(id: number): Promise<EssayAnalysisResponse> {
  const response = await fetch(`${API_BASE}/essays/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch essay analysis detail');
  }
  return response.json();
}

export async function deleteEssay(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/essays/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete essay record');
  }
}
