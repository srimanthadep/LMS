import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { TestSubmission } from "@/types/lms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const EvaluatorResultsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<TestSubmission[]>(mockDataService.getSubmissions());
  const [searchQuery, setSearchQuery] = useState("");
  const [assessmentFilter, setAssessmentFilter] = useState("all");
  const [releaseStatusFilter, setReleaseStatusFilter] = useState("all");
  const [isPublishingAll, setIsPublishingAll] = useState(false);

  const handleReleaseSingle = (id: string) => {
    mockDataService.releaseGrade(id);
    setSubmissions([...mockDataService.getSubmissions()]);
  };

  const handleReleaseAll = () => {
    setIsPublishingAll(true);
    setTimeout(() => {
      mockDataService.releaseAllGrades();
      setSubmissions([...mockDataService.getSubmissions()]);
      setIsPublishingAll(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const csvHeader = "ID,Candidate,Assessment,Course,Score,Max,Status,Released\n";
    const csvRows = submissions
      .map(
        (s) =>
          `"${s.id}","${s.studentName}","${s.testTitle}","${s.courseTitle}",${s.totalScore},${s.maxScore},"${s.status}","${s.releasedToStudent ? "Yes" : "No"}"`
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `evaluator_gradebook_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (assessmentFilter !== "all" && s.testId !== assessmentFilter) return false;
    if (releaseStatusFilter === "released" && !s.releasedToStudent) return false;
    if (releaseStatusFilter === "pending_release" && (s.releasedToStudent || s.status !== "graded")) return false;
    if (releaseStatusFilter === "ungraded" && s.status === "graded") return false;
    return true;
  });

  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const releasedCount = submissions.filter((s) => s.releasedToStudent).length;
  const pendingReleaseCount = gradedCount - releasedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Results & Feedback Management
            </h1>
            <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
              Official Gradebook
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Review completed mark sheets, verify scores against criteria maximums, and release final grades to students.
          </p>
        </div>

        {/* Global Export & Batch Release */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV Report
          </Button>

          {pendingReleaseCount > 0 && (
            <Button
              size="sm"
              onClick={handleReleaseAll}
              disabled={isPublishingAll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              {isPublishingAll ? "Releasing..." : `Release All Graded (${pendingReleaseCount})`}
            </Button>
          )}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-zinc-200/80 dark:border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Total Evaluated Records</span>
          <div className="text-2xl font-bold text-foreground">{gradedCount} Submissions</div>
          <span className="text-[11px] text-muted-foreground">Ready for institutional archival</span>
        </Card>
        <Card className="border-zinc-200/80 dark:border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Released to Students</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{releasedCount} Grades</div>
          <span className="text-[11px] text-muted-foreground">Published to student dashboard & transcript</span>
        </Card>
        <Card className="border-zinc-200/80 dark:border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Pending Official Release</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingReleaseCount} Held</div>
          <span className="text-[11px] text-muted-foreground">Graded by evaluator, awaiting release trigger</span>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by candidate, milestone, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            <select
              value={releaseStatusFilter}
              onChange={(e) => setReleaseStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Release States</option>
              <option value="released">Released to Student</option>
              <option value="pending_release">Graded (Pending Release)</option>
              <option value="ungraded">Pending Evaluation</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Gradebook Table */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-foreground">
            Gradebook & Feedback Records
          </CardTitle>
          <CardDescription className="text-xs">
            Review detailed marks, feedback notes, and publish release states.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="p-4">Candidate</th>
                <th className="p-4">Assessment</th>
                <th className="p-4">Score / Max</th>
                <th className="p-4">Feedback Preview</th>
                <th className="p-4">Status & Release</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800">
              {filtered.map((s) => {
                const percent = Math.round((s.totalScore / s.maxScore) * 100);

                return (
                  <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-foreground">
                      {s.studentName}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-foreground">{s.testTitle}</div>
                      <div className="text-[11px] text-muted-foreground">{s.courseTitle}</div>
                    </td>

                    <td className="p-4 font-mono">
                      {s.status === "graded" ? (
                        <div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            {s.totalScore}
                          </span>
                          <span className="text-muted-foreground text-[11px]"> / {s.maxScore} pts</span>
                          <Badge variant="outline" className="ml-2 text-[10px] font-mono">
                            {percent}%
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Pending</span>
                      )}
                    </td>

                    <td className="p-4 max-w-xs truncate text-muted-foreground text-[11px]">
                      {s.evaluatorFeedback || <span className="italic">No feedback written yet</span>}
                    </td>

                    <td className="p-4">
                      {s.releasedToStudent ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Released to Student
                        </Badge>
                      ) : s.status === "graded" ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] gap-1">
                          <Clock className="h-3 w-3" /> Graded (Pending Release)
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Pending Grading
                        </Badge>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link to={`/evaluator/grading/${s.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          <Eye className="h-3 w-3 mr-1" /> View Sheet
                        </Button>
                      </Link>

                      {s.status === "graded" && !s.releasedToStudent && (
                        <Button
                          size="sm"
                          onClick={() => handleReleaseSingle(s.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7"
                        >
                          Release Grade
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
