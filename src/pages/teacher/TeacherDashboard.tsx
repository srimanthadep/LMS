import React, { useState } from "react";
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
  BookOpen,
  Calendar,
  Plus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { useNotifications } from "@/context/NotificationContext";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const liveClasses = mockDataService.getLiveClasses();
  const doubts = mockDataService.getDoubts().filter((d) => d.status === "open");
  const courses = mockDataService.getCourses();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [assetName, setAssetName] = useState("");

  const handleUploadAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;
    addNotification({
      title: "Material Uploaded",
      message: `${assetName} has been attached to Cohort 7 course materials.`,
      type: "class",
    });
    setShowUploadModal(false);
    setAssetName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#151f1a] border border-slate-200 dark:border-white/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Faculty Command Hub
            </h1>
            <Badge variant="accent" className="text-[10px] font-bold">
              Prof. Rajesh Verma
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of assigned cohorts, live broadcast studio, pending grading SLA tasks, and student doubt clearance.
          </p>
        </div>

        {/* Quick Action Floating Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate("/teacher/schedule")}
            className="h-8 text-xs font-semibold gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 cursor-pointer shadow-2xs"
          >
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            Schedule Class
          </Button>

          <Button
            size="sm"
            onClick={() => navigate("/teacher/courses")}
            className="h-8 text-xs font-semibold gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5 text-blue-600" />
            Create Course
          </Button>

          <Button
            size="sm"
            onClick={() => setShowUploadModal(true)}
            className="h-8 text-xs font-semibold gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 cursor-pointer shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5 text-purple-600" />
            Upload Material
          </Button>

          <Button
            size="sm"
            onClick={() => navigate("/teacher/classroom/class-agentic-101")}
            className="h-8 text-xs font-bold gap-1.5 shadow-sm bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Enter Live Studio
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
          title="Pending Grading SLA"
          value="8 Capstones"
          subtitle="Due within 24 hours"
          icon={FileCheck2}
          trend={{ value: "4h remaining", isPositive: false }}
        />
        <StatCard
          index={3}
          title="Avg Cohort Attendance"
          value="88.4%"
          subtitle="160 Enrolled Students"
          icon={TrendingUp}
          trend={{ value: "+3.2% vs Cohort 6", isPositive: true }}
        />
      </div>

      {/* Live Classroom Banner */}
      <Card className="border-border/80 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950/20 via-card to-card border-rose-500/30 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <Badge variant="destructive" className="text-[10px] font-bold">
                LIVE CLASSROOM BROADCASTING
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">72 Students Connected</span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Lecture 14: Multi-Agent Consensus & Hierarchical Supervision
            </h3>
            <p className="text-xs text-muted-foreground">
              Batch: Cohort 7 (Live Synchronous) • Active Topic: Hierarchical Supervisor Node Execution
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => navigate("/teacher/classroom/class-agentic-101")}
            className="h-10 px-5 text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-700 text-white shrink-0 shadow-md cursor-pointer"
          >
            <Video className="h-4 w-4" /> Open Teacher Studio <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </Card>

      {/* Assigned Batches Overview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            Assigned Batches & Course Enrollments
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/teacher/courses")}
            className="text-xs text-emerald-700 font-semibold cursor-pointer"
          >
            View All Courses ({courses.length}) →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">Active Cohort</Badge>
              <span className="text-xs font-mono text-slate-500 font-semibold">112 Enrolled</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Full-Stack AI & LLM Systems Engineering (Cohort 7)
            </h4>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Attendance</span>
                <span className="text-xs font-bold text-slate-800">88.4%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Quiz Avg</span>
                <span className="text-xs font-bold text-slate-800">82.6%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Modules</span>
                <span className="text-xs font-bold text-slate-800">12 Core</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/teacher/attendance")}
                className="flex-1 text-xs h-7 cursor-pointer"
              >
                Roll Call Matrix
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/teacher/students")}
                className="flex-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Student Roster
              </Button>
            </div>
          </Card>

          <Card className="p-5 border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px]">Active Cohort</Badge>
              <span className="text-xs font-mono text-slate-500 font-semibold">48 Enrolled</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Autonomous Multi-Agent Architectures (Cohort 4)
            </h4>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Attendance</span>
                <span className="text-xs font-bold text-slate-800">92.1%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Quiz Avg</span>
                <span className="text-xs font-bold text-slate-800">88.0%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Modules</span>
                <span className="text-xs font-bold text-slate-800">8 Core</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/teacher/attendance")}
                className="flex-1 text-xs h-7 cursor-pointer"
              >
                Roll Call Matrix
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/teacher/students")}
                className="flex-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Student Roster
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Doubts and Recent Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doubts Inbox */}
        <Card className="border-border/80 shadow-xs rounded-2xl bg-card overflow-hidden">
          <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              Pending Timestamp Doubts ({doubts.length})
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("/teacher/doubts")}
              className="text-xs text-primary font-semibold h-7"
            >
              Doubts Desk →
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-2.5">
            {doubts.slice(0, 3).map((d) => (
              <div key={d.id} className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{d.studentName}</span>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Anchor: {d.timestampFormatted}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-1 italic">"{d.question}"</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>{d.classTitle}</span>
                  <button
                    onClick={() => navigate("/teacher/doubts")}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Answer Doubt →
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Student Submissions Feed */}
        <Card className="border-border/80 shadow-xs rounded-2xl bg-card overflow-hidden">
          <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              Recent Submissions & SLA Timers
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("/teacher/assignments")}
              className="text-xs text-primary font-semibold h-7"
            >
              Grading Suite →
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-2.5">
            {[
              {
                student: "Arjun Mehta",
                assignment: "Capstone 1: Scalable Agent Swarm",
                submitted: "15 mins ago",
                sla: "23h remaining",
              },
              {
                student: "Pooja Hegde",
                assignment: "Capstone 1: Scalable Agent Swarm",
                submitted: "1 hour ago",
                sla: "23h remaining",
              },
              {
                student: "Devendra Patel",
                assignment: "Lab 3: FAISS Vector Recall",
                submitted: "3 hours ago",
                sla: "21h remaining",
              },
            ].map((sub, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{sub.student}</span>
                  <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                    {sub.sla}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{sub.assignment}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Received: {sub.submitted}</span>
                  <button
                    onClick={() => navigate("/teacher/assignments")}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Grade Now →
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload Learning Material / Slides</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadAsset} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Document / Presentation Name</label>
                <input
                  required
                  placeholder="e.g. Lecture-14-Supervisor-Math.pdf"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full h-9 text-xs rounded-md border border-slate-200 px-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Attach File</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400 hover:border-emerald-500 cursor-pointer">
                  <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <span>Click to browse or drop PDF, PPTX, or Jupyter Notebook</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  Confirm & Sync
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
