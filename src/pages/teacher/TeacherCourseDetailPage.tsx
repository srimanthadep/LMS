import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  PlaySquare,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  Users,
  Eye,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { teacherDataService, TeacherResourceItem } from "./teacherDataService";
import { Course } from "@/types/lms";
import { useNotifications } from "@/context/NotificationContext";

interface LessonItem {
  id: string;
  title: string;
  type: "video" | "pdf" | "quiz" | "code";
  durationMinutes: number;
  isPublished: boolean;
  learningObjective: string;
  contentUrl?: string;
}

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  lessons: LessonItem[];
}

const DEFAULT_MODULES: ModuleSection[] = [
  {
    id: "mod-1",
    title: "Module 1: Foundations of Deep Learning & Attention Mechanisms",
    description: "Mathematical review of self-attention, query-key-value transformations, and residual layers.",
    lessons: [
      {
        id: "les-1",
        title: "1.1 Scaled Dot-Product Attention from Scratch",
        type: "video",
        durationMinutes: 45,
        isPublished: true,
        learningObjective: "Derive attention matrices and calculate multi-head dimension bounds.",
        contentUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "les-2",
        title: "1.2 PyTorch Tensor Implementation Lab",
        type: "code",
        durationMinutes: 60,
        isPublished: true,
        learningObjective: "Implement flash attention kernel and benchmark memory consumption.",
      },
      {
        id: "les-3",
        title: "1.3 Attention Complexity & Softmax Math Notes",
        type: "pdf",
        durationMinutes: 30,
        isPublished: true,
        learningObjective: "Review memory complexity O(N^2) tradeoffs vs linear attention.",
      },
    ],
  },
  {
    id: "mod-2",
    title: "Module 2: RAG Architectures & Vector Similarity Search",
    description: "Dense embedding spaces, chunking heuristics, and HNSW/IVFFlat indexing.",
    lessons: [
      {
        id: "les-4",
        title: "2.1 Chunking Strategies & Boundary Overlaps",
        type: "video",
        durationMinutes: 50,
        isPublished: true,
        learningObjective: "Evaluate semantic vs recursive character chunking accuracy.",
      },
      {
        id: "les-5",
        title: "2.2 FAISS Vector Store Integration & Recall Benchmarking",
        type: "code",
        durationMinutes: 75,
        isPublished: true,
        learningObjective: "Configure efSearch and nprobe parameters for sub-5ms lookups.",
      },
      {
        id: "les-6",
        title: "2.3 Checkpoint Quiz: Embedding Space Topologies",
        type: "quiz",
        durationMinutes: 20,
        isPublished: false,
        learningObjective: "Assess comprehension of cosine vs inner-product similarity metrics.",
      },
    ],
  },
  {
    id: "mod-3",
    title: "Module 3: Autonomous Multi-Agent Swarms & Planning",
    description: "ReAct loops, scratchpads, supervisory consensus, and fallback routing.",
    lessons: [
      {
        id: "les-7",
        title: "3.1 Memory Architecture: Ephemeral vs Long-Term Vector Memory",
        type: "video",
        durationMinutes: 60,
        isPublished: false,
        learningObjective: "Implement session memory buffer and summary pruning strategies.",
      },
      {
        id: "les-8",
        title: "3.2 Tool Calling & Schema Validation with Zod",
        type: "code",
        durationMinutes: 90,
        isPublished: false,
        learningObjective: "Author strict JSON schemas for multi-turn API agent tool calling.",
      },
    ],
  },
];

