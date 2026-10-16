import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Download,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { teacherDataService, StudentResultRecord } from "./teacherDataService";

export const TeacherResultsPage: React.FC = () => {
  const { role } = useAuth();
  const { addNotification } = useNotifications();

  const [results, setResults] = useState<StudentResultRecord[]>(() =>
    teacherDataService.getResults()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Release Confirmation Gate Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingReleaseTarget, setPendingReleaseTarget] = useState<StudentResultRecord | "ALL" | null>(null);

  const reloadResults = () => {
    setResults(teacherDataService.getResults());
  };

  const handleOpenReleaseConfirm = (target: StudentResultRecord | "ALL") => {
    if (target === "ALL" && !permissions.canBulkReleaseGrades) {
      addNotification({
        title: "Action Restricted",
        message: "Bulk grade release is restricted to Academic Admin by institutional policy.",
        type: "system",
      });
      return;
    }
    if (target !== "ALL" && !permissions.canPublishFinalGrades) {
      addNotification({
        title: "Action Restricted",
        message: "Publishing final grades requires administrator certification authorization.",
        type: "system",
      });
      return;
    }
    setPendingReleaseTarget(target);
    setShowConfirmModal(true);
  };

  const handleConfirmRelease = () => {
    if (!pendingReleaseTarget) return;

    if (pendingReleaseTarget === "ALL") {
      if (!permissions.canBulkReleaseGrades) {
        setShowConfirmModal(false);
        setPendingReleaseTarget(null);
        addNotification({
          title: "Permission Denied",
          message: "You are not authorized to release bulk grades.",
          type: "system",
        });
        return;
      }
      const updated = results.map((r) => ({ ...r, isReleased: true }));
      setResults(updated);
      teacherDataService.saveResults(updated);
      addNotification({
        title: "Cohort Grades Released (Simulation)",
        message: "All grades marked as released in frontend state (local demo - student transcript emails simulated).",
        type: "grade",
      });
    } else {
      if (!permissions.canPublishFinalGrades) {
        setShowConfirmModal(false);
        setPendingReleaseTarget(null);
        addNotification({
          title: "Permission Denied",
          message: "You are not authorized to publish individual grades.",
          type: "system",
        });
        return;
      }
      const updated = results.map((r) =>
        r.id === pendingReleaseTarget.id ? { ...r, isReleased: true } : r
      );
      setResults(updated);
      teacherDataService.saveResults(updated);
      addNotification({
        title: `Grade Released: ${pendingReleaseTarget.name}`,
        message: `Final grade of ${pendingReleaseTarget.finalGrade} recorded as released in local ledger (simulated action).`,
        type: "grade",
      });
    }

    setShowConfirmModal(false);
    setPendingReleaseTarget(null);
  };

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === "all" || r.batch.includes(selectedBatch);
    const matchesStatus = selectedStatus === "all" || r.status === selectedStatus;
    return matchesSearch && matchesBatch && matchesStatus;
  });

  const handleExportResults = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        `"Certified Grade Roster"`,
        `"Batch Scope: ${selectedBatch === "all" ? "All Cohorts" : selectedBatch}"`,
        `"Status Filter: ${selectedStatus}"`,
        `"Exported Date: ${new Date().toLocaleDateString()}"`,
        `"Total Records: ${filteredResults.length}"`,
        "",
        "Roll No,Student ID,Name,Batch,Course,Quiz Avg %,Assignments %,Capstone %,Final Grade,Status,Official Release Status"
      ]
        .concat(
          filteredResults.map(
            (r) =>
              `${r.rollNo},${r.studentId},"${r.name}","${r.batch}","${r.courseTitle}",${r.quizzesAverage}%,${r.assignmentsScore}%,${r.capstoneScore}%,${r.finalGrade},${r.status},${r.isReleased ? "RELEASED" : "PENDING_RELEASE"}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `cohort-grades-${selectedBatch.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      title: "Results Roster Exported",
      message: `Exported ${filteredResults.length} filtered student result records to CSV.`,
      type: "system",
    });
  };

  const unreleasedCount = results.filter((r) => !r.isReleased).length;

  const permissions = teacherDataService.getPermissions();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Results & Academic Standing
            <Badge variant="accent" className="text-[10px] font-bold">
              Cohort 7
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit assessment outcomes, evaluate student academic standing, and review certified grades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportResults}
            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 dark:border-white/10 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export Grade Roster
          </Button>

          {permissions.canBulkReleaseGrades && unreleasedCount > 0 && (
            <Button
              size="sm"
              onClick={() => handleOpenReleaseConfirm("ALL")}
              className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Release All Grades ({unreleasedCount})
            </Button>
          )}
        </div>
      </div>

      {/* KPI Distribution Curve Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Cohort Distinction (A+)</span>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
            {results.filter((r) => r.finalGrade === "A+").length} Students
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">&gt;90% aggregate score</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Class Average Aggregate</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {Math.round(
              results.reduce((acc, r) => acc + (r.quizzesAverage + r.assignmentsScore + r.capstoneScore) / 3, 0) /
                (results.length || 1)
            )}%
          </p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">+4.8% vs Cohort 6 baseline</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Borderline / Action Needed</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {results.filter((r) => r.status === "Borderline" || r.status === "Action Required").length} Students
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">Offered makeup assignment</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Publication Status</span>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {results.filter((r) => r.isReleased).length} / {results.length} Released
          </p>
          <p className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-0.5">
            {unreleasedCount === 0 ? "100% Certified" : `${unreleasedCount} Pending Approval`}
          </p>
        </Card>
      </div>

      {/* Bell Curve Score Distribution Card */}
      <Card className="p-5 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Cohort Score Distribution (Gaussian Bell Curve)
            </h3>
            <p className="text-xs text-slate-500">Performance dispersion across enrolled cohort learners</p>
          </div>
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">Standard Deviation: 6.2%</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {[
            { grade: "A+ (90-100%)", count: results.filter((r) => r.finalGrade === "A+").length, color: "bg-emerald-600" },
            { grade: "A (80-89%)", count: results.filter((r) => r.finalGrade === "A").length, color: "bg-emerald-500" },
            { grade: "B (70-79%)", count: results.filter((r) => r.finalGrade === "B").length, color: "bg-blue-500" },
            { grade: "C (60-69%)", count: results.filter((r) => r.finalGrade === "C").length, color: "bg-amber-500" },
            { grade: "D/F (<60%)", count: results.filter((r) => r.finalGrade === "D" || r.finalGrade === "F").length, color: "bg-rose-500" },
          ].map((bin, i) => {
            const pct = Math.round((bin.count / (results.length || 1)) * 100);
            return (
              <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#121c17] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{bin.grade}</span>
                  <span className="font-mono">{bin.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className={`h-full ${bin.color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono block text-right">{pct}% of cohort</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Grade Roster Table */}
      <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] overflow-hidden shadow-2xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            Official Grade Roster & Publication Records
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <input
              placeholder="Search student or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs px-2.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] w-52"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Outcomes</option>
              <option value="Pass with Distinction">Pass with Distinction</option>
              <option value="Pass">Pass</option>
              <option value="Borderline">Borderline</option>
            </select>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#121c17] text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4 text-center">Quizzes Avg</th>
                <th className="py-3 px-4 text-center">Assignments</th>
                <th className="py-3 px-4 text-center">Capstone</th>
                <th className="py-3 px-4 text-center">Final Grade</th>
                <th className="py-3 px-4 text-center">Academic Standing</th>
                <th className="py-3 px-4 text-right">Publication Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-[#121c17] transition">
                  <td className="py-3 px-4 font-mono text-slate-500">{r.rollNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    <p>{r.name}</p>
                    {r.evaluatorFeedback && (
                      <p className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{r.evaluatorFeedback}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">{r.quizzesAverage}%</td>
                  <td className="py-3 px-4 text-center font-mono">{r.assignmentsScore}%</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">{r.capstoneScore}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-extrabold font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200">
                      {r.finalGrade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        r.status === "Pass with Distinction"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : r.status === "Pass"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {r.isReleased ? (
                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Certified & Released
                      </Badge>
                    ) : permissions.canPublishFinalGrades ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenReleaseConfirm(r)}
                        className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        Publish Grade
                      </Button>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-slate-600 dark:text-slate-400 border-slate-300 dark:border-white/10 text-[10px] gap-1 bg-slate-50 dark:bg-[#121c17]"
                      >
                        <Clock className="h-3 w-3 text-amber-500" />
                        Pending Release
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Release Confirmation Modal */}
      {showConfirmModal && (permissions.canBulkReleaseGrades || permissions.canPublishFinalGrades) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Authorize Official Grade Release
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {pendingReleaseTarget === "ALL"
                ? `You are about to officially certify and release results for all ${unreleasedCount} pending student records in this cohort. Transcripts will immediately update on student portals.`
                : `You are about to release the final grade of "${(pendingReleaseTarget as StudentResultRecord)?.finalGrade}" for ${(pendingReleaseTarget as StudentResultRecord)?.name}. This action is permanent and records an entry in the institutional audit log.`}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101713] border border-slate-200 dark:border-white/10 text-xs space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Authorization Verification:</span>
              <p className="text-slate-500 font-mono">Faculty: Prof. Rajesh Verma • Role: {role.toUpperCase()}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingReleaseTarget(null);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmRelease}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Confirm & Dispatch Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherResultsPage;
