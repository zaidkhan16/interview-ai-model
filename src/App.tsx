import React, { useState, useRef } from 'react';
import type { AuthMode, SignInFormData, SignUpFormData, UserProfile, ToastMessage, ColorPalette, ThemeMode } from './types/auth';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { FeatureShowcase } from './components/FeatureShowcase';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';
import { TwoFactorModal } from './components/TwoFactorModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { ProctoringInitModal } from './components/proctoring/ProctoringInitModal';
import { ProctoringFloatingHud } from './components/proctoring/ProctoringFloatingHud';
import { ProctoringWarningModal } from './components/proctoring/ProctoringWarningModal';
import { SecurityAuditModal } from './components/proctoring/SecurityAuditModal';
import { Toast } from './components/Toast';
import { useProctoringMedia } from './hooks/useProctoringMedia';
import { useProctoringGuard } from './hooks/useProctoringGuard';
import { LogIn, UserPlus, Palette, Sun, Moon, ShieldCheck } from 'lucide-react';
import './App.css';

const PALETTES: { id: ColorPalette; label: string; dotClass: string }[] = [
  { id: 'nebula', label: 'Cosmic Nebula (Violet)', dotClass: 'palette-nebula-dot' },
  { id: 'cyan', label: 'Cyber Cyan & Sapphire', dotClass: 'palette-cyan-dot' },
  { id: 'emerald', label: 'Emerald Matrix AI', dotClass: 'palette-emerald-dot' },
  { id: 'sunset', label: 'Sunset Ember Luxury', dotClass: 'palette-sunset-dot' },
  { id: 'platinum', label: 'Luxe Platinum', dotClass: 'palette-platinum-dot' },
];

