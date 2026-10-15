import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  ShieldCheck,
  Search,
  Filter,
  ArrowRightLeft,
  Calendar,
  CreditCard,
  MessageSquare,
  Award,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ApprovalItem {
  id: string;
  type: "access_extension" | "batch_transfer" | "refund_request" | "grade_override";
  title: string;
  requesterName: string;
  requesterRole: string;
  studentName: string;
  details: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  auditReason?: string;
}

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: "app-101",
    type: "access_extension",
    title: "1-Month Recording Access Extension",
    requesterName: "Nikhil Joshi",
    requesterRole: "Support Mentor",
    studentName: "Arjun Mehta",
    details: "Learner had hospital leave during Week 4. Requested extension to complete Capstone project.",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "app-102",
    type: "batch_transfer",
    title: "Batch Move from Cohort 7 to Cohort 8",
    requesterName: "Ananya Iyer",
    requesterRole: "Operations Admin",
    studentName: "Sneha Kapur",
    details: "Relocating time-zone shift (IST to PST) prevents synchronous live attendance.",
    submittedAt: "Yesterday",
    status: "pending",
  },
  {
    id: "app-103",
    type: "grade_override",
    title: "Grade Moderation (+3 Marks Rubric Correction)",
    requesterName: "Kavita Rao",
    requesterRole: "Lead Evaluator",
    studentName: "Rohan Nair",
    details: "Student contested rubric criterion 2 (LoRA rank selection code review). Verified valid implementation.",
    submittedAt: "2 days ago",
    status: "pending",
  },
  {
    id: "app-104",
    type: "refund_request",
    title: "Partial Prorated Refund (₹15,000)",
    requesterName: "Nikhil Joshi",
    requesterRole: "Support Mentor",
    studentName: "Vikramaditya Roy",
    details: "Student company sponsored duplicate seat. Requesting refund for personal credit transaction.",
    submittedAt: "3 days ago",
    status: "pending",
  },
];

interface TeacherTestItem {
  id: string;
  title: string;
  courseTitle: string;
  instructorName: string;
  type: "capstone" | "quiz" | "coding_lab";
  totalQuestions: number;
  maxScore: number;
  submissionsCount: number;
  evaluatedCount: number;
  status: "published" | "draft" | "grading_in_progress";
}

const TEACHER_TESTS: TeacherTestItem[] = [
  {
    id: "test-1",
    title: "Lab 4: Fine-Tuning Llama-3-8B with LoRA & Unsloth",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    instructorName: "Prof. Rajesh Verma",
    type: "coding_lab",
    totalQuestions: 6,
    maxScore: 100,
    submissionsCount: 92,
    evaluatedCount: 88,
    status: "grading_in_progress",
  },
  {
    id: "test-2",
    title: "Capstone 1: Autonomous Multi-Agent Swarms with LangGraph",
    courseTitle: "Autonomous Multi-Agent Architectures",
    instructorName: "Prof. Rajesh Verma",
    type: "capstone",
    totalQuestions: 4,
    maxScore: 100,
    submissionsCount: 64,
    evaluatedCount: 64,
    status: "published",
  },
  {
    id: "test-3",
    title: "Mid-Term Quiz: Attention Mechanisms & Latent Diffusion",
    courseTitle: "Diffusion Models & Generative Vision",
    instructorName: "Dr. Meera Swaminathan",
    type: "quiz",
    totalQuestions: 25,
    maxScore: 50,
    submissionsCount: 110,
    evaluatedCount: 110,
    status: "published",
  },
];

export const AssessmentApprovalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"approvals" | "tests">("approvals");
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [auditReason, setAuditReason] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  const handleOpenAction = (item: ApprovalItem, type: "approve" | "reject") => {
    setSelectedApproval(item);
    setActionType(type);
    setAuditReason("");
    setActionModalOpen(true);
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval || !auditReason) return;

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === selectedApproval.id
          ? {
              ...a,
              status: actionType === "approve" ? "approved" : "rejected",
              auditReason,
            }
          : a
      )
    );

    setActionModalOpen(false);
    setToastMsg(
      `${actionType === "approve" ? "Approved" : "Rejected"} ${selectedApproval.title} for ${selectedApproval.studentName}.`
    );
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-primary" /> Assessment Oversight & Approval Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Operational review of tests created by faculty, grade overrides, batch moves, access extensions, and refund approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {toastMsg && (
            <Badge variant="success" className="text-xs py-1 px-2.5 gap-1 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> {toastMsg}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs font-mono py-1 px-2.5">
            {pendingCount} Pending Approvals
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("approvals")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "approvals"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Clock className="h-3.5 w-3.5" /> Operational Approval Queue ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tests")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "tests"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Award className="h-3.5 w-3.5" /> Teacher Assessments & Quizzes ({TEACHER_TESTS.length})
        </button>
      </div>

      {/* TAB 1: OPERATIONAL APPROVAL QUEUE */}
      {activeTab === "approvals" && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/80 bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Request Type & Action</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Requested By</th>
                    <th className="py-3 px-4">Justification & Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Review Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {approvals.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/15 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {item.type === "access_extension" && <Calendar className="h-4 w-4 text-primary shrink-0" />}
                          {item.type === "batch_transfer" && <ArrowRightLeft className="h-4 w-4 text-primary shrink-0" />}
                          {item.type === "grade_override" && <Award className="h-4 w-4 text-primary shrink-0" />}
                          {item.type === "refund_request" && <CreditCard className="h-4 w-4 text-amber-500 shrink-0" />}
                          <div>
                            <p className="font-bold text-foreground text-xs">{item.title}</p>
                            <span className="text-[10px] font-mono text-muted-foreground">{item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {item.studentName}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-foreground">{item.requesterName}</p>
                        <p className="text-[10px] text-muted-foreground">{item.requesterRole}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-muted-foreground max-w-sm line-clamp-2 leading-relaxed">
                          {item.details}
                        </p>
                        {item.auditReason && (
                          <p className="text-[10px] text-primary mt-0.5">
                            <strong>Audit note:</strong> {item.auditReason}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            item.status === "approved"
                              ? "success"
                              : item.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-[10px] capitalize font-semibold"
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAction(item, "reject")}
                              className="h-7 text-xs font-semibold text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOpenAction(item, "approve")}
                              className="h-7 text-xs font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Approve
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-medium">
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: TEACHER ASSESSMENTS OVERSIGHT */}
      {activeTab === "tests" && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/80 bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Assessment Title</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Authoring Faculty</th>
                    <th className="py-3 px-4">Format & Max Score</th>
                    <th className="py-3 px-4">Evaluation Progress</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {TEACHER_TESTS.map((test) => (
                    <tr key={test.id} className="hover:bg-muted/15 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground text-xs">
                        {test.title}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {test.courseTitle}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {test.instructorName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {test.totalQuestions} questions · {test.maxScore} pts
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground">
                          {test.evaluatedCount} / {test.submissionsCount}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-1">
                          ({Math.round((test.evaluatedCount / test.submissionsCount) * 100)}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={test.status === "published" ? "success" : "default"}
                          className="text-[10px] capitalize font-semibold"
                        >
                          {test.status.replace("_", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Decision Authorization Modal */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {actionType === "approve" ? "Authorize Operational Change" : "Reject Operational Request"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm {actionType} for <strong>{selectedApproval?.title}</strong> for student {selectedApproval?.studentName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmAction} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Mandatory Operational Audit Reason *
              </label>
              <Input
                required
                placeholder="e.g. Verified medical certificate and authorized 30-day access extension"
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActionModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className={`text-xs font-bold ${
                  actionType === "approve"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                }`}
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
