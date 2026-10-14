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
  Download,
  RotateCcw,
  FileCode2,
  HelpCircle,
  History,
  Check,
  Paperclip,
  Clock,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const GradingSuitePage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId?: string }>();
  const navigate = useNavigate();
  const submissions = mockDataService.getSubmissions();
  const sub = submissions.find((s) => s.id === submissionId) || submissions[0];

  const [activeFileTab, setActiveFileTab] = useState(sub.files?.[0]?.name || "main.py");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [rubrics, setRubrics] = useState(sub.rubricScores || []);
  const [feedback, setFeedback] = useState(
    sub.evaluatorFeedback ||
      "Solid implementation of the retrieval and reranking pipeline. The separation of concerns between initial vector recall and cross-encoder compression is cleanly decoupled."
  );
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [resubmitReason, setResubmitReason] = useState("");
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const handleRubricScoreChange = (rubricId: string, newScore: number) => {
    setRubrics((prev) =>
      prev.map((r) => {
        if (r.id === rubricId) {
          const clamped = Math.max(0, Math.min(newScore, r.maxScore));
          return { ...r, score: clamped };
        }
        return r;
      })
    );
  };

  const handleRubricRationaleChange = (rubricId: string, newRationale: string) => {
    setRubrics((prev) =>
      prev.map((r) => (r.id === rubricId ? { ...r, rationale: newRationale } : r))
    );
  };

  const handleAdoptAiProposal = () => {
    setRubrics((prev) =>
      prev.map((r) => ({
        ...r,
        score: Math.max(1, Math.round(r.maxScore * 0.92)),
        rationale: `AI calibrated: High compliance with reference rubric. Passed automated benchmark test probes.`,
      }))
    );
  };

  const handleSaveDraft = () => {
    mockDataService.saveDraftGrade(sub.id, rubrics, feedback);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleSubmitFinalGrade = () => {
    mockDataService.submitGrade(sub.id, rubrics, feedback);
    navigate("/evaluator/queue");
  };

  const handleConfirmResubmission = () => {
    if (!resubmitReason.trim()) return;
    mockDataService.returnSubmissionForResubmission(sub.id, resubmitReason);
    setShowResubmitModal(false);
    navigate("/evaluator/queue");
  };

  const totalSubjective = rubrics.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const totalMaxSubjective = rubrics.reduce((acc, curr) => acc + curr.maxScore, 0);
  const grandTotal = sub.objectiveScore + totalSubjective;
  const grandMax = sub.objectiveMaxScore + totalMaxSubjective;

  const currentFile = sub.files?.find((f) => f.name === activeFileTab) || {
    name: "submission_code.py",
    language: "python",
    content: sub.codeSubmission || "# No code submitted",
  };

  const displayStudentName = isBlindMode
    ? sub.studentName.replace(/^[^(]+/, "").trim() || `Candidate #${sub.id.toUpperCase()}`
    : sub.studentName;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/evaluator/queue">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              Queue
            </Button>
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
            {sub.courseTitle}
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">• {sub.batchName}</span>
        </div>

        {/* Global Evaluation Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isSavedNotice && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="h-4 w-4" /> Draft Saved
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs gap-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showInstructions ? "Hide Instructions" : "Instructions"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryModal(true)}
            className="text-xs gap-1.5"
          >
            <History className="h-3.5 w-3.5" />
            Audit Log
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResubmitModal(true)}
            className="text-xs gap-1.5 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Return for Resubmission
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </Button>

          <Button
            size="sm"
            onClick={handleSubmitFinalGrade}
            className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Submit Final Grade
          </Button>
        </div>
      </div>

      {/* Submission Metadata Banner */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/20">
              {displayStudentName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBlindMode(!isBlindMode)}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
            >
              {isBlindMode ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {isBlindMode ? "Reveal Name" : "Mask Name"}
            </Button>
            {sub.isOverdue && (
              <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-[10px]">Overdue SLA</Badge>
            )}
            {sub.status === "re_evaluation_requested" && (
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px]">Contestation Active</Badge>
            )}
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {sub.testTitle}
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3" /> Submitted: {sub.submittedAt} (On-time)
            </span>
            <span>•</span>
            <span>SLA Target: <strong>{sub.slaTimeRemaining || "Active"}</strong></span>
          </p>
        </div>

        {/* Live Grand Score Counter */}
        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-2.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Calculated Total Score
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {grandTotal}
              </span>
              <span className="text-xs text-muted-foreground font-mono">/ {grandMax} pts</span>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="text-left text-[11px] text-muted-foreground">
            <div>Auto-tests: <strong className="text-foreground">{sub.objectiveScore}/{sub.objectiveMaxScore}</strong></div>
            <div>Rubric: <strong className="text-foreground">{totalSubjective}/{totalMaxSubjective}</strong></div>
          </div>
        </div>
      </div>

      {/* Instructions Drawer Panel (if toggled) */}
      {showInstructions && (
        <Card className="border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10">
          <CardHeader className="p-4 border-b border-emerald-500/20 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="h-4 w-4" /> Assignment Instructions & Marking Objectives
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowInstructions(false)} className="h-6 text-xs text-muted-foreground">
              Close Panel
            </Button>
          </CardHeader>
          <CardContent className="p-4 text-xs text-foreground space-y-2 leading-relaxed">
            <p>
              <strong>Objective:</strong> Verify student's implementation of the two-stage hybrid retrieval pipeline. Ensure Qdrant vector recall (k=25) is seamlessly connected with Cohere Rerank cross-encoder (top_n=5).
            </p>
            <p className="text-muted-foreground">
              <strong>Evaluation Guidelines:</strong> Deduct up to 2 points for missing application-level retry/backoff wrappers on external API calls. Ensure positional bias mitigation is clearly explained.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Two-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (7 cols): Submission Review (Code, Descriptive Answers, Files) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <CardHeader className="p-4 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Submitted Code & Repository Files
                </CardTitle>
              </div>

              {/* Download Submission Action */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Downloading archive: ${sub.testId}_submission.zip`)}
                className="text-xs gap-1.5 h-7"
              >
                <Download className="h-3.5 w-3.5" /> Download (.zip)
              </Button>
            </CardHeader>

            {/* Tabbed File Browser */}
            {sub.files && sub.files.length > 0 && (
              <div className="flex items-center gap-1 px-4 pt-2 border-b border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-x-auto text-xs">
                {sub.files.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setActiveFileTab(f.name)}
                    className={`px-3 py-1.5 font-mono text-xs rounded-t-md transition-colors flex items-center gap-1.5 border-b-2 ${
                      activeFileTab === f.name
                        ? "border-emerald-500 font-bold text-foreground bg-white dark:bg-zinc-800"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {f.name}
                  </button>
                ))}
              </div>
            )}

            {/* Code Content Display with Syntax Highlighting and Line Numbers */}
            <CardContent className="p-0">
              <div className="bg-zinc-950 text-zinc-100 font-mono text-xs p-4 overflow-x-auto max-h-[460px] leading-relaxed">
                <pre className="grid grid-cols-[30px_1fr] gap-4">
                  <div className="text-zinc-600 text-right select-none space-y-0.5">
                    {currentFile.content.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div className="space-y-0.5 text-zinc-200">
                    {currentFile.content.split("\n").map((line, i) => (
                      <div key={i} className="hover:bg-zinc-800/50 px-1 rounded">
                        {line || "\u00A0"}
                      </div>
                    ))}
                  </div>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Descriptive Question Answers & Theoretical Prompts */}
          {sub.descriptiveAnswers && sub.descriptiveAnswers.length > 0 && (
            <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <CardHeader className="p-4 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  Written Analysis & Theoretical Responses
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Question {activeQuestionIndex + 1} of {sub.descriptiveAnswers.length}
                </span>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Question switcher pills */}
                <div className="flex gap-2">
                  {sub.descriptiveAnswers.map((_, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={activeQuestionIndex === idx ? "default" : "outline"}
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={
                        activeQuestionIndex === idx
                          ? "bg-emerald-600 text-white text-xs h-7"
                          : "text-xs h-7"
                      }
                    >
                      Question {idx + 1}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 text-xs font-semibold text-foreground">
                    Q: {sub.descriptiveAnswers[activeQuestionIndex].question}
                  </div>
                  <div className="p-3.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {sub.descriptiveAnswers[activeQuestionIndex].answer}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Pane (5 cols): Rubric-Based Grading & Feedback Engine */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <CardHeader className="p-4 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                  Rubric Scoring Engine
                </CardTitle>
                <CardDescription className="text-xs">
                  Set scores and comments within permitted mark ranges.
                </CardDescription>
              </div>

              {/* AI Proposal Calibration */}
              {sub.aiSuggestedScore && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAdoptAiProposal}
                  className="gap-1 text-xs text-violet-700 dark:text-violet-300 border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-950/40"
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  Apply AI Proposal ({sub.aiSuggestedScore} pts)
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Automated Objective Test Score */}
              <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Automated Test Suite (Pre-graded)
                  </span>
                  <p className="text-[11px] text-muted-foreground">Unit test execution & syntax validation</p>
                </div>
                <Badge variant="secondary" className="font-mono text-xs font-bold">
                  {sub.objectiveScore} / {sub.objectiveMaxScore} pts
                </Badge>
              </div>

              {/* Subjective Rubric Criteria List */}
              <div className="space-y-3">
                {rubrics.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {r.criteria}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Input
                          type="number"
                          min={0}
                          max={r.maxScore}
                          value={r.score}
                          onChange={(e) => handleRubricScoreChange(r.id, parseInt(e.target.value) || 0)}
                          className="h-7 w-14 font-mono text-xs text-center font-bold text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-muted-foreground font-mono">/ {r.maxScore}</span>
                      </div>
                    </div>

                    {/* Score Slider */}
                    <input
                      type="range"
                      min={0}
                      max={r.maxScore}
                      value={r.score}
                      onChange={(e) => handleRubricScoreChange(r.id, parseInt(e.target.value))}
                      className="w-full accent-emerald-600 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg cursor-pointer"
                    />

                    {/* Criterion Rationale Note */}
                    <Input
                      placeholder="Add criterion-specific feedback note..."
                      value={r.rationale}
                      onChange={(e) => handleRubricRationaleChange(r.id, e.target.value)}
                      className="h-7 text-[11px] text-muted-foreground bg-zinc-50 dark:bg-zinc-950"
                    />
                  </div>
                ))}
              </div>

              {/* Overall Feedback to Candidate */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                  Overall Feedback & Improvement Suggestions
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed constructive feedback, architecture observations, and suggestions for production hardening..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* Annotated File Attachment (Mock Support) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-emerald-600" />
                    Attach Annotated File / Mark Sheet
                  </span>
                  {attachedFile && (
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="text-[10px] text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </label>
                {attachedFile ? (
                  <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                    <span>{attachedFile}</span>
                    <Badge className="bg-emerald-600 text-white text-[10px]">Attached</Badge>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAttachedFile("annotated_pipeline_rubric.pdf")}
                    className="w-full text-xs text-muted-foreground border-dashed gap-1.5"
                  >
                    <Paperclip className="h-3.5 w-3.5" /> Upload Annotated Review PDF / Code Diff
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return for Resubmission Modal */}
      <Dialog open={showResubmitModal} onOpenChange={setShowResubmitModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-amber-600" />
              Return Submission for Resubmission
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Candidate will be notified to revise their code and resubmit within the granted extension window.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Justification / Action Required</label>
              <textarea
                rows={3}
                placeholder="Explain what must be fixed (e.g. Broken environment dependencies, missing unit test suite)..."
                value={resubmitReason}
                onChange={(e) => setResubmitReason(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-800 dark:text-amber-300">
              Note: This action moves the submission status back to <strong>Draft</strong> and logs an official revision request.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowResubmitModal(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmResubmission}
              disabled={!resubmitReason.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              Confirm & Return to Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-emerald-600" />
              Evaluation Audit & Version History
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              All mark adjustments and evaluator revisions are permanently tracked.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {sub.gradeHistory && sub.gradeHistory.length > 0 ? (
              sub.gradeHistory.map((h, i) => (
                <div key={i} className="pt-2 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{h.evaluator}</span>
                    <span className="text-[10px] text-muted-foreground">{h.date}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{h.changeReason}</p>
                  <div className="font-mono text-xs font-bold text-emerald-600">
                    Recorded Score: {h.totalScore} pts
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground text-xs">
                No prior revisions recorded. This is the initial evaluation draft.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setShowHistoryModal(false)} className="text-xs">
              Close Audit Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