export const TeacherCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const courses = teacherDataService.getCourses();
  const course = courses.find((c) => c.id === courseId) || courses[0];

  const storageKey = `lms_course_modules_${course.id}`;
  const [modules, setModules] = useState<ModuleSection[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MODULES;
  });

  const [activeTab, setActiveTab] = useState<"modules" | "progress" | "resources">("modules");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
    "mod-3": true,
  });

  // Preview Modal
  const [previewLesson, setPreviewLesson] = useState<LessonItem | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Get resources for this course
  const courseResources = teacherDataService.getResources().filter(
    (r) => r.courseId === course.id || r.courseTitle === course.title
  );

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => navigate("/teacher/courses")}
          className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </button>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-sm">{course.title}</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#151f1a] border border-slate-200 dark:border-white/10 shadow-xs">
        <div className="flex items-start gap-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white text-[10px] font-semibold">{course.category}</Badge>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {course.level}
              </Badge>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">Cohort 7 Live Batch</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {course.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl line-clamp-1">{course.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate("/teacher/classroom/class-agentic-101")}
            className="h-9 text-xs font-semibold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Launch Live Studio
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/teacher/students")}
            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 dark:border-white/10 cursor-pointer"
          >
            <Users className="h-3.5 w-3.5" />
            Enrolled Students ({course.enrolledStudentsCount || 112})
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("modules")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "modules"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Layers className="h-4 w-4" />
          Modules & Lesson Tree ({modules.length})
        </button>

        <button
          onClick={() => setActiveTab("progress")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "progress"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Learning Objectives & Student Progress
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "resources"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          Course Resources & Slides ({courseResources.length})
        </button>
      </div>

      {/* Tab 1: Modules & Lesson Hierarchy */}
      {activeTab === "modules" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Curriculum structure and lesson progression for this course.</span>
            <span className="text-xs font-mono text-slate-400">{modules.length} Modules</span>
          </div>

          <div className="space-y-3">
            {modules.map((mod) => {
              const isExpanded = !!expandedModules[mod.id];
              return (
                <div
                  key={mod.id}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] overflow-hidden shadow-2xs"
                >
                  {/* Module Accordion Header */}
                  <div className="p-4 flex items-center justify-between bg-slate-50/70 dark:bg-[#121c17] border-b border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{mod.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[11px] font-mono">
                        {mod.lessons.length} Lessons
                      </Badge>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="p-3 space-y-2">
                      {mod.lessons.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-4">
                          No lessons added to this module yet.
                        </p>
                      ) : (
                        mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5 bg-white dark:bg-[#121c17] hover:border-slate-300 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                {lesson.type === "video" && <PlaySquare className="h-4 w-4" />}
                                {lesson.type === "pdf" && <FileText className="h-4 w-4" />}
                                {lesson.type === "quiz" && <Sparkles className="h-4 w-4" />}
                                {lesson.type === "code" && <FileCode className="h-4 w-4" />}
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {lesson.title}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                  Target Objective: {lesson.learningObjective}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {lesson.durationMinutes}m
                              </span>

                              <Badge
                                variant={lesson.isPublished ? "default" : "secondary"}
                                className={`text-[10px] font-mono ${
                                  lesson.isPublished ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : ""
                                }`}
                              >
                                {lesson.isPublished ? "Published" : "Draft"}
                              </Badge>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPreviewLesson(lesson)}
                                className="h-7 px-2.5 text-xs text-blue-600 hover:bg-blue-50 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Learning Objectives & Student Progress */}
      {activeTab === "progress" && (
        <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Curriculum Competency & Progress</h3>
              <p className="text-xs text-slate-500">
                Track how enrolled learners are progressing through each module's objectives and passing criteria.
              </p>
            </div>
            <Badge className="bg-emerald-600 text-white">Full-Stack AI Track</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121c17] space-y-2">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono">
                Module 1: Foundations
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Transformer Math & PyTorch</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Learners build attention mechanisms and derive computational complexity constraints from scratch.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Cohort Completion</span>
                  <span className="text-emerald-700 font-mono">100% (112 / 112)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="w-full h-full bg-emerald-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121c17] space-y-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-mono">
                Module 2: Systems
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Vector Databases & RAG</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect Faiss & Qdrant vector indices, implement hybrid reciprocal rank fusion, and benchmark recall.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Cohort Completion</span>
                  <span className="text-blue-700 font-mono">78% (87 / 112)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="w-[78%] h-full bg-blue-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121c17] space-y-2">
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider font-mono">
                Module 3: Production
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Multi-Agent Orchestration</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Deploy containerized agent swarms with human oversight, tool sandboxes, and circuit breaker recovery.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Cohort Completion</span>
                  <span className="text-purple-700 font-mono">32% (36 / 112)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="w-[32%] h-full bg-purple-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Learning Materials & Resources (Review) */}
      {activeTab === "resources" && (
        <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Course Materials & Learning Assets</h3>
              <p className="text-xs text-slate-500">
                Lecture presentation decks, reading documents, and notebook files for this course.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/teacher/resources")}
              className="text-xs border-slate-200 dark:border-white/10 gap-1.5 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
              Open Resource Library
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {courseResources.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 col-span-2 text-center">
                No course-specific materials available yet.
              </p>
            ) : (
              courseResources.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#121c17] hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      DOC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{file.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {file.type} • {file.fileSize} • {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {file.downloads} dl
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Lesson Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
                  {previewLesson.type} Preview
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{previewLesson.title}</h3>
              </div>
              <button onClick={() => setPreviewLesson(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#101713] border border-slate-200 dark:border-white/10 space-y-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Learning Objective: <span className="font-normal">{previewLesson.learningObjective}</span>
              </p>
              <p className="text-xs font-mono text-slate-500">
                Duration: {previewLesson.durationMinutes} minutes • Status: {previewLesson.isPublished ? "Published" : "Draft"}
              </p>
            </div>

            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl space-y-2">
              <PlaySquare className="h-10 w-10 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Interactive Student Viewer</p>
              <p className="text-[11px] text-slate-400">
                Video player stream and code execution container ready for student playback.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setPreviewLesson(null)} className="text-xs">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseDetailPage;
