import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceCheckModal } from "@/components/shared/DeviceCheckModal";
import { Users } from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Welcome Banner & Top CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" data-purpose="welcome-section">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, Arjun! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enrolled in <span className="font-semibold text-slate-700 dark:text-slate-300">Cohort 7 (Live + Replay)</span> • Apex AI Systems Program
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          {/* Join Live Class Button */}
          <button
            onClick={() => setDeviceModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e11d48] text-white hover:bg-[#be123c] font-medium text-xs md:text-sm shadow-xs transition-colors cursor-pointer"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="12" rx="2" width="14" x="2" y="6"></rect>
              <path d="M16 10l6-4v12l-6-4"></path>
            </svg>
            Join Live Class
          </button>

          {/* Resume Last Lecture Button */}
          <button
            onClick={() => navigate("/student/replays/rep-rag-8")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-muted/50 hover:border-slate-300 font-medium text-xs md:text-sm shadow-2xs transition-colors cursor-pointer"
            type="button"
          >
            <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Resume Last Lecture
          </button>
        </div>
      </div>

      {/* BEGIN: 4 Metrics Summary Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="metrics-summary">
        {/* Metric Card 1: Live Attendance Rate (Dark Green Hero Card) */}
        <div className="p-5 rounded-2xl hero-card-pattern text-white relative shadow-sm flex flex-col justify-between min-h-[170px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-800/60 border border-emerald-600/30 flex items-center justify-center text-emerald-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </span>
              <span className="text-xs font-semibold text-emerald-100">Live Attendance Rate</span>
            </div>
            {/* Arrow Link Icon */}
            <button
              onClick={() => navigate("/student/schedule")}
              className="w-7 h-7 rounded-full bg-emerald-800/40 hover:bg-emerald-700/50 flex items-center justify-center text-emerald-300 transition-colors cursor-pointer"
              title="View live schedule"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          <div className="my-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">88%</span>
            <span className="inline-flex items-center text-emerald-400 text-xs font-semibold">
              <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-800/50">
            <span className="text-emerald-300/90 font-medium">Eligible for certificate</span>
            <span className="text-emerald-200/70">14 of 16 lectures attended</span>
          </div>
        </div>

        {/* Metric Card 2: Replay Watch Hours */}
        <div className="p-5 rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-border/80 shadow-2xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Replay Watch Hours</span>
            </div>
            <button
              onClick={() => navigate("/student/replays")}
              className="w-7 h-7 rounded-full bg-slate-50 dark:bg-muted/40 hover:bg-slate-100 dark:hover:bg-muted/70 flex items-center justify-center text-slate-400 cursor-pointer transition-colors"
              title="Open Replay Library"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          <div className="my-1 flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">42.5</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">hrs</span>
            </div>
            {/* Mini decorative bar chart */}
            <div className="flex items-end gap-1 h-6 pb-0.5">
              <div className="w-1.5 h-2.5 bg-emerald-100 dark:bg-emerald-900/60 rounded-xs"></div>
              <div className="w-1.5 h-4 bg-emerald-200 dark:bg-emerald-800/60 rounded-xs"></div>
              <div className="w-1.5 h-3.5 bg-emerald-300 dark:bg-emerald-700/60 rounded-xs"></div>
              <div className="w-1.5 h-5 bg-emerald-400 dark:bg-emerald-600/60 rounded-xs"></div>
              <div className="w-1.5 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-xs"></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              +5.2 hrs this week
            </span>
            <span className="text-slate-400">Lecture transcripts studied</span>
          </div>
        </div>

        {/* Metric Card 3: My Doubts Cleared */}
        <div className="p-5 rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-border/80 shadow-2xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" x2="12.01" y1="17" y2="17"></line>
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">My Doubts Cleared</span>
            </div>
            <button
              onClick={() => navigate("/student/doubts")}
              className="w-7 h-7 rounded-full bg-slate-50 dark:bg-muted/40 hover:bg-slate-100 dark:hover:bg-muted/70 flex items-center justify-center text-slate-400 cursor-pointer transition-colors"
              title="Open Doubts Desk"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          <div className="my-1 flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">4</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">Doubts</span>
            </div>
            {/* Soft Chat Bubbles Graphic */}
            <div className="text-slate-200 dark:text-emerald-950/60">
              <svg className="w-8 h-8 fill-emerald-100 dark:fill-emerald-950/80 text-emerald-200 dark:text-emerald-800" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% resolved</span>
            <span className="text-slate-400">Grounded AI & Faculty</span>
          </div>
        </div>

        {/* Metric Card 4: Milestone GPA */}
        <div className="p-5 rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-border/80 shadow-2xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Milestone GPA</span>
            </div>
            <button
              onClick={() => navigate("/student/assessments")}
              className="w-7 h-7 rounded-full bg-slate-50 dark:bg-muted/40 hover:bg-slate-100 dark:hover:bg-muted/70 flex items-center justify-center text-slate-400 cursor-pointer transition-colors"
              title="Open Assessments"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          <div className="my-1 flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">95</span>
              <span className="text-base font-bold text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
            {/* Mini vertical bar chart illustration */}
            <div className="flex items-end gap-1 h-6 pb-0.5">
              <div className="w-1.5 h-3 bg-emerald-100 dark:bg-emerald-900/60 rounded-xs"></div>
              <div className="w-1.5 h-4.5 bg-emerald-200 dark:bg-emerald-800/60 rounded-xs"></div>
              <div className="w-1.5 h-6 bg-emerald-400 dark:bg-emerald-500 rounded-xs"></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Distinction Track</span>
            <span className="text-slate-400">Evaluated by faculty rubrics</span>
          </div>
        </div>
      </section>
      {/* END: 4 Metrics Summary Cards Grid */}

      {/* BEGIN: Live Session Callout Banner */}
      <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fff1f2] via-[#ffe4e6] to-[#fff1f2] dark:from-rose-950/40 dark:via-rose-900/25 dark:to-rose-950/30 border border-[#fecdd3] dark:border-rose-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden shadow-2xs" data-purpose="live-session-alert">
        {/* Abstract wave background SVG lines */}
        <div className="absolute right-36 top-0 bottom-0 pointer-events-none opacity-40 hidden lg:block">
          <svg className="h-full w-64 text-rose-300 dark:text-rose-700" fill="none" viewBox="0 0 200 80">
            <path d="M0 40 Q50 10, 100 40 T200 40" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
            <path d="M0 50 Q50 20, 100 50 T200 50" fill="none" stroke="currentColor" strokeWidth="1"></path>
            <path d="M0 30 Q50 60, 100 30 T200 30" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          </svg>
        </div>
        <div className="relative z-10 space-y-1.5">
          {/* Live Status Tags */}
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#9f1239] text-rose-100">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              LIVE NOW
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">72 Classmates Online</span>
          </div>
          {/* Session Title & Instructor */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Session 4: Multi-Agent Consensus & Hierarchical Supervision
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Instructor: <span className="font-medium text-slate-800 dark:text-slate-100">Prof. Rajesh Verma</span> • Agentic Systems Bootcamp
          </p>
        </div>
        {/* Join Button */}
        <div className="relative z-10 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setDeviceModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <svg className="w-4 h-4 text-rose-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="12" rx="2" width="14" x="2" y="6"></rect>
              <path d="M16 10l6-4v12l-6-4"></path>
            </svg>
            Pre-Join Check & Enter  →
          </button>
        </div>
      </section>
      {/* END: Live Session Callout Banner */}

      {/* BEGIN: Two-Column Lower Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" data-purpose="dashboard-two-columns">
        {/* Left Column (Programs & Resume): ~60% Width (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Enrolled Programs & Progress Card */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-200/80 dark:border-border/80 p-5 shadow-2xs" data-purpose="enrolled-programs-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Enrolled Programs & Progress</h3>
                  <p className="text-[11px] text-slate-400">Track your curriculum milestone completion and access entitlements</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
              >
                View Details  →
              </button>
            </div>

            {/* Program Inner Item */}
            <div className="p-4 rounded-xl border border-slate-100 dark:border-border/60 bg-[#fbfdfc] dark:bg-muted/10 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {/* Course Graphic / Illustration Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-[#4c0519] flex items-center justify-center shrink-0 border border-rose-900/40 relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-radial from-rose-500/20 to-transparent"></div>
                  {/* Mini stylized terminal/computer vector */}
                  <svg className="w-9 h-9 text-rose-400 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <rect height="14" rx="2" width="20" x="2" y="3"></rect>
                    <line x1="8" x2="16" y1="21" y2="21"></line>
                    <line x1="12" x2="12" y1="17" y2="21"></line>
                    <path d="M7 8l3 3-3 3M13 14h4"></path>
                  </svg>
                </div>
                {/* Course Description & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Full-Stack AI & LLM Systems Engineering</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                      Live + Replay Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Cohort 7 (Weekday Evening) • Lead Faculty: Prof. Rajesh Verma
                  </p>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">Course Progress</span>
                      <span className="font-semibold text-rose-800 dark:text-rose-400 text-[11px]">68% Completed</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-muted rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#e11d48] to-[#be123c] h-full rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Bottom Footer Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-border/60 text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  Access valid until <span className="font-medium text-slate-700 dark:text-slate-300">31 Dec 2026</span>
                </span>
                <button
                  onClick={() => navigate("/student/courses/course-ai-eng")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white text-[11px] font-semibold transition-colors cursor-pointer"
                  type="button"
                >
                  Open Syllabus  →
                </button>
              </div>
            </div>
          </div>

          {/* Resume Where You Left Off Card */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-200/80 dark:border-border/80 p-5 shadow-2xs" data-purpose="resume-lecture-card">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Resume Where You Left Off</h3>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-muted/60 px-2.5 py-1 rounded-full">
                ⏱ Paused at 00:24:18
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 ml-10">
              Lecture 8: Vector Databases, Chunking Strategies & Embedding Alignment (HNSW Graph Construction chapter)
            </p>

            {/* Video Thumbnail & Play Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-3 bg-slate-50 dark:bg-muted/20 rounded-xl border border-slate-100 dark:border-border/60">
              {/* Video Preview Thumbnail with Mock Code/Graph and Play Overlay */}
              <div
                onClick={() => navigate("/student/replays/rep-rag-8")}
                className="relative w-full sm:w-40 h-24 bg-slate-900 rounded-lg overflow-hidden shrink-0 flex items-center justify-center group cursor-pointer shadow-inner"
              >
                {/* Mock Code Background Simulation */}
                <div className="absolute inset-0 p-2 text-[8px] font-mono text-emerald-400/50 leading-tight select-none overflow-hidden opacity-70">
                  import faiss<br />
                  index = faiss.IndexHNSWFlat(d, 32)<br />
                  index.hnsw.efSearch = 64<br />
                  index.add(xb)<br />
                  D, I = index.search(xq, k)
                </div>
                {/* Play Circle Overlay */}
                <div className="relative z-10 w-9 h-9 rounded-full bg-slate-800/80 group-hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>

              {/* Resume Button Description */}
              <div className="flex-1 flex flex-col justify-center">
                <button
                  onClick={() => navigate("/student/replays/rep-rag-8")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-muted/50 border border-slate-200 dark:border-border text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-all w-full sm:w-auto self-start cursor-pointer"
                  type="button"
                >
                  <svg className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 fill-current" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Resume at 00:24:18 <span className="text-emerald-700 dark:text-emerald-400 font-medium">with AI Tutor</span></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Doubts & Milestone GPA): ~40% Width (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Doubts Card */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-200/80 dark:border-border/80 p-5 shadow-2xs" data-purpose="recent-doubts-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" x2="12.01" y1="17" y2="17"></line>
                  </svg>
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Doubts</h3>
              </div>
              <button
                onClick={() => navigate("/student/doubts")}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
              >
                All Doubts  →
              </button>
            </div>

            {/* Doubts List */}
            <div className="space-y-3">
              {/* Doubt Item 1 */}
              <div
                onClick={() => navigate("/student/doubts")}
                className="p-3 rounded-xl border border-slate-100 dark:border-border/60 hover:border-slate-200 dark:hover:border-border bg-slate-50/60 dark:bg-muted/10 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-card border border-slate-200 dark:border-border px-2 py-0.5 rounded-md">
                    <svg className="w-2.5 h-2.5 fill-current text-slate-600 dark:text-slate-300" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    00:24:18
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                    Answered ✓
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                    “How does the efSearch parameter in HNSW affect latency versus recall during high concurrency?”
                  </p>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 mt-0.5 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>

              {/* Doubt Item 2 */}
              <div
                onClick={() => navigate("/student/doubts")}
                className="p-3 rounded-xl border border-slate-100 dark:border-border/60 hover:border-slate-200 dark:hover:border-border bg-slate-50/60 dark:bg-muted/10 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-card border border-slate-200 dark:border-border px-2 py-0.5 rounded-md">
                    <svg className="w-2.5 h-2.5 fill-current text-slate-600 dark:text-slate-300" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    00:20:00
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                    Answered ✓
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                    “Can an interrupt in LangGraph persist across server restarts if the client disconnects?”
                  </p>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 mt-0.5 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Result Card */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-200/80 dark:border-border/80 p-5 shadow-2xs" data-purpose="milestone-result-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Milestone Result</h3>
            </div>

            {/* Inner Soft Green Evaluation Box */}
            <div className="p-4 rounded-xl bg-[#f2f8f5] dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 mb-3 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">Milestone 2: Hybrid RAG System</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">95</span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">/ 100</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-lg bg-white dark:bg-card border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
                Evaluator feedback: <span className="italic text-slate-700 dark:text-slate-300">“Production grade separation of dense retrieval.”</span>
              </p>
            </div>

            {/* Full-width View Rubric Button */}
            <button
              onClick={() => navigate("/student/results/test-rag-eval")}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-border text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors text-center cursor-pointer"
              type="button"
            >
              View Full Rubric & Feedback
            </button>
          </div>

          {/* 1:1 Faculty Mentoring & Advising Card */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-200/80 dark:border-border/80 p-5 shadow-2xs space-y-3.5" data-purpose="mentoring-quick-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-[#e11d48] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Faculty Mentor</h3>
              </div>
              <button
                onClick={() => navigate("/student/mentors")}
                className="text-xs font-semibold text-[#e11d48] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                All Mentors  →
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-border/60 bg-slate-50/60 dark:bg-muted/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-bold text-xs ring-1 ring-[#e11d48]/30">
                  RV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Prof. Rajesh Verma</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Lead AI Chair • Next open slot: Friday 05:00 PM</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/student/mentors")}
                className="px-3 py-1.5 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
              >
                Book 1:1 Slot
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* END: Two-Column Lower Content Area */}

      {/* Pre-Join Hardware Check Modal */}
      <DeviceCheckModal
        open={deviceModalOpen}
        onOpenChange={setDeviceModalOpen}
        targetClassId="class-agentic-101"
        classTitle="Session 4: Multi-Agent Consensus & Hierarchical Supervision"
      />
    </div>
  );
};
export default StudentDashboard;
