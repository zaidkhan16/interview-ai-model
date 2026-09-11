import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowRight, RefreshCw, X, KeyRound } from 'lucide-react';

interface TwoFactorModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (code: string) => void;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  email,
  isOpen,
  onClose,
  onVerifySuccess,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(45);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const canResend = countdown === 0;

  // Focus first input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isOpen]);

  const handleChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...digits];
    newDigits[index] = cleanVal.slice(-1);
    setDigits(newDigits);
    setErrorMsg('');

    if (cleanVal && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);

    const focusIdx = Math.min(pastedData.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(45);
    setErrorMsg('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Please enter all 6 digits of the authentication code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onVerifySuccess(fullCode);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" role="dialog" aria-modal="true">
      <div className="modal-card glass-panel animate-scale-up">
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close two factor verification"
        >
          <X size={18} />
        </button>

        <div className="modal-header-icon">
          <div className="icon-glow-ring" />
          <div className="icon-badge">
            <KeyRound size={26} className="modal-shield-icon" />
          </div>
        </div>

        <h3 className="modal-title">Two-Factor Authentication</h3>
        <p className="modal-description">
          We sent a 6-digit security code to{' '}
          <strong className="modal-email-highlight">{email || 'your email'}</strong>
        </p>

        {/* Demo Hint */}
        <div className="demo-otp-hint">
          <ShieldCheck size={14} />
          <span>Demo tip: You can enter any 6 digits (e.g. <strong>784920</strong>)</span>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs-row" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-digit-input ${digit ? 'filled' : ''} ${errorMsg ? 'error' : ''}`}
                autoComplete="one-time-code"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {errorMsg && <div className="modal-error-banner">{errorMsg}</div>}

          <div className="otp-timer-row">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="resend-active-btn"
              >
                <RefreshCw size={13} />
                Resend new code
              </button>
            ) : (
              <span className="resend-countdown-text">
                Resend code in <strong>{countdown}s</strong>
              </span>
            )}
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
              disabled={isLoading || digits.join('').length < 6}
              className="btn-primary"
            >
              {isLoading ? (
                <span className="spinner-loader" />
              ) : (
                <>
                  <span>Verify Identity</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
