import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Activity,
  Award,
  Zap,
  CheckCircle,
  Quote,
} from 'lucide-react';

const testimonials = [
  {
    quote: "InterviewIQ's live behavioral AI feedback helped me land a Senior Staff Engineer offer at Google.",
    author: "Elena Rostova",
    role: "Staff Infrastructure Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: "The system design simulation with real-time rubric scoring is astonishingly accurate to real FAANG loops.",
    author: "Marcus Chen",
    role: "Lead Distributed Systems Architect",
    company: "Meta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: "Reduced our candidate technical screening cycle from 3 weeks to 48 hours with deep rubric intelligence.",
    author: "Sarah Jenkins",
    role: "VP of Engineering & Talent",
    company: "Stripe",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
  },
];

export const FeatureShowcase: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="feature-showcase-panel">
      {/* Brand Header */}
      <div className="brand-header">
        <div className="brand-logo-wrapper">
          <div className="brand-logo-glow" />
          <div className="brand-icon">
            <Bot size={28} className="brand-svg" />
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <span className="brand-name">Interview<span className="brand-gradient">IQ</span></span>
              <span className="brand-badge"><Sparkles size={11} /> AI 2.5</span>
            </div>
            <p className="brand-subtitle">Autonomous AI Interview & Talent Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Interactive AI Simulation Card */}
      <div className="ai-sim-card glass-panel">
        <div className="ai-sim-header">
          <div className="sim-interviewer-badge">
            <div className="status-dot pulsing" />
            <span className="interviewer-name">Nexus AI Voice Agent</span>
          </div>
          <div className="sim-mode-tag">
            <Activity size={13} />
            <span>Live Analysis 60 FPS</span>
          </div>
        </div>

        {/* Live Audio Equalizer Waveform */}
        <div className="audio-visualizer-box">
          <div className="visualizer-header">
            <span className="voice-status-text">
              ● Voice Stream Active: Audio Rubric Engine
            </span>
            <span className="latency-badge">⚡ 18ms Latency</span>
          </div>
          <div className="wave-bars-container">
            {[45, 85, 30, 95, 60, 100, 75, 40, 90, 65, 35, 80, 98, 55, 70, 92, 45, 88, 62, 78, 100, 50, 85, 40, 65, 90, 55, 80].map(
              (height, idx) => (
                <div
                  key={idx}
                  className="wave-bar"
                  style={{
                    animationDelay: `${idx * 0.07}s`,
                    height: `${height}%`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Mock Prompt Dialogue */}
        <div className="sim-dialogue-bubble">
          <div className="dialogue-role">System Architecture Challenge #402</div>
          <p className="dialogue-text">
            &ldquo;Walk me through scaling a real-time event streaming pipeline to handle 10M writes/sec with idempotent exactly-once semantics.&rdquo;
          </p>
        </div>

        {/* Real-time AI Metrics Breakdown */}
        <div className="sim-metrics-grid">
          <div className="sim-metric-pill">
            <span className="metric-label">Technical Depth</span>
            <div className="metric-val-row">
              <span className="metric-val text-emerald">98.2%</span>
              <span className="metric-tier">Mastery</span>
            </div>
          </div>

          <div className="sim-metric-pill">
            <span className="metric-label">Communication</span>
            <div className="metric-val-row">
              <span className="metric-val text-purple">96.0%</span>
              <span className="metric-tier">Executive</span>
            </div>
          </div>

          <div className="sim-metric-pill">
            <span className="metric-label">Problem Solving</span>
            <div className="metric-val-row">
              <span className="metric-val text-cyan">94.8%</span>
              <span className="metric-tier">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trust Metric Badges */}
      <div className="trust-stats-row">
        <div className="trust-badge">
          <Award size={18} className="trust-icon purple" />
          <div className="trust-info">
            <span className="trust-num">99.4%</span>
            <span className="trust-sub">Offer Success Rate</span>
          </div>
        </div>
        <div className="trust-badge">
          <Zap size={18} className="trust-icon cyan" />
          <div className="trust-info">
            <span className="trust-num">120k+</span>
            <span className="trust-sub">Interviews Simulated</span>
          </div>
        </div>
        <div className="trust-badge">
          <CheckCircle size={18} className="trust-icon green" />
          <div className="trust-info">
            <span className="trust-num">500+</span>
            <span className="trust-sub">Tier-1 Companies</span>
          </div>
        </div>
      </div>

      {/* Testimonial Rotator */}
      <div className="showcase-testimonial-box glass-panel">
        <Quote size={20} className="quote-icon text-accent" />
        <p className="testimonial-text">
          &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
        </p>
        <div className="testimonial-author-row">
          <img
            src={testimonials[activeTestimonial].avatar}
            alt={testimonials[activeTestimonial].author}
            className="testimonial-avatar"
          />
          <div className="author-meta">
            <span className="author-name">{testimonials[activeTestimonial].author}</span>
            <span className="author-role">
              {testimonials[activeTestimonial].role} • <strong className="author-co">{testimonials[activeTestimonial].company}</strong>
            </span>
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setActiveTestimonial(i)}
                className={`test-dot ${i === activeTestimonial ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
