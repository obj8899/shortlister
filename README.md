# ✨ Shortlister

> Every candidate reviewed. Every decision explained.
>
> A staged AI pipeline that narrows thousands of candidates into a ranked shortlist — cheaply, explainably, and with a human always able to step in.

---

## 🚀 What is Shortlister?

Shortlister is a modern recruitment and candidate-screening platform that combines intelligent AI screening, transparent evaluation, and manual override controls into one beautiful web app.

Instead of drowning in hundreds of applications, Shortlister helps teams:
- ✅ Filter candidates through a structured 4-stage pipeline
- 📊 Score each applicant with clear, explainable reasoning
- 🎯 Rank the strongest fits for a role
- 🧠 Give candidates actionable feedback on their profile
- 📧 Notify applicants automatically with outcome updates

It is built for hiring teams that want smarter, faster, and fairer decision-making without losing the human element.

---

## ✨ Why Shortlister?

Traditional hiring workflows are slow, noisy, and inconsistent.

Shortlister changes that by making hiring:
- Faster: reduce manual screening time dramatically
- Smarter: use AI for relevance, depth, and ranking
- Transparent: every decision is backed by a score and explanation
- Human-first: reviewers can override, inspect, and adjust outcomes
- Cost-aware: understand how much each assessment stage is costing

This is not a black-box ATS. It is an intelligent shortlisting assistant designed for controlled, explainable hiring.

---

## 🧩 Product Features

### For Candidates
- Resume upload in PDF format
- Skill tagging and validation
- Role-based application flow
- Application status tracking
- ATS-style match feedback
- Personalized shortlist/rejection updates

### For Reviewers
- Manage open roles and role criteria
- Review candidates in a live pipeline dashboard
- Run stage-by-stage filtering manually or automatically
- Inspect scoring, reasoning, and rankings
- Override shortlist decisions
- View bias and cost signals

---

## 🛠 Tech Stack

<div align="center">

| ![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white) | ![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black) | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
|---|---|---|
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) | ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white) |
| ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) | ![Brevo](https://img.shields.io/badge/Brevo%20Email-7B68EE?style=for-the-badge&logoColor=white) | ![Zod](https://img.shields.io/badge/Zod-3068AD?style=for-the-badge&logoColor=white) |

</div>

---

## 🏗 How the Pipeline Works

```text
┌──────────────────────────────────────────────────────────────┐
│                 CANDIDATE APPLICATION INTAKE                 │
│  Name, Email, Skills, College, LinkedIn, Resume PDF         │
└──────────────────────────────┬───────────────────────────────┘
                               │
             ┌─────────────────▼─────────────────┐
             │ 📋 STAGE 1: Eligibility Check       │
             │ Required skill validation           │
             │ Minimum skill count enforcement     │
             └─────────────────┬─────────────────┘
                               │
             ┌─────────────────▼─────────────────┐
             │ 🎯 STAGE 2: Relevance Match        │
             │ Semantic similarity vs target      │
             │ profile using embeddings           │
             └─────────────────┬─────────────────┘
                               │
             ┌─────────────────▼─────────────────┐
             │ 🧠 STAGE 3: Depth Evaluation       │
             │ Gemini scores technical fit        │
             │ and provides reasoning             │
             └─────────────────┬─────────────────┘
                               │
             ┌─────────────────▼─────────────────┐
             │ 🏆 STAGE 4: Final Ranking          │
             │ Weighted score + shortlist size    │
             │ + manual overrides                 │
             └─────────────────┬─────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │ 💌 Notification     │
                    │ Shortlisted / Rejected │
                    └──────────────────────┘
```

### Pipeline Highlights

| Stage | Purpose | Output |
|---|---|---|
| 1 | Hard filter | Candidate meets minimum eligibility |
| 2 | Relevance scoring | Candidate matches role target profile |
| 3 | Depth evaluation | Candidate is technically strong enough |
| 4 | Final rank | Shortlist and weighted final score |

---

## 📁 Project Structure

```text
shortlister/
├── app/
│   ├── about/
│   ├── admin/
│   ├── api/
│   │   ├── candidates/
│   │   ├── open-roles/
│   │   ├── roles/
│   │   ├── stage1/
│   │   ├── stage2/
│   │   ├── stage3/
│   │   ├── stage4/
│   │   └── stats/
│   ├── apply/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── StudentForm.tsx
│   ├── CandidateDashboard.tsx
│   ├── CandidateLedger.tsx
│   ├── AdminSettings.tsx
│   ├── ReviewPanel.tsx
│   ├── BiasDashboard.tsx
│   ├── CostTracker.tsx
│   └── ...
├── lib/
│   ├── atsAnalysis.ts
│   ├── authenticity.ts
│   ├── duplicateCheck.ts
│   ├── embeddings.ts
│   ├── evaluator.ts
│   ├── hardFilter.ts
│   ├── pipelineConfig.ts
│   ├── sendEmail.ts
│   ├── similarity.ts
│   └── ...
├── public/
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── package-lock.json
```

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` file in the root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com
```

### 3) Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 💡 Key Capabilities

### AI-powered candidate matching
Shortlister uses Google Gemini to:
- generate embeddings for role targets and candidate profiles
- compare semantic similarity using cosine similarity
- evaluate depth and technical fit of applicants
- provide structured reasoning for scored decisions

### ATS-style resume analysis
The app extracts resume text and evaluates whether it aligns with a role’s target profile, generating:
- a score from 0–100
- practical feedback on how to strengthen the fit

### Duplicate and authenticity checks
It also catches:
- near-duplicate resumes
- generic or low-signal skill lists
- suspiciously repetitive candidate submissions

This gives hiring teams more confidence in the quality of the shortlist.

---

## 📊 Admin Features

The admin dashboard includes:
- role selection and management
- stage-by-stage pipeline execution
- shortlist ranking
- candidate ledger and status tracking
- insights on cost and bias
- command palette actions for quick navigation
- reset/re-run controls for each role

This makes the app feel less like a static tool and more like an operational hiring dashboard.

---

## 🧠 Why This Project Stands Out

Shortlister combines the three things hiring teams actually need:

1. Speed — filter candidates quickly
2. Trust — explain every score and shortlist decision
3. Control — let humans override or review final selections

It is built for the “AI-assisted hiring” future: not fully automated, not fully manual, but intelligently balanced.

---

## 🤝 The Team

Built by:
- Ojass Bhatt — Backend & AI/ML Developer
- Palak Tripathi — Frontend & Database Developer

The project brings together recruitment workflow UX, AI evaluation, and data-driven hiring intelligence in a single experience.

---

## 🛣 Roadmap

- [ ] Interview scheduling integration
- [ ] Slack/Teams notifications
- [ ] Better role benchmarking and scoring presets
- [ ] More detailed bias and fairness reporting
- [ ] Candidate portal improvements
- [ ] Bulk candidate import/export
- [ ] Enhanced recruiter commentary system

---

## 📄 Notes

This project is a polished full-stack prototype built around a real-world hiring workflow, using Next.js, Supabase, and Gemini AI to power a candidate shortlisting system.

It is especially suited for teams experimenting with AI-assisted recruiting workflows that still require human review and intervention.

---

<div align="center">

### ⭐ Built for smarter hiring.

Shortlister helps teams move from “too many applicants” to “clear, ranked, explainable decisions.”

</div>
