import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck2,
  CheckCircle2,
  Eye,
  Sliders,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface QuestionItem {
  id: string;
  type: "mcq" | "code" | "descriptive";
  question: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  explanation?: string;
}

export const TestCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === "admin" || role === "super-admin";

  // Assessment Meta (Read-only review of Admin-published assessment)
  const testTitle = "Checkpoint Exam: Agent Swarm Coordination & Safety";
  const courseTitle = "Full-Stack AI & LLM Systems";
  const targetBatch = "Cohort 7 (Live + Replay)";
  const durationMins = 60;
  const passingPercentage = 70;
  const maxAttempts = 2;
  const instructions =
    "Strict time-limited assessment. All objective questions carry equal weight. Code questions are scored against automated test assertions.";

  // Subjective Rubric Dimensions
  const criteria = [
    { id: "c1", name: "Multi-Agent Consensus Protocol Correctness", maxScore: 25 },
    { id: "c2", name: "Tool Routing & Zod Schema Validation", maxScore: 25 },
    { id: "c3", name: "Resilient Error Recovery & Circuit Breakers", maxScore: 25 },
    { id: "c4", name: "Code Cleanliness & Unit Test Coverage", maxScore: 25 },
  ];

  // Objective / MCQ Questions
  const questions: QuestionItem[] = [
    {
      id: "q1",
      type: "mcq",
      question: "In LangGraph, what does returning a Command or Send object allow a supervisor node to do?",
      options: [
        "Dynamically map tasks across worker nodes with custom state payloads",
        "Immediately terminate the graph session with an error",
        "Force synchronous single-threaded blocking execution",
        "Delete graph checkpoint memory",
      ],
      correctOptionIndex: 0,
      marks: 10,
      explanation: "Send allows parallel dynamic fan-out to worker subgraphs with isolated state slices.",
    },
    {
      id: "q2",
      type: "mcq",
      question: "What is the primary mitigation against recursive tool execution loops in agent swarms?",
      options: [
        "Setting a strict maximum iteration bound / recursion limit with circuit breakers",
        "Increasing LLM temperature to 1.5",
        "Disabling system prompts entirely",
        "Using unvalidated JSON objects",
      ],
      correctOptionIndex: 0,
      marks: 10,
      explanation: "Recursion limits prevent infinite token expenditure when agents fail to reach stopping conditions.",
    },
  ];

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const calculateTotalMarks = () => {
    const rubricTotal = criteria.reduce((sum, c) => sum + Number(c.maxScore || 0), 0);
    const questionTotal = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);
    return rubricTotal + questionTotal;
  };

  const totalMarks = calculateTotalMarks();
  const passingCutoffMarks = Math.round((totalMarks * Number(passingPercentage)) / 100);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/teacher/assignments")}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1 font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Assignments
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-primary" /> Assessment & Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Review exam questions, verified answer keys, explanations, and grading rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Badge className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-3">
              Assessment Authoring
            </Badge>
          ) : (
            <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-xs px-3 py-1 font-semibold">
              Active Assessment
            </Badge>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreviewModal(true)}
            className="h-9 text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-emerald-600" /> Preview Student Exam View
          </Button>
        </div>
      </div>

      {/* Basic Settings */}
      <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Assessment Parameters & Verification
          </h3>
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold uppercase">
            Active Exam
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Assessment Title</span>
            <p className="text-xs font-bold text-foreground">{testTitle}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Course Association</span>
            <p className="text-xs font-semibold text-foreground">{courseTitle}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Target Cohort</span>
            <p className="text-xs font-semibold text-foreground">{targetBatch}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/60">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Time Limit</span>
              <p className="text-xs font-semibold text-foreground">{durationMins} Minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Passing Threshold</span>
              <p className="text-xs font-semibold text-foreground">{passingPercentage}% Minimum Cutoff</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Allowed Attempts</span>
              <p className="text-xs font-semibold text-foreground">{maxAttempts} Retakes Permitted</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t border-border/60">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Instructions & Proctoring Guidelines</span>
          <p className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/50">
            {instructions}
          </p>
        </div>
      </Card>

      {/* Objective Questions Section */}
      <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" /> Objective Questions ({questions.length})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Multiple choice questions evaluated automatically upon student submission with verified answer keys.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono font-semibold">
            {questions.reduce((sum, q) => sum + q.marks, 0)} Question Marks
          </Badge>
        </div>

        <div className="space-y-4">
          {questions.map((q, qIndex) => (
            <div key={q.id} className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-primary font-mono shrink-0 px-2 py-0.5 rounded bg-primary/10">
                    Q{qIndex + 1}
                  </span>
                  <p className="text-xs font-bold text-foreground leading-relaxed">{q.question}</p>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono shrink-0">
                  {q.marks} Marks
                </Badge>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIndex) => {
                  const isCorrect = q.correctOptionIndex === optIndex;
                  return (
                    <div
                      key={optIndex}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
                          : "border-border/60 bg-background text-foreground"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                          isCorrect
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {isCorrect ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="text-xs font-medium flex-1">{opt}</span>
                      {isCorrect && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="pt-2 text-[11px] text-muted-foreground bg-background p-2.5 rounded-lg border border-border/60 flex items-start gap-1.5">
                  <span className="font-bold text-primary shrink-0">Faculty Rationale:</span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Subjective Rubric Criteria */}
      <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" /> Subjective Code & Architecture Rubrics ({criteria.length})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Faculty and evaluators score student deliverables against these benchmark criteria.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono font-semibold">
            {criteria.reduce((sum, c) => sum + c.maxScore, 0)} Rubric Marks
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {criteria.map((crit, index) => (
            <div
              key={crit.id}
              className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary font-mono">#{index + 1}</span>
                <span className="text-xs font-semibold text-foreground">{crit.name}</span>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-bold shrink-0">
                Max {crit.maxScore} pts
              </Badge>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
            Total Assessment Weightage:
          </span>
          <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
            {totalMarks} Marks (Passing Cutoff: {passingCutoffMarks} Marks)
          </span>
        </div>
      </Card>

      {/* Assessment Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">Student View Preview</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{testTitle}</h3>
                <p className="text-xs text-slate-500">
                  {durationMins} Mins • Total Marks: {totalMarks} • Passing: {passingPercentage}%
                </p>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101713] border border-slate-200 dark:border-white/10 text-xs">
                <strong>Instructions:</strong> {instructions}
              </div>

              {questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-xl border border-border/70 space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Q{idx + 1}. {q.question}</span>
                    <span className="font-mono text-emerald-600">[{q.marks} Marks]</span>
                  </div>
                  <div className="space-y-1.5 pl-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/10">
              <Button size="sm" onClick={() => setShowPreviewModal(false)} className="text-xs">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCreationPage;
