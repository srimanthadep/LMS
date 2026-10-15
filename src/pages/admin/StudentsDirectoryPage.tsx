import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Search,
  Plus,
  Eye,
  Clock,
  ArrowRightLeft,
  Download,
  Edit2,
  Trash2,
  RotateCcw,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Check,
} from "lucide-react";
import { Student360Drawer } from "@/components/shared/Student360Drawer";
import { useNotifications } from "@/context/NotificationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledCourse: string;
  enrolledBatch: string;
  accessType: "live_and_replay" | "replay_only";
  validityExpiry: string;
  attendancePercent: number;
  status: "active" | "suspended" | "archived";
  consentRecorded: boolean;
  enrollmentDate: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "usr-student-1",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    phone: "+91 98765 11001",
    enrolledCourse: "Full-Stack AI & LLM Systems Engineering",
    enrolledBatch: "Batch 2026-A (Weekend)",
    accessType: "live_and_replay",
    validityExpiry: "2026-12-31",
    attendancePercent: 88,
    status: "active",
    consentRecorded: true,
    enrollmentDate: "2026-08-15",
  },
  {
    id: "usr-student-2",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    phone: "+91 98765 11002",
    enrolledCourse: "Autonomous Multi-Agent Architectures",
    enrolledBatch: "Agentic Systems Bootcamp",
    accessType: "live_and_replay",
    validityExpiry: "2027-01-15",
    attendancePercent: 92,
    status: "active",
    consentRecorded: true,
    enrollmentDate: "2026-09-01",
  },
  {
    id: "usr-student-3",
    name: "Devendra Patel",
    email: "dev.patel@tech.in",
    phone: "+91 98765 11003",
    enrolledCourse: "Full-Stack AI & LLM Systems Engineering",
    enrolledBatch: "Batch 2026-B (Weekday)",
    accessType: "replay_only",
    validityExpiry: "2027-03-31",
    attendancePercent: 0,
    status: "active",
    consentRecorded: true,
    enrollmentDate: "2026-09-10",
  },
  {
    id: "usr-student-4",
    name: "Simran Kaur",
    email: "simran.k@example.com",
    phone: "+91 98765 11004",
    enrolledCourse: "Fine-Tuning Open Source LLMs",
    enrolledBatch: "Fine-Tuning Intensive 2026",
    accessType: "replay_only",
    validityExpiry: "2027-03-31",
    attendancePercent: 0,
    status: "suspended",
    consentRecorded: true,
    enrollmentDate: "2026-09-12",
  },
  {
    id: "usr-student-5",
    name: "Vikram Singhania",
    email: "vikram.s@example.org",
    phone: "+91 98765 11005",
    enrolledCourse: "AI-Native Product Management",
    enrolledBatch: "Product Leadership Cohort 1",
    accessType: "live_and_replay",
    validityExpiry: "2026-11-30",
    attendancePercent: 74,
    status: "active",
    consentRecorded: false,
    enrollmentDate: "2026-07-20",
  },
];

