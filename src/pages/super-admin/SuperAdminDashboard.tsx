import React, { useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Cpu,
  ShieldCheck,
  Zap,
  Server,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Play,
  Settings,
  RefreshCw,
  FileText,
  Video,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { RupeeIcon } from "@/components/icons/RupeeIcon";

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const auditLogs = mockDataService.getAuditLogs();
  const liveClasses = mockDataService.getLiveClasses().filter((c) => c.status === "live");

  // AI Processing Job state
  const [retrySuccess, setRetrySuccess] = useState(false);
  const [retryingJob, setRetryingJob] = useState(false);
  const [failedJobsCount, setFailedJobsCount] = useState(1);

  const handleRetryFailedJob = () => {
    setRetryingJob(true);
    setTimeout(() => {
      setRetryingJob(false);
      setFailedJobsCount(0);
      setRetrySuccess(true);
      setTimeout(() => setRetrySuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Super Admin Platform Governance
            <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wide">
              100% Operational
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Enterprise multi-tenant control, AI compute quotas, platform security, and operational telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/super-admin/settings")}
            className="text-xs h-9 gap-1 font-semibold cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-primary" /> Global Settings
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/super-admin/audit-logs")}
            className="text-xs h-9 font-semibold gap-1 cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" /> Audit Reports
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/super-admin/users")}
            className="text-xs h-9 font-bold gap-1 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <Users className="h-3.5 w-3.5" /> Add Staff / User
          </Button>
        </div>
      </div>

      {/* FEATURED BENTO TILE 1: Prominent Platform Health & Infrastructure Tile */}
      <Card className="rounded-2xl border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Global Infrastructure Status
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                Cluster: ap-south-1 (Mumbai)
              </Badge>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              All 14 Core Services Operating Within SLA
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time WebRTC media servers, Qdrant vector retrieval, OpenAI fine-tuned grading pipeline, and Razorpay webhook reconciliation are nominal with 0 active incidents.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Cluster Uptime
              </span>
              <p className="text-lg font-extrabold text-foreground mt-0.5">99.98%</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">30d SLA Met</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                API Latency
              </span>
              <p className="text-lg font-extrabold text-foreground mt-0.5">24 ms</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">p95 gateway</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Vector QPS
              </span>
              <p className="text-lg font-extrabold text-foreground mt-0.5">142 /s</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Cosine 1536d</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Security Shield
              </span>
              <p className="text-lg font-extrabold text-foreground mt-0.5">Enforced</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">2FA Required</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Compact Operational Metric Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
        <StatCard
          index={0}
          title="Total Active Learners"
          value="892"
          subtitle="Across 6 concurrent batches"
          icon={Users}
          trend={{ value: "+14% this month", isPositive: true }}
          highlight
        />
        <StatCard
          index={1}
          title="LLM Token Usage (30d)"
          value="42.8M"
          subtitle="GPT-4o & Claude 3.5 Sonnet"
          icon={Cpu}
          trend={{ value: "₹48,200 spend", isPositive: true }}
        />
        <StatCard
          index={2}
          title="Live Sessions Running"
          value={liveClasses.length.toString()}
          subtitle="72 current student viewers"
          icon={Zap}
          trend={{ value: "0 packet drops", isPositive: true }}
        />
        <StatCard
          index={3}
          title="Platform Revenue (MTD)"
          value="₹18,45,000"
          subtitle="Via Razorpay gateway"
          icon={RupeeIcon}
          trend={{ value: "+22% YoY", isPositive: true }}
        />
      </div>

      {/* Bento Grid: 2-columns (Operations & AI Queue on Left, Security & Audit Stream on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI-Processing Jobs Tile */}
          <Card className="rounded-2xl border-border/80 bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" /> AI Transcription & Processing Queue
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Whisper ASR speech-to-text, vector embeddings, and rubric autograding tasks.
                </p>
              </div>

              {failedJobsCount > 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRetryFailedJob}
                  disabled={retryingJob}
                  className="h-8 text-xs font-semibold gap-1 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                >
                  <RotateCcw className={`h-3 w-3 ${retryingJob ? "animate-spin" : ""}`} />
                  {retryingJob ? "Retrying Job..." : `Retry Failed Job (${failedJobsCount})`}
                </Button>
              ) : (
                <Badge variant="success" className="text-[10px] gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Queue Healthy
                </Badge>
              )}
            </div>

            {retrySuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Job <code>#job-wh-912</code> was successfully requeued and processed. Audio transcript & timestamps synchronized.</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-semibold">Queued</span>
                <span className="text-base font-extrabold text-foreground">3 Jobs</span>
                <span className="text-[10px] text-muted-foreground block">Waiting for GPU slot</span>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-semibold">Running Now</span>
                <span className="text-base font-extrabold text-primary">2 Jobs</span>
                <span className="text-[10px] text-primary block">Lecture 14 Video HLS</span>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-semibold">Failed</span>
                <span className={`text-base font-extrabold ${failedJobsCount > 0 ? "text-rose-600" : "text-foreground"}`}>
                  {failedJobsCount} Job
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {failedJobsCount > 0 ? "Whisper audio timeout" : "All clean"}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-semibold">Completed (24h)</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">142 Jobs</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">100% indexed</span>
              </div>
            </div>
          </Card>

          {/* Active Live Class Monitoring Card */}
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Virtual Classroom Concurrency
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time audio/video bitrate and participant concurrency
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/admin/live-monitor")}
                className="text-xs h-8 gap-1 text-primary font-semibold cursor-pointer"
              >
                Live Monitor <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              {liveClasses.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No active sessions streaming at this moment.
                </p>
              ) : (
                liveClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{cls.title}</span>
                        <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4 bg-primary text-primary-foreground">
                          LIVE
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Instructor: <strong>{cls.instructorName}</strong> • Batch: {cls.batchName}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                        <span>Active Viewers: <strong>{cls.viewerCount}</strong></span>
                        <span>Topic: <strong>{cls.activeTopic}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/teacher/classroom/${cls.id}`)}
                        className="h-8 text-xs font-bold gap-1 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      >
                        <Play className="h-3 w-3" /> Observe Stream
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {/* Infrastructure telemetry */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-border/70 bg-card">
                  <p className="text-[11px] text-muted-foreground">Whisper ASR Latency</p>
                  <p className="text-base font-bold text-foreground mt-0.5">850 ms</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Sub-second</span>
                </div>
                <div className="p-3 rounded-xl border border-border/70 bg-card">
                  <p className="text-[11px] text-muted-foreground">Milvus Vector Node</p>
                  <p className="text-base font-bold text-foreground mt-0.5">14.2 ms</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">p99 query SLA</span>
                </div>
                <div className="p-3 rounded-xl border border-border/70 bg-card">
                  <p className="text-[11px] text-muted-foreground">WebRTC TURN Health</p>
                  <p className="text-base font-bold text-foreground mt-0.5">100%</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Zero lost</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Persona View-As-User Simulation Quick Launcher */}
          <Card className="border-border/80 shadow-xs rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-600" /> View-As-User Persona Simulator
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspect student course views, evaluator blinded rubrics, and faculty studios in a safe read-only sandbox.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/super-admin/users")}
                className="text-xs h-8 shrink-0 font-semibold border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
              >
                Select User to Impersonate
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (1 col): Live Security Audit Stream & Active API Connectors */}
        <div className="space-y-6">
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden h-full flex flex-col justify-between">
            <div>
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" />
                  Live Security Audit Trail
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/super-admin/audit-logs")}
                  className="text-xs h-7 text-primary p-0 cursor-pointer"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl border border-border/60 bg-muted/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground truncate max-w-[170px]">{log.action}</span>
                      <Badge
                        variant={log.status === "success" ? "success" : "warning"}
                        className="text-[9px] px-1 py-0"
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {log.details}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                      <span>By {log.actorName}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>

            {/* Integrations Health Capsule */}
            <div className="p-4 border-t border-border/70 bg-muted/10 m-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">API Connectors</span>
                <Badge variant="success" className="text-[9px]">4 / 4 Active</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>OpenAI GPT-4o</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Anthropic Claude</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Razorpay Gateway</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>100ms Video SDK</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
