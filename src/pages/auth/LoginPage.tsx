import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Terminal,
  Code2,
  Database,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeAccentPicker } from "@/components/ui/ThemeAccentPicker";
import { cn } from "@/lib/utils";

interface DemoAccount {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  roleLabel: string;
  badge: string;
  description: string;
  targetDashboard: string;
  initial: string;
  features: string[];
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "student",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    password: "password123",
    roleLabel: "Student",
    badge: "Cohort 7 (Live + Replay)",
    description: "Full-Stack AI & LLM Systems Engineering student with live class access and AI doubts desk.",
    targetDashboard: "/student/dashboard",
    initial: "A",
    features: ["Live Stream Check", "Smart Replays", "Grounded Doubts", "Milestones"],
  },
  {
    role: "teacher",
    name: "Prof. Rajesh Verma",
    email: "rajesh.verma@edulms.ai",
    password: "password123",
    roleLabel: "Faculty",
    badge: "Lead AI Systems Faculty",
    description: "Broadcast studio broadcaster, AI chapter review tool, and timestamped doubts queue.",
    targetDashboard: "/teacher/dashboard",
    initial: "R",
    features: ["Studio Broadcast", "Whisper Markers", "Doubts Queue", "Quiz Authoring"],
  },
  {
    role: "admin",
    name: "Ananya Iyer",
    email: "ananya.ops@edulms.ai",
    password: "password123",
    roleLabel: "Academic Admin",
    badge: "Academic Operations Hub",
    description: "Course schedules, batch enrollments, teacher assignments, and fee receipts in ₹.",
    targetDashboard: "/admin/dashboard",
    initial: "A",
    features: ["Cohort Capacity", "Class Timetable", "Tuition (₹)", "Certificates"],
  },
  {
    role: "super-admin",
    name: "Dr. Vikram Sethi",
    email: "dr.vikram@edulms.ai",
    password: "password123",
    roleLabel: "Super Admin",
    badge: "Platform Owner",
    description: "Cluster infrastructure, LLM token quotas, tenant security, and audit logging.",
    targetDashboard: "/super-admin/dashboard",
    initial: "V",
    features: ["Token Quotas", "Platform Health", "RBAC Matrix", "View-As Simulator"],
  },
  {
    role: "evaluator",
    name: "Kavita Rao",
    email: "kavita.eval@edulms.ai",
    password: "password123",
    roleLabel: "Evaluator",
    badge: "Rubrics & Grading SLA",
    description: "Blind grading workstation with criteria matrices and AI score proposals.",
    targetDashboard: "/evaluator/dashboard",
    initial: "K",
    features: ["Rubric Matrix", "AI Proposals", "Blind Grading", "24h SLA Timers"],
  },
  {
    role: "support",
    name: "Nikhil Joshi",
    email: "nikhil.mentor@edulms.ai",
    password: "password123",
    roleLabel: "Support",
    badge: "Student 360° Desk",
    description: "Student inquiries, batch transfers, validity extensions, and ticket inbox.",
    targetDashboard: "/support/dashboard",
    initial: "N",
    features: ["Student 360", "Ticket SLA", "Batch Shifts", "Extensions"],
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("arjun.m@learner.ai");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [skipTwoFactor, setSkipTwoFactor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"client" | "classroom" | "vector">("client");
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.role === selectedRole) || DEMO_ACCOUNTS[0];

  const handleSelectRole = (acc: DemoAccount) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleCopyCredentials = (acc: DemoAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${acc.email} | ${acc.password}`);
    setCopiedRole(acc.role);
    setTimeout(() => setCopiedRole(null), 1800);
  };

  const handleDirectLogin = (acc: DemoAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      switchRole(acc.role);
      if (!skipTwoFactor && DEMO_USERS[acc.role]?.twoFactorEnabled) {
        navigate(`/2fa?role=${acc.role}`);
      } else {
        navigate(acc.targetDashboard);
      }
    }, 450);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDirectLogin(selectedAccount);
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfdfc] dark:bg-[#0c120f] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-sans">
      {/* Top Utility Bar */}
      <nav className="w-full border-b border-slate-200/80 dark:border-white/10 px-6 sm:px-10 h-16 flex items-center justify-between bg-white/70 dark:bg-[#0c120f]/70 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0e3b26] flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950/20">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m21.12 6.4-8.8-4.9a2.3 2.3 0 0 0-2.24 0l-8.8 4.9A2.3 2.3 0 0 0 .16 8.4v9.2a2.3 2.3 0 0 0 1.12 2l8.8 4.9a2.3 2.3 0 0 0 2.24 0l8.8-4.9a2.3 2.3 0 0 0 1.12-2V8.4a2.3 2.3 0 0 0-1.12-2z"></path>
              <path d="M12 22V12"></path>
              <path d="m21 7-9 5-9-5"></path>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Apex LMS</span>
          <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">/</span>
          <span className="hidden sm:inline-block text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            Live AI Platform
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All 6 Roles Ready for Testing</span>
          </div>
          <ThemeToggle />
          <ThemeAccentPicker />
        </div>
      </nav>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)]">
        {/* Left Column: Supabase-Style Minimal Auth Form */}
        <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-6 lg:py-8">
          <div className="max-w-[420px] w-full mx-auto space-y-5">
            {/* Form Header */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Sign in to your Apex LMS organization account.
              </p>
            </div>

            {/* Quick Demo Switcher Tabs */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121c17] border border-slate-200/90 dark:border-emerald-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-emerald-600 dark:text-emerald-400 fill-current" />
                  Quick Demo Accounts
                </span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  1-Click Select
                </span>
              </div>

              {/* Persona Chips */}
              <div className="grid grid-cols-3 gap-1.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = selectedRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectRole(acc)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border truncate",
                        isSelected
                          ? "bg-[#0e3b26] text-white border-[#0e3b26] shadow-xs"
                          : "bg-white dark:bg-card border-slate-200 dark:border-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-muted"
                      )}
                      title={`${acc.name} (${acc.roleLabel})`}
                    >
                      {acc.roleLabel}
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Persona Highlight Banner */}
              <div className="pt-2 border-t border-slate-200/70 dark:border-emerald-900/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#0e3b26] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {selectedAccount.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedAccount.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{selectedAccount.badge}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDirectLogin(selectedAccount)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  Enter ⚡
                </button>
              </div>
            </div>

            {/* OAuth / Social Providers Buttons (Supabase Style) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDirectLogin(selectedAccount)}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] hover:bg-slate-50 dark:hover:bg-[#1a2721] text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer group"
              >
                {/* GitHub Vector Icon */}
                <svg className="w-4 h-4 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleDirectLogin(selectedAccount)}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] hover:bg-slate-50 dark:hover:bg-[#1a2721] text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
              >
                {/* Google Multi-color Logo */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-white/10 w-full" />
              <span className="bg-[#fcfdfc] dark:bg-[#0c120f] px-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
                or sign in with email
              </span>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-xs rounded-xl bg-white dark:bg-[#141e19] border-slate-200 dark:border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 dark:text-white"
                    placeholder="you@domain.ai"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleCopyCredentials(selectedAccount, e)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Copy demo credentials"
                  >
                    {copiedRole === selectedAccount.role ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/reset-password"
                    className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 text-xs pr-10 rounded-xl bg-white dark:bg-[#141e19] border-slate-200 dark:border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 dark:text-white font-mono"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Checkboxes row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:bg-card dark:border-white/10"
                  />
                  <span>Remember me for 30 days</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none text-emerald-700 dark:text-emerald-400 font-medium">
                  <input
                    type="checkbox"
                    checked={skipTwoFactor}
                    onChange={(e) => setSkipTwoFactor(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:bg-card dark:border-white/10"
                  />
                  <span>Skip 2FA (Fast QA)</span>
                </label>
              </div>

              {/* Primary Sign In Button (Supabase Vibrant Emerald Accent) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[#0e3b26] hover:bg-[#0a2e1d] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in to {selectedAccount.roleLabel}...
                  </span>
                ) : (
                  <>
                    <span>Sign In to {selectedAccount.roleLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom SSO / Sign Up Links */}
            <div className="text-center pt-1.5 space-y-1.5 border-t border-slate-100 dark:border-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Need enterprise SSO or SAML 2.0?{" "}
                <span
                  onClick={() => handleDirectLogin(selectedAccount)}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Sign in with SSO
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Protected by Cloudflare Turnstile, WebAuthn MFA, and SOC2 Type II compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Supabase-Style Dark Terminal & Feature Showcase */}
        <div className="hidden lg:flex w-full lg:w-[52%] xl:w-[55%] bg-[#08120e] dark:bg-[#050b08] p-8 lg:p-12 border-l border-slate-200/60 dark:border-emerald-950/40 relative overflow-hidden flex-col justify-between text-white">
          {/* Subtle Ambient Radial Lighting Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

          {/* Top Tag & Header */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Apex AI Institute — Platform Engine v2.4
            </div>

            <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight">
              The AI-first live learning platform built for scale.
            </h2>
            <p className="text-xs xl:text-sm text-emerald-100/70 max-w-xl leading-relaxed">
              Synchronous WebRTC lecture studio, sub-second grounded vector queries across lecture transcripts, and automated grading SLA orchestration.
            </p>
          </div>

          {/* Code Terminal Box (Iconic Supabase / Developer Experience Vibe) */}
          <div className="relative z-10 my-6 rounded-2xl bg-[#0d1c15] border border-emerald-900/50 shadow-2xl overflow-hidden font-mono text-xs">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a1711] border-b border-emerald-900/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-[11px] text-emerald-400/60 font-semibold">apex-sdk-stream.ts</span>
              </div>

              {/* Code Tab Switcher */}
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("client")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-colors cursor-pointer",
                    activeCodeTab === "client" ? "bg-emerald-900/60 text-emerald-200" : "text-emerald-400/60 hover:text-emerald-200"
                  )}
                >
                  Client SDK
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("classroom")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-colors cursor-pointer",
                    activeCodeTab === "classroom" ? "bg-emerald-900/60 text-emerald-200" : "text-emerald-400/60 hover:text-emerald-200"
                  )}
                >
                  Classroom
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("vector")}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-colors cursor-pointer",
                    activeCodeTab === "vector" ? "bg-emerald-900/60 text-emerald-200" : "text-emerald-400/60 hover:text-emerald-200"
                  )}
                >
                  Faiss RAG
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 sm:p-5 text-emerald-300/90 leading-relaxed overflow-x-auto">
              {activeCodeTab === "client" && (
                <pre className="text-[11px] leading-5 font-mono select-none">
                  <span className="text-emerald-500/60">// 1. Initialize authenticated Apex LMS client</span><br />
                  <span className="text-purple-400">import</span> &#123; createApexClient &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@apex/lms'</span><br /><br />
                  <span className="text-purple-400">const</span> apex = <span className="text-blue-400">createApexClient</span>(&#123;<br />
                  &nbsp;&nbsp;user: <span className="text-emerald-300">'{selectedAccount.email}'</span>,<br />
                  &nbsp;&nbsp;role: <span className="text-emerald-300">'{selectedAccount.role}'</span>,<br />
                  &nbsp;&nbsp;telemetry: <span className="text-amber-400">true</span>,<br />
                  &#125;)<br /><br />
                  <span className="text-emerald-500/60">// 2. Connected to live session</span><br />
                  <span className="text-purple-400">const</span> session = <span className="text-purple-400">await</span> apex.classroom.<span className="text-blue-400">connect</span>(<span className="text-emerald-300">'class-agentic-101'</span>)<br />
                  <span className="text-cyan-300">console</span>.<span className="text-blue-400">log</span>(<span className="text-emerald-300">`Active Viewers: $&#123;session.viewerCount&#125;`</span>)
                </pre>
              )}

              {activeCodeTab === "classroom" && (
                <pre className="text-[11px] leading-5 font-mono select-none">
                  <span className="text-emerald-500/60">// Synchronous WebRTC Live Studio node</span><br />
                  <span className="text-purple-400">const</span> studio = <span className="text-purple-400">await</span> apex.studio.<span className="text-blue-400">createBroadcast</span>(&#123;<br />
                  &nbsp;&nbsp;sessionId: <span className="text-emerald-300">'class-agentic-101'</span>,<br />
                  &nbsp;&nbsp;instructor: <span className="text-emerald-300">'Prof. Rajesh Verma'</span>,<br />
                  &nbsp;&nbsp;asrEngine: <span className="text-emerald-300">'whisper-large-v3'</span>,<br />
                  &nbsp;&nbsp;adaptiveBitrate: &#123; min: <span className="text-amber-400">450</span>, max: <span className="text-amber-400">2400</span> &#125;,<br />
                  &#125;)<br />
                  studio.on(<span className="text-emerald-300">'doubt_raised'</span>, (event) =&gt; alert(event.timestamp))
                </pre>
              )}

              {activeCodeTab === "vector" && (
                <pre className="text-[11px] leading-5 font-mono select-none">
                  <span className="text-emerald-500/60">// Grounded transcript search over FAISS index</span><br />
                  <span className="text-purple-400">const</span> results = <span className="text-purple-400">await</span> apex.vector.<span className="text-blue-400">queryTranscript</span>(&#123;<br />
                  &nbsp;&nbsp;lectureId: <span className="text-emerald-300">'rep-rag-8'</span>,<br />
                  &nbsp;&nbsp;query: <span className="text-emerald-300">'How does efSearch affect recall?'</span>,<br />
                  &nbsp;&nbsp;topK: <span className="text-amber-400">3</span>,<br />
                  &nbsp;&nbsp;groundedPrompt: <span className="text-amber-400">true</span>,<br />
                  &#125;)<br />
                  <span className="text-cyan-300">console</span>.<span className="text-blue-400">log</span>(results[<span className="text-amber-400">0</span>].timestamp) <span className="text-emerald-500/60">// =&gt; "00:24:18"</span>
                </pre>
              )}
            </div>
          </div>

          {/* Social Proof & Metrics Telemetry Footer (Supabase Style) */}
          <div className="relative z-10 pt-4 border-t border-emerald-900/40 grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[10px] text-emerald-400/70 font-mono uppercase">Learners Online</p>
              <p className="text-lg font-bold text-white mt-0.5">892 Active</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400/70 font-mono uppercase">Token Telemetry</p>
              <p className="text-lg font-bold text-white mt-0.5">42.8M Tokens</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400/70 font-mono uppercase">Cluster SLA</p>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">99.98% Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-white/10 px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-[#0c120f]/50 gap-2">
        <span>© 2026 Apex LMS — AI-First Live Cohort Learning System. All rights reserved.</span>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Security Compliance</span>
          <span>•</span>
          <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">SAML SSO</span>
          <span>•</span>
          <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">API Status</span>
        </div>
      </footer>
    </div>
  );
};
export default LoginPage;
