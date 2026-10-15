import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Video,
  Calendar,
  Star,
  Plus,
  Search,
  Edit2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  BookOpen,
  Layers,
  Clock,
  Award,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  roleType: "lead" | "co-teacher";
  assignedCourses: string[];
  assignedBatches: string[];
  scheduledHoursThisWeek: number;
  totalClassesDelivered: number;
  rating: number;
  avatar: string;
  status: "active" | "on-leave" | "suspended";
  hasScheduleConflict: boolean;
  attendanceAvgPercent: number;
}

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "t-1",
    name: "Dr. Rajesh Verma",
    email: "rajesh.verma@apex.ai",
    phone: "+91 98765 22001",
    specialization: "LLM Systems, Agentic Architectures & RAG",
    roleType: "lead",
    assignedCourses: ["Full-Stack AI & LLM Systems Engineering"],
    assignedBatches: ["Batch 2026-A (Weekend)", "Batch 2026-B (Weekday)"],
    scheduledHoursThisWeek: 8,
    totalClassesDelivered: 42,
    rating: 4.95,
    avatar: "RV",
    status: "active",
    hasScheduleConflict: false,
    attendanceAvgPercent: 94,
  },
  {
    id: "t-2",
    name: "Dr. Meera Swaminathan",
    email: "meera.s@apex.ai",
    phone: "+91 98765 22002",
    specialization: "Diffusion Models & Computer Vision",
    roleType: "lead",
    assignedCourses: ["Autonomous Multi-Agent Architectures"],
    assignedBatches: ["Agentic Systems Bootcamp"],
    scheduledHoursThisWeek: 4,
    totalClassesDelivered: 28,
    rating: 4.91,
    avatar: "MS",
    status: "active",
    hasScheduleConflict: false,
    attendanceAvgPercent: 91,
  },
  {
    id: "t-3",
    name: "Er. Karthik Iyer",
    email: "karthik.i@apex.ai",
    phone: "+91 98765 22003",
    specialization: "MLOps, Kubernetes GPU & Vector Indexing",
    roleType: "co-teacher",
    assignedCourses: ["Full-Stack AI & LLM Systems Engineering"],
    assignedBatches: ["Batch 2026-A (Weekend)"],
    scheduledHoursThisWeek: 6,
    totalClassesDelivered: 35,
    rating: 4.88,
    avatar: "KI",
    status: "active",
    hasScheduleConflict: false,
    attendanceAvgPercent: 89,
  },
  {
    id: "t-4",
    name: "Dr. Ananya Sen",
    email: "ananya.sen@apex.ai",
    phone: "+91 98765 22004",
    specialization: "Fine-Tuning Open Source LLMs & LoRA",
    roleType: "lead",
    assignedCourses: ["Fine-Tuning Open Source LLMs"],
    assignedBatches: ["Fine-Tuning Intensive 2026"],
    scheduledHoursThisWeek: 6,
    totalClassesDelivered: 19,
    rating: 4.96,
    avatar: "AS",
    status: "active",
    hasScheduleConflict: false,
    attendanceAvgPercent: 96,
  },
  {
    id: "t-5",
    name: "Prof. Arvind Raman",
    email: "arvind.r@apex.ai",
    phone: "+91 98765 22005",
    specialization: "AI Evaluation & Prompt Engineering",
    roleType: "co-teacher",
    assignedCourses: ["Autonomous Multi-Agent Architectures"],
    assignedBatches: ["Agentic Systems Bootcamp"],
    scheduledHoursThisWeek: 2,
    totalClassesDelivered: 12,
    rating: 4.82,
    avatar: "AR",
    status: "on-leave",
    hasScheduleConflict: false,
    attendanceAvgPercent: 87,
  },
];

