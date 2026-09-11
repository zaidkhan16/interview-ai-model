import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, X, Sparkles, ArrowLeft } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      onSuccess(email);
    }, 900);
  };

  const handleReset = () => {
    setIsSent(false);
    setEmail('');
    setError('');
  };

  return (
    <div className="modal-backdrop animate-fade-in" role="dialog" aria-modal="true">
      <div className="modal-card glass-panel animate-scale-up">
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {!isSent ? (
          <>
            <div className="modal-header-icon">
              <div className="icon-glow-ring" />
              <div className="icon-badge">
                <Mail size={24} className="modal-shield-icon" />
              </div>
            </div>

            <h3 className="modal-title">Reset your password</h3>
            <p className="modal-description">
              Enter your verified email and we'll send you an encrypted link to reset your account password.
            </p>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="input-group">
                <label htmlFor="reset-email" className="input-label">
                  Account Email Address
                </label>
                <div className={`input-field-wrapper ${error ? 'input-error' : ''}`}>
                  <Mail size={17} className="field-icon" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="name@company.com"
                    className="styled-input"
                    autoFocus
                  />
                </div>
                {error && <span className="field-error-text">{error}</span>}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <span className="spinner-loader" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="reset-success-view animate-fade-in">
            <div className="success-icon-badge">
              <CheckCircle2 size={40} className="success-check-svg text-emerald" />
            </div>
            <h3 className="modal-title">Check your inbox</h3>
            <p className="modal-description">
              We have dispatched instructions and a password recovery link to{' '}
              <strong className="modal-email-highlight">{email}</strong>.
            </p>
            <div className="security-notice-box">
              <Sparkles size={14} className="notice-icon text-accent" />
              <span>Link expires in 15 minutes. Check spam if not found.</span>
            </div>

            <div className="modal-actions full-width">
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
              >
                <ArrowLeft size={15} />
                Try another email
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
