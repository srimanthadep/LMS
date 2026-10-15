import React, { useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Layers,
  BookOpen,
  Calendar,
  Video,
  Users,
  CreditCard,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UploadCloud,
  Headphones,
  RotateCw,
  TrendingUp,
  ShieldAlert,
  GraduationCap,
  Bell,
  ArrowRight,
  X,
  Search,
  Send,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { RupeeIcon } from "@/components/icons/RupeeIcon";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface PendingStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  batchId: string;
  batchName: string;
  courseTitle: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: "overdue" | "due_soon" | "partial" | "settled";
  lastReminderSent?: string;
}

const INITIAL_PENDING_STUDENTS: PendingStudent[] = [
  {
    id: "stu-pen-1",
    name: "Vikram Singhania",
    email: "vikram.s@alpha.edu",
    phone: "+91 98201 44102",
    batchId: "batch-c7-live",
    batchName: "Cohort 7 (Live + Replay)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    totalFee: 64999,
    paidAmount: 40000,
    pendingAmount: 24999,
    dueDate: "12 Oct 2026",
    status: "overdue",
    lastReminderSent: "13 Oct 2026",
  },
  {
    id: "stu-pen-2",
    name: "Sneha Kapur",
    email: "sneha.k@cloudworks.io",
    phone: "+91 97112 55920",
    batchId: "batch-c8-replay",
    batchName: "Cohort 8 (Replay Only)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    totalFee: 39999,
    paidAmount: 20000,
    pendingAmount: 19999,
    dueDate: "10 Oct 2026",
    status: "overdue",
    lastReminderSent: "11 Oct 2026",
  },
  {
    id: "stu-pen-3",
    name: "Aakash Deshmukh",
    email: "aakash.d@fintech.co",
    phone: "+91 98450 12093",
    batchId: "batch-agents-live",
    batchName: "Agentic Systems Bootcamp",
    courseTitle: "Autonomous Multi-Agent Architectures",
    totalFee: 49999,
    paidAmount: 25000,
    pendingAmount: 24999,
    dueDate: "18 Oct 2026",
    status: "due_soon",
  },
  {
    id: "stu-pen-4",
    name: "Karan Malhotra",
    email: "karan.m@deepai.in",
    phone: "+91 99203 88121",
    batchId: "batch-vision-1",
    batchName: "Computer Vision Alpha",
    courseTitle: "Diffusion Models & Generative Vision",
    totalFee: 54999,
    paidAmount: 35000,
    pendingAmount: 19999,
    dueDate: "20 Oct 2026",
    status: "due_soon",
  },
  {
    id: "stu-pen-5",
    name: "Meenakshi Sundaram",
    email: "meenakshi.s@chennai.ai",
    phone: "+91 94441 33019",
    batchId: "batch-c7-live",
    batchName: "Cohort 7 (Live + Replay)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    totalFee: 64999,
    paidAmount: 50000,
    pendingAmount: 14999,
    dueDate: "24 Oct 2026",
    status: "partial",
  },
  {
    id: "stu-pen-6",
    name: "Rohan Nair",
    email: "rohan.nair@scaleup.org",
    phone: "+91 98190 77412",
    batchId: "batch-agents-live",
    batchName: "Agentic Systems Bootcamp",
    courseTitle: "Autonomous Multi-Agent Architectures",
    totalFee: 49999,
    paidAmount: 30000,
    pendingAmount: 19999,
    dueDate: "09 Oct 2026",
    status: "overdue",
    lastReminderSent: "12 Oct 2026",
  },
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const courses = mockDataService.getCourses();
  const batches = mockDataService.getBatches();
  const liveClasses = mockDataService.getLiveClasses();
  const pendingGrading = mockDataService.getSubmissions().filter((s) => s.status === "pending");

  // Quick Action Modals
  const [activeModal, setActiveModal] = useState<
    "createCourse" | "createBatch" | "enrollStudent" | "scheduleClass" | "uploadContent" | null
  >(null);

  // Form states for modals
  const [newCourseName, setNewCourseName] = useState("");
  const [newBatchName, setNewBatchName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [classTitle, setClassTitle] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Interactive Pending Payments State (In-Dashboard, No Redirect)
  const [showPendingList, setShowPendingList] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>(INITIAL_PENDING_STUDENTS);
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingFilter, setPendingFilter] = useState<"all" | "overdue" | "due_soon" | "partial">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [settleStudent, setSettleStudent] = useState<PendingStudent | null>(null);
  const [settleAmount, setSettleAmount] = useState<string>("");
  const [settleMethod, setSettleMethod] = useState<string>("UPI (Google Pay / PhonePe)");
  const [totalCollected, setTotalCollected] = useState<number>(1845000);

  const totalPendingDue = pendingStudents.reduce((sum, s) => sum + s.pendingAmount, 0);
  const totalPaidByPendingStudents = pendingStudents.reduce((sum, s) => sum + s.paidAmount, 0);

  const handleSendReminder = (student: PendingStudent) => {
    setPendingStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, lastReminderSent: "Today, just now" }
          : s
      )
    );
    setActionSuccess(`Payment reminder dispatched to ${student.name} via SMS and Email (${student.email}).`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleCopyPayLink = (student: PendingStudent) => {
    navigator.clipboard?.writeText?.(`https://pay.lms.ai/invoice/${student.id}`);
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenSettle = (student: PendingStudent) => {
    setSettleStudent(student);
    setSettleAmount(student.pendingAmount.toString());
  };

  const handleConfirmSettlement = () => {
    if (!settleStudent) return;
    const amount = Number(settleAmount);
    if (!amount || amount <= 0) return;

    setPendingStudents((prev) =>
      prev.map((s) => {
        if (s.id !== settleStudent.id) return s;
        const newPaid = s.paidAmount + amount;
        const newPending = Math.max(0, s.pendingAmount - amount);
        return {
          ...s,
          paidAmount: newPaid,
          pendingAmount: newPending,
          status: newPending === 0 ? "settled" : s.status,
        };
      })
    );
    setTotalCollected((prev) => prev + amount);
    setActionSuccess(
      `Successfully recorded payment of ₹${amount.toLocaleString("en-IN")} for ${settleStudent.name} via ${settleMethod}.`
    );
    setSettleStudent(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleBulkReminder = () => {
    const dueCount = pendingStudents.filter((s) => s.pendingAmount > 0).length;
    setActionSuccess(`Automated payment reminders sent to all ${dueCount} learners with outstanding dues.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const filteredPendingStudents = pendingStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      s.batchName.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      s.courseTitle.toLowerCase().includes(pendingSearch.toLowerCase());
    const matchesFilter =
      pendingFilter === "all" ? true : s.status === pendingFilter;
    return matchesSearch && matchesFilter;
  });

  // Content processing items state
  const [processingJobs, setProcessingJobs] = useState([
    {
      id: "job-101",
      title: "Lecture 8: Advanced Agentic RAG Multi-Agent Orchestration",
      batch: "Batch 2026-A",
      stage: "Whisper Transcription (88%)",
      status: "running" as const,
    },
    {
      id: "job-102",
      title: "Workshop 3: LangGraph State Machine Architecture",
      batch: "Batch 2026-Alpha",
      stage: "LLM Chapter & Quiz Generation",
      status: "queued" as const,
    },
    {
      id: "job-103",
      title: "Lecture 6: Vector Indexing & Hybrid Search",
      batch: "Batch 2026-B",
      stage: "Transcode Failed: Frame rate drop at 42:15",
      status: "failed" as const,
    },
  ]);

  const handleRetryJob = (jobId: string) => {
    setProcessingJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, stage: "Retrying transcode...", status: "running" } : j))
    );
    setTimeout(() => {
      setProcessingJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, stage: "Transcoded & Indexed", status: "running" } : j))
      );
    }, 2000);
  };

  const submitQuickAction = (actionName: string) => {
    setActionSuccess(`Action "${actionName}" completed and logged in operational audit trail.`);
    setActiveModal(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="max-w-md xl:max-w-lg">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">
            Cohort management, class scheduling, content ingestion pipeline, and student learning access.
          </p>
        </div>

        {/* 5 Quick Actions - Aligned on a single cohesive horizontal action strip */}
        <div className="flex items-center gap-2 shrink-0 flex-nowrap overflow-x-auto py-0.5 scrollbar-none">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveModal("createCourse")}
            className="h-8.5 px-3 text-xs font-semibold gap-1.5 whitespace-nowrap border-border/80 bg-background hover:bg-muted/60 hover:border-primary/40 hover:text-primary transition-all shrink-0 shadow-2xs"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" /> Course
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveModal("createBatch")}
            className="h-8.5 px-3 text-xs font-semibold gap-1.5 whitespace-nowrap border-border/80 bg-background hover:bg-muted/60 hover:border-primary/40 hover:text-primary transition-all shrink-0 shadow-2xs"
          >
            <Layers className="h-3.5 w-3.5 text-primary shrink-0" /> Batch
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveModal("enrollStudent")}
            className="h-8.5 px-3 text-xs font-semibold gap-1.5 whitespace-nowrap border-border/80 bg-background hover:bg-muted/60 hover:border-primary/40 hover:text-primary transition-all shrink-0 shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 text-primary shrink-0" /> Enroll Student
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveModal("scheduleClass")}
            className="h-8.5 px-3 text-xs font-semibold gap-1.5 whitespace-nowrap border-border/80 bg-background hover:bg-muted/60 hover:border-primary/40 hover:text-primary transition-all shrink-0 shadow-2xs"
          >
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" /> Schedule Class
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveModal("uploadContent")}
            className="h-8.5 px-3 text-xs font-semibold gap-1.5 whitespace-nowrap border-border/80 bg-background hover:bg-muted/60 hover:border-primary/40 hover:text-primary transition-all shrink-0 shadow-2xs"
          >
            <UploadCloud className="h-3.5 w-3.5 text-primary shrink-0" /> Upload Content
          </Button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Bento Row 1: The Exact 5 Mandated Status Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5 items-stretch">
        <StatCard
          index={0}
          title="Total Enrollments"
          value="1,482"
          subtitle="94% live"
          icon={Users}
          trend={{ value: "+48 this wk", isPositive: true }}
        />
        <StatCard
          index={1}
          title="Active Batches"
          value={batches.length.toString()}
          subtitle="4 AI courses"
          icon={Layers}
          trend={{ value: "2 starting", isPositive: true }}
        />
        <StatCard
          index={2}
          title="Total Facultys"
          value="18"
          subtitle="No conflicts"
          icon={GraduationCap}
          trend={{ value: "All active", isPositive: true }}
        />
        <StatCard
          index={3}
          title="Total Payments Collected"
          value={`₹${totalCollected.toLocaleString("en-IN")}`}
          subtitle="94% collected"
          icon={CreditCard}
          trend={{ value: "+12.4%", isPositive: true }}
        />
        <StatCard
          index={4}
          title="Pending Payments"
          value={`₹${totalPendingDue.toLocaleString("en-IN")}`}
          subtitle={`${pendingStudents.filter((s) => s.pendingAmount > 0).length} due`}
          icon={AlertTriangle}
          trend={{ value: showPendingList ? "List Open ▲" : "Click to view ▼", isPositive: false }}
          onClick={() => setShowPendingList((prev) => !prev)}
          isActive={showPendingList}
          className="cursor-pointer ring-offset-2 transition-all"
        />
      </div>

      {/* Interactive In-Dashboard Pending Payments List (No Redirection) */}
      {showPendingList && (
        <div className="rounded-2xl border-2 border-primary/40 bg-card shadow-sm p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Header with Title, Quick Actions & Close Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                  Dashboard Inspection Panel
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  {pendingStudents.filter((s) => s.pendingAmount > 0).length} Learners with Pending Tuition
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2 mt-1">
                <CreditCard className="h-5 w-5 text-primary" /> Students with Pending Payments
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect outstanding dues, dispatch SMS & Email payment reminders, copy direct invoice links, or record a settlement directly here without leaving the dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkReminder}
                className="h-8 text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Send className="h-3 w-3" /> Remind All Pending
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPendingList(false)}
                className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1 border border-border/70"
                title="Collapse List"
              >
                <X className="h-3.5 w-3.5" /> Close
              </Button>
            </div>
          </div>

          {/* Metric Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Total Pending Due</div>
              <div className="text-base sm:text-lg font-bold text-primary font-mono tabular-nums">
                ₹{totalPendingDue.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Total Collected So Far</div>
              <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                ₹{totalPaidByPendingStudents.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Overdue Invoices</div>
              <div className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
                {pendingStudents.filter((s) => s.status === "overdue" && s.pendingAmount > 0).length} Urgent
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Clearance Progress</div>
              <div className="text-base sm:text-lg font-bold text-foreground font-mono tabular-nums">
                {Math.round((totalPaidByPendingStudents / (totalPaidByPendingStudents + totalPendingDue)) * 100)}% Paid
              </div>
            </div>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search student name, batch, course, or email..."
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium shrink-0">Filter:</span>
              <div className="inline-flex rounded-lg border border-border p-0.5 bg-background text-xs">
                {(["all", "overdue", "due_soon", "partial"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPendingFilter(filter)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors capitalize",
                      pendingFilter === filter
                        ? "bg-primary text-white shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter === "all" ? "All" : filter === "due_soon" ? "Due Soon" : filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Students Table */}
          <div className="rounded-xl border border-border/70 overflow-x-auto bg-background">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border/70 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-3">Batch & Course</th>
                  <th className="py-2.5 px-3 text-right">Total Fee</th>
                  <th className="py-2.5 px-3 text-right">How Much Paid</th>
                  <th className="py-2.5 px-3 text-right">How Much Pending</th>
                  <th className="py-2.5 px-3">Due Status</th>
                  <th className="py-2.5 px-4 text-center">Dashboard Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPendingStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No student records matching your search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredPendingStudents.map((s) => {
                    const pctPaid = Math.round((s.paidAmount / s.totalFee) * 100);
                    return (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {s.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="font-bold text-foreground text-xs">{s.name}</div>
                              <div className="text-[11px] text-muted-foreground font-mono">{s.email}</div>
                              <div className="text-[10px] text-muted-foreground">{s.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-foreground text-xs">{s.batchName}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1">{s.courseTitle}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-foreground">
                          ₹{s.totalFee.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            ₹{s.paidAmount.toLocaleString("en-IN")}
                          </div>
                          <div className="w-24 ml-auto mt-1 bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full"
                              style={{ width: `${pctPaid}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{pctPaid}% cleared</div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-extrabold font-mono text-sm text-primary">
                            ₹{s.pendingAmount.toLocaleString("en-IN")}
                          </div>
                          <div className="text-[10px] text-muted-foreground">due by {s.dueDate}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-1">
                            {s.pendingAmount === 0 ? (
                              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 font-bold w-fit">
                                Fully Cleared
                              </Badge>
                            ) : s.status === "overdue" ? (
                              <Badge variant="destructive" className="text-[10px] font-bold w-fit">
                                Overdue
                              </Badge>
                            ) : s.status === "due_soon" ? (
                              <Badge variant="warning" className="text-[10px] font-bold w-fit">
                                Due Soon
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30 w-fit">
                                Partial
                              </Badge>
                            )}
                            {s.lastReminderSent && (
                              <span className="text-[9px] text-muted-foreground">
                                Reminded: {s.lastReminderSent}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleOpenSettle(s)}
                              disabled={s.pendingAmount === 0}
                              className="h-7 px-2.5 text-[11px] font-bold gap-1 shadow-2xs bg-primary hover:bg-primary/90 text-primary-foreground"
                              title="Record payment settlement in dashboard"
                            >
                              <CreditCard className="h-3 w-3" /> Record Payment
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(s)}
                              disabled={s.pendingAmount === 0}
                              className="h-7 px-2 text-[11px] font-semibold gap-1 text-muted-foreground hover:text-foreground"
                              title="Send payment reminder SMS & Email"
                            >
                              <Send className="h-3 w-3" /> Remind
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyPayLink(s)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              title="Copy payment link"
                            >
                              {copiedId === s.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bento Grid Layout: Upcoming Schedule (Featured Tile) + Content Pipeline & Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FEATURED TILE: Upcoming Schedule & Live Classroom Monitor (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider">
                    Featured Operations Tile
                  </Badge>
                  <span className="text-xs text-muted-foreground">• Today's Broadcasting Timetable</span>
                </div>
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2 mt-1">
                  <Calendar className="h-5 w-5 text-primary" /> Upcoming Lectures & Studio Status
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/admin/schedule")}
                className="text-xs h-8 text-primary font-semibold gap-1"
              >
                Full Calendar <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-3">
              {liveClasses.map((cls) => (
                <div
                  key={cls.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    cls.status === "live"
                      ? "border-primary/50 bg-primary/5 shadow-xs"
                      : "border-border/70 bg-card hover:bg-muted/20"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{cls.title}</span>
                      {cls.status === "live" ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-primary animate-pulse">
                          <span className="h-2 w-2 rounded-full bg-primary" /> LIVE ON-AIR
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                          SCHEDULED
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Batch: <strong className="text-foreground">{cls.batchName}</strong> • Faculty: {cls.instructorName}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                      <span>⏰ {cls.scheduledAt} ({cls.durationMinutes}m)</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● No Schedule Conflicts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cls.status === "live" ? (
                      <Button
                        size="sm"
                        onClick={() => navigate("/admin/live-monitor")}
                        className="h-8 text-xs font-bold gap-1 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Video className="h-3 w-3" /> Live Studio
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/admin/schedule")}
                        className="h-8 text-xs font-semibold"
                      >
                        Check Audio/Video
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Cohort Entitlements & Recording Delays */}
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" /> Cohort Learning Entitlements & Release Delay
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Controlled release parameters: Live vs Replay-only configurations
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/admin/enrollments")}
                className="text-xs h-8 text-primary font-semibold gap-1"
              >
                Access Matrix <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-3">
              {batches.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{b.name}</span>
                      <Badge
                        variant={b.entitlement.accessType === "live_and_replay" ? "accent" : "warning"}
                        className="text-[10px] font-bold"
                      >
                        {b.entitlement.accessType === "live_and_replay" ? "Live + Replay" : "Replay Only"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {b.courseTitle} • Lead: {b.teacherName}
                    </p>
                    <div className="flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
                      <span>Seats Filled: <strong>{b.enrolledCount} / {b.maxSeats}</strong></span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        Replay Delay: {b.entitlement.replayReleaseDelayHours}h post-broadcast
                      </span>
                      <span>Valid Till: {b.entitlement.accessExpiryDate}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/batches/${b.id}`)}
                    className="h-8 text-xs shrink-0 font-semibold"
                  >
                    Adjust Entitlement
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Content Pipeline, Pending Tasks & Support Escalations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Content Processing & Transcoding Pipeline */}
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
            <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-primary animate-spin" /> Recording Processing Pipeline
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Whisper transcription and chapter generation</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/admin/content-ops")}
                className="text-xs h-7 text-primary font-semibold"
              >
                All Jobs
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {processingJobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    job.status === "failed"
                      ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20"
                      : "border-border/70 bg-muted/20"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-foreground line-clamp-1">{job.title}</span>
                    <Badge
                      variant={job.status === "failed" ? "destructive" : job.status === "running" ? "default" : "outline"}
                      className="text-[9px] uppercase px-1 py-0 shrink-0"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{job.batch}</span>
                    <span className="font-mono text-foreground font-medium">{job.stage}</span>
                  </div>
                  {job.status === "failed" && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                        Action: Worker retry available
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetryJob(job.id)}
                        className="h-6 text-[10px] px-2 font-bold border-rose-300 text-rose-700 hover:bg-rose-100"
                      >
                        <RotateCw className="h-2.5 w-2.5 mr-1" /> Retry Ingestion
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Tasks & Operational Approvals Queue */}
          <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Pending Operational Approvals
              </h4>
              <Badge variant="warning" className="text-[10px]">
                6 Action Required
              </Badge>
            </div>
            <div className="space-y-2">
              {[
                { title: "Batch Transfer: Rahul Verma", desc: "Batch 2026-A to 2026-B (Work Conflict)", badge: "Transfer" },
                { title: "Access Extension: Neha Gupta", desc: "+30 days medical extension request", badge: "Access" },
                { title: "100% Refund Approval: Vikram Rao", desc: "₹24,999 - Day 4 cancellation policy", badge: "Refund" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/20 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">{item.title}</span>
                    <Badge variant="outline" className="text-[9px] uppercase border-primary/20 text-primary">
                      {item.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <Button
              size="sm"
              onClick={() => navigate("/admin/approvals")}
              className="w-full h-8 text-xs font-bold gap-1.5"
            >
              Open Approvals Queue <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Card>

          {/* Recent Support Escalations & Unresolved Inquiries */}
          <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" /> Urgent Student Escalations
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">STU-1082: Zoom Auth Failed</span>
                  <Badge variant="warning" className="text-[9px]">
                    High Priority
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  OAuth token expired during live lab session for Batch 2026-A.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">STU-2041: Certificate Name Typo</span>
                  <Badge variant="outline" className="text-[9px]">
                    Normal
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Requested spelling correction for verifiable credential on AI Engineering.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* QUICK ACTION MODALS (Create Course, Create Batch, Enroll Student, Schedule Class, Upload Content) */}
      {/* 1. Create Course Modal */}
      <Dialog open={activeModal === "createCourse"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <BookOpen className="h-5 w-5 text-primary" /> Create New AI Course
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add a new course curriculum to the institution master catalog.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Course Title</label>
              <Input
                placeholder="e.g. LLM Multi-Agent System Engineering"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Tuition Fee (₹)</label>
              <Input placeholder="24999" type="number" className="mt-1 h-9 text-xs" />
            </div>
            <div>
              <label className="font-semibold text-foreground">Curriculum Modules Count</label>
              <Input placeholder="8 Modules" className="mt-1 h-9 text-xs" />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setActiveModal(null)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={() => submitQuickAction("Create Course")} className="h-8 text-xs font-bold">
                Publish Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Create Batch Modal */}
      <Dialog open={activeModal === "createBatch"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Layers className="h-5 w-5 text-primary" /> Create Cohort Batch
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure batch dates, lead instructor, and entitlement permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Batch Identifier</label>
              <Input
                placeholder="e.g. Batch 2026-Gamma (Weekend)"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Associated Course</label>
              <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs">
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Lead Teacher Allocation</label>
              <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs">
                <option>Dr. Ramesh Kumar (Lead)</option>
                <option>Dr. Vikram Mehta (Senior AI Scientist)</option>
                <option>Ananya Sen (Staff ML Engineer)</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setActiveModal(null)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={() => submitQuickAction("Create Cohort Batch")} className="h-8 text-xs font-bold">
                Launch Batch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Enroll Student Modal */}
      <Dialog open={activeModal === "enrollStudent"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Users className="h-5 w-5 text-primary" /> Enroll Student in Cohort
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign a student account to a batch with specified entitlement tier.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Student Email</label>
              <Input
                placeholder="student@example.com"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Assign To Batch</label>
              <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs">
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.courseTitle})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Entitlement Access Type</label>
              <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs">
                <option value="live_and_replay">Live Broadcast + Unlimited Replay</option>
                <option value="replay_only">Replay Only (Delayed Release)</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setActiveModal(null)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={() => submitQuickAction("Enroll Student")} className="h-8 text-xs font-bold">
                Grant Access
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Schedule Class Modal */}
      <Dialog open={activeModal === "scheduleClass"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Calendar className="h-5 w-5 text-primary" /> Schedule Live Lecture
            </DialogTitle>
            <DialogDescription className="text-xs">
              Schedule live virtual room with conflict checks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Class Topic</label>
              <Input
                placeholder="e.g. Fine-Tuning Llama 3 with LoRA & Unsloth"
                value={classTitle}
                onChange={(e) => setClassTitle(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-foreground">Date</label>
                <Input type="date" className="mt-1 h-9 text-xs" defaultValue="2026-10-16" />
              </div>
              <div>
                <label className="font-semibold text-foreground">Time (IST)</label>
                <Input type="time" className="mt-1 h-9 text-xs" defaultValue="19:00" />
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Faculty schedule availability verified. No room collisions.
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setActiveModal(null)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={() => submitQuickAction("Schedule Live Class")} className="h-8 text-xs font-bold">
                Schedule & Notify Cohort
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. Upload Content Modal */}
      <Dialog open={activeModal === "uploadContent"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <UploadCloud className="h-5 w-5 text-primary" /> Ingest Learning Content
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload video lecture or lesson notes to S3/Cloudflare R2 storage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Target Batch / Course</label>
              <select className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs">
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 cursor-pointer">
              <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">Click to select MP4 video or PDF notes</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Supports 4K video up to 5GB, PDF up to 100MB</p>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setActiveModal(null)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={() => submitQuickAction("Upload Content")} className="h-8 text-xs font-bold">
                Start Ingestion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick In-Dashboard Tuition Settlement Dialog */}
      <Dialog open={!!settleStudent} onOpenChange={(open) => !open && setSettleStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <CreditCard className="h-5 w-5 text-primary" /> Record Tuition Settlement
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record fee collection for {settleStudent?.name} ({settleStudent?.batchName}). Updates dashboard metrics immediately without reload.
            </DialogDescription>
          </DialogHeader>
          {settleStudent && (
            <div className="space-y-3.5 text-xs pt-1">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="font-semibold text-foreground text-right line-clamp-1">{settleStudent.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Course Fee:</span>
                  <span className="font-bold text-foreground font-mono">₹{settleStudent.totalFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Already Paid:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{settleStudent.paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-1">
                  <span className="font-semibold text-foreground">Current Balance Due:</span>
                  <span className="font-extrabold text-primary font-mono text-sm">₹{settleStudent.pendingAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground">Collection Amount (₹)</label>
                <Input
                  type="number"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  max={settleStudent.pendingAmount}
                  className="mt-1 h-9 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground">Payment Mode / Settlement Channel</label>
                <select
                  value={settleMethod}
                  onChange={(e) => setSettleMethod(e.target.value)}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe)</option>
                  <option value="Direct Bank NEFT / IMPS">Direct Bank NEFT / IMPS</option>
                  <option value="Credit / Debit Card (POS)">Credit / Debit Card (POS)</option>
                  <option value="Cash / Cheque Deposit">Cash / Cheque Deposit</option>
                  <option value="Scholarship / Fee Waiver">Scholarship / Fee Waiver Adjustment</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setSettleStudent(null)} className="h-8 text-xs">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmSettlement}
                  className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Confirm Settlement
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
