import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  Sparkles,
  UserCheck,
  AlertCircle,
  Code,
  FileText,
  RotateCcw,
  Download,
  Share2,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const TestResultsPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId?: string }>();
  const submissions = mockDataService.getSubmissions();
  const sub = submissions.find((s) => s.id === submissionId) || submissions[0];

  const [isReEvalOpen, setIsReEvalOpen] = useState(false);
  const [reEvalReason, setReEvalReason] = useState("");
  const [reEvalSubmitted, setReEvalSubmitted] = useState(false);

  const handleRequestReEval = () => {
    setIsReEvalOpen(false);
    setReEvalSubmitted(true);
  };

  const percentage = Math.round((sub.totalScore / sub.maxScore) * 100);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/student/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <Badge variant="outline" className="text-xs">
            {sub.courseTitle}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {!reEvalSubmitted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReEvalOpen(true)}
              className="gap-2 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
              Request Re-evaluation
            </Button>
          ) : (
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1">
              <RotateCcw className="h-3 w-3" /> Re-evaluation Pending
            </Badge>
          )}

          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Download className="h-3.5 w-3.5" />
            Download Scorecard
          </Button>
        </div>
      </div>

      {/* Hero Score Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-card p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-500 text-white text-xs gap-1">
                <CheckCircle2 className="h-3 w-3" /> Graded & Verified
              </Badge>
              <span className="text-xs text-muted-foreground">• Submitted {sub.submittedAt}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {sub.testTitle}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Assigned Cohort: {sub.batchName}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-xs">
            <div className="text-right">
              <div className="text-3xl font-black text-primary">
                {sub.totalScore}
                <span className="text-lg text-muted-foreground font-semibold">/{sub.maxScore}</span>
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {percentage}% (Distinction)
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Rubric breakdown (8 cols) & Evaluator Comments (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rubric Criteria & Code View */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                Detailed Rubric Scoring Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <span className="text-xs font-medium text-foreground">
                  Section A: Automated Objective MCQs
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {sub.objectiveScore} / {sub.objectiveMaxScore} pts
                </span>
              </div>

              {sub.rubricScores.map((rubric) => (
                <div key={rubric.id} className="p-4 rounded-xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                      {rubric.criteria}
                    </h4>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {rubric.score} / {rubric.maxScore} pts
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Evaluator Rationale:</strong> {rubric.rationale}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submitted Code View */}
          {sub.codeSubmission && (
            <Card>
              <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" /> Submitted Code Solution
                </CardTitle>
                <Badge variant="outline" className="text-xs font-mono">
                  Python 3.11
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="p-4 rounded-xl bg-muted/50 border border-border font-mono text-xs overflow-x-auto text-foreground/90 leading-relaxed">
                  {sub.codeSubmission}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: AI Suggestion & Evaluator Feedback */}
        <div className="lg:col-span-4 space-y-6">
          {/* Human Evaluator Note */}
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="p-4 border-b border-emerald-500/20">
              <CardTitle className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <UserCheck className="h-4 w-4" /> Evaluator Final Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs text-foreground/90 leading-relaxed">
              {sub.evaluatorFeedback}
            </CardContent>
          </Card>

          {/* Grounded AI Evaluation Card */}
          <Card className="border-violet-500/20 bg-violet-500/5">
            <CardHeader className="p-4 border-b border-violet-500/20">
              <CardTitle className="text-xs font-bold text-violet-800 dark:text-violet-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> AI Co-Evaluator Analysis
                </span>
                <span className="font-mono">{sub.aiSuggestedScore} pts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs text-foreground/90 leading-relaxed space-y-2">
              <p>{sub.aiRationale}</p>
              <div className="text-[11px] text-muted-foreground pt-1 border-t border-violet-500/20">
                Note: AI scoring is an advisory recommendation. Final grades are always verified by authorized human evaluators.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Re-evaluation Modal */}
      <Dialog open={isReEvalOpen} onOpenChange={setIsReEvalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-500" />
              Request Formal Grade Re-evaluation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs sm:text-sm">
            <p className="text-muted-foreground">
              If you believe a subjective rubric criteria was graded incorrectly, describe your technical justification for a second review by an evaluator lead.
            </p>

            <div className="space-y-2">
              <label className="font-semibold text-foreground">Specific Rubric Item</label>
              <select className="w-full text-xs rounded-lg border border-border bg-background p-2.5">
                <option>Vector Pipeline Architecture</option>
                <option>Reranker Integration & Optimization</option>
                <option>Code Quality & Error Handling</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-foreground">Technical Rationale</label>
              <textarea
                rows={4}
                value={reEvalReason}
                onChange={(e) => setReEvalReason(e.target.value)}
                placeholder="Reference the lecture or documentation to support your contestation..."
                className="w-full text-xs rounded-lg border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsReEvalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRequestReEval}
              disabled={!reEvalReason.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Submit Re-evaluation Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
