import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Flame,
  Zap,
  SlidersHorizontal,
  Layers,
  Calendar,
  Hourglass,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { TestSubmission } from "@/types/lms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SubmissionsQueuePage: React.FC = () => {
  const [submissions] = useState<TestSubmission[]>(mockDataService.getSubmissions());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assessmentFilter, setAssessmentFilter] = useState("all");
  const [isBlindGrading, setIsBlindGrading] = useState(true);
  const [priorityOnly, setPriorityOnly] = useState(false);

  const filtered = submissions
    .filter((s) => {
      const matchesSearch =
        s.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (assessmentFilter !== "all" && s.testId !== assessmentFilter) return false;
      if (priorityOnly && s.priority !== "urgent" && !s.isOverdue) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort overdue first, then urgent, then pending
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      if (a.priority === "urgent" && b.priority !== "urgent") return -1;
      if (a.priority !== "urgent" && b.priority === "urgent") return 1;
      return 0;
    });

  const pendingCount = submissions.filter((s) => s.status === "pending" || s.status === "draft").length;
  const overdueCount = submissions.filter((s) => s.isOverdue).length;
  const urgentCount = submissions.filter((s) => s.priority === "urgent").length;

  // Estimated grading workload: ~15 mins per pending submission
  const estimatedHours = (pendingCount * 0.25).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Evaluation Queue & SLA Deadlines
            </h1>
            <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
              {pendingCount} Pending Reviews
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Prioritized submission queue with SLA countdown timers, blind grading protection, and workload estimates.
          </p>
        </div>

        {/* Action Controls: Blind Grading & Workload estimate */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-muted-foreground">
            <Hourglass className="h-3.5 w-3.5 text-emerald-600" />
            <span>Est. Queue Clearance: <strong>{estimatedHours} hrs</strong></span>
          </div>

          <Button
            variant={isBlindGrading ? "default" : "outline"}
            size="sm"
            onClick={() => setIsBlindGrading(!isBlindGrading)}
            className={
              isBlindGrading
                ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-2 text-xs"
                : "gap-2 text-xs"
            }
          >
            {isBlindGrading ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-emerald-400" />
                Blind Grading Active
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Identified Names Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SLA Alert Strip if Overdue or Urgent exist */}
      {(overdueCount > 0 || urgentCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400">Overdue SLA:</span>{" "}
                {overdueCount} submission requires immediate grading
              </div>
            </div>
            <Badge className="bg-rose-600 text-white text-[10px]">Overdue</Badge>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400">Due Today:</span>{" "}
                {urgentCount} submissions expire within 6 hours
              </div>
            </div>
            <Badge className="bg-amber-600 text-white text-[10px]">Priority</Badge>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">Turnaround Benchmark:</span>{" "}
                96.4% graded within 24h SLA target
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px]">Healthy</Badge>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by candidate token or milestone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Assessment Filter */}
            <select
              value={assessmentFilter}
              onChange={(e) => setAssessmentFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Assessments</option>
              <option value="test-rag-eval">Milestone 2: Hybrid RAG</option>
              <option value="test-agent-graph">Capstone 1: Multi-Agent Graph</option>
              <option value="test-lora-tuning">Lab 4: Llama-3 LoRA</option>
              <option value="test-diff-vision">Milestone 3: ControlNet</option>
              <option value="test-mlops-k8s">Capstone 2: Triton K8s</option>
            </select>

            {/* Status Filter Tabs */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs">
                  All ({submissions.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="draft" className="text-xs">
                  Drafts
                </TabsTrigger>
                <TabsTrigger value="graded" className="text-xs">
                  Graded
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              size="sm"
              variant={priorityOnly ? "default" : "outline"}
              onClick={() => setPriorityOnly(!priorityOnly)}
              className={
                priorityOnly
                  ? "bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1"
                  : "text-xs gap-1"
              }
            >
              <Flame className="h-3.5 w-3.5" /> Urgent Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Queue Table */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Candidate Submissions
            </CardTitle>
            <CardDescription className="text-xs">
              Showing {filtered.length} submission{filtered.length === 1 ? "" : "s"} ordered by deadline urgency.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-zinc-200/70 dark:divide-zinc-800">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <div className="font-semibold text-foreground text-sm">Queue is empty</div>
              <p>No submissions match your active filter criteria.</p>
            </div>
          ) : (
            filtered.map((sub) => {
              const displayStudentName = isBlindGrading
                ? sub.studentName.replace(/^[^(]+/, "").trim() || `Candidate #${sub.id.toUpperCase()}`
                : sub.studentName;

              return (
                <div
                  key={sub.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        {displayStudentName}
                      </span>

                      {sub.isOverdue && (
                        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[11px] font-bold">
                          Overdue SLA
                        </Badge>
                      )}

                      {sub.priority === "urgent" && !sub.isOverdue && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px] font-semibold">
                          Urgent SLA
                        </Badge>
                      )}

                      {sub.status === "graded" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px]">
                          Graded • {sub.totalScore}/{sub.maxScore} pts
                        </Badge>
                      )}

                      {sub.status === "draft" && (
                        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[11px]">
                          Draft Saved
                        </Badge>
                      )}

                      {sub.status === "re_evaluation_requested" && (
                        <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[11px]">
                          Contestation Active
                        </Badge>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-foreground">
                      {sub.testTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{sub.courseTitle}</span>
                      <span>•</span>
                      <span>{sub.batchName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" /> Submitted: {sub.submittedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    <div className="text-left sm:text-right space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                        SLA Window
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          sub.isOverdue
                            ? "text-rose-600 dark:text-rose-400"
                            : sub.priority === "urgent"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {sub.slaTimeRemaining || "Within 24h"}
                      </span>
                      {sub.deadline && (
                        <span className="text-[10px] text-muted-foreground block">
                          Due: {sub.deadline.split(",")[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/evaluator/grading/${sub.id}`}>
                        <Button
                          size="sm"
                          className={
                            sub.isOverdue
                              ? "bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold gap-1.5 shadow-sm"
                              : sub.status === "graded"
                              ? "text-xs"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-sm"
                          }
                          variant={sub.status === "graded" ? "outline" : "default"}
                        >
                          {sub.status === "graded" ? (
                            "Review Grade"
                          ) : sub.status === "draft" ? (
                            "Resume Draft"
                          ) : (
                            <>
                              <Zap className="h-3.5 w-3.5" /> Start Grading
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
