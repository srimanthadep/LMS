import { Course, Batch, LiveClassSession, LectureRecording, StudentDoubt, TestSubmission, VideoChapter, TranscriptSnippet } from "@/types/lms";
import { mockDataService } from "@/services/mockDataService";

export interface TeacherResourceItem {
  id: string;
  title: string;
  type: "Slide Deck (PDF)" | "Source Code (ZIP)" | "Daily Practice Problem (DPP)" | "Lab Notebook (IPYNB)" | "Dataset (JSON/CSV)";
  courseId: string;
  courseTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  batchName: string;
  fileSize: string;
  uploadedAt: string;
  downloads: number;
  url?: string;
  tags: string[];
}

export interface TeacherAssignmentItem {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  batch: string;
  dueDate: string;
  maxScore: number;
  totalSubmissions: number;
  gradedCount: number;
  pendingCount: number;
  type: "capstone" | "lab" | "quiz";
  description: string;
  rubricCriteria: Array<{ id: string; name: string; maxScore: number }>;
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation?: string;
  }>;
  passingScore?: number;
  durationMinutes?: number;
  maxAttempts?: number;
  status: "published" | "draft" | "closed";
}

export interface TeacherScheduleSlot {
  id: string;
  title: string;
  type: "live-class" | "deadline" | "office-hours" | "exam";
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  batch: string;
  course: string;
  status: "live" | "upcoming" | "completed" | "cancelled";
  meetingUrl?: string;
}

export interface StudentRosterRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  batch: string;
  attendanceRate: number;
  quizAverage: number;
  pendingAssignments: number;
  confusionSignalsCount: number;
  strugglingTopic?: string;
  status: "on-track" | "at-risk" | "stellar";
  lastActive: string;
  notes?: string[];
  supportInterventionSent?: boolean;
}

export interface SessionAttendanceLedger {
  id: string;
  batchName: string;
  className: string;
  date: string;
  isLocked: boolean;
  records: Array<{
    studentId: string;
    name: string;
    rollNo: string;
    status: "present" | "late" | "absent" | "excused";
    cumulativeRate: number;
  }>;
}

export interface StudentResultRecord {
  id: string;
  studentId: string;
  name: string;
  rollNo: string;
  batch: string;
  courseTitle: string;
  quizzesAverage: number;
  assignmentsScore: number;
  capstoneScore: number;
  finalGrade: string;
  isReleased: boolean;
  status: "Pass with Distinction" | "Pass" | "Borderline" | "Action Required";
  evaluatorFeedback?: string;
}

export interface TeacherAnnouncementItem {
  id: string;
  title: string;
  body: string;
  targetBatch: string;
  targetCourse?: string;
  timestamp: string;
  channels: string[];
  reachCount: number;
  isSystemWide?: boolean;
}

export interface TeacherStudentMessage {
  id: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "unanswered" | "replied";
  replyText?: string;
  courseTitle?: string;
  batchName?: string;
}

export interface TeacherProfileSettings {
  name: string;
  title: string;
  email: string;
  phone: string;
  officeHours: string;
  bio: string;
  organization: string;
  avatar?: string;
  role: "teacher"; // Read-only
  notifyDoubts: boolean;
  notifySubmissions: boolean;
  notifyLiveReminder: boolean;
  notifySmsAlerts: boolean;
}

export interface RecordingCorrectionSuggestion {
  id: string;
  recordingId: string;
  recordingTitle: string;
  type: "chapter" | "transcript" | "summary" | "other";
  targetTimeFormatted?: string;
  targetDetails: string;
  suggestedCorrection: string;
  urgency: "low" | "normal" | "high";
  submittedAt: string;
  status: "pending_review" | "pending_admin_review" | "approved" | "rejected";
}

/**
 * FRONTEND MOCK SERVICE & GOVERNANCE CONFIGURATION
 * Note: This LMS is frontend-only at this stage. All persistence operations are
 * simulated in-memory and via localStorage. No backend APIs, database, or server-side
 * authentication exists.
 */
export const IS_MOCK_SERVICE = true;

export interface FacultyPermissions {
  // Restricted administrative actions (Admin / Super Admin only)
  canCreateCourses: boolean;
  canEditCourses: boolean;
  canDeleteCourses: boolean;
  canPublishCourses: boolean;
  canUploadMaterials: boolean;
  canDeleteMaterials: boolean;
  canCreateAssessments: boolean;
  canEditAssessments: boolean;
  canDeleteAssessments: boolean;
  canPublishAssessments: boolean;
  canPublishFinalGrades: boolean;
  canBulkReleaseGrades: boolean;
  canPublishRecordings: boolean;
  canBroadcastSystemWide: boolean;

