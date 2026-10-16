import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck2,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Sliders,
  Send,
  Sparkles,
  Download,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Code,
  ShieldCheck,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { teacherDataService, TeacherAssignmentItem } from "./teacherDataService";

interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  isLate: boolean;
  score?: number;
  status: "graded" | "pending";
  submissionUrl: string;
  studentNotes: string;
  codeSnippet?: string;
  feedback?: string;
  rubricScores?: Record<string, number>;
}

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    assignmentId: "asg-1",
    studentName: "Arjun Mehta",
    studentEmail: "arjun.m@learner.ai",
    submittedAt: "Yesterday at 04:30 PM",
    isLate: false,
    status: "pending",
    submissionUrl: "https://github.com/arjunmehta/agent-swarm-lms",
    studentNotes: "Implemented custom circuit breaker in tool loop and benchmarked token consumption.",
    codeSnippet: `class AgentSupervisor:\n    def __init__(self, agents, circuit_breaker):\n        self.agents = agents\n        self.cb = circuit_breaker\n\n    async def route_task(self, query):\n        if self.cb.is_tripped():\n            return await self.fallback_execution(query)\n        return await self.consensus_step(query)`,
  },
  {
    id: "sub-2",
    assignmentId: "asg-1",
    studentName: "Pooja Hegde",
    studentEmail: "pooja.h@example.com",
    submittedAt: "Today at 09:15 AM",
    isLate: false,
    score: 96,
    status: "graded",
    submissionUrl: "https://github.com/poojahegde/multi-agent-system",
    studentNotes: "Added unit tests with MockOpenAI and validated tool schema resilience.",
    codeSnippet: `@pytest.mark.asyncio\nasync def test_supervisor_schema_resilience():\n    supervisor = SupervisorNode(strict_schema=True)\n    result = await supervisor.invoke({"input": "benchmark"})\n    assert result.status == 200`,
  },
  {
    id: "sub-3",
    assignmentId: "asg-1",
    studentName: "Devendra Patel",
    studentEmail: "dev.patel@tech.in",
    submittedAt: "Today at 01:10 PM",
    isLate: true,
    status: "pending",
    submissionUrl: "https://github.com/devpatel/langgraph-experiment",
    studentNotes: "Apologies for late submission, resolved Docker compose networking issue.",
    codeSnippet: `version: '3.8'\nservices:\n  redis-vector:\n    image: redis/redis-stack:latest\n    ports:\n      - "6379:6379"`,
  },
];

