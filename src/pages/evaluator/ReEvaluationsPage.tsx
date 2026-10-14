import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  FileCheck2,
  Clock,
  History,
  Check,
  Scale,
  Award,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ReassessmentCase {
  id: string;
  submissionId: string;
  candidateToken: string;
  testTitle: string;
  courseTitle: string;
  initialScore: number;
  maxScore: number;
  contestedCriteria: string;
  studentStatement: string;
  evaluatorInitialRationale: string;
  status: "pending" | "resolved";
  resolution?: "upheld" | "adjusted";
  revisedScore?: number;
  resolutionNote?: string;
  submittedDate: string;
}

export const ReEvaluationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const [selectedCase, setSelectedCase] = useState<ReassessmentCase | null>(null);
  const [resolutionAction, setResolutionAction] = useState<"upheld" | "adjusted">("adjusted");
  const [adjustedScore, setAdjustedScore] = useState<number>(97);
  const [resolutionNote, setResolutionNote] = useState("");

  const [cases, setCases] = useState<ReassessmentCase[]>([
    {
      id: "reeval-101",
      submissionId: "sub-1",
      candidateToken: "Candidate #4810 (Arjun Mehta)",
      testTitle: "Milestone 2: Hybrid RAG System with Cohere Rerank",
      courseTitle: "Full-Stack AI & LLM Systems Engineering",
      initialScore: 95,
      maxScore: 100,
      contestedCriteria: "Code Quality & Error Handling (-2 pts deducted)",
      studentStatement:
        "The evaluator noted missing retry blocks for the Cohere API. However, in lines 14-18, the retriever delegates retry logic directly to langchain_cohere's built-in exponential backoff configuration via max_retries=3. Please review whether this meets the fault-tolerance criteria.",
      evaluatorInitialRationale:
        "Missing explicit application-level try/except block around Cohere API network timeouts.",
      status: "pending",
      submittedDate: "13 Oct 2026, 11:20 AM",
    },
    {
      id: "reeval-100",
      submissionId: "sub-5",
      candidateToken: "Candidate #1920 (Karan Johar)",
      testTitle: "Capstone 2: Production Triton GPU Inference on K8s",
      courseTitle: "Production MLOps & Vector Infrastructure",
      initialScore: 96,
      maxScore: 100,
      contestedCriteria: "Dynamic Batching Configuration (-3 pts deducted)",
      studentStatement:
        "Max queue delay was initially tested at 50ms which passed all locust benchmark latency percentiles under load testing.",
      evaluatorInitialRationale:
        "Slightly aggressive queue delay for latency-sensitive streaming.",
      status: "resolved",
      resolution: "adjusted",
      revisedScore: 99,
      resolutionNote: "Re-reviewed locust performance reports. P99 latency is well within the 45ms SLA bounds. Full marks awarded (+3 pts).",
      submittedDate: "10 Oct 2026, 04:15 PM",
    },
  ]);

  const handleOpenResolutionModal = (c: ReassessmentCase) => {
    setSelectedCase(c);
    setResolutionAction("adjusted");
    setAdjustedScore(c.initialScore + 2);
    setResolutionNote("");
  };

  const handleSaveResolution = () => {
    if (!selectedCase || !resolutionNote.trim()) return;

    mockDataService.resolveReassessment(
      selectedCase.submissionId,
      resolutionAction === "adjusted" ? adjustedScore : selectedCase.initialScore,
      resolutionNote,
      resolutionAction
    );

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: "resolved",
              resolution: resolutionAction,
              revisedScore: resolutionAction === "adjusted" ? adjustedScore : c.initialScore,
              resolutionNote: resolutionNote,
            }
          : c
      )
    );

    setSelectedCase(null);
  };

  const pendingCases = cases.filter((c) => c.status === "pending");
  const resolvedCases = cases.filter((c) => c.status === "resolved");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Reassessment & Contestation Desk
            </h1>
            <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-500/20">
              {pendingCases.length} Pending Review
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Second-review moderation workflow for student-contested rubric criteria and regrading requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs px-3 py-1 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Audit Protocol Active
          </Badge>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-zinc-200/80 dark:border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Pending Second-Reviews</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {pendingCases.length} Case{pendingCases.length === 1 ? "" : "s"}
          </div>
          <span className="text-[11px] text-muted-foreground">Turnaround SLA: 48 hours</span>
        </Card>
        <Card className="border-zinc-200/80 dark:border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Resolution Concordance Rate</span>
          <div className="text-2xl font-bold text-foreground">88.5%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Initial grades upheld upon review
          </span>
        </Card>
        <Card className="border-zinc-200/80 dark:border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Audited Adjustments</span>
          <div className="text-2xl font-bold text-foreground">12 Cases</div>
          <span className="text-[11px] text-muted-foreground">All decisions timestamped in immutable ledger</span>
        </Card>
      </div>

      {/* Case Tabs: Pending vs Resolved */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-4 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Contestation Cases
            </CardTitle>
            <CardDescription className="text-xs">
              Review the student's technical arguments alongside original evaluator rationale.
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeTab === "pending" ? "default" : "outline"}
              onClick={() => setActiveTab("pending")}
              className={activeTab === "pending" ? "bg-emerald-600 text-white text-xs" : "text-xs"}
            >
              Pending ({pendingCases.length})
            </Button>
            <Button
              size="sm"
              variant={activeTab === "resolved" ? "default" : "outline"}
              onClick={() => setActiveTab("resolved")}
              className={activeTab === "resolved" ? "bg-emerald-600 text-white text-xs" : "text-xs"}
            >
              Resolved History ({resolvedCases.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-zinc-200/70 dark:divide-zinc-800">
          {(activeTab === "pending" ? pendingCases : resolvedCases).length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <div className="font-semibold text-foreground text-sm">No cases in this view</div>
              <p>All reassessment requests have been processed.</p>
            </div>
          ) : (
            (activeTab === "pending" ? pendingCases : resolvedCases).map((c) => (
              <div key={c.id} className="p-5 space-y-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded border border-purple-500/20">
                        {c.candidateToken}
                      </span>
                      <Badge
                        className={
                          c.status === "pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]"
                            : c.resolution === "adjusted"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]"
                            : "bg-zinc-500/10 text-zinc-600 border-zinc-500/30 text-[10px]"
                        }
                      >
                        {c.status === "pending"
                          ? "Pending Review"
                          : c.resolution === "adjusted"
                          ? `Grade Adjusted: ${c.revisedScore} pts`
                          : "Original Grade Upheld"}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {c.testTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {c.courseTitle} • Submitted {c.submittedDate}
                    </p>
                  </div>

                  {c.status === "pending" ? (
                    <Button
                      size="sm"
                      onClick={() => handleOpenResolutionModal(c)}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0"
                    >
                      <Scale className="h-3.5 w-3.5" /> Moderation Action
                    </Button>
                  ) : (
                    <div className="text-right text-xs">
                      <span className="text-[10px] text-muted-foreground block uppercase font-bold">Resolved Score</span>
                      <span className="font-mono font-bold text-emerald-600 text-sm">
                        {c.revisedScore} / {c.maxScore} pts
                      </span>
                    </div>
                  )}
                </div>

                {/* Contested Criteria & Rationale Comparison Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1.5">
                    <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 block">
                      Student Contestation: {c.contestedCriteria}
                    </span>
                    <p className="text-foreground text-[11px] leading-relaxed italic">
                      "{c.studentStatement}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground block">
                      Initial Evaluator Rationale:
                    </span>
                    <p className="text-foreground text-[11px] leading-relaxed">
                      {c.evaluatorInitialRationale}
                    </p>
                  </div>
                </div>

                {/* Resolution Note if resolved */}
                {c.resolutionNote && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Resolution Decision & Justification:
                    </span>
                    <p className="text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed">
                      {c.resolutionNote}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Moderation Resolution Modal */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-600" />
                Moderate Reassessment Decision
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedCase.testTitle} • {selectedCase.candidateToken}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Decision Action Toggle */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Moderation Outcome</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolutionAction("adjusted")}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                      resolutionAction === "adjusted"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "border-zinc-200 dark:border-zinc-800 text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Adjust Score (Accept Argument)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResolutionAction("upheld")}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                      resolutionAction === "upheld"
                        ? "border-zinc-500 bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold"
                        : "border-zinc-200 dark:border-zinc-800 text-muted-foreground"
                    }`}
                  >
                    <XCircle className="h-4 w-4 text-zinc-500" />
                    <span>Uphold Original Grade</span>
                  </button>
                </div>
              </div>

              {/* Revised Score Stepper if Adjusted */}
              {resolutionAction === "adjusted" && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground">Revised Grand Total:</span>
                    <p className="text-[11px] text-muted-foreground">
                      Initial: {selectedCase.initialScore} / {selectedCase.maxScore} pts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={selectedCase.maxScore}
                      value={adjustedScore}
                      onChange={(e) => setAdjustedScore(parseInt(e.target.value) || 0)}
                      className="h-8 w-16 font-mono text-center font-bold text-emerald-600"
                    />
                    <span className="font-mono text-xs">/ {selectedCase.maxScore}</span>
                  </div>
                </div>
              )}

              {/* Resolution Explanation Justification */}
              <div className="space-y-1">
                <label className="font-bold text-foreground">
                  Official Explanation & Resolution Justification (Required)
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Explain why the contested criterion is upheld or adjusted based on technical verification..."
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveResolution}
                disabled={!resolutionNote.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Confirm & Publish Resolution
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
