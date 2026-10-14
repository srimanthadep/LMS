import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Filter,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  Calendar,
  Eye,
  SlidersHorizontal,
  FileText,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface AssignedAssessment {
  id: string;
  title: string;
  courseTitle: string;
  batchName: string;
  type: "Milestone" | "Capstone" | "Lab" | "Quiz";
  status: "active" | "completed" | "upcoming";
  deadline: string;
  priority: "high" | "normal" | "low";
  totalSubmissions: number;
  awaitingEvaluation: number;
  draftsCount: number;
  completedCount: number;
  maxScore: number;
  instructions: string;
  markingCriteria: Array<{ name: string; maxPts: number; description: string }>;
}

export const EvaluatorMyEvaluationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "awaiting">("priority");
  const [selectedAssessment, setSelectedAssessment] = useState<AssignedAssessment | null>(null);

  const assessments: AssignedAssessment[] = [
    {
      id: "test-rag-eval",
      title: "Milestone 2: Hybrid RAG System with Cohere Rerank",
      courseTitle: "Full-Stack AI & LLM Systems Engineering",
      batchName: "Cohort 7 (Live + Replay)",
      type: "Milestone",
      status: "active",
      deadline: "14 Oct 2026, 11:59 PM",
      priority: "high",
      totalSubmissions: 38,
      awaitingEvaluation: 2,
      draftsCount: 1,
      completedCount: 35,
      maxScore: 100,
      instructions:
        "Implement a production two-stage hybrid retrieval pipeline combining Qdrant dense vector search (k=25) with Cohere Rerank v3 cross-encoder compression (top_n=5). Handle rate limiting and mitigate lost-in-the-middle degradation.",
      markingCriteria: [
        { name: "Vector Pipeline Architecture", maxPts: 20, description: "Clean decoupled Qdrant client connection & collection query logic." },
        { name: "Reranker Integration & Optimization", maxPts: 20, description: "Appropriate top_n constraint and cross-encoder score thresholding." },
        { name: "Lost-in-the-middle Mitigation Logic", maxPts: 10, description: "Understanding of positional bias and context window compression." },
        { name: "Code Quality & Error Handling", maxPts: 10, description: "Exception boundaries around remote API calls and proper retry backoff." },
        { name: "Objective Test Suite", maxPts: 40, description: "Automated unit test passing rate." },
      ],
    },
    {
      id: "test-agent-graph",
      title: "Capstone 1: Multi-Agent Research Assistant with Human Oversight",
      courseTitle: "Autonomous Multi-Agent Architectures",
      batchName: "Agentic Systems Bootcamp",
      type: "Capstone",
      status: "active",
      deadline: "16 Oct 2026, 06:00 PM",
      priority: "high",
      totalSubmissions: 24,
      awaitingEvaluation: 1,
      draftsCount: 0,
      completedCount: 23,
      maxScore: 100,
      instructions:
        "Build a multi-agent orchestration graph with LangGraph comprising a supervisor node, web researcher, code executor, and human-in-the-loop review interrupt before state mutation.",
      markingCriteria: [
        { name: "Graph Topology & Node Design", maxPts: 25, description: "Clean conditional routing edges and robust StateGraph schema." },
        { name: "Human Interrupt Implementation", maxPts: 25, description: "Breakpoint execution before sensitive external tool invocations." },
        { name: "Memory Persistence & Checkpointing", maxPts: 10, description: "PostgreSQL or SQLite state thread resumption." },
        { name: "Objective Test Suite", maxPts: 40, description: "Autonomous task benchmark execution score." },
      ],
    },
    {
      id: "test-lora-tuning",
      title: "Lab 4: Fine-Tuning Llama-3-8B with LoRA & Unsloth",
      courseTitle: "Full-Stack AI & LLM Systems Engineering",
      batchName: "Cohort 7 (Live + Replay)",
      type: "Lab",
      status: "active",
      deadline: "13 Oct 2026, 11:59 PM",
      priority: "high",
      totalSubmissions: 30,
      awaitingEvaluation: 1,
      draftsCount: 0,
      completedCount: 29,
      maxScore: 100,
      instructions:
        "Quantize Llama-3-8B into 4-bit NF4 weights and train LoRA adapters on an instruction-following dataset using Unsloth. Measure memory efficiency and token throughput.",
      markingCriteria: [
        { name: "Hyperparameter Selection", maxPts: 20, description: "Appropriate LoRA rank, alpha scaling, and learning rate warmup." },
        { name: "Loss Convergence & Overfitting Check", maxPts: 20, description: "Monotonic validation loss curve without divergence." },
        { name: "Inference Latency Benchmark", maxPts: 20, description: "Demonstrated generation throughput comparison (pre vs post LoRA)." },
        { name: "Objective Test Suite", maxPts: 40, description: "Automated perplexity evaluation on held-out test split." },
      ],
    },
    {
      id: "test-diff-vision",
      title: "Milestone 3: Stable Diffusion ControlNet Multi-Modal Conditioning",
      courseTitle: "Diffusion Models & Generative Vision",
      batchName: "Weekend Generative Vision Cohort",
      type: "Milestone",
      status: "active",
      deadline: "18 Oct 2026, 11:59 PM",
      priority: "normal",
      totalSubmissions: 20,
      awaitingEvaluation: 0,
      draftsCount: 1,
      completedCount: 19,
      maxScore: 100,
      instructions:
        "Implement edge-conditioned and depth-conditioned latent diffusion pipelines using ControlNet v1.1. Validate deterministic image generation via seed controls.",
      markingCriteria: [
        { name: "Edge Conditioning Quality", maxPts: 25, description: "Canny edge map preprocessing and contrast thresholds." },
        { name: "Prompt Guidance & Seed Reproducibility", maxPts: 20, description: "Deterministic latent tensor seeds and CFG scale parameterization." },
        { name: "Memory Footprint Optimization", maxPts: 15, description: "FP16 inference and xFormers attention slicing." },
        { name: "Objective Test Suite", maxPts: 40, description: "CLIP image-text directional alignment score." },
      ],
    },
    {
      id: "test-mlops-k8s",
      title: "Capstone 2: Production Triton GPU Inference on K8s",
      courseTitle: "Production MLOps & Vector Infrastructure",
      batchName: "Enterprise MLOps Masterclass",
      type: "Capstone",
      status: "completed",
      deadline: "10 Oct 2026, 11:59 PM",
      priority: "low",
      totalSubmissions: 35,
      awaitingEvaluation: 0,
      draftsCount: 0,
      completedCount: 35,
      maxScore: 100,
      instructions:
        "Deploy a highly available Triton Inference Server cluster on Kubernetes with dynamic batching and Prometheus scrapers.",
      markingCriteria: [
        { name: "Kubernetes Manifest Resilience", maxPts: 25, description: "Liveness/readiness probes and GPU resource limits." },
        { name: "Dynamic Batching Configuration", maxPts: 20, description: "Optimal queue delay and concurrency slots." },
        { name: "Prometheus Metric Export", maxPts: 15, description: "Latency histogram metrics exposed to cluster monitoring." },
        { name: "Objective Test Suite", maxPts: 40, description: "Automated locust load testing pass rate." },
      ],
    },
  ];

  const filteredAssessments = assessments
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (courseFilter !== "all" && a.courseTitle !== courseFilter) return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const order = { high: 0, normal: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === "awaiting") {
        return b.awaitingEvaluation - a.awaitingEvaluation;
      }
      return a.deadline.localeCompare(b.deadline);
    });

  const totalAwaiting = assessments.reduce((acc, a) => acc + a.awaitingEvaluation, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              My Assigned Assessments
            </h1>
            <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
              {assessments.length} Active Modules
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Track evaluation progress, instructions, and marking rubrics across assigned course cohorts.
          </p>
        </div>

        <Link to="/evaluator/queue">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm">
            <FileCheck2 className="h-4 w-4" />
            Open Submissions Queue ({totalAwaiting} awaiting)
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardContent className="p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessment title or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Courses</option>
              <option value="Full-Stack AI & LLM Systems Engineering">Full-Stack AI & LLM</option>
              <option value="Autonomous Multi-Agent Architectures">Multi-Agent Architectures</option>
              <option value="Diffusion Models & Generative Vision">Diffusion Models</option>
              <option value="Production MLOps & Vector Infrastructure">Production MLOps</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="Milestone">Milestones</option>
              <option value="Capstone">Capstones</option>
              <option value="Lab">Labs</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-emerald-700 dark:text-emerald-300"
            >
              <option value="priority">Sort: Urgency / Priority</option>
              <option value="awaiting">Sort: Most Awaiting</option>
              <option value="deadline">Sort: Deadline</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assessments Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssessments.map((a) => {
          const progressPercent = Math.round((a.completedCount / a.totalSubmissions) * 100);

          return (
            <Card
              key={a.id}
              className="border-zinc-200/80 dark:border-zinc-800 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {a.type}
                      </Badge>
                      <Badge
                        className={
                          a.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                            : a.priority === "high"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                        }
                      >
                        {a.status === "completed" ? "All Graded" : a.priority === "high" ? "Priority Queue" : "Active"}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {a.title}
                    </h3>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedAssessment(a)}
                    className="gap-1 text-xs shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" /> Criteria
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  {a.courseTitle} • {a.batchName}
                </p>

                {/* Deadline & Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Awaiting</span>
                    <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                      {a.awaitingEvaluation}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Drafts</span>
                    <span className="font-bold font-mono text-blue-600 dark:text-blue-400">
                      {a.draftsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Completed</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {a.completedCount} / {a.totalSubmissions}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Grading Progress</span>
                    <span className="font-bold text-foreground">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Due: <strong className="text-foreground">{a.deadline}</strong>
                </span>

                <Link to="/evaluator/queue">
                  <Button size="sm" className="text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                    Review Queue <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Assessment Instructions & Marking Criteria Modal */}
      {selectedAssessment && (
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  {selectedAssessment.type} Specification
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Max Marks: {selectedAssessment.maxScore}</span>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {selectedAssessment.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedAssessment.courseTitle} • {selectedAssessment.batchName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-emerald-600" />
                  Assignment Problem Statement & Instructions
                </h4>
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs text-foreground leading-relaxed">
                  {selectedAssessment.instructions}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  Predefined Rubric & Marking Weightage
                </h4>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs">
                  {selectedAssessment.markingCriteria.map((c, i) => (
                    <div key={i} className="p-3 flex items-start justify-between gap-4 bg-white dark:bg-zinc-900">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-foreground">{c.name}</span>
                        <p className="text-[11px] text-muted-foreground">{c.description}</p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs font-bold shrink-0">
                        {c.maxPts} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <span className="text-xs text-muted-foreground">
                Submissions awaiting review: <strong>{selectedAssessment.awaitingEvaluation}</strong>
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedAssessment(null)} className="text-xs">
                  Close
                </Button>
                <Link to="/evaluator/queue">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                    Grade Submissions <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
