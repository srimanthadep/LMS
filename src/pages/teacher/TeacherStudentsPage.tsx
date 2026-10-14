import React, { useState } from "react";
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
} from "lucide-react";
import { Student360Drawer } from "@/components/shared/Student360Drawer";
import { useNotifications } from "@/context/NotificationContext";

interface FacultyStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  batch: string;
  attendanceRate: number;
  quizAverage: number;
  pendingAssignments: number;
  confusionSignalsCount: number;
  strugglingTopic?: string;
  status: "on-track" | "at-risk" | "stellar";
  lastActive: string;
}

const FACULTY_STUDENTS: FacultyStudent[] = [
  {
    id: "usr-student-1",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    course: "Full-Stack AI & LLM Systems",
    batch: "Cohort 7 (Live + Replay)",
    attendanceRate: 88,
    quizAverage: 86,
    pendingAssignments: 0,
    confusionSignalsCount: 1,
    status: "on-track",
    lastActive: "15 mins ago",
  },
  {
    id: "usr-student-2",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    course: "Full-Stack AI & LLM Systems",
    batch: "Cohort 7 (Live + Replay)",
    attendanceRate: 94,
    quizAverage: 95,
    pendingAssignments: 0,
    confusionSignalsCount: 0,
    status: "stellar",
    lastActive: "1 hour ago",
  },
  {
    id: "usr-student-3",
    name: "Devendra Patel",
    email: "dev.patel@tech.in",
    course: "Full-Stack AI & LLM Systems",
    batch: "Cohort 7 (Live + Replay)",
    attendanceRate: 68,
    quizAverage: 58,
    pendingAssignments: 2,
    confusionSignalsCount: 4,
    strugglingTopic: "Faiss Index Topologies & Cosine Metric",
    status: "at-risk",
    lastActive: "3 days ago",
  },
  {
    id: "usr-student-4",
    name: "Simran Kaur",
    email: "simran.k@example.com",
    course: "Autonomous Multi-Agent Architectures",
    batch: "Cohort 4 (Live Sync)",
    attendanceRate: 72,
    quizAverage: 62,
    pendingAssignments: 1,
    confusionSignalsCount: 3,
    strugglingTopic: "Zod Schema Tool Calling in LangGraph",
    status: "at-risk",
    lastActive: "Yesterday",
  },
  {
    id: "usr-student-5",
    name: "Rohan Varma",
    email: "rohan.v@company.org",
    course: "Full-Stack AI & LLM Systems",
    batch: "Cohort 7 (Live + Replay)",
    attendanceRate: 90,
    quizAverage: 82,
    pendingAssignments: 0,
    confusionSignalsCount: 0,
    status: "on-track",
    lastActive: "Just now",
  },
  {
    id: "usr-student-6",
    name: "Ananya Deshmukh",
    email: "ananya.d@startup.ai",
    course: "Autonomous Multi-Agent Architectures",
    batch: "Cohort 4 (Live Sync)",
    attendanceRate: 96,
    quizAverage: 98,
    pendingAssignments: 0,
    confusionSignalsCount: 0,
    status: "stellar",
    lastActive: "2 hours ago",
  },
];

export const TeacherStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<FacultyStudent[]>(FACULTY_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const { addNotification } = useNotifications();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.strugglingTopic && s.strugglingTopic.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBatch = filterBatch === "all" || s.batch === filterBatch;
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const handleSendCheckin = (studentName: string) => {
    addNotification({
      title: `Check-in Sent to ${studentName}`,
      message: `An academic support inquiry and revision resources have been dispatched to ${studentName}.`,
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
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 font-mono text-xs px-3 py-1">
            Total Enrolled: {students.length} Learners
          </Badge>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Cohort Avg Attendance</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">84.6%</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">+3.2% vs last week</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Cohort Quiz Benchmark</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">79.8%</p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">Across 4 checkpoints</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Learners At-Risk (&lt;70%)</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {students.filter((s) => s.status === "at-risk").length} Students
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Require 1-on-1 counseling</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Live "I'm Lost" Signals</span>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            {students.reduce((acc, s) => acc + s.confusionSignalsCount, 0)} Pings
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Concentrated in Module 2</p>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by student name, email, or struggling topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            className="h-9 text-xs rounded-md border border-slate-200 bg-white px-2.5 text-slate-700 cursor-pointer"
          >
            <option value="all">All Batches</option>
            <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
            <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 text-xs rounded-md border border-slate-200 bg-white px-2.5 text-slate-700 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk (&lt;70%)</option>
            <option value="stellar">Top 10% Stellar</option>
          </select>
        </div>
      </div>

      {/* Student Roster Table */}
      <Card className="border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Batch & Course</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-center">Quiz Avg</th>
                <th className="py-3 px-4">Status & Learning Signals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-[11px] text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{student.batch}</p>
                    <p className="text-[11px] text-slate-500">{student.course}</p>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        student.attendanceRate >= 85
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : student.attendanceRate >= 75
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {student.attendanceRate}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-bold text-xs ${
                        student.quizAverage >= 85
                          ? "text-emerald-700"
                          : student.quizAverage >= 70
                          ? "text-blue-700"
                          : "text-rose-700"
                      }`}
                    >
                      {student.quizAverage}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {student.status === "at-risk" ? (
                      <div className="space-y-1">
                        <Badge className="bg-rose-100 text-rose-800 border-rose-200 gap-1 text-[10px]">
                          <AlertTriangle className="h-3 w-3" />
                          At Risk
                        </Badge>
                        {student.strugglingTopic && (
                          <p className="text-[11px] text-rose-700 font-medium line-clamp-1">
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
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1 text-[10px]">
                          <Sparkles className="h-3 w-3" />
                          Top Performer
                        </Badge>
                        <p className="text-[10px] text-slate-400">All submissions on-time</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <Badge variant="outline" className="text-slate-700 border-slate-300 text-[10px]">
                          Consistent On-Track
                        </Badge>
                        <p className="text-[10px] text-slate-400">Last active: {student.lastActive}</p>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {student.status === "at-risk" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendCheckin(student.name)}
                          className="h-7 text-[11px] font-semibold text-rose-700 border-rose-200 hover:bg-rose-50 cursor-pointer"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Support Check-in
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedStudentId(student.id)}
                        className="h-7 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Student 360°
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
