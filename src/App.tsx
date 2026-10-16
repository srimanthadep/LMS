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
import { GlobalCoursesBatchesPage } from "@/pages/super-admin/GlobalCoursesBatchesPage";
import { IntegrationsPage } from "@/pages/super-admin/IntegrationsPage";
import { UsageCostsPage } from "@/pages/super-admin/UsageCostsPage";
import { AuditLogsPage } from "@/pages/super-admin/AuditLogsPage";
import { DataRetentionPage } from "@/pages/super-admin/DataRetentionPage";
import { SystemSettingsPage } from "@/pages/super-admin/SystemSettingsPage";

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
import { EnrollmentAccessPage } from "@/pages/admin/EnrollmentAccessPage";
import { ContentOperationsPage } from "@/pages/admin/ContentOperationsPage";
import { AdminReportsPage } from "@/pages/admin/AdminReportsPage";
import { AssessmentApprovalsPage } from "@/pages/admin/AssessmentApprovalsPage";
import { AdminAuditLogPage } from "@/pages/admin/AdminAuditLogPage";
import { AdminProfileSettingsPage } from "@/pages/admin/AdminProfileSettingsPage";

// Teacher
import { TeacherDashboard } from "@/pages/teacher/TeacherDashboard";
import { TeacherCoursesPage } from "@/pages/teacher/TeacherCoursesPage";
import { TeacherCourseDetailPage } from "@/pages/teacher/TeacherCourseDetailPage";
import { TeacherClassroomPage } from "@/pages/teacher/TeacherClassroomPage";
import { RecordingReviewPage } from "@/pages/teacher/RecordingReviewPage";
import { DoubtsQueuePage } from "@/pages/teacher/DoubtsQueuePage";
import { TeacherStudentsPage } from "@/pages/teacher/TeacherStudentsPage";
import { TeacherAttendancePage } from "@/pages/teacher/TeacherAttendancePage";
import { TeacherAssignmentsPage } from "@/pages/teacher/TeacherAssignmentsPage";
import { TestCreationPage } from "@/pages/teacher/TestCreationPage";
import { BatchAnalyticsPage } from "@/pages/teacher/BatchAnalyticsPage";
import { ResourcesUploadPage } from "@/pages/teacher/ResourcesUploadPage";
import { TeacherSchedulePage } from "@/pages/teacher/TeacherSchedulePage";
import { TeacherCommunicationPage } from "@/pages/teacher/TeacherCommunicationPage";
import { TeacherResultsPage } from "@/pages/teacher/TeacherResultsPage";
import { TeacherSettingsPage } from "@/pages/teacher/TeacherSettingsPage";

// Student
import { StudentDashboard } from "@/pages/student/StudentDashboard";
import { StudentCoursesPage } from "@/pages/student/StudentCoursesPage";
import { StudentCourseDetailPage } from "@/pages/student/StudentCourseDetailPage";
import { StudentSchedulePage } from "@/pages/student/StudentSchedulePage";
import { StudentClassroomPage } from "@/pages/student/StudentClassroomPage";
import { ReplayLibraryPage } from "@/pages/student/ReplayLibraryPage";
import { SmartPlayerPage } from "@/pages/student/SmartPlayerPage";
import { StudentDoubtsPage } from "@/pages/student/StudentDoubtsPage";
import { StudentAssessmentsPage } from "@/pages/student/StudentAssessmentsPage";
import { TimedTestPage } from "@/pages/student/TimedTestPage";
import { TestResultsPage } from "@/pages/student/TestResultsPage";
import { StudentCertificatesPage } from "@/pages/student/StudentCertificatesPage";
import { StudentPaymentsPage } from "@/pages/student/StudentPaymentsPage";
import { StudentProfilePage } from "@/pages/student/StudentProfilePage";
import { StudentResumePage } from "@/pages/student/StudentResumePage";
import { StudentMentorsPage } from "@/pages/student/StudentMentorsPage";
import { StudentMentorSessionPage } from "@/pages/student/StudentMentorSessionPage";
import { StudentSupportPage } from "@/pages/student/StudentSupportPage";
import { StudentCommunicationPage } from "@/pages/student/StudentCommunicationPage";
import { StudentSettingsPage } from "@/pages/student/StudentSettingsPage";
import { StudentCalendarPage } from "@/pages/student/StudentCalendarPage";
import { StudentAnnouncementsPage } from "@/pages/student/StudentAnnouncementsPage";
import { StudentNoticeBoardPage } from "@/pages/student/StudentNoticeBoardPage";
import { StudentDiscussionsPage } from "@/pages/student/StudentDiscussionsPage";
import { StudentResultsPage } from "@/pages/student/StudentResultsPage";
import { StudentCourseManagementPage } from "@/pages/student/StudentCourseManagementPage";
import { StudentChatbotPage } from "@/pages/student/StudentChatbotPage";
import { StudentLinksPage } from "@/pages/student/StudentLinksPage";

