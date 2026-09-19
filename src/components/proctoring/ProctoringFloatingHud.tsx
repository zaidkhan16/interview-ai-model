import React, { useRef, useEffect, useState } from 'react';
import type { MediaStreamState, ProctoringGuardState } from '../../types/auth';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Shield,
  ShieldAlert,
  Maximize,
  Minimize,
  ChevronUp,
  ChevronDown,
  ListOrdered,
  Volume2,
} from 'lucide-react';

interface ProctoringFloatingHudProps {
  mediaState: MediaStreamState;
  guardState: ProctoringGuardState;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onRequestFullscreen: () => Promise<void>;
  onOpenAuditLog: () => void;
}

export const ProctoringFloatingHud: React.FC<ProctoringFloatingHudProps> = ({
  mediaState,
  guardState,
  onToggleCamera,
  onToggleMic,
  onRequestFullscreen,
  onOpenAuditLog,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Hook live video feed
  useEffect(() => {
    if (videoRef.current && mediaState.stream) {
      videoRef.current.srcObject = mediaState.stream;
    }
  }, [mediaState.stream, mediaState.isCameraMuted]);

  const hasViolations = guardState.violationCount > 0;

  return (
    <aside
      className={`proctoring-floating-hud glass-panel ${isMinimized ? 'minimized' : ''} ${
        hasViolations ? 'has-violations' : ''
      }`}
      aria-label="Proctoring Live Monitor"
    >
      {/* HUD Header Bar */}
      <div className="hud-header" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="hud-title-group">
          {hasViolations ? (
            <ShieldAlert size={15} className="text-danger animate-pulse" />
          ) : (
            <Shield size={15} className="text-emerald" />
          )}
          <span className="hud-title-text">
            {isMinimized ? 'PROCTORED' : 'PROCTORING HUD'}
          </span>
          <span className={`hud-strike-pill ${hasViolations ? 'strike-warn' : 'strike-ok'}`}>
            {guardState.violationCount}/{guardState.maxViolations} Strikes
          </span>
        </div>

        <div className="hud-header-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="hud-mini-btn"
            title={isMinimized ? 'Expand Camera & Controls' : 'Minimize to Pill'}
            aria-label="Toggle HUD visibility"
          >
            {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Content View */}
      {!isMinimized && (
        <div className="hud-body animate-fade-in">
          {/* Candidate Live Webcam Stream */}
          <div className="hud-video-container">
            {mediaState.stream && mediaState.hasCamera && !mediaState.isCameraMuted ? (
              <div className="hud-video-frame">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="hud-live-video"
                />
                {/* AI Facial Overlay Frame */}
                <div className="hud-face-target">
                  <div className="target-reticle top-left"></div>
                  <div className="target-reticle top-right"></div>
                  <div className="target-reticle bottom-left"></div>
                  <div className="target-reticle bottom-right"></div>
                  <div className="hud-scanner-bar"></div>
                </div>
                <div className="hud-rec-tag">
                  <span className="rec-dot pulsing"></span>
                  <span>LIVE FEED</span>
                </div>
              </div>
            ) : (
              <div className="hud-video-off-state">
                <VideoOff size={24} className="text-muted" />
                <span className="video-off-label">Camera Disabled</span>
              </div>
            )}

            {/* Real-Time Microphone Wave / VU Level Indicator */}
            <div className="hud-audio-waveform-row">
              <div className="hud-audio-label">
                <Volume2 size={12} className={mediaState.audioLevel > 5 ? 'text-accent' : 'text-muted'} />
                <span>Voice: {mediaState.isMicMuted ? 'Muted' : `${mediaState.audioLevel}%`}</span>
              </div>
              <div className="hud-mini-meter-track">
                <div
                  className="hud-mini-meter-bar"
                  style={{
                    width: mediaState.isMicMuted ? '0%' : `${mediaState.audioLevel}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick HUD Security Toolbar */}
          <div className="hud-toolbar-buttons">
            <button
              type="button"
              onClick={onToggleMic}
              className={`hud-btn-pill ${mediaState.isMicMuted ? 'muted' : 'active'}`}
              title={mediaState.isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              aria-label="Toggle microphone"
            >
              {mediaState.isMicMuted ? <MicOff size={14} /> : <Mic size={14} />}
              <span>{mediaState.isMicMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleCamera}
              className={`hud-btn-pill ${mediaState.isCameraMuted ? 'muted' : 'active'}`}
              title={mediaState.isCameraMuted ? 'Turn Camera On' : 'Turn Camera Off'}
              aria-label="Toggle camera"
            >
              {mediaState.isCameraMuted ? <VideoOff size={14} /> : <Video size={14} />}
              <span>{mediaState.isCameraMuted ? 'Start Cam' : 'Stop Cam'}</span>
            </button>

            <button
              type="button"
              onClick={onRequestFullscreen}
              className="hud-btn-pill"
              title={guardState.isFullscreen ? 'Fullscreen Active' : 'Enter Fullscreen'}
              aria-label="Toggle fullscreen"
            >
              {guardState.isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              <span>{guardState.isFullscreen ? 'Exit FS' : 'Fullscreen'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenAuditLog}
              className="hud-btn-pill audit-btn"
              title="View Security & Anti-Cheat Audit Logs"
              aria-label="View security logs"
            >
              <ListOrdered size={14} />
              <span>Logs ({guardState.violationCount})</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
