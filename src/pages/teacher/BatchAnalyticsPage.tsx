import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/StatCard";
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  Users,
  Eye,
  HelpCircle,
  Download,
  Sparkles,
  Layers,
  Clock,
  Inbox,
} from "lucide-react";
import { teacherDataService } from "./teacherDataService";
import { useNotifications } from "@/context/NotificationContext";

interface CohortTelemetry {
  lectureTitle: string;
  lectureTopic: string;
  mostReplayedSegment: {
    time: string;
    topic: string;
    replayLoops: string;
  };
  topFrictionCluster: {
    title: string;
    doubtsCount: number;
    recommendation: string;
  };
  heatmapData: number[];
  peakFriction: {
    time: string;
    label: string;
  };
  curriculumModules: Array<{
    module: string;
    mastery: number;
    status: string;
  }>;
  recurringTopics: Array<{
    topic: string;
    count: number;
    severity: "High" | "Medium" | "Normal";
  }>;
  aiSuggestion: {
    observation: string;
    suggestion: string;
  };
}

const COHORT_TELEMETRY: Record<string, CohortTelemetry> = {
  "Cohort 7 (Live + Replay)": {
    lectureTitle: "Lecture 8: Video Replay Scrubbing & Rewind Density Heatmap",
    lectureTopic: "HNSW Graph Construction & Dense Vector Search",
    mostReplayedSegment: {
      time: "00:24:18",
      topic: "HNSW Graph Construction",
      replayLoops: "320 replay loops",
    },
    topFrictionCluster: {
      title: "IVF-PQ Centroids & Vector Quantization",
      doubtsCount: 18,
      recommendation: "Recommended for revision lab",
    },
    heatmapData: [20, 35, 45, 85, 95, 70, 50, 40, 90, 60, 30, 25, 45, 80, 55, 30],
    peakFriction: {
      time: "00:24:18",
      label: "HNSW Graph Derivation",
    },
    curriculumModules: [
      { module: "Module 1: Attention Kernels & PyTorch", mastery: 94, status: "Mastered" },
      { module: "Module 2: RAG Vector Indices & Chunking", mastery: 82, status: "In Progress" },
      { module: "Module 3: Multi-Agent Swarm Orchestration", mastery: 68, status: "Concept Friction" },
    ],
    recurringTopics: [
      { topic: "IVF-PQ Centroids & Vector Quantization", count: 18, severity: "High" },
      { topic: "LangGraph StateGraph Recursion Limits", count: 14, severity: "High" },
      { topic: "Zod Schema Output Parsing for Tools", count: 9, severity: "Medium" },
      { topic: "FlashAttention-2 Memory Footprint Bounds", count: 6, severity: "Normal" },
    ],
    aiSuggestion: {
      observation:
        "Learners exhibited 42% higher rewind frequency around minute 24 (HNSW Graph Construction) and raised 18 timestamp doubts.",
      suggestion:
        "Consider scheduling a 15-minute live Q&A or attaching an annotated Jupyter notebook before the Milestone 3 deadline.",
    },
  },
  "Cohort 4 (Live Sync)": {
    lectureTitle: "Lecture 5: Autonomous Tool Routing & State Graph Memory",
    lectureTopic: "LangGraph Multi-Agent Workflows & Error Interceptors",
    mostReplayedSegment: {
      time: "00:31:05",
      topic: "Conditional Edge State Routing",
      replayLoops: "215 replay loops",
    },
    topFrictionCluster: {
      title: "LangGraph StateGraph Recursion Limits",
      doubtsCount: 12,
      recommendation: "Debug checklist recommended",
    },
    heatmapData: [15, 25, 30, 40, 65, 88, 92, 75, 45, 35, 70, 85, 40, 25, 20, 15],
    peakFriction: {
      time: "00:31:05",
      label: "Conditional Edge Recursion Bounds",
    },
    curriculumModules: [
      { module: "Module 1: Agentic Orchestration Basics", mastery: 89, status: "Mastered" },
      { module: "Module 2: Tool Calling & Schema Contracts", mastery: 76, status: "In Progress" },
      { module: "Module 3: Distributed State & Human-in-the-Loop", mastery: 62, status: "Concept Friction" },
    ],
    recurringTopics: [
      { topic: "LangGraph StateGraph Recursion Limits", count: 15, severity: "High" },
      { topic: "Tool Error Handling with Fallback Nodes", count: 11, severity: "High" },
      { topic: "Pydantic vs Zod Output Validation", count: 7, severity: "Medium" },
      { topic: "MemorySaver Checkpoint Persistence", count: 4, severity: "Normal" },
    ],
    aiSuggestion: {
      observation:
        "Learners in Cohort 4 show 38% pause-and-rewind rate during the StateGraph edge condition configuration at minute 31.",
      suggestion:
        "Review student questions in the Doubts queue regarding Zod validation errors and share the debugging checklist.",
    },
  },
  "All Cohorts": {
    lectureTitle: "Aggregate Cross-Cohort Telemetry & Lecture Engagement",
    lectureTopic: "Core AI Architecture Modules Across All Batches",
    mostReplayedSegment: {
      time: "00:24:18",
      topic: "Vector Indexes & Multi-Agent Routing",
      replayLoops: "535 replay loops",
    },
    topFrictionCluster: {
      title: "Vector Quantization & Graph Recursion",
      doubtsCount: 30,
      recommendation: "Joint revision session advised",
    },
    heatmapData: [18, 30, 38, 62, 80, 79, 71, 58, 68, 48, 50, 55, 43, 52, 38, 22],
    peakFriction: {
      time: "00:24:18 & 00:31:05",
      label: "Vector Index Derivation & Tool Graph Edge Limits",
    },
    curriculumModules: [
      { module: "Module 1: Deep Learning & Attention Kernels", mastery: 92, status: "Mastered" },
      { module: "Module 2: RAG Vector Indices & Chunking", mastery: 79, status: "In Progress" },
      { module: "Module 3: Multi-Agent Swarms & Supervision", mastery: 65, status: "Concept Friction" },
    ],
    recurringTopics: [
      { topic: "LangGraph StateGraph Recursion Limits", count: 29, severity: "High" },
      { topic: "IVF-PQ Centroids & Vector Quantization", count: 22, severity: "High" },
      { topic: "Tool Error Handling with Fallback Nodes", count: 18, severity: "High" },
      { topic: "Zod Schema Output Parsing for Tools", count: 16, severity: "Medium" },
    ],
    aiSuggestion: {
      observation:
        "Cross-cohort telemetry reveals that practical index benchmarking and tool routing account for 64% of total student inquiries.",
      suggestion:
        "Host a joint office hour session covering common indexing bottlenecks and agent state recovery patterns.",
    },
  },
};