// Evaluator
import { EvaluatorDashboard } from "@/pages/evaluator/EvaluatorDashboard";
import { EvaluatorMyEvaluationsPage } from "@/pages/evaluator/EvaluatorMyEvaluationsPage";
import { SubmissionsQueuePage } from "@/pages/evaluator/SubmissionsQueuePage";
import { GradingSuitePage } from "@/pages/evaluator/GradingSuitePage";
import { ReEvaluationsPage } from "@/pages/evaluator/ReEvaluationsPage";
import { EvaluatorResultsPage } from "@/pages/evaluator/EvaluatorResultsPage";
import { EvaluatorAnalyticsPage } from "@/pages/evaluator/EvaluatorAnalyticsPage";
import { EvaluatorSettingsPage } from "@/pages/evaluator/EvaluatorSettingsPage";

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
              path="/super-admin/roles"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <RolePermissionsPage />
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
              path="/super-admin/global-courses"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <GlobalCoursesBatchesPage />
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
              path="/super-admin/usage-costs"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <UsageCostsPage />
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
              path="/super-admin/data-retention"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <DataRetentionPage />
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
            <Route
              path="/super-admin/settings"
              element={
                <ProtectedRoute allowedRoles={["super-admin"]}>
                  <SystemSettingsPage />
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
              path="/admin/enrollments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EnrollmentAccessPage />
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
              path="/admin/content-ops"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ContentOperationsPage />
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
              path="/admin/announcements"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AnnouncementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminReportsPage />
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
              path="/admin/approvals"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AssessmentApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminAuditLogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminProfileSettingsPage />
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
              path="/teacher/courses"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses/:courseId"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherCourseDetailPage />
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
              path="/teacher/students"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherAttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assignments"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherAssignmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tests"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherAssignmentsPage />
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
              path="/teacher/recordings"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <RecordingReviewPage />
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
            <Route
              path="/teacher/communication"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherCommunicationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/results"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/settings"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherSettingsPage />
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
              path="/student/courses/:courseId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentCourseDetailPage />
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
              path="/student/assessments"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentAssessmentsPage />
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
              path="/student/results/:submissionId"
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
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/resume"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentResumePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/mentors"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentMentorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/mentor-session"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentMentorSessionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/support"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentSupportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/communication"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentCommunicationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/calendar"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/announcements"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentAnnouncementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notice-board"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentNoticeBoardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/discussions"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDiscussionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/course-management"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentCourseManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/chatbot"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentChatbotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/links"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentLinksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/settings"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentSettingsPage />
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
              path="/evaluator/evaluations"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <EvaluatorMyEvaluationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/queue"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <SubmissionsQueuePage />
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
              path="/evaluator/grade/:submissionId"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <GradingSuitePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/review/:submissionId"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <GradingSuitePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/reassessments"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <ReEvaluationsPage />
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
            <Route
              path="/evaluator/results"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <EvaluatorResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/analytics"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <EvaluatorAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluator/settings"
              element={
                <ProtectedRoute allowedRoles={["evaluator"]}>
                  <EvaluatorSettingsPage />
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
