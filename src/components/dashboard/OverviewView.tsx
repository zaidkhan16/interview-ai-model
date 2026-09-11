import React from 'react';
import type { UserProfile, CompetencyScore, InterviewSession } from '../../types/auth';
import {
  Play,
  TrendingUp,
  Cpu,
  Mic,
  Award,
  Layers,
  ArrowUpRight,
  Code2,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface OverviewViewProps {
  user: UserProfile;
  onLaunchStudio: () => void;
  onViewQuestions: () => void;
  onNotify: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

const COMPETENCY_SCORES: CompetencyScore[] = [
  { skill: 'Distributed Systems & Sharding', score: 98, level: 'Staff Mastery', change: '+6%' },
  { skill: 'Algorithms & Dynamic Programming', score: 94, level: 'Senior', change: '+3%' },
  { skill: 'Executive Communication & STAR', score: 92, level: 'Bar Raiser', change: '+5%' },
  { skill: 'Concurrency & Idempotency', score: 96, level: 'Mastery', change: '+8%' },
  { skill: 'Architecture Trade-offs & CAP', score: 90, level: 'Optimal', change: '+2%' },
];

const RECENT_SESSIONS: InterviewSession[] = [
  {
    id: 'ses_101',
    title: 'Distributed Real-Time Event Pipeline (10M writes/sec)',
    date: 'Today, 10:30 AM',
    interviewer: 'Sophia AI (Staff Architect)',
    score: 96,
    category: 'System Design',
    duration: '42 mins',
    feedback: {
      strengths: ['Clear explanation of partition rebalancing and consumer lag', 'Strong idempotency guarantee with deduplication cache'],
      improvements: ['Consider backpressure handling during hot partition spikes'],
    },
  },
  {
    id: 'ses_102',
    title: 'Cross-Functional Conflict with VP of Product',
    date: 'Yesterday, 3:15 PM',
    interviewer: 'Marcus AI (Bar Raiser)',
    score: 92,
    category: 'Behavioral Leadership',
    duration: '28 mins',
    feedback: {
      strengths: ['Structured STAR response with quantifiable business metrics', 'Strong empathetic articulation'],
      improvements: ['Provide clearer distinction between team wins and personal initiative'],
    },
  },
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  onLaunchStudio,
  onViewQuestions,
  onNotify,
}) => {
  return (
    <div className="overview-view-container animate-fade-in">
      {/* Hero Welcome & Recommendation Banner */}
      <section className="overview-hero-card glass-panel">
        <div className="overview-hero-glow"></div>
        <div className="hero-left-content">
          <div className="hero-status-pill">
            <Sparkles size={13} className="text-accent" /> Recommended Preparation Track
          </div>
          <h1 className="hero-title">
            Level up for <span className="brand-gradient">{user.targetRole}</span>
          </h1>
          <p className="hero-description">
            Your AI neural rubric suggests targeting <strong>Distributed Cache Invalidation</strong> and <strong>Executive STAR Leadership</strong> to reach the top 2% of FAANG candidates.
          </p>
          <div className="hero-buttons-row">
            <button
              type="button"
              onClick={onLaunchStudio}
              className="btn-launch-studio"
            >
              <Play size={16} fill="currentColor" />
              <span>Launch Live AI Mock Interview</span>
              <ArrowUpRight size={15} />
            </button>
            <button
              type="button"
              onClick={onViewQuestions}
              className="btn-browse-questions"
            >
              <BookOpen size={16} />
              <span>Browse 500+ Question Rubrics</span>
            </button>
          </div>
        </div>

        {/* Readiness Radial Gauge */}
        <div className="hero-gauge-wrapper glass-panel">
          <div className="gauge-ring-outer">
            <div className="gauge-score-value">{user.readinessScore}%</div>
            <div className="gauge-score-label">FAANG Ready</div>
          </div>
          <div className="gauge-sub-status">
            <CheckCircle size={14} className="text-emerald" />
            <span>Top 4% Candidate Tier</span>
          </div>
        </div>
      </section>

      {/* Key Metric Stats Cards */}
      <section className="overview-metrics-grid">
        <div className="metric-stat-box glass-panel">
          <div className="metric-icon-wrap purple">
            <Cpu size={22} />
          </div>
          <div className="metric-box-info">
            <span className="metric-box-title">System Design Mastery</span>
            <div className="metric-box-val-row">
              <span className="metric-big-num">98.0%</span>
              <span className="metric-trend positive"><TrendingUp size={13} /> +8.1%</span>
            </div>
            <span className="metric-box-sub">Evaluated over 7 high-scale loops</span>
          </div>
        </div>

        <div className="metric-stat-box glass-panel">
          <div className="metric-icon-wrap cyan">
            <Mic size={22} />
          </div>
          <div className="metric-box-info">
            <span className="metric-box-title">Speech Pacing & Confidence</span>
            <div className="metric-box-val-row">
              <span className="metric-big-num">92.5%</span>
              <span className="metric-trend positive"><TrendingUp size={13} /> +4.2%</span>
            </div>
            <span className="metric-box-sub">132 WPM • 0.8% Filler word density</span>
          </div>
        </div>

        <div className="metric-stat-box glass-panel">
          <div className="metric-icon-wrap green">
            <Award size={22} />
          </div>
          <div className="metric-box-info">
            <span className="metric-box-title">Rubrics Cleared</span>
            <div className="metric-box-val-row">
              <span className="metric-big-num">18 / 20</span>
              <span className="metric-trend positive"><CheckCircle size={13} /> Passed</span>
            </div>
            <span className="metric-box-sub">Google & Stripe Bar Raiser Tier</span>
          </div>
        </div>

        <div className="metric-stat-box glass-panel">
          <div className="metric-icon-wrap pink">
            <Layers size={22} />
          </div>
          <div className="metric-box-info">
            <span className="metric-box-title">Completed Mock Loops</span>
            <div className="metric-box-val-row">
              <span className="metric-big-num">{user.completedInterviews}</span>
              <span className="metric-trend info">Verified AI Rubrics</span>
            </div>
            <span className="metric-box-sub">Average loop duration: 38 mins</span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Grid: Competency Matrix + Recent Sessions */}
      <div className="overview-split-grid">
        {/* Left Column: Competency Matrix */}
        <section className="competency-matrix-card glass-panel">
          <div className="section-card-header">
            <div>
              <h2 className="section-card-title">Competency Radar & Skill Rubric</h2>
              <p className="section-card-subtitle">AI-evaluated performance across Tier-1 dimensions</p>
            </div>
          </div>

          <div className="competency-bars-list">
            {COMPETENCY_SCORES.map((comp) => (
              <div key={comp.skill} className="competency-row">
                <div className="comp-info-top">
                  <span className="comp-name">{comp.skill}</span>
                  <div className="comp-score-tag">
                    <span className="comp-level-badge">{comp.level}</span>
                    <strong className="comp-num">{comp.score}%</strong>
                  </div>
                </div>
                <div className="comp-progress-track">
                  <div
                    className="comp-progress-fill"
                    style={{ width: `${comp.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Recent Sessions & Detailed Feedback */}
        <section className="recent-sessions-card glass-panel">
          <div className="section-card-header">
            <div>
              <h2 className="section-card-title">Recent Mock Loops</h2>
              <p className="section-card-subtitle">Instant scorecard feedback and rubric breakdowns</p>
            </div>
          </div>

          <div className="sessions-list">
            {RECENT_SESSIONS.map((session) => (
              <div key={session.id} className="session-item-box glass-panel">
                <div className="session-head-row">
                  <div className="session-badge-category">
                    <Code2 size={13} /> {session.category}
                  </div>
                  <div className="session-score-pill">
                    <Award size={13} /> Score: <strong>{session.score}%</strong>
                  </div>
                </div>

                <h3 className="session-title-text">{session.title}</h3>

                <div className="session-meta-row">
                  <span className="session-interviewer-tag">{session.interviewer}</span>
                  <span className="session-time-tag"><Clock size={12} /> {session.duration} • {session.date}</span>
                </div>

                {/* Feedback Highlights */}
                <div className="session-feedback-preview">
                  <div className="fb-item positive">
                    <span className="fb-dot">✓</span>
                    <span>{session.feedback.strengths[0]}</span>
                  </div>
                  <div className="fb-item suggestion">
                    <span className="fb-dot">💡</span>
                    <span>{session.feedback.improvements[0]}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNotify('Full Scorecard', `Opening detailed rubric analysis for "${session.title}"...`, 'info')}
                  className="btn-view-scorecard"
                >
                  <span>View Full Rubric & Transcript</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
