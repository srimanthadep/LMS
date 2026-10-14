import React, { useState } from "react";

import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Video,
  PlaySquare,
  HelpCircle,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { DeviceCheckModal } from "@/components/shared/DeviceCheckModal";

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const liveClass = mockDataService.getLiveClasses().find((c) => c.status === "live");
  const recordings = mockDataService.getRecordings();
  const doubts = mockDataService.getDoubts();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, Arjun! 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Enrolled in <strong>Cohort 7 (Live + Replay)</strong> • Apex AI Systems Program
          </p>
        </div>

        <div className="flex items-center gap-2">
          {liveClass && (
            <Button
              size="sm"
              onClick={() => setDeviceModalOpen(true)}
              className="h-9 text-xs font-bold gap-1.5 shadow-sm bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
            >
              <Video className="h-3.5 w-3.5" /> Join Live Class
            </Button>
          )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/student/replays/rep-rag-8")}
              className="text-xs h-9 font-semibold gap-1"
            >
              <Play className="h-3.5 w-3.5" /> Resume Last Lecture
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/student/courses")}
              className="text-xs h-9 font-bold gap-1 shadow-sm"
            >
              <BookOpen className="h-3.5 w-3.5" /> My Courses
            </Button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
          <StatCard
            index={0}
            title="Live Attendance Rate"
            value="88%"
            subtitle="14 of 16 lectures attended"
            icon={Video}
            trend={{ value: "Eligible for certificate", isPositive: true }}
            highlight
          />
          <StatCard
            index={1}
            title="Replay Watch Hours"
            value="42.5 hrs"
            subtitle="Lecture transcripts studied"
            icon={PlaySquare}
            trend={{ value: "+5.2 hrs this week", isPositive: true }}
          />
          <StatCard
            index={2}
            title="My Doubts Cleared"
            value="4 Doubts"
            subtitle="Grounded AI & Faculty"
            icon={HelpCircle}
            trend={{ value: "100% resolved", isPositive: true }}
          />
          <StatCard
            index={3}
            title="Milestone GPA"
            value="95 / 100"
            subtitle="Evaluated by faculty rubrics"
            icon={Award}
            trend={{ value: "Distinction Track", isPositive: true }}
          />
        </div>

        {/* Prominent Live Class Countdown / Join Banner */}
        {liveClass && (
          <Card className="border-border/80 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 via-card to-card border-primary/30 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <Badge variant="default" className="text-[10px] font-bold bg-rose-600 text-white">LIVE NOW</Badge>
                  <span className="text-xs text-muted-foreground font-mono">72 Classmates Online</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {liveClass.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Instructor: <strong>{liveClass.instructorName}</strong> • {liveClass.batchName}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setDeviceModalOpen(true)}
                className="h-10 px-6 text-xs font-bold gap-2 bg-primary text-primary-foreground shrink-0 shadow-md"
              >
                <Video className="h-4 w-4" /> Pre-Join Check & Enter <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        )}

        {/* Bento Grid: Enrolled Course Progress & Recent AI Replay */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrolled Courses Cards (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold">
                    Enrolled Programs & Progress
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Track your curriculum milestone completion and access entitlements
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/student/courses")}
                  className="text-xs h-8 text-primary font-semibold"
                >
                  View Details
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-foreground">
                      Full-Stack AI & LLM Systems Engineering
                    </span>
                    <Badge variant="accent" className="text-[10px] font-bold">
                      Live + Replay Tier
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Cohort 7 (Weekday Evening) • Lead Faculty: Prof. Rajesh Verma
                  </p>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Course Progress</span>
                      <span className="text-primary font-bold">68% Completed</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "68%" }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                    <span className="text-[11px] text-muted-foreground">
                      Access valid until: <strong>31 Dec 2026</strong>
                    </span>
                    <Button
                      size="sm"
                      onClick={() => navigate("/student/courses/course-ai-eng")}
                      className="h-8 text-xs font-bold gap-1"
                    >
                      Open Syllabus <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Replay resume card */}
            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <PlaySquare className="h-4 w-4 text-primary" /> Resume Where You Left Off
                </h4>
                <Badge variant="outline" className="text-[10px]">
                  Paused @ 00:24:18
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Lecture 8: Vector Databases, Chunking Strategies & Embedding Alignment (HNSW Graph Construction chapter)
              </p>

              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/student/replays/rep-rag-8")}
                className="text-xs h-9 font-bold gap-1.5 w-full sm:w-auto"
              >
                <Play className="h-3.5 w-3.5 text-primary" /> Resume at 00:24:18 with AI Tutor
              </Button>
            </Card>
          </div>

          {/* Right Column: Recent Doubts & Quick Actions (1 col) */}
          <div className="space-y-4">
            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-amber-500" /> Recent Doubts
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/student/doubts")}
                  className="text-xs h-7 p-0 text-primary"
                >
                  All Doubts
                </Button>
              </div>

              <div className="space-y-2.5">
                {doubts.slice(0, 2).map((d) => (
                  <div key={d.id} className="p-3 rounded-xl border border-border/60 bg-muted/20 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono text-primary font-bold">▶ {d.timestampFormatted}</span>
                      <Badge variant="success" className="text-[9px]">Answered ✓</Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">"{d.question}"</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" /> Milestone Result
              </h4>
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <p className="text-xs font-bold text-foreground">Milestone 2: Hybrid RAG System</p>
                <p className="text-lg font-extrabold text-primary">95 / 100</p>
                <p className="text-[11px] text-muted-foreground">Evaluator feedback: "Production-grade separation of dense retrieval."</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/student/results/test-rag-eval")}
                className="w-full text-xs h-8 font-semibold"
              >
                View Full Rubric & Feedback
              </Button>
            </Card>
          </div>
        </div>

        {/* Pre-Join Hardware Check Modal */}
        {liveClass && (
          <DeviceCheckModal
            open={deviceModalOpen}
            onOpenChange={setDeviceModalOpen}
            targetClassId={liveClass.id}
            classTitle={liveClass.title}
          />
        )}
      </div>
  );
};
