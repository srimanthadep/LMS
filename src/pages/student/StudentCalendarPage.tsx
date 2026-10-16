import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  FileCheck2,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Info,
  CalendarCheck,
  BookOpen,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  MapPin,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  type: "live_session" | "assignment_deadline" | "exam_deadline" | "cancellation" | "study_reminder";
  date: string; // ISO format "YYYY-MM-DD" e.g. "2026-10-15"
  time: string; // Display string e.g. "06:30 PM – 08:30 PM IST"
  startHour: number; // Decimal hour 0-23 for week/day grid
  durationHours: number; // Duration in hours
  course: string;
  notes?: string;
  status?: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Session 4: Multi-Agent Consensus & Supervised Workflows",
    type: "live_session",
    date: "2026-10-15",
    time: "06:30 PM – 08:30 PM IST",
    startHour: 18.5,
    durationHours: 2,
    course: "Full-Stack AI Engineering",
    notes: "Mandatory attendance for Capstone milestone 2 sign-off. Interactive live studio session with Prof. Verma.",
  },
  {
    id: "ev-2",
    title: "Milestone 2 DPP: Hybrid RAG Pipeline Submission",
    type: "assignment_deadline",
    date: "2026-10-16",
    time: "11:59 PM IST",
    startHour: 23,
    durationHours: 1,
    course: "Full-Stack AI Engineering",
    notes: "Late penalty of 5% applies after midnight. Ensure all Dockerfiles pass pre-checks.",
  },
  {
    id: "ev-3",
    title: "Rescheduled: KV-Cache Attention Eviction Lab",
    type: "cancellation",
    date: "2026-10-17",
    time: "03:00 PM – 05:00 PM IST",
    startHour: 15,
    durationHours: 2,
    course: "Distributed Systems & KV-Cache",
    notes: "Shifted from 11:00 AM to 03:00 PM IST due to instructor travel schedule. Instant replay will be available.",
  },
  {
    id: "ev-4",
    title: "Timed Capstone Midterm Assessment",
    type: "exam_deadline",
    date: "2026-10-19",
    time: "05:00 PM – 06:15 PM IST",
    startHour: 17,
    durationHours: 1.25,
    course: "Apex Academic Senate",
    notes: "45 multiple-choice questions + architectural code analysis viva. Webcams and screen share required.",
  },
  {
    id: "ev-5",
    title: "Personal Study: Review LangGraph Supervisor Cycle Pruning",
    type: "study_reminder",
    date: "2026-10-20",
    time: "07:00 PM – 08:30 PM IST",
    startHour: 19,
    durationHours: 1.5,
    course: "Personal Study Goal",
    notes: "Read LangGraph checkpoint state serialization and memory channels documentation.",
  },
  {
    id: "ev-6",
    title: "Live Doubt Clearing: Attention Mechanism Q&A",
    type: "live_session",
    date: "2026-10-12",
    time: "04:00 PM – 05:30 PM IST",
    startHour: 16,
    durationHours: 1.5,
    course: "Deep Learning Architectures",
    notes: "Interactive faculty office hours with live screen sharing.",
  },
  {
    id: "ev-7",
    title: "DPP 1: CUDA Kernel Optimization Submission",
    type: "assignment_deadline",
    date: "2026-10-08",
    time: "11:59 PM IST",
    startHour: 23,
    durationHours: 1,
    course: "Distributed Systems & KV-Cache",
    notes: "Submitted and evaluated (Score: 94/100).",
  },
  {
    id: "ev-8",
    title: "Workshop: Building Autonomous Multi-Agent Teams",
    type: "live_session",
    date: "2026-10-22",
    time: "06:00 PM – 08:00 PM IST",
    startHour: 18,
    durationHours: 2,
    course: "Full-Stack AI Engineering",
    notes: "Hands-on implementation of LangGraph multi-agent teams with shared memory state.",
  },
  {
    id: "ev-9",
    title: "Milestone 3 DPP: Graph RAG Implementation",
    type: "assignment_deadline",
    date: "2026-10-26",
    time: "11:59 PM IST",
    startHour: 23,
    durationHours: 1,
    course: "Full-Stack AI Engineering",
    notes: "Implementation of knowledge graph extraction and vector-graph hybrid retriever.",
  },
  {
    id: "ev-10",
    title: "Personal Study: PyTorch Distributed Data Parallelism",
    type: "study_reminder",
    date: "2026-10-28",
    time: "08:00 PM – 09:30 PM IST",
    startHour: 20,
    durationHours: 1.5,
    course: "Self Study Goal",
    notes: "Study DDP gradient synchronization and ring all-reduce communication algorithms.",
  },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_NAMES_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Hours displayed in Week and Day views (8 AM to 10 PM)
