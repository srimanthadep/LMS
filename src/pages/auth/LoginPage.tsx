import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
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
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "student",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    password: "password123",
    roleLabel: "Student",
    badge: "Cohort 7 (Live + Replay)",
    description: "Full-Stack AI & LLM Systems Engineering student.",
    targetDashboard: "/student/dashboard",
    initial: "A",
  },
  {
    role: "teacher",
    name: "Prof. Rajesh Verma",
    email: "rajesh.verma@edulms.ai",
    password: "password123",
    roleLabel: "Faculty",
    badge: "Lead AI Systems Faculty",
    description: "Broadcast studio broadcaster and doubts queue manager.",
    targetDashboard: "/teacher/dashboard",
    initial: "R",
  },
  {
    role: "admin",
    name: "Ananya Iyer",
    email: "ananya.ops@edulms.ai",
    password: "password123",
    roleLabel: "Admin",
    badge: "Academic Operations Hub",
    description: "Course schedules, batch enrollments, and fee receipts.",
    targetDashboard: "/admin/dashboard",
    initial: "A",
  },
  {
    role: "super-admin",
    name: "Dr. Vikram Sethi",
    email: "dr.vikram@edulms.ai",
    password: "password123",
    roleLabel: "Super Admin",
    badge: "Platform Owner",
    description: "Cluster infrastructure, LLM token quotas, and RBAC.",
    targetDashboard: "/super-admin/dashboard",
    initial: "V",
  },
  {
    role: "evaluator",
    name: "Kavita Rao",
    email: "kavita.eval@edulms.ai",
    password: "password123",
    roleLabel: "Evaluator",
    badge: "Rubrics & Grading SLA",
    description: "Blind grading workstation with criteria matrices.",
    targetDashboard: "/evaluator/dashboard",
    initial: "K",
  },
  {
    role: "support",
    name: "Nikhil Joshi",
    email: "nikhil.mentor@edulms.ai",
    password: "password123",
    roleLabel: "Support",
    badge: "Student 360° Desk",
    description: "Student inquiries, batch transfers, and ticket inbox.",
    targetDashboard: "/support/dashboard",
    initial: "N",
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("arjun.m@learner.ai");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.role === selectedRole) || DEMO_ACCOUNTS[0];

  const handleSelectRole = (acc: DemoAccount) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleDirectLogin = (acc: DemoAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      switchRole(acc.role);
      navigate(acc.targetDashboard);
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDirectLogin(selectedAccount);
  };

  return (
    <div className="min-h-screen h-full flex flex-col bg-[#fafafa] text-slate-900 font-sans selection:bg-[#3ecf8e] selection:text-black antialiased">
      {/* BEGIN: MainHeader */}
      <header className="w-full h-16 flex items-center justify-between px-6 lg:px-8 z-10 bg-white border-b border-[#eaecf0] shrink-0">
        {/* Logo Left */}
        <Link
          to="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
        >
          {/* Supabase SVG Brand Mark with emerald gradient */}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.35 0.5C13.68 0.05 14.39 0.28 14.39 0.85V10.29H22.74C23.36 10.29 23.68 11.03 23.26 11.48L11.08 24.36C10.74 24.71 10.15 24.57 10.01 24.12L7.33 15.65H1.42C0.77 15.65 0.44 14.86 0.9 14.41L13.35 0.5Z"
              fill="url(#supabase-grad)"
            />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="supabase-grad" x1="1.42" x2="23.26" y1="12.5" y2="12.5">
                <stop stopColor="#249361" />
                <stop offset="1" stopColor="#3ECF8E" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-slate-900 font-semibold text-lg tracking-tight">Apex LMS</span>
        </Link>

        {/* Documentation Button Right */}
        <Link
          to="/curriculum"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-2xs"
        >
          <svg
            className="w-3.5 h-3.5 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Documentation</span>
        </Link>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: MainContent */}
      <main className="flex-1 flex w-full">
        {/* BEGIN: LeftFormColumn */}
        <section
          className="w-full lg:w-[48%] flex flex-col justify-center items-center px-6 lg:px-16 py-4 lg:py-6 bg-white"
          data-purpose="auth-container"
        >
          <div className="w-full max-w-[370px] space-y-4">
            {/* Header Text */}
            <div className="space-y-1">
              <h1 className="text-[26px] sm:text-[28px] font-bold text-slate-900 tracking-tight">Welcome back</h1>
              <p className="text-xs sm:text-sm text-slate-500">Sign in to your account</p>
            </div>

            {/* Quick Demo Persona Switcher (Clean Off-White Surface) */}
            <div className="p-2.5 bg-[#f8fafc] border border-slate-200 rounded-md space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px]">
                  <Zap className="w-3 h-3 text-[#e11d48]" />
                  Quick Demo Accounts
                </span>
                <span className="text-[10px] text-[#e11d48] font-mono font-medium">1-Click Select</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = selectedRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectRole(acc)}
                      className={cn(
                        "px-2 py-1.5 text-xs font-medium rounded transition text-center cursor-pointer border truncate",
                        isSelected
                          ? "bg-white text-[#e11d48] border-[#e11d48] shadow-xs ring-1 ring-[#e11d48]/30 font-semibold"
                          : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300"
                      )}
                      title={`${acc.name} (${acc.roleLabel})`}
                    >
                      {acc.roleLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Login Buttons - Continue with Google Only */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleDirectLogin(selectedAccount)}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition shadow-2xs cursor-pointer"
              >
                {/* Multi-color Google G Logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider with 'or' */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-xs text-slate-400">or</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition shadow-2xs"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <Link to="/reset-password" className="text-xs text-slate-500 hover:text-slate-800 transition">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition font-mono shadow-2xs"
                  />
                  {/* Show/Hide Password Eye */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button with 'LAST USED' Badge */}
              <div className="relative pt-1">
                {/* Badge positioned top right of the button */}
                <div className="absolute -top-1.5 right-0 z-10">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/20">
                    {selectedAccount.roleLabel.toUpperCase()}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#e11d48] hover:bg-[#be123c] border border-[#e11d48] text-white text-sm font-medium rounded-md shadow-xs transition focus:outline-none focus:ring-2 focus:ring-[#e11d48] focus:ring-offset-2 focus:ring-offset-white cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? `Signing in to ${selectedAccount.roleLabel}...` : "Sign in"}
                </button>
              </div>
            </form>

            {/* Don't have an account */}
            <div className="text-center pt-0.5">
              <p className="text-xs text-slate-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleDirectLogin(selectedAccount)}
                  className="text-slate-900 font-medium hover:underline underline-offset-2 cursor-pointer bg-transparent border-0 p-0"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Terms and Privacy Policy Disclaimer */}
            <div className="pt-2 text-center">
              <p className="text-[11px] leading-relaxed text-slate-400 max-w-[340px] mx-auto">
                By continuing, you agree to Apex LMS's{" "}
                <a className="underline text-slate-600 hover:text-slate-800" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="underline text-slate-600 hover:text-slate-800" href="#">
                  Privacy Policy
                </a>
                , and to receive periodic emails with updates.
              </p>
            </div>
          </div>
        </section>
        {/* END: LeftFormColumn */}

        {/* BEGIN: RightTestimonialColumn (Off-White & White Surface) */}
        <section
          className="hidden lg:flex w-[52%] border-l border-[#eaecf0] bg-[#f8fafc] relative flex-col justify-center px-16 xl:px-24"
          data-purpose="testimonial-panel"
        >
          <div className="max-w-xl space-y-6">
            {/* Large Quote Icon */}
            <div aria-hidden="true" className="text-slate-300">
              <svg className="w-12 h-12 fill-current opacity-80" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Quote Paragraph tailored to LMS */}
            <blockquote className="text-[26px] leading-[1.35] text-slate-800 font-normal tracking-tight">
              “Apex LMS completely transformed how we teach live AI engineering. The WebRTC studio coupled with instant semantic vector search across lecture transcripts lets our students resolve questions with pinpoint video timestamps in seconds.”
            </blockquote>

            {/* Author Meta */}
            <div className="flex items-center gap-3 pt-2">
              {/* Circular User Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#e11d48]/10 border border-[#e11d48]/20 flex items-center justify-center text-[#e11d48] font-semibold text-sm shadow-2xs">
                RV
              </div>
              <div>
                <span className="block text-sm font-semibold text-slate-900">Prof. Rajesh Verma</span>
                <span className="block text-xs text-slate-500">Lead AI Systems Faculty · Cohort 7</span>
              </div>
            </div>
          </div>
        </section>
        {/* END: RightTestimonialColumn */}
      </main>
      {/* END: MainContent */}
    </div>
  );
};

export default LoginPage;
