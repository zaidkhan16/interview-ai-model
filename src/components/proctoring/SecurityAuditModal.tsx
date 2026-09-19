import React from 'react';
import type { ProctoringViolation } from '../../types/auth';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  X,
  Clock,
  Trash2,
  Lock,
  Layers,
  Activity,
  Laptop,
} from 'lucide-react';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  violations: ProctoringViolation[];
  onResetViolations: () => void;
  isFullscreen: boolean;
  hasCamera: boolean;
  hasMic: boolean;
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({
  isOpen,
  onClose,
  violations,
  onResetViolations,
  isFullscreen,
  hasCamera,
  hasMic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="proctoring-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="security-audit-card glass-panel animate-scale-up">
        {/* Header */}
        <div className="audit-header">
          <div className="audit-title-group">
            <div className="audit-icon-box">
              <ShieldCheck size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="audit-title">Proctoring Security & Audit Log</h3>
              <p className="audit-subtitle">Real-time anti-cheat compliance & telemetry trace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="audit-close-btn"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Hardware & Environment Badges */}
        <div className="audit-status-grid">
          <div className="status-stat-card">
            <div className="stat-icon-wrapper">
              <Layers size={16} className={isFullscreen ? 'text-emerald' : 'text-amber'} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Fullscreen Lock</span>
              <span className={`stat-val ${isFullscreen ? 'text-emerald' : 'text-amber'}`}>
                {isFullscreen ? 'Engaged' : 'Windowed'}
              </span>
            </div>
          </div>

          <div className="status-stat-card">
            <div className="stat-icon-wrapper">
              <Activity size={16} className={hasCamera ? 'text-emerald' : 'text-muted'} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Webcam Feed</span>
              <span className={`stat-val ${hasCamera ? 'text-emerald' : 'text-muted'}`}>
                {hasCamera ? 'Active (Live)' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="status-stat-card">
            <div className="stat-icon-wrapper">
              <Laptop size={16} className={hasMic ? 'text-emerald' : 'text-muted'} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Mic Streaming</span>
              <span className={`stat-val ${hasMic ? 'text-emerald' : 'text-muted'}`}>
                {hasMic ? 'Active (Live)' : 'Muted'}
              </span>
            </div>
          </div>

          <div className="status-stat-card">
            <div className="stat-icon-wrapper">
              <Lock size={16} className={violations.length === 0 ? 'text-emerald' : 'text-danger'} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Violations Logged</span>
              <span className={`stat-val ${violations.length === 0 ? 'text-emerald' : 'text-danger'}`}>
                {violations.length} Event{violations.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Violation Log Table */}
        <div className="audit-log-container">
          <div className="log-container-header">
            <span className="log-heading">Recorded Incident Telemetry</span>
            {violations.length > 0 && (
              <button
                type="button"
                onClick={onResetViolations}
                className="btn-reset-log"
                title="Reset log for testing"
              >
                <Trash2 size={13} />
                <span>Reset Log</span>
              </button>
            )}
          </div>

          {violations.length === 0 ? (
            <div className="audit-empty-state">
              <ShieldCheck size={36} className="text-emerald" />
              <p className="empty-title">Clean Integrity Score: 100%</p>
              <p className="empty-desc">
                No tab switches, window defocusing, or unauthorized actions detected during this session.
              </p>
            </div>
          ) : (
            <div className="audit-log-list">
              {violations.map((v) => (
                <div key={v.id} className={`audit-log-item ${v.severity}`}>
                  <div className="log-item-icon">
                    {v.severity === 'critical' ? (
                      <ShieldAlert size={16} className="text-danger" />
                    ) : (
                      <AlertTriangle size={16} className="text-amber" />
                    )}
                  </div>
                  <div className="log-item-info">
                    <div className="log-item-title-row">
                      <span className="log-item-title">{v.title}</span>
                      <span className="log-item-time">
                        <Clock size={11} /> {v.timestamp}
                      </span>
                    </div>
                    <p className="log-item-desc">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="audit-footer">
          <span className="audit-footer-notice">
            Session telemetry is signed and cryptographically verified on-device.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-audit-close"
          >
            Close Audit Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
