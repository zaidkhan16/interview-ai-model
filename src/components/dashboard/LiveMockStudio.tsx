import React, { useState, useEffect } from 'react';
import type { AIInterviewer } from '../../types/auth';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Send,
  Lightbulb,
  Award,
} from 'lucide-react';

interface LiveMockStudioProps {
  onNotify: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

const INTERVIEWERS: AIInterviewer[] = [
  {
    id: 'sophia',
    name: 'Sophia Vance',
    role: 'Senior Staff Infrastructure Architect',
    companyBg: 'Ex-Google & Meta L7',
    specialty: 'Distributed Systems & Sharding',
    avatar: '👩‍💻',
    tone: 'Thorough, Rubric-focused, Architecture depth',
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    role: 'Principal Bar Raiser & Director',
    companyBg: 'Stripe & Amazon Principal',
    specialty: 'System Design & High-Concurrency',
    avatar: '👨‍💼',
    tone: 'Fast-paced, Edge cases, Leadership STAR',
  },
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Staff ML & Performance Lead',
    companyBg: 'OpenAI Systems',
    specialty: 'Algorithms, GPU Pipelines & Concurrency',
    avatar: '👩‍🔬',
    tone: 'Algorithmic efficiency, Memory optimization',
  },
];

export const LiveMockStudio: React.FC<LiveMockStudioProps> = ({ onNotify }) => {
  const [selectedInterviewer, setSelectedInterviewer] = useState<AIInterviewer>(INTERVIEWERS[0]);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [userCode, setUserCode] = useState<string>(
`// System Architecture Blueprint: Distributed Cache with Invalidation
class DistributedCacheCluster {
  private partitions: Map<number, CacheNode> = new Map();
  private ringHasher: ConsistentHashRing;

  constructor(private nodeCount: number, private replicationFactor: number = 3) {
    this.ringHasher = new ConsistentHashRing(nodeCount);
  }

  async get(key: string): Promise<CachePayload | null> {
    const targetNode = this.ringHasher.getNode(key);
    return await targetNode.read(key);
  }

  async setWithLease(key: string, value: any, ttlMs: number): Promise<boolean> {
    // Implement token lease to prevent thundering herd
    return true;
  }
}`
  );
  const [selectedLang, setSelectedLang] = useState<string>('TypeScript');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<null | {
    score: number;
    technicalDepth: number;
    communication: number;
    feedback: string;
  }>(null);

  const [simulatedTranscript, setSimulatedTranscript] = useState<string>(
    "Sophia AI: 'Welcome Alex. Let's design a distributed caching layer capable of handling 5M read QPS with zero-downtime invalidation during node failure. How do you handle consistent hashing with virtual nodes?'"
  );

  useEffect(() => {
    if (isSessionActive && !isMicMuted) {
      const timer = setTimeout(() => {
        setSimulatedTranscript((prev) =>
          prev + "\n\nCandidate: 'To prevent hot-spotting, I would implement consistent hashing with 256 virtual nodes per physical machine, and use bounded-load consistent hashing to redirect excess load to the secondary replica.'"
        );
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isSessionActive, isMicMuted]);

  const handleStartSession = () => {
    setIsSessionActive(true);
    setEvaluationResult(null);
    onNotify('AI Mock Session Live', `Connected to ${selectedInterviewer.name} with 18ms latency.`, 'success');
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    onNotify('Session Paused', 'AI Audio stream paused.', 'info');
  };

  const handleRequestHint = () => {
    onNotify('AI Hint Dispatched', 'Consider discussing TTL jitter and token-based lease locks to avoid cache stampede.', 'info');
  };

  const handleSubmitEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        score: 96,
        technicalDepth: 98,
        communication: 94,
        feedback: 'Outstanding explanation of virtual node distribution and lease locks. Recommended to briefly mention failover latency bounds.',
      });
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#6366f1', '#38bdf8', '#10b981'],
        });
      } catch {
        // ignore
      }
      onNotify('Evaluation Complete!', 'Scorecard generated: 96% Staff Mastery.', 'success');
    }, 1800);
  };

  return (
    <div className="live-studio-container animate-fade-in">
      {/* Studio Header Bar */}
      <div className="studio-top-bar glass-panel">
        <div className="studio-title-block">
          <div className="live-status-pill">
            <span className={`live-dot ${isSessionActive ? 'pulsing' : ''}`}></span>
            <span className="live-text">{isSessionActive ? 'SESSION IN PROGRESS' : 'STUDIO READY'}</span>
          </div>
          <h1 className="studio-headline">Live AI Mock Interview Studio</h1>
        </div>

        {/* AI Interviewer Selector Pills */}
        <div className="interviewer-selector-pills">
          {INTERVIEWERS.map((interviewer) => {
            const isSelected = selectedInterviewer.id === interviewer.id;
            return (
              <button
                key={interviewer.id}
                type="button"
                onClick={() => {
                  setSelectedInterviewer(interviewer);
                  if (isSessionActive) {
                    onNotify('Interviewer Switched', `Now interviewing with ${interviewer.name}`, 'info');
                  }
                }}
                className={`interviewer-pill-btn ${isSelected ? 'active' : ''}`}
              >
                <span className="interviewer-emoji">{interviewer.avatar}</span>
                <div className="interviewer-pill-meta">
                  <span className="pill-name">{interviewer.name}</span>
                  <span className="pill-co">{interviewer.companyBg}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid: Left Live Interviewer/Voice Canvas + Right Code/Whiteboard */}
      <div className="studio-main-grid">
        {/* Left Column: AI Agent Avatar & Live Audio Waveform */}
        <div className="studio-left-column">
          <div className="ai-agent-stage glass-panel">
            {/* Stage Video / Visual Box */}
            <div className="agent-video-box">
              <div className="agent-avatar-display">
                <div className="avatar-glow-ring"></div>
                <div className="avatar-large-icon">{selectedInterviewer.avatar}</div>
              </div>
              <div className="agent-stage-info">
                <div className="agent-stage-name">{selectedInterviewer.name}</div>
                <div className="agent-stage-specialty">{selectedInterviewer.role} • {selectedInterviewer.specialty}</div>
              </div>

              {/* Live Audio Equalizer Wave */}
              <div className="stage-waveform-overlay">
                <div className="stage-wave-bars">
                  {[35, 75, 45, 95, 60, 100, 80, 50, 90, 70, 40, 85, 98, 65, 75, 90, 55, 80, 60, 100, 45, 85, 40, 70].map(
                    (val, idx) => (
                      <div
                        key={idx}
                        className={`stage-wave-bar ${isSessionActive && !isMicMuted ? 'wave-active' : ''}`}
                        style={{
                          height: isSessionActive && !isMicMuted ? `${val}%` : '20%',
                          animationDelay: `${idx * 0.06}s`,
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Media Controls Toolbar */}
            <div className="studio-media-toolbar">
              <button
                type="button"
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`media-ctrl-btn ${isMicMuted ? 'muted' : 'active'}`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isMicMuted ? 'Muted' : 'Mic Active'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`media-ctrl-btn ${isVideoOn ? 'active' : 'muted'}`}
                title="Toggle WebCam"
              >
                {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                <span>{isVideoOn ? 'Video On' : 'Video Off'}</span>
              </button>

              <button
                type="button"
                onClick={handleRequestHint}
                className="media-ctrl-btn hint"
                title="Ask AI for a strategic hint"
              >
                <Lightbulb size={18} />
                <span>Request Hint</span>
              </button>

              {!isSessionActive ? (
                <button
                  type="button"
                  onClick={handleStartSession}
                  className="media-ctrl-btn btn-session-start"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start Live Loop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEndSession}
                  className="media-ctrl-btn btn-session-end"
                >
                  <RotateCcw size={16} />
                  <span>Pause Loop</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-Time Live Transcript Dialogue Box */}
          <div className="studio-transcript-box glass-panel">
            <div className="transcript-box-header">
              <span className="transcript-title">
                <Sparkles size={13} className="text-accent" /> Live Speech-to-Text & AI Transcript
              </span>
              <span className="transcript-latency">Latency: 18ms</span>
            </div>
            <div className="transcript-text-stream">
              {simulatedTranscript.split('\n\n').map((para, i) => (
                <p key={i} className="transcript-para">{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Code & Architecture Whiteboard */}
        <div className="studio-right-column">
          <div className="code-sandbox-stage glass-panel">
            <div className="sandbox-top-bar">
              <div className="sandbox-tabs">
                <span className="sandbox-tab active">Solution Architecture.ts</span>
                <span className="sandbox-tab">Whiteboard Notes</span>
              </div>
              <div className="sandbox-lang-select">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="styled-select"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Go">Go</option>
                  <option value="Java">Java</option>
                </select>
              </div>
            </div>

            {/* Code Textarea Editor */}
            <div className="code-editor-area">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="code-textarea"
                spellCheck={false}
                placeholder="Write your architecture design implementation..."
              />
            </div>

            {/* Bottom Evaluation Action Bar */}
            <div className="sandbox-bottom-bar">
              <div className="sandbox-rubric-hint">
                <CheckCircle2 size={15} className="text-emerald" />
                <span>Rubric: Fault tolerance, Virtual Nodes, Bounded Load</span>
              </div>

              <button
                type="button"
                onClick={handleSubmitEvaluation}
                disabled={isEvaluating}
                className="btn-submit-eval"
              >
                {isEvaluating ? (
                  <>
                    <span className="spinner-loader"></span>
                    <span>Scoring with Neural Rubric Engine...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit for Instant AI Scoring</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instant AI Evaluation Result Card (When evaluated) */}
          {evaluationResult && (
            <div className="studio-eval-result-card glass-panel animate-scale-up">
              <div className="eval-result-header">
                <div className="eval-score-badge">
                  <Award size={18} />
                  <span>Score: <strong>{evaluationResult.score}%</strong> (Staff Tier)</span>
                </div>
                <div className="eval-breakdown-row">
                  <span className="eval-pill">Tech Depth: <strong>{evaluationResult.technicalDepth}%</strong></span>
                  <span className="eval-pill">Communication: <strong>{evaluationResult.communication}%</strong></span>
                </div>
              </div>
              <p className="eval-feedback-text">{evaluationResult.feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
