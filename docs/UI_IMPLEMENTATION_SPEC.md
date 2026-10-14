# AI-First Live Learning Management System (LMS)
## Master UI Implementation Specification

**Document Version:** 1.0.0  
**Status:** Authoritative Specification  
**Date:** October 14, 2026  
**Design Authority:** `design.md` & LMS Product Requirements  

---

## 1. Product Overview & User Experience Goals

### 1.1 Product Vision
The AI-First LMS is an enterprise-grade learning platform operated by a single education organization delivering advanced AI and technical cohorts. It is not an open marketplace. The platform bridges live synchronous teaching, asynchronous review, deep recording intelligence (transcripts, AI chapters, key concepts), context-grounded AI tutoring, and human-in-the-loop mentor/evaluator workflows.

### 1.2 The Six Primary Roles
1. **Super Admin:** Executive and platform owner. Manages system configurations, integrations (Zoom, Razorpay, LLM providers), user roles, audit trails, data retention, LLM cost & token usage, and user impersonation ("View As").
2. **Admin:** Academic operations lead. Manages courses, batches, teacher schedules, student enrollments, batch entitlements (live vs. replay-only, release delays, validity expiries), content libraries, Razorpay transactions, coupons, and certificates.
3. **Teacher:** Faculty and instructor. Conducts live classes with pre-join device check, real-time chat, polls, and "I'm lost" indicators; reviews AI-generated lecture chapters/transcripts; answers timestamped doubts; manages assignments and student rosters.
4. **Student:** Cohort learner. Accesses enrolled batches, joins live classes, reviews replays with chapter markers, searches transcripts, queries the grounded AI tutor with timestamp citations, submits doubts anchored to video timestamps, takes timed tests, and tracks certificates.
5. **Evaluator:** Academic grader. Accesses assigned submission queues; performs blind rubric-based evaluations with criteria scores and subjective feedback; reviews optional AI grading suggestions (proposal only); handles re-evaluation requests.
6. **Support / Mentor:** Student success lead. Manages student doubt and operational tickets; views Student 360 profile (attendance, test scores, engagement); uses canned responses; proposes batch shifts or access extensions for Admin approval; unlocks accounts.

### 1.3 Core UX Principles
- **Uncompromising Visual Excellence:** Restrained glassmorphism, crisp borders, subtle background blur, tailored HSL color tokens, and smooth spring-physics navigation indicators.
- **Role-Aware Contextual Shell:** Every role has an intentionally structured navigation shell. Super Admin features never bleed into Admin or Teacher views.
- **Source-Grounded AI Truth:** The AI tutor strictly displays citations linking to exact video timestamps (`[00:14:22]`) and highlights corresponding transcript rows. If confidence is low, it explicitly indicates insufficient evidence and provides a "Forward to Teacher" escalation button.
- **Entitlement Transparency:** Students and Admins always see clear entitlement tags (`Live + Replay`, `Replay Only`, `Delayed Release: 24h`, `Expires 31 Dec 2026`).

---

## 2. Source-Document Hierarchy & Conflict Resolution

1. **Visual Style Authority:** `design.md` overrides any generic layout patterns. CSS variable names, dark mode tokens, the 5 accent palettes, the fixed desktop sidebar, and the floating glassmorphic mobile dock are mandatory.
2. **Functional Authority:** LMS DPR requirements dictate academic entities: Courses, Batches, Live Classes, Chapters, Doubts, Evaluations, and Indian localization (₹ currency, IST timezone).
3. **Resolved Conflicts:**
   - *Conflict:* `design.md` references a financial payment tracker sample.  
     *Resolution:* Financial labels ("Transactions", "Expenses", "Customers") are mapped directly to LMS concepts ("Enrolled Courses", "Batches", "Students", "Classroom", "Analytics"). Layout geometry and micro-interactions remain 100% faithful to `design.md`.
   - *Conflict:* Role switching in production vs demo.  
     *Resolution:* Demo includes a distinct, non-intrusive Dev Role Switcher bar at the top with badge indicators, clearly separated from real authentication state.

---

