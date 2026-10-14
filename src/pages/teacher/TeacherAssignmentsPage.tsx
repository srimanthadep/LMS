import React, { useState } from "react";
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
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface Assignment {
  id: string;
  title: string;
  batch: string;
  dueDate: string;
  maxScore: number;
  totalSubmissions: number;
  gradedCount: number;
  pendingCount: number;
  type: "capstone" | "lab" | "quiz";
}

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
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    title: "Capstone 1: Scalable Agent Swarm with Tool Calling",
    batch: "Cohort 7 (Live + Replay)",
    dueDate: "20 Oct 2026, 11:59 PM",
    maxScore: 100,
    totalSubmissions: 68,
    gradedCount: 52,
    pendingCount: 16,
    type: "capstone",
  },
  {
    id: "asg-2",
    title: "Lab 3: FAISS Vector Recall vs Latency Benchmarking",
    batch: "Cohort 7 (Live + Replay)",
    dueDate: "16 Oct 2026, 06:00 PM",
    maxScore: 50,
    totalSubmissions: 72,
    gradedCount: 70,
    pendingCount: 2,
    type: "lab",
  },
  {
    id: "asg-3",
    title: "Checkpoint Quiz 2: Embedding Space Topologies",
    batch: "Cohort 4 (Live Sync)",
    dueDate: "12 Oct 2026 (Closed)",
    maxScore: 25,
    totalSubmissions: 48,
    gradedCount: 48,
    pendingCount: 0,
    type: "quiz",
  },
];

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
  },
];

