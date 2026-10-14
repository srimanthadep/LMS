import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  PlaySquare,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Trash2,
  Edit2,
  Users,
  Eye,
  FileCode,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Course } from "@/types/lms";

interface LessonItem {
  id: string;
  title: string;
  type: "video" | "pdf" | "quiz" | "code";
  durationMinutes: number;
  isPublished: boolean;
  learningObjective: string;
}

interface ModuleSection {
  id: string;
  title: string;
  description: string;
  lessons: LessonItem[];
}

export const TeacherCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const courses = mockDataService.getCourses();
  const course = courses.find((c) => c.id === courseId) || courses[0];

  const [modules, setModules] = useState<ModuleSection[]>([
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
  ]);

  const [activeTab, setActiveTab] = useState<"modules" | "resources" | "learning-path">("modules");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
    "mod-3": true,
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLessonPublish = (modId: string, lesId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id !== modId) return mod;
        return {
          ...mod,
          lessons: mod.lessons.map((les) => (les.id === lesId ? { ...les, isPublished: !les.isPublished } : les)),
        };
      })
    );
  };

  const handleAddLesson = (modId: string) => {
    const newLesson: LessonItem = {
      id: `les-${Date.now()}`,
      title: "New Draft Lesson",
      type: "video",
      durationMinutes: 45,
      isPublished: false,
      learningObjective: "Specify key concept and practical takeaways for this unit.",
    };

    setModules((prev) =>
      prev.map((mod) => (mod.id === modId ? { ...mod, lessons: [...mod.lessons, newLesson] } : mod))
    );
  };

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => navigate("/teacher/courses")}
          className="flex items-center gap-1 hover:text-slate-800 transition cursor-pointer font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </button>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-sm">{course.title}</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#151f1a] border border-slate-200 dark:border-white/10 shadow-xs">
        <div className="flex items-start gap-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
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
            <p className="text-xs text-slate-500 max-w-2xl line-clamp-1">{course.description}</p>
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
            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 cursor-pointer"
          >
            <Users className="h-3.5 w-3.5" />
            Enrolled Students ({course.enrolledStudentsCount})
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
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="h-4 w-4" />
          Modules & Lesson Tree ({modules.length})
        </button>

        <button
          onClick={() => setActiveTab("learning-path")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "learning-path"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Learning Objectives & Paths
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "resources"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          Course Resources & Slides
        </button>
      </div>

      {/* Tab 1: Modules & Lesson Hierarchy */}
      {activeTab === "modules" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Drag modules and lessons to reorder. Toggle status between Draft and Live.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newMod: ModuleSection = {
                  id: `mod-${Date.now()}`,
                  title: `Module ${modules.length + 1}: Advanced Optimization & Quantization`,
                  description: "AWQ, GPTQ, FlashAttention-2, and TensorRT-LLM deployment pipelines.",
                  lessons: [],
                };
                setModules([...modules, newMod]);
              }}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Module
            </Button>
          </div>

          <div className="space-y-3">
            {modules.map((mod, modIdx) => {
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
                        <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        {mod.lessons.length} Lessons
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddLesson(mod.id)}
                        className="h-7 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Lesson
                      </Button>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="p-3 space-y-2">
                      {mod.lessons.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-4">
                          No lessons added to this module yet. Click "Add Lesson" above.
                        </p>
                      ) : (
                        mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5 bg-white dark:bg-[#121c17] hover:border-slate-300 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <GripVertical className="h-4 w-4 text-slate-300 cursor-grab shrink-0" />
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

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {lesson.durationMinutes}m
                              </span>

                              <button
                                onClick={() => toggleLessonPublish(mod.id, lesson.id)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer border ${
                                  lesson.isPublished
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                    : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                                }`}
                              >
                                {lesson.isPublished ? "Published" : "Draft"}
                              </button>
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

      {/* Tab 2: Learning Objectives & Bloom's Taxonomy Paths */}
      {activeTab === "learning-path" && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Curriculum Competency Map</h3>
              <p className="text-xs text-slate-500">
                Track how course modules align with industry outcomes and real-time evaluation rubrics.
              </p>
            </div>
            <Badge className="bg-emerald-600 text-white">Full-Stack AI Track</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                Level 1: Foundations
              </span>
              <h4 className="text-sm font-bold text-slate-800">Transformer Math & PyTorch</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learners build attention mechanisms and derive computational complexity constraints from scratch.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 pt-1">3 Modules • 100% Passed</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-mono">
                Level 2: Systems
              </span>
              <h4 className="text-sm font-bold text-slate-800">Vector Databases & RAG</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect Faiss & Qdrant vector indices, implement hybrid reciprocal rank fusion, and benchmark recall.
              </p>
              <div className="text-[11px] font-semibold text-blue-700 pt-1">4 Modules • In Progress (Cohort 7)</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider font-mono">
                Level 3: Production
              </span>
              <h4 className="text-sm font-bold text-slate-800">Multi-Agent Orchestration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deploy containerized agent swarms with human oversight, tool sandboxes, and circuit breaker recovery.
              </p>
              <div className="text-[11px] font-semibold text-purple-700 pt-1">5 Modules • Upcoming</div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Resources & Uploads */}
      {activeTab === "resources" && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Materials & Downloads</h3>
              <p className="text-xs text-slate-500">
                Authorized PDFs, lecture presentation decks, and Jupyter Colab starter notebooks available to students.
              </p>
            </div>
            <Button size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              Upload New Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              { name: "Module-1-Self-Attention-Math.pdf", size: "4.8 MB", date: "Uploaded 2 days ago", downloads: 112 },
              { name: "Lecture-4-Faiss-Benchmarking.ipynb", size: "1.2 MB", date: "Uploaded 4 days ago", downloads: 98 },
              { name: "Agentic-Workflow-Architecture.pptx", size: "12.4 MB", date: "Uploaded 1 week ago", downloads: 140 },
              { name: "RAG-Evaluation-Dataset.jsonl", size: "8.1 MB", date: "Uploaded 2 weeks ago", downloads: 87 },
            ].map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    DOC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{file.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {file.size} • {file.date}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {file.downloads} dl
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherCourseDetailPage;