export const TeachersListPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { addNotification } = useNotifications();

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [assignModalTeacher, setAssignModalTeacher] = useState<Teacher | null>(null);

  // New Teacher Form
  const [newTeacherData, setNewTeacherData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    roleType: "lead" as "lead" | "co-teacher",
    assignedCourse: "Full-Stack AI & LLM Systems Engineering",
    assignedBatch: "Batch 2026-A (Weekend)",
  });

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "lead" && t.roleType === "lead") ||
      (roleFilter === "co-teacher" && t.roleType === "co-teacher") ||
      (roleFilter === "active" && t.status === "active") ||
      (roleFilter === "on-leave" && t.status === "on-leave");
    return matchesSearch && matchesRole;
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherData.name || !newTeacherData.email) return;

    const initials = newTeacherData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const created: Teacher = {
      id: `t-${Date.now()}`,
      name: newTeacherData.name,
      email: newTeacherData.email,
      phone: newTeacherData.phone || "+91 99999 00000",
      specialization: newTeacherData.specialization || "AI & Machine Learning",
      roleType: newTeacherData.roleType,
      assignedCourses: [newTeacherData.assignedCourse],
      assignedBatches: [newTeacherData.assignedBatch],
      scheduledHoursThisWeek: 4,
      totalClassesDelivered: 0,
      rating: 5.0,
      avatar: initials,
      status: "active",
      hasScheduleConflict: false,
      attendanceAvgPercent: 100,
    };

    setTeachers([created, ...teachers]);
    setCreateModalOpen(false);
    setNewTeacherData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      roleType: "lead",
      assignedCourse: "Full-Stack AI & LLM Systems Engineering",
      assignedBatch: "Batch 2026-A (Weekend)",
    });
    addNotification({
      title: "Faculty Added",
      message: `${created.name} allocated as ${created.roleType === "lead" ? "Lead Teacher" : "Co-Teacher"}.`,
      type: "system",
    });
  };

  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacher) return;
    setTeachers((prev) => prev.map((t) => (t.id === editTeacher.id ? editTeacher : t)));
    setEditTeacher(null);
    addNotification({
      title: "Profile Updated",
      message: `Faculty record for ${editTeacher.name} saved.`,
      type: "system",
    });
  };

  const toggleTeacherStatus = (id: string, currentStatus: "active" | "on-leave" | "suspended") => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    addNotification({
      title: `Account ${newStatus === "active" ? "Reactivated" : "Suspended"}`,
      message: `Teacher account status updated.`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Teacher Management & Faculty Assignments
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Administer teaching faculty, allocate lead and co-teachers, monitor scheduling conflicts, and review lecture performance.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          className="text-xs h-9 font-bold gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Allocate Faculty
        </Button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Faculty</span>
          <div className="text-lg font-extrabold text-foreground mt-0.5">{teachers.length} Instructors</div>
          <span className="text-[10px] text-primary font-bold">100% Institution Verified</span>
        </div>
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Lead Instructors</span>
          <div className="text-lg font-extrabold text-foreground mt-0.5">
            {teachers.filter((t) => t.roleType === "lead").length} Assigned
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Primary Syllabus Ownership</span>
        </div>
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Co-Teachers & TAs</span>
          <div className="text-lg font-extrabold text-foreground mt-0.5">
            {teachers.filter((t) => t.roleType === "co-teacher").length} Allocated
          </div>
          <span className="text-[10px] text-muted-foreground">Lab & Replay Moderation</span>
        </div>
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Timetable Conflicts</span>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">0 Detected</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Live Rooms Ready</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty by name, domain, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Faculty" },
            { id: "lead", label: "Lead Teachers" },
            { id: "co-teacher", label: "Co-Teachers" },
            { id: "active", label: "Active" },
            { id: "on-leave", label: "On Leave" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium border ${
                roleFilter === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border/70 hover:bg-muted/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((t) => (
          <Card key={t.id} className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base ring-2 ring-primary/20 shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-foreground truncate">{t.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                  <p className="text-[11px] text-primary font-semibold truncate mt-0.5">{t.specialization}</p>
                </div>
              </div>

              <Badge
                variant={t.roleType === "lead" ? "default" : "outline"}
                className="text-[9px] uppercase font-bold shrink-0"
              >
                {t.roleType === "lead" ? "Lead" : "Co-Teacher"}
              </Badge>
            </div>

            {/* Assignments Summary */}
            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50 text-xs space-y-1">
              <div className="text-[10px] text-muted-foreground font-semibold uppercase">Assigned Batches</div>
              <div className="flex flex-wrap gap-1">
                {t.assignedBatches.map((b, i) => (
                  <span key={i} className="text-[10px] bg-card px-2 py-0.5 rounded border border-border font-medium text-foreground">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/60">
              <div className="p-2 rounded-xl bg-muted/15 text-center">
                <span className="text-[10px] text-muted-foreground block">Weekly Load</span>
                <strong className="text-foreground font-mono">{t.scheduledHoursThisWeek}h</strong>
              </div>
              <div className="p-2 rounded-xl bg-muted/15 text-center">
                <span className="text-[10px] text-muted-foreground block">Classes</span>
                <strong className="text-foreground font-mono">{t.totalClassesDelivered}</strong>
              </div>
              <div className="p-2 rounded-xl bg-muted/15 text-center">
                <span className="text-[10px] text-muted-foreground block">Attendance</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{t.attendanceAvgPercent}%</strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
              <span className="flex items-center gap-1 font-bold text-foreground">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {t.rating} / 5.0
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTeacher(t)}
                  className="h-7 text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Eye className="h-3 w-3" /> Profile
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditTeacher(t)}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE TEACHER MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Plus className="h-5 w-5 text-primary" /> Allocate New Faculty
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign an instructor to academic courses and live cohorts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Faculty Full Name</label>
              <Input
                placeholder="Dr. Full Name"
                value={newTeacherData.name}
                onChange={(e) => setNewTeacherData({ ...newTeacherData, name: e.target.value })}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Official Email</label>
              <Input
                type="email"
                placeholder="faculty@apex.ai"
                value={newTeacherData.email}
                onChange={(e) => setNewTeacherData({ ...newTeacherData, email: e.target.value })}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Phone Number</label>
              <Input
                placeholder="+91 98765 00000"
                value={newTeacherData.phone}
                onChange={(e) => setNewTeacherData({ ...newTeacherData, phone: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Specialization Domain</label>
              <Input
                placeholder="e.g. Distributed Training, Agentic RAG"
                value={newTeacherData.specialization}
                onChange={(e) => setNewTeacherData({ ...newTeacherData, specialization: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-foreground">Role Allocation</label>
                <select
                  value={newTeacherData.roleType}
                  onChange={(e) =>
                    setNewTeacherData({
                      ...newTeacherData,
                      roleType: e.target.value as "lead" | "co-teacher",
                    })
                  }
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="lead">Lead Teacher</option>
                  <option value="co-teacher">Co-Teacher</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-foreground">Assign Cohort</label>
                <select
                  value={newTeacherData.assignedBatch}
                  onChange={(e) => setNewTeacherData({ ...newTeacherData, assignedBatch: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="Batch 2026-A (Weekend)">Batch 2026-A (Weekend)</option>
                  <option value="Batch 2026-B (Weekday)">Batch 2026-B (Weekday)</option>
                  <option value="Agentic Systems Bootcamp">Agentic Systems Bootcamp</option>
                  <option value="Fine-Tuning Intensive 2026">Fine-Tuning Intensive 2026</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-border/60">
              <Button type="button" size="sm" variant="outline" onClick={() => setCreateModalOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-bold px-4">
                Allocate Instructor
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT TEACHER MODAL */}
      <Dialog open={!!editTeacher} onOpenChange={(open) => !open && setEditTeacher(null)}>
        {editTeacher && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Edit2 className="h-5 w-5 text-primary" /> Edit Faculty Profile
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update instructor profile, specialization, and role assignment.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateTeacher} className="space-y-3 text-xs pt-2">
              <div>
                <label className="font-semibold text-foreground">Full Name</label>
                <Input
                  value={editTeacher.name}
                  onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Specialization</label>
                <Input
                  value={editTeacher.specialization}
                  onChange={(e) => setEditTeacher({ ...editTeacher, specialization: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-foreground">Role Type</label>
                  <select
                    value={editTeacher.roleType}
                    onChange={(e) =>
                      setEditTeacher({
                        ...editTeacher,
                        roleType: e.target.value as "lead" | "co-teacher",
                      })
                    }
                    className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="lead">Lead Teacher</option>
                    <option value="co-teacher">Co-Teacher</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Status</label>
                  <select
                    value={editTeacher.status}
                    onChange={(e) =>
                      setEditTeacher({
                        ...editTeacher,
                        status: e.target.value as "active" | "on-leave" | "suspended",
                      })
                    }
                    className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border/60">
                <Button type="button" size="sm" variant="outline" onClick={() => setEditTeacher(null)} className="h-8 text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs font-bold px-4">
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* TEACHER PROFILE & PERFORMANCE INSPECTION MODAL */}
      <Dialog open={!!selectedTeacher} onOpenChange={(open) => !open && setSelectedTeacher(null)}>
        {selectedTeacher && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Users className="h-5 w-5 text-primary" /> Faculty Academic Profile & Performance
              </DialogTitle>
              <DialogDescription className="text-xs">
                Review teaching commitments, student evaluation scores, and timetable availability.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                  {selectedTeacher.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selectedTeacher.name}</h4>
                  <p className="text-xs text-muted-foreground">{selectedTeacher.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selectedTeacher.roleType === "lead" ? "default" : "outline"} className="text-[9px]">
                      {selectedTeacher.roleType === "lead" ? "Lead Instructor" : "Co-Teacher"}
                    </Badge>
                    <Badge variant="success" className="text-[9px]">
                      {selectedTeacher.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Schedule Availability Check */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                <CalendarCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">Timetable Conflict Engine: Clean</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    No overlapping lecture commitments across active cohorts. Minimum 1-hour buffer maintained between sessions.
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Student Rating</div>
                  <div className="text-base font-extrabold text-foreground mt-0.5 flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {selectedTeacher.rating}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Lectures Delivered</div>
                  <div className="text-base font-extrabold text-foreground mt-0.5 font-mono">
                    {selectedTeacher.totalClassesDelivered}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border/60 bg-card text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Cohort Attendance</div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                    {selectedTeacher.attendanceAvgPercent}%
                  </div>
                </div>
              </div>

              {/* Assigned Batches */}
              <div>
                <label className="font-semibold text-foreground">Cohort Responsibilities</label>
                <div className="mt-1 space-y-1.5">
                  {selectedTeacher.assignedBatches.map((b, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-border/70 bg-card flex items-center justify-between">
                      <span className="font-bold text-foreground">{b}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {selectedTeacher.roleType === "lead" ? "Primary Evaluator" : "Assistant"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => setSelectedTeacher(null)} className="h-8 text-xs font-bold px-4">
                  Close Profile
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
