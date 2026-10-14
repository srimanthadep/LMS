import React, { useState } from "react";
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
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface StudentResult {
  id: string;
  name: string;
  rollNo: string;
  batch: string;
  quizzesAverage: number;
  assignmentsScore: number;
  capstoneScore: number;
  finalGrade: string;
  isReleased: boolean;
  status: "Pass with Distinction" | "Pass" | "Borderline" | "Action Required";
}

const INITIAL_RESULTS: StudentResult[] = [
  {
    id: "res-1",
    name: "Arjun Mehta",
    rollNo: "AI-C7-001",
    batch: "Cohort 7 (Live + Replay)",
    quizzesAverage: 92,
    assignmentsScore: 94,
    capstoneScore: 95,
    finalGrade: "A+",
    isReleased: true,
    status: "Pass with Distinction",
  },
  {
    id: "res-2",
    name: "Pooja Hegde",
    rollNo: "AI-C7-002",
    batch: "Cohort 7 (Live + Replay)",
    quizzesAverage: 96,
    assignmentsScore: 98,
    capstoneScore: 96,
    finalGrade: "A+",
    isReleased: true,
    status: "Pass with Distinction",
  },
  {
    id: "res-3",
    name: "Devendra Patel",
    rollNo: "AI-C7-003",
    batch: "Cohort 7 (Live + Replay)",
    quizzesAverage: 58,
    assignmentsScore: 62,
    capstoneScore: 60,
    finalGrade: "C",
    isReleased: false,
    status: "Borderline",
  },
  {
    id: "res-4",
    name: "Simran Kaur",
    rollNo: "AI-C7-004",
    batch: "Cohort 7 (Live + Replay)",
    quizzesAverage: 72,
    assignmentsScore: 78,
    capstoneScore: 74,
    finalGrade: "B",
    isReleased: true,
    status: "Pass",
  },
  {
    id: "res-5",
    name: "Rohan Varma",
    rollNo: "AI-C7-005",
    batch: "Cohort 7 (Live + Replay)",
    quizzesAverage: 88,
    assignmentsScore: 86,
    capstoneScore: 89,
    finalGrade: "A",
    isReleased: true,
    status: "Pass with Distinction",
  },
  {
    id: "res-6",
    name: "Ananya Deshmukh",
    rollNo: "AI-C7-006",
    batch: "Cohort 7 (Live + Replay)",
    quizzesAverage: 98,
    assignmentsScore: 96,
    capstoneScore: 97,
    finalGrade: "A+",
    isReleased: true,
    status: "Pass with Distinction",
  },
];

export const TeacherResultsPage: React.FC = () => {
  const [results, setResults] = useState<StudentResult[]>(INITIAL_RESULTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");

  const { addNotification } = useNotifications();

  const handleReleaseAll = () => {
    setResults((prev) => prev.map((r) => ({ ...r, isReleased: true })));
    addNotification({
      title: "All Grades Released",
      message: "Published official cohort results to student portal & email ledger.",
      type: "grade",
    });
  };

  const handleExportResults = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Roll No,Name,Batch,Quiz Avg,Assignments,Capstone,Final Grade,Status"]
        .concat(
          results.map(
            (r) =>
              `${r.rollNo},${r.name},${r.batch},${r.quizzesAverage}%,${r.assignmentsScore}%,${r.capstoneScore}%,${r.finalGrade},${r.status}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cohort-final-grades.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      title: "Results Roster Exported",
      message: "Saved official assessment report to CSV.",
      type: "system",
    });
  };

  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === "all" || r.batch.includes(selectedBatch);
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Results & Grade Release
            <Badge variant="accent" className="text-[10px] font-bold">
              Cohort 7
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit assessment outcomes, review grade distributions across rubrics, and publish official academic certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportResults}
            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export Grade Roster
          </Button>

          <Button
            size="sm"
            onClick={handleReleaseAll}
            className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Release Pending Grades
          </Button>
        </div>
      </div>

      {/* KPI Distribution Curve Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Cohort Distinction (A+)</span>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {results.filter((r) => r.finalGrade === "A+").length} Students
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">&gt;90% aggregate score</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Class Average Aggregate</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">84.2%</p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">+4.8% vs Cohort 6 baseline</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Borderline / Action Needed</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {results.filter((r) => r.status === "Borderline").length} Students
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Offered makeup assignment</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Course Completion Rate</span>
          <p className="text-2xl font-bold text-purple-600 mt-2">91.4%</p>
          <p className="text-[11px] text-purple-700 font-medium mt-0.5">Accreditation verified</p>
        </Card>
      </div>

      {/* Bell Curve Score Distribution Card */}
      <Card className="p-5 border-slate-200 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Cohort Score Distribution (Gaussian Bell Curve)
            </h3>
            <p className="text-xs text-slate-500">Performance dispersion across 112 learners</p>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-semibold">Standard Deviation: 6.2%</span>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-2">
          {[
            { grade: "A+ (90-100%)", count: 48, percent: "42.8%", color: "bg-emerald-600" },
            { grade: "A (80-89%)", count: 36, percent: "32.1%", color: "bg-emerald-500" },
            { grade: "B (70-79%)", count: 18, percent: "16.0%", color: "bg-blue-500" },
            { grade: "C (60-69%)", count: 8, percent: "7.1%", color: "bg-amber-500" },
            { grade: "D/F (<60%)", count: 2, percent: "1.8%", color: "bg-rose-500" },
          ].map((bin, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{bin.grade}</span>
                <span className="font-mono">{bin.count}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className={`h-full ${bin.color}`} style={{ width: bin.percent }} />
              </div>
              <span className="text-[10px] text-slate-400 font-mono block text-right">{bin.percent}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Grade Roster Table */}
      <Card className="border-slate-200 bg-white overflow-hidden shadow-2xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            Official Grade Roster & Certificate Release
          </CardTitle>
          <input
            placeholder="Search student or roll no..."
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
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4 text-center">Quizzes Avg</th>
                <th className="py-3 px-4 text-center">Assignments</th>
                <th className="py-3 px-4 text-center">Capstone</th>
                <th className="py-3 px-4 text-center">Final Grade</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Release Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono text-slate-500">{r.rollNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3 px-4 text-center font-mono">{r.quizzesAverage}%</td>
                  <td className="py-3 px-4 text-center font-mono">{r.assignmentsScore}%</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">{r.capstoneScore}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-extrabold font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {r.finalGrade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        r.status === "Pass with Distinction"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "Pass"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {r.isReleased ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Released
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setResults((prev) =>
                            prev.map((item) => (item.id === r.id ? { ...item, isReleased: true } : item))
                          );
                          addNotification({
                            title: `Grade Released: ${r.name}`,
                            message: `Final grade of ${r.finalGrade} officially released.`,
                            type: "grade",
                          });
                        }}
                        className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        Publish Grade
                      </Button>
                    )}
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

export default TeacherResultsPage;
