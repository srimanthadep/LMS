import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  RotateCcw,
  Send,
  User,
  Headphones,
  TrendingUp,
  FileCheck2,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  BarChart2,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";

interface CompetencyScore {
  name: string;
  category: string;
  score: number;
  maxScore: number;
  description: string;
}

interface PracticeActivity {
  id: string;
  title: string;
  category:
    | "Spoken English Practice"
    | "Pronunciation and Fluency"
    | "Vocabulary and Grammar"
    | "Listening Comprehension"
    | "Presentation & Interview";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prompt: string;
  objective: string;
  completed?: boolean;
}

interface AssessmentHistoryItem {
  id: string;
  title: string;
  date: string;
  category: string;
  score: number;
  maxScore: number;
  performanceLevel: string;
  evaluator: string;
}

export const StudentCommunicationPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState<"evaluation" | "practice" | "history">("evaluation");

  // Interactive Practice Modal State
  const [selectedActivity, setSelectedActivity] = useState<PracticeActivity | null>(null);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    fluency: number;
    clarity: number;
    vocabulary: number;
    feedback: string;
  } | null>(null);

  // Competency Dimensions (All 7 suggested categories)
  const competencies: CompetencyScore[] = [
    {
      name: "Fluency",
      category: "Speech Flow & Pacing",
      score: 86,
      maxScore: 100,
      description: "Speech rate (138 WPM), smooth phrase transitions, minimal unnatural pausing.",
    },
    {
      name: "Pronunciation",
      category: "Phonetic Articulation",
      score: 90,
      maxScore: 100,
      description: "Clear consonant articulation, syllable stress accuracy on technical terms.",
    },
    {
      name: "Grammar",
      category: "Syntax & Sentence Structure",
      score: 92,
      maxScore: 100,
      description: "Precise conditional clauses, active voice formulation, correct tense agreement.",
    },
    {
      name: "Vocabulary",
      category: "Lexical Breadth & Domain Precision",
      score: 88,
      maxScore: 100,
      description: "Nuanced engineering vocabulary, accurate terminology in distributed systems.",
    },
    {
      name: "Listening",
      category: "Comprehension & Response Alignment",
      score: 94,
      maxScore: 100,
      description: "Immediate synthesis of complex questions and contextual follow-ups.",
    },
    {
      name: "Clarity and Coherence",
      category: "Logical Progression & Structure",
      score: 85,
      maxScore: 100,
      description: "Clear introductory framing, deductive rationale, concise summary closings.",
    },
    {
      name: "Confidence and Presentation",
      category: "Executive Composure & Modulation",
      score: 83,
      maxScore: 100,
      description: "Steady vocal projection, confident inflection, minimal filler reliance.",
    },
  ];

  // Practice Activities List
  const practiceActivities: PracticeActivity[] = [
    {
      id: "act-1",
      title: "Explaining System Architecture Trade-Offs",
      category: "Presentation & Interview",
      duration: "3 mins",
      difficulty: "Advanced",
      prompt:
        "Explain the latency vs throughput trade-offs between synchronous REST endpoints and asynchronous message queues to an engineering director in under 90 seconds.",
      objective: "Hone concise executive framing, structured trade-off articulation, and confident pacing.",
    },
    {
      id: "act-2",
      title: "Pronunciation Drill: Distributed Systems Terminology",
      category: "Pronunciation and Fluency",
      duration: "5 mins",
      difficulty: "Intermediate",
      prompt:
        "Read aloud: 'Asynchronous consensus algorithms like Raft prevent split-brain anomalies through deterministic leader election epochs and quorum replication.'",
      objective: "Master multisyllabic technical articulation and consonant precision.",
    },
    {
      id: "act-3",
      title: "Spoken English: Navigating Technical Disagreements",
      category: "Spoken English Practice",
      duration: "4 mins",
      difficulty: "Intermediate",
      prompt:
        "Formulate a diplomatic counter-proposal to a peer who wants to use monolithic architecture instead of microservices for a real-time analytics engine.",
      objective: "Practice constructive technical diplomacy and professional business phrasing.",
    },
    {
      id: "act-4",
      title: "Vocabulary Expansion: Precision Engineering Verbs",
      category: "Vocabulary and Grammar",
      duration: "5 mins",
      difficulty: "Beginner",
      prompt:
        "Replace common verbs (make, do, get) with high-impact precision engineering verbs (orchestrate, instantiate, benchmark, throttle, mitigate).",
      objective: "Elevate written and verbal vocabulary for project presentations.",
    },
    {
      id: "act-5",
      title: "Listening Comprehension: Faculty Viva Audio Synthesis",
      category: "Listening Comprehension",
      duration: "6 mins",
      difficulty: "Advanced",
      prompt:
        "Listen to a 60-second excerpt from Prof. Verma's lecture on KV-cache memory pressure, then formulate a 2-point response outlining mitigation steps.",
      objective: "Train fast contextual listening and precise responsive synthesis.",
    },
  ];

  // Assessment History
  const historyItems: AssessmentHistoryItem[] = [
    {
      id: "hist-1",
      title: "Midterm Capstone Presentation & Technical Viva",
      date: "11 Oct 2026",
      category: "Presentation & Interview Communication",
      score: 88,
      maxScore: 100,
      performanceLevel: "Advanced Professional",
      evaluator: "Prof. Rajesh Verma & Dr. Priya Sharma",
    },
    {
      id: "hist-2",
      title: "Sprint 2 Architecture Defense & Oral Defense",
      date: "18 Sep 2026",
      category: "Clarity, Coherence & Fluency",
      score: 81,
      maxScore: 100,
      performanceLevel: "Proficient",
      evaluator: "Dr. Priya Sharma",
    },
    {
      id: "hist-3",
      title: "Cohort 7 Diagnostic Baseline Assessment",
      date: "24 Aug 2026",
      category: "Comprehensive Communication Diagnostic",
      score: 74,
      maxScore: 100,
      performanceLevel: "Developing",
      evaluator: "Apex Academic Evaluation Board",
    },
  ];

  // Recording timer effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleOpenActivity = (act: PracticeActivity) => {
    setSelectedActivity(act);
    setIsRecording(false);
    setRecordTimer(0);
    setHasRecorded(false);
    setAssessmentResult(null);
    setIsActivityOpen(true);
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setHasRecorded(false);
      setRecordTimer(0);
    } else {
      setIsRecording(false);
      setHasRecorded(true);
    }
  };

  const handleSubmitPractice = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setAssessmentResult({
        score: 89,
        fluency: 88,
        clarity: 92,
        vocabulary: 87,
        feedback:
          "Excellent articulation and pacing (136 WPM). Good structuring with problem statement leading directly into solution rationale. Recommended follow-up: minimize filler words during transition pauses.",
      });

      addNotification({
        title: "Communication Activity Submitted",
        message: "Your response was processed and diagnostic scores have been calculated.",
        type: "system",
      });
    }, 1800);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <MessageSquare className="h-6 w-6 text-primary" /> Communication Support & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Structured verbal communication assessments, interactive speaking drills, and faculty feedback analytics.
          </p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60 self-start sm:self-auto">
          <Button
            variant={activeTab === "evaluation" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("evaluation")}
            className="rounded-lg text-xs h-8 px-3"
          >
            Structured Evaluation
          </Button>
          <Button
            variant={activeTab === "practice" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("practice")}
            className="rounded-lg text-xs h-8 px-3"
          >
            Practice Activities ({practiceActivities.length})
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className="rounded-lg text-xs h-8 px-3"
          >
            Assessment History ({historyItems.length})
          </Button>
        </div>
      </div>

      {/* Information & Disclaimer Banner */}
      <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Official Note:</strong> In-browser speech evaluation and automated phonetic analysis in this module represent frontend interactive diagnostic simulations. Official accredited evaluations are conducted via scheduled faculty viva.
        </p>
      </div>

      {/* Section C: Workflow Visualizer Banner */}
      <Card className="rounded-2xl border-border/60 shadow-sm p-4 bg-muted/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Communication Assessment Workflow
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mx-auto">
              1
            </span>
            <p className="font-semibold text-foreground">Select Activity</p>
            <p className="text-[11px] text-muted-foreground">Choose speaking prompt</p>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mx-auto">
              2
            </span>
            <p className="font-semibold text-foreground">Record Practice</p>
            <p className="text-[11px] text-muted-foreground">Speak with prompt timer</p>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mx-auto">
              3
            </span>
            <p className="font-semibold text-foreground">Submit for Review</p>
            <p className="text-[11px] text-muted-foreground">Process diagnostic model</p>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mx-auto">
              4
            </span>
            <p className="font-semibold text-foreground">Score & Feedback</p>
            <p className="text-[11px] text-muted-foreground">Review 7 dimensions</p>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1 col-span-2 sm:col-span-1">
            <span className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center mx-auto">
              5
            </span>
            <p className="font-semibold text-foreground">Track Progress</p>
            <p className="text-[11px] text-muted-foreground">Target recommendations</p>
          </div>
        </div>
      </Card>

      {/* TAB 1: STRUCTURED EVALUATION DASHBOARD */}
      {activeTab === "evaluation" && (
        <div className="space-y-6">
          {/* Main Assessment Summary Card */}
          <Card className="rounded-2xl border-2 border-primary/30 shadow-md bg-gradient-to-r from-primary/5 via-card to-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Latest Official Assessment
                  </Badge>
                  <span className="text-xs text-muted-foreground">11 Oct 2026</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                  Executive Technical Pitch & Agent Architecture Viva
                </h2>
                <p className="text-xs text-muted-foreground">
                  Evaluated by: <span className="font-semibold text-foreground">Prof. Rajesh Verma & Dr. Priya Sharma</span>
                </p>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-4 bg-background/80 p-3 rounded-2xl border border-border/60 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Overall Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-primary font-mono">88</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-border/60" />
                <div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold">
                    Advanced Professional
                  </Badge>
                  <span className="text-[10px] text-muted-foreground block mt-0.5 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" /> +7% vs baseline
                  </span>
                </div>
              </div>
            </div>

            {/* 7 Suggested Evaluation Categories Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-primary" /> Evaluation by Competency Dimensions
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {competencies.map((c) => (
                  <div
                    key={c.name}
                    className="p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-foreground">{c.name}</span>
                        <span className="text-[11px] text-muted-foreground ml-1.5">({c.category})</span>
                      </div>
                      <span className="font-mono font-bold text-primary">
                        {c.score}/{c.maxScore}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${(c.score / c.maxScore) * 100}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Areas Requiring Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" /> Demonstrated Strengths
                </h5>
                <ul className="space-y-1.5 text-xs text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    Crisp formulation of complex distributed consensus mechanisms without hesitation.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    Extensive, natural deployment of systems engineering vocabulary.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    High composure during challenging follow-up architectural edge cases.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <h5 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" /> Areas Requiring Improvement
                </h5>
                <ul className="space-y-1.5 text-xs text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    Filler words ('basically', 'you know') surface during transition phases between slides.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    Maintain consistent speech cadence (130–145 WPM) during mathematical proofs.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    Incorporate a concise 10-second executive conclusion before taking committee questions.
                  </li>
                </ul>
              </div>
            </div>

            {/* Evaluator Remarks */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1.5">
              <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" /> Faculty Evaluator Remarks
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "Arjun displayed stellar domain communication. His explanation of the KV-cache eviction policy was structured and highly persuasive. Honing transition pauses and eliminating filler habits during slide changes will elevate his technical presentations to top 1% executive readiness."
              </p>
              <p className="text-[11px] text-foreground font-semibold pt-1">
                — Prof. Rajesh Verma (Lead Faculty Chair)
              </p>
            </div>

            {/* Recommended Practice Activities */}
            <div className="pt-2 border-t border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Recommended Practice Drills
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenActivity(practiceActivities[0])}
                  className="rounded-xl text-xs h-auto p-3 text-left flex flex-col items-start gap-1 justify-between hover:border-primary/40"
                >
                  <span className="font-bold text-foreground">{practiceActivities[0].title}</span>
                  <span className="text-[10px] text-muted-foreground">Focus: Structured trade-offs</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenActivity(practiceActivities[1])}
                  className="rounded-xl text-xs h-auto p-3 text-left flex flex-col items-start gap-1 justify-between hover:border-primary/40"
                >
                  <span className="font-bold text-foreground">{practiceActivities[1].title}</span>
                  <span className="text-[10px] text-muted-foreground">Focus: Phonetic precision</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenActivity(practiceActivities[3])}
                  className="rounded-xl text-xs h-auto p-3 text-left flex flex-col items-start gap-1 justify-between hover:border-primary/40"
                >
                  <span className="font-bold text-foreground">{practiceActivities[3].title}</span>
                  <span className="text-[10px] text-muted-foreground">Focus: Precision verbs</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: PRACTICE ACTIVITIES & LEARNING RESOURCES */}
      {activeTab === "practice" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practiceActivities.map((act) => (
              <Card
                key={act.id}
                className="rounded-2xl border-border/60 hover:border-primary/40 transition-all p-5 flex flex-col justify-between shadow-sm space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {act.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 text-primary" /> {act.duration}
                      <Badge variant="secondary" className="text-[10px]">
                        {act.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{act.title}</h3>

                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Objective:</span> {act.objective}
                  </p>

                  <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground block mb-0.5">Prompt:</span>
                    "{act.prompt}"
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mic className="h-3.5 w-3.5 text-primary" /> Voice Practice Ready
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleOpenActivity(act)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-8 gap-1.5"
                  >
                    <Play className="h-3 w-3" /> Start Practice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSESSMENT HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <Card key={item.id} className="rounded-2xl border-border/60 shadow-sm p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">Evaluator: {item.evaluator}</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Score</span>
                    <span className="font-mono text-xl font-extrabold text-primary">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                    {item.performanceLevel}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}



      {/* MODAL: INTERACTIVE PRACTICE WORKFLOW (SECTION C) */}
      <Dialog open={isActivityOpen} onOpenChange={setIsActivityOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedActivity && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {selectedActivity.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Target: {selectedActivity.duration}</span>
                </div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selectedActivity.title}
                </DialogTitle>
                <DialogDescription className="text-xs">{selectedActivity.objective}</DialogDescription>
              </DialogHeader>

              {/* Prompt Card */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Speaking Prompt:</span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                  "{selectedActivity.prompt}"
                </p>
              </div>

              {/* Voice Recording Simulator */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 text-center space-y-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleRecord}
                    className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${
                      isRecording
                        ? "bg-destructive text-destructive-foreground animate-pulse scale-110 shadow-lg"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                    }`}
                  >
                    {isRecording ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
                  </button>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {isRecording ? `Recording: ${formatSeconds(recordTimer)}` : hasRecorded ? `Recorded: ${formatSeconds(recordTimer)}` : "Click to Record"}
                  </span>
                </div>

                {/* Simulated Audio Waveform */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-1 h-8">
                    {[40, 75, 20, 90, 60, 30, 85, 45, 95, 30, 60, 80, 50, 90, 40].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                )}

                <p className="text-[11px] text-muted-foreground">
                  {isRecording
                    ? "Speak clearly into your microphone. Deliver your structured technical response."
                    : hasRecorded
                    ? "Recording ready! Submit below to analyze speaking pacing, vocabulary, and grammar."
                    : "Ensure your microphone is connected before beginning your practice response."}
                </p>
              </div>

              {/* Result Diagnostic Display */}
              {assessmentResult && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="h-4 w-4" /> Diagnostic Feedback
                    </span>
                    <span className="font-mono text-sm font-extrabold text-primary">
                      Score: {assessmentResult.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-background border border-border/40">
                      <span className="text-[10px] text-muted-foreground block">Fluency</span>
                      <span className="font-bold text-foreground font-mono">{assessmentResult.fluency}%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-background border border-border/40">
                      <span className="text-[10px] text-muted-foreground block">Clarity</span>
                      <span className="font-bold text-foreground font-mono">{assessmentResult.clarity}%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-background border border-border/40">
                      <span className="text-[10px] text-muted-foreground block">Vocabulary</span>
                      <span className="font-bold text-foreground font-mono">{assessmentResult.vocabulary}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-foreground leading-relaxed">{assessmentResult.feedback}</p>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsActivityOpen(false)}
                  className="rounded-xl text-xs h-9"
                >
                  Close
                </Button>
                {hasRecorded && !assessmentResult && (
                  <Button
                    size="sm"
                    disabled={isEvaluating}
                    onClick={handleSubmitPractice}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 gap-1.5"
                  >
                    {isEvaluating ? (
                      "Analyzing Speech..."
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" /> Submit for Evaluation
                      </>
                    )}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
};
