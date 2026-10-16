import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck2,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  Mic,
  Square,
  Volume2,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileText,
  HelpCircle,
  ChevronDown,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { mockDataService } from "@/services/mockDataService";
import { TestSubmission } from "@/types/lms";

export const StudentAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const submissions = mockDataService.getSubmissions();
  const [filter, setFilter] = useState<string>("all");

  // Voice recording practice state
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioAnalysis, setAudioAnalysis] = useState<{
    score: number;
    speechClarity: number;
    keywordDensity: number;
    confidence: number;
    feedback: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setRecordedAudioUrl(null);
    setAudioAnalysis(null);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopVoiceRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordedAudioUrl("mock-audio-blob-recording.wav");

    // Simulate AI speech & rubric evaluation
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAudioAnalysis({
        score: 92,
        speechClarity: 94,
        keywordDensity: 90,
        confidence: 91,
        feedback:
          "Excellent architectural articulation. You accurately identified HNSW graph layering, efSearch parameter latency trade-offs, and Cohere cross-encoder reranking constraints.",
      });
    }, 1200);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === "all") return true;
    if (filter === "graded") return s.status === "graded";
    if (filter === "pending") return s.status === "pending" || s.status === "draft";
    if (filter === "re_eval") return s.status === "re_evaluation_requested";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <FileCheck2 className="h-6 w-6 text-primary transition-transform duration-200 hover:scale-110" />
            Assessments, Tests & Evaluations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track your curriculum milestones, take proctored timed assessments, practice voice viva submissions, and review rubric grades.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={() => setIsRecordingModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs h-9 gap-1.5 border-primary/30 hover:bg-primary/5 text-primary cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Mic className="h-4 w-4" /> Voice Viva Practice
          </Button>

          <Button
            onClick={() => navigate("/student/assessments/take")}
            size="sm"
            className="text-xs h-9 gap-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold shadow-sm cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Take Timed Test
          </Button>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-2xl bg-card border-border/80 shadow-2xs hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">Average Milestone Score</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">95</span>
            <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Top 5% in Cohort 7
          </span>
        </Card>

        <Card className="p-4 rounded-2xl bg-card border-border/80 shadow-2xs hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">Completed Submissions</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{submissions.length}</span>
            <span className="text-xs text-muted-foreground">milestones</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            1 Under faculty review
          </span>
        </Card>

        <Card className="p-4 rounded-2xl bg-card border-border/80 shadow-2xs hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">Timed Assessment</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">1 Active</span>
            <span className="text-xs text-muted-foreground">45m duration</span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 block">
            Covers RAG & HNSW Graphs
          </span>
        </Card>

        <Card className="p-4 rounded-2xl bg-card border-border/80 shadow-2xs hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold">Certification Eligibility</span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">Eligible</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Requires ≥ 75% overall grade
          </span>
        </Card>
      </div>

      {/* Active Assessment Banner */}
      <Card className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#e11d48] text-white text-[10px] font-bold">AVAILABLE NOW</Badge>
            <span className="text-xs text-muted-foreground font-mono">CODE: EVAL-LLM-C7</span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            Milestone 2 Timed Evaluation: Vector Indexing & Contextual Compression
          </h3>
          <p className="text-xs text-muted-foreground">
            4 Questions (2 MCQs, 1 Live Python Implementation, 1 Architectural Reasoning) • 45 Minutes Limit
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <Button
            onClick={() => navigate("/student/assessments/take")}
            className="w-full md:w-auto bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs h-9 gap-1.5 shadow-sm cursor-pointer"
          >
            Launch Test Environment <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>

      {/* Tabs & Submissions List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Milestone Submissions & Rubric Feedback
          </h2>

          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="graded" className="text-xs">Graded</TabsTrigger>
              <TabsTrigger value="re_eval" className="text-xs">Re-Evaluations</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-3.5">
          {filteredSubmissions.map((sub) => {
            const isReEval = sub.status === "re_evaluation_requested";
            return (
              <Card
                key={sub.id}
                className="p-5 rounded-2xl bg-card border-border/80 shadow-2xs hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary">{sub.testId}</span>
                    <Badge
                      variant={isReEval ? "warning" : "default"}
                      className="text-[10px] font-bold"
                    >
                      {isReEval ? "RE-EVALUATION IN PROGRESS" : "GRADED & RELEASED"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Submitted: {sub.submittedAt}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    {sub.testTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Course: <strong className="text-foreground">{sub.courseTitle}</strong> • {sub.batchName}
                  </p>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Final Score:</span>
                      <strong className="text-sm font-bold text-foreground">
                        {sub.totalScore} / {sub.maxScore}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Objective: {sub.objectiveScore}/{sub.objectiveMaxScore}</span>
                    </div>
                  </div>

                  {sub.evaluatorFeedback && (
                    <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-muted-foreground italic">
                      Faculty remarks: “{sub.evaluatorFeedback}”
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => navigate(`/student/test-results/${sub.id}`)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-9 gap-1.5 font-semibold hover:border-primary/50 cursor-pointer"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-primary" /> View Detailed Rubric
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Voice Recording / Audio Viva Practice Modal */}
      <Dialog open={isRecordingModalOpen} onOpenChange={setIsRecordingModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Mic className="h-5 w-5 text-primary" /> Voice Viva Practice & AI Score Analysis
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record a 1-2 minute spoken architectural defense of your RAG or Agentic design to evaluate speech clarity, technical terminology density, and conceptual mastery.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 my-2">
            {/* Prompt Prompt */}
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 text-xs space-y-1">
              <p className="font-semibold text-foreground">Prompt Question:</p>
              <p className="text-muted-foreground">
                “Explain why HNSW graph search combined with Cohere cross-encoder reranking yields higher precision than standalone dense cosine retrieval.”
              </p>
            </div>

            {/* Recorder Controls */}
            <div className="p-6 rounded-2xl border border-border/80 bg-slate-950 text-white flex flex-col items-center justify-center space-y-4 shadow-inner">
              <div className="flex items-center gap-2 font-mono text-2xl font-bold tracking-widest text-rose-400">
                {isRecording && <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping mr-1" />}
                {formatTimer(recordingSeconds)}
              </div>

              {/* Animated Audio Waveform Simulation */}
              <div className="flex items-center gap-1 h-12 w-full max-w-xs justify-center">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isRecording
                        ? "bg-rose-500"
                        : "bg-slate-700"
                    }`}
                    style={{
                      height: isRecording ? `${Math.max(8, (Math.sin(i * 0.7 + recordingSeconds * 4) * 20) + 24)}px` : "6px",
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <Button
                    onClick={startVoiceRecording}
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white gap-2 font-semibold text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    <Mic className="h-4 w-4" /> Start Spoken Answer
                  </Button>
                ) : (
                  <Button
                    onClick={stopVoiceRecording}
                    size="sm"
                    className="bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 gap-2 font-semibold text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    <Square className="h-4 w-4 fill-current" /> Stop & Analyze
                  </Button>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            {isAnalyzing && (
              <div className="p-4 text-center space-y-2">
                <Sparkles className="h-5 w-5 text-primary animate-spin mx-auto" />
                <p className="text-xs font-semibold text-foreground">AI Speech & Technical Evaluator Analyzing Audio...</p>
              </div>
            )}

            {audioAnalysis && !isAnalyzing && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Viva Score: {audioAnalysis.score}/100
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30">
                    High Distinction
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-card/60 border border-border/40">
                    <span className="block text-[10px] text-muted-foreground">Clarity</span>
                    <strong className="text-foreground font-bold">{audioAnalysis.speechClarity}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-card/60 border border-border/40">
                    <span className="block text-[10px] text-muted-foreground">Keywords</span>
                    <strong className="text-foreground font-bold">{audioAnalysis.keywordDensity}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-card/60 border border-border/40">
                    <span className="block text-[10px] text-muted-foreground">Confidence</span>
                    <strong className="text-foreground font-bold">{audioAnalysis.confidence}%</strong>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {audioAnalysis.feedback}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecordingModalOpen(false)}
              className="text-xs"
            >
              Close Practice Viva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default StudentAssessmentsPage;
