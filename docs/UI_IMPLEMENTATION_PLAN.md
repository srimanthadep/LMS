# AI-First Live Learning Management System (LMS)
## Master UI Implementation Plan

**Document Version:** 1.0.0  
**Status:** Executable Engineering Plan  
**Target Architecture:** React 18+ / Vite / TypeScript / Tailwind CSS / Radix UI / Framer Motion / Lucide Icons  

---

## 1. Current Repository Assessment & Baseline

- **Initial State:** Directory `c:\Users\srima\Desktop\LMS` contained `bento.png` and `design.md`.
- **Tooling Environment:** Node.js v24.21.0, npm 11.19.0, Python 3.14.7.
- **Decision:** Initialize a high-performance React + TypeScript application using Vite in the workspace root, install the dependencies specified in `design.md`, configure Tailwind CSS tokens with HSL variables, and build the full-scale LMS architecture.

---

## 2. Directory & Architecture Layout

```
LMS/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── docs/
│   ├── RESEARCH_NOTES.md
│   ├── UI_IMPLEMENTATION_SPEC.md
│   ├── UI_IMPLEMENTATION_PLAN.md
│   └── UI_PAGE_MATRIX.md
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── lib/
    │   └── utils.ts
    ├── types/
    │   ├── auth.ts
    │   ├── lms.ts
    │   └── navigation.ts
    ├── services/
    │   ├── themeService.ts
    │   └── mockDataService.ts
    ├── context/
    │   ├── AuthContext.tsx
    │   └── NotificationContext.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── DashboardLayout.tsx
    │   │   ├── MobileTopHeader.tsx
    │   │   ├── DesktopSidebar.tsx
    │   │   ├── MobileBottomDock.tsx
    │   │   └── DevRoleSwitcher.tsx
    │   ├── ui/
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── badge.tsx
    │   │   ├── input.tsx
    │   │   ├── dialog.tsx
    │   │   ├── sheet.tsx
    │   │   ├── tabs.tsx
    │   │   ├── tooltip.tsx
    │   │   ├── popover.tsx
    │   │   ├── select.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── CommandPalette.tsx
    │   │   ├── KeyboardShortcutsDialog.tsx
    │   │   ├── FloatingActionButton.tsx
    │   │   ├── PullToRefresh.tsx
    │   │   ├── StatCard.tsx
    │   │   ├── EmptyState.tsx
    │   │   └── LoadingSkeleton.tsx
    │   ├── shared/
    │   │   ├── GroundedAiTutor.tsx
    │   │   ├── SmartVideoPlayer.tsx
    │   │   ├── DeviceCheckModal.tsx
    │   │   ├── RubricGrader.tsx
    │   │   ├── Student360Drawer.tsx
    │   │   └── DoubtSubmissionModal.tsx
    │   └── notifications/
    │       ├── NotificationCenter.tsx
    │       └── AnimatedNotificationIcon.tsx
    └── pages/
        ├── auth/
        │   ├── LoginPage.tsx
        │   ├── ResetPasswordPage.tsx
        │   └── TwoFactorPage.tsx
        ├── super-admin/
        │   ├── SuperAdminDashboard.tsx
        │   ├── UserAdminPage.tsx
        │   ├── RolePermissionsPage.tsx
        │   ├── IntegrationsPage.tsx
        │   ├── UsageCostsPage.tsx
        │   ├── AuditLogsPage.tsx
        │   └── DataRetentionPage.tsx
        ├── admin/
        │   ├── AdminDashboard.tsx
        │   ├── CoursesListPage.tsx
        │   ├── CourseDetailPage.tsx
        │   ├── BatchesListPage.tsx
        │   ├── BatchDetailPage.tsx
        │   ├── TeachersListPage.tsx
        │   ├── StudentsDirectoryPage.tsx
        │   ├── ScheduleCalendarPage.tsx
        │   ├── LiveMonitorPage.tsx
        │   ├── PaymentsInvoicesPage.tsx
        │   ├── CertificatesPage.tsx
        │   └── AnnouncementsPage.tsx
        ├── teacher/
        │   ├── TeacherDashboard.tsx
        │   ├── TeacherSchedulePage.tsx
        │   ├── TeacherClassroomPage.tsx
        │   ├── RecordingReviewPage.tsx
        │   ├── ResourcesUploadPage.tsx
        │   ├── DoubtsQueuePage.tsx
        │   ├── TestCreationPage.tsx
        │   └── BatchAnalyticsPage.tsx
        ├── student/
        │   ├── StudentDashboard.tsx
        │   ├── StudentCoursesPage.tsx
        │   ├── StudentSchedulePage.tsx
        │   ├── StudentClassroomPage.tsx
        │   ├── ReplayLibraryPage.tsx
        │   ├── SmartPlayerPage.tsx
        │   ├── StudentDoubtsPage.tsx
        │   ├── TimedTestPage.tsx
        │   ├── TestResultsPage.tsx
        │   ├── StudentCertificatesPage.tsx
        │   └── StudentPaymentsPage.tsx
        ├── evaluator/
        │   ├── EvaluatorDashboard.tsx
        │   ├── SubmissionsQueuePage.tsx
        │   ├── GradingSuitePage.tsx
        │   └── ReEvaluationsPage.tsx
        ├── support/
        │   ├── SupportDashboard.tsx
        │   ├── TicketsInboxPage.tsx
        │   ├── TicketDetailPage.tsx
        │   ├── Student360Page.tsx
        │   └── SupportAnalyticsPage.tsx
        └── common/
            ├── UnauthorizedPage.tsx
            └── NotFoundPage.tsx
```

