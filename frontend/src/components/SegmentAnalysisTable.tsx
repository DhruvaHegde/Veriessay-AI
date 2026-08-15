import React from 'react';
import { SentenceReport, MixedClassificationType } from '../types';
import { ShieldAlert, AlertCircle, Info, ExternalLink } from 'lucide-react';

interface SegmentAnalysisTableProps {
  sentences: SentenceReport[];
  onSelectSegment: (segment: SentenceReport) => void;
}

export const SegmentAnalysisTable: React.FC<SegmentAnalysisTableProps> = ({
  sentences,
  onSelectSegment,
}) => {
  const getBadgeStyle = (classification?: MixedClassificationType) => {
    switch (classification) {
      case 'Probably Human':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        };
      case 'Probably AI':
        return {
          bg: 'rgba(239, 68, 68, 0.18)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.4)',
        };
      case 'Mixed AI/Human':
        return {
          bg: 'rgba(245, 158, 11, 0.18)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.4)',
        };
      case 'Possibly Humanized AI':
        return {
          bg: 'rgba(168, 85, 247, 0.18)',
          color: '#c084fc',
          border: '1px solid rgba(168, 85, 247, 0.4)',
        };
      case 'Uncertain':
      default:
        return {
          bg: 'rgba(156, 163, 175, 0.15)',
          color: '#9ca3af',
          border: '1px solid rgba(156, 163, 175, 0.3)',
        };
    }
  };

  const getConfidenceBadge = (confidence?: 'High' | 'Medium' | 'Low') => {
    switch (confidence) {
      case 'High':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-slate-700/60 text-slate-300 border border-slate-600">Medium</span>;
      case 'Low':
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Low</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Probabilistic Guidance Banner */}
      <div className="p-3.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-semibold block mb-0.5">Admissions Officer Evaluation Guidance</strong>
          Probabilistic detection scores represent statistical signal estimations, not definitive proof of AI generation or misconduct. All flagged segments recommend holistic human review.
        </div>
      </div>

      {/* Segment Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3 px-3.5 min-w-[180px]">Essay Segment</th>
              <th className="py-3 px-3 min-w-[150px]">Mixed AI/Humanizer</th>
              <th className="py-3 px-3 min-w-[90px] text-center">AI Prob.</th>
              <th className="py-3 px-3 min-w-[90px] text-center">Human Prob.</th>
              <th className="py-3 px-3.5 min-w-[200px]">Reason</th>
              <th className="py-3 px-3 min-w-[90px] text-center">Confidence</th>
              <th className="py-3 px-3.5 min-w-[220px]">Suggested Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {sentences.map((sent) => {
              const classification = sent.mixed_classification || 
                (sent.classification === 'ai' ? 'Probably AI' : sent.classification === 'mixed' ? 'Mixed AI/Human' : 'Probably Human');
              const badgeStyle = getBadgeStyle(classification);
              const aiProb = sent.ai_probability ?? Math.round(sent.confidence_score * 100);
              const humanProb = sent.human_probability ?? Math.round(100 - aiProb);
              const reason = sent.reason || (sent.flags && sent.flags[0]) || 'Standard statistical token distribution';
              const confidence = sent.confidence || 'Medium';
              const suggestedAction = sent.suggested_action || 
                (classification === 'Probably AI' 
                  ? 'Recommend holistic admissions review & candidate interview' 
                  : classification === 'Possibly Humanized AI'
                  ? 'Inspect for automated text rewrites'
                  : 'Proceed with standard application evaluation');

              return (
                <tr
                  key={sent.sentence_index}
                  onClick={() => onSelectSegment(sent)}
                  className="hover:bg-slate-900/60 cursor-pointer transition-colors group"
                >
                  {/* Segment Text */}
                  <td className="py-3 px-3.5 text-slate-200 font-medium leading-relaxed max-w-xs">
                    <span className="text-slate-500 font-mono text-[10px] mr-1.5">#{sent.sentence_index + 1}</span>
                    <span className="group-hover:text-indigo-200 transition-colors">
                      "{sent.text}"
                    </span>
                  </td>

                  {/* Mixed AI/Humanizer Column */}
                  <td className="py-3 px-3">
                    <span
                      style={{
                        background: badgeStyle.bg,
                        color: badgeStyle.color,
                        border: badgeStyle.border,
                      }}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap inline-block"
                    >
                      {classification}
                    </span>
                  </td>

                  {/* AI Probability */}
                  <td className={`py-3 px-3 text-center font-mono font-bold ${
                    aiProb <= 10 ? 'text-emerald-400' : aiProb >= 70 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {Math.round(aiProb)}%
                  </td>

                  {/* Human Probability */}
                  <td className={`py-3 px-3 text-center font-mono font-bold ${
                    humanProb >= 90 ? 'text-emerald-400' : humanProb <= 30 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {Math.round(humanProb)}%
                  </td>

                  {/* Reason */}
                  <td className="py-3 px-3.5 text-slate-300 text-[11px] leading-relaxed">
                    {reason}
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-3 text-center">
                    {getConfidenceBadge(confidence)}
                  </td>

                  {/* Suggested Action */}
                  <td className="py-3 px-3.5 text-slate-300 text-[11px] leading-relaxed">
                    <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                      <span>{suggestedAction}</span>
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SegmentAnalysisTable;
