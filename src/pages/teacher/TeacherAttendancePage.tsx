import React, { useState, useEffect } from "react";
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
  Lock,
  Unlock,
  Bell,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { teacherDataService, SessionAttendanceLedger } from "./teacherDataService";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

export const TeacherAttendancePage: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState("Cohort 7 (Live + Replay)");
  const [selectedClass, setSelectedClass] = useState("Lecture 14: Multi-Agent Consensus & Supervision");
  const [selectedDate, setSelectedDate] = useState("2026-10-15");
  const [searchQuery, setSearchQuery] = useState("");
  const [ledger, setLedger] = useState<SessionAttendanceLedger>(() =>
    teacherDataService.getAttendanceLedger(selectedBatch, selectedDate, selectedClass)
  );

  const { addNotification } = useNotifications();

  // Reload ledger when batch, date, or class changes
  useEffect(() => {
    const l = teacherDataService.getAttendanceLedger(selectedBatch, selectedDate, selectedClass);
    setLedger(l);
  }, [selectedBatch, selectedDate, selectedClass]);

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    if (ledger.isLocked) {
      addNotification({
        title: "Roster Locked",
        message: "Unlock this attendance ledger to make further status adjustments.",
        type: "system",
      });
      return;
    }

    const updatedRecords = ledger.records.map((r) =>
      r.studentId === studentId ? { ...r, status: newStatus } : r
    );
    const updatedLedger = { ...ledger, records: updatedRecords };
    setLedger(updatedLedger);
    teacherDataService.saveAttendanceLedger(updatedLedger);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    if (ledger.isLocked) {
      addNotification({
        title: "Roster Locked",
        message: "Cannot modify attendance while the roster is locked. Unlock ledger first.",
        type: "system",
      });
      return;
    }
    const updatedRecords = ledger.records.map((r) => ({ ...r, status }));
    const updatedLedger = { ...ledger, records: updatedRecords };
    setLedger(updatedLedger);
    teacherDataService.saveAttendanceLedger(updatedLedger);
    addNotification({
      title: `All Marked ${status.toUpperCase()}`,
      message: `Updated all ${updatedRecords.length} students to ${status} for ${selectedClass}.`,
      type: "class",
    });
  };

  const handleToggleLock = () => {
    const updatedLedger = { ...ledger, isLocked: !ledger.isLocked };
    setLedger(updatedLedger);
    teacherDataService.saveAttendanceLedger(updatedLedger);
    addNotification({
      title: updatedLedger.isLocked ? "Attendance Ledger Locked" : "Attendance Ledger Unlocked",
      message: updatedLedger.isLocked
        ? `Roster locked and officially certified for ${selectedClass}.`
        : `Roster unlocked for modifications.`,
      type: "class",
    });
  };

  const handleNotifyDefaulters = () => {
    const defaulters = ledger.records.filter((r) => r.cumulativeRate < 75);
    addNotification({
      title: "Defaulter Notices Dispatched (Simulated)",
      message: `Simulated SMS & Email alerts logged for ${defaulters.length} learners under the 75% cutoff. No real messages were dispatched.`,
      type: "system",
    });
  };

  const handleExportCSV = () => {
    const recordsToExport = searchQuery ? filteredRecords : ledger.records;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `Session Attendance Ledger: ${selectedClass}`,
        `Batch: ${selectedBatch}`,
        `Date: ${selectedDate}`,
        `Ledger Status: ${ledger.isLocked ? "LOCKED & CERTIFIED" : "UNLOCKED (DRAFT)"}`,
        searchQuery ? `Active Search Filter: "${searchQuery}"` : "",
        "Roll No,Student Name,Status,Cumulative Rate",
      ]
        .filter(Boolean)
        .concat(
          recordsToExport.map((r) => `${r.rollNo},"${r.name}",${r.status.toUpperCase()},${r.cumulativeRate}%`)
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance-${selectedBatch.replace(/[^a-z0-9]/gi, "-")}-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      title: "Attendance Report Downloaded",
      message: `Exported ${recordsToExport.length} session attendance records for ${selectedBatch} to CSV format.`,
      type: "system",
    });
  };

  const presentCount = ledger.records.filter((r) => r.status === "present").length;
  const lateCount = ledger.records.filter((r) => r.status === "late").length;
  const absentCount = ledger.records.filter((r) => r.status === "absent").length;
  const excusedCount = ledger.records.filter((r) => r.status === "excused").length;
  const sessionRate = Math.round(((presentCount + lateCount * 0.5) / (ledger.records.length || 1)) * 100);

  const filteredRecords = ledger.records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Attendance Desk & Roll Call
            <Badge variant="accent" className="text-[10px] font-bold">
              {selectedBatch}
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
            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 dark:border-white/10 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={handleToggleLock}
            className={`h-9 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs ${
              ledger.isLocked
                ? "bg-slate-700 hover:bg-slate-800 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {ledger.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            {ledger.isLocked ? "Unlock Ledger" : "Lock & Save Roster"}
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Session Attendance Rate</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{sessionRate}%</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{presentCount} learners present</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Late Arrivals</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">{lateCount} Students</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">Arrived &gt;10m after start</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Unexcused Absences</span>
          <p className="text-2xl font-bold text-rose-600 mt-2">{absentCount} Students</p>
          <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium mt-0.5">Absence logged in roster</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Defaulters (&lt;75% Cutoff)</span>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {ledger.records.filter((r) => r.cumulativeRate < 75).length} Students
          </p>
          <button
            onClick={handleNotifyDefaulters}
            className="text-[11px] text-purple-700 dark:text-purple-400 font-bold hover:underline flex items-center gap-1 mt-0.5"
          >
            <Bell className="h-3 w-3" /> Dispatch Warnings
          </button>
        </Card>
      </div>

      {/* Session Selector Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#151f1a] p-4 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Assigned Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2 text-slate-700 dark:text-slate-300"
            >
              <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
              <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Lecture Session</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2 text-slate-700 dark:text-slate-300"
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
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2 text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>

        <div className="flex items-end gap-2 pt-2 sm:pt-0">
          <Button
            size="sm"
            variant="outline"
            disabled={ledger.isLocked}
            onClick={() => handleMarkAll("present")}
            className="h-8 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300 hover:bg-emerald-50 cursor-pointer disabled:opacity-50"
          >
            Mark All Present
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={ledger.isLocked}
            onClick={() => handleMarkAll("absent")}
            className="h-8 text-xs font-semibold text-rose-700 dark:text-rose-400 border-rose-300 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
          >
            Mark All Absent
          </Button>
        </div>
      </div>

      {/* Attendance Roll Call Table */}
      <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] overflow-hidden shadow-2xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-white/10 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            Class Roll Call Roster ({filteredRecords.length} Students)
            {ledger.isLocked && (
              <Badge className="bg-slate-700 text-white text-[9px] gap-1 ml-2">
                <Lock className="h-2.5 w-2.5" /> LOCKED
              </Badge>
            )}
          </CardTitle>
          <input
            placeholder="Search by student name or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 text-xs px-2.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] w-60"
          />
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#121c17] text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Cumulative Rate</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-slate-500 italic">
                    {searchQuery
                      ? `No student records found matching "${searchQuery}".`
                      : "No students registered in this batch roster."}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-50/70 dark:hover:bg-[#121c17] transition">
                  <td className="py-3 px-4 font-mono text-slate-500">{r.rollNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{r.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        r.cumulativeRate >= 75
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
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
                        disabled={ledger.isLocked}
                        onClick={() => handleStatusChange(r.studentId, "present")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border disabled:opacity-60 ${
                          r.status === "present"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-white dark:bg-[#101713] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        disabled={ledger.isLocked}
                        onClick={() => handleStatusChange(r.studentId, "late")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border disabled:opacity-60 ${
                          r.status === "late"
                            ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                            : "bg-white dark:bg-[#101713] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50"
                        }`}
                      >
                        Late
                      </button>
                      <button
                        disabled={ledger.isLocked}
                        onClick={() => handleStatusChange(r.studentId, "absent")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border disabled:opacity-60 ${
                          r.status === "absent"
                            ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                            : "bg-white dark:bg-[#101713] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50"
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        disabled={ledger.isLocked}
                        onClick={() => handleStatusChange(r.studentId, "excused")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border disabled:opacity-60 ${
                          r.status === "excused"
                            ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                            : "bg-white dark:bg-[#101713] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50"
                        }`}
                      >
                        Excused
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TeacherAttendancePage;
