import React from 'react';
import { EssayHistoryItem } from '../types';
import { X, Trash2, ArrowRight } from 'lucide-react';

interface EssayHistoryProps {
  history: EssayHistoryItem[];
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export const EssayHistory: React.FC<EssayHistoryProps> = ({
  history,
  onSelect,
  onDelete,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '420px',
        maxWidth: '100vw',
        height: '100vh',
        background: 'rgba(11, 15, 25, 0.96)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid var(--border-subtle)',
        zIndex: 1000,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff' }}>
          Analysis History
        </h3>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
            No analysis history records yet.
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                marginBottom: '12px',
                padding: '16px',
                cursor: 'pointer',
                background: 'rgba(18, 24, 38, 0.6)',
              }}
              onClick={() => onSelect(item.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{item.title}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.word_count} words</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: item.ai_score >= 70 ? 'var(--status-ai)' : item.ai_score >= 40 ? 'var(--status-mixed)' : 'var(--status-human)',
                  }}
                >
                  {Math.round(item.ai_score)}% AI
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
