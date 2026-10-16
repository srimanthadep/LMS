import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Search,
  Users,
  Clock,
  Layers,
  Star,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingUp,
  Archive,
  ArrowUpDown,
} from "lucide-react";
import { teacherDataService } from "./teacherDataService";
import { Course } from "@/types/lms";
import { useNotifications } from "@/context/NotificationContext";

export const TeacherCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [courses, setCourses] = useState<Course[]>(() => teacherDataService.getCourses());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"students" | "hours" | "title" | "rating">("students");

  const categories = ["all", "LLM Engineering", "Agentic Systems", "Computer Vision", "MLOps", "Generative AI"];

  const filteredCourses = courses
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || (c.status || "active") === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "students") return b.enrolledStudentsCount - a.enrolledStudentsCount;
      if (sortBy === "hours") return b.totalHours - a.totalHours;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Assigned Courses
            <Badge variant="accent" className="text-[10px] font-bold">
              Prof. Rajesh Verma
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review your assigned syllabi, inspect module structures, track student enrollment, and review official learning materials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-xs px-3 py-1 font-semibold">
            {courses.length} Active Courses
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Assigned Courses</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{courses.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Active curriculum scope</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Students</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {courses.reduce((acc, c) => acc + c.enrolledStudentsCount, 0)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Across all cohort batches</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Modules</span>
            <Layers className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {courses.reduce((acc, c) => acc + c.modulesCount, 0)}
          </p>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">Verified lesson chapters</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg Faculty Rating</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">4.89 / 5.0</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">From 840+ peer reviews</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#151f1a] p-3 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search assigned courses or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 dark:bg-[#101713] border-slate-200 dark:border-white/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
            <option value="archived">Archived Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713] px-2 text-slate-700 dark:text-slate-300"
          >
            <option value="students">Sort: Most Students</option>
            <option value="hours">Sort: Total Hours</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="title">Sort: Course Title A-Z</option>
          </select>

          {/* Domain tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap border ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-slate-50 dark:bg-[#101713] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#18241d]"
                }`}
              >
                {cat === "all" ? "All Domains" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="group overflow-hidden border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge className="bg-emerald-600 text-white border-0 text-[10px] font-semibold">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="bg-black/60 text-white border-white/20 text-[10px]">
                    {course.level}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <Badge
                    className={`text-[10px] uppercase font-bold ${
                      course.status === "active"
                        ? "bg-emerald-500 text-white"
                        : course.status === "draft"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-600 text-white"
                    }`}
                  >
                    {course.status || "active"}
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 text-[11px] font-medium">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    {course.enrolledStudentsCount} Learners
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    {course.totalHours} hrs live
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-slate-400" />
                    {course.modulesCount} Core Modules
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {course.rating.toFixed(1)} Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/teacher/courses/${course.id}`)}
                className="w-full text-xs font-semibold gap-1.5 border-slate-200 dark:border-white/10 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 cursor-pointer"
              >
                <span>Curriculum & Lessons</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherCoursesPage;
