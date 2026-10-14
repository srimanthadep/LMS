import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Search, Plus, Eye, Clock, ArrowRightLeft } from "lucide-react";
import { Student360Drawer } from "@/components/shared/Student360Drawer";
import { useNotifications } from "@/context/NotificationContext";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  enrolledCourse: string;
  enrolledBatch: string;
  accessType: "live_and_replay" | "replay_only";
  validityExpiry: string;
  attendancePercent: number;
}

const SAMPLE_STUDENTS: StudentRecord[] = [
  {
    id: "usr-student-1",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    enrolledCourse: "Full-Stack AI & LLM Systems Engineering",
    enrolledBatch: "Cohort 7 (Live + Replay)",
    accessType: "live_and_replay",
    validityExpiry: "31 Dec 2026",
    attendancePercent: 88,
  },
  {
    id: "usr-student-2",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    enrolledCourse: "Autonomous Multi-Agent Architectures",
    enrolledBatch: "Agentic Systems Bootcamp",
    accessType: "live_and_replay",
    validityExpiry: "15 Jan 2027",
    attendancePercent: 92,
  },
  {
    id: "usr-student-3",
    name: "Devendra Patel",
    email: "dev.patel@tech.in",
    enrolledCourse: "Full-Stack AI & LLM Systems Engineering",
    enrolledBatch: "Cohort 8 (Replay Only)",
    accessType: "replay_only",
    validityExpiry: "31 Mar 2027",
    attendancePercent: 0,
  },
  {
    id: "usr-student-4",
    name: "Simran Kaur",
    email: "simran.k@example.com",
    enrolledCourse: "Full-Stack AI & LLM Systems Engineering",
    enrolledBatch: "Cohort 8 (Replay Only)",
    accessType: "replay_only",
    validityExpiry: "31 Mar 2027",
    attendancePercent: 0,
  },
];

export const StudentsDirectoryPage: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(SAMPLE_STUDENTS);
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addNotification } = useNotifications();

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.enrolledBatch.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen360 = (id: string) => {
    setSelectedStudentId(id);
    setDrawerOpen(true);
  };

  const handleQuickExtend = (id: string, name: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, validityExpiry: "30 Jan 2027" } : s))
    );
    addNotification({
      title: "Validity Extended",
      message: `Access validity for ${name} extended to 30 Jan 2027.`,
      type: "system",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" /> Student & Learner Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Cohort memberships, batch entitlements, attendance tracking, and validity management.
            </p>
          </div>

          <Button size="sm" className="text-xs h-9 font-bold gap-1 shadow-sm shrink-0">
            <Plus className="h-3.5 w-3.5" /> Direct Enrollment
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or cohort..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
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
                  variant={s.accessType === "live_and_replay" ? "accent" : "warning"}
                  className="text-[10px] font-bold"
                >
                  {s.accessType === "live_and_replay" ? "Live + Replay" : "Replay Only"}
                </Badge>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Cohort: <strong>{s.enrolledBatch}</strong></p>
                <p>Attendance: <strong className="text-emerald-600">{s.attendancePercent}%</strong></p>
                <p>Valid Until: <strong>{s.validityExpiry}</strong></p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpen360(s.id)}
                  className="flex-1 h-8 text-xs font-semibold gap-1"
                >
                  <Eye className="h-3 w-3" /> Student 360
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
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 pl-5">Student</th>
                <th className="p-3.5">Enrolled Cohort</th>
                <th className="p-3.5">Entitlement Tier</th>
                <th className="p-3.5 text-center">Attendance %</th>
                <th className="p-3.5">Access Expiry</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 pl-5">
                    <p className="font-bold text-foreground text-sm">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{s.email}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-foreground">{s.enrolledBatch}</td>
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
                  <td className="p-3.5 text-muted-foreground font-medium">{s.validityExpiry}</td>
                  <td className="p-3.5 pr-5 text-right space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpen360(s.id)}
                      className="h-8 text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
                    >
                      <Eye className="h-3 w-3" /> Student 360
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleQuickExtend(s.id, s.name)}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Extend +30d
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student 360 Slide-over */}
        <Student360Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          studentId={selectedStudentId || undefined}
        />
      </div>
    </DashboardLayout>
  );
};
