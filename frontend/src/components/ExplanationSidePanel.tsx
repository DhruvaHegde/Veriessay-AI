import React from 'react';
import { X, AlertTriangle, Cpu, HelpCircle, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { SentenceReport } from '../types';

interface ExplanationSidePanelProps {
  sentence: SentenceReport | null;
  onClose: () => void;
}

export const ExplanationSidePanel: React.FC<ExplanationSidePanelProps> = ({ sentence, onClose }) => {
  if (!sentence) return null;

  const calculatedAiScore = sentence.ai_score ?? Math.round(sentence.confidence_score * 100);
  const explanations = sentence.reasons_and_explanations ?? sentence.flags ?? [];
  const cb = sentence.calculation_breakdown;

  const aiProb = sentence.ai_probability ?? calculatedAiScore;
  const humanProb = sentence.human_probability ?? (100 - aiProb);

  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  let badgeLabel = 'Full Human';

  if (aiProb > 69) {
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
    badgeLabel = 'Full AI';
  } else if (aiProb > 10) {
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    badgeLabel = 'Moderate / Mixed AI';
  }

  return (
    <aside
      className="fixed top-0 right-0 w-[440px] max-w-full h-full z-50 p-6 flex flex-col transition-all duration-200"
      style={{
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderLeft: 'var(--border-style)',
        boxShadow: '-6px 0px 0px var(--border-color)'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-4" style={{ borderBottom: 'var(--border-style)' }}>
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" strokeWidth={3} />
          <h3 className="text-lg font-black font-sans uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Sentence Diagnostics</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 font-bold hover:opacity-80 transition-opacity"
          style={{ border: 'var(--border-style)', background: 'var(--accent-primary)', color: '#000000', boxShadow: '2px 2px 0px var(--border-color)' }}
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pt-4 pr-1">
        {/* Mixed AI/Humanizer Segment Card */}
        <div className="p-4 space-y-3 rounded-xl" style={{ background: 'var(--bg-card-secondary)', border: 'var(--border-style)' }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Mixed AI/Humanizer Tag
            </span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${badgeColor}`}>
              {sentence.mixed_classification || badgeLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
              <span className="block text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>AI Probability</span>
              <strong className="text-red-500 font-mono text-sm">{Math.round(aiProb)}%</strong>
            </div>
            <div className="p-2 rounded" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
              <span className="block text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Human Probability</span>
              <strong className="text-emerald-600 font-mono text-sm">{Math.round(humanProb)}%</strong>
            </div>
          </div>
        </div>

        {/* TRANSPARENT CALCULATION OUTPUT BREAKDOWN */}
        <div className="p-4 space-y-3 rounded-xl" style={{ background: 'var(--bg-card-secondary)', border: 'var(--border-style)' }}>
          <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <Calculator className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
            Transparent Calculation Output
          </h4>

          <div className="space-y-2 text-xs font-sans">
            <div className="p-2.5 rounded space-y-1" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
              <span className="text-[10px] block uppercase font-mono font-bold" style={{ color: 'var(--text-muted)' }}>Original Text</span>
              <p className="font-medium italic" style={{ color: 'var(--text-main)' }}>"{cb?.original_text || sentence.text}"</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
                <span className="text-[10px] block uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Segments</span>
                <strong className="font-mono" style={{ color: 'var(--text-main)' }}>{cb?.num_segments ?? 1}</strong>
              </div>
              <div className="p-2 rounded" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
                <span className="text-[10px] block uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Base Model Score</span>
                <strong className="font-mono text-amber-600">{cb?.base_model_score ?? 0}%</strong>
              </div>
            </div>

            {/* Human Signals Detected */}
            <div className="p-2.5 rounded space-y-1" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
              <span className="text-emerald-600 text-[10px] font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Human Signals Detected ({cb?.human_signals_detected?.length ?? 0})
              </span>
              {cb?.human_signals_detected && cb.human_signals_detected.length > 0 ? (
                <ul className="space-y-1 pl-1">
                  {cb.human_signals_detected.map((sig, i) => (
                    <li key={i} className="text-[11px] font-semibold text-emerald-700 leading-tight">
                      • {sig}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[11px] italic block" style={{ color: 'var(--text-muted)' }}>None detected</span>
              )}
            </div>

            {/* AI Signals Detected */}
            <div className="p-2.5 rounded space-y-1" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
              <span className="text-red-600 text-[10px] font-bold uppercase flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                AI Signals Detected ({cb?.ai_signals_detected?.length ?? 0})
              </span>
              {cb?.ai_signals_detected && cb.ai_signals_detected.length > 0 ? (
                <ul className="space-y-1 pl-1">
                  {cb.ai_signals_detected.map((sig, i) => (
                    <li key={i} className="text-[11px] font-semibold text-red-600 leading-tight">
                      • {sig}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[11px] italic block" style={{ color: 'var(--text-muted)' }}>None detected</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
                <span className="block text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Short-Text Penalty</span>
                <span className="font-mono" style={{ color: 'var(--text-main)' }}>{cb?.short_text_penalty ?? 0}%</span>
              </div>
              <div className="p-2 rounded" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
                <span className="block text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Uncertainty Penalty</span>
                <span className="font-mono" style={{ color: 'var(--text-main)' }}>{cb?.uncertainty_penalty ?? 0}%</span>
              </div>
            </div>

            <div className="p-2.5 rounded flex justify-between items-center" style={{ background: 'var(--bg-card)', border: 'var(--border-style)' }}>
              <div>
                <span className="text-[10px] block uppercase font-mono font-bold" style={{ color: 'var(--text-muted)' }}>Final AI Likelihood</span>
                <strong className="font-mono text-base" style={{ color: 'var(--text-main)' }}>{cb?.final_ai_likelihood ?? Math.round(aiProb)}%</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] block uppercase font-mono font-bold" style={{ color: 'var(--text-muted)' }}>Final Label</span>
                <strong className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>{cb?.final_label ?? sentence.mixed_classification ?? badgeLabel}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Action Box */}
        <div className="p-3.5 space-y-1 rounded-xl" style={{ background: 'var(--bg-card-secondary)', border: 'var(--border-style)' }}>
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>Suggested Action</div>
          <div className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-main)' }}>
            {sentence.suggested_action || 'Proceed with standard application review'}
          </div>
        </div>

        {/* Primary Contributor */}
        {sentence.primary_contributor && (
          <div className="p-3.5 flex items-center gap-3 rounded-xl" style={{ background: 'var(--bg-card-secondary)', border: 'var(--border-style)' }}>
            <Cpu className="w-5 h-5 text-amber-500 shrink-0" strokeWidth={2.5} />
            <div>
              <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Primary Detection Factor</div>
              <div className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{sentence.primary_contributor}</div>
            </div>
          </div>
        )}

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg-card-secondary)', border: 'var(--border-style)' }}>
            <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Perplexity Score</div>
            <div className="text-lg font-mono font-bold mt-0.5" style={{ color: 'var(--text-main)' }}>{sentence.perplexity}</div>
            <div className="text-[11px] font-semibold" style={{ color: 'var(--text-dim)' }}>
              {sentence.perplexity < 35 ? 'Highly Predictable' : 'Varied Transitions'}
            </div>
          </div>

          <div className="p-3 rounded-xl" style={{ background: 'var(--bg-card-secondary)', border: 'var(--border-style)' }}>
            <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Confidence Level</div>
            <div className="text-sm font-mono font-bold mt-1" style={{ color: 'var(--text-main)' }}>
              {sentence.confidence || 'Medium'}
            </div>
            <div className="text-[11px] font-semibold" style={{ color: 'var(--text-dim)' }}>Statistical Certainty</div>
          </div>
        </div>

        {/* Human Readable Explanations ("The Why") */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <AlertTriangle className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
            Generated Explanations ("The Why")
          </h4>
          <ul className="space-y-2.5">
            {explanations.map((reason, idx) => (
              <li
                key={idx}
                className="p-3 text-xs leading-relaxed flex items-start gap-2.5 rounded-xl font-medium"
                style={{ background: 'var(--bg-card-secondary)', border: 'var(--border-style)', color: 'var(--text-main)' }}
              >
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-black">
                  {idx + 1}
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