export const StudentsDirectoryPage: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addNotification } = useNotifications();

  // Create Student Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Full-Stack AI & LLM Systems Engineering",
    batch: "Batch 2026-A (Weekend)",
    accessType: "live_and_replay" as "live_and_replay" | "replay_only",
    consent: true,
  });

  // Edit Student Modal State
  const [editStudent, setEditStudent] = useState<StudentRecord | null>(null);

  // Batch Transfer Modal State
  const [transferStudent, setTransferStudent] = useState<StudentRecord | null>(null);
  const [targetBatch, setTargetBatch] = useState("Batch 2026-B (Weekday)");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.enrolledBatch.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s.status === "active") ||
      (statusFilter === "suspended" && s.status === "suspended") ||
      (statusFilter === "live" && s.accessType === "live_and_replay") ||
      (statusFilter === "replay" && s.accessType === "replay_only");
    return matchesSearch && matchesStatus;
  });

  const handleOpen360 = (id: string) => {
    setSelectedStudentId(id);
    setDrawerOpen(true);
  };

  const handleQuickExtend = (id: string, name: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, validityExpiry: "2027-04-30" } : s))
    );
    addNotification({
      title: "Validity Extended",
      message: `Access validity for ${name} extended to 30 Apr 2027.`,
      type: "system",
    });
  };

  const toggleStudentStatus = (id: string, currentStatus: "active" | "suspended" | "archived") => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    addNotification({
      title: `Account ${newStatus === "active" ? "Reactivated" : "Suspended"}`,
      message: `Student account status updated to ${newStatus}.`,
      type: "system",
    });
  };

  const handleSoftDelete = (id: string, name: string) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: "archived" } : s)));
    addNotification({
      title: "Student Soft-Deleted",
      message: `${name} has been archived. Data is preserved under retention policies.`,
      type: "system",
    });
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;

    const created: StudentRecord = {
      id: `usr-student-${Date.now()}`,
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone || "+91 99999 00000",
      enrolledCourse: newStudent.course,
      enrolledBatch: newStudent.batch,
      accessType: newStudent.accessType,
      validityExpiry: "2027-06-30",
      attendancePercent: newStudent.accessType === "live_and_replay" ? 100 : 0,
      status: "active",
      consentRecorded: newStudent.consent,
      enrollmentDate: new Date().toISOString().split("T")[0],
    };

    setStudents([created, ...students]);
    setCreateModalOpen(false);
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      course: "Full-Stack AI & LLM Systems Engineering",
      batch: "Batch 2026-A (Weekend)",
      accessType: "live_and_replay",
      consent: true,
    });
    addNotification({
      title: "Student Enrolled",
      message: `${created.name} successfully registered in ${created.enrolledBatch}.`,
      type: "system",
    });
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setStudents((prev) => prev.map((s) => (s.id === editStudent.id ? editStudent : s)));
    setEditStudent(null);
    addNotification({
      title: "Profile Updated",
      message: `Profile data updated for ${editStudent.name}.`,
      type: "system",
    });
  };

  const handleTransferBatch = () => {
    if (!transferStudent) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === transferStudent.id ? { ...s, enrolledBatch: targetBatch } : s))
    );
    addNotification({
      title: "Batch Transfer Complete",
      message: `${transferStudent.name} shifted to ${targetBatch}.`,
      type: "system",
    });
    setTransferStudent(null);
  };

  const exportStudentsCSV = () => {
    const headers = "ID,Name,Email,Phone,Course,Batch,AccessType,AttendancePercent,ExpiryDate,Status\n";
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.email}","${s.phone}","${s.enrolledCourse}","${s.enrolledBatch}","${s.accessType}",${s.attendancePercent},"${s.validityExpiry}","${s.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `student_roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> Student Directory & Learner Records
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Search learners, inspect 360 profiles, administer cohort transfers, manage access validity, and suspend/reactivate accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={exportStudentsCSV}
            className="text-xs h-9 font-bold gap-1.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5" /> Export Roster (CSV)
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs h-9 font-bold gap-1 shadow-xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Create Student
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, email, or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: `All Students (${students.length})` },
            { id: "active", label: "Active" },
            { id: "suspended", label: "Suspended" },
            { id: "live", label: "Live + Replay" },
            { id: "replay", label: "Replay Only" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium border ${
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border/70 hover:bg-muted/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Table: Mobile Cards vs Desktop Table */}
      <div className="sm:hidden space-y-2.5">
        {filteredStudents.map((s) => (
          <div key={s.id} className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2.5">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-bold text-sm text-foreground">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.email}</p>
              </div>
              <Badge
                variant={s.status === "active" ? (s.accessType === "live_and_replay" ? "accent" : "warning") : "destructive"}
                className="text-[10px] font-bold"
              >
                {s.status === "active" ? (s.accessType === "live_and_replay" ? "Live + Replay" : "Replay Only") : "Suspended"}
              </Badge>
            </div>

            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Cohort: <strong className="text-foreground">{s.enrolledBatch}</strong></p>
              <p>Attendance: <strong className="text-emerald-600 dark:text-emerald-400">{s.attendancePercent}%</strong></p>
              <p>Valid Until: <strong className="text-foreground font-mono">{s.validityExpiry}</strong></p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpen360(s.id)}
                className="flex-1 h-8 text-xs font-semibold gap-1"
              >
                <Eye className="h-3 w-3" /> 360
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditStudent(s)}
                className="h-8 text-xs"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTransferStudent(s)}
                className="h-8 text-xs"
              >
                <ArrowRightLeft className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                onClick={() => handleQuickExtend(s.id, s.name)}
                className="h-8 text-xs px-2.5"
              >
                +30d
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 pl-5">Student Learner</th>
                <th className="p-3.5">Enrolled Cohort</th>
                <th className="p-3.5">Entitlement Tier</th>
                <th className="p-3.5 text-center">Attendance %</th>
                <th className="p-3.5">Access Expiry</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No students match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{s.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{s.enrolledBatch}</div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">{s.enrolledCourse}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={s.accessType === "live_and_replay" ? "accent" : "warning"}
                        className="text-[10px] font-bold"
                      >
                        {s.accessType === "live_and_replay" ? "Live + Replay" : "Replay Only"}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {s.attendancePercent > 0 ? `${s.attendancePercent}%` : "N/A (Replay)"}
                    </td>
                    <td className="p-3.5 font-mono text-muted-foreground font-medium">{s.validityExpiry}</td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={s.status === "active" ? "success" : s.status === "suspended" ? "destructive" : "outline"}
                        className="text-[10px] uppercase font-bold"
                      >
                        {s.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpen360(s.id)}
                        className="h-7 text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
                      >
                        <Eye className="h-3 w-3" /> 360
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditStudent(s)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        title="Edit Student"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setTransferStudent(s)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        title="Transfer Batch"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStudentStatus(s.id, s.status)}
                        className={`h-7 text-xs ${
                          s.status === "active" ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"
                        }`}
                        title={s.status === "active" ? "Suspend Account" : "Reactivate Account"}
                      >
                        {s.status === "active" ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleQuickExtend(s.id, s.name)}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        +30d
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE STUDENT MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Plus className="h-5 w-5 text-primary" /> Create & Enroll Student
            </DialogTitle>
            <DialogDescription className="text-xs">
              Directly register a student with academic entitlement configuration.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStudent} className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Full Name</label>
              <Input
                placeholder="Student Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Email Address</label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Phone Number</label>
              <Input
                placeholder="+91 98765 00000"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Assign Cohort Batch</label>
              <select
                value={newStudent.batch}
                onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="Batch 2026-A (Weekend)">Batch 2026-A (Weekend)</option>
                <option value="Batch 2026-B (Weekday)">Batch 2026-B (Weekday)</option>
                <option value="Agentic Systems Bootcamp">Agentic Systems Bootcamp</option>
                <option value="Fine-Tuning Intensive 2026">Fine-Tuning Intensive 2026</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Entitlement Access Tier</label>
              <select
                value={newStudent.accessType}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    accessType: e.target.value as "live_and_replay" | "replay_only",
                  })
                }
                className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="live_and_replay">Live Broadcast + Unlimited Replay</option>
                <option value="replay_only">Replay Only (Delayed Release)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="consentCheck"
                checked={newStudent.consent}
                onChange={(e) => setNewStudent({ ...newStudent, consent: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <label htmlFor="consentCheck" className="text-[11px] text-muted-foreground">
                Record student consent for communications & terms of service
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-border/60">
              <Button type="button" size="sm" variant="outline" onClick={() => setCreateModalOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-bold px-4">
                Enroll Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT STUDENT MODAL */}
      <Dialog open={!!editStudent} onOpenChange={(open) => !open && setEditStudent(null)}>
        {editStudent && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Edit2 className="h-5 w-5 text-primary" /> Edit Student Record
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update personal details, contact information, and access validity.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateStudent} className="space-y-3 text-xs pt-2">
              <div>
                <label className="font-semibold text-foreground">Full Name</label>
                <Input
                  value={editStudent.name}
                  onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Email</label>
                <Input
                  type="email"
                  value={editStudent.email}
                  onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Phone</label>
                <Input
                  value={editStudent.phone}
                  onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Access Validity Expiry Date</label>
                <Input
                  type="date"
                  value={editStudent.validityExpiry}
                  onChange={(e) => setEditStudent({ ...editStudent, validityExpiry: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-border/60">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleSoftDelete(editStudent.id, editStudent.name);
                    setEditStudent(null);
                  }}
                  className="h-8 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Soft Delete
                </Button>

                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditStudent(null)} className="h-8 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="h-8 text-xs font-bold px-4">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* BATCH TRANSFER MODAL */}
      <Dialog open={!!transferStudent} onOpenChange={(open) => !open && setTransferStudent(null)}>
        {transferStudent && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <ArrowRightLeft className="h-5 w-5 text-primary" /> Transfer Student Batch
              </DialogTitle>
              <DialogDescription className="text-xs">
                Move student <span className="font-bold text-foreground">{transferStudent.name}</span> to a different active cohort.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-1">
                <div className="text-muted-foreground text-[11px]">Current Cohort</div>
                <div className="font-bold text-foreground">{transferStudent.enrolledBatch}</div>
                <div className="text-muted-foreground text-[11px]">{transferStudent.enrolledCourse}</div>
              </div>

              <div>
                <label className="font-semibold text-foreground">Select Destination Cohort</label>
                <select
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="Batch 2026-A (Weekend)">Batch 2026-A (Weekend)</option>
                  <option value="Batch 2026-B (Weekday)">Batch 2026-B (Weekday)</option>
                  <option value="Batch 2026-Alpha (FastTrack)">Batch 2026-Alpha (FastTrack)</option>
                  <option value="Agentic Systems Bootcamp">Agentic Systems Bootcamp</option>
                </select>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5 inline mr-1 text-amber-600" />
                This will recalculate attendance records and calendar schedules for the learner.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border/60">
                <Button size="sm" variant="outline" onClick={() => setTransferStudent(null)} className="h-8 text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleTransferBatch} className="h-8 text-xs font-bold px-4">
                  Confirm Transfer
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Student 360 Slide-over */}
      <Student360Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        studentId={selectedStudentId || undefined}
      />
    </div>
  );
};
