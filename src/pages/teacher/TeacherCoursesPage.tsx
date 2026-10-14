import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Search,
  Users,
  Clock,
  Layers,
  Star,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  Upload,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Course } from "@/types/lms";

export const TeacherCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(mockDataService.getCourses());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Course Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"Generative AI" | "LLM Engineering" | "Agentic Systems" | "Computer Vision" | "MLOps">("LLM Engineering");
  const [newLevel, setNewLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Advanced");
  const [newDescription, setNewDescription] = useState("");
  const [newModulesCount, setNewModulesCount] = useState(8);

  const categories = ["all", "LLM Engineering", "Agentic Systems", "Computer Vision", "MLOps"];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: newDescription || "Comprehensive curriculum covering real-time AI and hands-on systems.",
      category: newCategory,
      level: newLevel,
      modulesCount: Number(newModulesCount),
      totalHours: Number(newModulesCount) * 7,
      rating: 5.0,
      enrolledStudentsCount: 0,
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      priceRupees: 49999,
      status: "active",
    };

    setCourses([newCourse, ...courses]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Course Management
            <Badge variant="accent" className="text-[10px] font-bold">
              Prof. Rajesh Verma
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your authorized syllabi, organize modules and chapters, author learning paths, and upload cohort materials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Course
          </Button>
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#151f1a] p-3 rounded-xl border border-slate-200 dark:border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search assigned courses or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 dark:bg-[#101713] border-slate-200 dark:border-white/10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                  : "bg-slate-50 dark:bg-[#101713] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100"
              }`}
            >
              {cat === "all" ? "All Domains" : cat}
            </button>
          ))}
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
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Published
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
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

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Course Syllabus</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Course Title</label>
                <Input
                  required
                  placeholder="e.g. Distributed Agent Swarms & Reasoning"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Domain / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white"
                  >
                    <option value="LLM Engineering">LLM Engineering</option>
                    <option value="Agentic Systems">Agentic Systems</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="MLOps">MLOps</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Modules & Chapters
                </label>
                <Input
                  type="number"
                  min={1}
                  max={24}
                  value={newModulesCount}
                  onChange={(e) => setNewModulesCount(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Curriculum Summary & Objectives
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline core prerequisites, learning objectives, and lab components..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Create & Open Editor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesPage;
