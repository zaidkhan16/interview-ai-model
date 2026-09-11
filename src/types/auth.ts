export type AuthMode = 'signin' | 'signup';

export type UserRole = 'candidate' | 'recruiter' | 'enterprise';

export type ColorPalette = 'nebula' | 'cyan' | 'emerald' | 'sunset' | 'platinum';

export type ThemeMode = 'dark' | 'light';

export type DashboardView = 'overview' | 'studio' | 'questions' | 'analytics' | 'resume';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  readinessScore: number;
  completedInterviews: number;
  targetRole: string;
  memberSince: string;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  agreeTerms: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
  general?: string;
}

export interface PasswordCriterion {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Unbreakable';
  color: string;
  criteria: PasswordCriterion[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

export interface DemoAccount {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  targetRole: string;
  label: string;
  description: string;
  avatar: string;
}

export interface AIInterviewer {
  id: string;
  name: string;
  role: string;
  companyBg: string;
  specialty: string;
  avatar: string;
  tone: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  category: 'System Design' | 'Algorithms' | 'Behavioral' | 'ML Systems' | 'Concurrency';
  difficulty: 'Junior' | 'Medium' | 'Hard' | 'Staff Level';
  targetCompany: string;
  timeEstimate: string;
  prompt: string;
  keyRubrics: string[];
  solvedCount: number;
  matchScore: number;
}

export interface InterviewSession {
  id: string;
  title: string;
  date: string;
  interviewer: string;
  score: number;
  category: string;
  duration: string;
  feedback: {
    strengths: string[];
    improvements: string[];
  };
}

export interface CompetencyScore {
  skill: string;
  score: number;
  level: string;
  change: string;
}
