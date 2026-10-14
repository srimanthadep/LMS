import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserRole } from "@/types/auth";

// Auth & Common
import { LoginPage } from "@/pages/auth/LoginPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { TwoFactorPage } from "@/pages/auth/TwoFactorPage";
import { UnauthorizedPage, NotFoundPage } from "@/pages/common/CommonPages";

// Super Admin
import { SuperAdminDashboard } from "@/pages/super-admin/SuperAdminDashboard";
import { UserAdminPage } from "@/pages/super-admin/UserAdminPage";
import { RolePermissionsPage } from "@/pages/super-admin/RolePermissionsPage";
import { IntegrationsPage } from "@/pages/super-admin/IntegrationsPage";
import { UsageCostsPage } from "@/pages/super-admin/UsageCostsPage";
import { AuditLogsPage } from "@/pages/super-admin/AuditLogsPage";
import { DataRetentionPage } from "@/pages/super-admin/DataRetentionPage";

// Admin
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { CoursesListPage } from "@/pages/admin/CoursesListPage";
import { CourseDetailPage } from "@/pages/admin/CourseDetailPage";
import { BatchesListPage } from "@/pages/admin/BatchesListPage";
import { BatchDetailPage } from "@/pages/admin/BatchDetailPage";
import { ScheduleCalendarPage } from "@/pages/admin/ScheduleCalendarPage";
import { LiveMonitorPage } from "@/pages/admin/LiveMonitorPage";
import { StudentsDirectoryPage } from "@/pages/admin/StudentsDirectoryPage";
import { TeachersListPage } from "@/pages/admin/TeachersListPage";
import { PaymentsInvoicesPage } from "@/pages/admin/PaymentsInvoicesPage";
import { CertificatesPage } from "@/pages/admin/CertificatesPage";
import { AnnouncementsPage } from "@/pages/admin/AnnouncementsPage";

// Teacher
import { TeacherDashboard } from "@/pages/teacher/TeacherDashboard";
import { TeacherClassroomPage } from "@/pages/teacher/TeacherClassroomPage";
import { RecordingReviewPage } from "@/pages/teacher/RecordingReviewPage";
import { DoubtsQueuePage } from "@/pages/teacher/DoubtsQueuePage";
import { TestCreationPage } from "@/pages/teacher/TestCreationPage";
import { BatchAnalyticsPage } from "@/pages/teacher/BatchAnalyticsPage";
import { ResourcesUploadPage } from "@/pages/teacher/ResourcesUploadPage";
import { TeacherSchedulePage } from "@/pages/teacher/TeacherSchedulePage";

// Student
import { StudentDashboard } from "@/pages/student/StudentDashboard";
import { StudentCoursesPage } from "@/pages/student/StudentCoursesPage";
import { StudentSchedulePage } from "@/pages/student/StudentSchedulePage";
import { StudentClassroomPage } from "@/pages/student/StudentClassroomPage";
import { ReplayLibraryPage } from "@/pages/student/ReplayLibraryPage";
import { SmartPlayerPage } from "@/pages/student/SmartPlayerPage";
import { StudentDoubtsPage } from "@/pages/student/StudentDoubtsPage";
import { TimedTestPage } from "@/pages/student/TimedTestPage";
import { TestResultsPage } from "@/pages/student/TestResultsPage";
import { StudentCertificatesPage } from "@/pages/student/StudentCertificatesPage";
import { StudentPaymentsPage } from "@/pages/student/StudentPaymentsPage";

// Evaluator
import { EvaluatorDashboard } from "@/pages/evaluator/EvaluatorDashboard";
import { SubmissionsQueuePage } from "@/pages/evaluator/SubmissionsQueuePage";
import { GradingSuitePage } from "@/pages/evaluator/GradingSuitePage";
import { ReEvaluationsPage } from "@/pages/evaluator/ReEvaluationsPage";

