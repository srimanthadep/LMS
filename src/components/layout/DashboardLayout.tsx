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
  User,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { KeyboardShortcutsDialog } from "@/components/ui/KeyboardShortcutsDialog";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeAccentPicker } from "@/components/ui/ThemeAccentPicker";
import { DevRoleSwitcher } from "@/components/layout/DevRoleSwitcher";
import { ROLE_NAV_ITEMS } from "@/components/layout/navConfig";
import { useAuth } from "@/context/AuthContext";

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
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Live Classroom
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs font-bold text-foreground leading-snug">
              Multi-Agent Consensus
            </p>
            <p className="text-[11px] text-muted-foreground">
              Today @ 06:30 PM IST (72 attending)
            </p>
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate("/student/classroom/class-agentic-101")}
              className="w-full mt-2 h-7 text-xs rounded-lg gap-1 font-semibold"
            >
              Join Stream <ChevronRight className="h-3 w-3" />
            </Button>
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
        return (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Platform Status
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-bold text-foreground leading-snug">
              100% Operational
            </p>
            <p className="text-[11px] text-muted-foreground">
              42.8M Tokens • 0 Latency Spikes
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/super-admin/usage")}
              className="w-full mt-2 h-7 text-xs rounded-lg gap-1 font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
            >
              Cost Analytics <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        );
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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* 1. Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border/80 px-4 py-2.5 shadow-xs">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Brand & Avatar */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => navigate(`/${role}/dashboard`)}
          >
            <div className="relative flex items-center justify-center">
              <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs ring-2 ring-primary/20 shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-tight">Apex AI LMS</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block capitalize">
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
                  <p className="text-[11px] font-bold text-muted-foreground px-3 uppercase tracking-wider mb-2">
                    {role.replace("-", " ")} Navigation
                  </p>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Button
                        key={item.name}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-10 px-3 font-medium rounded-xl text-xs transition-all",
                          isActive && "bg-primary/10 text-primary font-bold border border-primary/20 shadow-xs"
                        )}
                        onClick={() => navigate(item.href)}
                      >
                        <Icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Button>
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
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 border-r border-border/80 bg-card/70 backdrop-blur-xl z-20 shadow-xs">
          {/* Brand header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/70 bg-gradient-to-b from-card to-card/50">
            <div
              className="flex items-center space-x-3 cursor-pointer group min-w-0 flex-1"
              onClick={() => navigate(`/${role}/dashboard`)}
            >
              <div className="relative shrink-0">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-base ring-2 ring-primary/25 shadow-sm group-hover:scale-105 transition-all">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-base tracking-tight block leading-tight truncate text-foreground">
                  Apex AI LMS
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block truncate capitalize">
                  {role.replace("-", " ")} Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col justify-between py-4 px-3.5 overflow-y-auto sleek-scrollbar">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground/80 px-3 uppercase tracking-wider mb-2">
                  Main Navigation
                </p>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => navigate(item.href)}
                        className={cn(
                          "relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group text-left outline-none",
                          isActive
                            ? "text-primary font-bold shadow-xs bg-primary/10 border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active-indicator"
                              className="w-1.5 h-4 rounded-full bg-primary"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Dynamic Role-Adaptive Contextual Card */}
              {renderSidebarWidget()}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-border/70 space-y-2">
              {/* User profile capsule */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-primary/30">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-start h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-2 rounded-xl"
                  onClick={() => setShortcutsOpen(true)}
                >
                  <Keyboard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Shortcuts</span>
                  <kbd className="ml-auto text-[10px] font-mono border border-border/70 rounded px-1.5 py-0.2 bg-muted/60">?</kbd>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  title="Sign Out"
                  onClick={() => {
                    logout();
                    navigate("/auth/login");
                  }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* 3. Main Content Canvas */}
        <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
          {/* Desktop Top Utility Bar */}
          <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-30">
            {/* Search Input */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted/60 text-muted-foreground text-xs w-60 xl:w-72 transition-colors text-left"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Search courses, classes, actions...</span>
              <kbd className="ml-auto text-[10px] font-mono border border-border/70 rounded px-1.5 py-0.5 bg-background shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Compact Dev Role Switcher */}
            <div className="mx-4 flex-1 max-w-2xl flex justify-center">
              <DevRoleSwitcher />
            </div>

            {/* Actions & Theme Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {headerAction}
              <ThemeToggle />
              <ThemeAccentPicker />
              <NotificationCenter />
            </div>
          </div>

          {/* Main Route Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 sm:pb-32 lg:pb-10 max-w-7xl w-full mx-auto">
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

      {/* 5. Global Modals */}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
};
