import React, { useEffect } from 'react';
import type { UserProfile, ThemeMode } from '../types/auth';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  LogOut,
  Play,
  CheckCircle,
  TrendingUp,
  Cpu,
  Mic,
  Award,
  Layers,
  ArrowUpRight,
  Code2,
  Sun,
  Moon,
} from 'lucide-react';

interface DashboardPreviewProps {
  user: UserProfile;
  mode?: ThemeMode;
  onToggleMode?: () => void;
  onSignOut: () => void;
  onNotify: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  user,
  mode = 'dark',
  onToggleMode,
  onSignOut,
  onNotify,
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#38bdf8', '#10b981'],
      });
    } catch {
      // ignore
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'],
      });
      onNotify('Celebration triggered!', 'High-fidelity AI interview score unlocked.', 'success');
    } catch {
      // ignore
    }
  };

  return (
    <div className="dashboard-container animate-scale-up">
      {/* Top Header */}
      <header className="dash-top-bar glass-panel">
        <div className="dash-brand-row">
          <div className="dash-logo-icon">
            <Cpu size={22} className="brand-svg" />
          </div>
          <span className="dash-brand-name">Interview<span className="brand-gradient">IQ</span> Workspace</span>
          <span className="dash-env-badge">Active Session</span>
        </div>

        <div className="dash-user-actions">
          <div className="dash-user-chip">
            <div className="dash-avatar-circle">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="dash-user-details">
              <span className="dash-user-name">{user.name}</span>
              <span className="dash-user-role">{user.targetRole}</span>
            </div>
          </div>

          {onToggleMode && (
            <button
              onClick={onToggleMode}
              className="btn-mode-toggle"
              title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}

          <button
            onClick={triggerConfetti}
            className="btn-confetti"
            title="Celebrate readiness"
          >
            <Sparkles size={16} />
            <span>Celebrate</span>
          </button>

          <button
            onClick={onSignOut}
            className="btn-signout"
            title="Sign out & return to login"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <div className="dash-welcome-card glass-panel">
        <div className="welcome-glow-bg"></div>
        <div className="welcome-content">
          <div className="welcome-badge">
            <Sparkles size={14} /> AI Neural Interview Suite v2.5
          </div>
          <h1 className="welcome-title">
            Welcome back, <span className="brand-gradient">{user.name}</span>!
          </h1>
          <p className="welcome-subtitle">
            Your personalized AI rubric has analyzed <strong>{user.completedInterviews} completed loops</strong>. Your current readiness rating places you in the <strong>top 4%</strong> for {user.targetRole}.
          </p>

          <div className="welcome-cta-row">
            <button
              onClick={() => onNotify('AI Interview Initialized', 'Connecting to Nexus Voice Engine with 18ms latency...', 'info')}
              className="btn-hero-start"
            >
              <Play size={17} fill="currentColor" />
              <span>Launch Live AI Mock Interview</span>
              <ArrowUpRight size={16} />
            </button>
            <button
              onClick={() => onNotify('System Design Sandbox', 'Loading distributed cache simulator...', 'info')}
              className="btn-hero-secondary"
            >
              <Code2 size={17} />
              <span>System Design Canvas</span>
            </button>
          </div>
        </div>

        {/* Readiness Radial / Score Gauge */}
        <div className="readiness-gauge-box glass-panel">
          <div className="gauge-circle-outer">
            <div className="gauge-number">{user.readinessScore}%</div>
            <div className="gauge-sub">FAANG Readiness</div>
          </div>
          <div className="gauge-status-row">
            <CheckCircle size={14} className="text-emerald" />
            <span>Offer Probability: High</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dash-metrics-grid">
        <div className="metric-stat-card glass-panel">
          <div className="metric-stat-icon purple">
            <Mic size={20} />
          </div>
          <div className="metric-stat-data">
            <span className="stat-label">Speech & Delivery Tone</span>
            <div className="stat-val-row">
              <span className="stat-value">96.4%</span>
              <span className="stat-delta positive"><TrendingUp size={12} /> +4.2%</span>
            </div>
            <span className="stat-foot">Confidence & articulation scored</span>
          </div>
        </div>

        <div className="metric-stat-card glass-panel">
          <div className="metric-stat-icon cyan">
            <Cpu size={20} />
          </div>
          <div className="metric-stat-data">
            <span className="stat-label">System Architecture Depth</span>
            <div className="stat-val-row">
              <span className="stat-value">94.8%</span>
              <span className="stat-delta positive"><TrendingUp size={12} /> +8.1%</span>
            </div>
            <span className="stat-foot">Concurrency, Sharding & CAP theorem</span>
          </div>
        </div>

        <div className="metric-stat-card glass-panel">
          <div className="metric-stat-icon green">
            <Award size={20} />
          </div>
          <div className="metric-stat-data">
            <span className="stat-label">Rubrics Mastered</span>
            <div className="stat-val-row">
              <span className="stat-value">18 / 20</span>
              <span className="stat-delta positive"><CheckCircle size={12} /> Passed</span>
            </div>
            <span className="stat-foot">Google & Stripe Bar Raiser Standards</span>
          </div>
        </div>

        <div className="metric-stat-card glass-panel">
          <div className="metric-stat-icon pink">
            <Layers size={20} />
          </div>
          <div className="metric-stat-data">
            <span className="stat-label">Completed Sessions</span>
            <div className="stat-val-row">
              <span className="stat-value">{user.completedInterviews} Loops</span>
              <span className="stat-delta info">Verified</span>
            </div>
            <span className="stat-foot">Last session: 2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Next Recommended Actions */}
      <div className="dash-bottom-grid">
        <div className="active-tracks-card glass-panel">
          <h3 className="section-title">Upcoming AI Interview Modules</h3>
          <div className="track-items-list">
            <div className="track-item">
              <div className="track-icon-wrapper">
                <Cpu size={18} />
              </div>
              <div className="track-meta">
                <span className="track-title">Distributed Rate Limiter & Token Bucket Implementation</span>
                <span className="track-sub">Staff Level Architecture • 45 mins</span>
              </div>
              <button
                onClick={() => onNotify('Session Started', 'Setting up virtual whiteboard...', 'info')}
                className="btn-track-action"
              >
                Start
              </button>
            </div>

            <div className="track-item">
              <div className="track-icon-wrapper">
                <Mic size={18} />
              </div>
              <div className="track-meta">
                <span className="track-title">Conflict Resolution & Executive Leadership Rubric</span>
                <span className="track-sub">Behavioral AI Simulation • 30 mins</span>
              </div>
              <button
                onClick={() => onNotify('Session Started', 'Initializing speech agent...', 'info')}
                className="btn-track-action"
              >
                Start
              </button>
            </div>
          </div>
        </div>

        <div className="account-summary-card glass-panel">
          <h3 className="section-title">Account Security & Vault</h3>
          <div className="vault-details">
            <div className="vault-row">
              <span className="vault-key">Primary Email</span>
              <span className="vault-val">{user.email}</span>
            </div>
            <div className="vault-row">
              <span className="vault-key">Role Clearance</span>
              <span className="vault-val uppercase">{user.role}</span>
            </div>
            <div className="vault-row">
              <span className="vault-key">Two-Factor Auth</span>
              <span className="vault-val text-emerald">● Enforced (Active)</span>
            </div>
            <div className="vault-row">
              <span className="vault-key">Member Since</span>
              <span className="vault-val">{user.memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
