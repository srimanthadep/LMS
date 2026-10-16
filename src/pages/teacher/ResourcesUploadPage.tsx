import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Code,
  Download,
  Eye,
  Search,
  Filter,
  Layers,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { teacherDataService, TeacherResourceItem } from "./teacherDataService";

export const ResourcesUploadPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [resources] = useState<TeacherResourceItem[]>(() =>
    teacherDataService.getResources()
  );
  const [courses] = useState(() => teacherDataService.getCourses());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");

  // Preview Modal
  const [previewResource, setPreviewResource] = useState<TeacherResourceItem | null>(null);

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || res.type === filterType;
    const matchesBatch = filterBatch === "all" || res.batchName === filterBatch;
    const matchesCourse = filterCourse === "all" || res.courseId === filterCourse;
    return matchesSearch && matchesType && matchesBatch && matchesCourse;
  });

  const handleDownloadCopy = (res: TeacherResourceItem) => {
    addNotification({
      title: "Reference Copy Downloaded",
      message: `Downloaded local instructor reference copy of "${res.title}".`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Learning Materials & Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Review lecture slide decks, starter repositories, Jupyter notebooks, and practice problem sets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-xs px-3 py-1 font-semibold">
            {resources.length} Assets in Library
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Curriculum Materials</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{resources.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Verified assets</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Student Downloads</span>
            <Download className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {resources.reduce((sum, r) => sum + (r.downloads || 0), 0)}
          </p>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">Cohort engagements</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Lab Notebooks</span>
            <Code className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {resources.filter((r) => r.type.includes("Code") || r.type.includes("IPYNB")).length}
          </p>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">Interactive code labs</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Associated Courses</span>
            <Layers className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{courses.length}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Across active syllabi</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search learning materials by title, course, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
            >
              <option value="all">All File Types</option>
              <option value="Slide Deck (PDF)">Slide Deck (PDF)</option>
              <option value="Source Code (ZIP)">Source Code (ZIP)</option>
              <option value="Lab Notebook (IPYNB)">Lab Notebook (IPYNB)</option>
              <option value="Daily Practice Problem (DPP)">Daily Practice Problem (DPP)</option>
              <option value="Dataset (JSON/CSV)">Dataset (JSON/CSV)</option>
            </select>

            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
            >
              <option value="all">All Cohorts</option>
              <option value="Cohort 7 (Live + Replay)">Cohort 7</option>
              <option value="Cohort 4 (Live Sync)">Cohort 4</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {filteredResources.length} curriculum assets</span>
          <span className="flex items-center gap-1 font-mono">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified Materials
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border/80">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-xs text-muted-foreground">No resources match your active search or filter filters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((res) => (
              <Card
                key={res.id}
                className="p-5 border-border/80 shadow-xs rounded-2xl bg-card flex flex-col justify-between space-y-4 hover:border-primary/40 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {res.type.includes("PDF") && <FileText className="h-5 w-5" />}
                        {res.type.includes("Code") && <Code className="h-5 w-5" />}
                        {res.type.includes("IPYNB") && <Sparkles className="h-5 w-5" />}
                        {res.type.includes("Dataset") && <FileSpreadsheet className="h-5 w-5" />}
                        {res.type.includes("DPP") && <BookOpen className="h-5 w-5" />}
                      </div>
                      <div>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold py-0.5">
                          {res.type}
                        </Badge>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {res.fileSize} • {res.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                      {res.downloads} downloads
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {res.courseTitle}
                    </p>
                    <p className="text-[11px] text-primary/80 font-medium truncate mt-0.5">
                      {res.moduleTitle}
                    </p>
                  </div>

                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-muted text-muted-foreground font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border/60">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewResource(res)}
                    className="h-8 text-xs font-semibold gap-1.5 flex-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-blue-600" /> Preview
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadCopy(res)}
                    className="h-8 text-xs font-semibold gap-1.5 flex-1 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-600" /> Reference
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">
                  Curriculum Asset Preview
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {previewResource.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101713] border border-slate-200 dark:border-white/10">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Material Format</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{previewResource.type}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">File Size</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{previewResource.fileSize}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Target Cohort</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{previewResource.batchName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Student Downloads</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {previewResource.downloads} hits
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Course & Module Context</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{previewResource.courseTitle}</p>
                <p className="text-slate-500 text-[11px]">{previewResource.moduleTitle}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101713] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                <p className="font-semibold flex items-center gap-1.5 mb-0.5 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Syllabus Verified
                </p>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  This document is aligned with current course milestones and available for student reference.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewResource(null)}
                className="text-xs cursor-pointer"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleDownloadCopy(previewResource);
                  setPreviewResource(null);
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesUploadPage;
