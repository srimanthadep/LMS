import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
  Video,
  PlaySquare,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  Download,
  Star,
  MessageSquare,
  Sparkles,
  Users,
  Award,
  Bell,
  HelpCircle,
  ExternalLink,
  FileCheck2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockDataService } from "@/services/mockDataService";
import { Course, Batch } from "@/types/lms";
import { DeviceCheckModal } from "@/components/shared/DeviceCheckModal";

interface ModuleLesson {
  id: string;
  title: string;
  duration: string;
  type: "live" | "recording" | "assignment" | "notes";
  completed: boolean;
  recordingId?: string;
  notesUrl?: string;
  dppUrl?: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  completedCount: number;
  lessons: ModuleLesson[];
}

export const StudentCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const courses = mockDataService.getCourses();
  const batches = mockDataService.getBatches();

  const course = courses.find((c) => c.id === courseId || c.slug === courseId) || courses[0];
  const batch = batches.find((b) => b.courseId === course.id) || batches[0];

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
  });
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const modules: CourseModule[] = [
    {
      id: "mod-1",
      title: "Module 1: Production LLM Inference & GPU Scheduling",
      description: "KV caching, continuous batching in vLLM, Tensor Parallelism, and latency budgeting.",
      lessonsCount: 3,
      completedCount: 3,
      lessons: [
        { id: "les-1", title: "1.1 Anatomy of a Transformer Forward Pass", duration: "1h 45m", type: "recording", completed: true, recordingId: "rep-rag-8" },
        { id: "les-2", title: "1.2 PagedAttention and Memory Fragmentation", duration: "2h 10m", type: "recording", completed: true, recordingId: "rep-rag-8" },
        { id: "les-3", title: "1.3 DPP 1: Benchmarking vLLM vs TGI Latency", duration: "Practice Lab", type: "assignment", completed: true },
      ],
    },
    {
      id: "mod-2",
      title: "Module 2: Vector Databases, Chunking Strategies & Embedding Alignment",
      description: "HNSW graphs, IVF-PQ quantization, dense embedding normalization, and lost-in-the-middle context.",
      lessonsCount: 4,
      completedCount: 2,
      lessons: [
        { id: "les-4", title: "2.1 Semantic Chunking vs Recursive Character Splitting", duration: "1h 50m", type: "recording", completed: true, recordingId: "rep-rag-8" },
        { id: "les-5", title: "2.2 HNSW Graph Construction and efSearch Parameter Tuning", duration: "2h 15m", type: "recording", completed: true, recordingId: "rep-rag-8" },
        { id: "les-6", title: "2.3 Live Session 4: Multi-Agent Consensus & Supervised Workflows", duration: "Live Today 06:30 PM", type: "live", completed: false },
        { id: "les-7", title: "2.4 Milestone 2 Evaluation: Hybrid RAG Pipeline", duration: "Graded Test", type: "assignment", completed: false },
      ],
    },
    {
      id: "mod-3",
      title: "Module 3: Contextual Retrieval & Multi-Stage Cross-Encoder Rerankers",
      description: "BM25 lexical fusion, Cohere Rerank v3, reciprocal rank fusion (RRF), and score calibration.",
      lessonsCount: 3,
      completedCount: 0,
      lessons: [
        { id: "les-8", title: "3.1 Cross-Encoder vs Bi-Encoder Latency and Recall", duration: "1h 40m", type: "recording", completed: false, recordingId: "rep-rag-8" },
        { id: "les-9", title: "3.2 Reciprocal Rank Fusion Implementation", duration: "2h 00m", type: "recording", completed: false },
        { id: "les-10", title: "3.3 Lecture Notes & DPP 3: Reranker Benchmarking", duration: "Download", type: "notes", completed: false },
      ],
    },
    {
      id: "mod-4",
      title: "Module 4: Autonomous Multi-Agent Systems with LangGraph",
      description: "Stateful agent graphs, hierarchical supervisors, human-in-the-loop checkpoints, and tool reflection.",
      lessonsCount: 3,
      completedCount: 0,
      lessons: [
        { id: "les-11", title: "4.1 LangGraph State Machine Principles", duration: "2h 00m", type: "recording", completed: false },
        { id: "les-12", title: "4.2 Multi-Agent Tool Routing & Error Recovery", duration: "2h 30m", type: "recording", completed: false },
        { id: "les-13", title: "4.3 Capstone Project: Swarm Architecture", duration: "Capstone", type: "assignment", completed: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/student/courses">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" /> My Enrolled Programs
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-xs font-semibold text-foreground truncate max-w-xs">{course.title}</span>
      </div>

      {/* Hero Course Header Card */}
      <Card className="rounded-2xl border-border/80 overflow-hidden bg-card shadow-xs">
        <div className="p-6 md:p-8 bg-gradient-to-r from-rose-950/20 via-card to-card border-b border-border/70 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[#e11d48] text-white text-[10px] font-bold">ACTIVE COHORT</Badge>
              <span className="text-xs font-mono font-semibold text-muted-foreground">{batch.cohortCode}</span>
              <span className="text-xs text-muted-foreground">• Lead Faculty: <strong>{batch.teacherName}</strong></span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {course.description}
            </p>

            {/* Course Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Curriculum Progress</span>
                <span className="font-bold text-primary">68% Completed</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#e11d48] to-[#be123c] rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto">
            <Button
              onClick={() => setDeviceModalOpen(true)}
              className="bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs h-10 gap-2 shadow-sm cursor-pointer"
            >
              <Video className="h-4 w-4" /> Join Live Classroom
            </Button>

            <Button
              onClick={() => navigate("/student/replays/rep-rag-8")}
              variant="outline"
              className="text-xs h-10 gap-2 font-semibold hover:border-primary/50 cursor-pointer"
            >
              <PlaySquare className="h-4 w-4 text-primary" /> Resume Lecture 8 Replay
            </Button>
          </div>
        </div>

        {/* Course Quick Meta Tabs */}
        <div className="px-6 py-3.5 bg-muted/20 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground border-b border-border/60">
          <span className="flex items-center gap-1.5 font-medium">
            <BookOpen className="h-3.5 w-3.5 text-primary" /> {modules.length} Modules ({modules.reduce((a, m) => a + m.lessonsCount, 0)} Lectures & Labs)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="h-3.5 w-3.5 text-primary" /> {course.totalHours} Total Hours Content
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Award className="h-3.5 w-3.5 text-primary" /> Distinction Certificate on Completion
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Access Valid until {batch.entitlement.accessExpiryDate}
          </span>
        </div>
      </Card>

      {/* Main Tabs: Curriculum vs Other Courses vs Feedback */}
      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList className="h-10 p-1">
          <TabsTrigger value="curriculum" className="text-xs font-semibold gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Syllabus & Curriculum
          </TabsTrigger>
          <TabsTrigger value="announcements" className="text-xs font-semibold gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Notice Board & Updates
          </TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs font-semibold gap-1.5">
            <Star className="h-3.5 w-3.5" /> Course Feedback & Rating
          </TabsTrigger>
          <TabsTrigger value="assignments" className="text-xs font-semibold gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5" /> Assignments, Tests & Self-Notes
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Curriculum & Syllabus */}
        <TabsContent value="curriculum" className="space-y-4">
          {modules.map((mod, idx) => {
            const isExpanded = !!expandedModules[mod.id];
            const isCompleted = mod.completedCount === mod.lessonsCount;

            return (
              <Card key={mod.id} className="rounded-2xl border-border/80 overflow-hidden shadow-2xs">
                <div
                  onClick={() => toggleModule(mod.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCompleted ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-primary/10 text-primary"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {mod.completedCount} / {mod.lessonsCount} Completed
                    </span>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Lessons List */}
                {isExpanded && (
                  <div className="border-t border-border/70 divide-y divide-border/60 bg-muted/10">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {les.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                          )}

                          <span className="text-xs font-semibold text-foreground truncate">
                            {les.title}
                          </span>

                          <Badge variant="outline" className="text-[10px] uppercase font-mono shrink-0">
                            {les.type}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className="text-xs text-muted-foreground font-mono">
                            {les.duration}
                          </span>

                          {les.type === "live" && (
                            <Button
                              size="sm"
                              onClick={() => setDeviceModalOpen(true)}
                              className="text-[11px] h-7 bg-[#e11d48] text-white font-bold gap-1 cursor-pointer"
                            >
                              <Video className="h-3 w-3" /> Join Live
                            </Button>
                          )}

                          {les.type === "recording" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/student/replays/${les.recordingId || "rep-rag-8"}`)}
                              className="text-[11px] h-7 gap-1 font-semibold cursor-pointer"
                            >
                              <PlaySquare className="h-3 w-3 text-primary" /> Watch Replay
                            </Button>
                          )}

                          {les.type === "assignment" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate("/student/assessments")}
                              className="text-[11px] h-7 gap-1 font-semibold cursor-pointer"
                            >
                              <FileText className="h-3 w-3 text-primary" /> Open Lab
                            </Button>
                          )}

                          {les.type === "notes" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[11px] h-7 gap-1 font-semibold cursor-pointer"
                              onClick={() => alert("Downloading lecture PDF notes...")}
                            >
                              <Download className="h-3 w-3 text-primary" /> Notes
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>

        {/* Tab 2: Notice Board & Announcements */}
        <TabsContent value="announcements" className="space-y-4">
          <Card className="p-5 rounded-2xl bg-card border-border/80 shadow-2xs space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h3 className="font-bold text-sm text-foreground">Cohort 7 Official Announcements</h3>
              <p className="text-xs text-muted-foreground">Broadcasted notices by Prof. Rajesh Verma and Course Management.</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">Office Hours Rescheduled</span>
                  <span className="text-muted-foreground font-mono">Yesterday, 05:00 PM</span>
                </div>
                <p className="text-xs text-foreground">
                  Doubt clarification office hours for Module 2 have been shifted to Friday 07:00 PM IST to accommodate students working on Cohere Rerank benchmarks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Milestone 2 Rubrics Released</span>
                  <span className="text-muted-foreground font-mono">12 Oct 2026</span>
                </div>
                <p className="text-xs text-foreground">
                  The automated grading suite and evaluator rubrics for Hybrid RAG with Contextual Compression are now visible under your Assessments tab.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Course Feedback & Rating */}
        <TabsContent value="feedback" className="space-y-4">
          <Card className="p-6 rounded-2xl bg-card border-border/80 shadow-2xs space-y-5 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-foreground">Share Feedback for Cohort 7</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your rating and remarks help Prof. Verma and the academic team tune pacing, laboratory difficulty, and live demonstrations.
              </p>
            </div>

            {feedbackSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Thank you! Your feedback has been recorded and submitted anonymously to the faculty board.</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Overall Curriculum & Instruction Quality:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className={`h-6 w-6 ${star <= feedbackRating ? "fill-current" : "stroke-current fill-none"}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-foreground ml-2">{feedbackRating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Constructive Remarks & Laboratory Feedback:
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Tell us what you loved, or suggest topics you want deeper hands-on lab exercises in..."
                    className="w-full p-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>

                <Button
                  onClick={() => setFeedbackSubmitted(true)}
                  className="bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-xs h-9 cursor-pointer"
                >
                  Submit Faculty Feedback
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 4: Assignments, Tests & Self Notes */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignments & Tests */}
            <Card className="rounded-2xl border-border/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-primary" /> Graded Milestone Tests & DPP Labs
                </h3>
                <Badge variant="outline" className="text-xs">2 Items</Badge>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">DPP 1: Benchmarking vLLM vs TGI Latency</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">Graded (100/100)</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Submission verified. PyTorch CUDA memory profiler script accepted.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">Milestone 2: Hybrid Dense-Sparse RAG Test</span>
                    <Badge variant="destructive" className="text-[10px]">Due Friday</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">45-minute timed test covering reciprocal rank fusion and vector indices.</p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/student/assessments/take")}
                    className="w-full text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg"
                  >
                    Launch Timed Test
                  </Button>
                </div>
              </div>
            </Card>

            {/* Self Notes */}
            <Card className="rounded-2xl border-border/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Personal Course Study Notes
                </h3>
                <span className="text-xs text-muted-foreground">Auto-saved to session</span>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={5}
                  defaultValue={`- PagedAttention reduces memory waste from 60-80% down to under 4% by dividing KV cache into physical blocks.\n- Continuous batching (iteration-level scheduling) boosts throughput 2.5x-4x compared to static batching.\n- HNSW efSearch=64 provides sweet spot for recall vs latency.`}
                  className="w-full p-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">Last edited: Today, 10:45 AM</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert("Notes downloaded as course_notes.txt")}
                    className="text-xs h-8 rounded-lg gap-1.5"
                  >
                    <Download className="h-3 w-3" /> Download Notes (.txt)
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pre-Join Hardware Check Modal */}
      <DeviceCheckModal
        open={deviceModalOpen}
        onOpenChange={setDeviceModalOpen}
        targetClassId="class-agentic-101"
        classTitle={`Session 4: Multi-Agent Consensus (${course.title})`}
      />
    </div>
  );
};
export default StudentCourseDetailPage;
