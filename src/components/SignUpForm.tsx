import React, { useState } from 'react';
import type { SignUpFormData, FormErrors, UserRole } from '../types/auth';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { evaluatePasswordStrength } from '../utils/password';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  onSocialLogin: (provider: string) => void;
  isLoading: boolean;
}

const ROLES: { id: UserRole; title: string; subtitle: string; icon: React.ReactNode }[] = [
  {
    id: 'candidate',
    title: 'Candidate',
    subtitle: 'Practice Mock Loops',
    icon: <GraduationCap size={16} />,
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    subtitle: 'Screen & Evaluate',
    icon: <Briefcase size={16} />,
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    subtitle: 'Org AI Rubrics',
    icon: <Building2 size={16} />,
  },
];

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onSocialLogin,
  isLoading,
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const strength = evaluatePasswordStrength(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (strength.score < 2) {
      newErrors.password = 'Password is too weak. Please meet at least 2 security requirements.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms of service and privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="auth-form-wrapper animate-fade-in">
      {/* Role Picker */}
      <div className="role-selector-section">
        <label className="input-label mb-2 block">Select your primary role</label>
        <div className="role-pills-grid">
          {ROLES.map((role) => {
            const isSelected = formData.role === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setFormData({ ...formData, role: role.id })}
                className={`role-pill-btn ${isSelected ? 'role-selected' : ''}`}
              >
                <div className="role-pill-icon">{role.icon}</div>
                <div className="role-pill-info">
                  <span className="role-pill-title">{role.title}</span>
                  <span className="role-pill-sub">{role.subtitle}</span>
                </div>
                {isSelected && <CheckCircle2 size={15} className="role-check" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Social Single Sign-On */}
      <div className="social-auth-section">
        <div className="social-buttons-grid">
          <button
            type="button"
            onClick={() => onSocialLogin('Google')}
            className="social-btn social-google"
            aria-label="Sign up with Google"
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
            aria-label="Sign up with GitHub"
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
            aria-label="Sign up with LinkedIn"
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
        <span className="divider-text">or register with email</span>
        <span className="divider-line" />
      </div>

      {/* Registration Fields */}
      <form onSubmit={handleSubmit} className="form-fields" noValidate>
        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="signup-name" className="input-label">
            Full Name
          </label>
          <div className={`input-field-wrapper ${errors.fullName ? 'input-error' : ''}`}>
            <User size={18} className="field-icon" />
            <input
              id="signup-name"
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: undefined });
              }}
              placeholder="Elena Rostova"
              className="styled-input"
              autoComplete="name"
            />
          </div>
          {errors.fullName && (
            <span className="field-error-text animate-shake">
              <AlertCircle size={13} /> {errors.fullName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="input-group">
          <label htmlFor="signup-email" className="input-label">
            Work or Personal Email
          </label>
          <div className={`input-field-wrapper ${errors.email ? 'input-error' : ''}`}>
            <Mail size={18} className="field-icon" />
            <input
              id="signup-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="elena@company.com"
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

        {/* Password */}
        <div className="input-group">
          <label htmlFor="signup-password" className="input-label">
            Create Password
          </label>
          <div className={`input-field-wrapper ${errors.password ? 'input-error' : ''}`}>
            <Lock size={18} className="field-icon" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="At least 8 chars with symbols & numbers"
              className="styled-input"
              autoComplete="new-password"
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

          {/* Dynamic Password Strength Meter */}
          <PasswordStrengthMeter password={formData.password} />

          {errors.password && (
            <span className="field-error-text animate-shake mt-1">
              <AlertCircle size={13} /> {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="signup-confirm-password" className="input-label">
            Confirm Password
          </label>
          <div className={`input-field-wrapper ${errors.confirmPassword ? 'input-error' : ''}`}>
            <Lock size={18} className="field-icon" />
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              placeholder="Re-enter your password"
              className="styled-input"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="eye-toggle-btn"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="field-error-text animate-shake">
              <AlertCircle size={13} /> {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="input-group">
          <label className="checkbox-custom-label terms-label">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => {
                setFormData({ ...formData, agreeTerms: e.target.checked });
                if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: undefined });
              }}
              className="styled-checkbox"
            />
            <span className="checkbox-box" />
            <span className="checkbox-text">
              I agree to the <a href="#terms" className="text-link">Terms of Service</a>,{' '}
              <a href="#privacy" className="text-link">Privacy Policy</a>, and AI Training Rubrics.
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="field-error-text animate-shake">
              <AlertCircle size={13} /> {errors.agreeTerms}
            </span>
          )}
        </div>

        {/* Submit Button */}
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
                <span>Creating workspace...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Create AI Intelligence Account</span>
                <ArrowRight size={18} className="btn-arrow-icon" />
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};
