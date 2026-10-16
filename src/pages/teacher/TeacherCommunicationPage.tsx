import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { teacherDataService, TeacherAnnouncementItem } from "./teacherDataService";

export const TeacherCommunicationPage: React.FC = () => {
  const { role } = useAuth();
  const { addNotification } = useNotifications();

  const [announcements, setAnnouncements] = useState<TeacherAnnouncementItem[]>(() =>
    teacherDataService.getAnnouncements()
  );

  const students = teacherDataService.getStudents();
  const courses = teacherDataService.getCourses();

  // New Announcement Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetBatch, setTargetBatch] = useState("Cohort 7 (Live + Replay)");
  const [targetCourse, setTargetCourse] = useState("Full-Stack AI & LLM Systems");
  const [isSystemWide, setIsSystemWide] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);

  const reloadData = () => {
    setAnnouncements(teacherDataService.getAnnouncements());
  };

  // Dynamically compute student reach from student roster
  const getBatchReach = (batch: string, systemWide: boolean) => {
    if (systemWide) return 840;
    if (batch === "All Assigned Batches") {
      return students.length;
    }
    return students.filter((s) => s.batch === batch).length;
  };

  const currentReach = getBatchReach(targetBatch, isSystemWide);
  const totalAssignedReach = students.length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    // Platform-wide restriction check: Only Admin / Super Admin can broadcast institution-wide
    const canBroadcastSystemWide = role === "super-admin" || role === "admin";
    const effectiveSystemWide = canBroadcastSystemWide && isSystemWide;
    if (isSystemWide && !canBroadcastSystemWide) {
      addNotification({
        title: "Broadcast Scoped",
        message: "Your broadcast has been scoped to your assigned cohort.",
        type: "system",
      });
      setIsSystemWide(false);
    }

    const channels = ["In-App Portal"];
    if (sendEmail) channels.push("Simulated Email");
    if (sendSms) channels.push("Simulated SMS");

    const reach = getBatchReach(targetBatch, effectiveSystemWide);

    const newAnc: TeacherAnnouncementItem = {
      id: `anc-${Date.now()}`,
      title,
      body,
      targetBatch: effectiveSystemWide ? "All Institution Cohorts" : targetBatch,
      targetCourse,
      timestamp: "Just now",
      channels,
      reachCount: reach,
      isSystemWide: effectiveSystemWide,
    };

    teacherDataService.saveAnnouncement(newAnc);
    reloadData();
    setTitle("");
    setBody("");

    addNotification({
      title: "Announcement Dispatched (Simulation)",
      message: `Announcement broadcast recorded for ${reach} learners via ${channels.join(", ")} (frontend demo - external emails/SMS not sent).`,
      type: "class",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Communication & Announcements
            <Badge variant="accent" className="text-[10px] font-bold">
              Broadcaster Hub
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Broadcast class announcements, dispatch deadline reminders, and notify enrolled cohort learners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-xs px-3 py-1 font-semibold">
            Active Broadcast Reach: {totalAssignedReach} Enrolled Learners
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcaster Compose Form */}
        <Card className="lg:col-span-1 p-5 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="h-4 w-4 text-emerald-600" />
            Compose Class Announcement
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Cohort / Batch
              </label>
              <select
                disabled={isSystemWide}
                value={targetBatch}
                onChange={(e) => setTargetBatch(e.target.value)}
                className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white disabled:opacity-50"
              >
                <option value="Cohort 7 (Live + Replay)">
                  Cohort 7 (Live + Replay) - {students.filter((s) => s.batch.includes("7")).length} learners
                </option>
                <option value="Cohort 4 (Live Sync)">
                  Cohort 4 (Live Sync) - {students.filter((s) => s.batch.includes("4")).length} learners
                </option>
                <option value="All Assigned Batches">
                  All Assigned Batches ({students.length} learners)
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Course Scope
              </label>
              <select
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
                <option value="All Active Courses">All Active Courses</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Announcement Headline
              </label>
              <Input
                required
                placeholder="e.g. Schedule shift or Lab pre-requisites..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Detailed Message
              </label>
              <textarea
                required
                rows={4}
                placeholder="Provide complete instructions, meeting links, or prep materials..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Calculated Target Audience:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {currentReach} Learners
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">Scope Level:</span>
                {role === "admin" || role === "super-admin" ? (
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isSystemWide}
                      onChange={(e) => setIsSystemWide(e.target.checked)}
                      className="rounded text-rose-600"
                    />
                    <span className="font-semibold text-rose-600">Institution-Wide (Admin)</span>
                  </label>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[10px] text-slate-500 font-semibold border-slate-200 dark:border-white/10"
                  >
                    Cohort Scoped
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Email Notification</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>SMS Alert</span>
                </label>
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                * Note: Delivery is simulated in frontend state. Real emails and SMS are not dispatched.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer shadow-xs"
            >
              Send Broadcast Now
            </Button>
          </form>
        </Card>

        {/* Past Broadcast History */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Broadcast History & Delivery Telemetry
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {announcements.length} Dispatched
            </span>
          </div>

          {announcements.map((anc) => (
            <Card
              key={anc.id}
              className="p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-[10px]">
                    {anc.targetBatch}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">{anc.timestamp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {anc.channels.map((ch) => (
                    <span
                      key={ch}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#101713] text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{anc.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {anc.body}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-white/5">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Delivered to {anc.reachCount} cohort recipients (Simulated)
                </span>
                <span className="font-mono text-[10px]">Portal Ledger Synced</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCommunicationPage;
