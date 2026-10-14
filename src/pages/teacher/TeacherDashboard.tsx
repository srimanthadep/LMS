import React from "react";

import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  HelpCircle,
  Clock,
  Sparkles,
  Users,
  PlaySquare,
  ArrowRight,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const liveClasses = mockDataService.getLiveClasses();
  const doubts = mockDataService.getDoubts().filter((d) => d.status === "open");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Faculty Studio Hub
            <Badge variant="accent" className="text-[10px] font-bold">Prof. Rajesh Verma</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Live broadcast controls, student doubt clearance desk, AI lecture reviews, and cohort engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate("/teacher/classroom/class-agentic-101")}
            className="h-9 text-xs font-bold gap-1.5 shadow-sm bg-rose-600 hover:bg-rose-700 text-white"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Enter Live Studio
          </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/teacher/recordings")}
              className="text-xs h-9 font-semibold gap-1"
            >
              <PlaySquare className="h-3.5 w-3.5" /> AI Chapter Reviews
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/teacher/doubts")}
              className="text-xs h-9 font-bold gap-1 shadow-sm"
            >
              <HelpCircle className="h-3.5 w-3.5" /> Doubts Desk ({doubts.length})
            </Button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
          <StatCard
            index={0}
            title="Today's Live Classes"
            value="1 Active"
            subtitle="Agentic Systems (Consensus & Supervision)"
            icon={Video}
            trend={{ value: "72 attending", isPositive: true }}
            highlight
          />
          <StatCard
            index={1}
            title="Unanswered Doubts"
            value={doubts.length.toString()}
            subtitle="Timestamp anchored queries"
            icon={HelpCircle}
            trend={{ value: "Under 1h target", isPositive: false }}
          />
          <StatCard
            index={2}
            title="Pending AI Chapter Reviews"
            value="1 Lecture"
            subtitle="Whisper ASR + Topic Markers"
            icon={Sparkles}
            trend={{ value: "Ready for review", isPositive: true }}
          />
          <StatCard
            index={3}
            title="Avg Student Engagement"
            value="92%"
            subtitle="Attendance & poll votes"
            icon={TrendingUp}
            trend={{ value: "+4% vs Cohort 6", isPositive: true }}
          />
        </div>

        {/* Live Studio Promotion Card */}
        <Card className="border-border/80 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950/20 via-card to-card border-rose-500/30 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <Badge variant="destructive" className="text-[10px] font-bold">LIVE CLASSROOM BROADCASTING</Badge>
                <span className="text-xs font-mono text-muted-foreground">72 Students Connected</span>
              </div>
              <h3 className="text-base font-bold text-foreground">
                Session 4: Multi-Agent Consensus & Hierarchical Supervision
              </h3>
              <p className="text-xs text-muted-foreground">
                Batch: Agentic Systems Bootcamp (Weekend Cohort) • Active Topic: Hierarchical Supervisor Node Execution
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => navigate("/teacher/classroom/class-agentic-101")}
              className="h-10 px-5 text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-700 text-white shrink-0 shadow-md"
            >
              <Video className="h-4 w-4" /> Open Teacher Studio <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </Card>

        {/* Bento Grid: Today's Schedule & Doubts Inbox */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doubts Queue Preview (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-500" /> Pending Timestamp Doubts
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Questions anchored to specific seconds in lecture recordings
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/teacher/doubts")}
                  className="text-xs h-8 text-primary font-semibold"
                >
                  View All ({doubts.length})
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3">
                {doubts.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 transition-colors space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-xs text-foreground">{d.studentName}</span>
                      <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        ▶ Anchor: {d.timestampFormatted}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      "{d.question}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                      <span>Lecture: {d.classTitle}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate("/teacher/doubts")}
                        className="h-6 text-[11px] font-bold text-primary p-0"
                      >
                        Answer Doubt →
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Shortcuts (1 col) */}
          <div className="space-y-4">
            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
              <h4 className="text-sm font-bold text-foreground">Faculty Tools</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/teacher/recordings")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  📝 Review AI Lecture Chapters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/teacher/tests")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  📋 Create Assessment & Rubric
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/teacher/resources")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  📂 Upload Lecture Slides & DPPs
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/teacher/analytics")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  📊 Concept Confusion Heatmaps
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};
