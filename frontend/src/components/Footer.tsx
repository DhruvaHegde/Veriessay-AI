import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Shield size={20} color="#1e40af" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>Official Analytical Disclaimer</p>
            <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: '1.5' }}>
              VeriEssay AI provides probability-based writing analysis. Results are not definitive proof of authorship and should be reviewed by a human.
              No definitive conclusion regarding student admission should be made from automated analysis alone.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.775rem', color: '#64748b', paddingTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} />
            <span>FERPA & Student Data Privacy Compliant • 256-Bit SSL Encrypted Audit Trail</span>
          </div>
          <div>
            <span>© 2026 VeriEssay AI Platform Inc. All rights reserved. • </span>
            <span style={{ fontWeight: 600, color: '#1e40af' }}>v2.4.0-Enterprise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
