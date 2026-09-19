import React, { useState } from 'react';
import type { UserProfile, ColorPalette, ThemeMode, MediaStreamState, ProctoringGuardState } from '../../types/auth';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Palette,
  Sparkles,
  LogOut,
  Activity,
  User,
  CheckCircle2,
  X,
  Shield,
  ShieldAlert,
  Camera,
  Mic,
} from 'lucide-react';

interface TopNavbarProps {
  user: UserProfile;
  palette: ColorPalette;
  onPaletteChange: (palette: ColorPalette, label: string) => void;
  mode: ThemeMode;
  onToggleMode: () => void;
  onSignOut: () => void;
  onCelebrate: () => void;
  onNotify: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
  mediaState?: MediaStreamState;
  guardState?: ProctoringGuardState;
  onOpenAuditLog?: () => void;
}

const PALETTES: { id: ColorPalette; label: string; dotClass: string }[] = [
  { id: 'nebula', label: 'Cosmic Nebula (Violet)', dotClass: 'palette-nebula-dot' },
  { id: 'cyan', label: 'Cyber Cyan & Sapphire', dotClass: 'palette-cyan-dot' },
  { id: 'emerald', label: 'Emerald Matrix AI', dotClass: 'palette-emerald-dot' },
  { id: 'sunset', label: 'Sunset Ember Luxury', dotClass: 'palette-sunset-dot' },
  { id: 'platinum', label: 'Luxe Platinum', dotClass: 'palette-platinum-dot' },
];

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  palette,
  onPaletteChange,
  mode,
  onToggleMode,
  onSignOut,
  onCelebrate,
  onNotify,
  mediaState,
  guardState,
  onOpenAuditLog,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const violationCount = guardState?.violationCount || 0;
  const isProctored = guardState?.isProctoringActive;

  return (
    <header className="dash-top-navbar glass-panel">
      {/* Left: Global Search Box */}
      <div className="navbar-search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search questions, rubrics, system designs..."
          className="search-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onNotify('Search Results Filtered', `Filtered view for "${e.currentTarget.value}"`, 'info');
            }
          }}
        />
        <span className="search-shortcut">⌘K</span>
      </div>

      {/* Center: Live Neural Engine Status & Proctoring Indicator */}
      <div className="navbar-center-cluster">
        <div className="navbar-engine-status">
          <div className="engine-pulse-dot"></div>
          <span className="engine-status-text">Nexus Voice AI v2.5</span>
          <span className="engine-latency-tag">
            <Activity size={12} /> 18ms Latency
          </span>
        </div>

        {isProctored && (
          <button
            type="button"
            onClick={onOpenAuditLog}
            className={`navbar-proctoring-pill ${violationCount > 0 ? 'warning' : 'active'}`}
            title="Click to view Anti-Cheat Proctoring Audit Log"
          >
            {violationCount > 0 ? (
              <ShieldAlert size={13} className="text-danger animate-pulse" />
            ) : (
              <Shield size={13} className="text-emerald" />
            )}
            <span className="proctoring-pill-title">
              {violationCount > 0 ? `${violationCount} Violations` : 'Tab Lock & Cam Active'}
            </span>
            <div className="proctor-device-dots">
              <span
                className={`device-dot ${mediaState?.hasCamera && !mediaState?.isCameraMuted ? 'on' : 'off'}`}
                title={mediaState?.hasCamera ? 'Camera Streaming' : 'Camera Disabled'}
              >
                <Camera size={10} />
              </span>
              <span
                className={`device-dot ${mediaState?.hasMic && !mediaState?.isMicMuted ? 'on' : 'off'}`}
                title={mediaState?.hasMic ? 'Mic Streaming' : 'Mic Muted'}
              >
                <Mic size={10} />
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Right Controls Cluster */}
      <div className="navbar-controls-cluster">
        {/* Light/Dark Toggle */}
        <button
          type="button"
          onClick={onToggleMode}
          className="nav-control-pill"
          title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {mode === 'dark' ? <Sun size={15} className="mode-icon sun" /> : <Moon size={15} className="mode-icon moon" />}
          <span className="nav-control-label">{mode === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* 5-Palette Color Switcher */}
        <div className="palette-switcher-group" title="Select Coordinated Color Palette">
          <Palette size={13} style={{ color: 'var(--text-muted)', marginLeft: 3 }} />
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPaletteChange(p.id, p.label)}
              className={`palette-btn ${palette === p.id ? 'active' : ''}`}
              title={p.label}
              aria-label={p.label}
            >
              <div className={`palette-dot ${p.dotClass}`}></div>
            </button>
          ))}
        </div>

        {/* Celebrate Confetti Trigger */}
        <button
          type="button"
          onClick={onCelebrate}
          className="nav-btn-celebrate"
          title="Celebrate readiness score"
        >
          <Sparkles size={15} />
          <span>Celebrate</span>
        </button>

        {/* Notifications Button */}
        <div className="nav-dropdown-wrapper">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`nav-icon-btn ${showNotifications ? 'active' : ''}`}
            aria-label="View notifications"
          >
            <Bell size={17} />
            <span className="notif-badge-dot"></span>
          </button>

          {showNotifications && (
            <div className="dropdown-panel notif-dropdown glass-panel animate-scale-up">
              <div className="dropdown-header">
                <span className="dropdown-title">AI Feedback & Alerts</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="dropdown-close-btn"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="notif-list">
                <div className="notif-item unread">
                  <div className="notif-icon-circle green">
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="notif-body">
                    <div className="notif-head">Staff Rubric Mastered</div>
                    <div className="notif-desc">
                      Your Distributed Cache loop scored 96% in Concurrency & CAP theorem.
                    </div>
                    <span className="notif-time">15 mins ago</span>
                  </div>
                </div>

                <div className="notif-item">
                  <div className="notif-icon-circle purple">
                    <Sparkles size={14} />
                  </div>
                  <div className="notif-body">
                    <div className="notif-head">New Question Added</div>
                    <div className="notif-desc">
                      Stripe 2026 Bar Raiser challenge: Real-time Ledger idempotency.
                    </div>
                    <span className="notif-time">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="nav-dropdown-wrapper">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className={`user-profile-nav-btn ${showProfileMenu ? 'active' : ''}`}
          >
            <div className="user-avatar-circle">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <span className="nav-user-name">{user.name}</span>
          </button>

          {showProfileMenu && (
            <div className="dropdown-panel profile-dropdown glass-panel animate-scale-up">
              <div className="profile-dropdown-header">
                <div className="dropdown-user-avatar">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-name">{user.name}</span>
                  <span className="dropdown-email">{user.email}</span>
                  <span className="dropdown-role-badge uppercase">{user.role}</span>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-menu-list">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNotify('Profile Settings', 'Opening user preferences...', 'info');
                  }}
                  className="dropdown-item"
                >
                  <User size={15} />
                  <span>Profile & Target Role</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSignOut();
                  }}
                  className="dropdown-item danger"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
