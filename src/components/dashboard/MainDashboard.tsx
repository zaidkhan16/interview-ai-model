import React, { useState } from 'react';
import type { UserProfile, ColorPalette, ThemeMode, DashboardView, QuestionItem } from '../../types/auth';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { OverviewView } from './OverviewView';
import { LiveMockStudio } from './LiveMockStudio';
import { QuestionBankView } from './QuestionBankView';
import { AnalyticsView } from './AnalyticsView';
import confetti from 'canvas-confetti';

interface MainDashboardProps {
  user: UserProfile;
  palette: ColorPalette;
  onPaletteChange: (palette: ColorPalette, label: string) => void;
  mode: ThemeMode;
  onToggleMode: () => void;
  onSignOut: () => void;
  onNotify: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  user,
  palette,
  onPaletteChange,
  mode,
  onToggleMode,
  onSignOut,
  onNotify,
}) => {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#6366f1', '#38bdf8', '#10b981', '#f59e0b'],
      });
      onNotify('Readiness Celebrated! 🎉', 'Top 4% FAANG candidate milestone unlocked.', 'success');
    } catch {
      // ignore
    }
  };

  const handleStartQuestion = (_question: QuestionItem) => {
    setActiveView('studio');
  };

  return (
    <div className="main-dashboard-layout animate-fade-in">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="dashboard-content-wrapper">
        {/* Top Navbar */}
        <TopNavbar
          user={user}
          palette={palette}
          onPaletteChange={onPaletteChange}
          mode={mode}
          onToggleMode={onToggleMode}
          onSignOut={onSignOut}
          onCelebrate={handleCelebrate}
          onNotify={onNotify}
        />

        {/* View Viewport */}
        <main className="dashboard-view-body">
          {activeView === 'overview' && (
            <OverviewView
              user={user}
              onLaunchStudio={() => setActiveView('studio')}
              onViewQuestions={() => setActiveView('questions')}
              onNotify={onNotify}
            />
          )}

          {activeView === 'studio' && (
            <LiveMockStudio onNotify={onNotify} />
          )}

          {activeView === 'questions' && (
            <QuestionBankView
              onStartQuestion={handleStartQuestion}
              onNotify={onNotify}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView user={user} />
          )}

          {activeView === 'resume' && (
            <div className="resume-matcher-placeholder glass-panel animate-fade-in">
              <div className="placeholder-badge">AI RESUME MATCH ENGINE</div>
              <h2 className="placeholder-title">Target Role: {user.targetRole}</h2>
              <p className="placeholder-desc">
                Upload your latest PDF resume or paste your LinkedIn to calculate instant ATS match rate and generate customized interview mock loops.
              </p>
              <div className="placeholder-score-box">
                <span className="ats-num">94%</span>
                <span className="ats-label">ATS Keyword Match Score (Google L6)</span>
              </div>
              <button
                type="button"
                onClick={() => onNotify('Resume Scanned', 'AI parsed 24 architecture competencies with 94% alignment.', 'success')}
                className="btn-primary"
                style={{ width: 'auto', padding: '0.75rem 1.5rem', margin: '1rem auto 0' }}
              >
                Scan & Align with FAANG Job Description
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
