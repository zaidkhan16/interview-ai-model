import React from 'react';
import type { UserProfile } from '../../types/auth';
import {
  Mic,
  Sparkles,
  Zap,
  Target,
  BrainCircuit,
  BarChart2,
} from 'lucide-react';

interface AnalyticsViewProps {
  user: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ user }) => {
  return (
    <div className="analytics-view-container animate-fade-in">
      {/* Header Banner */}
      <div className="analytics-header-card glass-panel">
        <div>
          <div className="analytics-badge">
            <BarChart2 size={13} className="text-accent" /> Neural Performance Intelligence
          </div>
          <h1 className="analytics-headline">Performance Diagnostics: {user.targetRole}</h1>
          <p className="analytics-subhead">
            Deep acoustic, architectural, and behavioral telemetry calibrated against FAANG Bar Raiser loops.
          </p>
        </div>
      </div>

      {/* Top 4 Telemetry Cards */}
      <div className="analytics-kpi-grid">
        <div className="telemetry-card glass-panel">
          <div className="telemetry-header">
            <span className="telemetry-label">Speech Pacing & Cadence</span>
            <Mic size={16} className="text-accent" />
          </div>
          <div className="telemetry-val-row">
            <span className="telemetry-val">138 WPM</span>
            <span className="telemetry-badge optimal">Optimal Pace</span>
          </div>
          <div className="telemetry-sub">Recommended baseline: 130–150 WPM</div>
        </div>

        <div className="telemetry-card glass-panel">
          <div className="telemetry-header">
            <span className="telemetry-label">Filler Word Frequency</span>
            <Zap size={16} className="text-cyan" />
          </div>
          <div className="telemetry-val-row">
            <span className="telemetry-val">0.7%</span>
            <span className="telemetry-badge top-tier">Top 1% Tier</span>
          </div>
          <div className="telemetry-sub">&lt;1 filler word per 120 spoken words</div>
        </div>

        <div className="telemetry-card glass-panel">
          <div className="telemetry-header">
            <span className="telemetry-label">Trade-off Articulation</span>
            <BrainCircuit size={16} className="text-emerald" />
          </div>
          <div className="telemetry-val-row">
            <span className="telemetry-val">96.4%</span>
            <span className="telemetry-badge positive">+4.8%</span>
          </div>
          <div className="telemetry-sub">Strong CAP theorem & latency justifications</div>
        </div>

        <div className="telemetry-card glass-panel">
          <div className="telemetry-header">
            <span className="telemetry-label">FAANG Benchmark Delta</span>
            <Target size={16} className="text-purple" />
          </div>
          <div className="telemetry-val-row">
            <span className="telemetry-val">+14.2%</span>
            <span className="telemetry-badge staff-cleared">Staff Cleared</span>
          </div>
          <div className="telemetry-sub">Exceeds Google L6 & Meta E6 threshold</div>
        </div>
      </div>

      {/* Detailed Skill Analysis vs FAANG Bar Raiser Benchmark */}
      <div className="analytics-details-grid">
        <div className="benchmark-comparison-card glass-panel">
          <h2 className="section-card-title">Competency vs. FAANG Staff Benchmark</h2>
          <p className="section-card-subtitle">Your score (solid bar) compared to Google/Meta L6 threshold (dashed marker)</p>

          <div className="benchmark-bars-list">
            {[
              { label: 'System Sharding & High QPS Scaling', userVal: 98, targetVal: 90 },
              { label: 'Fault-Tolerant Distributed Consensus', userVal: 94, targetVal: 88 },
              { label: 'Executive Stakeholder Storytelling (STAR)', userVal: 91, targetVal: 85 },
              { label: 'Data Model & Cache Invalidation', userVal: 96, targetVal: 86 },
              { label: 'Bottleneck Profiling & Observability', userVal: 89, targetVal: 82 },
            ].map((item) => (
              <div key={item.label} className="benchmark-bar-row">
                <div className="bm-label-row">
                  <span className="bm-label">{item.label}</span>
                  <span className="bm-scores">
                    <strong>{item.userVal}%</strong> <span className="bm-target">/ Target: {item.targetVal}%</span>
                  </span>
                </div>
                <div className="bm-track">
                  <div className="bm-fill" style={{ width: `${item.userVal}%` }}></div>
                  <div className="bm-target-marker" style={{ left: `${item.targetVal}%` }} title="Staff Bar Threshold"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable AI Strategic Insights */}
        <div className="ai-insights-card glass-panel">
          <div className="insights-header">
            <Sparkles size={16} className="text-accent" />
            <h2 className="section-card-title">Nexus AI Strategic Insights</h2>
          </div>

          <div className="insights-list">
            <div className="insight-item positive">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <strong>Exceptional Concurrency Architecture</strong>
                <p>Your explanation of lease locks and token buckets in high-write systems scored in the 99th percentile across 12,000 simulations.</p>
              </div>
            </div>

            <div className="insight-item suggestion">
              <div className="insight-icon">📈</div>
              <div className="insight-content">
                <strong>Next Recommended Edge Case</strong>
                <p>During distributed cache failures, spend 30 seconds detailing network partition healing and split-brain resolution protocols.</p>
              </div>
            </div>

            <div className="insight-item recommendation">
              <div className="insight-icon">🎙️</div>
              <div className="insight-content">
                <strong>Voice Pacing & Pause Control</strong>
                <p>Your cadence is natural. Maintain a 1-second pause after high-complexity architecture trade-offs to let the interviewer digest.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
