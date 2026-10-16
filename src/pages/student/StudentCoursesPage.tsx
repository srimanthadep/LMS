import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Video,
  PlaySquare,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  FileText,
  FileCheck2,
  Star,
  Users,
  Search,
  Bookmark,
  ChevronDown,
  ArrowUpDown,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeviceCheckModal } from "@/components/shared/DeviceCheckModal";

interface EnrolledCourseInfo {
  id: string;
  courseId: string;
  title: string;
  description: string;
  cohort: string;
  faculty: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  accessType: "Live & Replay" | "Replay Only";
  status: "Ongoing" | "Completed";
  nextClassTime: string;
  assignmentsDue: number;
  notesCount: number;
  ratingGiven: number;
  accentType: "rose" | "purple";
  lastAccessed: number; // timestamp for sorting
}

export const StudentCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("class-agentic-101");
  const [filterStatus, setFilterStatus] = useState<"All" | "Ongoing" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"Last Accessed" | "Progress" | "Title">("Last Accessed");
  const [sortOpen, setSortOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const enrolledCourses: EnrolledCourseInfo[] = [
    {
      id: "enr-1",
      courseId: "course-agentic-101",
      title: "Full-Stack AI Engineering & Autonomous Agents",
      description:
        "Build and deploy end-to-end AI systems with LLMs, agent frameworks, and modern full-stack development tools.",
      cohort: "Cohort 7 (Live + Replay)",
      faculty: "Prof. Rajesh Verma",
      progress: 85,
      completedModules: 28,
      totalModules: 32,
      accessType: "Live & Replay",
      status: "Ongoing",
      nextClassTime: "Today at 06:30 PM IST",
      assignmentsDue: 1,
      notesCount: 14,
      ratingGiven: 5,
      accentType: "rose",
      lastAccessed: 1729000000000,
    },
    {
      id: "enr-2",
      courseId: "course-kv-cache",
      title: "Distributed Systems & KV-Cache Infrastructure",
      description:
        "Deep dive into distributed systems, KV-cache, scalable infrastructure, and real-world LLM deployment architectures.",
      cohort: "Cohort 6 (Replay Specialist)",
      faculty: "Karthik Sundaram",
      progress: 72,
      completedModules: 18,
      totalModules: 24,
      accessType: "Replay Only",
      status: "Ongoing",
      nextClassTime: "Replay Available (Instant)",
      assignmentsDue: 0,
      notesCount: 8,
      ratingGiven: 5,
      accentType: "purple",
      lastAccessed: 1728900000000,
    },
  ];

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredAndSortedCourses = useMemo(() => {
    return enrolledCourses
      .filter((c) => {
        const matchesFilter = filterStatus === "All" || c.status === filterStatus;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          c.title.toLowerCase().includes(query) ||
          c.faculty.toLowerCase().includes(query) ||
          c.cohort.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "Progress") {
          return b.progress - a.progress;
        }
        if (sortBy === "Title") {
          return a.title.localeCompare(b.title);
        }
        // Default: Last Accessed
        return b.lastAccessed - a.lastAccessed;
      });
  }, [enrolledCourses, filterStatus, searchQuery, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1 sm:px-2">
      {/* 1. Header with Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-[#e11d48]" strokeWidth={2.2} />
            My Courses
          </h1>
        </div>
      </div>

      {/* 2. Filter, Search & Sort Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search enrolled courses or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-11 pr-4 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-rose-500 shadow-2xs"
          />
        </div>

        {/* Right side controls: Filter Pills + Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
          {/* Segmented Filter Pills */}
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterStatus("All")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "All"
                  ? "bg-[#e11d48] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100/60"
              }`}
            >
              All Enrolled ({enrolledCourses.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("Ongoing")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "Ongoing"
                  ? "bg-[#e11d48] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100/60"
              }`}
            >
              Ongoing
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("Completed")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "Completed"
                  ? "bg-[#e11d48] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100/60"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
              <span>
                Sort by: <strong className="font-semibold text-slate-900">{sortBy}</strong>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white border border-slate-200 shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                {(["Last Accessed", "Progress", "Title"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSortBy(option);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      sortBy === option
                        ? "text-rose-600 bg-rose-50/60 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{option}</span>
                    {sortBy === option && <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Two Course Cards Side by Side (Desktop Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {filteredAndSortedCourses.map((c) => {
          const isBookmarked = bookmarkedIds.has(c.id);

          return (
            <div
              key={c.id}
              className={`rounded-3xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative border ${
                c.accentType === "rose"
                  ? "border-rose-100 hover:border-rose-200/80"
                  : "border-purple-100/90 hover:border-purple-200/80"
              }`}
            >
              <div className="space-y-4">
                {/* Card Top Row: Badges & Bookmark */}
                <div className="flex items-center justify-between">
                  {/* Left Access Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-xs font-semibold text-rose-600">
                    <span className="h-2 w-2 rounded-full bg-rose-600 shrink-0" />
                    {c.accessType}
                  </span>

                  {/* Right Badges: Status + Bookmark */}
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      {c.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(c.id)}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark Course"}
                      className="w-8 h-8 rounded-xl border border-rose-100 bg-white hover:bg-rose-50/80 flex items-center justify-center text-rose-500 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Bookmark
                        className={`h-4 w-4 text-rose-500 ${isBookmarked ? "fill-rose-500" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Course Thumbnail + Title + Faculty Row */}
                <div className="flex items-start gap-4 pt-1">
                  {/* Stylized Thumbnail Graphic matching Reference */}
                  {c.accentType === "rose" ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#881337] via-[#9f1239] to-[#4c0519] flex items-center justify-center shrink-0 shadow-sm border border-rose-900/30">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-rose-200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="14" x="2" y="3" rx="2" />
                        <line x1="8" x2="16" y1="21" y2="21" />
                        <line x1="12" x2="12" y1="17" y2="21" />
                        <path d="M6 7.5h4" />
                        <path d="M6 10h6" />
                        <path d="M14 9.5l2 1.5-2 1.5" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#e0e7ff] via-[#d8b4fe] to-[#c084fc] flex items-center justify-center shrink-0 shadow-sm border border-purple-200">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-purple-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                      </svg>
                    </div>
                  )}

                  {/* Title & Faculty Info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
                      {c.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-normal">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {c.faculty}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {c.cohort}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {c.description}
                </p>

                {/* Progress Section */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Course Completion Progress</span>
                    <span className="font-bold text-sm text-[#e11d48]">{c.progress}%</span>
                  </div>

                  {/* Progress Bar with vibrant crimson fill */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#e11d48] h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  {/* Bottom Line: Completed Modules + Next Session Time */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                    <span>
                      {c.completedModules} of {c.totalModules} modules completed
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                      {c.accentType === "rose" ? (
                        <Calendar className="h-3.5 w-3.5 text-rose-600" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-rose-600" />
                      )}
                      Next: {c.nextClassTime}
                    </span>
                  </div>
                </div>

                {/* 3 Metric Cards: Assignments, Self Notes, Feedback */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                  {/* Box 1: Assignments */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center gap-2 sm:gap-2.5">
                    {c.assignmentsDue > 0 ? (
                      <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-slate-500 block leading-tight font-medium">
                        Assignments
                      </span>
                      <span
                        className={`text-xs font-bold block leading-tight truncate ${
                          c.assignmentsDue > 0 ? "text-amber-600" : "text-slate-800"
                        }`}
                      >
                        {c.assignmentsDue > 0 ? `${c.assignmentsDue} Pending` : "All Done"}
                      </span>
                    </div>
                  </div>

                  {/* Box 2: Self Notes */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center gap-2 sm:gap-2.5">
                    <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-slate-500 block leading-tight font-medium">
                        Self Notes
                      </span>
                      <span className="text-xs font-bold text-slate-800 block leading-tight truncate">
                        {c.notesCount} Saved
                      </span>
                    </div>
                  </div>

                  {/* Box 3: Feedback */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center gap-2 sm:gap-2.5">
                    <Star className="h-5 w-5 text-amber-400 stroke-amber-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-slate-500 block leading-tight font-medium">
                        Feedback
                      </span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1 leading-tight">
                        <span className="text-amber-500 font-normal">★</span> {c.ratingGiven}.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons at Bottom of Card */}
              <div className="space-y-2.5 pt-5">
                {/* Row 1: Join Live Studio + Replay Videos (or Replay Only) */}
                {c.accessType === "Live & Replay" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClassId("class-agentic-101");
                        setDeviceModalOpen(true);
                      }}
                      className="bg-[#e11d48] hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Live Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/student/replays")}
                      className="border border-rose-300 bg-white hover:bg-rose-50/80 text-rose-600 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <PlaySquare className="h-4 w-4 text-rose-600" />
                      <span>Replay Videos</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/student/replays")}
                    className="w-full border border-rose-300 bg-white hover:bg-rose-50/80 text-rose-600 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PlaySquare className="h-4 w-4 text-rose-600" />
                    <span>Replay Videos</span>
                  </button>
                )}

                {/* Row 2: View Full Curriculum, Notes & Tests */}
                <button
                  type="button"
                  onClick={() => navigate(`/student/courses/${c.courseId}`)}
                  className="w-full bg-rose-50/70 hover:bg-rose-100/80 text-rose-600 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-rose-600" />
                  <span>View Full Curriculum, Notes & Tests</span>
                  <ArrowRight className="h-4 w-4 text-rose-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware Pre-Join Modal */}
      <DeviceCheckModal
        open={deviceModalOpen}
        onOpenChange={setDeviceModalOpen}
        targetClassId={selectedClassId}
        classTitle="Session 4: Multi-Agent Consensus & Hierarchical Supervision"
      />
    </div>
  );
};