## 3. Visual System & Design Tokens (`design.md`)

### 3.1 Color Palette & HSL Variables
Colors are managed via CSS variables in HSL format:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 220 13% 18%;
  --card: 0 0% 100%;
  --card-foreground: 220 13% 18%;
  --popover: 0 0% 100%;
  --popover-foreground: 220 13% 18%;
  --primary: 220 80% 35%; /* Default Ocean */
  --primary-foreground: 0 0% 100%;
  --secondary: 220 40% 95%;
  --secondary-foreground: 220 80% 35%;
  --muted: 220 20% 96%;
  --muted-foreground: 220 13% 46%;
  --accent: 142 76% 36%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 20% 90%;
  --input: 220 20% 90%;
  --ring: 220 80% 35%;
  --radius: 0.75rem;
  --success: 142 76% 36%;
  --success-foreground: 0 0% 100%;
}

.dark {
  --background: 220 18% 12%;
  --foreground: 220 10% 95%;
  --card: 220 18% 15%;
  --card-foreground: 220 10% 95%;
  --popover: 220 18% 15%;
  --popover-foreground: 220 10% 95%;
  --primary: 220 80% 55%;
  --primary-foreground: 0 0% 100%;
  --secondary: 220 18% 22%;
  --secondary-foreground: 220 10% 95%;
  --muted: 220 18% 22%;
  --muted-foreground: 220 10% 70%;
  --accent: 142 76% 45%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 62.8% 50%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 18% 22%;
  --input: 220 18% 22%;
  --ring: 220 80% 55%;
  --success: 142 76% 45%;
  --success-foreground: 0 0% 100%;
}
```

### 3.2 Five Runtime Accent Themes
Managed via `themeService`:
1. **Ocean Blue:** HSL `220 80% 35%` (Hex `#1145a3`)
2. **Emerald Green:** HSL `142 76% 36%` (Hex `#16a34a`)
3. **Royal Violet:** HSL `270 75% 45%` (Hex `#7c3aed`)
4. **Sunset Amber:** HSL `35 92% 45%` (Hex `#d97706`)
5. **Crimson Rose:** HSL `345 80% 45%` (Hex `#e11d48`)

### 3.3 Typography, Spacing & Elevation
- **Font Stack:** Inter / Outfit / system-ui sans-serif with `-webkit-font-smoothing: antialiased`.
- **Card Styling:** `rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xs`.
- **Scrollbars:** Sleek 4px/5px pill scrollbars (`.sleek-scrollbar`).
- **Focus Rings:** `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

---

## 4. Master Application Shell & Responsive Architecture

### 4.1 Desktop Topology (`>= 1024px`)
- **Fixed Left Sidebar (`w-72` fixed inset-y-0):**
  - Brand identity pill (LMS AI logo, live indicator dot).
  - Active Role indicator with Quick Role Switcher (demo safe).
  - Dynamic navigation menu corresponding to active role.
  - Contextual widget: Upcoming Live Class or Learning Goal.
  - Keyboard shortcut modal trigger (`?`).
  - User profile menu and Sign Out trigger.
- **Main Canvas (`lg:pl-72 flex-1 pb-10`):**
  - Top utility row: Global search trigger (`⌘K`), Theme mode toggle, Accent picker, Notification center with unread count.
  - Motion page entrance (`initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).
  - Content container `max-w-7xl mx-auto p-4 sm:p-6 lg:p-8`.

### 4.2 Mobile & Tablet Topology (`< 1024px`)
- **Sticky Top Mobile Header (`sticky top-0 z-30`):**
  - Brand avatar, organization title, and role badge.
  - Notification icon, theme toggle, and hamburger Sheet Drawer trigger.
- **Mobile Navigation Drawer (`SheetContent side="left"`):**
  - Full list of role-specific navigation links.
  - Role switcher, shortcuts, and sign-out buttons.
- **Floating Glassmorphic Bottom Dock (`fixed bottom-3 inset-x-0 z-40 max-w-md mx-auto`):**
  - Houses the top 5 primary routes for the active role.
  - Sliding active pill background with Framer Motion spring physics (`layoutId="mobile-active-pill"`).
  - Native haptic feedback trigger (`navigator.vibrate(15)`).
