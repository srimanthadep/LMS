import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  UploadCloud,
  PlaySquare,
  FileText,
  Video,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Eye,
  Plus,
  BookOpen,
  Layers,
  Code,
  FileCode,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockDataService } from "@/services/mockDataService";
import { LectureRecording, Course, Batch } from "@/types/lms";

interface LearningResource {
  id: string;
  title: string;
  type: "pdf" | "code" | "slides" | "dataset";
  courseTitle: string;
  batchName: string;
  fileSize: string;
  uploadedAt: string;
  downloadsCount: number;
}

const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: "res-1",
    title: "Lesson 14: Consensus_Supervision_LangGraph.ipynb",
    type: "code",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    fileSize: "4.2 MB",
    uploadedAt: "2 hours ago",
    downloadsCount: 88,
  },
  {
    id: "res-2",
    title: "LoRA_vs_QLoRA_Mathematical_Foundations.pdf",
    type: "pdf",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    fileSize: "14.8 MB",
    uploadedAt: "Yesterday",
    downloadsCount: 112,
  },
  {
    id: "res-3",
    title: "MultiAgent_Router_Design_Patterns.pdf",
    type: "slides",
    courseTitle: "Autonomous Multi-Agent Architectures",
    batchName: "Cohort 4 (Agent Swarms)",
    fileSize: "28.4 MB",
    uploadedAt: "3 days ago",
    downloadsCount: 64,
  },
  {
    id: "res-4",
    title: "synthetic_finetune_alpaca_dataset.jsonl",
    type: "dataset",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    fileSize: "52.1 MB",
    uploadedAt: "1 week ago",
    downloadsCount: 140,
  },
];

interface ProcessingJob {
  id: string;
  recordingId: string;
  classTitle: string;
  stage: "transcribing" | "chaptering" | "ready" | "failed";
  progress: number;
  durationMinutes: number;
  errorMessage?: string;
  updatedAt: string;
}

const INITIAL_JOBS: ProcessingJob[] = [
  {
    id: "job-101",
    recordingId: "rep-rag-14",
    classTitle: "Session 14: Multi-Agent Consensus & Hierarchical Supervision",
    stage: "transcribing",
    progress: 74,
    durationMinutes: 92,
    updatedAt: "Active Now",
  },
  {
    id: "job-102",
    recordingId: "rep-rag-13",
    classTitle: "Session 13: Distributed GPU Vector Quantization & HNSW",
    stage: "ready",
    progress: 100,
    durationMinutes: 85,
    updatedAt: "2 hours ago",
  },
  {
    id: "job-103",
    recordingId: "rep-rag-12",
    classTitle: "Session 12: Tool Routing & Sandboxed Execution with E2B",
    stage: "failed",
    progress: 42,
    durationMinutes: 78,
    errorMessage: "Deepgram API connection reset during audio segment 4",
    updatedAt: "4 hours ago",
  },
];