export function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [palette, setPalette] = useState<ColorPalette>('nebula');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [is2FAOpen, setIs2FAOpen] = useState<boolean>(false);
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [isProctoringInitOpen, setIsProctoringInitOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const toastCountRef = useRef(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Hook 1: Real-time Camera, Voice & Web Audio VU Analysis
  const {
    mediaState,
    requestMedia,
    toggleCamera,
    toggleMic,
    stopMedia,
  } = useProctoringMedia(false);

  const addToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    toastCountRef.current += 1;
    const id = `toast_${toastCountRef.current}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Hook 2: Anti-Cheat Proctoring, Tab Switch Restriction & Fullscreen Guard
  const {
    guardState,
    requestFullscreen,
    exitFullscreen,
    dismissAlert,
    resetViolations,
  } = useProctoringGuard({
    isActive: !!user && !isProctoringInitOpen,
    maxViolations: 3,
    onViolation: (violation) => {
      addToast(
        '⚠️ Anti-Cheat Warning',
        `${violation.title}: ${violation.description}`,
        'error'
      );
    },
  });

  const handlePaletteChange = (newPalette: ColorPalette, label: string) => {
    setPalette(newPalette);
    addToast('Palette Updated', `Switched theme to ${label}`, 'info');
  };

  const toggleThemeMode = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      addToast(`${next === 'light' ? '☀️ Light' : '🌙 Dark'} Mode Activated`, `Switched interface to ${next} theme`, 'info');
      return next;
    });
  };

  // Helper when login succeeds: triggers camera/mic and proctoring initialization
  const onLoginSuccess = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsProctoringInitOpen(true);
    addToast('Activating Hardware', 'Requesting camera and microphone for proctored evaluation...', 'info');
    // Prompt/activate camera and microphone immediately upon login
    try {
      await requestMedia();
    } catch {
      // Handled in media hook
    }
  };

  // Sign In Handler
  const handleSignIn = (data: SignInFormData) => {
    setIsLoading(true);
    setPendingEmail(data.email);

    setTimeout(() => {
      setIsLoading(false);
      if (data.email.includes('enterprise') || data.email.includes('meta')) {
        setIs2FAOpen(true);
        addToast('2FA Security Check', 'Verification key dispatched to your inbox.', 'info');
      } else {
        const loggedUser: UserProfile = {
          id: 'usr_88291',
          name: data.email.includes('alex') ? 'Alex Chen' : data.email.split('@')[0],
          email: data.email,
          role: data.email.includes('recruiter') ? 'recruiter' : 'candidate',
          readinessScore: 94,
          completedInterviews: 12,
          targetRole: data.email.includes('recruiter') ? 'Senior Tech Recruiter' : 'Senior Staff Software Engineer',
          memberSince: 'March 2026',
        };
        onLoginSuccess(loggedUser);
        addToast('Welcome back!', `Signed in successfully as ${loggedUser.name}`, 'success');
      }
    }, 1100);
  };

  // Sign Up Handler
  const handleSignUp = (data: SignUpFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: 'usr_' + Math.floor(Math.random() * 90000 + 10000),
        name: data.fullName,
        email: data.email,
        role: data.role,
        readinessScore: 82,
        completedInterviews: 1,
        targetRole: data.role === 'candidate' ? 'Full Stack AI Engineer' : data.role === 'recruiter' ? 'Talent Lead' : 'Engineering Manager',
        memberSince: 'September 2026',
      };
      onLoginSuccess(newUser);
      addToast('Account Created!', `Welcome to InterviewIQ, ${newUser.name}!`, 'success');
    }, 1300);
  };

  // Social Login Handler
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const socialUser: UserProfile = {
        id: 'usr_oauth_' + provider.toLowerCase(),
        name: `${provider} Verified Engineer`,
        email: `dev@${provider.toLowerCase()}-user.io`,
        role: 'candidate',
        readinessScore: 91,
        completedInterviews: 8,
        targetRole: 'Senior Cloud & ML Engineer',
        memberSince: 'September 2026',
      };
      onLoginSuccess(socialUser);
      addToast(`${provider} Authorized`, `Signed in via ${provider} Single Sign-On`, 'success');
    }, 900);
  };

  // Magic Link Handler
  const handleMagicLink = (email: string) => {
    addToast('Magic Link Dispatched!', `Check your inbox at ${email}. Click the link to log in instantly.`, 'success');
  };

  // 2FA Verification Success
  const handle2FASuccess = (code: string) => {
    setIs2FAOpen(false);
    const twoFactorUser: UserProfile = {
      id: 'usr_2fa_verified',
      name: pendingEmail.includes('david') ? 'David Vance' : 'Secured User',
      email: pendingEmail,
      role: 'enterprise',
      readinessScore: 98,
      completedInterviews: 24,
      targetRole: 'VP of Engineering & Systems',
      memberSince: 'January 2026',
    };
    onLoginSuccess(twoFactorUser);
    addToast('Identity Verified!', `2FA Token (${code}) authenticated successfully.`, 'success');
  };

  // Sign out
  const handleSignOut = () => {
    stopMedia();
    resetViolations();
    exitFullscreen();
    setIsProctoringInitOpen(false);
    setIsAuditModalOpen(false);
    setUser(null);
    addToast('Signed out', 'Camera & Microphone stopped. You have safely signed out.', 'info');
  };

  // Card Mouse Move for radial glow effect
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className={`app-root palette-${palette} mode-${mode}`}>
      {/* Interactive Particle Canvas */}
      <BackgroundCanvas palette={palette} mode={mode} />

      {/* Aurora Ambient Lighting */}
      <div className="aurora-glow aurora-1" />
      <div className="aurora-glow aurora-2" />
      <div className="aurora-glow aurora-3" />

      {/* Floating Global Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* 2FA Modal */}
      <TwoFactorModal
        email={pendingEmail}
        isOpen={is2FAOpen}
        onClose={() => setIs2FAOpen(false)}
        onVerifySuccess={handle2FASuccess}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSuccess={(email) => {
          addToast('Recovery Email Dispatched', `Password reset instructions sent to ${email}`, 'success');
        }}
      />

      {/* Proctoring Hardware Calibration Modal on Login */}
      {user && (
        <ProctoringInitModal
          isOpen={isProctoringInitOpen}
          userName={user.name}
          mediaState={mediaState}
          onRequestMedia={requestMedia}
          onRequestFullscreen={requestFullscreen}
          onEnterDashboard={() => {
            setIsProctoringInitOpen(false);
            addToast('Proctored Mode Engaged', 'Anti-cheat monitoring and tab restrictions are active.', 'success');
          }}
        />
      )}

      {/* Floating PiP Webcam & Mic HUD (Always available during logged-in proctored session) */}
      {user && !isProctoringInitOpen && (
        <ProctoringFloatingHud
          mediaState={mediaState}
          guardState={guardState}
          onToggleCamera={toggleCamera}
          onToggleMic={toggleMic}
          onRequestFullscreen={requestFullscreen}
          onOpenAuditLog={() => setIsAuditModalOpen(true)}
        />
      )}

      {/* Strict Tab-Switch & Focus Loss Alert Modal */}
      {user && (
        <ProctoringWarningModal
          alert={guardState.currentAlert}
          violationCount={guardState.violationCount}
          maxViolations={guardState.maxViolations}
          onDismiss={dismissAlert}
          onRequestFullscreen={requestFullscreen}
        />
      )}

      {/* Security Telemetry & Violation Audit Modal */}
      {user && (
        <SecurityAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          violations={guardState.violations}
          onResetViolations={resetViolations}
          isFullscreen={guardState.isFullscreen}
          hasCamera={mediaState.hasCamera}
          hasMic={mediaState.hasMic}
        />
      )}

      {/* Main App Container */}
      <main className={`main-viewport ${user ? 'dashboard-mode' : ''}`}>
        {user ? (
          /* Authenticated Enterprise Main Dashboard */
          <MainDashboard
            user={user}
            palette={palette}
            onPaletteChange={handlePaletteChange}
            mode={mode}
            onToggleMode={toggleThemeMode}
            onSignOut={handleSignOut}
            onNotify={addToast}
            mediaState={mediaState}
            guardState={guardState}
            onToggleCamera={toggleCamera}
            onToggleMic={toggleMic}
            onOpenAuditLog={() => setIsAuditModalOpen(true)}
          />
        ) : (
          /* Split-screen Dual Layout Auth Portal */
          <div className="auth-portal-layout animate-fade-in">
            {/* Left Feature & Live AI Intelligence Showcase */}
            <FeatureShowcase />

            {/* Right Dynamic Auth Box */}
            <div
              ref={cardRef}
              className="auth-card-container glass-panel animate-scale-up"
              onMouseMove={handleCardMouseMove}
            >
              <div className="card-radial-glow" />

              {/* Top Bar: Security & Controls (Light/Dark Switcher + Palette Picker) */}
              <div className="auth-card-top-bar">
                <div className="security-status-indicator">
                  <ShieldCheck size={14} className="text-accent" />
                  <span className="sec-dot pulsing" />
                  <span className="sec-text">256-Bit SSL Vault</span>
                </div>

                <div className="top-controls-cluster">
                  {/* Mode Toggle (Sun/Moon) */}
                  <button
                    type="button"
                    onClick={toggleThemeMode}
                    className="mode-toggle-pill"
                    title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle light and dark mode"
                  >
                    {mode === 'dark' ? <Sun size={14} className="mode-icon sun" /> : <Moon size={14} className="mode-icon moon" />}
                    <span className="mode-label-text">{mode === 'dark' ? 'Light' : 'Dark'}</span>
                  </button>

                  {/* Palette Switcher */}
                  <div className="palette-switcher-group" title="Select Coordinated Color Palette">
                    <Palette size={12} style={{ color: 'var(--text-muted)', marginLeft: 3 }} />
                    {PALETTES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePaletteChange(p.id, p.label)}
                        className={`palette-btn ${palette === p.id ? 'active' : ''}`}
                        title={p.label}
                        aria-label={p.label}
                      >
                        <div className={`palette-dot ${p.dotClass}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Auth Header */}
              <div className="auth-card-header">
                <h2 className="auth-headline">
                  {authMode === 'signin' ? 'Welcome Back' : 'Get Started with AI'}
                </h2>
                <p className="auth-subhead">
                  {authMode === 'signin'
                    ? 'Access your personalized AI interview simulation workspace'
                    : 'Create your account to unlock real-time mock interviews & rubrics'}
                </p>
              </div>

              {/* Sliding Pill Mode Switcher */}
              <div className="mode-switcher-container" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'signin'}
                  onClick={() => setAuthMode('signin')}
                  className={`mode-tab-btn ${authMode === 'signin' ? 'mode-tab-active' : ''}`}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'signup'}
                  onClick={() => setAuthMode('signup')}
                  className={`mode-tab-btn ${authMode === 'signup' ? 'mode-tab-active' : ''}`}
                >
                  <UserPlus size={15} />
                  <span>Create Account</span>
                </button>
                <div
                  className={`mode-slider-pill ${authMode === 'signup' ? 'slide-right' : 'slide-left'}`}
                />
              </div>

              {/* Dynamic Form Render */}
              <div className="auth-form-content">
                {authMode === 'signin' ? (
                  <SignInForm
                    onSubmit={handleSignIn}
                    onForgotPassword={() => setIsForgotOpen(true)}
                    onSocialLogin={handleSocialLogin}
                    onMagicLink={handleMagicLink}
                    isLoading={isLoading}
                  />
                ) : (
                  <SignUpForm
                    onSubmit={handleSignUp}
                    onSocialLogin={handleSocialLogin}
                    isLoading={isLoading}
                  />
                )}
              </div>

              {/* Bottom Footer Notice */}
              <footer className="auth-card-footer">
                <p className="footer-notice">
                  By connecting, you join over <strong>120,000+ engineers</strong> training with AI at Google, Meta, and OpenAI.
                </p>
              </footer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
