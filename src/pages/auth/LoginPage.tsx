import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  Users,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
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
  subtitle: string;
  description: string;
  targetDashboard: string;
  tag: string;
  tagColor: string;
  keyFeatures: string[];
  initial: string;
  avatarBg: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "student",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    password: "password123",
    roleLabel: "Student / Learner",
    subtitle: "Cohort 7 (Live + Replay Tier)",
    description: "Enrolled in Full-Stack AI & LLM Systems Engineering with live classes, AI doubt solvers, and interactive replays.",
    targetDashboard: "/student/dashboard",
    tag: "Live Learner",
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
    keyFeatures: ["Live Classroom", "Smart Replays", "Grounded AI Doubts", "Milestone Rubrics"],
    initial: "A",
    avatarBg: "bg-[#0e3b26] text-white",
  },
  {
    role: "teacher",
    name: "Prof. Rajesh Verma",
    email: "rajesh.verma@edulms.ai",
    password: "password123",
    roleLabel: "Faculty / Instructor",
    subtitle: "Lead AI Systems Faculty",
    description: "Live broadcasting studio controls, timestamp-anchored doubt queue, and automated AI chapter reviews.",
    targetDashboard: "/teacher/dashboard",
    tag: "Faculty Lead",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
    keyFeatures: ["Live Broadcast Studio", "AI Chapter Markers", "Doubts Queue", "Quiz Authoring"],
    initial: "R",
    avatarBg: "bg-[#093521] text-emerald-300",
  },
  {
    role: "admin",
    name: "Ananya Iyer",
    email: "ananya.ops@edulms.ai",
    password: "password123",
    roleLabel: "Academic Operations Admin",
    subtitle: "Academic Operations Hub",
    description: "Curriculum orchestration, batch timetables, faculty assignments, and Razorpay fee receipts management in ₹.",
    targetDashboard: "/admin/dashboard",
    tag: "Ops Lead",
    tagColor: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60",
    keyFeatures: ["Batches & Cohorts", "Live Timetable", "Tuition Invoices (₹)", "Certificates"],
    initial: "A",
    avatarBg: "bg-[#0d452b] text-white",
  },
  {
    role: "super-admin",
    name: "Dr. Vikram Sethi",
    email: "dr.vikram@edulms.ai",
    password: "password123",
    roleLabel: "Super Administrator",
    subtitle: "Platform Owner & Governance",
    description: "Platform-wide health, LLM token quotas, multi-tenant RBAC permissions, audit trail, and View-As persona simulation.",
    targetDashboard: "/super-admin/dashboard",
    tag: "Platform Owner",
    tagColor: "bg-[#0e3b26] text-emerald-200 border-emerald-700/50",
    keyFeatures: ["Token Cost Analytics", "Cluster Health", "Security Audit Logs", "View-As Simulator"],
    initial: "V",
    avatarBg: "bg-[#062316] text-emerald-400 border border-emerald-500/30",
  },
  {
    role: "evaluator",
    name: "Kavita Rao",
    email: "kavita.eval@edulms.ai",
    password: "password123",
    roleLabel: "Curriculum Evaluator",
    subtitle: "Rubrics & Grading Specialist",
    description: "Blind-graded submission queues, criteria rubrics with AI score proposals, and strict 24-hour SLA turnaround.",
    targetDashboard: "/evaluator/dashboard",
    tag: "Grading SLA",
    tagColor: "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60",
    keyFeatures: ["Rubric Matrix Scoring", "AI Score Proposals", "Blind Anonymization", "Turnaround Timers"],
    initial: "K",
    avatarBg: "bg-[#0a2e1d] text-white",
  },
  {
    role: "support",
    name: "Nikhil Joshi",
    email: "nikhil.mentor@edulms.ai",
    password: "password123",
    roleLabel: "Mentor & Support Lead",
    subtitle: "Student 360° & Success Desk",
    description: "Resolves student inquiries, facilitates cohort batch transfers, validity extensions, and student engagement monitoring.",
    targetDashboard: "/support/dashboard",
    tag: "Student 360°",
    tagColor: "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/60",
    keyFeatures: ["Student 360° Lookup", "Ticket Desk Inbox", "Batch Shifts", "Validity Extensions"],
    initial: "N",
    avatarBg: "bg-[#0d3824] text-white",
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("arjun.m@learner.ai");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [skipTwoFactor, setSkipTwoFactor] = useState(true);
  const [activeTab, setActiveTab] = useState<"demo" | "form">("demo");
  const [filterRole, setFilterRole] = useState<"all" | "academic" | "operations" | "quality">("all");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.role === selectedRole) || DEMO_ACCOUNTS[0];

  const handleSelectRole = (acc: DemoAccount) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleCopyCredentials = (acc: DemoAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Email: ${acc.email} | Password: ${acc.password}`);
    setCopiedAccount(acc.role);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const performLogin = (targetAcc: DemoAccount) => {
    setIsLoading(true);
    setSuccessToast(`Authenticating as ${targetAcc.name} (${targetAcc.roleLabel})...`);

    setTimeout(() => {
      setIsLoading(false);
      switchRole(targetAcc.role);

      // Check if 2FA should be applied or skipped for demo
      if (!skipTwoFactor && DEMO_USERS[targetAcc.role]?.twoFactorEnabled) {
        navigate(`/2fa?role=${targetAcc.role}`);
      } else {
        navigate(targetAcc.targetDashboard);
      }
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(selectedAccount);
  };

  const filteredAccounts = DEMO_ACCOUNTS.filter((acc) => {
    if (filterRole === "academic") return acc.role === "student" || acc.role === "teacher";
    if (filterRole === "operations") return acc.role === "admin" || acc.role === "super-admin";
    if (filterRole === "quality") return acc.role === "evaluator" || acc.role === "support";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#07140e] text-slate-900 dark:text-slate-100 antialiased flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-18 px-6 sm:px-10 border-b border-slate-200/80 dark:border-border/80 bg-white/80 dark:bg-card/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0e3b26] flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950/20">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m21.12 6.4-8.8-4.9a2.3 2.3 0 0 0-2.24 0l-8.8 4.9A2.3 2.3 0 0 0 .16 8.4v9.2a2.3 2.3 0 0 0 1.12 2l8.8 4.9a2.3 2.3 0 0 0 2.24 0l8.8-4.9a2.3 2.3 0 0 0 1.12-2V8.4a2.3 2.3 0 0 0-1.12-2z"></path>
              <path d="M12 22V12"></path>
              <path d="m21 7-9 5-9-5"></path>
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">Apex LMS</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block">AI-First Live Learning Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Demo Environment
          </span>
          <ThemeToggle />
          <ThemeAccentPicker />
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 space-y-8 my-auto">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf5ef] dark:bg-emerald-950/50 text-[#0d4f32] dark:text-emerald-300 border border-[#c3ebcf] dark:border-emerald-800/60 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Role-Based Access Control • 6 Verified Demo Personas
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sign In to Apex LMS Workspace
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Select an account below for <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">1-Click Instant Demo Login</strong>, or use standard credentials to test role-specific workflows and permissions.
          </p>

          {/* Toast Alert */}
          {successToast && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium shadow-md animate-fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>{successToast}</span>
            </div>
          )}
        </div>

        {/* Tab Controls for Mobile/Desktop Switching */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-border/80 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-muted/50 rounded-xl">
            <button
              onClick={() => setActiveTab("demo")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === "demo"
                  ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              🚀 1-Click Demo Accounts (6)
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === "form"
                  ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              🔑 Standard Sign In Form
            </button>
          </div>

          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
          >
            {showCheatSheet ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {showCheatSheet ? "Hide Credentials Table" : "View Credentials Table"}
          </button>
        </div>

        {/* Collapsible Credentials Cheat Sheet */}
        {showCheatSheet && (
          <div className="p-4 rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-border/80 shadow-2xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-border text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Password</th>
                  <th className="py-2 px-3">Direct Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border/60">
                {DEMO_ACCOUNTS.map((acc) => (
                  <tr key={acc.role} className="hover:bg-slate-50 dark:hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{acc.roleLabel}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{acc.name}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">{acc.email}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">password123</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => performLogin(acc)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-200 cursor-pointer"
                      >
                        Enter ⚡
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dynamic Main Body: Demo Cards Grid vs Side-by-Side Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Demo Personas Grid: 7 or 12 cols */}
          <div className={cn("space-y-4", activeTab === "demo" ? "lg:col-span-8" : "hidden lg:block lg:col-span-6")}>
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-2">Filter Roles:</span>
              <button
                onClick={() => setFilterRole("all")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filterRole === "all"
                    ? "bg-[#0e3b26] text-white"
                    : "bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                )}
              >
                All (6)
              </button>
              <button
                onClick={() => setFilterRole("academic")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filterRole === "academic"
                    ? "bg-[#0e3b26] text-white"
                    : "bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                )}
              >
                🎓 Academic (Student, Faculty)
              </button>
              <button
                onClick={() => setFilterRole("operations")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filterRole === "operations"
                    ? "bg-[#0e3b26] text-white"
                    : "bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                )}
              >
                ⚡ Operations (Admin, Super Admin)
              </button>
              <button
                onClick={() => setFilterRole("quality")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filterRole === "quality"
                    ? "bg-[#0e3b26] text-white"
                    : "bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                )}
              >
                📝 Quality (Evaluator, Support)
              </button>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.map((acc) => {
                const isSelected = selectedRole === acc.role;
                const isCopied = copiedAccount === acc.role;

                return (
                  <div
                    key={acc.role}
                    onClick={() => handleSelectRole(acc)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group",
                      isSelected
                        ? "bg-white dark:bg-card border-emerald-600 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-white dark:bg-card border-slate-200/80 dark:border-border/80 hover:border-slate-300 dark:hover:border-border shadow-2xs hover:shadow-xs"
                    )}
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs", acc.avatarBg)}>
                            {acc.initial}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {acc.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {acc.roleLabel}
                            </p>
                          </div>
                        </div>

                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border", acc.tagColor)}>
                          {acc.tag}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3">
                        {acc.description}
                      </p>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {acc.keyFeatures.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-muted text-slate-700 dark:text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-3 border-t border-slate-100 dark:border-border/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {acc.email}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCredentials(acc, e)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                          title="Copy Email & Password"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          performLogin(acc);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e3b26] hover:bg-[#0a2e1d] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        <span>1-Click Login</span>
                        <Zap className="h-3 w-3 text-emerald-300 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sign In Form Column: 4 or 6 cols */}
          <div className={cn("space-y-6", activeTab === "form" ? "lg:col-span-12 max-w-md mx-auto" : "lg:col-span-4")}>
            <Card className="rounded-2xl border border-slate-200/80 dark:border-border/80 shadow-md bg-white dark:bg-card overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-100 dark:border-border/60 bg-gradient-to-b from-[#fbfdfc] dark:from-muted/20 to-transparent">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Authentication Desk
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    RBAC V3.4
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Enter Your Workspace
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Selected role: <strong className="text-slate-800 dark:text-slate-200">{selectedAccount.roleLabel}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Selected Account Capsule */}
                  <div className="p-3 rounded-xl bg-[#f5f8f6] dark:bg-muted/30 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs", selectedAccount.avatarBg)}>
                        {selectedAccount.initial}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{selectedAccount.name}</p>
                        <p className="text-[10px] text-slate-500">{selectedAccount.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active Target
                    </span>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-muted/30 border-slate-200 dark:border-border"
                      placeholder="name@organization.ai"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                        Password
                      </label>
                      <Link
                        to="/reset-password"
                        className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 text-xs pr-10 rounded-xl bg-slate-50 dark:bg-muted/30 border-slate-200 dark:border-border font-mono"
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
                    <p className="text-[10px] text-slate-400">
                      Default demo password: <code className="bg-slate-100 dark:bg-muted px-1.5 py-0.5 rounded font-mono text-slate-600 dark:text-slate-300">password123</code>
                    </p>
                  </div>

                  {/* 2FA Skip Option */}
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={skipTwoFactor}
                        onChange={(e) => setSkipTwoFactor(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-600 dark:text-slate-400 text-xs">
                        Fast demo access (Skip 2FA prompt)
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-[#0e3b26] hover:bg-[#0a2e1d] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Sign In as {selectedAccount.roleLabel}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </CardContent>

              <CardFooter className="p-4 border-t border-slate-100 dark:border-border/60 bg-slate-50/60 dark:bg-muted/10 text-center justify-center">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Protected by Enterprise SAML 2.0 & RBAC Security
                </span>
              </CardFooter>
            </Card>

            {/* Quick Demo Switcher Tip */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#e7f7ee] via-[#ecf9f1] to-[#e4f6eb] dark:from-emerald-950/40 dark:via-emerald-900/30 dark:to-emerald-950/30 border border-[#c3ebcf] dark:border-emerald-800/50 space-y-1.5">
              <h4 className="text-xs font-bold text-[#0d452b] dark:text-emerald-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 fill-current" /> Instant Dev Role Switcher
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Once logged in, you can also switch roles on the fly using the <strong>top utility bar role tabs</strong> without logging out!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-slate-200/80 dark:border-border/80 bg-white dark:bg-card text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full mx-auto gap-2">
        <span>© 2026 Apex LMS — AI-First Live Cohort Learning System. All rights reserved.</span>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Security Policy</span>
          <span>•</span>
          <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">API Status</span>
          <span>•</span>
          <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Documentation</span>
        </div>
      </footer>
    </div>
  );
};
export default LoginPage;
