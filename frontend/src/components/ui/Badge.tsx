import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';

export type VerdictType =
  | 'Likely Human Written'
  | 'Mostly Human'
  | 'Moderate / Mixed AI'
  | 'Likely AI'
  | 'Full AI'
  | 'Uncertain'
  | string;

interface BadgeProps {
  verdict: VerdictType;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ verdict, showIcon = true }) => {
  let badgeClass = 'badge-uncertain';
  let Icon = HelpCircle;

  if (verdict === 'Likely Human Written' || verdict === 'Full Human' || verdict === 'Probably Human') {
    badgeClass = 'badge-human';
    Icon = ShieldCheck;
  } else if (verdict === 'Mostly Human') {
    badgeClass = 'badge-mostly-human';
    Icon = CheckCircle;
  } else if (verdict === 'Moderate / Mixed AI' || verdict === 'Mixed AI/Human') {
    badgeClass = 'badge-mixed';
    Icon = AlertTriangle;
  } else if (verdict === 'Likely AI') {
    badgeClass = 'badge-likely-ai';
    Icon = AlertTriangle;
  } else if (verdict === 'Full AI' || verdict === 'Probably AI') {
    badgeClass = 'badge-ai';
    Icon = ShieldAlert;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {showIcon && <Icon size={14} />}
      <span>{verdict}</span>
    </span>
  );
};