export const TeacherAssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { addNotification } = useNotifications();

  // Assignments from shared service
  const [assignments, setAssignments] = useState<TeacherAssignmentItem[]>(() =>
    teacherDataService.getAssignments()
  );
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("asg-1");
  const [activeTab, setActiveTab] = useState<"assignments" | "grading">("assignments");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterSubmissionStatus, setFilterSubmissionStatus] = useState("all");

  // Grading Modal/Drawer State
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [previewSubmission, setPreviewSubmission] = useState<Submission | null>(null);
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>({});
  const [facultyFeedback, setFacultyFeedback] = useState("");
  const [gradeValidationError, setGradeValidationError] = useState<string | null>(null);

  const permissions = teacherDataService.getPermissions();
  // Check teacher permission from permissions config or role
  const isAuthorizedToGrade =
    permissions.canGradeSubmissions ||
    role === "teacher" ||
    role === "evaluator" ||
    role === "super-admin" ||
    role === "admin";

  const reloadAssignments = () => {
    setAssignments(teacherDataService.getAssignments());
  };

  const currentAssignment =
    assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  // When opening a submission, initialize rubric scores and feedback from THAT submission only
  const openGradingWorkstation = (sub: Submission) => {
    setActiveSubmission(sub);
    setGradeValidationError(null);

    // Initialize feedback
    setFacultyFeedback(sub.feedback || "");

    // Initialize rubric scores
    const initialScores: Record<string, number> = {};
    if (sub.rubricScores) {
      currentAssignment.rubricCriteria.forEach((crit) => {
        initialScores[crit.id] = sub.rubricScores![crit.id] ?? crit.maxScore;
      });
    } else if (sub.score !== undefined) {
      // Distribute proportionally if a score already exists
      const totalMax = currentAssignment.maxScore || 1;
      currentAssignment.rubricCriteria.forEach((crit) => {
        const ratio = crit.maxScore / totalMax;
        initialScores[crit.id] = Math.round(sub.score! * ratio);
      });
    } else {
      // Default to 80% benchmark for un-evaluated
      currentAssignment.rubricCriteria.forEach((crit) => {
        initialScores[crit.id] = Math.round(crit.maxScore * 0.8);
      });
    }
    setCriterionScores(initialScores);
  };

  const handleCriterionScoreChange = (critId: string, val: number, maxScore: number) => {
    const clamped = Math.max(0, Math.min(val, maxScore));
    setCriterionScores((prev) => ({
      ...prev,
      [critId]: clamped,
    }));
  };

  const currentTotalScore = currentAssignment.rubricCriteria.reduce(
    (sum, crit) => sum + (criterionScores[crit.id] ?? 0),
    0
  );

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    if (!isAuthorizedToGrade) {
      addNotification({
        title: "Permission Denied",
        message: "You must hold teacher or evaluator credentials to release grades.",
        type: "system",
      });
      return;
    }

    // Validate rubric bounds
    for (const crit of currentAssignment.rubricCriteria) {
      const score = criterionScores[crit.id] ?? 0;
      if (score < 0 || score > crit.maxScore) {
        setGradeValidationError(
          `Score for "${crit.name}" must be between 0 and ${crit.maxScore}.`
        );
        return;
      }
    }

    if (currentTotalScore > currentAssignment.maxScore) {
      setGradeValidationError(
        `Total score (${currentTotalScore}) cannot exceed maximum allowed marks (${currentAssignment.maxScore}).`
      );
      return;
    }

    setGradeValidationError(null);

    // Update submission in state
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === activeSubmission.id
          ? {
              ...s,
              score: currentTotalScore,
              rubricScores: { ...criterionScores },
              feedback: facultyFeedback,
              status: "graded",
            }
          : s
      )
    );

    // Update assignment counter if newly graded
    const curAsg = assignments.find((a) => a.id === selectedAssignmentId);
    if (curAsg && activeSubmission.status !== "graded") {
      const updatedAsg = {
        ...curAsg,
        gradedCount: curAsg.gradedCount + 1,
        pendingCount: Math.max(0, curAsg.pendingCount - 1),
      };
      teacherDataService.saveAssignment(updatedAsg);
      reloadAssignments();
    }

    addNotification({
      title: "Grade Saved & Certified",
      message: `Score of ${currentTotalScore}/${currentAssignment.maxScore} and feedback recorded for ${activeSubmission.studentName}.`,
      type: "grade",
    });

    setActiveSubmission(null);
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterSubmissionStatus === "all" || s.status === filterSubmissionStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Assignments & Assessment Suite
            <Badge variant="accent" className="text-[10px] font-bold">
              Rubric Evaluation
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View assigned cohort assessments, review evaluation rubrics, monitor student submissions, and grade work items within SLA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-xs px-3 py-1 font-semibold">
            {assignments.length} Active Coursework Items
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Active Coursework</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{assignments.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Active cohort scope</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Total Submissions</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {assignments.reduce((acc, a) => acc + (a.totalSubmissions || 0), 0)}
          </p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">88% cohort submission rate</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Pending Evaluation</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {assignments.reduce((acc, a) => acc + (a.pendingCount || 0), 0)} Work items
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">Within 24h grading SLA</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <span className="text-xs font-medium text-slate-500">Cohort Average Score</span>
          <p className="text-2xl font-bold text-purple-600 mt-2">87.4%</p>
          <p className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-0.5">From 170+ evaluated rubrics</p>
        </Card>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "assignments"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="h-4 w-4" />
          Cohort Coursework ({assignments.length})
        </button>

        <button
          onClick={() => setActiveTab("grading")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "grading"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          Submission & Grading Queue ({submissions.filter((s) => s.status === "pending").length} Pending)
        </button>
      </div>

      {/* Tab 1: Assignments List */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Coursework and milestone rubrics across assigned cohorts.</span>
            <Badge variant="outline" className="text-[11px] font-mono text-slate-500 border-slate-200 dark:border-white/10">
              {assignments.length} Items (Read-Only)
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((asg) => (
              <Card
                key={asg.id}
                className="p-5 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-[10px] uppercase font-bold">
                      {asg.type}
                    </Badge>
                    <span className="text-[11px] text-slate-500 font-mono font-semibold">Max: {asg.maxScore} pts</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{asg.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{asg.batch}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Due: {asg.dueDate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{asg.gradedCount}</span>
                    <span className="text-slate-400">/{asg.totalSubmissions} Graded</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedAssignmentId(asg.id);
                      setActiveTab("grading");
                    }}
                    className="h-8 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 cursor-pointer"
                  >
                    Submissions Queue →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Grading Queue */}
      {activeTab === "grading" && (
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] overflow-hidden shadow-2xs space-y-3">
          <CardHeader className="py-3 px-4 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Submissions: {currentAssignment.title}
              </CardTitle>
              <p className="text-[11px] text-slate-500">{currentAssignment.batch} • Max: {currentAssignment.maxScore} pts</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                placeholder="Search student or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs px-2.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] w-52"
              />
              <select
                value={filterSubmissionStatus}
                onChange={(e) => setFilterSubmissionStatus(e.target.value)}
                className="h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Grade</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#121c17] text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Artifact / Notes</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No student submissions match current filter.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 dark:hover:bg-[#121c17] transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{sub.studentName}</p>
                        <p className="text-[11px] text-slate-400">{sub.studentEmail}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{sub.submittedAt}</p>
                        {sub.isLate && (
                          <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[9px] mt-0.5">Late Submission</Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={sub.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-mono truncate max-w-xs block flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3 inline" /> {sub.submissionUrl}
                        </a>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{sub.studentNotes}</p>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {sub.status === "graded" ? (
                          <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400 text-sm">
                            {sub.score} / {currentAssignment.maxScore}
                          </span>
                        ) : (
                          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-[10px]">
                            Pending Grade
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewSubmission(sub)}
                            className="h-7 text-xs text-slate-600 dark:text-slate-300"
                          >
                            <Eye className="h-3 w-3 mr-1" /> Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openGradingWorkstation(sub)}
                            className={`h-7 text-xs font-semibold cursor-pointer ${
                              sub.status === "graded"
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#18241d] dark:text-slate-200 border border-slate-300 dark:border-white/10"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                            }`}
                          >
                            {sub.status === "graded" ? "Edit Grade" : "Grade Work"}
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
      )}

      {/* Submission Preview Modal */}
      {previewSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono">
                  Submission Code Preview
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {previewSubmission.studentName} ({previewSubmission.studentEmail})
                </h3>
              </div>
              <button onClick={() => setPreviewSubmission(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student Notes:</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-[#101713] p-3 rounded-lg border border-slate-200 dark:border-white/10">
                "{previewSubmission.studentNotes}"
              </p>
            </div>

            {previewSubmission.codeSnippet && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Code Submission:</span>
                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto max-h-60 leading-relaxed">
                  <code>{previewSubmission.codeSnippet}</code>
                </pre>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <Button size="sm" variant="outline" onClick={() => setPreviewSubmission(null)} className="text-xs cursor-pointer">
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const target = previewSubmission;
                  setPreviewSubmission(null);
                  openGradingWorkstation(target);
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Proceed to Grade
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Grading Drawer */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white dark:bg-[#141e19] border-l border-slate-200 dark:border-white/10 w-full max-w-2xl h-full p-6 space-y-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Grading & Feedback Workstation</h3>
                  <p className="text-xs text-slate-500">Student: {activeSubmission.studentName}</p>
                </div>
                <button
                  onClick={() => setActiveSubmission(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Submission Information Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#101713] border border-slate-200 dark:border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Artifact Submission
                </span>
                <p className="text-xs font-mono text-emerald-800 dark:text-emerald-400 break-all">{activeSubmission.submissionUrl}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{activeSubmission.studentNotes}"</p>
              </div>

              {/* Dynamic Rubric Sliders for Current Assignment */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-emerald-600" />
                  Rubric Scoring Criteria (Total: {currentAssignment.maxScore} marks)
                </h4>

                {currentAssignment.rubricCriteria.map((criterion, idx) => {
                  const score = criterionScores[criterion.id] ?? 0;
                  return (
                    <div
                      key={criterion.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121c17] space-y-1.5"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {idx + 1}. {criterion.name}
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {score} / {criterion.maxScore}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={criterion.maxScore}
                        value={score}
                        onChange={(e) =>
                          handleCriterionScoreChange(criterion.id, Number(e.target.value), criterion.maxScore)
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Validation Warning */}
              {gradeValidationError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{gradeValidationError}</span>
                </div>
              )}

              {/* Total Score Summary */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Calculated Final Score:</span>
                <span className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                  {currentTotalScore} / {currentAssignment.maxScore}
                </span>
              </div>

              {/* Faculty Feedback Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Qualitative Faculty Feedback & Advice</label>
                <textarea
                  rows={4}
                  value={facultyFeedback}
                  onChange={(e) => setFacultyFeedback(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] text-slate-900 dark:text-white"
                  placeholder="Provide constructive feedback on architectural choices..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveSubmission(null)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleGradeSubmit}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-bold"
              >
                Release Grade & Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentsPage;
