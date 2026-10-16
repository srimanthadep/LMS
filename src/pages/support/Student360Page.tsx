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
  User,
  Star,
  ShieldAlert,
  ArrowRight,
  Flame,
  LifeBuoy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/StatCard";
import { Student360Drawer } from "@/components/shared/Student360Drawer";
import { Link } from "react-router-dom";

interface LearnerSummary {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledBatch: string;
  courseTitle: string;
  progressPercent: number;
  attendancePercent: number;
  doubtsAsked: number;
  status: "active" | "at_risk" | "paused";
  joinedDate: string;
  satisfactionRating: number;
}

const LEARNERS: LearnerSummary[] = [
  {
    id: "usr-student-1",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    avatar: "AM",
    enrolledBatch: "Cohort 7 (Live + Replay)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    progressPercent: 78,
    attendancePercent: 92,
    doubtsAsked: 4,
    status: "active",
    joinedDate: "01 Sep 2026",
    satisfactionRating: 5.0,
  },
  {
    id: "usr-student-2",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    avatar: "PH",
    enrolledBatch: "Agentic Systems Bootcamp",
    courseTitle: "Autonomous Multi-Agent Architectures",
    progressPercent: 85,
    attendancePercent: 88,
    doubtsAsked: 2,
    status: "active",
    joinedDate: "15 Sep 2026",
    satisfactionRating: 4.9,
  },
  {
    id: "usr-student-3",
    name: "Rohan Nair",
    email: "rohan.n@tech.io",
    avatar: "RN",
    enrolledBatch: "Cohort 7 (Live + Replay)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    progressPercent: 62,
    attendancePercent: 75,
    doubtsAsked: 3,
    status: "active",
    joinedDate: "01 Sep 2026",
    satisfactionRating: 4.8,
  },
  {
    id: "usr-student-5",
    name: "Simran Kaur",
    email: "simran.k@example.com",
    avatar: "SK",
    enrolledBatch: "Cohort 8 (Replay Only)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    progressPercent: 44,
    attendancePercent: 60,
    doubtsAsked: 1,
    status: "at_risk",
    joinedDate: "01 Oct 2026",
    satisfactionRating: 4.5,
  },
  {
    id: "usr-student-6",
    name: "Devendra Patel",
    email: "dev.patel@tech.in",
    avatar: "DP",
    enrolledBatch: "Cohort 8 (Replay Only)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    progressPercent: 30,
    attendancePercent: 45,
    doubtsAsked: 2,
    status: "at_risk",
    joinedDate: "10 Oct 2026",
    satisfactionRating: 4.7,
  },
  {
    id: "usr-student-7",
    name: "Ananya Deshmukh",
    email: "ananya.d@cloud.org",
    avatar: "AD",
    enrolledBatch: "Diffusion Models & Vision",
    courseTitle: "Diffusion Models & Generative Vision",
    progressPercent: 92,
    attendancePercent: 96,
    doubtsAsked: 5,
    status: "active",
    joinedDate: "05 Sep 2026",
    satisfactionRating: 5.0,
  },
];

export const Student360Page: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);

  const filtered = LEARNERS.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.enrolledBatch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    return true;
  });

  const activeCount = LEARNERS.filter((l) => l.status === "active").length;
  const atRiskCount = LEARNERS.filter((l) => l.status === "at_risk").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Customers & Learner 360° Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Search customer records, audit attendance telemetry, analyze engagement risk, and propose academic accommodations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/support/live-chat">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 font-semibold">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Live Chat Desk
            </Button>
          </Link>
          <Link to="/support/tickets">
            <Button size="sm" className="text-xs gap-1.5 bg-primary text-primary-foreground font-semibold">
              <LifeBuoy className="h-3.5 w-3.5" />
              View Open Tickets
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value="340"
          icon={Users}
          trend={{ value: "+28 new enrollments this month", isPositive: true }}
          highlight
        />
        <StatCard
          title="Active Students"
          value={activeCount}
          icon={CheckCircle2}
          trend={{ value: "92% attendance adherence", isPositive: true }}
        />
        <StatCard
          title="At-Risk Learners"
          value={atRiskCount}
          icon={Flame}
          trend={{ value: "Low attendance (<65%)", isPositive: false }}
        />
        <StatCard
          title="Average Customer CSAT"
          value="4.86 / 5.0"
          icon={Star}
          trend={{ value: "96.2% student satisfaction", isPositive: true }}
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name, email, course, or cohort..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-lg border border-border bg-background p-2"
            >
              <option value="all">All Customer Statuses</option>
              <option value="active">Active Enrolled</option>
              <option value="at_risk">At-Risk Learners</option>
            </select>

            <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
              Showing {filtered.length} of {LEARNERS.length} customers
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((learner) => (
          <Card key={learner.id} className="hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                  {learner.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{learner.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">{learner.email}</p>
                </div>
              </div>

              {learner.status === "active" ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold">
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-[10px] font-semibold">
                  At-Risk
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-3.5 text-xs flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Enrolled Program
                </span>
                <p className="font-semibold text-foreground text-xs leading-snug">
                  {learner.courseTitle}
                </p>
                <p className="text-[11px] text-primary font-medium">
                  {learner.enrolledBatch}
                </p>
              </div>

              {/* Progress metrics */}
              <div className="space-y-2 pt-1 border-t border-border/60">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Course Completion</span>
                    <span className="font-bold text-foreground">{learner.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${learner.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Live Attendance</span>
                    <span className={`font-bold ${learner.attendancePercent < 65 ? "text-red-500" : "text-emerald-600"}`}>
                      {learner.attendancePercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${learner.attendancePercent < 65 ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${learner.attendancePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/20 border border-border/60 text-center text-[11px]">
                <div>
                  <span className="text-muted-foreground text-[10px] block">Doubts Asked</span>
                  <span className="font-bold text-foreground">{learner.doubtsAsked}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] block">CSAT Rating</span>
                  <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                    <Star className="h-3 w-3 fill-current" /> {learner.satisfactionRating}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-border/60 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedStudent({ id: learner.id, name: learner.name })}
                  className="w-full gap-1.5 text-xs bg-primary text-primary-foreground font-semibold h-8"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Inspect 360° Profile
                </Button>
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