  // Permitted faculty teaching activities
  canViewAssignedCourses: boolean;
  canReviewMaterials: boolean;
  canManageAttendance: boolean;
  canResolveDoubts: boolean;
  canGradeSubmissions: boolean;
  canScheduleLiveClasses: boolean;
  canSuggestRecordingCorrections: boolean;
}

export const DEFAULT_FACULTY_PERMISSIONS: FacultyPermissions = {
  canCreateCourses: false,
  canEditCourses: false,
  canDeleteCourses: false,
  canPublishCourses: false,
  canUploadMaterials: false,
  canDeleteMaterials: false,
  canCreateAssessments: false,
  canEditAssessments: false,
  canDeleteAssessments: false,
  canPublishAssessments: false,
  canPublishFinalGrades: false, // Final grade publication reserved for Academic Admin unless authorized
  canBulkReleaseGrades: false,  // Bulk grade release reserved for Academic Admin unless authorized
  canPublishRecordings: false,
  canBroadcastSystemWide: false,

  canViewAssignedCourses: true,
  canReviewMaterials: true,
  canManageAttendance: true,
  canResolveDoubts: true,
  canGradeSubmissions: true,
  canScheduleLiveClasses: true,
  canSuggestRecordingCorrections: true,
};

// Storage Keys (Local browser simulation)
const STORAGE_PREFIX = "lms_teacher_portal_";
const KEY_COURSES = `${STORAGE_PREFIX}courses`;
const KEY_ASSIGNMENTS = `${STORAGE_PREFIX}assignments`;
const KEY_SCHEDULE = `${STORAGE_PREFIX}schedule`;
const KEY_STUDENTS = `${STORAGE_PREFIX}students`;
const KEY_ATTENDANCE = `${STORAGE_PREFIX}attendance`;
const KEY_RESULTS = `${STORAGE_PREFIX}results`;
const KEY_RESOURCES = `${STORAGE_PREFIX}resources`;
const KEY_RECORDINGS = `${STORAGE_PREFIX}recordings`;
const KEY_RECORDING_SUGGESTIONS = `${STORAGE_PREFIX}recording_suggestions`;
const KEY_DOUBTS = `${STORAGE_PREFIX}doubts`;
const KEY_ANNOUNCEMENTS = `${STORAGE_PREFIX}announcements`;
const KEY_MESSAGES = `${STORAGE_PREFIX}messages`;
const KEY_PROFILE = `${STORAGE_PREFIX}profile`;
const KEY_PERMISSIONS = `${STORAGE_PREFIX}permissions`;

