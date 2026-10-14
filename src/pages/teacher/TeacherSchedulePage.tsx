import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Plus,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { useNotifications } from "@/context/NotificationContext";

interface ScheduleSlot {
  id: string;
  title: string;
  type: "live-class" | "deadline" | "office-hours";
  time: string;
  batch: string;
  course: string;
  status: "live" | "upcoming" | "conflict";
}

const WEEK_DAYS = ["Mon (Oct 12)", "Tue (Oct 13)", "Wed (Oct 14)", "Thu (Oct 15)", "Fri (Oct 16)", "Sat (Oct 17)"];

export const TeacherSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [viewMode, setViewMode] = useState<"week" | "month" | "list">("week");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New Slot State
  const [slotTitle, setSlotTitle] = useState("");
  const [slotDate, setSlotDate] = useState("2026-10-15");
  const [slotTime, setSlotTime] = useState("18:00");
  const [slotBatch, setSlotBatch] = useState("Cohort 7 (Live + Replay)");
  const [hasConflict, setHasConflict] = useState(false);

  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([
    {
      id: "sl-1",
      title: "Lecture 14: Multi-Agent Consensus & Supervision",
      type: "live-class",
      time: "Today, 08:00 PM – 09:30 PM",
      batch: "Cohort 7 (Live + Replay)",
      course: "Full-Stack AI & LLM Systems",
      status: "upcoming",
    },
    {
      id: "sl-2",
      title: "Capstone 1 Submissions Cutoff",
      type: "deadline",
      time: "Oct 20, 11:59 PM",
      batch: "Cohort 7 (Live + Replay)",
      course: "Full-Stack AI & LLM Systems",
      status: "upcoming",
    },
    {
      id: "sl-3",
      title: "Faculty Mentorship Office Hours",
      type: "office-hours",
      time: "Thu, 04:00 PM – 06:00 PM",
      batch: "Open to All Cohorts",
      course: "Direct 1-on-1 Guidance",
      status: "upcoming",
    },
    {
      id: "sl-4",
      title: "Lecture 9: Autonomous Swarm Tool Routing",
      type: "live-class",
      time: "Sat, 11:00 AM – 01:00 PM",
      batch: "Cohort 4 (Live Sync)",
      course: "Autonomous Multi-Agent Architectures",
      status: "upcoming",
    },
  ]);

  const handleTimeChange = (timeVal: string) => {
    setSlotTime(timeVal);
    // Conflict detection simulation: conflict if 18:00 on Oct 14
    if (slotDate === "2026-10-14" && (timeVal === "18:00" || timeVal === "20:00")) {
      setHasConflict(true);
    } else {
      setHasConflict(false);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasConflict) {
      addNotification({
        title: "Schedule Conflict Detected",
        message: "This slot collides with another faculty lecture or scheduled cohort timetable. Choose another time.",
        type: "class",
      });
      return;
    }

    const created: ScheduleSlot = {
      id: `sl-${Date.now()}`,
      title: slotTitle || "Scheduled Live Lecture",
      type: "live-class",
      time: `${slotDate} at ${slotTime}`,
      batch: slotBatch,
      course: "Full-Stack AI & LLM Systems",
      status: "upcoming",
    };

    setScheduleSlots([...scheduleSlots, created]);
    setShowScheduleModal(false);
    setSlotTitle("");

    addNotification({
      title: "Class Scheduled Successfully",
      message: `${created.title} added to calendar with zero timetable conflicts.`,
      type: "class",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Calendar & Timetable Engine
            <Badge variant="accent" className="text-[10px] font-bold">
              Conflict-Free
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronize live synchronous lectures, office hours, and assignment deadlines with automated cohort conflict detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "week" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "list" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Agenda List
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setShowScheduleModal(true)}
            className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Class
          </Button>
        </div>
      </div>

      {/* Week Grid Calendar View */}
      {viewMode === "week" && (
        <Card className="border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <CalendarIcon className="h-4 w-4 text-emerald-600" />
              <span>Teaching Week: 12 Oct – 17 Oct 2026</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Live Class
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ml-2" /> Deadline
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block ml-2" /> Office Hours
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {WEEK_DAYS.map((day, idx) => (
              <div key={day} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 min-h-[220px] space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block text-center border-b border-slate-200 pb-1.5">
                  {day}
                </span>

                {idx === 2 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1">
                    <span className="text-[9px] font-bold text-emerald-800 uppercase block font-mono">08:00 PM</span>
                    <p className="text-[11px] font-bold text-emerald-950 leading-tight">
                      Lecture 14: Multi-Agent Consensus
                    </p>
                    <p className="text-[10px] text-emerald-700">Cohort 7</p>
                    <button
                      onClick={() => navigate("/teacher/classroom/class-agentic-101")}
                      className="text-[10px] font-bold text-emerald-700 hover:underline block pt-1 cursor-pointer"
                    >
                      Enter Studio →
                    </button>
                  </div>
                )}

                {idx === 3 && (
                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-300 space-y-1">
                    <span className="text-[9px] font-bold text-purple-800 uppercase block font-mono">04:00 PM</span>
                    <p className="text-[11px] font-bold text-purple-950 leading-tight">Faculty Office Hours</p>
                    <p className="text-[10px] text-purple-700">Open Mentorship</p>
                  </div>
                )}

                {idx === 5 && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1">
                    <span className="text-[9px] font-bold text-emerald-800 uppercase block font-mono">11:00 AM</span>
                    <p className="text-[11px] font-bold text-emerald-950 leading-tight">Lecture 9: Tool Routing</p>
                    <p className="text-[10px] text-emerald-700">Cohort 4</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Agenda List View */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Upcoming Scheduled Commitments</h3>
        {scheduleSlots.map((slot) => (
          <Card key={slot.id} className="p-4 border-slate-200 bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  slot.type === "live-class"
                    ? "bg-emerald-100 text-emerald-800"
                    : slot.type === "deadline"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {slot.type === "live-class" && <Video className="h-5 w-5" />}
                {slot.type === "deadline" && <FileCheck2 className="h-5 w-5" />}
                {slot.type === "office-hours" && <Clock className="h-5 w-5" />}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{slot.title}</h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {slot.time} • <span className="font-semibold text-slate-700">{slot.batch}</span>
                </p>
              </div>
            </div>

            {slot.type === "live-class" && (
              <Button
                size="sm"
                onClick={() => navigate("/teacher/classroom/class-agentic-101")}
                className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Launch Studio
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Schedule Class Modal with Conflict Detector */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Live Lecture Session</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Lecture Topic</label>
                <Input
                  required
                  placeholder="e.g. Lecture 15: Agent Swarm Tool Routing"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Target Cohort</label>
                <select
                  value={slotBatch}
                  onChange={(e) => setSlotBatch(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-slate-200 px-2"
                >
                  <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
                  <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Date</label>
                  <Input
                    type="date"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Start Time</label>
                  <Input
                    type="time"
                    value={slotTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Conflict Detection Banner */}
              {hasConflict ? (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Schedule Conflict Detected:</span>
                    <p className="text-[11px] mt-0.5">
                      Cohort 7 already has "Multi-Agent Consensus" scheduled at this time. Pick another slot to avoid collision.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Slot is available with zero student or room conflicts.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={hasConflict}
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                >
                  Confirm & Sync Timetable
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSchedulePage;