// Support
import { SupportDashboard } from "@/pages/support/SupportDashboard";
import { TicketsInboxPage } from "@/pages/support/TicketsInboxPage";
import { TicketDetailPage } from "@/pages/support/TicketDetailPage";
import { Student360Page } from "@/pages/support/Student360Page";
import { SupportAnalyticsPage } from "@/pages/support/SupportAnalyticsPage";

// Role-based Root Redirect Component
const RoleRootRedirect: React.FC = () => {
  const { role } = useAuth();
  switch (role) {
    case "super-admin":
      return <Navigate to="/super-admin/dashboard" replace />;
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "teacher":
      return <Navigate to="/teacher/dashboard" replace />;
    case "student":
      return <Navigate to="/student/dashboard" replace />;
    case "evaluator":
      return <Navigate to="/evaluator/dashboard" replace />;
    case "support":
      return <Navigate to="/support/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Route Guard component that permits matching roles, while allowing super-admin omniscient inspection
interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Super-admin has broad inspection rights, or current role matches
  if (role === "super-admin" || allowedRoles.includes(role)) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <UnauthorizedPage />
    </DashboardLayout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/2fa" element={<TwoFactorPage />} />
            <Route path="/auth/2fa" element={<TwoFactorPage />} />

            {/* Root Landing Redirect */}
            <Route path="/" element={<RoleRootRedirect />} />

            {/* SUPER ADMIN ROUTES */}
            <Route
              path="/super-admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/users"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <UserAdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/permissions"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <RolePermissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/integrations"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <IntegrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/usage"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <UsageCostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/retention"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <DataRetentionPage />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CoursesListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses/:courseId"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CourseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/batches"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BatchesListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/batches/:batchId"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BatchDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schedule"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ScheduleCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/live-monitor"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LiveMonitorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <StudentsDirectoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teachers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <TeachersListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PaymentsInvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AnnouncementsPage />
                </ProtectedRoute>
              }
            />

            {/* TEACHER ROUTES */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/classroom/:classId"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherClassroomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/recordings/:recordingId"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <RecordingReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/doubts"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <DoubtsQueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tests/create"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TestCreationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/analytics"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <BatchAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/resources"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <ResourcesUploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/schedule"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherSchedulePage />
                </ProtectedRoute>
              }
            />

            {/* STUDENT ROUTES */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/schedule"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentSchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/classroom/:classId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentClassroomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/replays"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ReplayLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/replays/:recordingId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <SmartPlayerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/doubts"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDoubtsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assessments/take"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <TimedTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/test-results/:submissionId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <TestResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentCertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentPaymentsPage />
                </ProtectedRoute>
              }
            />

            {/* EVALUATOR ROUTES */}
            <Route
              path="/evaluator/dashboard"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <EvaluatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/submissions"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <SubmissionsQueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/grading/:submissionId"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <GradingSuitePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/re-evaluations"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <ReEvaluationsPage />
                </ProtectedRoute>
              }
            />

            {/* SUPPORT & MENTOR ROUTES */}
            <Route
              path="/support/dashboard"
              element={
                <ProtectedRoute allowedRoles={["support"]}>
                  <SupportDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support/inbox"
              element={
                <ProtectedRoute allowedRoles={["support"]}>
                  <TicketsInboxPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support/ticket/:ticketId"
              element={
                <ProtectedRoute allowedRoles={["support"]}>
                  <TicketDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support/students-360"
              element={
                <ProtectedRoute allowedRoles={["support"]}>
                  <Student360Page />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support/analytics"
              element={
                <ProtectedRoute allowedRoles={["support"]}>
                  <SupportAnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* Common Fallback Routes */}
            <Route
              path="/unauthorized"
              element={
                <DashboardLayout>
                  <UnauthorizedPage />
                </DashboardLayout>
              }
            />
            <Route
              path="*"
              element={
                <DashboardLayout>
                  <NotFoundPage />
                </DashboardLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
