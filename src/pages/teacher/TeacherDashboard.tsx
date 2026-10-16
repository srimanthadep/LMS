import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  Bell,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { teacherDataService } from "./teacherDataService";
import { useNotifications } from "@/context/NotificationContext";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Dynamic Data from teacherDataService
  const [courses, setCourses] = useState(() => teacherDataService.getCourses());
  const [students, setStudents] = useState(() => teacherDataService.getStudents());
  const [doubts, setDoubts] = useState(() => teacherDataService.getDoubts().filter((d) => d.status === "open" || d.status === "ai_answered"));
  const [assignments, setAssignments] = useState(() => teacherDataService.getAssignments());
  const [scheduleSlots, setScheduleSlots] = useState(() => teacherDataService.getScheduleSlots());
  const [profile] = useState(() => teacherDataService.getProfile());

  useEffect(() => {
    // Refresh state when component mounts or data updates
    setCourses(teacherDataService.getCourses());
    setStudents(teacherDataService.getStudents());
    setDoubts(teacherDataService.getDoubts().filter((d) => d.status === "open" || d.status === "ai_answered"));
    setAssignments(teacherDataService.getAssignments());
    setScheduleSlots(teacherDataService.getScheduleSlots());
  }, []);

  // Compute dynamic stats
  const totalEnrolled = students.length;
  const atRiskStudents = students.filter((s) => s.status === "at-risk");
  const totalPendingGrading = assignments.reduce((acc, a) => acc + (a.pendingCount || 0), 0);
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / (students.length || 1)
  );

  const upcomingClasses = scheduleSlots.filter(
    (s) => s.type === "live-class" && s.status === "upcoming"
  );
  const activeClass = scheduleSlots.find((s) => s.status === "live") || upcomingClasses[0];

  // Determine next upcoming class or active live session
  const liveOrUpcomingClasses = scheduleSlots.filter(
    (s) => s.type === "live-class" && (s.status === "upcoming" || s.status === "live")
  );
  const nextUpcomingClass =
    scheduleSlots.find((s) => s.status === "live") ||
    [...liveOrUpcomingClasses]
      .filter((s) => s.status === "upcoming")
      .sort((a, b) => {
        const timeA = new Date(`${a.date}T${a.startTime}:00`).getTime();
        const timeB = new Date(`${b.date}T${b.startTime}:00`).getTime();
        return timeA - timeB;
      })[0] ||
    null;

  const getCountdownDisplay = (slot: typeof nextUpcomingClass) => {
    if (!slot) return null;
    if (slot.status === "live") return "LIVE NOW";

    try {
      const classDate = new Date(`${slot.date}T${slot.startTime}:00`);
      const now = new Date();
      const diffMs = classDate.getTime() - now.getTime();

      if (diffMs > 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (diffHours >= 24) {
          const days = Math.floor(diffHours / 24);
          return `In ${days} day${days > 1 ? "s" : ""}`;
        }
        if (diffHours > 0) {
          return `In ${diffHours}h ${diffMins}m`;
        }
        return `In ${diffMins}m`;
      }
    } catch {
      // fallback
    }
    return `Today at ${slot.startTime}`;
  };

  const formatClassDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
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
              {profile.name}
            </Badge>
            <Badge variant="outline" className="text-[10px] text-emerald-700 dark:text-emerald-400 border-emerald-300">
              Active Faculty
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of assigned cohorts, live broadcast studio, pending grading SLA tasks, and student doubt clearance.
          </p>
        </div>

        {/* Quick Action Buttons for Permitted Activities */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate("/teacher/courses")}
            className="h-8 text-xs font-semibold gap-1.5 bg-white dark:bg-[#121c17] hover:bg-slate-50 dark:hover:bg-[#1a2820] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer shadow-2xs"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            Assigned Courses
          </Button>

          <Button
            size="sm"
            onClick={() => navigate("/teacher/resources")}
            className="h-8 text-xs font-semibold gap-1.5 bg-white dark:bg-[#121c17] hover:bg-slate-50 dark:hover:bg-[#1a2820] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer shadow-2xs"
          >
            <Layers className="h-3.5 w-3.5 text-purple-600" />
            Review Materials
          </Button>

          <Button
            size="sm"
            onClick={() => navigate("/teacher/attendance")}
            className="h-8 text-xs font-semibold gap-1.5 bg-white dark:bg-[#121c17] hover:bg-slate-50 dark:hover:bg-[#1a2820] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Manage Attendance
          </Button>

          <Button
            size="sm"
            onClick={() => navigate("/teacher/doubts")}
            className="h-8 text-xs font-semibold gap-1.5 bg-white dark:bg-[#121c17] hover:bg-slate-50 dark:hover:bg-[#1a2820] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
            Respond to Doubts
          </Button>

          <Button
            size="sm"
            onClick={() => navigate("/teacher/students")}
            className="h-8 text-xs font-semibold gap-1.5 bg-white dark:bg-[#121c17] hover:bg-slate-50 dark:hover:bg-[#1a2820] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 text-indigo-600" />
            Student Progress
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

      {/* 4 Dynamic Stat Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
        <StatCard
          index={0}
          title="Assigned Cohorts & Classes"
          value={`${upcomingClasses.length} Scheduled`}
          subtitle={activeClass ? activeClass.title : "No classes today"}
          icon={Video}
          trend={{ value: `${courses.length} Active Courses`, isPositive: true }}
          highlight
          onAction={() => navigate("/teacher/schedule")}
        />
        <StatCard
          index={1}
          title="Upcoming Class"
          value=""
          subtitle={nextUpcomingClass ? (nextUpcomingClass.batch || nextUpcomingClass.course) : "Schedule up to date"}
          icon={Calendar}
          trend={{
            value: nextUpcomingClass ? (getCountdownDisplay(nextUpcomingClass) || "Scheduled") : "No Active Class",
            isPositive: !!nextUpcomingClass,
          }}
          onAction={() => navigate(nextUpcomingClass?.meetingUrl || "/teacher/schedule")}
        >
          {nextUpcomingClass ? (
            <div className="my-1 space-y-1 min-w-0">
              <h3
                className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 truncate"
                title={nextUpcomingClass.title}
              >
                {nextUpcomingClass.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {nextUpcomingClass.course}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary font-medium pt-0.5">
                <Clock className="w-3 h-3 shrink-0" />
                <span>
                  {formatClassDate(nextUpcomingClass.date)} • {nextUpcomingClass.startTime}
                </span>
              </div>
            </div>
          ) : (
            <div className="my-1.5 space-y-0.5">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Classes Scheduled
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Check schedule for upcoming sessions
              </p>
            </div>
          )}
        </StatCard>
        <StatCard
          index={2}
          title="Pending Grading SLA"
          value={`${totalPendingGrading} Submissions`}
          subtitle="Due within 24 hours"
          icon={FileCheck2}
          trend={{
            value: totalPendingGrading > 0 ? "Requires review" : "Up to date",
            isPositive: totalPendingGrading === 0,
          }}
          onAction={() => navigate("/teacher/assignments")}
        />
        <StatCard
          index={3}
          title="Avg Cohort Attendance"
          value={`${avgAttendance}%`}
          subtitle={`${totalEnrolled} Enrolled Learners`}
          icon={TrendingUp}
          trend={{
            value: `${atRiskStudents.length} Students At-Risk`,
            isPositive: atRiskStudents.length === 0,
          }}
          onAction={() => navigate("/teacher/attendance")}
        />
      </div>

      {/* Teaching Insights & AI Pedagogical Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Intervention Required ({atRiskStudents.length} Students)
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-300/80 leading-relaxed">
              Learners with attendance under 75% or low quiz scores flagged in Cohort 7.
            </p>
            <button
              onClick={() => navigate("/teacher/students")}
              className="text-[11px] font-bold text-amber-900 dark:text-amber-200 hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
            >
              Review At-Risk Roster <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
              AI Topic Scrubbing Friction Alert
            </h4>
            <p className="text-[11px] text-blue-800 dark:text-blue-300/80 leading-relaxed">
              34% of Cohort 7 rewound the LangGraph Supervisor section. Suggest a 15-min recap.
            </p>
            <button
              onClick={() => navigate("/teacher/analytics")}
              className="text-[11px] font-bold text-blue-900 dark:text-blue-200 hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
            >
              Inspect Friction Heatmap <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/20 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              Grading Turnaround SLA Health
            </h4>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 leading-relaxed">
              98.2% on-time turnaround across recent lab evaluations. Next cutoff in 24 hours.
            </p>
            <button
              onClick={() => navigate("/teacher/assignments")}
              className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
            >
              Open Grading Suite <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Classroom Banner */}
      <Card className="border-border/80 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950/20 via-card to-card border-rose-500/30 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <Badge variant="destructive" className="text-[10px] font-bold">
                {activeClass?.status === "live" ? "BROADCAST IN PROGRESS" : "BROADCAST STUDIO READY"}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">
                {totalEnrolled} Students Enrolled
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              {activeClass ? activeClass.title : "No live class currently active"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {activeClass
                ? `Batch: ${activeClass.batch} • Scheduled: ${activeClass.date} at ${activeClass.startTime} • Course: ${activeClass.course}`
                : "Check calendar for scheduled live lectures and office hours"}
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => navigate(activeClass?.meetingUrl || "/teacher/classroom/class-agentic-101")}
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
            className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer"
          >
            View All Courses ({courses.length}) →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 2).map((course, idx) => (
            <Card key={course.id} className="p-5 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-[10px]">
                  {course.category}
                </Badge>
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  {course.enrolledStudentsCount || (idx === 0 ? 112 : 48)} Enrolled
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {course.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {course.description}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-white/5 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Attendance</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {idx === 0 ? "88.4%" : "92.1%"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Quiz Avg</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {idx === 0 ? "82.6%" : "88.0%"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Modules</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {course.modulesCount} Core
                  </span>
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
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                  className="flex-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Curriculum & Lessons
                </Button>
              </div>
            </Card>
          ))}
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
            {doubts.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                No pending doubts. All student queries answered!
              </div>
            ) : (
              doubts.slice(0, 3).map((d) => (
                <div key={d.id} className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{d.studentName}</span>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                      Anchor: {d.timestampFormatted || "00:15:20"}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-1 italic">"{d.question}"</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>{d.classTitle}</span>
                    <button
                      onClick={() => navigate("/teacher/doubts")}
                      className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      Answer Doubt →
                    </button>
                  </div>
                </div>
              ))
            )}
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
                  <span className="font-bold text-slate-900 dark:text-slate-100">{sub.student}</span>
                  <span className="font-mono text-[10px] text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                    {sub.sla}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{sub.assignment}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Received: {sub.submitted}</span>
                  <button
                    onClick={() => navigate("/teacher/assignments")}
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Grade Now →
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
