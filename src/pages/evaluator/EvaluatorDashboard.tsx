import React from "react";
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
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const EvaluatorDashboard: React.FC = () => {
  const submissions = mockDataService.getSubmissions();
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Evaluator Workstation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review submissions, rubric grading queues, and AI-assisted score proposals.
          </p>
        </div>

        <Link to="/evaluator/submissions">
          <Button className="gap-2 bg-primary text-primary-foreground shadow-sm">
            <FileCheck2 className="h-4 w-4" />
            Open Assessment Queue
          </Button>
        </Link>
      </div>

      {/* SLA Alert banner if pending items exist */}
      {pendingCount > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Grading SLA Active:</span> You have{" "}
              <strong>{pendingCount} submissions</strong> pending evaluation within the 24-hour turnaround window.
            </div>
          </div>
          <Link to="/evaluator/submissions">
            <Button size="sm" variant="outline" className="border-amber-500/40 text-xs gap-1">
              Grade Now <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Queue"
          value={pendingCount}
          icon={Clock}
          trend={{ value: "SLA 14h left", isPositive: true }}
        />
        <StatCard
          title="Graded This Week"
          value={gradedCount + 14}
          icon={FileCheck2}
          trend={{ value: "+8 from last week", isPositive: true }}
        />
        <StatCard
          title="Avg Turnaround Time"
          value="4.2 hrs"
          icon={TrendingUp}
          trend={{ value: "Target < 24 hrs", isPositive: true }}
        />
        <StatCard
          title="AI Score Concordance"
          value="94.2%"
          icon={Sparkles}
          trend={{ value: "High alignment", isPositive: true }}
        />
      </div>

      {/* Active Evaluation Queue & Recent Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Priority Submissions Queue
                </CardTitle>
                <CardDescription className="text-xs">
                  Blind-graded and anonymized submissions requiring human verification.
                </CardDescription>
              </div>
              <Link to="/evaluator/submissions">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View All ({submissions.length}) <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {sub.studentName}
                      </span>
                      {sub.status === "graded" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                          Graded ({sub.totalScore}/{sub.maxScore})
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                          Pending Review
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

                  <div className="flex items-center gap-3">
                    {sub.aiSuggestedScore && (
                      <div className="text-right text-xs">
                        <span className="text-muted-foreground block text-[10px]">
                          AI Proposed
                        </span>
                        <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
                          {sub.aiSuggestedScore} pts
                        </span>
                      </div>
                    )}
                    <Link to={`/evaluator/grading/${sub.id}`}>
                      <Button size="sm" variant={sub.status === "graded" ? "outline" : "default"} className="text-xs gap-1.5">
                        {sub.status === "graded" ? "Edit Grade" : "Start Grading"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: AI Policy & Contested Requests (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-violet-500/20 bg-violet-500/5">
            <CardHeader className="p-4 border-b border-violet-500/20">
              <CardTitle className="text-xs font-bold text-violet-800 dark:text-violet-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI Evaluation Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs text-foreground/90 space-y-2 leading-relaxed">
              <p>
                <strong>Human-in-the-Loop Requirement:</strong> AI scoring is purely consultative.
                Evaluators must inspect synthetic test results and verify candidate code logic before publishing final scores.
              </p>
              <div className="pt-2 text-[11px] text-muted-foreground border-t border-violet-500/20">
                Blind grading is enforced by default to prevent cognitive bias.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Re-evaluation Escalations</span>
                <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/20">
                  1 Pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Candidate #4810</span>
                  <span className="text-amber-600 dark:text-amber-400">Contested</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  "Contesting lost-in-the-middle deduction: cross-encoder rerank explanation was present in paragraph 3."
                </p>
                <div className="pt-2">
                  <Link to="/evaluator/re-evaluations">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Inspect Re-evaluation
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
