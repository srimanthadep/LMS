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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { RupeeIcon } from "@/components/icons/RupeeIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cohort management, class scheduling, content ingestion pipeline, and student learning access.
          </p>
        </div>

        {/* 5 Quick Actions Mandated by DPR */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setActiveModal("createCourse")}
            className="text-xs h-9 font-bold gap-1 shadow-xs"
          >
            <BookOpen className="h-3.5 w-3.5" /> + Course
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveModal("createBatch")}
            className="text-xs h-9 font-bold gap-1 shadow-xs"
          >
            <Layers className="h-3.5 w-3.5" /> + Batch
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveModal("enrollStudent")}
            className="text-xs h-9 font-bold gap-1 shadow-xs"
          >
            <Users className="h-3.5 w-3.5" /> + Enroll Student
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveModal("scheduleClass")}
            className="text-xs h-9 font-semibold gap-1"
          >
            <Calendar className="h-3.5 w-3.5" /> Schedule Class
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveModal("uploadContent")}
            className="text-xs h-9 font-semibold gap-1"
          >
            <UploadCloud className="h-3.5 w-3.5" /> Upload Content
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

      {/* Bento Row 1: Key Operational Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5 items-stretch">
        <StatCard
          index={0}
          title="Active Students"
          value="1,482"
          subtitle="94% live attendance"
          icon={Users}
          trend={{ value: "+48 this week", isPositive: true }}
          highlight
        />
        <StatCard
          index={1}
          title="Active Batches"
          value={batches.length.toString()}
          subtitle="Across 4 AI courses"
          icon={Layers}
          trend={{ value: "2 cohorts starting", isPositive: true }}
        />
        <StatCard
          index={2}
          title="Faculty Instructors"
          value="18 Active"
          subtitle="0 timetable conflicts"
          icon={GraduationCap}
          trend={{ value: "All confirmed", isPositive: true }}
        />
        <StatCard
          index={3}
          title="Pending Payments"
          value="₹1,24,500"
          subtitle="6 student invoices due"
          icon={CreditCard}
          trend={{ value: "Follow-up queued", isPositive: false }}
        />
        <StatCard
          index={4}
          title="Pending Approvals"
          value="6 Requests"
          subtitle="Transfers & extensions"
          icon={Clock}
          trend={{ value: "Action required", isPositive: false }}
        />
      </div>

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
    </div>
  );
};
