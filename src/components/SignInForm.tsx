import React, { useState } from 'react';
import type { SignInFormData, FormErrors, DemoAccount } from '../types/auth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  onForgotPassword: () => void;
  onSocialLogin: (provider: string) => void;
  onMagicLink: (email: string) => void;
  isLoading: boolean;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Alex Chen',
    email: 'alex.candidate@nexus.ai',
    password: 'Password@2026!',
    role: 'candidate',
    targetRole: 'Senior Staff Software Engineer',
    label: 'Candidate Demo',
    description: 'Full AI Mock Interview Access',
    avatar: '👨‍💻',
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.recruiter@stripe.com',
    password: 'Recruiter#Secure99',
    role: 'recruiter',
    targetRole: 'Tech Talent Partner',
    label: 'Recruiter Demo',
    description: 'Candidate Screening Dashboard',
    avatar: '👩‍💼',
  },
  {
    name: 'David Vance',
    email: 'david.enterprise@meta.com',
    password: 'MetaLead$Secure2026',
    role: 'enterprise',
    targetRole: 'VP of Engineering',
    label: 'Enterprise Lead',
    description: 'Custom Rubrics & 2FA Flow',
    avatar: '🏢',
  },
];

export const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  onForgotPassword,
  onSocialLogin,
  onMagicLink,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [isMagicLinkMode, setIsMagicLinkMode] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Work email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid work email address';
    }

    if (!isMagicLinkMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (isMagicLinkMode) {
        onMagicLink(formData.email);
      } else {
        onSubmit(formData);
      }
    }
  };

  const handleDemoFill = (account: DemoAccount) => {
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: true,
    });
    setErrors({});
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  return (
    <div className="auth-form-wrapper animate-fade-in">
      {/* 1-Click Fast Fill Quick Demo Accounts */}
      <div className="demo-presets-container">
        <div className="demo-presets-header">
          <span className="demo-badge">
            <Sparkles size={12} className="sparkle-icon" /> 1-Click Fast Fill
          </span>
          <span className="demo-hint-sub">Click any role to test instant login</span>
        </div>
        <div className="demo-cards-row">
          {DEMO_ACCOUNTS.map((demo) => {
            const isSelected = formData.email === demo.email;
            return (
              <button
                key={demo.role}
                type="button"
                onClick={() => handleDemoFill(demo)}
                className={`demo-pill-btn ${isSelected ? 'demo-active' : ''}`}
                title={`${demo.name} (${demo.email})`}
              >
                <span className="demo-avatar">{demo.avatar}</span>
                <span className="demo-pill-title">{demo.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Social Logins */}
      <div className="social-auth-section">
        <div className="social-buttons-grid">
          <button
            type="button"
            onClick={() => onSocialLogin('Google')}
            className="social-btn social-google"
            aria-label="Sign in with Google"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" className="social-icon">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.4 0-.8.2-1.6.4-2.4L1.9 7C.7 9.4 0 12 0 12s.7 2.6 1.9 5l3.7-2.3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.3 7.5 23 12 23z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => onSocialLogin('GitHub')}
            className="social-btn social-github"
            aria-label="Sign in with GitHub"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="social-icon">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => onSocialLogin('LinkedIn')}
            className="social-btn social-linkedin"
            aria-label="Sign in with LinkedIn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#0A66C2" className="social-icon">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      <div className="auth-divider">
        <span className="divider-line" />
        <span className="divider-text">or continue with email</span>
        <span className="divider-line" />
      </div>

      {/* Main Email Form */}
      <form onSubmit={handleSubmit} className="form-fields" noValidate>
        {/* Email Field */}
        <div className="input-group">
          <label htmlFor="signin-email" className="input-label">
            Work Email Address
          </label>
          <div
            className={`input-field-wrapper ${errors.email ? 'input-error' : ''} ${formData.email ? 'has-value' : ''}`}
          >
            <Mail size={18} className="field-icon" />
            <input
              id="signin-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="alex@company.com"
              className="styled-input"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <span className="field-error-text animate-shake">
              <AlertCircle size={13} /> {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        {!isMagicLinkMode && (
          <div className="input-group">
            <div className="label-row">
              <label htmlFor="signin-password" className="input-label">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="forgot-link-btn"
              >
                Forgot password?
              </button>
            </div>
            <div
              className={`input-field-wrapper ${errors.password ? 'input-error' : ''} ${formData.password ? 'has-value' : ''}`}
            >
              <Lock size={18} className="field-icon" />
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                onKeyUp={handleKeyUp}
                placeholder="Enter your account password"
                className="styled-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-toggle-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {capsLockActive && (
              <div className="capslock-warning">
                <AlertCircle size={12} /> Caps Lock is ON
              </div>
            )}

            {errors.password && (
              <span className="field-error-text animate-shake">
                <AlertCircle size={13} /> {errors.password}
              </span>
            )}
          </div>
        )}

        {/* Remember me & Magic Link Toggle */}
        <div className="form-options-row">
          <label className="checkbox-custom-label">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="styled-checkbox"
            />
            <span className="checkbox-box" />
            <span className="checkbox-text">Remember device for 30 days</span>
          </label>

          <button
            type="button"
            onClick={() => setIsMagicLinkMode(!isMagicLinkMode)}
            className="magic-link-toggle"
          >
            {isMagicLinkMode ? 'Use Password instead' : '🪄 Magic Link'}
          </button>
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`auth-submit-btn ${isLoading ? 'btn-loading' : ''}`}
        >
          <div className="btn-glow-layer" />
          <div className="btn-content-row">
            {isLoading ? (
              <>
                <span className="spinner-loader" />
                <span>Signing in to workspace...</span>
              </>
            ) : (
              <>
                <span>{isMagicLinkMode ? 'Send Magic Login Link' : 'Sign In to Workspace'}</span>
                <ArrowRight size={18} className="btn-arrow-icon" />
              </>
            )}
          </div>
        </button>

        {/* Security Notice */}
        <div className="auth-footer-security">
          <ShieldCheck size={14} className="text-emerald" />
          <span>256-Bit SSL Encrypted Vault • Zero-Log Architecture</span>
        </div>
      </form>
    </div>
  );
};
