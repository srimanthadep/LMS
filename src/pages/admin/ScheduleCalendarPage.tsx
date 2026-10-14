import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, Video, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { LiveClassSession } from "@/types/lms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export const ScheduleCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<LiveClassSession[]>(mockDataService.getLiveClasses());
  const [newModalOpen, setNewModalOpen] = useState(false);

  // New lecture state
  const [title, setTitle] = useState("");
  const [batchId, setBatchId] = useState("batch-c7-live");
  const [scheduledAt, setScheduledAt] = useState("Tomorrow, 08:00 PM IST");
  const [durationMinutes, setDurationMinutes] = useState("90");

  const batches = mockDataService.getBatches();

  const handleScheduleClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const b = batches.find((x) => x.id === batchId) || batches[0];

    const newClass: LiveClassSession = {
      id: `class-${Date.now()}`,
      batchId: b.id,
      batchName: b.name,
      courseTitle: b.courseTitle,
      title,
      description: "Scheduled live interactive technical session.",
      instructorId: b.teacherId,
      instructorName: b.teacherName,
      scheduledAt,
      durationMinutes: Number(durationMinutes),
      status: "scheduled",
      viewerCount: 0,
    };

    setClasses([newClass, ...classes]);
    setTitle("");
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" /> Master Class Scheduler & Timetable
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Live broadcast timetable management across all active educational cohorts.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setNewModalOpen(true)}
            className="text-xs h-9 font-bold gap-1 shadow-sm shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Schedule New Class
          </Button>
        </div>

        {/* Calendar Day Header */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-bold text-sm text-foreground">Week of October 12 - 18, 2026</span>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Badge variant="outline" className="text-xs">
            {classes.length} Sessions Scheduled
          </Badge>
        </div>

        {/* Timetable Cards Stream */}
        <div className="space-y-3.5">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card hover:border-primary/40 transition-colors p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{cls.title}</span>
                  {cls.status === "live" ? (
                    <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4">LIVE STREAMING</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">SCHEDULED</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Course: <strong>{cls.courseTitle}</strong> • Cohort: {cls.batchName}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 font-mono text-primary font-bold">
                    <Clock className="h-3.5 w-3.5" /> {cls.scheduledAt}
                  </span>
                  <span>Duration: {cls.durationMinutes} mins</span>
                  <span>Instructor: {cls.instructorName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {cls.status === "live" ? (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => navigate("/admin/live-monitor")}
                    className="h-9 text-xs font-bold gap-1 shadow-xs"
                  >
                    <Video className="h-3.5 w-3.5" /> Join Monitor
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 text-xs font-semibold"
                  >
                    Reschedule
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Schedule Class */}
        <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Schedule Live Virtual Class</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set up a new live broadcast session on student & faculty calendars.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleScheduleClass} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Lecture Title</label>
                <Input
                  required
                  placeholder="e.g. Session 10: Reranker Benchmarking & Lost-in-the-Middle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Target Cohort</label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.entitlement.accessType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Date & Time</label>
                  <Input
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Duration (mins)</label>
                  <Input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setNewModalOpen(false)} className="text-xs h-9">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs h-9 font-bold">
                  Publish to Timetable
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
};
