import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Calendar,
  Users,
  Search,
  CheckCheck,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface AttendanceRecord {
  studentId: string;
  name: string;
  rollNo: string;
  status: AttendanceStatus;
  cumulativeRate: number;
}

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { studentId: "usr-1", name: "Arjun Mehta", rollNo: "AI-C7-001", status: "present", cumulativeRate: 88 },
  { studentId: "usr-2", name: "Pooja Hegde", rollNo: "AI-C7-002", status: "present", cumulativeRate: 94 },
  { studentId: "usr-3", name: "Devendra Patel", rollNo: "AI-C7-003", status: "absent", cumulativeRate: 68 },
  { studentId: "usr-4", name: "Simran Kaur", rollNo: "AI-C7-004", status: "late", cumulativeRate: 72 },
  { studentId: "usr-5", name: "Rohan Varma", rollNo: "AI-C7-005", status: "present", cumulativeRate: 90 },
  { studentId: "usr-6", name: "Ananya Deshmukh", rollNo: "AI-C7-006", status: "present", cumulativeRate: 96 },
  { studentId: "usr-7", name: "Kunal Sharma", rollNo: "AI-C7-007", status: "present", cumulativeRate: 84 },
  { studentId: "usr-8", name: "Tanvi Saxena", rollNo: "AI-C7-008", status: "excused", cumulativeRate: 76 },
];

export const TeacherAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [selectedBatch, setSelectedBatch] = useState("Cohort 7 (Live + Replay)");
  const [selectedClass, setSelectedClass] = useState("Lecture 14: Multi-Agent Consensus & Supervision");
  const [selectedDate, setSelectedDate] = useState("2026-10-14");
  const [searchQuery, setSearchQuery] = useState("");

  const { addNotification } = useNotifications();

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status: newStatus } : r))
    );
  };

  const handleMarkAllPresent = () => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: "present" })));
    addNotification({
      title: "All Marked Present",
      message: "Attendance set to 100% Present for this session.",
      type: "class",
    });
  };

  const handleSaveAttendance = () => {
    addNotification({
      title: "Attendance Ledger Saved",
      message: `Successfully verified and locked attendance for ${selectedClass}.`,
      type: "class",
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Roll No,Name,Session Status,Cumulative Rate"]
        .concat(records.map((r) => `${r.rollNo},${r.name},${r.status.toUpperCase()},${r.cumulativeRate}%`))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      title: "Attendance Report Downloaded",
      message: "Exported session roster to CSV format.",
      type: "system",
    });
  };

  const presentCount = records.filter((r) => r.status === "present").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const excusedCount = records.filter((r) => r.status === "excused").length;
  const sessionRate = Math.round(((presentCount + lateCount * 0.5) / records.length) * 100);

  const filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Attendance Desk & Roll Call
            <Badge variant="accent" className="text-[10px] font-bold">
              Cohort 7
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Take roll calls for live lecture sessions, track cumulative attendance percentages, and flag low-attendance defaulters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={handleSaveAttendance}
            className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Lock & Save Roster
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Session Attendance Rate</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{sessionRate}%</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{presentCount} learners present</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Late Arrivals</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">{lateCount} Students</p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Arrived &gt;10m after start</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Unexcused Absences</span>
          <p className="text-2xl font-bold text-rose-600 mt-2">{absentCount} Students</p>
          <p className="text-[11px] text-rose-700 font-medium mt-0.5">Automated SMS sent to cohort</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Defaulters (&lt;75% Cutoff)</span>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {records.filter((r) => r.cumulativeRate < 75).length} Students
          </p>
          <p className="text-[11px] text-purple-700 font-medium mt-0.5">Ineligible for final cert</p>
        </Card>
      </div>

      {/* Session Selector Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Assigned Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full h-8 text-xs rounded-md border border-slate-200 px-2"
            >
              <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
              <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Lecture Session</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-8 text-xs rounded-md border border-slate-200 px-2"
            >
              <option value="Lecture 14: Multi-Agent Consensus & Supervision">
                Lecture 14: Multi-Agent Consensus
              </option>
              <option value="Lecture 13: Grounded Vector Memory Architecture">
                Lecture 13: Grounded Vector Memory
              </option>
              <option value="Lecture 12: Scaled Self-Attention Kernels">Lecture 12: Scaled Self-Attention</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-8 text-xs rounded-md border border-slate-200 px-2"
            />
          </div>
        </div>

        <div className="flex items-end pt-2 sm:pt-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllPresent}
            className="h-8 text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50 cursor-pointer"
          >
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Attendance Roll Call Table */}
      <Card className="border-slate-200 bg-white overflow-hidden shadow-2xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            Class Roll Call Roster ({filteredRecords.length} Students)
          </CardTitle>
          <input
            placeholder="Search by student name or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 text-xs px-2.5 rounded-md border border-slate-200 w-60"
          />
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Cumulative Rate</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono text-slate-500">{r.rollNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        r.cumulativeRate >= 75
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {r.cumulativeRate}%
                    </span>
                    {r.cumulativeRate < 75 && (
                      <span className="block text-[10px] text-rose-600 font-semibold mt-0.5">Defaulter Risk</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleStatusChange(r.studentId, "present")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                          r.status === "present"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.studentId, "late")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                          r.status === "late"
                            ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.studentId, "absent")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                          r.status === "absent"
                            ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.studentId, "excused")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                          r.status === "excused"
                            ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Excused
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TeacherAttendancePage;
