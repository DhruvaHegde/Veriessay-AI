import React from 'react';
import { ShieldCheck, FileText, History, BarChart3, Settings, HelpCircle, Building2, Sun, Moon } from 'lucide-react';

export type NavTab = 'analysis' | 'history' | 'reports' | 'settings' | 'help';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, theme, onToggleTheme }) => {
  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <div className="brand-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="brand-title">VeriEssay AI</h1>
              <p className="brand-tagline">College Admissions AI Text Detector & Statistical Analyzer</p>
            </div>
          </div>

          <nav className="nav-links">
            <button
              className={`nav-link ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => onSelectTab('analysis')}
            >
              <FileText size={16} />
              <span>Analysis</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => onSelectTab('history')}
            >
              <History size={16} />
              <span>History</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => onSelectTab('reports')}
            >
              <BarChart3 size={16} />
              <span>Reports</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => onSelectTab('settings')}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => onSelectTab('help')}
            >
              <HelpCircle size={16} />
              <span>Help</span>
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#64748B',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.2s ease'
              }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'light' ? (
                <>
                  <Sun size={15} color="#d97706" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={15} color="#60a5fa" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <div className="institution-badge">
              <Building2 size={14} />
              <span>Admissions Committee Portal</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
