import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Search,
  Plus,
  Users,
  Video,
  PlaySquare,
  Clock,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Lock,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockDataService } from "@/services/mockDataService";
import { Batch } from "@/types/lms";

interface EnrollmentRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  batchId: string;
  batchName: string;
  courseTitle: string;
  accessType: "live_and_replay" | "replay_only";
  replayReleaseDelayHours: number;
  enrolledAt: string;
  accessExpiryDate: string;
  status: "active" | "suspended" | "expired";
  lastAccessedAt: string;
}

const INITIAL_ENROLLMENTS: EnrollmentRecord[] = [
  {
    id: "enr-1",
    studentName: "Arjun Mehta",
    studentEmail: "arjun.m@learner.ai",
    batchId: "batch-c7-live",
    batchName: "Cohort 7 (Live Synchronous + Replays)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    accessType: "live_and_replay",
    replayReleaseDelayHours: 0,
    enrolledAt: "01 Sep 2026",
    accessExpiryDate: "31 Dec 2026",
    status: "active",
    lastAccessedAt: "10 mins ago",
  },
  {
    id: "enr-2",
    studentName: "Pooja Hegde",
    studentEmail: "pooja.h@example.com",
    batchId: "batch-c4-agents",
    batchName: "Cohort 4 (Agent Swarms & Planning)",
    courseTitle: "Autonomous Multi-Agent Architectures",
    accessType: "replay_only",
    replayReleaseDelayHours: 24,
    enrolledAt: "15 Aug 2026",
    accessExpiryDate: "15 Dec 2026",
    status: "active",
    lastAccessedAt: "2 hours ago",
  },
  {
    id: "enr-3",
    studentName: "Rohan Nair",
    studentEmail: "rohan.n@tech.com",
    batchId: "batch-c7-live",
    batchName: "Cohort 7 (Live Synchronous + Replays)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    accessType: "live_and_replay",
    replayReleaseDelayHours: 0,
    enrolledAt: "05 Sep 2026",
    accessExpiryDate: "31 Dec 2026",
    status: "active",
    lastAccessedAt: "Yesterday",
  },
  {
    id: "enr-4",
    studentName: "Sneha Kapur",
    studentEmail: "sneha.k@vision.ai",
    batchId: "batch-c2-diffusion",
    batchName: "Cohort 2 (Latent Synthesis)",
    courseTitle: "Diffusion Models & Generative Vision",
    accessType: "replay_only",
    replayReleaseDelayHours: 48,
    enrolledAt: "01 Jul 2026",
    accessExpiryDate: "31 Oct 2026",
    status: "active",
    lastAccessedAt: "3 days ago",
  },
  {
    id: "enr-5",
    studentName: "Vikramaditya Roy",
    studentEmail: "vikram.roy@enterprise.com",
    batchId: "batch-c7-live",
    batchName: "Cohort 7 (Live Synchronous + Replays)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    accessType: "replay_only",
    replayReleaseDelayHours: 12,
    enrolledAt: "10 Jun 2026",
    accessExpiryDate: "15 Sep 2026",
    status: "expired",
    lastAccessedAt: "1 month ago",
  },
];

