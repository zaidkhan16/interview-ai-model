import type { PasswordStrengthResult, PasswordCriterion } from '../types/auth';

export const evaluatePasswordStrength = (password: string): PasswordStrengthResult => {
  const criteria: PasswordCriterion[] = [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'casing',
      label: 'Uppercase & lowercase letters',
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      met: /[0-9]/.test(password),
    },
    {
      id: 'special',
      label: 'At least one symbol (!@#$%^&*)',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Weak',
      color: '#64748b',
      criteria,
    };
  }

  if (metCount <= 1) {
    return {
      score: 1,
      label: 'Weak',
      color: '#ef4444',
      criteria,
    };
  } else if (metCount === 2) {
    return {
      score: 2,
      label: 'Fair',
      color: '#f59e0b',
      criteria,
    };
  } else if (metCount === 3) {
    return {
      score: 3,
      label: 'Good',
      color: '#38bdf8',
      criteria,
    };
  } else {
    if (password.length >= 12) {
      return {
        score: 4,
        label: 'Unbreakable',
        color: '#a855f7',
        criteria,
      };
    }
    return {
      score: 4,
      label: 'Strong',
      color: '#10b981',
      criteria,
    };
  }
};
