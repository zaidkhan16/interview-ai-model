# InterviewIQ • AI Technical & Behavioral Interview Simulation Platform

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **InterviewIQ** is an autonomous AI-powered technical and behavioral interview platform designed to prepare engineers for Tier-1 and FAANG loops through real-time voice analysis, code sandboxing, rubric intelligence, and competency tracking.

---

## 📌 GitHub Repository Quick Info

- **Repository Description**:
  ```text
  Autonomous AI Technical & Behavioral Interview Platform with real-time voice analysis, code sandbox, FAANG rubric evaluation, and interactive telemetry dashboard.
  ```
- **Recommended GitHub Topics**:
  `ai-interview`, `react`, `typescript`, `vite`, `mock-interviews`, `system-design`, `faang-preparation`, `voice-ai`, `rubrics`, `developer-tools`

---

## 🚀 Key Features

### 1. Dual-Layout Authentication & Security Enclave
- **1-Click Fast Fill Profiles**: Instant candidate, recruiter, and enterprise mock profiles with one click.
- **Biometric & 2FA Verification**: Simulated 6-digit OTP code verification modal with active countdown timers.
- **Forgot Password Flow**: Cryptographically signed email reset simulation.
- **Social Single Sign-On**: One-click Google, GitHub, and LinkedIn authentication integrations.

### 2. Live AI Mock Interview Studio (`LiveMockStudio`)
- **Real-Time Audio Waveform**: 28-band multi-frequency laser equalizer visualizing live voice telemetry.
- **Integrated Code Sandbox**: Syntax-highlighted code editor supporting JavaScript, TypeScript, Python, and Go with simulated test runner.
- **Multi-Dimensional AI Rubric Engine**: Instant breakdown across Technical Depth, Architecture Trade-offs, and Executive Communication.

### 3. Question Bank & Curriculum (`QuestionBankView`)
- **500+ Curated Challenges**: Filterable by category (System Design, Algorithms, Concurrency, Behavioral Leadership) and target companies (Google, Meta, Stripe, Netflix, OpenAI, Amazon).
- **Search & Difficulty Matrix**: Instant search filtering by key concepts (e.g., CAP Theorem, Idempotency, LRU Cache).

### 4. Candidate Readiness & Performance Analytics (`AnalyticsView`)
- **FAANG Readiness Radar**: Competency breakdown with percentage scoring and quartile rankings.
- **Interview History & Detailed Scorecards**: Comprehensive feedback logs highlighting strengths and improvement suggestions.
- **ATS Resume Match Engine**: Role alignment score calculator based on job descriptions.

### 5. Multi-Theme & Coordinated Color System
- **☀️ Light & 🌙 Dark Mode**: High-contrast, accessibility-tested themes.
- **5 Curated Color Palettes**:
  - 🌌 **Cosmic Nebula** (Deep Violet & Indigo)
  - 💎 **Cyber Cyan** (Sapphire & Cyan)
  - 🌲 **Emerald Matrix** (Teal & Emerald)
  - 🌅 **Sunset Ember** (Rose & Amber)
  - ✨ **Luxe Platinum** (Monochrome Obsidian & Silver)

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Bundler & Dev Server** | [Vite 8.3](https://vitejs.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations & Effects** | Vanilla CSS Glassmorphism + Canvas API + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Linter & Code Quality** | [Oxlint](https://oxc.rs/) + TypeScript Typecheck |

---

## 📁 Project Structure

```text
interview-ai-model/
├── src/
│   ├── assets/              # Static SVG & image assets
│   ├── components/
│   │   ├── dashboard/       # Main Dashboard, Sidebar, TopNavbar & Views
│   │   │   ├── AnalyticsView.tsx
│   │   │   ├── LiveMockStudio.tsx
│   │   │   ├── MainDashboard.tsx
│   │   │   ├── OverviewView.tsx
│   │   │   ├── QuestionBankView.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopNavbar.tsx
│   │   ├── BackgroundCanvas.tsx     # Particle system canvas
│   │   ├── FeatureShowcase.tsx      # Live AI simulation showcase
│   │   ├── ForgotPasswordModal.tsx  # Password recovery modal
│   │   ├── HoloBackground.tsx       # Perspective grid canvas
│   │   ├── PasswordStrengthMeter.tsx# Real-time password validator
│   │   ├── SignInForm.tsx           # Sign In with fast fill
│   │   ├── SignUpForm.tsx           # Multi-role register form
│   │   ├── Toast.tsx                # Floating notifications
│   │   └── TwoFactorModal.tsx       # 6-digit OTP verification
│   ├── types/
│   │   └── auth.ts          # Strongly typed interfaces & state models
│   ├── utils/
│   │   └── password.ts      # Cryptographic password strength evaluator
│   ├── App.tsx              # Root controller & routing
│   ├── App.css              # Glassmorphism, animations & responsiveness
│   ├── index.css            # Design tokens, variables & color themes
│   └── main.tsx             # React DOM entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zaidkhan16/interview-ai-model.git
   cd interview-ai-model
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Run Linter**:
   ```bash
   npm run lint
   ```

---

## 👥 Demo Credentials (1-Click Fast Fill)

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Candidate Demo** | Alex Chen | `alex.candidate@nexus.ai` | `Password@2026!` |
| **Recruiter Demo** | Sarah Jenkins | `sarah.recruiter@stripe.com` | `Recruiter#Secure99` |
| **Enterprise Lead (Triggers 2FA)** | David Vance | `david.enterprise@meta.com` | `MetaLead$Secure2026` |

---

## 🤝 Collaboration & Contributing

1. Fork the repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.