export const BatchAnalyticsPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [selectedBatch, setSelectedBatch] = useState("Cohort 7 (Live + Replay)");
  const [students] = useState(() => teacherDataService.getStudents());
  const [doubts] = useState(() => teacherDataService.getDoubts());

  // Filter dynamic student roster for selected batch
  const batchStudents = students.filter(
    (s) => selectedBatch === "All Cohorts" || s.batch === selectedBatch
  );

  const avgAttendance = batchStudents.length > 0
    ? Math.round(
        batchStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / batchStudents.length
      )
    : 0;

  const avgQuiz = batchStudents.length > 0
    ? Math.round(
        batchStudents.reduce((acc, s) => acc + s.quizAverage, 0) / batchStudents.length
      )
    : 0;

  const totalDoubts = doubts.filter(
    (d) => selectedBatch === "All Cohorts" || d.batchName === selectedBatch
  ).length;

  const currentTelemetry = COHORT_TELEMETRY[selectedBatch] || null;

  const handleExportAnalytics = () => {
    const csvRows = [
      `"Batch Analytics Report: ${selectedBatch}"`,
      `"Generated: ${new Date().toLocaleDateString()}"`,
      `"Scope: Frontend Simulated Telemetry"`,
      "",
      "--- CORE COHORT BENCHMARKS ---",
      "Metric,Value,Benchmark",
      `Cohort Attendance,${avgAttendance}%,Target >80%`,
      `Average Quiz Score,${avgQuiz}%,Target >75%`,
      `Enrolled Learners,${batchStudents.length},Active enrolled roster`,
      `Timestamp Doubts Logged,${totalDoubts},Target <1h SLA`,
    ];

    if (currentTelemetry) {
      csvRows.push(
        "",
        "--- LECTURE REPLAY FRICTION ---",
        `Lecture Title,"${currentTelemetry.lectureTitle}"`,
        `Core Topic,"${currentTelemetry.lectureTopic}"`,
        `Most Replayed Segment,"${currentTelemetry.mostReplayedSegment.time} - ${currentTelemetry.mostReplayedSegment.topic} (${currentTelemetry.mostReplayedSegment.replayLoops})"`,
        `Top Friction Cluster,"${currentTelemetry.topFrictionCluster.title}"`,
        `Peak Scrubbing Timestamp,"${currentTelemetry.peakFriction.time} (${currentTelemetry.peakFriction.label})"`,
        "",
        "--- CURRICULUM MODULE MASTERY ---",
        "Module Name,Mastery %,Status"
      );

      currentTelemetry.curriculumModules.forEach((m) => {
        csvRows.push(`"${m.module}",${m.mastery}%,${m.status}`);
      });

      csvRows.push(
        "",
        "--- RECURRING INQUIRY TOPICS ---",
        "Topic,Student Count,Severity"
      );

      currentTelemetry.recurringTopics.forEach((t) => {
        csvRows.push(`"${t.topic}",${t.count},${t.severity}`);
      });

      csvRows.push(
        "",
        "--- AI PEDAGOGICAL SUGGESTIONS ---",
        `Observation,"${currentTelemetry.aiSuggestion.observation}"`,
        `Actionable Suggestion,"${currentTelemetry.aiSuggestion.suggestion}"`
      );
    } else {
      csvRows.push(
        "",
        "--- STATUS ---",
        `Telemetry Data,"No lecture recordings or friction telemetry recorded for ${selectedBatch} yet."`
      );
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `batch-analytics-${selectedBatch.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      title: "Analytics Report Exported",
      message: `Exported telemetry report for ${selectedBatch} as CSV.`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Batch Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Batch Telemetry & Comprehension Heatmaps
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Identify difficult conceptual clusters, video replay scrub points, and cohort learning progression.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="h-9 text-xs rounded-xl border border-input bg-card px-3 text-foreground font-semibold cursor-pointer"
          >
            <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
            <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync)</option>
            <option value="All Cohorts">All Cohorts Combined</option>
            <option value="Cohort 12 (Weekend Incubator)">Cohort 12 (Weekend Incubator - New)</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportAnalytics}
            className="h-9 text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export Telemetry CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards calculated from selected cohort */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
        <StatCard
          index={0}
          title="Avg Cohort Attendance"
          value={batchStudents.length > 0 ? `${avgAttendance}%` : "N/A"}
          subtitle={`${batchStudents.length} Active Learners`}
          icon={Users}
          trend={{
            value: batchStudents.length > 0 ? "+3.2% vs baseline" : "No cohort records",
            isPositive: batchStudents.length > 0,
          }}
          highlight
        />
        <StatCard
          index={1}
          title="Most Replayed Segment"
          value={currentTelemetry ? currentTelemetry.mostReplayedSegment.time : "None"}
          subtitle={currentTelemetry ? currentTelemetry.mostReplayedSegment.topic : "No recorded sessions"}
          icon={Eye}
          trend={{
            value: currentTelemetry ? currentTelemetry.mostReplayedSegment.replayLoops : "0 scrub loops",
            isPositive: !currentTelemetry,
          }}
        />
        <StatCard
          index={2}
          title="Top Friction Cluster"
          value={currentTelemetry ? currentTelemetry.topFrictionCluster.title : "No Friction"}
          subtitle={`${totalDoubts} timestamp doubts logged`}
          icon={HelpCircle}
          trend={{
            value: currentTelemetry ? currentTelemetry.topFrictionCluster.recommendation : "No review needed",
            isPositive: !currentTelemetry,
          }}
        />
        <StatCard
          index={3}
          title="Assessment Benchmark"
          value={batchStudents.length > 0 ? `${avgQuiz}%` : "N/A"}
          subtitle="Across recent quizzes & labs"
          icon={TrendingUp}
          trend={{
            value: avgQuiz >= 75 ? "Passing target met" : batchStudents.length > 0 ? "Review recommended" : "No submissions",
            isPositive: avgQuiz >= 75,
          }}
        />
      </div>

      {/* If cohort has no telemetry data, render a clear and helpful empty state */}
      {!currentTelemetry ? (
        <Card className="p-12 text-center border-dashed border-border/80 bg-card/50 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              No Telemetry Recorded for {selectedBatch}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
              This cohort has not held recorded lectures or submitted assessments yet. Video replay scrub heatmaps, concept mastery curves, and inquiry clusters will appear once sessions begin.
            </p>
          </div>
          <div className="pt-2">
            <Badge variant="outline" className="text-xs font-mono">
              Cohort Status: Pre-commencement / No Activity
            </Badge>
          </div>
        </Card>
      ) : (
        <>
          {/* AI Pedagogical Suggestions Banner (Explicitly presented as suggestions) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/25 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                AI Pedagogical Diagnostic Suggestions
              </h3>
              <Badge variant="outline" className="text-[9px]">
                Empirical Recommendation
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Observation:</strong> {currentTelemetry.aiSuggestion.observation}
              <br />
              <strong>Actionable Suggestion:</strong> {currentTelemetry.aiSuggestion.suggestion}
            </p>
          </div>

          {/* Replay Scrubbing Heatmap Visualization */}
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {currentTelemetry.lectureTitle}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Spikes indicate where students in {selectedBatch} frequently re-watched or slowed playback down to 0.75x.
                </p>
              </div>
              <Badge variant="accent" className="text-[10px]">
                {selectedBatch}
              </Badge>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-end gap-1.5 h-36 w-full pt-4">
                {currentTelemetry.heatmapData.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        val > 75 ? "bg-rose-500 hover:bg-rose-600" : "bg-primary/70 hover:bg-primary"
                      }`}
                      style={{ height: `${val}%` }}
                      title={`Minute ${idx * 5} – ${(idx + 1) * 5}: ${val}% rewind volume`}
                    />
                    <span className="text-[9px] font-mono text-muted-foreground opacity-60">
                      {idx * 5}m
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                <span>00:00:00 (Start)</span>
                <span className="font-bold text-rose-500">
                  Peak Scrubbing Friction: {currentTelemetry.peakFriction.time} ({currentTelemetry.peakFriction.label})
                </span>
                <span>01:28:45 (End)</span>
              </div>
            </div>
          </Card>

          {/* Concept Breakdown & Learning Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 border-border/80 bg-card space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                Curriculum Module Progress & Mastery Rate
              </h3>

              <div className="space-y-3 pt-1">
                {currentTelemetry.curriculumModules.map((m, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>{m.module}</span>
                      <span className="font-mono text-primary">{m.mastery}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          m.mastery >= 85 ? "bg-emerald-600" : m.mastery >= 75 ? "bg-blue-600" : "bg-amber-500"
                        }`}
                        style={{ width: `${m.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 border-border/80 bg-card space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Recurring Student Inquiry Topics
              </h3>

              <div className="space-y-2 pt-1 text-xs">
                {currentTelemetry.recurringTopics.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-foreground">{t.topic}</p>
                      <p className="text-[10px] text-muted-foreground">{t.count} students inquired</p>
                    </div>
                    <Badge
                      variant={t.severity === "High" ? "destructive" : "outline"}
                      className="text-[9px]"
                    >
                      {t.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default BatchAnalyticsPage;
