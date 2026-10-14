import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck2,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Eye,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Layers,
  Flame,
  Send,
  Zap,
  BookOpen,
  Check,
  Bell,
  RefreshCw,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const EvaluatorDashboard: React.FC = () => {
  const [submissions] = useState(mockDataService.getSubmissions());
  const [dismissNotification, setDismissNotification] = useState(false);

  const pendingSubmissions = submissions.filter((s) => s.status === "pending" || s.status === "draft");
  const completedSubmissions = submissions.filter((s) => s.status === "graded");
  const overdueSubmissions = submissions.filter((s) => s.isOverdue);
  const reassessmentSubmissions = submissions.filter((s) => s.status === "re_evaluation_requested");

  // Next prioritized submission
  const nextSubmission = overdueSubmissions[0] || pendingSubmissions[0] || submissions[0];

  // Course workload distribution stats
  const coursesWorkload = [
    { name: "Full-Stack AI & LLM Systems", pending: 3, completed: 42, color: "bg-emerald-500" },
    { name: "Autonomous Multi-Agent Architectures", pending: 1, completed: 28, color: "bg-violet-500" },
    { name: "Diffusion Models & Generative Vision", pending: 1, completed: 19, color: "bg-blue-500" },
    { name: "Production MLOps & Vector Infra", pending: 0, completed: 34, color: "bg-amber-500" },
  ];

  const totalAssignedAssessments = 5;

  return (
    <div className="space-y-6">
      {/* Welcome & Next Submission Hero */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
              Evaluator Workstation • Q4 Cycle
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Queue Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Evaluation Hub
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Review milestone repositories, subjective prompts, and rubric grading pipelines with AI-assisted proposals.
          </p>
        </div>

        {/* Quick Access to Next Submission */}
        {nextSubmission && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Flame className="h-4 w-4 text-amber-500" />
                <span>Next in Queue:</span>
              </div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-xs">
                {nextSubmission.testTitle}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {nextSubmission.isOverdue ? (
                  <span className="text-rose-600 font-bold">Overdue SLA</span>
                ) : (
                  <span>{nextSubmission.slaTimeRemaining || "Due soon"}</span>
                )}
              </p>
            </div>
            <Link to={`/evaluator/grading/${nextSubmission.id}`}>
              <Button size="sm" className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold text-xs">
                <Zap className="h-3.5 w-3.5" /> Start Grading
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Notifications / SLA Alerts */}
      {!dismissNotification && (overdueSubmissions.length > 0 || reassessmentSubmissions.length > 0) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Attention Required:</span> You have{" "}
              {overdueSubmissions.length > 0 && (
                <strong className="text-rose-600 dark:text-rose-400">
                  {overdueSubmissions.length} overdue evaluation{overdueSubmissions.length > 1 ? "s" : ""}
                </strong>
              )}
              {overdueSubmissions.length > 0 && reassessmentSubmissions.length > 0 && " and "}
              {reassessmentSubmissions.length > 0 && (
                <strong>{reassessmentSubmissions.length} contestation / regrading request</strong>
              )}
              .
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {reassessmentSubmissions.length > 0 && (
              <Link to="/evaluator/reassessments">
                <Button size="sm" variant="outline" className="border-amber-500/40 text-xs gap-1 bg-white dark:bg-zinc-900">
                  Review Reassessment <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissNotification(true)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* KPI Stat Cards (6 Key Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Assigned Tests"
          value={totalAssignedAssessments}
          icon={BookOpen}
          trend={{ value: "Across 4 Courses", isPositive: true }}
        />
        <StatCard
          title="Pending Queue"
          value={pendingSubmissions.length}
          icon={Clock}
          trend={{ value: "SLA Active", isPositive: false }}
          highlight
        />
        <StatCard
          title="Completed"
          value={completedSubmissions.length + 120}
          icon={CheckCircle2}
          trend={{ value: "+14 this week", isPositive: true }}
        />
        <StatCard
          title="Overdue"
          value={overdueSubmissions.length}
          icon={AlertCircle}
          trend={{ value: overdueSubmissions.length > 0 ? "Urgent Action" : "Zero Overdue", isPositive: overdueSubmissions.length === 0 }}
        />
        <StatCard
          title="Turnaround"
          value="3.8 hrs"
          icon={TrendingUp}
          trend={{ value: "Goal < 24 hrs", isPositive: true }}
        />
        <StatCard
          title="AI Concordance"
          value="94.8%"
          icon={Sparkles}
          trend={{ value: "High Calibration", isPositive: true }}
        />
      </div>

      {/* Main Grid: Priority Queue & Evaluation Workload Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Submissions Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-zinc-200/80 dark:border-zinc-800">
            <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Priority Submissions Queue
                </CardTitle>
                <CardDescription className="text-xs">
                  Active student milestone repositories awaiting rubric scoring and code review.
                </CardDescription>
              </div>
              <Link to="/evaluator/queue">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-emerald-600 hover:text-emerald-700">
                  Full Queue ({submissions.length}) <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-200/70 dark:divide-zinc-800">
              {submissions.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        {sub.studentName}
                      </span>
                      {sub.status === "graded" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]">
                          Graded ({sub.totalScore}/{sub.maxScore})
                        </Badge>
                      )}
                      {sub.status === "pending" && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[11px]">
                          Pending Review
                        </Badge>
                      )}
                      {sub.status === "draft" && (
                        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[11px]">
                          Draft Saved
                        </Badge>
                      )}
                      {sub.status === "re_evaluation_requested" && (
                        <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[11px]">
                          Reassessment Requested
                        </Badge>
                      )}
                      {sub.isOverdue && (
                        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[11px] font-bold">
                          Overdue SLA
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {sub.testTitle}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {sub.courseTitle} • {sub.batchName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {sub.aiSuggestedScore && (
                      <div className="text-right text-xs hidden sm:block">
                        <span className="text-muted-foreground block text-[10px]">
                          AI Calibration
                        </span>
                        <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
                          {sub.aiSuggestedScore} pts
                        </span>
                      </div>
                    )}
                    <Link to={`/evaluator/grading/${sub.id}`}>
                      <Button
                        size="sm"
                        variant={sub.status === "graded" ? "outline" : "default"}
                        className={
                          sub.status === "graded"
                            ? "text-xs"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium"
                        }
                      >
                        {sub.status === "graded" ? "Review Grade" : sub.status === "draft" ? "Resume Draft" : "Start Grading"}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Workload Progress & Deadlines Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Workload Distribution Chart */}
          <Card className="border-zinc-200/80 dark:border-zinc-800">
            <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  Workload by Course
                </CardTitle>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  {pendingSubmissions.length} pending total
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {coursesWorkload.map((cw, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate max-w-[200px]">
                      {cw.name}
                    </span>
                    <span className="font-mono text-muted-foreground text-[11px]">
                      <strong className="text-foreground">{cw.pending}</strong> / {cw.pending + cw.completed}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cw.color} rounded-full`}
                      style={{
                        width: `${Math.round((cw.completed / (cw.pending + cw.completed || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Overall SLA Adherence</span>
                <span className="font-bold text-emerald-600">96.4% On-Time</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Evaluation Deadlines */}
          <Card className="border-zinc-200/80 dark:border-zinc-800">
            <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Milestone 2 SLA Window</span>
                  <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-600 border-rose-500/30">
                    Today 06:00 PM
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Cohort 7 (Live + Replay) • 2 submissions remaining
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Agentic Systems Capstone 1</span>
                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                    Tomorrow 11:59 PM
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Agentic Systems Bootcamp • 1 submission remaining
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Generative Vision Lab 3</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    In 3 Days
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Weekend Cohort • Draft saved
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