export const TeacherAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("asg-1");
  const [activeTab, setActiveTab] = useState<"assignments" | "grading">("assignments");

  // Grading Modal/Drawer State
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [rubricScore1, setRubricScore1] = useState(38);
  const [rubricScore2, setRubricScore2] = useState(28);
  const [rubricScore3, setRubricScore3] = useState(25);
  const [facultyFeedback, setFacultyFeedback] = useState(
    "Excellent tool routing architecture. Consider adding jitter backoff to external API retries."
  );

  // Create Assignment State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newDueDate, setNewDueDate] = useState("2026-10-25");

  const { addNotification } = useNotifications();

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    const total = rubricScore1 + rubricScore2 + rubricScore3;
    setSubmissions((prev) =>
      prev.map((s) => (s.id === activeSubmission.id ? { ...s, score: total, status: "graded" } : s))
    );

    addNotification({
      title: "Grade Released & Synced",
      message: `Score of ${total}/100 and feedback sent to ${activeSubmission.studentName}.`,
      type: "grade",
    });

    setActiveSubmission(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle,
      batch: "Cohort 7 (Live + Replay)",
      dueDate: `${newDueDate}, 11:59 PM`,
      maxScore: Number(newMaxScore),
      totalSubmissions: 0,
      gradedCount: 0,
      pendingCount: 0,
      type: "lab",
    };

    setAssignments([created, ...assignments]);
    setShowCreateModal(false);
    setNewTitle("");

    addNotification({
      title: "Assignment Published",
      message: `${newTitle} is now published and visible to students.`,
      type: "class",
    });
  };

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
            Create cohort assignments, author evaluation rubrics, grade student submissions, and enforce turnaround SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Assignment
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Active Assignments</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{assignments.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Assigned to cohorts</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Total Submissions</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {assignments.reduce((acc, a) => acc + a.totalSubmissions, 0)}
          </p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">88% cohort submission rate</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Pending Evaluation</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {assignments.reduce((acc, a) => acc + a.pendingCount, 0)} Work items
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Within 24h grading SLA</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-500">Cohort Average Score</span>
          <p className="text-2xl font-bold text-purple-600 mt-2">87.4%</p>
          <p className="text-[11px] text-purple-700 font-medium mt-0.5">From 170+ evaluated rubrics</p>
        </Card>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "assignments" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          Cohort Assignments ({assignments.length})
        </button>

        <button
          onClick={() => setActiveTab("grading")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "grading" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          Submission & Grading Queue ({submissions.filter((s) => s.status === "pending").length} Pending)
        </button>
      </div>

      {/* Tab 1: Assignments List */}
      {activeTab === "assignments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((asg) => (
            <Card key={asg.id} className="p-5 border-slate-200 bg-white flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] uppercase font-bold">
                    {asg.type}
                  </Badge>
                  <span className="text-[11px] text-slate-500 font-mono font-semibold">Max: {asg.maxScore} pts</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{asg.title}</h3>
                <p className="text-xs text-slate-500">{asg.batch}</p>
                <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Due: {asg.dueDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-slate-800">{asg.gradedCount}</span>
                  <span className="text-slate-400">/{asg.totalSubmissions} Graded</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedAssignmentId(asg.id);
                    setActiveTab("grading");
                  }}
                  className="h-8 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                >
                  Submissions Queue →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Grading Queue */}
      {activeTab === "grading" && (
        <Card className="border-slate-200 bg-white overflow-hidden shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-800">
              Student Submissions: Capstone 1 (Agent Swarms)
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              SLA Target: 24 Hours
            </Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Repository / Artifact</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{sub.studentName}</p>
                      <p className="text-[11px] text-slate-400">{sub.studentEmail}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{sub.submittedAt}</p>
                      {sub.isLate && (
                        <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[9px] mt-0.5">Late +2h</Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <a
                        href={sub.submissionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-700 hover:underline font-mono truncate max-w-xs block"
                      >
                        {sub.submissionUrl}
                      </a>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{sub.studentNotes}</p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {sub.status === "graded" ? (
                        <span className="font-bold font-mono text-emerald-700 text-sm">{sub.score} / 100</span>
                      ) : (
                        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-[10px]">
                          Pending Grade
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => setActiveSubmission(sub)}
                        className={`h-7 text-xs font-semibold cursor-pointer ${
                          sub.status === "graded"
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                        }`}
                      >
                        {sub.status === "graded" ? "Edit Grade" : "Grade Work"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Side-by-Side Grading Drawer */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white dark:bg-[#141e19] border-l border-slate-200 w-full max-w-2xl h-full p-6 space-y-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grading & Feedback Workstation</h3>
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
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Artifact Submission
                </span>
                <p className="text-xs font-mono text-emerald-800 break-all">{activeSubmission.submissionUrl}</p>
                <p className="text-xs text-slate-600 italic">"{activeSubmission.studentNotes}"</p>
              </div>

              {/* Interactive Rubric Sliders */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-emerald-600" />
                  Rubric Scoring Criteria (Max: 100)
                </h4>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">1. Agent Coordination & Consensus Logic</span>
                    <span className="font-mono font-bold text-emerald-700">{rubricScore1} / 40</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={rubricScore1}
                    onChange={(e) => setRubricScore1(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">2. Tool Calling Validation & Schema Rigor</span>
                    <span className="font-mono font-bold text-emerald-700">{rubricScore2} / 30</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={rubricScore2}
                    onChange={(e) => setRubricScore2(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">3. Error Handling & Circuit Breakers</span>
                    <span className="font-mono font-bold text-emerald-700">{rubricScore3} / 30</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={rubricScore3}
                    onChange={(e) => setRubricScore3(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Total Score Summary */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Calculated Final Score:</span>
                <span className="text-xl font-extrabold font-mono text-emerald-700">
                  {rubricScore1 + rubricScore2 + rubricScore3} / 100
                </span>
              </div>

              {/* Faculty Feedback Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Qualitative Faculty Feedback & Advice</label>
                <textarea
                  rows={4}
                  value={facultyFeedback}
                  onChange={(e) => setFacultyFeedback(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-200 bg-white text-slate-900"
                  placeholder="Provide constructive feedback on architectural choices..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Release Grade & Notify Student
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Cohort Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Title</label>
                <Input
                  required
                  placeholder="e.g. Lab 4: Hybrid RAG Fusion Pipeline"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Max Score</label>
                  <Input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Due Date</label>
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  Publish Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentsPage;
