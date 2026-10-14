import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Plus, Star, Users, Clock, ArrowRight, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { Course } from "@/types/lms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const CoursesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(mockDataService.getCourses());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newModalOpen, setNewModalOpen] = useState(false);

  // New course form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Generative AI");
  const [newPrice, setNewPrice] = useState("49999");
  const [newHours, setNewHours] = useState("60");

  const filteredCourses = courses.filter((c) => {
    const matchesQuery = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, "-"),
      description: "Comprehensive curriculum designed by top industry practitioners.",
      category: newCategory as any,
      level: "Intermediate",
      modulesCount: 8,
      totalHours: Number(newHours),
      rating: 5.0,
      enrolledStudentsCount: 0,
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      priceRupees: Number(newPrice),
      status: "active",
    };

    setCourses([newCourse, ...courses]);
    setNewTitle("");
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" /> Master Course Catalog
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Structured curriculum tracks, syllabus modules, and cohort associations.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setNewModalOpen(true)}
            className="text-xs h-9 font-bold gap-1 shadow-sm shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Create Course
          </Button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sleek-scrollbar">
            {["all", "LLM Engineering", "Agentic Systems", "Computer Vision", "MLOps"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Tracks" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => (
            <Card
              key={c.id}
              className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail header */}
                <div className="relative h-44 overflow-hidden bg-muted">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="accent" className="text-[10px] font-bold">
                      {c.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {c.rating}
                    </span>
                    <span className="font-mono font-bold text-sm">
                      ₹{c.priceRupees.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2.5">
                  <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-primary" /> {c.modulesCount} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {c.totalHours} hrs
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Users className="h-3.5 w-3.5 text-primary" /> {c.enrolledStudentsCount} enrolled
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/courses/${c.id}`)}
                  className="w-full text-xs h-9 font-bold gap-1 shadow-2xs"
                >
                  Manage Syllabus & Batches <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Create Course */}
        <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Create New Course Track</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set up a new cohort-based syllabus for the institute.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateCourse} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Course Title</label>
                <Input
                  required
                  placeholder="e.g. Distributed LLM Inference Systems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Track Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  <option value="LLM Engineering">LLM Engineering</option>
                  <option value="Agentic Systems">Agentic Systems</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="MLOps">MLOps</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Tuition Fee (₹)</label>
                  <Input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Total Hours</label>
                  <Input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setNewModalOpen(false)} className="text-xs h-9">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs h-9 font-bold">
                  Create Course
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
};