export const EnrollmentAccessPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>(INITIAL_ENROLLMENTS);
  const [batches] = useState<Batch[]>(mockDataService.getBatches());
  const [search, setSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentRecord | null>(null);

  // New Enrollment Form State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newBatchId, setNewBatchId] = useState(batches[0]?.id || "");
  const [newAccessType, setNewAccessType] = useState<"live_and_replay" | "replay_only">("live_and_replay");
  const [newDelayHours, setNewDelayHours] = useState("0");
  const [newExpiryDate, setNewExpiryDate] = useState("2026-12-31");

  // Move Batch State
  const [targetBatchId, setTargetBatchId] = useState(batches[0]?.id || "");
  const [moveReason, setMoveReason] = useState("");

  // Extend Access State
  const [extendedExpiryDate, setExtendedExpiryDate] = useState("2027-03-31");
  const [extensionReason, setExtensionReason] = useState("");

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const filteredEnrollments = enrollments.filter((enr) => {
    const matchesQuery =
      enr.studentName.toLowerCase().includes(search.toLowerCase()) ||
      enr.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      enr.batchName.toLowerCase().includes(search.toLowerCase());
    const matchesAccess = accessFilter === "all" || enr.accessType === accessFilter;
    const matchesStatus = statusFilter === "all" || enr.status === statusFilter;
    return matchesQuery && matchesAccess && matchesStatus;
  });

  const handleCreateEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    const chosenBatch = batches.find((b) => b.id === newBatchId) || batches[0];
    const newRecord: EnrollmentRecord = {
      id: `enr-${Date.now()}`,
      studentName: newStudentName,
      studentEmail: newStudentEmail,
      batchId: chosenBatch.id,
      batchName: chosenBatch.name,
      courseTitle: chosenBatch.courseTitle,
      accessType: newAccessType,
      replayReleaseDelayHours: parseInt(newDelayHours) || 0,
      enrolledAt: "Today",
      accessExpiryDate: newExpiryDate,
      status: "active",
      lastAccessedAt: "Just now",
    };

    setEnrollments([newRecord, ...enrollments]);
    setEnrollModalOpen(false);
    setNewStudentName("");
    setNewStudentEmail("");
    showNotification(`Enrolled ${newStudentName} into ${chosenBatch.cohortCode}`);
  };

  const handleMoveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollment || !targetBatchId) return;

    const targetBatch = batches.find((b) => b.id === targetBatchId);
    if (!targetBatch) return;

    setEnrollments((prev) =>
      prev.map((item) =>
        item.id === selectedEnrollment.id
          ? {
              ...item,
              batchId: targetBatch.id,
              batchName: targetBatch.name,
              courseTitle: targetBatch.courseTitle,
            }
          : item
      )
    );

    setMoveModalOpen(false);
    showNotification(`Transferred ${selectedEnrollment.studentName} to ${targetBatch.cohortCode}`);
  };

  const handleExtendAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollment) return;

    setEnrollments((prev) =>
      prev.map((item) =>
        item.id === selectedEnrollment.id
          ? {
              ...item,
              accessExpiryDate: extendedExpiryDate,
              status: "active",
            }
          : item
      )
    );

    setExtendModalOpen(false);
    showNotification(`Access extended for ${selectedEnrollment.studentName} until ${extendedExpiryDate}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Enrollment & Access Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure Live + Replay entitlements, recording release delays, batch transfers, and access expiry dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notificationMsg && (
            <Badge variant="success" className="text-xs py-1 px-2.5 gap-1 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> {notificationMsg}
            </Badge>
          )}
          <Button
            size="sm"
            onClick={() => setEnrollModalOpen(true)}
            className="text-xs h-9 font-bold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Enroll Student
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by student, email, cohort..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9 bg-card"
            />
          </div>

          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
            className="text-xs h-9 px-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Access Tiers</option>
            <option value="live_and_replay">Live + Replay Tier</option>
            <option value="replay_only">Replay Only Tier</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs h-9 px-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          Showing <strong>{filteredEnrollments.length}</strong> of {enrollments.length} active enrollments
        </div>
      </div>

      {/* Enrollments Table */}
      <Card className="rounded-2xl border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Student & Contact</th>
                <th className="py-3 px-4">Assigned Cohort</th>
                <th className="py-3 px-4">Access Tier</th>
                <th className="py-3 px-4">Recording Delay</th>
                <th className="py-3 px-4">Access Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredEnrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-muted/15 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-foreground text-xs">{enr.studentName}</p>
                    <p className="text-[11px] text-muted-foreground">{enr.studentEmail}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-foreground text-xs">{enr.batchName}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-xs">{enr.courseTitle}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={enr.accessType === "live_and_replay" ? "default" : "secondary"}
                      className="text-[10px] gap-1 font-semibold"
                    >
                      {enr.accessType === "live_and_replay" ? (
                        <>
                          <Video className="h-3 w-3" /> Live + Replay
                        </>
                      ) : (
                        <>
                          <PlaySquare className="h-3 w-3" /> Replay Only
                        </>
                      )}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">
                      {enr.replayReleaseDelayHours === 0
                        ? "Instant (0h)"
                        : `+${enr.replayReleaseDelayHours}h Delay`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground text-xs">{enr.accessExpiryDate}</p>
                    <p className="text-[10px] text-muted-foreground">Enrolled: {enr.enrolledAt}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        enr.status === "active"
                          ? "success"
                          : enr.status === "expired"
                          ? "warning"
                          : "destructive"
                      }
                      className="text-[10px] capitalize"
                    >
                      {enr.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedEnrollment(enr);
                          setTargetBatchId(enr.batchId);
                          setMoveModalOpen(true);
                        }}
                        className="h-7 text-xs px-2 gap-1 font-medium hover:bg-muted/50 cursor-pointer"
                        title="Move to another batch"
                      >
                        <ArrowRightLeft className="h-3 w-3 text-muted-foreground" /> Move
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedEnrollment(enr);
                          setExtendedExpiryDate(enr.accessExpiryDate);
                          setExtendModalOpen(true);
                        }}
                        className="h-7 text-xs px-2 gap-1 font-medium text-primary hover:bg-primary/10 cursor-pointer"
                        title="Extend learning validity"
                      >
                        <Calendar className="h-3 w-3" /> Extend
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL 1: ENROLL STUDENT */}
      <Dialog open={enrollModalOpen} onOpenChange={setEnrollModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Enroll Student into Cohort
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign a learner to an authorized batch and set specific learning entitlements.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEnrollment} className="space-y-3.5 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Student Full Name *
              </label>
              <Input
                required
                placeholder="e.g. Ananya Sen"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Student Email Address *
              </label>
              <Input
                type="email"
                required
                placeholder="ananya.sen@example.com"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Target Batch / Cohort *
              </label>
              <select
                value={newBatchId}
                onChange={(e) => setNewBatchId(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.enrolledCount}/{b.maxSeats} seats)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Access Entitlement Tier
                </label>
                <select
                  value={newAccessType}
                  onChange={(e) => setNewAccessType(e.target.value as any)}
                  className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="live_and_replay">Live + Replay Tier</option>
                  <option value="replay_only">Replay Only Tier</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Recording Release Delay
                </label>
                <select
                  value={newDelayHours}
                  onChange={(e) => setNewDelayHours(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="0">Instant (0 Hours)</option>
                  <option value="12">12 Hours Delay</option>
                  <option value="24">24 Hours Delay</option>
                  <option value="48">48 Hours Delay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Access Expiry Date *
              </label>
              <Input
                type="date"
                required
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEnrollModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Confirm & Enroll
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: MOVE STUDENT (BATCH TRANSFER) */}
      <Dialog open={moveModalOpen} onOpenChange={setMoveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" /> Transfer Student to Another Batch
            </DialogTitle>
            <DialogDescription className="text-xs">
              Moving <strong>{selectedEnrollment?.studentName}</strong> from {selectedEnrollment?.batchName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMoveBatch} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Destination Cohort / Batch *
              </label>
              <select
                value={targetBatchId}
                onChange={(e) => setTargetBatchId(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.courseTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Transfer Authorization Reason *
              </label>
              <Input
                required
                placeholder="e.g. Schedule clash requested by student via ticket #902"
                value={moveReason}
                onChange={(e) => setMoveReason(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMoveModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Transfer Batch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: EXTEND ACCESS */}
      <Dialog open={extendModalOpen} onOpenChange={setExtendModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Extend Learning Access Validity
            </DialogTitle>
            <DialogDescription className="text-xs">
              Extend access for <strong>{selectedEnrollment?.studentName}</strong> beyond current expiry ({selectedEnrollment?.accessExpiryDate}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleExtendAccess} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                New Access Expiry Date *
              </label>
              <Input
                type="date"
                required
                value={extendedExpiryDate}
                onChange={(e) => setExtendedExpiryDate(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Approval Justification *
              </label>
              <Input
                required
                placeholder="e.g. Medical extension approved by academic coordinator"
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExtendModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Authorize Extension
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
