import React from "react";
import { UserRole } from "@/types/auth";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Cpu,
  Layers,
  FileText,
  Trash2,
  BookOpen,
  Calendar,
  Video,
  CreditCard,
  Award,
  Bell,
  HelpCircle,
  FileCheck2,
  BarChart3,
  LifeBuoy,
  PlaySquare,
  GraduationCap,
  CheckCircle2,
  Settings,
  MessageSquare,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const ROLE_NAV_ITEMS: Record<UserRole, { sidebar: NavItem[]; mobileBottom: NavItem[] }> = {
  "super-admin": {
    sidebar: [
      { name: "Platform Health", href: "/super-admin/dashboard", icon: LayoutDashboard },
      { name: "User Directory", href: "/super-admin/users", icon: Users },
      { name: "Role Permissions", href: "/super-admin/roles", icon: ShieldCheck },
      { name: "Integrations", href: "/super-admin/integrations", icon: Cpu },
      { name: "LLM Costs & Tokens", href: "/super-admin/usage-costs", icon: BarChart3 },
      { name: "Audit Trail", href: "/super-admin/audit-logs", icon: FileText },
      { name: "Data Retention", href: "/super-admin/data-retention", icon: Trash2 },
    ],
    mobileBottom: [
      { name: "Health", href: "/super-admin/dashboard", icon: LayoutDashboard },
      { name: "Users", href: "/super-admin/users", icon: Users },
      { name: "Costs", href: "/super-admin/usage-costs", icon: BarChart3 },
      { name: "Integrations", href: "/super-admin/integrations", icon: Cpu },
      { name: "Audit", href: "/super-admin/audit-logs", icon: FileText },
    ],
  },
  admin: {
    sidebar: [
      { name: "Operations Hub", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Courses Catalog", href: "/admin/courses", icon: BookOpen },
      { name: "Batches & Cohorts", href: "/admin/batches", icon: Layers },
      { name: "Class Timetable", href: "/admin/schedule", icon: Calendar },
      { name: "Live Session Monitor", href: "/admin/live-monitor", icon: Video },
      { name: "Student Directory", href: "/admin/students", icon: GraduationCap },
      { name: "Teacher Roster", href: "/admin/teachers", icon: Users },
      { name: "Payments (₹)", href: "/admin/payments", icon: CreditCard },
      { name: "Certificates", href: "/admin/certificates", icon: Award },
      { name: "Announcements", href: "/admin/announcements", icon: Bell },
    ],
    mobileBottom: [
      { name: "Hub", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Courses", href: "/admin/courses", icon: BookOpen },
      { name: "Batches", href: "/admin/batches", icon: Layers },
      { name: "Schedule", href: "/admin/schedule", icon: Calendar },
      { name: "Payments", href: "/admin/payments", icon: CreditCard },
    ],
  },
  teacher: {
    sidebar: [
      { name: "Faculty Hub", href: "/teacher/dashboard", icon: LayoutDashboard },
      { name: "Course Management", href: "/teacher/courses", icon: BookOpen },
      { name: "Live Studio", href: "/teacher/classroom/class-agentic-101", icon: Video, badge: "LIVE" },
      { name: "Student Management", href: "/teacher/students", icon: GraduationCap },
      { name: "Attendance Desk", href: "/teacher/attendance", icon: CheckCircle2 },
      { name: "Assignments & Tests", href: "/teacher/assignments", icon: FileCheck2, badge: "8" },
      { name: "Doubts & Discussions", href: "/teacher/doubts", icon: HelpCircle, badge: "3" },
      { name: "AI Recordings", href: "/teacher/recordings", icon: PlaySquare },
      { name: "Performance Analytics", href: "/teacher/analytics", icon: BarChart3 },
      { name: "Calendar & Timetable", href: "/teacher/schedule", icon: Calendar },
      { name: "Communication Hub", href: "/teacher/communication", icon: Bell },
      { name: "Results & Feedback", href: "/teacher/results", icon: Award },
      { name: "Profile & Settings", href: "/teacher/settings", icon: Settings },
    ],
    mobileBottom: [
      { name: "Hub", href: "/teacher/dashboard", icon: LayoutDashboard },
      { name: "Courses", href: "/teacher/courses", icon: BookOpen },
      { name: "Live Studio", href: "/teacher/classroom/class-agentic-101", icon: Video },
      { name: "Students", href: "/teacher/students", icon: GraduationCap },
      { name: "Doubts", href: "/teacher/doubts", icon: HelpCircle },
    ],
  },
  student: {
    sidebar: [
      { name: "Learning Home", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "My Courses", href: "/student/courses", icon: BookOpen },
      { name: "Live Schedule", href: "/student/schedule", icon: Calendar },
      { name: "Replay Library", href: "/student/replays", icon: PlaySquare },
      { name: "My Doubts", href: "/student/doubts", icon: HelpCircle },
      { name: "Assessments", href: "/student/assessments", icon: FileCheck2 },
      { name: "Certificates", href: "/student/certificates", icon: Award },
      { name: "Receipts & Fees", href: "/student/payments", icon: CreditCard },
    ],
    mobileBottom: [
      { name: "Home", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "Courses", href: "/student/courses", icon: BookOpen },
      { name: "Schedule", href: "/student/schedule", icon: Calendar },
      { name: "Replays", href: "/student/replays", icon: PlaySquare },
      { name: "Doubts", href: "/student/doubts", icon: HelpCircle },
    ],
  },
  evaluator: {
    sidebar: [
      { name: "Grading Hub", href: "/evaluator/dashboard", icon: LayoutDashboard },
      { name: "Submissions Queue", href: "/evaluator/queue", icon: FileCheck2, badge: "8" },
      { name: "Active Evaluation", href: "/evaluator/grade/sub-1", icon: FileText },
      { name: "Re-evaluations", href: "/evaluator/re-evaluations", icon: HelpCircle },
    ],
    mobileBottom: [
      { name: "Hub", href: "/evaluator/dashboard", icon: LayoutDashboard },
      { name: "Queue", href: "/evaluator/queue", icon: FileCheck2 },
      { name: "Grade", href: "/evaluator/grade/sub-1", icon: FileText },
      { name: "Re-eval", href: "/evaluator/re-evaluations", icon: HelpCircle },
      { name: "Shortcuts", href: "#shortcuts", icon: ShieldCheck },
    ],
  },
  support: {
    sidebar: [
      { name: "Support Desk", href: "/support/dashboard", icon: LayoutDashboard },
      { name: "Tickets Inbox", href: "/support/tickets", icon: LifeBuoy, badge: "5" },
      { name: "Student 360", href: "/support/students", icon: Users },
      { name: "Support Analytics", href: "/support/analytics", icon: BarChart3 },
    ],
    mobileBottom: [
      { name: "Desk", href: "/support/dashboard", icon: LayoutDashboard },
      { name: "Tickets", href: "/support/tickets", icon: LifeBuoy },
      { name: "Student 360", href: "/support/students", icon: Users },
      { name: "Analytics", href: "/support/analytics", icon: BarChart3 },
      { name: "Shortcuts", href: "#shortcuts", icon: HelpCircle },
    ],
  },
};
