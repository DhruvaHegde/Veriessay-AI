import React, { useState, useRef } from 'react';
import { Sparkles, Upload, FileText, X, AlertCircle, Clock, Hash, AlignLeft, UserCheck, Bot, Layers, Wand2 } from 'lucide-react';
import { Button } from './ui/Button';

interface EssayFormProps {
  onAnalyze: (essayText: string, title?: string, prompt?: string) => void;
  isLoading: boolean;
}

const SAMPLE_HUMAN_ESSAY = `The smell of burning solder and scorched resin filled my garage every Tuesday night. While my classmates were polishing their debate speeches or practicing soccer drills, I was hunched over a breadboard, trying to get a 1980s analog synthesizer to play its first coherent note.

Hearing the crisp crackle of a jazz station burst through the speaker remains the most thrilling moment of my early life. That radio sparked an obsession with understanding how complex systems function from the ground up. In high school, I founded our school's first Hardware Hacking Club. What began as three students fixing old laptops quickly evolved into a community project where we refurbished discarded electronics for local middle schools.

To me, engineering is not just about building gadgets; it is a form of storytelling. Every circuit board tells a story of trial, error, and eventual harmony.`;

const SAMPLE_AI_ESSAY = `Embarking on a journey of self-discovery, my passion for electrical engineering has served as a beacon of illumination throughout my academic trajectory. 

From a young age, I have harbored a profound curiosity regarding how complex systems interweave to create meaningful impact. Prompted by a desire to explore innovation, I realized that true personal growth stems not from passive observation, but from immersive engagement with challenges that test one's resilience.

During my formative high school years, I spearheaded an initiative centered on hardware restoration. This endeavor served as a testament to the power of collaborative problem-solving. Each obstacle encountered became an invaluable learning opportunity, compelling me to delve deeper into technical nuances and refine my strategic approach. Through meticulous iteration and unwavering determination, our team successfully navigated intricate hurdles.

In conclusion, this experience illuminated a fundamental truth: innovation exists at the intersection of discipline and creative synthesis. As I prepare to enter higher education, I seek to cultivate this rich tapestry of experiences within a rigorous academic community.`;

const SAMPLE_MIXED_ESSAY = `The smell of burning solder and scorched resin filled my garage every Tuesday night while I built an analog synth. Hearing the crisp crackle of a jazz station burst through the speaker remained a thrilling moment.

However, embarking on this journey of self-discovery, my passion for electrical engineering also served as a beacon of illumination throughout my academic trajectory. I harbored a profound curiosity regarding how complex microcontrollers interweave to create meaningful societal impact. 

I spent three grueling weeks watching solder melt before I got the synth to output a clean C major tone. In conclusion, this endeavor served as a testament to the power of collaborative problem-solving within a rich tapestry of experiences.`;

const SAMPLE_HUMANIZED_AI_ESSAY = `Commencing on this personal path of self-realization, my enthusiasm for electronic systems acted as a lighthouse of guidance across my educational passage. 

Starting from an early period, I have harbored a deep inquisitiveness concerning how intricate circuits interconnect to foster substantial community results. Motivated by an urge to examine novel methods, I came to understand that real self advancement originates not from aloof watching, but from active participation with trial situations that evaluate personal stamina.

To summarize, this project functioned as proof of the strength of group problem resolution inside an abundant mosaic of events. As I gear up to join higher studies, I aim to foster these valuable lessons.`;

