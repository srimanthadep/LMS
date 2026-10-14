import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Save,
  Send,
  Code,
  FileText,
  Sparkles,
  UserCheck,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RubricGrader } from "@/components/shared/RubricGrader";

export const GradingSuitePage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId?: string }>();
  const navigate = useNavigate();
  const submissions = mockDataService.getSubmissions();
  const sub = submissions.find((s) => s.id === submissionId) || submissions[0];

  const [feedback, setFeedback] = useState(
    sub.evaluatorFeedback ||
      "Solid implementation of the retrieval and reranking pipeline. The separation of concerns between initial vector recall and cross-encoder compression is cleanly decoupled."
  );
  const [rubrics, setRubrics] = useState(sub.rubricScores);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleRubricScoreChange = (rubricId: string, newScore: number) => {
    setRubrics((prev) =>
      prev.map((r) => (r.id === rubricId ? { ...r, score: newScore } : r))
    );
  };

  const handleAdoptAiProposal = () => {
    // Fill rubrics aligned with AI proposal
    setRubrics([
      { id: "r1", criteria: "Vector Pipeline Architecture", maxScore: 20, score: 19, rationale: "AI verified: Clean modular pipeline" },
      { id: "r2", criteria: "Reranker Integration & Optimization", maxScore: 20, score: 18, rationale: "AI verified: Proper compression kwargs" },
      { id: "r3", criteria: "Lost-in-the-middle Mitigation Logic", maxScore: 10, score: 10, rationale: "AI verified: Accurate theoretical understanding" },
      { id: "r4", criteria: "Code Quality & Error Handling", maxScore: 10, score: 8, rationale: "AI verified: Minor deduction for missing retry logic" },
    ]);
  };

  const handleSaveDraft = () => {
    mockDataService.saveDraftGrade(sub.id, rubrics, feedback);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleSubmitFinalGrade = () => {
    mockDataService.submitGrade(sub.id, rubrics, feedback);
    navigate("/evaluator/submissions");
  };

  const totalSubjective = rubrics.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const calculatedGrandTotal = sub.objectiveScore + totalSubjective;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/evaluator/submissions">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Submissions Queue
            </Button>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
            {sub.courseTitle}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {isSavedNotice && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Draft Saved
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2 text-xs">
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button size="sm" onClick={handleSubmitFinalGrade} className="gap-2 text-xs bg-primary text-primary-foreground">
            <Send className="h-3.5 w-3.5" />
            Submit Final Grade
          </Button>
        </div>
      </div>

      {/* Candidate Banner */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="gap-1 text-xs">
              <EyeOff className="h-3 w-3" /> Blind Graded
            </Badge>
            <span className="font-mono text-xs font-bold text-primary">
              {sub.studentName}
            </span>
          </div>
          <h2 className="text-lg font-bold text-foreground">{sub.testTitle}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submitted {sub.submittedAt} • Batch: {sub.batchName}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-muted/40 p-3 rounded-lg border border-border">
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
              Calculated Total Score
            </span>
            <div className="text-xl font-black text-foreground">
              {calculatedGrandTotal} <span className="text-xs font-normal text-muted-foreground">/{sub.maxScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Candidate Answers (7 cols) & Rubric Workstation (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate Submission Material */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section A: MCQ Score summary */}
          <Card>
            <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-foreground">
                Section A: Objective MCQ Results (Automated)
              </CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                {sub.objectiveScore} / {sub.objectiveMaxScore} Points
              </Badge>
            </CardHeader>
            <CardContent className="p-4 text-xs text-muted-foreground">
              Candidate correctly identified HNSW graph scaling properties and vector unit-normalization equivalencies.
            </CardContent>
          </Card>

          {/* Section B: Code Submission */}
          {sub.codeSubmission && (
            <Card>
              <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" /> Submitted Code Implementation
                </CardTitle>
                <Badge variant="outline" className="text-[11px] font-mono">
                  Python 3.11
                </Badge>
              </CardHeader>
              <CardContent className="p-4">
                <pre className="p-4 rounded-xl bg-muted/60 border border-border font-mono text-xs overflow-x-auto text-foreground/90 leading-relaxed">
                  {sub.codeSubmission}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Section C: Descriptive Answers */}
          {sub.descriptiveAnswers && sub.descriptiveAnswers.length > 0 && (
            <Card>
              <CardHeader className="p-4 border-b border-border">
                <CardTitle className="text-xs font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Descriptive Architecture Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {sub.descriptiveAnswers.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h4 className="text-xs font-bold text-foreground">
                      Q: {item.question}
                    </h4>
                    <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/30 border border-border leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Rubric Grading & AI Advisory */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Advisory Proposal Card */}
          {sub.aiSuggestedScore && (
            <Card className="border-violet-500/20 bg-violet-500/5">
              <CardHeader className="p-4 border-b border-violet-500/20 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-violet-800 dark:text-violet-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> AI Co-Evaluator Proposal
                </CardTitle>
                <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
                  {sub.aiSuggestedScore} pts
                </span>
              </CardHeader>
              <CardContent className="p-4 text-xs space-y-3">
                <p className="text-foreground/90 leading-relaxed">
                  {sub.aiRationale}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdoptAiProposal}
                  className="w-full text-xs border-violet-500/30 text-violet-700 dark:text-violet-300 hover:bg-violet-500/10 gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Apply AI Rubric Recommendations
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Subjective Rubric Grader */}
          <Card>
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-xs font-bold text-foreground">
                Subjective Rubric Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              {rubrics.map((r) => (
                <div key={r.id} className="space-y-2 pb-3 border-b border-border/60 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{r.criteria}</span>
                    <span className="text-xs font-mono font-bold text-primary">
                      {r.score} / {r.maxScore}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={r.maxScore}
                    value={r.score}
                    onChange={(e) => handleRubricScoreChange(r.id, Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                  />

                  <p className="text-[11px] text-muted-foreground italic">
                    Rationale: {r.rationale}
                  </p>
                </div>
              ))}

              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-foreground">
                  Evaluator Feedback to Student
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
                  placeholder="Explain constructive strengths and improvements..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
