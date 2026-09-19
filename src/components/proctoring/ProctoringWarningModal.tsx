import React from 'react';
import type { ProctoringViolation } from '../../types/auth';
import { AlertOctagon, ShieldAlert, Maximize2, Check, Clock, AlertTriangle } from 'lucide-react';

interface ProctoringWarningModalProps {
  alert: ProctoringViolation | null;
  violationCount: number;
  maxViolations: number;
  onDismiss: () => void;
  onRequestFullscreen: () => Promise<void>;
}

export const ProctoringWarningModal: React.FC<ProctoringWarningModalProps> = ({
  alert,
  violationCount,
  maxViolations,
  onDismiss,
  onRequestFullscreen,
}) => {
  if (!alert) return null;

  const isCritical = violationCount >= maxViolations;

  const handleAcknowledge = async () => {
    try {
      await onRequestFullscreen();
    } catch {
      // Ignore
    }
    onDismiss();
  };

  return (
    <div className="proctoring-warning-overlay animate-fade-in" role="alertdialog" aria-modal="true">
      <div className={`proctoring-warning-card glass-panel animate-shake ${isCritical ? 'critical' : 'warning'}`}>
        {/* Glow Element */}
        <div className="warning-card-glow"></div>

        {/* Top Warning Icon */}
        <div className="warning-icon-wrapper">
          {isCritical ? (
            <AlertOctagon size={42} className="text-danger animate-pulse" />
          ) : (
            <ShieldAlert size={42} className="text-amber animate-pulse" />
          )}
        </div>

        {/* Header Title */}
        <div className="warning-text-cluster">
          <div className="warning-category-badge">
            <AlertTriangle size={13} />
            <span>ANTI-CHEAT PROCTORING VIOLATION</span>
          </div>

          <h2 className="warning-headline">{alert.title}</h2>
          <p className="warning-description">{alert.description}</p>
        </div>

        {/* Strike Meter & Rules Status */}
        <div className="strike-meter-card glass-subpanel">
          <div className="strike-header">
            <span className="strike-label">Violation Strike Status</span>
            <span className={`strike-count-text ${isCritical ? 'danger' : 'warn'}`}>
              Strike {violationCount} of {maxViolations}
            </span>
          </div>

          <div className="strike-indicators-row">
            {Array.from({ length: maxViolations }).map((_, index) => {
              const isFilled = index < violationCount;
              return (
                <div
                  key={index}
                  className={`strike-segment ${isFilled ? (isCritical ? 'filled-danger' : 'filled-warn') : 'empty'}`}
                />
              );
            })}
          </div>

          <div className="strike-meta-time">
            <Clock size={12} />
            <span>Incident Timestamp: {alert.timestamp}</span>
          </div>
        </div>

        {/* Policy Notice */}
        <div className="warning-policy-notice">
          <p>
            {isCritical
              ? 'Maximum strike threshold reached. This session may be flagged for disqualification upon final evaluation.'
              : 'Tab switching, window minimization, or leaving this workspace is strictly prohibited during proctored evaluation.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="warning-action-buttons">
          <button
            type="button"
            onClick={handleAcknowledge}
            className="btn-warning-primary"
          >
            <Maximize2 size={16} />
            <span>Re-Enter Fullscreen & Resume Session</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="btn-warning-secondary"
          >
            <Check size={15} />
            <span>Acknowledge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
