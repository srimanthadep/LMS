import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Award,
  TrendingUp,
  FileCheck2,
  Download,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AssessmentScore {
  id: string;
  submissionId: string;
  course: string;
  title: string;
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  feedback: string;
  evaluator: string;
}

interface SubjectPerformance {
  courseCode: string;
  courseTitle: string;
  faculty: string;
  grade: string;
  credits: number;
  gpa: number;
  status: "Completed" | "In Progress";
}

export const StudentResultsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"assessments" | "subjects">("assessments");

  const assessmentResults: AssessmentScore[] = [
    {
      id: "res-1",
      submissionId: "sub-1",
      course: "Full-Stack AI Engineering",
      title: "Module 1 DPP: Transformer Forward Pass & Attention Profiler",
      date: "12 Oct 2026",
      score: 95,
      maxScore: 100,
      percentage: 95,
      grade: "A+",
      feedback: "Flawless mathematical formulation of scaled dot-product attention and KV cache memory boundaries.",
      evaluator: "Prof. Rajesh Verma",
    },
    {
      id: "res-2",
      submissionId: "sub-2",
      course: "Full-Stack AI Engineering",
      title: "Midterm Capstone Defense: Autonomous LangGraph Supervisor",
      date: "08 Oct 2026",
      score: 88,
      maxScore: 100,
      percentage: 88,
      grade: "A",
      feedback: "Robust supervisor graph implementation. Excellent handling of cyclic state updates.",
      evaluator: "Dr. Priya Sharma",
    },
    {
      id: "res-3",
      submissionId: "sub-3",
      course: "Distributed Systems & KV-Cache",
      title: "Lab 2: HNSW Vector Index Recall vs. Latency Benchmark",
      date: "25 Sep 2026",
      score: 92,
      maxScore: 100,
      percentage: 92,
      grade: "A+",
      feedback: "Deep empirical analysis of efSearch parameter tuning under high-concurrency QPS loads.",
      evaluator: "Karthik Sundaram",
    },
  ];

  const subjectPerformances: SubjectPerformance[] = [
    {
      courseCode: "AI-701",
      courseTitle: "Full-Stack AI Engineering & Autonomous Agents",
      faculty: "Prof. Rajesh Verma",
      grade: "A+",
      credits: 4,
      gpa: 4.0,
      status: "In Progress",
    },
    {
      courseCode: "CS-604",
      courseTitle: "Distributed Systems & KV-Cache Infrastructure",
      faculty: "Karthik Sundaram",
      grade: "A",
      credits: 4,
      gpa: 3.8,
      status: "In Progress",
    },
    {
      courseCode: "AI-602",
      courseTitle: "Foundations of LLM Fine-Tuning & Evaluation",
      faculty: "Dr. Priya Sharma",
      grade: "O (Outstanding)",
      credits: 3,
      gpa: 4.0,
      status: "Completed",
    },
  ];

  const averageGPA = 3.92;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-primary" /> Results & Academic Performance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Subject-wise grade cards, continuous evaluation scores, cohort rankings, and official transcript download.
          </p>
        </div>

        <Button
          onClick={() => alert("Downloading official transcript summary (transcript_arjun_mehta.pdf)...")}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 shadow-sm self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" /> Download Grade Card (PDF)
        </Button>
      </div>

      {/* Top Academic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/60 shadow-sm p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Cumulative GPA</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">{averageGPA}</span>
            <span className="text-xs text-muted-foreground">/ 4.00</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Top 5% in Cohort 7
          </span>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Earned Credits</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">11</span>
            <span className="text-xs text-muted-foreground">/ 11 credits</span>
          </div>
          <span className="text-[11px] text-muted-foreground">100% Course Load Cleared</span>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Assessments Passed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">{assessmentResults.length}</span>
            <span className="text-xs text-muted-foreground">evaluated</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Avg Score: 91.6%</span>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Performance Tier</span>
          <div className="text-lg sm:text-xl font-extrabold text-foreground pt-1">Distinction</div>
          <span className="text-[11px] text-muted-foreground">Honors Eligibility Active</span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60 self-start w-full sm:w-auto">
        <Button
          variant={activeTab === "assessments" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("assessments")}
          className="rounded-lg text-xs h-8 px-4 flex-1 sm:flex-none"
        >
          Assessment Scores ({assessmentResults.length})
        </Button>
        <Button
          variant={activeTab === "subjects" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("subjects")}
          className="rounded-lg text-xs h-8 px-4 flex-1 sm:flex-none"
        >
          Subject-wise Grade Card ({subjectPerformances.length})
        </Button>
      </div>

      {/* TAB 1: ASSESSMENT SCORES */}
      {activeTab === "assessments" && (
        <div className="space-y-4">
          {assessmentResults.map((res) => (
            <Card key={res.id} className="rounded-2xl border-border/70 hover:border-primary/40 shadow-sm transition-all p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {res.course}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{res.date}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-foreground leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Evaluated by: <strong className="text-foreground">{res.evaluator}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Score</span>
                    <span className="text-2xl font-extrabold text-primary font-mono">
                      {res.score}/{res.maxScore}
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold">
                    Grade {res.grade}
                  </Badge>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <span className="font-bold text-foreground">Evaluator Feedback:</span>
                <p className="italic bg-muted/20 p-2.5 rounded-xl border border-border/40">
                  "{res.feedback}"
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <Link to={`/student/test-results/${res.submissionId}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-primary gap-1 h-8">
                    View Detailed Question-by-Question Analysis <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: SUBJECT-WISE GRADE CARD */}
      {activeTab === "subjects" && (
        <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Course Code</th>
                  <th className="py-3 px-4">Subject Title</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Grade Point</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {subjectPerformances.map((sub) => (
                  <tr key={sub.courseCode} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{sub.courseCode}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{sub.courseTitle}</td>
                    <td className="py-3 px-4 text-muted-foreground">{sub.faculty}</td>
                    <td className="py-3 px-4 text-center font-mono">{sub.credits}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                        {sub.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-foreground">{sub.gpa.toFixed(1)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] text-muted-foreground">{sub.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
