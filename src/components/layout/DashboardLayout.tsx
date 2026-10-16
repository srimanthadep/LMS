import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Menu,
  Keyboard,
  Search,
  Sparkles,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  User,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  LifeBuoy,
  Bot,
  ChevronDown,
  CreditCard,
  Compass,
  Settings,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { KeyboardShortcutsDialog } from "@/components/ui/KeyboardShortcutsDialog";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeAccentPicker } from "@/components/ui/ThemeAccentPicker";
import { DevRoleSwitcher } from "@/components/layout/DevRoleSwitcher";
import { ROLE_NAV_ITEMS } from "@/components/layout/navConfig";
import { useAuth } from "@/context/AuthContext";
import { StudentAiChatbotDrawer } from "@/components/shared/StudentAiChatbotDrawer";

interface DashboardLayoutProps {
  children: ReactNode;
  headerAction?: ReactNode;
}

export const DashboardLayout = ({ children, headerAction }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const isStudentPortal = role === "student" || location.pathname.startsWith("/student");

  // Dynamically activate Student Portal typography (Inter font stack) exclusively for students
  useEffect(() => {
    if (isStudentPortal) {
      document.documentElement.classList.add("student-portal-theme");
      document.body.setAttribute("data-portal", "student");
    } else {
      document.documentElement.classList.remove("student-portal-theme");
      document.body.removeAttribute("data-portal");
    }
    return () => {
      document.documentElement.classList.remove("student-portal-theme");
      document.body.removeAttribute("data-portal");
    };
  }, [isStudentPortal]);

  // Global Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Command Palette: Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }

      // Input field or modal protection guard
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable ||
          target.closest("input, textarea, select, [contenteditable='true']") ||
          target.closest("[role='dialog']"))
      ) {
        return;
      }

      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key.toLowerCase();
      if (key === "d") {
        e.preventDefault();
        navigate(`/${role}/dashboard`);
      } else if (key === "?") {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, role]);

  const navConfig = ROLE_NAV_ITEMS[role] || ROLE_NAV_ITEMS.student;
  const navItems = navConfig.sidebar;
  const mobileBottomNavItems = navConfig.mobileBottom;

  // Role-adaptive contextual widget
  const renderSidebarWidget = () => {
    switch (role) {
      case "student":
        return (
          <div className="p-4 rounded-2xl promo-card-pattern text-white relative overflow-hidden shadow-lg shadow-blue-950/20" data-purpose="promo-card">
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center justify-center text-amber-400">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
                </svg>
              </span>
            </div>
            <h4 className="text-sm font-semibold leading-snug mb-1 text-white">Upgrade Your<br/>Learning Experience</h4>
            <p className="text-[12px] text-rose-200/80 mb-3.5 leading-relaxed">Get access to premium tools and resources.</p>
            <button
              onClick={() => navigate("/student/courses")}
              className="inline-flex items-center justify-center w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#fff1f2] text-[#e11d48] hover:bg-white transition-all shadow-sm"
            >
              Explore Now  →
            </button>
          </div>
        );
      case "teacher":
        return (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <Activity className="h-3 w-3" /> Next Broadcast
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-foreground leading-snug">
              Session 4: Multi-Agent Consensus
            </p>
            <p className="text-[11px] text-muted-foreground">
              Live in 45 mins • 78 RSVPs
            </p>
            <Button
              size="sm"
              onClick={() => navigate("/teacher/classroom/class-agentic-101")}
              className="w-full mt-2 h-7 text-xs rounded-lg gap-1 font-semibold bg-rose-600 hover:bg-rose-700 text-white"
            >
              Enter Live Studio <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        );
      case "super-admin":
        return null;
      case "evaluator":
        return (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Grading SLA Active
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-foreground leading-snug">
              1 Pending Submission
            </p>
            <p className="text-[11px] text-muted-foreground">
              Turnaround limit: 14h left
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/evaluator/submissions")}
              className="w-full mt-2 h-7 text-xs rounded-lg gap-1 font-semibold border-amber-500/30 text-amber-700 dark:text-amber-300"
            >
              Open Queue <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        );
      case "support":
        return (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent border border-violet-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1">
                <LifeBuoy className="h-3 w-3" /> Mentor Inbox
              </span>
              <span className="w-2 h-2 rounded-full bg-violet-500" />
            </div>
            <p className="text-xs font-bold text-foreground leading-snug">
              2 Open Inquiries
            </p>
            <p className="text-[11px] text-muted-foreground">
              Avg SLA: 14 mins response
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/support/inbox")}
              className="w-full mt-2 h-7 text-xs rounded-lg gap-1 font-semibold border-violet-500/30 text-violet-700 dark:text-violet-300"
            >
              Open Tickets <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground flex flex-col font-sans",
        isStudentPortal && "student-portal-scope"
      )}
      data-portal={isStudentPortal ? "student" : undefined}
    >
      {/* 1. Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border/80 px-4 py-2.5 shadow-xs">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Brand & Avatar */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => navigate(`/${role}/dashboard`)}
          >
            <div className="w-8 h-8 rounded-lg bg-[#e11d48] flex items-center justify-center text-white shadow-sm shadow-rose-950/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m21.12 6.4-8.8-4.9a2.3 2.3 0 0 0-2.24 0l-8.8 4.9A2.3 2.3 0 0 0 .16 8.4v9.2a2.3 2.3 0 0 0 1.12 2l8.8 4.9a2.3 2.3 0 0 0 2.24 0l8.8-4.9a2.3 2.3 0 0 0 1.12-2V8.4a2.3 2.3 0 0 0-1.12-2z"></path>
                <path d="M12 22V12"></path>
                <path d="m21 7-9 5-9-5"></path>
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-tight">Apex LMS</span>
              <span className="text-[10px] text-[#e11d48] dark:text-rose-400 font-semibold uppercase tracking-wider block capitalize">
                {role.replace("-", " ")} Portal
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5">
            {headerAction}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="h-9 w-9 rounded-xl border border-border/70 hover:bg-muted/70 flex items-center justify-center text-foreground transition-colors"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
            <ThemeToggle />
            <ThemeAccentPicker />
            <NotificationCenter />

            {/* Sheet Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/60 hover:bg-muted/80">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col border-r border-border/80 bg-card">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>Mobile navigation drawer</SheetDescription>
                </SheetHeader>
                <div
                  className="p-5 border-b border-border/80 bg-muted/20 cursor-pointer"
                  onClick={() => navigate(`/${role}/dashboard`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm ring-2 ring-primary/30 shadow-md">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-base tracking-tight block">Apex AI LMS</span>
                      <span className="text-xs text-muted-foreground font-medium capitalize">{role.replace("-", " ")} Workspace</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-b border-border/60">
                  <DevRoleSwitcher className="w-full" />
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 sleek-scrollbar">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    const isNewSection = item.section && (idx === 0 || navItems[idx - 1]?.section !== item.section);

                    return (
                      <div key={item.name}>
                        {isNewSection && (
                          <p className={cn("text-[10px] font-bold text-muted-foreground px-3 uppercase tracking-wider mb-2", idx > 0 && "mt-4 pt-3 border-t border-border/60")}>
                            {item.section}
                          </p>
                        )}
                        {!item.section && idx === 0 && (
                          <p className="text-[11px] font-bold text-muted-foreground px-3 uppercase tracking-wider mb-2">
                            {role.replace("-", " ")} Navigation
                          </p>
                        )}
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start h-10 px-3 font-medium rounded-xl text-xs transition-all",
                            isActive && "bg-primary/10 text-primary font-bold border border-primary/20 shadow-xs"
                          )}
                          onClick={() => {
                            if (item.href === "#logout") {
                              logout();
                              navigate("/auth/login");
                            } else {
                              navigate(item.href);
                            }
                          }}
                        >
                          <Icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-border/80 bg-muted/10 space-y-2">
                  <div className="text-xs text-muted-foreground px-1 truncate">
                    Signed in as <strong>{user.name}</strong>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-medium text-xs"
                    onClick={() => {
                      logout();
                      navigate("/auth/login");
                    }}
                  >
                    <LogOut className="mr-2.5 h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* 2. Main Desktop Structure */}
      <div className="flex-1 flex">
        {/* Desktop Fixed Sidebar */}
        <aside className={cn("hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-border/80 bg-card/70 backdrop-blur-xl z-20 shadow-xs transition-all duration-300 ease-in-out", sidebarCollapsed ? "lg:w-20" : "lg:w-72")}>
          {/* Brand Logo Header with Collapse Toggle */}
          <div className={cn("flex items-center justify-between py-5 border-b border-slate-200/80 dark:border-border/80 transition-all", sidebarCollapsed ? "px-3 justify-center flex-col gap-2" : "px-5")}>
            <div
              className="flex items-center gap-3 cursor-pointer group min-w-0"
              onClick={() => navigate(`/${role}/dashboard`)}
              title="Apex LMS"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e11d48] flex items-center justify-center text-white shadow-sm shadow-rose-950/20 group-hover:scale-110 transition-transform shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m21.12 6.4-8.8-4.9a2.3 2.3 0 0 0-2.24 0l-8.8 4.9A2.3 2.3 0 0 0 .16 8.4v9.2a2.3 2.3 0 0 0 1.12 2l8.8 4.9a2.3 2.3 0 0 0 2.24 0l8.8-4.9a2.3 2.3 0 0 0 1.12-2V8.4a2.3 2.3 0 0 0-1.12-2z"></path>
                  <path d="M12 22V12"></path>
                  <path d="m21 7-9 5-9-5"></path>
                </svg>
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1 overflow-hidden transition-all duration-200">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-tight truncate">Apex LMS</span>
                  <span className="text-[10px] text-[#e11d48] dark:text-rose-400 font-semibold uppercase tracking-wider block truncate capitalize">{role.replace("-", " ")} Workspace</span>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-7 w-7 rounded-lg border border-border/70 hover:bg-muted/80 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer shrink-0"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5 transition-transform" /> : <ChevronLeft className="h-3.5 w-3.5 transition-transform" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col justify-between py-5 px-3 overflow-y-auto sleek-scrollbar">
            <div className="space-y-5">
              <div>
                <nav className="space-y-1">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    const isNewSection = item.section && (idx === 0 || navItems[idx - 1]?.section !== item.section);

                    return (
                      <div key={item.name}>
                        {isNewSection && (
                          <div className={cn(idx > 0 && "mt-4 pt-3 border-t border-slate-200/60 dark:border-border/60", "mb-1.5")}>
                            {!sidebarCollapsed ? (
                              <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                                {item.section}
                              </p>
                            ) : (
                              <div className="h-px bg-slate-200/60 dark:border-border/60 mx-2 my-2" />
                            )}
                          </div>
                        )}
                        {!item.section && idx === 0 && !sidebarCollapsed && (
                          <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-2">
                            Menu
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (item.href === "#logout") {
                              logout();
                              navigate("/auth/login");
                            } else {
                              navigate(item.href);
                            }
                          }}
                          title={sidebarCollapsed ? item.name : undefined}
                          className={cn(
                            "group relative flex items-center rounded-xl font-medium text-sm transition-all text-left outline-none cursor-pointer",
                            sidebarCollapsed ? "justify-center p-2.5 w-full" : "gap-3 px-3.5 py-2.5 w-full",
                            isActive
                              ? "bg-[#fff1f2] dark:bg-[#e11d48]/25 text-[#e11d48] dark:text-rose-300 font-semibold shadow-2xs"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-muted/40"
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="sidebar-active-indicator"
                              className={cn(
                                "absolute bg-[#e11d48] dark:bg-rose-400 rounded-r-md shadow-xs shadow-rose-500/40",
                                sidebarCollapsed ? "-left-3 top-1.5 bottom-1.5 w-1" : "-left-3 top-1.5 bottom-1.5 w-1.5"
                              )}
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                          <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-115", isActive ? "text-[#e11d48] dark:text-rose-300" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                          {!sidebarCollapsed && (
                            <span className="flex-1 truncate group-hover:translate-x-0.5 transition-transform duration-150">{item.name}</span>
                          )}
                          {!sidebarCollapsed && item.badge && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#e11d48] text-white shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Dynamic Role-Adaptive Contextual Card */}
              {!sidebarCollapsed ? (
                renderSidebarWidget()
              ) : (
                <div className="flex justify-center" title="Workspace Status">
                  <div
                    onClick={() => navigate(role === "student" ? "/student/courses" : `/${role}/dashboard`)}
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 flex items-center justify-center text-[#e11d48] cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-border/70 space-y-2">
              {/* User profile capsule with dropdown for student */}
              {role === "student" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-200/80 dark:border-border/50 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-muted/70 group outline-none",
                        sidebarCollapsed ? "p-2 justify-center" : "gap-2.5 p-2.5"
                      )}
                      title={sidebarCollapsed ? `${user.name} (Student Profile Menu)` : undefined}
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-[#e11d48]/30 group-hover:scale-105 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      {!sidebarCollapsed && (
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
                            <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side={sidebarCollapsed ? "right" : "top"}
                    align={sidebarCollapsed ? "end" : "start"}
                    className="w-64 p-1.5 shadow-2xl border-border/80 bg-card/95 backdrop-blur-xl z-50 mb-1"
                  >
                    <div className="px-2.5 py-2 mb-1 rounded-lg bg-slate-50 dark:bg-muted/40 border border-slate-200/60 dark:border-border/50">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#e11d48]/10 text-[#e11d48] dark:text-rose-300">
                          Cohort 7 Student
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/student/profile")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Student Profile</span>
                        <p className="text-[10px] text-muted-foreground">Personal, academic & skills</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/payments")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Payments / Billing</span>
                        <p className="text-[10px] text-muted-foreground">Tuition, dues & receipts</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/course-management")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <Compass className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Course Management</span>
                        <p className="text-[10px] text-muted-foreground">Catalog & curriculum structure</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/settings")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Settings</span>
                        <p className="text-[10px] text-muted-foreground">Preferences & privacy</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate("/auth/login");
                      }}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:text-rose-600 focus:bg-rose-50 font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-xs">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div
                  className={cn("flex items-center rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-200/80 dark:border-border/50 transition-all", sidebarCollapsed ? "p-2 justify-center" : "gap-2.5 p-2.5")}
                  title={sidebarCollapsed ? `${user.name} (${user.email})` : undefined}
                >
                  <div className="h-8 w-8 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-[#e11d48]/30">
                    {user.name.charAt(0)}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  )}
                </div>
              )}

              {!isStudentPortal && (
                <div className={cn("flex items-center gap-1.5", sidebarCollapsed && "flex-col")}>
                  {!sidebarCollapsed ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-start h-8 px-2.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white gap-2 rounded-xl"
                      onClick={() => setShortcutsOpen(true)}
                    >
                      <Keyboard className="h-3.5 w-3.5 text-slate-400" />
                      <span>Shortcuts</span>
                      <kbd className="ml-auto text-[10px] font-mono border border-slate-200 dark:border-border rounded px-1.5 py-0.2 bg-white dark:bg-card">?</kbd>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-slate-500 hover:text-foreground"
                      title="Keyboard Shortcuts"
                      onClick={() => setShortcutsOpen(true)}
                    >
                      <Keyboard className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
                    title="Sign Out"
                    onClick={() => {
                      logout();
                      navigate("/auth/login");
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* 3. Main Content Canvas */}
        <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
          {/* Desktop Top Utility Bar */}
          <header className="hidden lg:flex h-20 items-center justify-between px-8 border-b border-slate-200/80 dark:border-border/80 bg-white/90 dark:bg-card/90 backdrop-blur-md sticky top-0 z-30" data-purpose="top-navigation-bar">
            {/* Search Input */}
            <div className="relative w-full max-w-xs xl:max-w-md">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full pl-10 pr-16 py-2.5 bg-slate-50 dark:bg-muted/30 border border-slate-200 dark:border-border rounded-xl text-xs md:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 flex items-center justify-between hover:border-[#e11d48]/50 transition-all text-left"
              >
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <span className="text-slate-400 text-xs truncate">Search lectures, subjects, doubts...</span>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <kbd className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-card border border-slate-200 dark:border-border rounded shadow-2xs">Ctrl K</kbd>
                </span>
              </button>
            </div>

            {/* Compact Dev Role Switcher */}
            <div className="mx-4 flex-1 max-w-xl flex justify-center">
              <DevRoleSwitcher />
            </div>

            {/* Actions & Theme Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {headerAction}
              <ThemeToggle />
              <ThemeAccentPicker />
              <NotificationCenter />

              {/* User Profile Pill with Dropdown */}
              {role === "student" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-border/80 outline-none cursor-pointer group text-left hover:opacity-90 transition-opacity"
                      aria-label="Student Profile Menu"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-bold text-sm ring-2 ring-[#e11d48]/25 shadow-xs group-hover:scale-105 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                          <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
                        </div>
                        <p className="text-[11px] text-slate-400 capitalize">Cohort 7 Student</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64 p-1.5 shadow-2xl border-border/80 bg-card/95 backdrop-blur-xl z-50 mt-1"
                  >
                    <div className="px-2.5 py-2 mb-1 rounded-lg bg-slate-50 dark:bg-muted/40 border border-slate-200/60 dark:border-border/50">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#e11d48]/10 text-[#e11d48] dark:text-rose-300">
                          Cohort 7 Student
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/student/profile")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Student Profile</span>
                        <p className="text-[10px] text-muted-foreground">Personal, academic & skills</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/payments")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Payments / Billing</span>
                        <p className="text-[10px] text-muted-foreground">Tuition, dues & receipts</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/course-management")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <Compass className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Course Management</span>
                        <p className="text-[10px] text-muted-foreground">Catalog & curriculum structure</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/student/settings")}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-muted/60"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold">Settings</span>
                        <p className="text-[10px] text-muted-foreground">Preferences & privacy</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate("/auth/login");
                      }}
                      className="gap-2.5 py-2 px-2.5 cursor-pointer rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:text-rose-600 focus:bg-rose-50 font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-xs">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-border/80">
                  <div className="w-10 h-10 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-bold text-sm ring-2 ring-[#e11d48]/25 shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-[11px] text-slate-400 capitalize">{`${role.replace("-", " ")} Role`}</p>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Main Route Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 sm:pb-32 lg:pb-12 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* 4. Floating Modern Mobile Bottom Navigation Dock */}
      <div className="lg:hidden fixed bottom-3 inset-x-0 z-40 px-3.5 max-w-md mx-auto pointer-events-none">
        <nav className="pointer-events-auto bg-card/90 dark:bg-card/95 backdrop-blur-2xl border border-border/80 shadow-[0_8px_32px_rgba(0,0,0,0.14)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-1.5 flex items-center justify-between ring-1 ring-black/5 dark:ring-white/10">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
                    try {
                      navigator.vibrate(15);
                    } catch {}
                  }
                  if (item.href === "#shortcuts") {
                    setShortcutsOpen(true);
                  } else {
                    navigate(item.href);
                  }
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 outline-none select-none",
                  isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-pill"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className={cn("relative z-10 p-0.5 transition-transform duration-200", isActive && "scale-110")}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                </div>

                <span className={cn("relative z-10 text-[10px] tracking-tight mt-0.5 truncate max-w-[58px]", isActive ? "font-bold text-primary" : "font-medium")}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 5. Floating AI Copilot for Students */}
      {role === "student" && (
        <button
          onClick={() => setChatbotOpen(true)}
          data-component="ai-chatbot"
          className="fixed bottom-20 lg:bottom-6 right-6 z-40 h-13 w-13 rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer group ring-4 ring-[#e11d48]/20"
          title="Chatbot — AI Study Assistant"
          aria-label="Chatbot — AI Study Assistant"
        >
          <Bot className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-card"></span>
          </span>
        </button>
      )}

      {/* 6. Global Modals & Drawers */}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      {role === "student" && (
        <StudentAiChatbotDrawer open={chatbotOpen} onOpenChange={setChatbotOpen} />
      )}
    </div>
  );
};