const TIME_SLOTS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

export const StudentCalendarPage: React.FC = () => {
  const { addNotification } = useNotifications();

  // Calendar Navigation & View State (Anchored to October 15, 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 15));
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month");

  // Filters State
  const [filterType, setFilterType] = useState<string>("All");

  // Notification Preferences
  const [reminderNotifsEnabled, setReminderNotifsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  // Events State
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Selected Event Detail Dialog State
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Add Reminder Modal State
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("2026-10-16");
  const [newTime, setNewTime] = useState("17:00");
  const [newNotes, setNewNotes] = useState("");

  // Helper formatting functions
  const formatDateIso = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const isToday = (d: Date): boolean => {
    // Current simulated date is 2026-10-15
    return d.getFullYear() === 2026 && d.getMonth() === 9 && d.getDate() === 15;
  };

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Navigation handlers
  const handleGoToday = () => {
    setCurrentDate(new Date(2026, 9, 15));
  };

  const handlePrev = () => {
    if (currentView === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (currentView === "week") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (currentView === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (currentView === "week") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  // Header Title calculation (Google Calendar style)
  const headerTitle = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = MONTH_NAMES[currentDate.getMonth()];

    if (currentView === "month") {
      return `${month} ${year}`;
    }

    if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startMonth = MONTH_NAMES[startOfWeek.getMonth()].slice(0, 3);
      const endMonth = MONTH_NAMES[endOfWeek.getMonth()].slice(0, 3);

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startMonth} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${year}`;
      }
      return `${startMonth} ${startOfWeek.getDate()} – ${endMonth} ${endOfWeek.getDate()}, ${year}`;
    }

    // Day view
    const weekday = WEEKDAY_NAMES_LONG[currentDate.getDay()];
    return `${weekday}, ${month} ${currentDate.getDate()}, ${year}`;
  }, [currentDate, currentView]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (filterType === "All") return true;
      if (filterType === "Live Sessions") return ev.type === "live_session";
      if (filterType === "Deadlines") return ev.type === "assignment_deadline" || ev.type === "exam_deadline";
      if (filterType === "Alerts") return ev.type === "cancellation";
      if (filterType === "Study Reminders") return ev.type === "study_reminder";
      return true;
    });
  }, [events, filterType]);

  // Month View Days Matrix
  const monthMatrix = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const matrix: { date: Date; isCurrentMonth: boolean }[] = [];

    // Fill days from previous month to align with Sunday start
    const startDayOfWeek = firstDayOfMonth.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      matrix.push({ date: d, isCurrentMonth: false });
    }

    // Fill days of current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      matrix.push({ date: d, isCurrentMonth: true });
    }

    // Fill days of next month to complete standard 35 or 42 grid cells
    const remainingDays = (7 - (matrix.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      matrix.push({ date: d, isCurrentMonth: false });
    }

    return matrix;
  }, [currentDate]);

  // Week View Days (7 days Sun to Sat)
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  // Event Styling Configuration (Google Calendar Aesthetic)
  const getEventStyle = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "live_session":
        return {
          chip: "bg-[#e11d48]/10 text-[#e11d48] dark:text-rose-300 dark:bg-rose-950/40 border-l-[3px] border-[#e11d48] hover:bg-[#e11d48]/20",
          dot: "bg-[#e11d48]",
          badge: <Badge className="bg-[#e11d48]/10 text-[#e11d48] dark:text-rose-300 border-[#e11d48]/20 text-[10px]">Live Broadcast</Badge>,
          label: "Live Broadcast",
          icon: Video,
        };
      case "assignment_deadline":
        return {
          chip: "bg-amber-500/10 text-amber-800 dark:text-amber-300 dark:bg-amber-950/40 border-l-[3px] border-amber-500 hover:bg-amber-500/20",
          dot: "bg-amber-500",
          badge: <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px]">Assignment Due</Badge>,
          label: "Assignment Due",
          icon: FileCheck2,
        };
      case "exam_deadline":
        return {
          chip: "bg-red-500/10 text-red-800 dark:text-red-300 dark:bg-red-950/40 border-l-[3px] border-red-600 hover:bg-red-500/20",
          dot: "bg-red-600",
          badge: <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Timed Exam</Badge>,
          label: "Timed Exam",
          icon: AlertTriangle,
        };
      case "cancellation":
        return {
          chip: "bg-violet-500/10 text-violet-800 dark:text-violet-300 dark:bg-violet-950/40 border-l-[3px] border-violet-500 hover:bg-violet-500/20",
          dot: "bg-violet-500",
          badge: <Badge className="bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20 text-[10px]">Rescheduled</Badge>,
          label: "Rescheduled",
          icon: Clock,
        };
      case "study_reminder":
        return {
          chip: "bg-blue-500/10 text-blue-800 dark:text-blue-300 dark:bg-blue-950/40 border-l-[3px] border-blue-500 hover:bg-blue-500/20",
          dot: "bg-blue-500",
          badge: <Badge variant="secondary" className="text-[10px]">Personal Study</Badge>,
          label: "Personal Study",
          icon: CalendarCheck,
        };
    }
  };

  // Add Reminder Form Handler
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Parse hour from newTime
    const [hStr, mStr] = newTime.split(":");
    const h = parseInt(hStr, 10) || 17;
    const m = parseInt(mStr, 10) || 0;
    const startHour = h + m / 60;

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newTitle,
      type: "study_reminder",
      date: newDate,
      time: `${newTime} IST`,
      startHour,
      durationHours: 1.5,
      course: "Personal Study Plan",
      notes: newNotes,
    };

    setEvents([newEv, ...events]);
    setIsAddReminderOpen(false);
    setNewTitle("");
    setNewNotes("");

    addNotification({
      title: "Study Reminder Scheduled",
      message: `"${newTitle}" added to your calendar for ${newDate}.`,
      type: "system",
    });
  };

  const handleDeleteReminder = (eventId: string) => {
    setEvents(events.filter((ev) => ev.id !== eventId));
    setIsDetailOpen(false);
    addNotification({
      title: "Reminder Removed",
      message: "The study reminder was removed from your academic calendar.",
      type: "system",
    });
  };

  const openAddReminderForDate = (dateIso: string) => {
    setNewDate(dateIso);
    setIsAddReminderOpen(true);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarIcon className="h-6 w-6 text-primary" /> Academic Calendar & Deadlines
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Google Calendar-style schedule tracker for live lectures, assignment deadlines, exams, and study milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link to="/student/schedule">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs h-9">
              <Clock className="h-3.5 w-3.5 text-primary" /> Daily Timetable
            </Button>
          </Link>
          <Button
            onClick={() => {
              setNewDate(formatDateIso(currentDate));
              setIsAddReminderOpen(true);
            }}
            className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs h-9 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Study Reminder
          </Button>
        </div>
      </div>

      {/* 2. Google Calendar Toolbar (Today, Nav, Title, View Switcher) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-3.5 shadow-xs">
        {/* Left: Navigation and Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToday}
            className="rounded-xl text-xs font-semibold h-9 px-3.5 border-border/80 hover:bg-muted/80 shadow-2xs cursor-pointer"
          >
            Today
          </Button>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8 rounded-lg hover:bg-muted cursor-pointer"
              title="Previous period"
              aria-label="Previous period"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 rounded-lg hover:bg-muted cursor-pointer"
              title="Next period"
              aria-label="Next period"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground select-none">
            {headerTitle}
          </h2>
        </div>

        {/* Right: View Switchers & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Control for Month / Week / Day */}
          <div className="flex items-center p-0.5 bg-muted/70 rounded-xl border border-border/60">
            <Button
              variant={currentView === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("month")}
              className={cn("rounded-lg text-xs h-8 px-3.5 transition-all cursor-pointer", currentView === "month" ? "font-bold shadow-xs" : "text-muted-foreground")}
            >
              Month
            </Button>
            <Button
              variant={currentView === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("week")}
              className={cn("rounded-lg text-xs h-8 px-3.5 transition-all cursor-pointer", currentView === "week" ? "font-bold shadow-xs" : "text-muted-foreground")}
            >
              Week
            </Button>
            <Button
              variant={currentView === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("day")}
              className={cn("rounded-lg text-xs h-8 px-3.5 transition-all cursor-pointer", currentView === "day" ? "font-bold shadow-xs" : "text-muted-foreground")}
            >
              Day
            </Button>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-8 rounded-xl border border-border/80 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Categories ({events.length})</option>
            <option value="Live Sessions">Live Broadcasts</option>
            <option value="Deadlines">Assignments & Exams</option>
            <option value="Alerts">Rescheduled Alerts</option>
            <option value="Study Reminders">Personal Reminders</option>
          </select>
        </div>
      </div>

      {/* 3. Main Two-Column Layout (Left: Mini Calendar & Preferences, Right: Calendar Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side Panel: Mini Calendar & Notification Preferences */}
        <div className="lg:col-span-3 space-y-4">
          {/* Mini Calendar Widget (Classic Google Calendar UI) */}
          <Card className="rounded-2xl border-border/70 shadow-xs p-3.5">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
              <span className="text-xs font-bold text-foreground">
                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  aria-label="Next Month"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Mini Grid Header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-muted-foreground pb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="py-0.5">{d}</div>
              ))}
            </div>

            {/* Mini Grid Days */}
            <div className="grid grid-cols-7 gap-y-1 text-center text-[11px]">
              {monthMatrix.map((item, idx) => {
                const isSelected = isSameDay(item.date, currentDate);
                const isCurrentToday = isToday(item.date);
                const iso = formatDateIso(item.date);
                const hasEvents = events.some((ev) => ev.date === iso);

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentDate(new Date(item.date))}
                    className={cn(
                      "h-6 w-6 mx-auto rounded-full flex flex-col items-center justify-center font-medium transition-all relative",
                      !item.isCurrentMonth && "text-muted-foreground/40",
                      item.isCurrentMonth && "text-foreground hover:bg-muted",
                      isCurrentToday && !isSelected && "ring-1 ring-[#e11d48] text-[#e11d48] font-bold",
                      isSelected && "bg-[#e11d48] text-white font-bold shadow-xs"
                    )}
                  >
                    <span>{item.date.getDate()}</span>
                    {hasEvents && !isSelected && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#e11d48]" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Calendar Categories / Legend */}
          <Card className="rounded-2xl border-border/70 shadow-xs p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" /> Calendars & Color Tags
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e11d48]" />
                  <span>Live Broadcasts</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {events.filter((e) => e.type === "live_session").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Assignment Deadlines</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {events.filter((e) => e.type === "assignment_deadline").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                  <span>Timed Exam Windows</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {events.filter((e) => e.type === "exam_deadline").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                  <span>Rescheduled Notices</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {events.filter((e) => e.type === "cancellation").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span>Personal Study Reminders</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {events.filter((e) => e.type === "study_reminder").length}
                </span>
              </div>
            </div>
          </Card>

          {/* Notification Preferences Card (Preserved from original) */}
          <Card className="rounded-2xl border-border/70 shadow-xs p-4 space-y-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold text-foreground">Reminder Alerts</h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Automated 2-hour warnings for broadcasts and 24-hour warnings before milestone submissions lock.
            </p>
            <div className="space-y-2 pt-1 border-t border-border/50 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={reminderNotifsEnabled}
                  onChange={(e) => setReminderNotifsEnabled(e.target.checked)}
                  className="h-3.5 w-3.5 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <span>In-App Banners</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={emailAlertsEnabled}
                  onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                  className="h-3.5 w-3.5 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <span>Email Alerts</span>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Main Calendar View Canvas (Google Calendar Grid) */}
        <div className="lg:col-span-9">
          {/* VIEW 1: MONTH VIEW (Google Calendar Grid) */}
          {currentView === "month" && (
            <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden bg-card">
              {/* Day Header Row */}
              <div className="grid grid-cols-7 border-b border-border/80 bg-muted/30 text-center text-xs font-bold text-muted-foreground py-2.5">
                {WEEKDAY_NAMES_SHORT.map((dayName, i) => (
                  <div key={i} className="uppercase tracking-wider">
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Month Grid Cells (7 columns) */}
              <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
                {monthMatrix.map((item, idx) => {
                  const dateIso = formatDateIso(item.date);
                  const isCurrentDay = isToday(item.date);
                  const dayEvents = filteredEvents.filter((ev) => ev.date === dateIso);

                  return (
                    <div
                      key={idx}
                      onClick={() => openAddReminderForDate(dateIso)}
                      className={cn(
                        "min-h-[105px] sm:min-h-[115px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors group cursor-pointer",
                        !item.isCurrentMonth ? "bg-muted/15 text-muted-foreground/40" : "bg-card hover:bg-slate-50/50 dark:hover:bg-muted/30",
                        isCurrentDay && "bg-rose-50/30 dark:bg-rose-950/10"
                      )}
                    >
                      {/* Top Day Header in Cell */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            "text-xs font-semibold h-6 w-6 rounded-full flex items-center justify-center transition-transform",
                            isCurrentDay
                              ? "bg-[#e11d48] text-white font-bold shadow-xs"
                              : item.isCurrentMonth
                              ? "text-foreground group-hover:scale-110"
                              : "text-muted-foreground/40"
                          )}
                        >
                          {item.date.getDate()}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                            {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* Scheduled Event Chips (Google Calendar Style) */}
                      <div className="space-y-1 flex-1">
                        {dayEvents.slice(0, 3).map((ev) => {
                          const style = getEventStyle(ev.type);
                          const Icon = style.icon;

                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(ev);
                                setIsDetailOpen(true);
                              }}
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium truncate flex items-center gap-1 cursor-pointer transition-all hover:scale-[1.02]",
                                style.chip
                              )}
                              title={`${ev.title} (${ev.time})`}
                            >
                              <Icon className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}

                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-muted-foreground font-semibold px-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* VIEW 2: WEEK VIEW (7-Day Column Grid with Time Slots) */}
          {currentView === "week" && (
            <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden bg-card">
              <div className="overflow-x-auto sleek-scrollbar">
                <div className="min-w-[720px]">
                  {/* Top Week Header with 7 Days */}
                  <div className="grid grid-cols-8 border-b border-border/80 bg-muted/20 text-center">
                    {/* Empty corner cell for time gutter */}
                    <div className="p-3 border-r border-border/80 text-[11px] font-bold text-muted-foreground uppercase">
                      GMT+5:30
                    </div>

                    {weekDays.map((d, i) => {
                      const isCurrentDay = isToday(d);
                      const isSelected = isSameDay(d, currentDate);

                      return (
                        <div
                          key={i}
                          onClick={() => setCurrentDate(new Date(d))}
                          className={cn(
                            "p-2.5 border-r border-border/60 last:border-r-0 flex flex-col items-center justify-center cursor-pointer transition-colors",
                            isCurrentDay && "bg-rose-50/40 dark:bg-rose-950/20",
                            isSelected && "bg-muted/40"
                          )}
                        >
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">
                            {WEEKDAY_NAMES_SHORT[d.getDay()]}
                          </span>
                          <span
                            className={cn(
                              "text-sm font-bold h-7 w-7 rounded-full flex items-center justify-center mt-0.5",
                              isCurrentDay
                                ? "bg-[#e11d48] text-white shadow-xs"
                                : "text-foreground"
                            )}
                          >
                            {d.getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hourly Rows & Columns */}
                  <div className="relative divide-y divide-border/50">
                    {/* Simulated Current Time Indicator Line (2:05 PM = 14.08) */}
                    <div
                      className="absolute inset-x-0 z-10 pointer-events-none flex items-center"
                      style={{ top: `${((14.08 - 8) / (22 - 8)) * 100}%` }}
                    >
                      <div className="w-16 h-2 bg-[#e11d48] rounded-r-full text-[9px] text-white font-mono px-1 flex items-center justify-end">
                        14:05
                      </div>
                      <div className="flex-1 h-[2px] bg-[#e11d48]" />
                    </div>

                    {TIME_SLOTS.map((hour) => (
                      <div key={hour} className="grid grid-cols-8 min-h-[58px]">
                        {/* Time Gutter on Left */}
                        <div className="border-r border-border/80 px-2.5 py-1 text-[11px] font-mono text-muted-foreground text-right select-none bg-muted/10">
                          {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </div>

                        {/* 7 Columns for Days */}
                        {weekDays.map((d, dayIdx) => {
                          const dateIso = formatDateIso(d);
                          const hourEvents = filteredEvents.filter(
                            (ev) => ev.date === dateIso && Math.floor(ev.startHour) === hour
                          );

                          return (
                            <div
                              key={dayIdx}
                              onClick={() => {
                                setNewTime(`${String(hour).padStart(2, "0")}:00`);
                                openAddReminderForDate(dateIso);
                              }}
                              className="border-r border-border/50 last:border-r-0 p-1 relative hover:bg-muted/20 transition-colors cursor-pointer"
                            >
                              {hourEvents.map((ev) => {
                                const style = getEventStyle(ev.type);
                                const Icon = style.icon;

                                return (
                                  <div
                                    key={ev.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEvent(ev);
                                      setIsDetailOpen(true);
                                    }}
                                    className={cn(
                                      "rounded-lg p-1.5 text-[10px] font-medium shadow-2xs hover:shadow-xs transition-all cursor-pointer leading-tight mb-1",
                                      style.chip
                                    )}
                                  >
                                    <div className="flex items-center gap-1 font-bold truncate">
                                      <Icon className="h-3 w-3 shrink-0" />
                                      <span className="truncate">{ev.title}</span>
                                    </div>
                                    <span className="text-[9px] opacity-80 block truncate mt-0.5">
                                      {ev.time}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* VIEW 3: DAY VIEW (Dedicated Day Timeline Grid) */}
          {currentView === "day" && (
            <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden bg-card">
              {/* Day View Top Header */}
              <div className="p-4 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-base",
                      isToday(currentDate) ? "bg-[#e11d48] text-white shadow-xs" : "bg-muted text-foreground"
                    )}
                  >
                    {currentDate.getDate()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-foreground">
                      {WEEKDAY_NAMES_LONG[currentDate.getDay()]}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}{" "}
                      {isToday(currentDate) && <span className="font-bold text-[#e11d48]">• Today</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {filteredEvents.filter((ev) => ev.date === formatDateIso(currentDate)).length} scheduled items
                  </span>
                </div>
              </div>

              {/* Day Time Schedule Grid */}
              <div className="divide-y divide-border/60">
                {TIME_SLOTS.map((hour) => {
                  const dateIso = formatDateIso(currentDate);
                  const hourEvents = filteredEvents.filter(
                    (ev) => ev.date === dateIso && Math.floor(ev.startHour) === hour
                  );

                  return (
                    <div
                      key={hour}
                      onClick={() => {
                        setNewTime(`${String(hour).padStart(2, "0")}:00`);
                        openAddReminderForDate(dateIso);
                      }}
                      className="flex min-h-[68px] hover:bg-muted/20 transition-colors cursor-pointer group"
                    >
                      {/* Left Hour Label */}
                      <div className="w-20 sm:w-24 border-r border-border/80 p-3 text-right text-xs font-mono text-muted-foreground select-none shrink-0 bg-muted/10">
                        {hour === 12 ? "12:00 PM" : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                      </div>

                      {/* Right Events Area */}
                      <div className="flex-1 p-2 sm:p-2.5 space-y-2">
                        {hourEvents.length === 0 ? (
                          <div className="h-full flex items-center text-[11px] text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            + Click to schedule personal reminder at {hour}:00
                          </div>
                        ) : (
                          hourEvents.map((ev) => {
                            const style = getEventStyle(ev.type);
                            const Icon = style.icon;

                            return (
                              <div
                                key={ev.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(ev);
                                  setIsDetailOpen(true);
                                }}
                                className={cn(
                                  "rounded-xl p-3 border shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer",
                                  style.chip
                                )}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <h4 className="font-bold text-sm text-foreground">{ev.title}</h4>
                                    {style.badge}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    <strong className="text-foreground">{ev.course}</strong> • {ev.time}
                                    {ev.notes && ` — ${ev.notes}`}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {ev.type === "live_session" && (
                                    <Link
                                      to="/student/classroom/class-agentic-101"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button size="sm" className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold rounded-xl h-8 gap-1.5 shadow-xs">
                                        <Video className="h-3.5 w-3.5" /> Join Studio
                                      </Button>
                                    </Link>
                                  )}
                                  {ev.type === "assignment_deadline" && (
                                    <Link
                                      to="/student/assessments"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl h-8 gap-1.5">
                                        <FileCheck2 className="h-3.5 w-3.5 text-primary" /> View Milestone
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 4. MODAL: Event Details Dialog (Google Calendar Event Viewer) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          {selectedEvent && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {getEventStyle(selectedEvent.type).badge}
                  <span className="text-xs font-mono text-muted-foreground">{selectedEvent.date}</span>
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedEvent.course}
                </DialogDescription>
              </DialogHeader>

              {/* Event Metadata Cards */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground block">Scheduled Time</span>
                    <span className="text-muted-foreground">{selectedEvent.time}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-start gap-2.5">
                  <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Course & Syllabus Context</span>
                    <span className="text-muted-foreground">{selectedEvent.course}</span>
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground block">Session Notes & Requirements</span>
                      <p className="text-muted-foreground leading-relaxed">{selectedEvent.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <DialogFooter className="gap-2 sm:gap-0 pt-2 flex flex-col sm:flex-row justify-between">
                <div>
                  {selectedEvent.type === "study_reminder" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReminder(selectedEvent.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl h-9 gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Reminder
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDetailOpen(false)}
                    className="rounded-xl text-xs h-9"
                  >
                    Close
                  </Button>

                  {selectedEvent.type === "live_session" && (
                    <Link to="/student/classroom/class-agentic-101">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl h-9 gap-1.5 shadow-sm">
                        <Video className="h-3.5 w-3.5" /> Join Live Studio
                      </Button>
                    </Link>
                  )}

                  {selectedEvent.type === "assignment_deadline" && (
                    <Link to="/student/assessments">
                      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl h-9 gap-1.5">
                        <FileCheck2 className="h-3.5 w-3.5" /> View Milestone
                      </Button>
                    </Link>
                  )}
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 5. MODAL: Add Personal Study Reminder */}
      <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" /> Add Study Reminder
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add a personal milestone, study block, or preparation alert to your academic calendar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReminder} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Reminder Title *</label>
              <Input
                placeholder="e.g. Read PagedAttention KV-Cache Paper before lecture"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Date</label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 h-9 rounded-xl text-xs cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Time</label>
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="mt-1 h-9 rounded-xl text-xs cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Notes / Reading References</label>
              <textarea
                rows={3}
                placeholder="Key concepts or reading references..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddReminderOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs h-9"
              >
                Save Reminder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
