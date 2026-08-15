import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './Navbar';
import { Footer } from './Footer';
import { EssayForm } from './EssayForm';
import { ResultsDashboard } from './ResultsDashboard';
import { HistoryPage } from './HistoryPage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from './SettingsPage';
import { HelpPage } from './HelpPage';
import { EssayAnalysisResponse, EssayHistoryItem } from '../types';
import { analyzeEssay, getEssayHistory, getEssayDetail, deleteEssay } from '../services/api';
import { AlertCircle } from 'lucide-react';

export const DetectorDashboard: React.FC = () => {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('analysis');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [analysisData, setAnalysisData] = useState<EssayAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<EssayHistoryItem[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const items = await getEssayHistory();
      setHistory(items);
    } catch (err) {
      console.warn('Could not load history:', err);
    }
  };

  const handleAnalyze = async (essayText: string, title?: string, prompt?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeEssay(essayText, title, prompt);
      setAnalysisData(result);
      setActiveNavTab('analysis');
      await loadHistory();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during essay analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getEssayDetail(id);
      setAnalysisData(result);
      setActiveNavTab('analysis');
    } catch (err: any) {
      setError(err.message || 'Failed to load essay detail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      await deleteEssay(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (analysisData?.id === id) {
        setAnalysisData(null);
      }
    } catch (err: any) {
      console.error('Failed to delete essay history item:', err);
    }
  };

  const handleClearAllHistory = async () => {
    try {
      for (const item of history) {
        await deleteEssay(item.id);
      }
      setHistory([]);
      setAnalysisData(null);
    } catch (err: any) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeNavTab}
        onSelectTab={(tab) => setActiveNavTab(tab)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1 }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '14px 20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* View Router */}
        {activeNavTab === 'analysis' && (
          analysisData ? (
            <ResultsDashboard data={analysisData} onNewAnalysis={() => setAnalysisData(null)} />
          ) : (
            <EssayForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          )
        )}

        {activeNavTab === 'history' && (
          <HistoryPage
            history={history}
            onSelectEssay={handleSelectHistory}
            onDeleteEssay={handleDeleteHistory}
            onClearHistory={handleClearAllHistory}
          />
        )}

        {activeNavTab === 'reports' && (
          <ReportsPage history={history} />
        )}

        {activeNavTab === 'settings' && (
          <SettingsPage />
        )}

        {activeNavTab === 'help' && (
          <HelpPage />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