export const EssayForm: React.FC<EssayFormProps> = ({ onAnalyze, isLoading }) => {
  const [essayText, setEssayText] = useState('');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [activeMode, setActiveMode] = useState<'human' | 'ai' | 'mixed' | 'humanized'>('human');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Statistics
  const words = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const chars = essayText.length;
  const sentences = essayText.trim() ? (essayText.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || []).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const handleModeChange = (mode: 'human' | 'ai' | 'mixed' | 'humanized') => {
    setActiveMode(mode);
    switch (mode) {
      case 'human':
        setEssayText(SAMPLE_HUMAN_ESSAY);
        setTitle('Human Applicant Personal Statement');
        break;
      case 'ai':
        setEssayText(SAMPLE_AI_ESSAY);
        setTitle('ChatGPT Admissions Essay Sample');
        break;
      case 'mixed':
        setEssayText(SAMPLE_MIXED_ESSAY);
        setTitle('Mixed Human & AI Hybrid Sample');
        break;
      case 'humanized':
        setEssayText(SAMPLE_HUMANIZED_AI_ESSAY);
        setTitle('Humanized AI Spinner Sample');
        break;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = (file.size / 1024).toFixed(1) + ' KB';
    setUploadedFile({ name: file.name, size: sizeInKb });

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setEssayText(content);
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayText.trim()) {
      setErrorMsg('Analysis could not be completed. Please check your input and enter an essay.');
      return;
    }
    if (words < 15) {
      setErrorMsg('Admissions essays must contain at least 15 words for reliable statistical analysis.');
      return;
    }
    setErrorMsg(null);
    onAnalyze(essayText, title || 'Admissions Essay Submission', prompt);
  };

  return (
    <div className="official-card main-analysis-card">
      <div className="official-card-header">
        <div>
          <h2 className="official-card-title">Submit Essay for AI Analysis</h2>
          <p className="official-card-subtitle">
            Analyze college admissions essays for possible AI-generated, human-written, humanized, or mixed content.
          </p>
        </div>

        {/* Upload Document Control */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.doc,.docx,.pdf,.md"
            style={{ display: 'none' }}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={<Upload size={14} />}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            Upload Document
          </Button>
        </div>
      </div>

      {/* Mode Selector Segmented Control */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Select Evaluation Mode Preset:
        </label>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${activeMode === 'human' ? 'active' : ''}`}
            onClick={() => handleModeChange('human')}
          >
            <UserCheck size={16} />
            <span>Human</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeMode === 'ai' ? 'active' : ''}`}
            onClick={() => handleModeChange('ai')}
          >
            <Bot size={16} />
            <span>Pure AI</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeMode === 'mixed' ? 'active' : ''}`}
            onClick={() => handleModeChange('mixed')}
          >
            <Layers size={16} />
            <span>Mixed AI/Human</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeMode === 'humanized' ? 'active' : ''}`}
            onClick={() => handleModeChange('humanized')}
          >
            <Wand2 size={16} />
            <span>Humanized AI</span>
          </button>
        </div>
      </div>

      {/* Uploaded File Pill Indicator */}
      {uploadedFile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239, 246, 255, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(191, 219, 254, 0.5)', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.825rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4F46E5', fontWeight: 600 }}>
            <FileText size={16} />
            <span>{uploadedFile.name} ({uploadedFile.size})</span>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
              Essay Title / Student Identifier (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Applicant #4029 - Personal Statement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
              Common App Prompt (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Share a story of your background or talent..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>

        {/* Text Area */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
            Admissions Essay Content
          </label>
          <textarea
            className="form-textarea"
            placeholder="Paste the admissions essay here or upload a document."
            value={essayText}
            onChange={(e) => {
              setEssayText(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
          />
        </div>

        {/* Live Document Statistics Bar */}
        <div className="metrics-bar">
          <div className="metrics-bar-items">
            <span className="metrics-item">
              <AlignLeft size={14} /> <strong>{words}</strong> Words
            </span>
            <span className="metrics-item">
              <Hash size={14} /> <strong>{sentences}</strong> Sentences
            </span>
            <span className="metrics-item">
              <FileText size={14} /> <strong>{chars}</strong> Characters
            </span>
            <span className="metrics-item">
              <Clock size={14} /> <strong>~{readingTime} min</strong> Reading Time
            </span>
          </div>

          <span style={{ color: words < 15 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
            {words < 15 ? 'Minimum 15 words required' : 'Ready for Analysis'}
          </span>
        </div>

        {/* Validation Error Callout */}
        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Sparkles size={18} />}
            disabled={isLoading || words < 15}
          >
            {isLoading ? 'Analyzing Essay...' : 'Submit Essay for Analysis'}
          </Button>
        </div>
      </form>
    </div>
  );
};
