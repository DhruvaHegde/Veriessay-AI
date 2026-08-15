import React from 'react';

interface ScoreMeterProps {
  score: number;
  riskLevel: string;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({ score, riskLevel }) => {
  // SVG Circumference calculations for radial gauge
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#10b981';
  let badgeClass = 'badge-human';
  let displayLabel = riskLevel;

  if (score <= 10) {
    color = '#10b981'; // Green: <= 10%
    badgeClass = 'badge-human';
    displayLabel = 'Likely Human Written';
  } else if (score <= 69) {
    color = '#f59e0b'; // Orange: 11 - 69%
    badgeClass = 'badge-mixed';
    displayLabel = 'Moderate / Mixed AI';
  } else {
    color = '#ef4444'; // Red: >= 70%
    badgeClass = 'badge-ai';
    displayLabel = 'Full AI';
  }

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="var(--border-color)"
            strokeOpacity="0.15"
            strokeWidth="14"
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={color}
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.3s ease' }}
          />
        </svg>

        {/* Center score text */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: color, textShadow: `0 0 20px ${color}60` }}>
            {Math.round(score)}%
          </span>
          <span style={{ fontSize: '0.725rem', color: color, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, opacity: 0.9 }}>
            AI Likelihood
          </span>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <span className={`badge ${badgeClass}`}>{displayLabel}</span>
      </div>
    </div>
  );
};
