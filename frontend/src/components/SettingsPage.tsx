import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Settings, Shield, Sliders, Eye, Lock, Building, Check, RotateCcw, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [sensitivity, setSensitivity] = useState<'Conservative' | 'Balanced' | 'Strict'>('Balanced');
  const [mixedAnalysis, setMixedAnalysis] = useState(true);
  const [humanizerDetection, setHumanizerDetection] = useState(true);
  const [segmentDiagnostics, setSegmentDiagnostics] = useState(true);
  const [highlightedProse, setHighlightedProse] = useState(true);

  const [institutionName, setInstitutionName] = useState('Harvard Admissions Office');
  const [reviewerName, setReviewerName] = useState('Senior Admissions Officer');
  const [department, setDepartment] = useState('Undergraduate Evaluation Committee');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="official-card">
        <div className="official-card-header">
          <div>
            <h2 className="official-card-title">Institutional Detection & Governance Settings</h2>
            <p className="official-card-subtitle">
              Configure AI detection thresholds, scoring weights, display preferences, and privacy rules for your committee.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" size="sm" icon={<RotateCcw size={14} />}>
              Reset to Defaults
            </Button>
            <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
            <Check size={18} />
            <span>Detection settings successfully saved and applied to institutional profile.</span>
          </div>
        )}

        <div className="space-y-8">
          {/* SECTION 1: DETECTION SETTINGS */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="#2563eb" />
              Section 1: Detection & Protocol Sensitivity
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Model Sensitivity Level:
                </label>
                <div className="segmented-control">
                  <button type="button" className={`segmented-btn ${sensitivity === 'Conservative' ? 'active' : ''}`} onClick={() => setSensitivity('Conservative')}>
                    Conservative
                  </button>
                  <button type="button" className={`segmented-btn ${sensitivity === 'Balanced' ? 'active' : ''}`} onClick={() => setSensitivity('Balanced')}>
                    Balanced
                  </button>
                  <button type="button" className={`segmented-btn ${sensitivity === 'Strict' ? 'active' : ''}`} onClick={() => setSensitivity('Strict')}>
                    Strict
                  </button>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', display: 'block' }}>
                  Balanced mode minimizes false positives while identifying AI trope structures.
                </span>
              </div>

              <div className="space-y-3">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={mixedAnalysis} onChange={(e) => setMixedAnalysis(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                  <span>Enable Segment-Level Mixed AI / Humanizer Analysis</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={humanizerDetection} onChange={(e) => setHumanizerDetection(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                  <span>Enable Automated Spinner & Humanizer Tool Detection</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={segmentDiagnostics} onChange={(e) => setSegmentDiagnostics(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                  <span>Enable Segment Diagnostics Side Inspector</span>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 2: SCORING THRESHOLDS */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="#2563eb" />
              Section 2: Classification Scoring Thresholds
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Human Upper Threshold</label>
                <input type="number" className="form-input" defaultValue={10} style={{ fontFamily: 'var(--font-mono)' }} />
                <span style={{ fontSize: '0.725rem', color: '#64748b' }}>0% to 10% = Full Human</span>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Mixed / Moderate AI Range</label>
                <input type="number" className="form-input" defaultValue={69} style={{ fontFamily: 'var(--font-mono)' }} />
                <span style={{ fontSize: '0.725rem', color: '#64748b' }}>11% to 69% = Moderate / Mixed</span>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full AI Lower Threshold</label>
                <input type="number" className="form-input" defaultValue={70} style={{ fontFamily: 'var(--font-mono)' }} />
                <span style={{ fontSize: '0.725rem', color: '#64748b' }}>70% to 100% = Full AI</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: INSTITUTIONAL INFO */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="#2563eb" />
              Section 6: Institutional & Reviewer Settings
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Institution Name</label>
                <input type="text" className="form-input" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Reviewer Role / Title</label>
                <input type="text" className="form-input" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Committee Department</label>
                <input type="text" className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <Button variant="secondary" size="md">Cancel</Button>
          <Button variant="primary" size="md" icon={<Save size={16} />} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};
