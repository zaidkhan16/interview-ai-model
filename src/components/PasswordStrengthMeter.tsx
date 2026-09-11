import React, { useMemo } from 'react';
import { evaluatePasswordStrength } from '../utils/password';
import { Check, X, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = useMemo(() => evaluatePasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="password-strength-container animate-fade-in">
      <div className="strength-header">
        <span className="strength-label-text">
          Security Rating:{' '}
          <strong style={{ color: strength.color }}>{strength.label}</strong>
        </span>
        <span className="strength-icon">
          {strength.score >= 3 ? (
            <ShieldCheck size={14} style={{ color: strength.color }} />
          ) : (
            <ShieldAlert size={14} style={{ color: strength.color }} />
          )}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="strength-bars" role="progressbar" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((step) => {
          const isActive = strength.score >= step;
          return (
            <div
              key={step}
              className="strength-bar-segment"
              style={{
                backgroundColor: isActive ? strength.color : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? `0 0 10px ${strength.color}66` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Criteria Checklist */}
      <div className="strength-criteria-grid">
        {strength.criteria.map((item) => (
          <div
            key={item.id}
            className={`criterion-item ${item.met ? 'criterion-met' : 'criterion-unmet'}`}
          >
            {item.met ? (
              <Check size={12} className="criterion-icon met" />
            ) : (
              <X size={12} className="criterion-icon unmet" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