export const ContentOperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resources" | "recordings" | "jobs">("recordings");
  const [recordings, setRecordings] = useState<LectureRecording[]>(mockDataService.getRecordings());
  const [resources, setResources] = useState<LearningResource[]>(INITIAL_RESOURCES);
  const [jobs, setJobs] = useState<ProcessingJob[]>(INITIAL_JOBS);
  const [courses] = useState<Course[]>(mockDataService.getCourses());
  const [batches] = useState<Batch[]>(mockDataService.getBatches());

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<"pdf" | "code" | "slides" | "dataset">("code");
  const [uploadCourseId, setUploadCourseId] = useState(courses[0]?.id || "");
  const [uploadBatchId, setUploadBatchId] = useState(batches[0]?.id || "");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleRetryJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, stage: "transcribing", progress: 15, errorMessage: undefined } : j
      )
    );
    showNotification(`Re-dispatched transcription pipeline for Job #${jobId}`);
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;

    const chosenCourse = courses.find((c) => c.id === uploadCourseId) || courses[0];
    const chosenBatch = batches.find((b) => b.id === uploadBatchId) || batches[0];

    const newRes: LearningResource = {
      id: `res-${Date.now()}`,
      title: uploadTitle,
      type: uploadType,
      courseTitle: chosenCourse.title,
      batchName: chosenBatch.name,
      fileSize: "8.4 MB",
      uploadedAt: "Just now",
      downloadsCount: 0,
    };

    setResources([newRes, ...resources]);
    setUploadModalOpen(false);
    setUploadTitle("");
    showNotification(`Uploaded ${uploadTitle} to ${chosenBatch.cohortCode}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <PlaySquare className="h-6 w-6 text-primary" /> Content Library & Recording Operations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage course learning materials, track automated video transcoding, Whisper transcription, and chapter pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notificationMsg && (
            <Badge variant="success" className="text-xs py-1 px-2.5 gap-1 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> {notificationMsg}
            </Badge>
          )}
          <Button
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="text-xs h-9 font-bold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <UploadCloud className="h-3.5 w-3.5" /> Upload Learning Asset
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("recordings")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "recordings"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Video className="h-3.5 w-3.5" /> Replay Recordings ({recordings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "jobs"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" /> AI Processing Jobs ({jobs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("resources")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "resources"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> Learning Resources ({resources.length})
        </button>
      </div>

      {/* TAB 1: RECORDINGS */}
      {activeTab === "recordings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recordings.map((rec) => (
            <Card key={rec.id} className="rounded-2xl border-border/80 bg-card p-4 space-y-3 shadow-xs">
              <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-border/60">
                <img
                  src={rec.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"}
                  alt={rec.title}
                  className="w-full h-full object-cover opacity-75"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white font-bold">
                  {rec.durationFormatted}
                </span>
                <span className="absolute top-2 left-2">
                  <Badge variant="success" className="text-[9px] uppercase font-bold">
                    {rec.chapters?.length || 4} Chapters Ready
                  </Badge>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs text-foreground line-clamp-1">{rec.title}</h3>
                <p className="text-[11px] text-muted-foreground truncate">{rec.courseTitle}</p>
                <p className="text-[10px] text-primary font-medium mt-0.5">Cohort Batch 2026-A</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                <span className="text-[10px] text-muted-foreground">
                  Streamed on {rec.publishedAt}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs font-semibold text-foreground hover:bg-muted/50"
                  onClick={() => showNotification(`Previewing recording stream for ${rec.title}`)}
                >
                  <Eye className="h-3 w-3 mr-1" /> Inspect
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: AI PROCESSING JOBS */}
      {activeTab === "jobs" && (
        <Card className="rounded-2xl border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Job ID & Lecture</th>
                  <th className="py-3 px-4">Processing Pipeline Stage</th>
                  <th className="py-3 px-4">Completion Progress</th>
                  <th className="py-3 px-4">Lecture Duration</th>
                  <th className="py-3 px-4">Telemetry</th>
                  <th className="py-3 px-4 text-right">Operations Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/15 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] text-muted-foreground block">{job.id}</span>
                      <strong className="text-foreground text-xs">{job.classTitle}</strong>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          job.stage === "ready"
                            ? "success"
                            : job.stage === "failed"
                            ? "destructive"
                            : "default"
                        }
                        className="text-[10px] capitalize"
                      >
                        {job.stage === "transcribing" && "Whisper ASR Running"}
                        {job.stage === "chaptering" && "GPT-4o Chaptering"}
                        {job.stage === "ready" && "HLS + Vector Indexed"}
                        {job.stage === "failed" && "Pipeline Failed"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              job.stage === "failed" ? "bg-rose-500" : "bg-primary"
                            }`}
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {job.durationMinutes} mins
                    </td>
                    <td className="py-3.5 px-4">
                      {job.errorMessage ? (
                        <span className="text-[11px] text-rose-600 block line-clamp-1">
                          {job.errorMessage}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          {job.updatedAt}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {job.stage === "failed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetryJob(job.id)}
                          className="h-7 text-xs font-semibold gap-1 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3" /> Retry Job
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          className="h-7 text-xs text-muted-foreground"
                        >
                          Healthy
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: LEARNING RESOURCES */}
      {activeTab === "resources" && (
        <Card className="rounded-2xl border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Resource File Title</th>
                  <th className="py-3 px-4">Course & Batch</th>
                  <th className="py-3 px-4">Asset Type</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-muted/15 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground text-xs flex items-center gap-2">
                      {res.type === "code" && <Code className="h-4 w-4 text-primary shrink-0" />}
                      {res.type === "pdf" && <FileText className="h-4 w-4 text-rose-500 shrink-0" />}
                      {res.type === "slides" && <PlaySquare className="h-4 w-4 text-amber-500 shrink-0" />}
                      {res.type === "dataset" && <FileCode className="h-4 w-4 text-violet-500 shrink-0" />}
                      <span>{res.title}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground text-xs">{res.batchName}</p>
                      <p className="text-[10px] text-muted-foreground">{res.courseTitle}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {res.type}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {res.fileSize}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {res.uploadedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showNotification(`Downloading ${res.title}...`)}
                        className="h-7 text-xs font-semibold gap-1 cursor-pointer"
                      >
                        <Download className="h-3 w-3" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* UPLOAD MODAL */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-primary" /> Upload Learning Asset
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload code notebooks, lecture slides, datasets, or reference PDFs directly to the student portal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadResource} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Asset Title & Filename *
              </label>
              <Input
                required
                placeholder="e.g. Session_15_FineTuning_Unsloth.ipynb"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Asset Category
                </label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="code">Jupyter Notebook (.ipynb)</option>
                  <option value="pdf">Reading Material (.pdf)</option>
                  <option value="slides">Presentation Slides (.pdf/.pptx)</option>
                  <option value="dataset">Dataset (.jsonl / .csv)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Target Course
                </label>
                <select
                  value={uploadCourseId}
                  onChange={(e) => setUploadCourseId(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Authorized Cohort / Batch
              </label>
              <select
                value={uploadBatchId}
                onChange={(e) => setUploadBatchId(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center text-xs text-muted-foreground bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
              <UploadCloud className="h-7 w-7 text-primary mb-1" />
              <p className="font-semibold text-foreground">Drag & drop asset file or click to browse</p>
              <p className="text-[10px]">Supports up to 250 MB</p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUploadModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Upload & Publish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
