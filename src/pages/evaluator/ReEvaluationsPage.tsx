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
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const ReEvaluationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [moderatorNote, setModeratorNote] = useState("");
  const [resolvedStatus, setResolvedStatus] = useState<"upheld" | "adjusted" | null>(null);

  const reEvalCases = [
    {
      id: "reeval-101",
      submissionId: "sub-1",
      candidateToken: "Candidate #4810",
      testTitle: "Milestone 2: Hybrid RAG System with Cohere Rerank",
      initialScore: 95,
      maxScore: 100,
      contestedCriteria: "Code Quality & Error Handling (-2 pts)",
      studentStatement:
        "The evaluator noted missing retry blocks for the Cohere API. However, in lines 14-18, the retriever delegates retry logic directly to langchain_cohere's built-in exponential backoff configuration. Please review whether this meets the fault-tolerance criteria.",
      evaluatorInitialRationale:
        "Missing explicit application-level try/except block around Cohere API network timeouts.",
      status: "pending",
      submittedDate: "Yesterday, 06:45 PM",
    },
  ];

  const handleResolve = (action: "upheld" | "adjusted") => {
    setResolvedStatus(action);
    setSelectedCase(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Grade Re-Evaluations & Contestation Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Second-review moderation workflow for student contested rubric criteria.
        </p>
      </div>

      {/* Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Pending Second-Review</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">1 Case</div>
          <span className="text-[11px] text-muted-foreground">SLA: Review within 48 hrs</span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Concordance Rate</span>
          <div className="text-2xl font-bold text-foreground">88.5%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Initial grades upheld</span>
        </Card>
        <Card className="p-4 space-y-1">
          <span className="text-xs text-muted-foreground">Audit Protection</span>
          <div className="text-2xl font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-primary" /> Active
          </div>
          <span className="text-[11px] text-muted-foreground">All adjustments recorded in audit log</span>
        </Card>
      </div>

      {/* Cases List */}
      <Card>
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-base font-bold text-foreground">
            Active Contestation Queue
          </CardTitle>
          <CardDescription className="text-xs">
            Review the student's technical argument against the original evaluation rubric.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {resolvedStatus ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <div className="font-semibold text-foreground text-sm">
                Case resolved: {resolvedStatus === "upheld" ? "Original Grade Upheld" : "Score Adjusted (+2 pts)"}
              </div>
              <p>Audit log updated. Student and evaluator have been automatically notified.</p>
            </div>
          ) : (
            reEvalCases.map((item) => (
              <div key={item.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {item.candidateToken}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-semibold text-foreground">{item.testTitle}</span>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                    Pending Second Review
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Argument */}
                  <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <MessageSquare className="h-4 w-4" /> Student Argument
                    </div>
                    <div className="text-xs font-medium text-foreground">
                      Contesting: <strong>{item.contestedCriteria}</strong>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "{item.studentStatement}"
                    </p>
                  </div>

                  {/* Initial Evaluator Rationale */}
                  <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <FileCheck2 className="h-4 w-4" /> Initial Evaluator Deductions
                    </div>
                    <div className="text-xs font-medium text-foreground">
                      Current Awarded Score: <strong>{item.initialScore} / {item.maxScore}</strong>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.evaluatorInitialRationale}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCase({ ...item, actionType: "uphold" })}
                    className="text-xs"
                  >
                    Uphold Original Score ({item.initialScore})
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSelectedCase({ ...item, actionType: "adjust" })}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Adjust Score to 97 (+2 pts)
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Resolution Confirmation Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        {selectedCase && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedCase.actionType === "uphold" ? (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    Uphold Original Evaluation
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Approve Score Revision (+2 pts)
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs sm:text-sm">
              <p className="text-muted-foreground">
                Enter moderation remarks. These will be published to the candidate's scorecard and archived for accreditation audits.
              </p>
              <textarea
                rows={3}
                value={moderatorNote}
                onChange={(e) => setModeratorNote(e.target.value)}
                placeholder="Moderator rationale..."
                className="w-full text-xs rounded-lg border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setSelectedCase(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleResolve(selectedCase.actionType === "uphold" ? "upheld" : "adjusted")}
                className="bg-primary text-primary-foreground"
              >
                Confirm Resolution
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
