import React, { useEffect, useRef } from 'react';
import type { MediaStreamState } from '../../types/auth';
import {
  Camera,
  Mic,
  ShieldAlert,
  CheckCircle2,
  Maximize2,
  AlertTriangle,
  Sparkles,
  Lock,
  Volume2,
} from 'lucide-react';

interface ProctoringInitModalProps {
  isOpen: boolean;
  userName: string;
  mediaState: MediaStreamState;
  onRequestMedia: () => Promise<MediaStream | null>;
  onEnterDashboard: () => void;
  onRequestFullscreen: () => Promise<void>;
}

export const ProctoringInitModal: React.FC<ProctoringInitModalProps> = ({
  isOpen,
  userName,
  mediaState,
  onRequestMedia,
  onEnterDashboard,
  onRequestFullscreen,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Bind media stream to preview video element
  useEffect(() => {
    if (videoRef.current && mediaState.stream) {
      videoRef.current.srcObject = mediaState.stream;
    }
  }, [mediaState.stream]);

  if (!isOpen) return null;

  const isHardwareReady = mediaState.permissionStatus === 'granted';

  const handleStartSession = async () => {
    await onRequestFullscreen();
    onEnterDashboard();
  };

  return (
    <div className="proctoring-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="proctoring-init-card glass-panel animate-scale-up">
        {/* Glow Header */}
        <div className="init-modal-glow" />

        {/* Security Badge Header */}
        <div className="init-modal-header">
          <div className="init-badge-pill">
            <ShieldAlert size={14} className="text-accent animate-pulse" />
            <span>AI PROCTORING & HARDWARE VERIFICATION</span>
          </div>
          <h2 className="init-modal-title">Welcome, {userName}</h2>
          <p className="init-modal-subhead">
            Your interview workspace requires real-time camera, microphone streaming, and strict tab restrictions to ensure verified evaluation integrity.
          </p>
        </div>

        {/* Live Calibration Grid: Left Video / Right Audio & Rules */}
        <div className="init-calibration-grid">
          {/* Left: Camera Feed Preview with HUD Overlay */}
          <div className="init-video-preview-box">
            {mediaState.permissionStatus === 'granted' && mediaState.stream && mediaState.hasCamera ? (
              <div className="video-stream-wrapper">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="init-live-video"
                />
                {/* Futuristic AI Facial HUD Frame */}
                <div className="video-hud-overlay">
                  <div className="hud-corner top-left"></div>
                  <div className="hud-corner top-right"></div>
                  <div className="hud-corner bottom-left"></div>
                  <div className="hud-corner bottom-right"></div>
                  <div className="hud-scan-line"></div>
                  <div className="hud-status-badge">
                    <span className="hud-rec-dot"></span>
                    <span>LIVE CAMERA FEED</span>
                  </div>
                </div>
              </div>
            ) : mediaState.permissionStatus === 'requesting' ? (
              <div className="video-placeholder-state requesting">
                <div className="spinner-loader large"></div>
                <p className="placeholder-text">Requesting Camera & Microphone Access...</p>
                <span className="placeholder-sub">Please click &quot;Allow&quot; in the browser prompt</span>
              </div>
            ) : mediaState.permissionStatus === 'denied' ? (
              <div className="video-placeholder-state denied">
                <AlertTriangle size={36} className="text-danger" />
                <p className="placeholder-text danger">Hardware Access Denied</p>
                <span className="placeholder-sub">
                  Camera and Microphone are required for proctored evaluation. Please click the lock/camera icon in your address bar and choose &quot;Always allow&quot;.
                </span>
                <button
                  type="button"
                  onClick={onRequestMedia}
                  className="btn-retry-hardware"
                >
                  Retry Hardware Permissions
                </button>
              </div>
            ) : (
              <div className="video-placeholder-state initial">
                <div className="icon-pulse-wrapper">
                  <Camera size={38} className="text-accent" />
                </div>
                <p className="placeholder-text">Camera & Voice Activation Required</p>
                <span className="placeholder-sub">Click below to activate your devices for AI scoring</span>
                <button
                  type="button"
                  onClick={onRequestMedia}
                  className="btn-request-hardware"
                >
                  <Sparkles size={16} />
                  <span>Activate Camera & Voice</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Audio Level & Anti-Cheat Restrictions */}
          <div className="init-controls-column">
            {/* Live Audio Volume Meter */}
            <div className="audio-meter-panel glass-subpanel">
              <div className="meter-header">
                <div className="meter-title">
                  <Mic size={16} className={mediaState.hasMic ? 'text-accent' : 'text-muted'} />
                  <span>Microphone Audio Monitor</span>
                </div>
                <span className={`meter-status ${mediaState.audioLevel > 5 ? 'active' : ''}`}>
                  {mediaState.hasMic ? `${mediaState.audioLevel}% dB` : 'Disconnected'}
                </span>
              </div>

              {/* Dynamic VU Meter Bar */}
              <div className="vu-meter-bar-container">
                <div
                  className="vu-meter-level-fill"
                  style={{
                    width: `${mediaState.audioLevel}%`,
                    background:
                      mediaState.audioLevel > 70
                        ? 'linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #ef4444 100%)'
                        : 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)',
                  }}
                />
              </div>
              <span className="meter-caption">
                <Volume2 size={12} /> Speak to test your voice levels in real-time
              </span>
            </div>

            {/* Proctoring Protocol List */}
            <div className="rules-checklist-panel glass-subpanel">
              <span className="rules-section-title">
                <Lock size={14} className="text-accent" />
                Active Frontend Security Protocols
              </span>

              <ul className="rules-list">
                <li className="rule-item">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span><strong>Tab Switch Restriction:</strong> Leaving the tab triggers an instant alert & violation.</span>
                </li>
                <li className="rule-item">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span><strong>Window Loss Prevention:</strong> Defocusing / Alt-Tab is monitored & recorded.</span>
                </li>
                <li className="rule-item">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span><strong>Fullscreen Enforcement:</strong> Session runs in distraction-free lockdown.</span>
                </li>
                <li className="rule-item">
                  <CheckCircle2 size={15} className="text-emerald" />
                  <span><strong>Exit Prompt Guard:</strong> Accidental tab closure/refresh is blocked.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="init-modal-footer">
          {!isHardwareReady ? (
            <button
              type="button"
              onClick={onRequestMedia}
              disabled={mediaState.permissionStatus === 'requesting'}
              className="btn-init-primary"
            >
              <Camera size={18} />
              <span>{mediaState.permissionStatus === 'requesting' ? 'Requesting Device Access...' : 'Authorize Camera & Voice'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartSession}
              className="btn-init-primary ready animate-pulse-gentle"
            >
              <Maximize2 size={18} />
              <span>Enter Proctored Workspace & Fullscreen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