- **Mobile Floating Action Button (`bottom-20 right-4 z-40 sm:hidden`):**
  - Context-aware action button (e.g., "Ask Doubt", "Schedule Class", "New Ticket").
- **Canvas Bottom Padding:** Strictly `pb-28 sm:pb-32` so floating dock never obscures primary buttons or form submits.

---

## 5. Complete Route & Role Inventory

### 5.1 Authentication & Shared Routes
- `/auth/login` — Role-aware sign in with email/password and demo role quick-fill.
- `/auth/reset-password` — Password recovery workflow.
- `/auth/2fa` — Two-factor verification screen for staff roles (Super Admin, Admin, Evaluator, Support).
- `/unauthorized` — 403 Access Denied screen with role context and back navigation.
- `*` — 404 Not Found screen with search suggestion and home link.

### 5.2 Super Admin Routes (`/super-admin/*`)
- `/super-admin/dashboard` — Platform overview: live sessions count, total students, active teachers, server health, LLM token metrics.
- `/super-admin/users` — User administration: create/edit users, assign roles, toggle 2FA requirement, status control.
- `/super-admin/roles` — Role & granular permission matrix.
- `/super-admin/integrations` — API connectors (Zoom SDK, Razorpay webhooks, OpenAI/Claude LLM endpoints, WhatsApp gateway).
- `/super-admin/usage-costs` — LLM token consumption, Whisper transcription minutes, storage costs, and budget alerts.
- `/super-admin/audit-logs` — Immutable event stream with user filter, action category, timestamp, and IP address.
- `/super-admin/data-retention` — Recording archive policies, student data purge requests, compliance exports.
- `/super-admin/impersonate` — "View as User" selection interface with active impersonation banner.

### 5.3 Admin Routes (`/admin/*`)
- `/admin/dashboard` — Academic operations hub: today's schedule, enrollment stats, revenue summary, pending evaluations.
- `/admin/courses` — Course catalog: create/edit courses, syllabus builder, module management.
- `/admin/courses/:id` — Course detail: module structure, associated batches, resource files.
- `/admin/batches` — Batch directory: create batch, assign teachers, set dates, configure access entitlements.
- `/admin/batches/:id` — Batch detail: enrolled students, scheduled classes, attendance stats, entitlement settings.
- `/admin/teachers` — Teacher directory and allocation manager.
- `/admin/students` — Student directory with batch enrollments, validity extensions, and enrollment drawer.
- `/admin/schedule` — Centralized master calendar and live class scheduler.
- `/admin/live-monitor` — Real-time live session monitor: active classes, viewer counts, audio/video health status.
- `/admin/payments` — Transactions list (₹), Razorpay order IDs, invoices, and discount coupon generator.
- `/admin/certificates` — Certificate templates, automated issuance rules, and verification log.
- `/admin/announcements` — Broadcast composer: WhatsApp, Email, In-app noticeboard.
- `/admin/reports` — Batch completion rates, attendance drop-off analytics, exportable CSVs.
- `/admin/archives` — Soft-deleted courses, archived batches, and restore actions.

### 5.4 Teacher Routes (`/teacher/*`)
- `/teacher/dashboard` — Today's classes, active doubt count, pending assignment reviews, batch engagement score.
- `/teacher/schedule` — Weekly timetable, upcoming lectures, reschedule requests.
- `/teacher/classroom/:classId` — Live Teacher Studio: camera/mic preview, participant roster, raise-hand queue, live chat, poll creator, and "I'm lost" confusion meter.
- `/teacher/recordings` — Post-class processing pipeline: review lecture recording, edit AI-generated chapters, review AI transcript corrections, approve AI summary.
- `/teacher/resources` — Slide decks, code repositories, practice problem sets (DPPs) upload.
- `/teacher/doubts` — Filterable student doubts queue: timestamped questions, audio doubts, reply composer, escalate to support.
- `/teacher/tests` — Assessment creation: MCQ builder, coding problem editor, rubric definition.
- `/teacher/analytics` — Batch attendance trends, recording replay heatmap, concept confusion clusters.
- `/teacher/profile` — Faculty bio, assigned cohorts, device preferences.