---

## 3. Milestones & Implementation Sequence

### Milestone 1: Tooling & Design System Foundations
1. Initialize Vite project with React + TypeScript.
2. Install dependencies: Radix UI primitives, Lucide React, Framer Motion, Tailwind CSS, clsx, tailwind-merge, date-fns.
3. Establish `tailwind.config.ts` and `src/index.css` with exact HSL design tokens from `design.md`.
4. Implement `src/services/themeService.ts` with the 5 accents (Ocean, Emerald, Violet, Amber, Rose) and light/dark modes.
5. Create core UI components (`Button`, `Card`, `Input`, `Badge`, `Tabs`, `Dialog`, `Sheet`, `Dropdown`, `CommandPalette`).

### Milestone 2: Application Shell, State & Global Navigation
1. Create `AuthContext` with role switching (Super Admin, Admin, Teacher, Student, Evaluator, Support).
2. Create `NotificationContext` with live unread counts and interactive notifications.
3. Build `DashboardLayout.tsx` conforming to `design.md`:
   - Fixed desktop sidebar (`w-72`).
   - Sticky mobile top header.
   - Mobile sheet navigation drawer.
   - Floating glassmorphic bottom navigation bar with active spring pill indicator.
   - Pull-to-refresh container and mobile FAB.
   - Global keyboard shortcuts (`Ctrl+K` for command palette, `?` for shortcuts dialog).

### Milestone 3: Domain Data Models & Mock Service Layer
1. Define TypeScript interfaces for Courses, Batches, Live Classes, AI Chapters, Transcripts, Doubts, Submissions, Rubrics, Tickets, and Audit Logs.
2. Populate rich, coherent mock datasets reflecting realistic courses (e.g., "Full-Stack AI Engineering", "Deep Learning & LLM Systems", "Agentic Systems Bootcamp").
3. Implement `mockDataService.ts` with synchronous/asynchronous methods for simulated updates (saving draft grades, adding doubts, rescheduling classes, toggling live status).

### Milestone 4: Shared Specialized Features
1. `SmartVideoPlayer`: Interactive video simulator with chapter scrubbing, speed controls, transcript synchronization, and doubt anchor button.
2. `GroundedAiTutor`: Contextual side-drawer with grounded responses citing exact timestamps (`[00:14:22]`), transcript previews, and teacher escalation.
3. `RubricGrader`: Interactive criterion sliders with auto-calculation, blind-grading masking, and AI score recommendation.
4. `DeviceCheckModal`: Hardware check (webcam stream simulator, audio input meter, network latency test).
5. `Student360Drawer`: Slide-over drawer with student attendance, engagement metrics, and academic history.

### Milestone 5: Role-Specific Page Implementations
- **Super Admin:** Platform Overview, User Management, Role Permissions, Integration Connectors, Usage & Cost Monitoring, Audit Trail, Impersonation ("View As").
- **Admin:** Operations Dashboard, Course Catalog, Batch Entitlement Management, Master Timetable, Live Session Monitoring, Razorpay Payments (₹), Certificates, Broadcasts.
- **Teacher:** Faculty Dashboard, Schedule, Live Teaching Studio (chat, polls, "I'm lost" counter), Recording & AI Chapter Editor, Doubt Resolution Desk, Assessment Builder.
- **Student:** Student Home, Courses with Entitlement badges, Live Classroom, Replay Library with Smart Player & AI Tutor, Doubt Tracker, Timed Test Environment, Rubric Results, Certificate Downloads.
- **Evaluator:** Evaluator Dashboard, Submission Queue, Comprehensive Rubric Grading Suite, Re-evaluation Moderation.
- **Support / Mentor:** Support Dashboard, Ticket Inbox with Canned Responses, Ticket Resolution Workstation, Student 360 Explorer, Propose Batch Move / Extension.

### Milestone 6: Quality Assurance, Responsive & Accessibility Validation
1. Type check via `tsc --noEmit`.
2. Production build via `npm run build`.
3. Test all routes on Desktop (1280px+), Tablet (768px), and Mobile (375px/390px).
4. Verify light/dark theme contrast and all 5 accent palettes.
5. Populate `docs/UI_PAGE_MATRIX.md` with verification status.
