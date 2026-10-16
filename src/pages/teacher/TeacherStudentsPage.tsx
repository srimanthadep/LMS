import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Mail,
  Clock,
  ChevronRight,
  Download,
  Plus,
  Tag,
  Check,
} from "lucide-react";
import { Student360Drawer } from "@/components/shared/Student360Drawer";
import { useNotifications } from "@/context/NotificationContext";
import { teacherDataService, StudentRosterRecord } from "./teacherDataService";

export const TeacherStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentRosterRecord[]>(() => teacherDataService.getStudents());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAttendance, setFilterAttendance] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"attendance" | "quiz" | "name">("attendance");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Intervention modal
  const [interventionStudent, setInterventionStudent] = useState<StudentRosterRecord | null>(null);
  const [interventionNote, setInterventionNote] = useState("We noticed your recent attendance and quiz checkpoints need attention. Let's schedule a 15-minute 1-on-1 office hour to review concepts.");

  const { addNotification } = useNotifications();

  const reloadStudents = () => {
    setStudents(teacherDataService.getStudents());
  };

  const filteredStudents = students
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.strugglingTopic && s.strugglingTopic.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBatch = filterBatch === "all" || s.batch === filterBatch;
      const matchesStatus = filterStatus === "all" || s.status === filterStatus;

      let matchesAttendance = true;
      if (filterAttendance === "low") matchesAttendance = s.attendanceRate < 75;
      else if (filterAttendance === "medium") matchesAttendance = s.attendanceRate >= 75 && s.attendanceRate < 85;
      else if (filterAttendance === "high") matchesAttendance = s.attendanceRate >= 85;

      return matchesSearch && matchesBatch && matchesStatus && matchesAttendance;
    })
    .sort((a, b) => {
      if (sortBy === "attendance") return a.attendanceRate - b.attendanceRate; // show lowest first for teacher attention
      if (sortBy === "quiz") return b.quizAverage - a.quizAverage;
      return a.name.localeCompare(b.name);
    });

  const handleSendIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionStudent) return;

    const updated = {
      ...interventionStudent,
      supportInterventionSent: true,
      notes: [...(interventionStudent.notes || []), `Intervention sent on ${new Date().toLocaleDateString()}: "${interventionNote}"`],
    };

    teacherDataService.saveStudent(updated);
    reloadStudents();

    addNotification({
      title: `Intervention Sent to ${interventionStudent.name} (Simulated)`,
      message: `Direct academic guidance and revision resources simulated as dispatched via email and portal.`,
      type: "system",
    });

    setInterventionStudent(null);
  };

  const handleExportCSV = () => {
    const listToExport = filteredStudents;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `Student Roster & Telemetry Export`,
        `Batch Filter: ${filterBatch === "all" ? "All Batches" : filterBatch}`,
        `Status Filter: ${filterStatus === "all" ? "All Statuses" : filterStatus}`,
        `Attendance Filter: ${filterAttendance === "all" ? "All Attendance" : filterAttendance}`,
        searchQuery ? `Search Query: "${searchQuery}"` : "",
        `Exported Count: ${listToExport.length} students`,
        "",
        "Student ID,Name,Email,Course,Batch,Attendance %,Quiz Avg %,Pending Tasks,Confusion Signals,Status,Intervention Dispatched"
      ]
        .filter(Boolean)
        .concat(
          listToExport.map(
            (s) =>
              `${s.id},"${s.name}",${s.email},"${s.course}","${s.batch}",${s.attendanceRate}%,${s.quizAverage}%,${s.pendingAssignments},${s.confusionSignalsCount},${s.status},${s.supportInterventionSent ? "Yes" : "No"}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student-roster-${filterBatch !== "all" ? filterBatch.replace(/[^a-z0-9]/gi, "-") : "all"}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      title: "Roster Exported",
      message: `Student roster (${listToExport.length} records) downloaded as CSV.`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Student Management & Telemetry
            <Badge variant="accent" className="text-[10px] font-bold">
              Cohort Scoped
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor attendance rates, quiz performance, live lecture confusion signals, and proactive at-risk interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 dark:border-white/10 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export Roster CSV
          </Button>
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 font-mono text-xs px-3 py-1">
            Total Enrolled: {students.length} Learners
          </Badge>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Cohort Avg Attendance</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1))}%
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">+3.2% vs last week</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Cohort Quiz Benchmark</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {Math.round(students.reduce((acc, s) => acc + s.quizAverage, 0) / (students.length || 1))}%
          </p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">Across all checkpoints</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Learners At-Risk (&lt;70%)</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {students.filter((s) => s.status === "at-risk").length} Students
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Require 1-on-1 counseling</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Live "I'm Lost" Signals</span>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            {students.reduce((acc, s) => acc + s.confusionSignalsCount, 0)} Pings
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Concentrated in Module 2</p>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#151f1a] p-3 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by student name, email, or struggling topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 dark:bg-[#101713]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2.5 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">All Batches</option>
            <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
            <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2.5 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="stellar">Top 10% Stellar</option>
          </select>

          <select
            value={filterAttendance}
            onChange={(e) => setFilterAttendance(e.target.value)}
            className="h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2.5 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">All Attendance</option>
            <option value="low">&lt;75% (Defaulter)</option>
            <option value="medium">75% - 85%</option>
            <option value="high">&gt;85%</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2.5 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="attendance">Sort: Lowest Attendance First</option>
            <option value="quiz">Sort: Highest Quiz Score</option>
            <option value="name">Sort: Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Student Roster Table */}
      <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#121c17] text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Batch & Course</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-center">Quiz Avg</th>
                <th className="py-3 px-4">Status & Learning Signals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-[#121c17] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.email}</p>
                          {student.supportInterventionSent && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                              <Check className="h-3 w-3" /> Intervention Sent
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{student.batch}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{student.course}</p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          student.attendanceRate >= 85
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                            : student.attendanceRate >= 75
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
                        }`}
                      >
                        {student.attendanceRate}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono font-bold text-xs ${
                          student.quizAverage >= 85
                            ? "text-emerald-700 dark:text-emerald-400"
                            : student.quizAverage >= 70
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {student.quizAverage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {student.status === "at-risk" ? (
                        <div className="space-y-1">
                          <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 gap-1 text-[10px]">
                            <AlertTriangle className="h-3 w-3" />
                            At Risk
                          </Badge>
                          {student.strugglingTopic && (
                            <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium line-clamp-1">
                              Topic: {student.strugglingTopic}
                            </p>
                          )}
                          {student.confusionSignalsCount > 0 && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              {student.confusionSignalsCount} "I'm Lost" clicks
                            </span>
                          )}
                        </div>
                      ) : student.status === "stellar" ? (
                        <div className="space-y-0.5">
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 gap-1 text-[10px]">
                            <Sparkles className="h-3 w-3" />
                            Top Performer
                          </Badge>
                          <p className="text-[10px] text-slate-400">All submissions on-time</p>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <Badge variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-300 text-[10px]">
                            Consistent On-Track
                          </Badge>
                          <p className="text-[10px] text-slate-400">Last active: {student.lastActive}</p>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setInterventionStudent(student)}
                          className="h-7 text-[11px] font-semibold text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 cursor-pointer"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Support Check-in
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudentId(student.id)}
                          className="h-7 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#121c17] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Student 360°
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Support Intervention Modal */}
      {interventionStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Support Intervention</h3>
                <p className="text-xs text-slate-500">Student: {interventionStudent.name} ({interventionStudent.email})</p>
              </div>
              <button onClick={() => setInterventionStudent(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1">
              <span className="font-bold text-rose-800 dark:text-rose-300">Telemetry Alert Signals:</span>
              <p className="text-rose-700 dark:text-rose-400">
                Attendance: {interventionStudent.attendanceRate}% • Quiz Avg: {interventionStudent.quizAverage}%
                {interventionStudent.strugglingTopic && ` • Topic: ${interventionStudent.strugglingTopic}`}
              </p>
            </div>

            <form onSubmit={handleSendIntervention} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Custom Counseling Message & Action Plan
                </label>
                <textarea
                  rows={4}
                  required
                  value={interventionNote}
                  onChange={(e) => setInterventionNote(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <Button type="button" variant="outline" size="sm" onClick={() => setInterventionStudent(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold">
                  Dispatch Intervention
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student 360 Drawer Component */}
      {selectedStudentId && (
        <Student360Drawer
          studentId={selectedStudentId}
          open={!!selectedStudentId}
          onOpenChange={(isOpen) => !isOpen && setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default TeacherStudentsPage;