### 5.5 Student Routes (`/student/*`)
- `/student/dashboard` — Learner home: next upcoming class countdown, enrolled courses, progress tracker, recent doubts status.
- `/student/courses` — My Enrolled Courses & Batches with entitlement badges (`Live + Replay` vs `Replay Only`).
- `/student/courses/:id` — Course syllabus, module progress, resources, and batch entitlement details.
- `/student/schedule` — Interactive class calendar with pre-join check button and timetable sync.
- `/student/classroom/:classId` — Student Live Classroom: low-latency stream player, live chat, poll voting, raise-hand button, "I'm Lost" feedback toggle, and shared notes.
- `/student/replays` — Video Replay Library: filter by subject, topic, or teacher.
- `/student/replays/:replayId` — Smart Lecture Player:
  - Video player with 0.5x-2.0x speed, 10s skip, keyboard shortcuts (Space, K, J, L).
  - Synchronized AI Chapter List with active chapter highlight.
  - Searchable full-text transcript with auto-scroll and click-to-seek.
  - Contextual AI Tutor drawer citing exact lecture timestamps.
  - "Ask Doubt at Current Timestamp" submission modal.
  - Downloadable teacher notes (PDF) and DPP attachments.
- `/student/doubts` — My Doubts tracker: status (AI Answered, Teacher Replied, Under Review), timestamp links, and escalation toggle.
- `/student/assessments` — Active quizzes, timed tests, and homework assignments.
- `/student/assessments/:testId` — Timed test interface: countdown timer, question palette, answer save, code editor / text entry.
- `/student/results/:testId` — Score breakdown, rubric criteria, evaluator feedback, and "Request Re-evaluation" modal.
- `/student/certificates` — Earned completion certificates with verification ID and PDF download.
- `/student/payments` — Fee receipts, invoices, active subscriptions, and payment history.
- `/student/profile` — Learning goals, notification preferences, account security.

### 5.6 Evaluator Routes (`/evaluator/*`)
- `/evaluator/dashboard` — Evaluator metrics: assigned submissions, pending reviews, turnaround time, moderation score.
- `/evaluator/queue` — Assessment submission queue with batch filter, submission date, and blind-grading toggle.
- `/evaluator/grade/:submissionId` — Comprehensive Grading Suite:
  - Blind grading mode (student identity masked).
  - Objective test auto-score summary.
  - Descriptive / Code answer inspection.
  - Interactive Rubric Sliders (Criteria: Accuracy, Logic, Implementation, Code Style).
  - AI Suggested Score (displayed clearly as a draft recommendation with rationale).
  - Structured evaluator feedback editor.
  - Action buttons: "Save Draft", "Submit Evaluation", "Flag for Moderation".
- `/evaluator/re-evaluations` — Contested student grade review queue with student's rationale and second-reviewer notes.
- `/evaluator/analytics` — Grading distribution bell-curve, average scores by batch.

### 5.7 Support & Mentor Routes (`/support/*`)
- `/support/dashboard` — Active ticket queue, average response time, pending escalations, student satisfaction score.
- `/support/tickets` — Unified inbox: filter by category (Academic Doubt, Payment Issue, Batch Change, Account Lock).
- `/support/tickets/:id` — Ticket resolution workstation:
  - Ticket thread with canned response library.
  - Embedded class/doubt context.
  - "Propose Batch Move" action modal (routes to Admin approval).
  - "Propose Validity Extension" action modal.
  - "Unlock Account / Resend Password" trigger.
  - Internal agent notes and activity audit history.
- `/support/students` — Student 360 directory: search any learner to inspect complete profile, attendance %, test grades, payment status, and doubt history.
- `/support/analytics` — Ticket volume trends, common issue categories, escalation rates.

---

## 6. Permissions & Role-Based Access Matrix

