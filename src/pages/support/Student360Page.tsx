import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Student360Drawer } from "@/components/shared/Student360Drawer";

interface LearnerSummary {
  id: string;
  name: string;
  email: string;
  enrolledBatch: string;
  courseTitle: string;
  progressPercent: number;
  attendancePercent: number;
  doubtsAsked: number;
  status: "active" | "at_risk" | "paused";
}

const LEARNERS: LearnerSummary[] = [
  {
    id: "usr-student-1",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    enrolledBatch: "Cohort 7 (Live + Replay)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    progressPercent: 78,
    attendancePercent: 92,
    doubtsAsked: 4,
    status: "active",
  },
  {
    id: "usr-student-2",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    enrolledBatch: "Agentic Systems Bootcamp",
    courseTitle: "Autonomous Multi-Agent Architectures",
    progressPercent: 85,
    attendancePercent: 88,
    doubtsAsked: 2,
    status: "active",
  },
  {
    id: "usr-student-3",
    name: "Rohan Nair",
    email: "rohan.n@tech.io",
    enrolledBatch: "Cohort 7 (Live + Replay)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    progressPercent: 62,
    attendancePercent: 75,
    doubtsAsked: 3,
    status: "active",
  },
  {
    id: "usr-student-5",
    name: "Simran Kaur",
    email: "simran.k@example.com",
    enrolledBatch: "Cohort 8 (Replay Only)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    progressPercent: 44,
    attendancePercent: 60,
    doubtsAsked: 1,
    status: "at_risk",
  },
];

export const Student360Page: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);

  const filtered = LEARNERS.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.enrolledBatch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Student 360° Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Inspect learner attendance, lecture progress, submitted doubts, and academic entitlements.
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search learner by name, email, or cohort..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Displaying {filtered.length} of {LEARNERS.length} enrolled students
          </span>
        </CardContent>
      </Card>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((learner) => (
          <Card key={learner.id} className="hover:border-primary/40 transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">{learner.name}</h3>
                    {learner.status === "active" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        At-Risk
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{learner.email}</p>
                  <p className="text-xs text-primary font-medium mt-1">{learner.enrolledBatch}</p>
                </div>

                <Button
                  size="sm"
                  onClick={() => setSelectedStudent({ id: learner.id, name: learner.name })}
                  className="gap-1.5 text-xs bg-primary text-primary-foreground"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View 360° Profile
                </Button>
              </div>

              {/* Progress metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/40">
                  <span className="text-muted-foreground text-[10px] block">Course Progress</span>
                  <span className="font-bold text-foreground text-sm">{learner.progressPercent}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40">
                  <span className="text-muted-foreground text-[10px] block">Attendance</span>
                  <span className="font-bold text-foreground text-sm">{learner.attendancePercent}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40">
                  <span className="text-muted-foreground text-[10px] block">Doubts Asked</span>
                  <span className="font-bold text-foreground text-sm">{learner.doubtsAsked}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student 360 Drawer Component */}
      {selectedStudent && (
        <Student360Drawer
          open={!!selectedStudent}
          onOpenChange={(val) => {
            if (!val) setSelectedStudent(null);
          }}
          studentId={selectedStudent.id}
        />
      )}
    </div>
  );
};
