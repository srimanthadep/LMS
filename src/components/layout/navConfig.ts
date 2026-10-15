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
  Globe,
  Sliders,
  KeyRound,
  FolderSync,
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
      { name: "Platform Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
      { name: "User Directory", href: "/super-admin/users", icon: Users },
      { name: "Roles & Permissions", href: "/super-admin/roles", icon: ShieldCheck },
      { name: "Global Courses & Batches", href: "/super-admin/global-courses", icon: Globe },
      { name: "Integrations & API Keys", href: "/super-admin/integrations", icon: Cpu },
      { name: "Cost & Usage Monitor", href: "/super-admin/usage-costs", icon: BarChart3 },
      { name: "Audit Trail", href: "/super-admin/audit-logs", icon: FileText },
      { name: "Data & Privacy (DPDP)", href: "/super-admin/data-retention", icon: Trash2 },
      { name: "Global System Settings", href: "/super-admin/settings", icon: Settings },
    ],
    mobileBottom: [
      { name: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
      { name: "Users", href: "/super-admin/users", icon: Users },
      { name: "Courses", href: "/super-admin/global-courses", icon: Globe },
      { name: "Costs", href: "/super-admin/usage-costs", icon: BarChart3 },
      { name: "Settings", href: "/super-admin/settings", icon: Settings },
    ],
  },
  admin: {
    sidebar: [
      { name: "Operations Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Student Directory", href: "/admin/students", icon: GraduationCap },
      { name: "Teacher Management", href: "/admin/teachers", icon: Users },
      { name: "Course Management", href: "/admin/courses", icon: BookOpen },
      { name: "Batch Management", href: "/admin/batches", icon: Layers },
      { name: "Enrollment & Access", href: "/admin/enrollments", icon: KeyRound },
      { name: "Class Timetable", href: "/admin/schedule", icon: Calendar },
      { name: "Live Studio Monitor", href: "/admin/live-monitor", icon: Video },
      { name: "Content & Recordings", href: "/admin/content-ops", icon: PlaySquare },
      { name: "Payments & Invoices", href: "/admin/payments", icon: CreditCard },
      { name: "Announcements", href: "/admin/announcements", icon: Bell },
      { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
      { name: "Certificates", href: "/admin/certificates", icon: Award },
      { name: "Assessment Approvals", href: "/admin/approvals", icon: FileCheck2, badge: "6" },
      { name: "Operational Audit Log", href: "/admin/audit-logs", icon: FileText },
      { name: "Profile & Preferences", href: "/admin/settings", icon: Settings },
    ],
    mobileBottom: [
      { name: "Hub", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Schedule", href: "/admin/schedule", icon: Calendar },
      { name: "Enrollments", href: "/admin/enrollments", icon: KeyRound },
      { name: "Content", href: "/admin/content-ops", icon: PlaySquare },
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
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
      { name: "My Assessments", href: "/evaluator/evaluations", icon: BookOpen },
      { name: "Submissions Queue", href: "/evaluator/queue", icon: FileCheck2, badge: "5" },
      { name: "Active Evaluation", href: "/evaluator/grading/sub-1", icon: FileText, badge: "Active" },
      { name: "Reassessments", href: "/evaluator/reassessments", icon: HelpCircle, badge: "1" },
      { name: "Results & Grades", href: "/evaluator/results", icon: Award },
      { name: "Evaluation Analytics", href: "/evaluator/analytics", icon: BarChart3 },
      { name: "Profile & Settings", href: "/evaluator/settings", icon: Settings },
    ],
    mobileBottom: [
      { name: "Hub", href: "/evaluator/dashboard", icon: LayoutDashboard },
      { name: "Assessments", href: "/evaluator/evaluations", icon: BookOpen },
      { name: "Queue", href: "/evaluator/queue", icon: FileCheck2 },
      { name: "Grade", href: "/evaluator/grading/sub-1", icon: FileText },
      { name: "Reassess", href: "/evaluator/reassessments", icon: HelpCircle },
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