| Feature / Domain Area | Super Admin | Admin | Teacher | Student | Evaluator | Support |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Platform Settings & Integrations | Full | Denied | Denied | Denied | Denied | Denied |
| LLM Token & Cost Monitoring | Full | Denied | Denied | Denied | Denied | Denied |
| User Impersonation ("View As") | Full | Denied | Denied | Denied | Denied | Denied |
| Course & Batch Creation | Full | Full | Read Only | Denied | Denied | Denied |
| Batch Entitlement Configuration | Full | Full | Denied | View Own | Denied | Propose Only |
| Live Class Broadcasting | Full | Monitor | Host | Attend (Live) | Denied | Monitor |
| Post-Class AI Chapter Editing | Full | Full | Author | View Only | Denied | Denied |
| Timestamp Doubt Resolution | Full | Full | Primary | Ask / View Own | Read Only | Assist / Escalate |
| Submission Grading & Rubrics | Full | Full | View / Edit | View Own Score | Primary Grader | View Only |
| Student 360 Full Profile | Full | Full | Batch Roster | Own Profile | Masked / Anonymized | Full View (No Edit) |
| Payment Gateway & Invoicing | Full | Full | Denied | Own Receipts | Denied | Read Only |
| Audit Trail Inspection | Full | Denied | Denied | Denied | Denied | Ticket History |

---

## 7. Shared Component System & Interaction Patterns

1. **`DashboardLayout`:** Dual-mode layout with fixed desktop sidebar (`w-72`), sticky mobile header, mobile drawer, and floating glass bottom dock.
2. **`StatCard`:** Responsive metric card with spring animation, trend pill, and gradient icon badge.
3. **`AdaptiveDataTable`:** Auto-switches between rich desktop table with sortable columns and touch-friendly mobile cards (`sm:hidden` vs `hidden sm:block`).
4. **`CommandPalette` (`Ctrl/Cmd+K`):** Global fuzzy search searching routes, courses, batches, classes, and actions with keyboard navigation.
5. **`KeyboardShortcutsDialog` (`?`):** Global shortcuts cheat sheet.
6. **`NotificationCenter`:** Interactive popover with unread counter, filter by category, and "Mark all as read".
7. **`ThemeToggle` & `ThemeAccentPicker`:** Instant runtime switching between Light/Dark mode and 5 accent presets.
8. **`GroundedAiTutor`:** Embedded drawer with source citations, clickable timestamp chips, transcript snippet preview, and human teacher escalation.
9. **`SmartVideoPlayer`:** Custom video player with playback speeds (0.5x, 1x, 1.25x, 1.5x, 2x), chapter markers on progress bar, and doubt anchoring button.
10. **`RubricGrader`:** Accessible scoring sliders with automatic total calculation and draft saving.
11. **`Student360Drawer`:** Comprehensive slide-over profile showing academic progress, attendance percentage, active doubts, and recent tickets.
12. **`DeviceCheckModal`:** Camera, microphone, and speaker test interface before entering live classroom.
13. **`EmptyState`:** Reusable empty state illustration with title, description, and primary CTA.
14. **`LoadingSkeleton`:** Content-aware pulsing skeleton loaders for cards, tables, and player views.

---

## 8. Mobile Touch Ergonomics & Accessibility

- **Touch Target Sizing:** Minimum 44x44px for all clickable buttons, tabs, and avatar triggers.
- **Haptic Vibration:** `navigator.vibrate(15)` invoked on primary bottom nav switches and FAB actions.
- **Pull-to-Refresh:** Smooth gesture-based pull-to-refresh wrapper on dashboard feeds.
- **Safe Area Insets:** Fixed bottom dock and floating FAB include safe-area margin and padding (`pb-28 sm:pb-32 lg:pb-10`).
- **WCAG 2.1 AA Compliance:** Minimum 4.5:1 text contrast in both light and dark themes. High contrast focus rings for keyboard users.
- **Screen Reader Support:** Semantic HTML elements (`<header>`, `<aside>`, `<main>`, `<nav>`), `aria-live` regions for notifications, and `aria-label` attributes on icon-only buttons.
