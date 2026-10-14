import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDataService } from "@/services/mockDataService";
import { BookOpen, Layers, ArrowLeft, Plus, CheckCircle2, Video, FileText, ChevronDown } from "lucide-react";

interface SyllabusModule {
  id: string;
  moduleNumber: number;
  title: string;
  durationHours: number;
  lectures: Array<{ id: string; title: string; durationMins: number; hasRecording?: boolean }>;
}

const SAMPLE_MODULES: SyllabusModule[] = [
  {
    id: "m-1",
    moduleNumber: 1,
    title: "Foundations of High-Dimensional Vector Embeddings",
    durationHours: 6,
    lectures: [
      { id: "lec-1", title: "Dense vs Sparse Lexical Representations", durationMins: 90, hasRecording: true },
      { id: "lec-2", title: "Chunking Strategies (Fixed vs Semantic Boundaries)", durationMins: 90, hasRecording: true },
      { id: "lec-3", title: "Cosine Similarity & Inner Product Metrics", durationMins: 90, hasRecording: true },
    ],
  },
  {
    id: "m-2",
    moduleNumber: 2,
    title: "Vector Databases & Graph Indexing (HNSW / IVF-PQ)",
    durationHours: 8,
    lectures: [
      { id: "lec-4", title: "HNSW Multi-Layer Skip List Construction", durationMins: 90, hasRecording: true },
      { id: "lec-5", title: "Product Quantization (PQ) Compression", durationMins: 90, hasRecording: true },
      { id: "lec-6", title: "Lost-in-the-Middle Mitigation with Cross-Encoders", durationMins: 90, hasRecording: true },
    ],
  },
  {
    id: "m-3",
    moduleNumber: 3,
    title: "Production RAG Pipelines & Evaluator Ragas",
    durationHours: 10,
    lectures: [
      { id: "lec-7", title: "Contextual Compression with Cohere Rerank", durationMins: 90, hasRecording: false },
      { id: "lec-8", title: "Ragas Framework for Faithfulness & Answer Relevance", durationMins: 90, hasRecording: false },
    ],
  },
];

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courses = mockDataService.getCourses();
  const course = courses.find((c) => c.id === id) || courses[0];
  const batches = mockDataService.getBatches().filter((b) => b.courseId === course.id);

  const [modules, setModules] = useState<SyllabusModule[]>(SAMPLE_MODULES);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/admin/courses")}
            className="h-8 text-xs gap-1 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">{course.title}</h1>
            <Badge variant="accent" className="text-[10px] font-bold">{course.category}</Badge>
          </div>
        </div>

        {/* Overview Banner */}
        <div className="p-5 rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 shadow-xs space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold pt-1 text-muted-foreground border-t border-border/60">
            <span>Level: <strong className="text-foreground">{course.level}</strong></span>
            <span>Modules: <strong className="text-foreground">{course.modulesCount}</strong></span>
            <span>Total Duration: <strong className="text-foreground">{course.totalHours} Hours</strong></span>
            <span>Tuition: <strong className="text-primary font-mono font-bold">₹{course.priceRupees.toLocaleString("en-IN")}</strong></span>
          </div>
        </div>

        {/* Associated Batches */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Active & Upcoming Cohorts for this Course
            </h2>
            <Button
              size="sm"
              onClick={() => navigate("/admin/batches")}
              className="text-xs h-8 font-bold gap-1 shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Cohort
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {batches.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/admin/batches/${b.id}`)}
                className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-colors cursor-pointer space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">{b.name}</span>
                  <Badge
                    variant={b.entitlement.accessType === "live_and_replay" ? "accent" : "warning"}
                    className="text-[10px] font-bold"
                  >
                    {b.entitlement.accessType === "live_and_replay" ? "Live + Replay" : "Replay Only"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Instructor: {b.teacherName}</p>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Enrolled: {b.enrolledCount}/{b.maxSeats}</span>
                  <span>Expires: {b.entitlement.accessExpiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Syllabus Builder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Syllabus Modules & Lecture Plan
            </h2>
            <Button size="sm" variant="outline" className="text-xs h-8 font-semibold">
              <Plus className="h-3 w-3 mr-1" /> Add Module
            </Button>
          </div>

          <div className="space-y-3">
            {modules.map((m) => (
              <Card key={m.id} className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
                <CardHeader className="p-4 bg-muted/20 border-b border-border/60 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">
                        {m.moduleNumber}
                      </span>
                      {m.title}
                    </CardTitle>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {m.durationHours} hours of structured lectures
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {m.lectures.length} Lectures
                  </Badge>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/60">
                  {m.lectures.map((lec) => (
                    <div key={lec.id} className="p-3 pl-5 flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Video className="h-3.5 w-3.5 text-primary" />
                        <span className="font-semibold text-foreground">{lec.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="font-mono text-[11px]">{lec.durationMins} mins</span>
                        {lec.hasRecording ? (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Recorded ✓
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