class TeacherDataService {
  // Helper for safe localStorage access
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(`Failed to parse localStorage key ${key}`, e);
    }
    return fallback;
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to write to localStorage key ${key}`, e);
    }
  }

  // 1. COURSES
  getCourses(): Course[] {
    const fallback = mockDataService.getCourses();
    return this.getStorage<Course[]>(KEY_COURSES, fallback);
  }

  saveCourse(course: Course, requesterRole: string = "teacher"): void {
    if (requesterRole === "teacher") {
      console.error("Permission Denied: Teachers cannot create, edit, or publish courses. Course operations are restricted to Admin/Super Admin.");
      return;
    }
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.unshift(course);
    }
    this.setStorage(KEY_COURSES, courses);
  }

  deleteCourse(courseId: string, requesterRole: string = "teacher"): void {
    if (requesterRole === "teacher") {
      console.error("Permission Denied: Teachers cannot delete courses. Course operations are restricted to Admin/Super Admin.");
      return;
    }
    const courses = this.getCourses().filter((c) => c.id !== courseId);
    this.setStorage(KEY_COURSES, courses);
  }

  // 2. ASSIGNMENTS & TESTS
  getAssignments(): TeacherAssignmentItem[] {
    const fallback: TeacherAssignmentItem[] = [
      {
        id: "asg-1",
        title: "Capstone 1: Scalable Agent Swarm with Tool Calling",
        courseId: "course-3",
        courseTitle: "Autonomous Multi-Agent Systems & Swarms",
        batch: "Cohort 7 (Live + Replay)",
        dueDate: "2026-10-20, 11:59 PM",
        maxScore: 100,
        totalSubmissions: 68,
        gradedCount: 52,
        pendingCount: 16,
        type: "capstone",
        description: "Architect and implement an asynchronous multi-agent supervisor coordinating specialist tools with failover circuit breakers.",
        rubricCriteria: [
          { id: "c1", name: "Agent Coordination & Consensus Logic", maxScore: 40 },
          { id: "c2", name: "Tool Calling Validation & Schema Rigor", maxScore: 30 },
          { id: "c3", name: "Error Handling & Circuit Breakers", maxScore: 30 },
        ],
        passingScore: 70,
        durationMinutes: 120,
        maxAttempts: 2,
        status: "published",
      },
      {
        id: "asg-2",
        title: "Lab 3: FAISS Vector Recall vs Latency Benchmarking",
        courseId: "course-1",
        courseTitle: "Full-Stack AI & LLM Systems",
        batch: "Cohort 7 (Live + Replay)",
        dueDate: "2026-10-16, 06:00 PM",
        maxScore: 50,
        totalSubmissions: 72,
        gradedCount: 70,
        pendingCount: 2,
        type: "lab",
        description: "Benchmark recall rates across Flat, IVF, and HNSW indices with varying efSearch parameters under sub-10ms constraints.",
        rubricCriteria: [
          { id: "c1", name: "Vector Index Implementation", maxScore: 25 },
          { id: "c2", name: "Benchmark Rigor & Recall Plotting", maxScore: 25 },
        ],
        passingScore: 35,
        durationMinutes: 90,
        maxAttempts: 3,
        status: "published",
      },
      {
        id: "asg-3",
        title: "Checkpoint Quiz 2: Embedding Space Topologies",
        courseId: "course-1",
        courseTitle: "Full-Stack AI & LLM Systems",
        batch: "Cohort 4 (Live Sync)",
        dueDate: "2026-10-12, 11:59 PM",
        maxScore: 25,
        totalSubmissions: 48,
        gradedCount: 48,
        pendingCount: 0,
        type: "quiz",
        description: "Objective evaluation of dense representations, cosine distance vs inner product metrics, and dimensional curse effects.",
        rubricCriteria: [
          { id: "c1", name: "Objective Accuracy", maxScore: 25 },
        ],
        questions: [
          {
            id: "q1",
            question: "Which vector index topology yields logarithmic query time complexity at the cost of higher graph memory consumption?",
            options: ["HNSW (Hierarchical Navigable Small World)", "IVF-Flat", "Exact Flat L2", "Product Quantization (PQ)"],
            correctOptionIndex: 0,
            explanation: "HNSW builds multi-layered proximity graphs enabling sub-linear search at elevated memory consumption.",
          },
          {
            id: "q2",
            question: "What metric preserves angle proportionality when embeddings are normalized to unit sphere magnitude?",
            options: ["Cosine Similarity is strictly proportional to Dot Product", "Manhattan Distance", "Chebyshev Norm", "Hamming Distance"],
            correctOptionIndex: 0,
            explanation: "For unit vectors, dot product equals cosine similarity directly.",
          },
        ],
        passingScore: 18,
        durationMinutes: 30,
        maxAttempts: 1,
        status: "published",
      },
    ];
    return this.getStorage<TeacherAssignmentItem[]>(KEY_ASSIGNMENTS, fallback);
  }

  saveAssignment(asg: TeacherAssignmentItem, requesterRole: string = "teacher"): void {
    const assignments = this.getAssignments();
    const index = assignments.findIndex((a) => a.id === asg.id);
    if (requesterRole === "teacher") {
      // Teachers cannot create new coursework or tests
      if (index < 0) {
        console.error("Permission Denied: Teachers cannot create new assignments, quizzes, or tests. Restrict to Admin/Super Admin.");
        return;
      }
      // Only grading updates are authorized for teachers
      assignments[index] = {
        ...assignments[index],
        gradedCount: asg.gradedCount,
        pendingCount: asg.pendingCount,
        totalSubmissions: asg.totalSubmissions,
      };
      this.setStorage(KEY_ASSIGNMENTS, assignments);
      return;
    }
    if (index >= 0) {
      assignments[index] = asg;
    } else {
      assignments.unshift(asg);
    }
    this.setStorage(KEY_ASSIGNMENTS, assignments);
  }

  deleteAssignment(id: string, requesterRole: string = "teacher"): void {
    if (requesterRole === "teacher") {
      console.error("Permission Denied: Teachers cannot delete assignments, quizzes, or tests.");
      return;
    }
    const assignments = this.getAssignments().filter((a) => a.id !== id);
    this.setStorage(KEY_ASSIGNMENTS, assignments);
  }

  // 3. SCHEDULE SLOTS
  getScheduleSlots(): TeacherScheduleSlot[] {
    const fallback: TeacherScheduleSlot[] = [
      {
        id: "sl-1",
        title: "Lecture 14: Multi-Agent Consensus & Supervision",
        type: "live-class",
        date: "2026-10-15",
        startTime: "20:00",
        endTime: "21:30",
        batch: "Cohort 7 (Live + Replay)",
        course: "Full-Stack AI & LLM Systems",
        status: "upcoming",
        meetingUrl: "/teacher/classroom/class-agentic-101",
      },
      {
        id: "sl-2",
        title: "Capstone 1 Submissions Cutoff",
        type: "deadline",
        date: "2026-10-20",
        startTime: "23:59",
        endTime: "23:59",
        batch: "Cohort 7 (Live + Replay)",
        course: "Full-Stack AI & LLM Systems",
        status: "upcoming",
      },
      {
        id: "sl-3",
        title: "Faculty Mentorship Office Hours",
        type: "office-hours",
        date: "2026-10-16",
        startTime: "16:00",
        endTime: "18:00",
        batch: "Open to All Cohorts",
        course: "Direct 1-on-1 Guidance",
        status: "upcoming",
      },
      {
        id: "sl-4",
        title: "Lecture 9: Autonomous Swarm Tool Routing",
        type: "live-class",
        date: "2026-10-17",
        startTime: "11:00",
        endTime: "13:00",
        batch: "Cohort 4 (Live Sync)",
        course: "Autonomous Multi-Agent Architectures",
        status: "upcoming",
        meetingUrl: "/teacher/classroom/class-agentic-101",
      },
    ];
    return this.getStorage<TeacherScheduleSlot[]>(KEY_SCHEDULE, fallback);
  }

  saveScheduleSlot(slot: TeacherScheduleSlot): void {
    const slots = this.getScheduleSlots();
    const index = slots.findIndex((s) => s.id === slot.id);
    if (index >= 0) {
      slots[index] = slot;
    } else {
      slots.unshift(slot);
    }
    this.setStorage(KEY_SCHEDULE, slots);
  }

  deleteScheduleSlot(id: string): void {
    const slots = this.getScheduleSlots().filter((s) => s.id !== id);
    this.setStorage(KEY_SCHEDULE, slots);
  }

  // 4. STUDENT ROSTER
  getStudents(): StudentRosterRecord[] {
    const fallback: StudentRosterRecord[] = [
      {
        id: "usr-student-1",
        name: "Arjun Mehta",
        email: "arjun.m@learner.ai",
        course: "Full-Stack AI & LLM Systems",
        batch: "Cohort 7 (Live + Replay)",
        attendanceRate: 88,
        quizAverage: 86,
        pendingAssignments: 0,
        confusionSignalsCount: 1,
        status: "on-track",
        lastActive: "15 mins ago",
      },
      {
        id: "usr-student-2",
        name: "Pooja Hegde",
        email: "pooja.h@example.com",
        course: "Full-Stack AI & LLM Systems",
        batch: "Cohort 7 (Live + Replay)",
        attendanceRate: 94,
        quizAverage: 95,
        pendingAssignments: 0,
        confusionSignalsCount: 0,
        status: "stellar",
        lastActive: "1 hour ago",
      },
      {
        id: "usr-student-3",
        name: "Devendra Patel",
        email: "dev.patel@tech.in",
        course: "Full-Stack AI & LLM Systems",
        batch: "Cohort 7 (Live + Replay)",
        attendanceRate: 68,
        quizAverage: 58,
        pendingAssignments: 2,
        confusionSignalsCount: 4,
        strugglingTopic: "Faiss Index Topologies & Cosine Metric",
        status: "at-risk",
        lastActive: "3 days ago",
      },
      {
        id: "usr-student-4",
        name: "Simran Kaur",
        email: "simran.k@example.com",
        course: "Autonomous Multi-Agent Architectures",
        batch: "Cohort 4 (Live Sync)",
        attendanceRate: 72,
        quizAverage: 62,
        pendingAssignments: 1,
        confusionSignalsCount: 3,
        strugglingTopic: "Zod Schema Tool Calling in LangGraph",
        status: "at-risk",
        lastActive: "Yesterday",
      },
      {
        id: "usr-student-5",
        name: "Rohan Varma",
        email: "rohan.v@company.org",
        course: "Full-Stack AI & LLM Systems",
        batch: "Cohort 7 (Live + Replay)",
        attendanceRate: 90,
        quizAverage: 82,
        pendingAssignments: 0,
        confusionSignalsCount: 0,
        status: "on-track",
        lastActive: "Just now",
      },
      {
        id: "usr-student-6",
        name: "Ananya Deshmukh",
        email: "ananya.d@startup.ai",
        course: "Autonomous Multi-Agent Architectures",
        batch: "Cohort 4 (Live Sync)",
        attendanceRate: 96,
        quizAverage: 98,
        pendingAssignments: 0,
        confusionSignalsCount: 0,
        status: "stellar",
        lastActive: "2 hours ago",
      },
    ];
    return this.getStorage<StudentRosterRecord[]>(KEY_STUDENTS, fallback);
  }

  saveStudent(student: StudentRosterRecord): void {
    const list = this.getStudents();
    const idx = list.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.unshift(student);
    }
    this.setStorage(KEY_STUDENTS, list);
  }

  // 5. ATTENDANCE LEDGER
  getAttendanceLedger(batchName: string, date: string, className?: string): SessionAttendanceLedger {
    const all = this.getStorage<Record<string, SessionAttendanceLedger>>(KEY_ATTENDANCE, {});
    const cls = className || "Lecture 14: Multi-Agent Consensus & Supervision";
    const key = `${batchName}_${date}_${cls}`;
    if (all[key]) return all[key];

    // Check legacy key
    const legacyKey = `${batchName}_${date}`;
    if (all[legacyKey] && (!all[legacyKey].className || all[legacyKey].className === cls)) {
      return all[legacyKey];
    }

    // Generate roster records specific to the batch
    const cohortStudents = this.getStudents().filter((s) => s.batch === batchName);
    const prefix = batchName.includes("4") ? "AI-C4" : "AI-C7";

    let records: SessionAttendanceLedger["records"] = [];
    if (cohortStudents.length > 0) {
      records = cohortStudents.map((s, idx) => ({
        studentId: s.id,
        name: s.name,
        rollNo: `${prefix}-00${idx + 1}`,
        status: (idx % 4 === 2 ? "absent" : idx % 4 === 3 ? "late" : "present") as "present" | "late" | "absent" | "excused",
        cumulativeRate: s.attendanceRate,
      }));
    } else {
      // Fallback roster
      records = [
        { studentId: `usr-${prefix}-1`, name: "Arjun Mehta", rollNo: `${prefix}-001`, status: "present", cumulativeRate: 88 },
        { studentId: `usr-${prefix}-2`, name: "Pooja Hegde", rollNo: `${prefix}-002`, status: "present", cumulativeRate: 94 },
        { studentId: `usr-${prefix}-3`, name: "Devendra Patel", rollNo: `${prefix}-003`, status: "absent", cumulativeRate: 68 },
        { studentId: `usr-${prefix}-4`, name: "Kunal Sharma", rollNo: `${prefix}-004`, status: "present", cumulativeRate: 84 },
      ];
    }

    const defaultLedger: SessionAttendanceLedger = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      batchName,
      className: cls,
      date,
      isLocked: false,
      records,
    };
    return defaultLedger;
  }

  saveAttendanceLedger(ledger: SessionAttendanceLedger): void {
    const all = this.getStorage<Record<string, SessionAttendanceLedger>>(KEY_ATTENDANCE, {});
    const key = `${ledger.batchName}_${ledger.date}_${ledger.className}`;
    all[key] = ledger;
    all[`${ledger.batchName}_${ledger.date}`] = ledger;
    this.setStorage(KEY_ATTENDANCE, all);
  }

  // 6. RESULTS
  getResults(): StudentResultRecord[] {
    const fallback: StudentResultRecord[] = [
      {
        id: "res-1",
        studentId: "usr-student-1",
        name: "Arjun Mehta",
        rollNo: "AI-C7-001",
        batch: "Cohort 7 (Live + Replay)",
        courseTitle: "Full-Stack AI & LLM Systems",
        quizzesAverage: 92,
        assignmentsScore: 94,
        capstoneScore: 95,
        finalGrade: "A+",
        isReleased: true,
        status: "Pass with Distinction",
        evaluatorFeedback: "Exceptional architecture on multi-agent failover loops.",
      },
      {
        id: "res-2",
        studentId: "usr-student-2",
        name: "Pooja Hegde",
        rollNo: "AI-C7-002",
        batch: "Cohort 7 (Live + Replay)",
        courseTitle: "Full-Stack AI & LLM Systems",
        quizzesAverage: 96,
        assignmentsScore: 98,
        capstoneScore: 96,
        finalGrade: "A+",
        isReleased: true,
        status: "Pass with Distinction",
        evaluatorFeedback: "Flawless code quality and schema validation benchmarks.",
      },
      {
        id: "res-3",
        studentId: "usr-student-3",
        name: "Devendra Patel",
        rollNo: "AI-C7-003",
        batch: "Cohort 7 (Live + Replay)",
        courseTitle: "Full-Stack AI & LLM Systems",
        quizzesAverage: 58,
        assignmentsScore: 62,
        capstoneScore: 60,
        finalGrade: "C",
        isReleased: false,
        status: "Borderline",
        evaluatorFeedback: "Needs remediation on Vector similarity metrics and memory pruning.",
      },
      {
        id: "res-4",
        studentId: "usr-student-4",
        name: "Simran Kaur",
        rollNo: "AI-C7-004",
        batch: "Cohort 7 (Live + Replay)",
        courseTitle: "Full-Stack AI & LLM Systems",
        quizzesAverage: 72,
        assignmentsScore: 78,
        capstoneScore: 74,
        finalGrade: "B",
        isReleased: true,
        status: "Pass",
        evaluatorFeedback: "Good grasp of core concepts. Tool schema handling can be hardened.",
      },
      {
        id: "res-5",
        studentId: "usr-student-5",
        name: "Rohan Varma",
        rollNo: "AI-C7-005",
        batch: "Cohort 7 (Live + Replay)",
        courseTitle: "Full-Stack AI & LLM Systems",
        quizzesAverage: 88,
        assignmentsScore: 86,
        capstoneScore: 89,
        finalGrade: "A",
        isReleased: true,
        status: "Pass with Distinction",
        evaluatorFeedback: "Solid implementation across all milestone rubrics.",
      },
      {
        id: "res-6",
        studentId: "usr-student-6",
        name: "Ananya Deshmukh",
        rollNo: "AI-C7-006",
        batch: "Cohort 7 (Live + Replay)",
        courseTitle: "Full-Stack AI & LLM Systems",
        quizzesAverage: 98,
        assignmentsScore: 96,
        capstoneScore: 97,
        finalGrade: "A+",
        isReleased: true,
        status: "Pass with Distinction",
        evaluatorFeedback: "Top 1% of cohort. Highly innovative caching implementation.",
      },
    ];
    return this.getStorage<StudentResultRecord[]>(KEY_RESULTS, fallback);
  }

  saveResults(results: StudentResultRecord[]): void {
    this.setStorage(KEY_RESULTS, results);
  }

  // 7. LEARNING RESOURCES
  getResources(): TeacherResourceItem[] {
    const fallback: TeacherResourceItem[] = [
      {
        id: "r1",
        title: "Lecture 8: Vector Databases & Chunking Slides",
        type: "Slide Deck (PDF)",
        courseId: "course-1",
        courseTitle: "Full-Stack AI & LLM Systems",
        moduleId: "mod-2",
        moduleTitle: "Module 2: RAG Architectures & Vector Similarity Search",
        batchName: "Cohort 7 (Live + Replay)",
        fileSize: "14.2 MB",
        uploadedAt: "Yesterday",
        downloads: 112,
        tags: ["Vector Search", "Chunking", "HNSW"],
      },
      {
        id: "r2",
        title: "Milestone 2 Starter Repo: LangChain Hybrid RAG",
        type: "Source Code (ZIP)",
        courseId: "course-1",
        courseTitle: "Full-Stack AI & LLM Systems",
        moduleId: "mod-2",
        moduleTitle: "Module 2: RAG Architectures",
        batchName: "Cohort 7 (Live + Replay)",
        fileSize: "2.8 MB",
        uploadedAt: "3 days ago",
        downloads: 98,
        tags: ["PyTorch", "Code Template"],
      },
      {
        id: "r3",
        title: "DPP 4: HNSW efSearch Optimization Exercises",
        type: "Daily Practice Problem (DPP)",
        courseId: "course-3",
        courseTitle: "Autonomous Multi-Agent Systems & Swarms",
        batchName: "All Cohorts",
        fileSize: "1.1 MB",
        uploadedAt: "5 days ago",
        downloads: 140,
        tags: ["Practice Problems", "Recall Benchmarking"],
      },
      {
        id: "r4",
        title: "Agentic Swarm Supervisor Pattern Notebook",
        type: "Lab Notebook (IPYNB)",
        courseId: "course-3",
        courseTitle: "Autonomous Multi-Agent Systems & Swarms",
        batchName: "Cohort 4 (Live Sync)",
        fileSize: "3.4 MB",
        uploadedAt: "1 week ago",
        downloads: 87,
        tags: ["Jupyter", "LangGraph", "Multi-Agent"],
      },
    ];
    return this.getStorage<TeacherResourceItem[]>(KEY_RESOURCES, fallback);
  }

  saveResource(resource: TeacherResourceItem, requesterRole: string = "teacher"): void {
    if (requesterRole === "teacher") {
      console.error("Permission Denied: Teachers cannot upload or modify course resources/learning materials. Managed by Admin only.");
      return;
    }
    const resources = this.getResources();
    const index = resources.findIndex((r) => r.id === resource.id);
    if (index >= 0) {
      resources[index] = resource;
    } else {
      resources.unshift(resource);
    }
    this.setStorage(KEY_RESOURCES, resources);
  }

  deleteResource(id: string, requesterRole: string = "teacher"): void {
    if (requesterRole === "teacher") {
      console.error("Permission Denied: Teachers cannot delete official learning materials.");
      return;
    }
    const resources = this.getResources().filter((r) => r.id !== id);
    this.setStorage(KEY_RESOURCES, resources);
  }

  // 8. RECORDINGS
  getRecordings(): LectureRecording[] {
    const fallback = mockDataService.getRecordings();
    return this.getStorage<LectureRecording[]>(KEY_RECORDINGS, fallback);
  }

  saveRecording(recording: LectureRecording, requesterRole: string = "teacher"): void {
    if (requesterRole === "teacher") {
      console.error("Permission Denied: Teachers cannot modify or publish lecture recordings. Propose suggestions through the admin approval workflow.");
      return;
    }
    const recordings = this.getRecordings();
    const index = recordings.findIndex((r) => r.id === recording.id);
    if (index >= 0) {
      recordings[index] = recording;
    } else {
      recordings.unshift(recording);
    }
    this.setStorage(KEY_RECORDINGS, recordings);
  }

  getRecordingSuggestions(recordingId?: string): RecordingCorrectionSuggestion[] {
    const fallback: RecordingCorrectionSuggestion[] = [
      {
        id: "sug-1",
        recordingId: "rec-1",
        recordingTitle: "Lecture 12: Scaled Dot-Product Attention & PyTorch Internals",
        type: "transcript",
        targetTimeFormatted: "00:08:42",
        targetDetails: "Snippet at 08:42 incorrectly transcribed 'Softmax normalization' as 'Soft match normal'.",
        suggestedCorrection: "Replace 'Soft match normal' with 'Softmax normalization over key dimension sqrt(d_k)'.",
        urgency: "normal",
        submittedAt: "2026-10-14, 03:30 PM",
        status: "pending_admin_review",
      },
    ];
    const list = this.getStorage<RecordingCorrectionSuggestion[]>(KEY_RECORDING_SUGGESTIONS, fallback);
    if (recordingId) {
      return list.filter((s) => s.recordingId === recordingId);
    }
    return list;
  }

  submitRecordingSuggestion(suggestion: RecordingCorrectionSuggestion): void {
    const list = this.getStorage<RecordingCorrectionSuggestion[]>(KEY_RECORDING_SUGGESTIONS, [
      {
        id: "sug-1",
        recordingId: "rec-1",
        recordingTitle: "Lecture 12: Scaled Dot-Product Attention & PyTorch Internals",
        type: "transcript",
        targetTimeFormatted: "00:08:42",
        targetDetails: "Snippet at 08:42 incorrectly transcribed 'Softmax normalization' as 'Soft match normal'.",
        suggestedCorrection: "Replace 'Soft match normal' with 'Softmax normalization over key dimension sqrt(d_k)'.",
        urgency: "normal",
        submittedAt: "2026-10-14, 03:30 PM",
        status: "pending_admin_review",
      },
    ]);
    list.unshift(suggestion);
    this.setStorage(KEY_RECORDING_SUGGESTIONS, list);
  }

  // 9. DOUBTS QUEUE
  getDoubts(): StudentDoubt[] {
    const fallback = mockDataService.getDoubts();
    return this.getStorage<StudentDoubt[]>(KEY_DOUBTS, fallback);
  }

  saveDoubt(doubt: StudentDoubt): void {
    const doubts = this.getDoubts();
    const index = doubts.findIndex((d) => d.id === doubt.id);
    if (index >= 0) {
      doubts[index] = doubt;
    } else {
      doubts.unshift(doubt);
    }
    this.setStorage(KEY_DOUBTS, doubts);
  }

  // 10. ANNOUNCEMENTS
  getAnnouncements(): TeacherAnnouncementItem[] {
    const fallback: TeacherAnnouncementItem[] = [
      {
        id: "anc-1",
        title: "Live Studio Session 14: Multi-Agent Consensus tonight at 08:00 PM IST",
        body: "Please ensure your PyTorch environment has flash-attention installed before joining. Colab links have been updated in Module 2.",
        targetBatch: "Cohort 7 (Live + Replay)",
        targetCourse: "Full-Stack AI & LLM Systems",
        timestamp: "Today at 02:15 PM",
        channels: ["In-App", "Email", "SMS"],
        reachCount: 112,
      },
      {
        id: "anc-2",
        title: "Capstone 1 Deadline Extended by 24 Hours",
        body: "Due to high traffic on our GPU clusters, the submission deadline for Capstone 1 has been moved to Oct 21, 11:59 PM.",
        targetBatch: "Cohort 7 (Live + Replay)",
        targetCourse: "Full-Stack AI & LLM Systems",
        timestamp: "Yesterday",
        channels: ["In-App", "Email"],
        reachCount: 112,
      },
    ];
    return this.getStorage<TeacherAnnouncementItem[]>(KEY_ANNOUNCEMENTS, fallback);
  }

  saveAnnouncement(anc: TeacherAnnouncementItem): void {
    const list = this.getAnnouncements();
    list.unshift(anc);
    this.setStorage(KEY_ANNOUNCEMENTS, list);
  }

  // 11. MESSAGES
  getMessages(): TeacherStudentMessage[] {
    const fallback: TeacherStudentMessage[] = [
      {
        id: "msg-1",
        studentName: "Devendra Patel",
        studentEmail: "dev.patel@tech.in",
        subject: "Clarification on HNSW Vector Index recall vs latency",
        message: "Prof. Verma, when increasing M in HNSW, does memory consumption scale quadratically or linearly with vector dimension d?",
        timestamp: "1 hour ago",
        status: "unanswered",
        courseTitle: "Full-Stack AI & LLM Systems",
        batchName: "Cohort 7 (Live + Replay)",
      },
      {
        id: "msg-2",
        studentName: "Arjun Mehta",
        studentEmail: "arjun.m@learner.ai",
        subject: "Permission to audit Cohort 4 Advanced Vision replay",
        message: "I am writing my capstone on Multimodal tool calling. Would it be possible to get preview access to the Vision module?",
        timestamp: "Yesterday",
        status: "replied",
        replyText: "Granted Arjun. Support desk has updated your cohort entitlement.",
        courseTitle: "Full-Stack AI & LLM Systems",
        batchName: "Cohort 7 (Live + Replay)",
      },
    ];
    return this.getStorage<TeacherStudentMessage[]>(KEY_MESSAGES, fallback);
  }

  saveMessage(msg: TeacherStudentMessage): void {
    const list = this.getMessages();
    const index = list.findIndex((m) => m.id === msg.id);
    if (index >= 0) {
      list[index] = msg;
    } else {
      list.unshift(msg);
    }
    this.setStorage(KEY_MESSAGES, list);
  }

  // 12. PROFILE & SETTINGS
  getProfile(): TeacherProfileSettings {
    const fallback: TeacherProfileSettings = {
      name: "Prof. Rajesh Verma",
      title: "Lead AI Systems Faculty & Principal Researcher",
      email: "rajesh.verma@edulms.ai",
      phone: "+91 98450 12345",
      officeHours: "Mon & Thu: 04:00 PM – 06:00 PM IST",
      bio: "15+ years in distributed systems, neural networks, and large language model architectures. Ex-Principal Architect at DeepScale AI.",
      organization: "Apex AI Institute",
      role: "teacher",
      notifyDoubts: true,
      notifySubmissions: true,
      notifyLiveReminder: true,
      notifySmsAlerts: false,
    };
    return this.getStorage<TeacherProfileSettings>(KEY_PROFILE, fallback);
  }

  saveProfile(profile: TeacherProfileSettings): void {
    this.setStorage(KEY_PROFILE, { ...profile, role: "teacher" });
  }

  // 13. PERMISSIONS & GOVERNANCE HELPER
  getPermissions(): FacultyPermissions {
    return this.getStorage<FacultyPermissions>(KEY_PERMISSIONS, DEFAULT_FACULTY_PERMISSIONS);
  }

  isAuthorized(action: keyof FacultyPermissions): boolean {
    const perms = this.getPermissions();
    return !!perms[action];
  }
}

export const teacherDataService = new TeacherDataService();
