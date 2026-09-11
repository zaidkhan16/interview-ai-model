import React, { useState, useMemo } from 'react';
import type { QuestionItem } from '../../types/auth';
import {
  Search,
  BookOpen,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface QuestionBankViewProps {
  onStartQuestion: (question: QuestionItem) => void;
  onNotify: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

const QUESTIONS_DATA: QuestionItem[] = [
  {
    id: 'q_1',
    title: 'Design a Distributed Rate Limiter with Sliding Window Counter',
    category: 'System Design',
    difficulty: 'Staff Level',
    targetCompany: 'Stripe',
    timeEstimate: '45 mins',
    prompt: 'Architect a global rate limiting service that processes 500,000 HTTP requests per second with strict SLA limits (<5ms latency) and Redis clustered token bucket sync.',
    keyRubrics: [
      'Sliding Window vs Leaky Bucket trade-off analysis',
      'Handling clock skew across distributed Redis nodes',
      'Graceful degradation under local cluster partition',
    ],
    solvedCount: 1420,
    matchScore: 98,
  },
  {
    id: 'q_2',
    title: 'Scalable Distributed Notification Engine with Multi-Channel Idempotency',
    category: 'System Design',
    difficulty: 'Hard',
    targetCompany: 'Meta',
    timeEstimate: '40 mins',
    prompt: 'Design a real-time messaging notification delivery system handling 50M pushes per hour across iOS, Android, and WebSockets with prioritized queuing and deduplication.',
    keyRubrics: [
      'Message queue partitioning by user shard key',
      'Device token storage and invalidation cache',
      'Dead-letter queue & exponential retry strategy',
    ],
    solvedCount: 980,
    matchScore: 94,
  },
  {
    id: 'q_3',
    title: 'Distributed Log Consensus & Raft Leader Election Implementation',
    category: 'Concurrency',
    difficulty: 'Staff Level',
    targetCompany: 'Google',
    timeEstimate: '50 mins',
    prompt: 'Implement a distributed consensus state machine in TypeScript/Go simulating leader heartbeats, log replication, and split-brain vote avoidance.',
    keyRubrics: [
      'Quorum calculations and term epoch validation',
      'Log compaction and snapshot transmission',
      'Crash recovery from write-ahead log (WAL)',
    ],
    solvedCount: 650,
    matchScore: 96,
  },
  {
    id: 'q_4',
    title: 'Leading a High-Stakes Tech Debt Migration Under Strict Timeline',
    category: 'Behavioral',
    difficulty: 'Staff Level',
    targetCompany: 'OpenAI',
    timeEstimate: '30 mins',
    prompt: 'Describe a scenario where you convinced executive stakeholders to halt feature delivery to rewrite critical core infrastructure before catastrophic scaling bottlenecks.',
    keyRubrics: [
      'STAR structured storytelling with quantifiable metrics',
      'Cross-functional alignment and empathy with Product',
      'Risk mitigation strategy and phased rollout',
    ],
    solvedCount: 2100,
    matchScore: 92,
  },
  {
    id: 'q_5',
    title: 'Design a Real-Time Collaborative Document Canvas (CRDT Engine)',
    category: 'System Design',
    difficulty: 'Hard',
    targetCompany: 'Figma / Google',
    timeEstimate: '45 mins',
    prompt: 'Architect a conflict-free replicated data type (CRDT) engine for concurrent document editing with offline synchronization and state delta compression.',
    keyRubrics: [
      'Operational Transformation vs State CRDT trade-offs',
      'Vector clocks and causality tracking',
      'Delta state broadcasting over WebSockets',
    ],
    solvedCount: 840,
    matchScore: 95,
  },
];

const CATEGORIES = ['All', 'System Design', 'Algorithms', 'Behavioral', 'Concurrency', 'ML Systems'];
const DIFFICULTIES = ['All Difficulties', 'Junior', 'Medium', 'Hard', 'Staff Level'];

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onStartQuestion, onNotify }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All Difficulties');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'All Difficulties' || q.difficulty === selectedDifficulty;
      const matchSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.targetCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="question-bank-container animate-fade-in">
      {/* Header Banner */}
      <div className="qbank-header-card glass-panel">
        <div>
          <div className="qbank-badge">
            <BookOpen size={13} className="text-accent" /> FAANG Rubric Repository
          </div>
          <h1 className="qbank-headline">500+ Curated AI Mock Interview Challenges</h1>
          <p className="qbank-subhead">
            Practice real questions asked at Google, Meta, Stripe, and OpenAI with instant neural rubric evaluation.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="qbank-filter-bar glass-panel">
        <div className="filter-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by topic, keyword, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-search-input"
          />
        </div>

        {/* Category Pills */}
        <div className="filter-categories-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="filter-diff-select">
          <Filter size={14} className="filter-icon" />
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="styled-select"
          >
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="questions-grid">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="question-card glass-panel">
            <div className="q-top-row">
              <div className="q-company-pill">
                <Building2 size={13} /> {q.targetCompany}
              </div>
              <div className="q-meta-badges">
                <span className={`q-diff-badge diff-${q.difficulty.toLowerCase().replace(' ', '-')}`}>
                  {q.difficulty}
                </span>
                <span className="q-match-badge">
                  <Sparkles size={11} /> {q.matchScore}% Match
                </span>
              </div>
            </div>

            <h3 className="q-card-title">{q.title}</h3>
            <p className="q-card-prompt">{q.prompt}</p>

            {/* Rubrics Checklist Preview */}
            <div className="q-rubrics-box">
              <div className="rubrics-title">Key Rubrics Evaluated:</div>
              {q.keyRubrics.map((rubric, idx) => (
                <div key={idx} className="rubric-bullet">
                  <CheckCircle2 size={13} className="text-emerald" />
                  <span>{rubric}</span>
                </div>
              ))}
            </div>

            <div className="q-footer-row">
              <div className="q-stats-info">
                <span className="q-time"><Clock size={12} /> {q.timeEstimate}</span>
                <span className="q-solved">👥 {q.solvedCount.toLocaleString()} practiced</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onStartQuestion(q);
                  onNotify('Mock Loop Loaded', `Starting challenge: "${q.title}"`, 'success');
                }}
                className="btn-practice-q"
              >
                <span>Practice Loop</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
