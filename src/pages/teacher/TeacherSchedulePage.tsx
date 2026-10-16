import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
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
  CheckCircle2,
  CalendarDays,
  List,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { teacherDataService, TeacherScheduleSlot } from "./teacherDataService";
import { useNotifications } from "@/context/NotificationContext";

// Helper to get formatted local date string YYYY-MM-DD
const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const TeacherSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const todayStr = useMemo(() => getLocalDateString(), []);

  const [scheduleSlots, setScheduleSlots] = useState<TeacherScheduleSlot[]>(() =>
    teacherDataService.getScheduleSlots()
  );
  const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "list">("week");
  const [selectedDayDate, setSelectedDayDate] = useState<string>(todayStr);

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TeacherScheduleSlot | null>(null);

  // Slot Form State
  const [slotTitle, setSlotTitle] = useState("");
  const [slotType, setSlotType] = useState<TeacherScheduleSlot["type"]>("live-class");
  const [slotDate, setSlotDate] = useState<string>(todayStr);
  const [slotStartTime, setSlotStartTime] = useState("18:00");
  const [slotEndTime, setSlotEndTime] = useState("19:30");
  const [slotBatch, setSlotBatch] = useState("Cohort 7 (Live + Replay)");
  const [slotCourse, setSlotCourse] = useState("Full-Stack AI & LLM Systems");
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictReason, setConflictReason] = useState("");

  const reloadSlots = () => {
    setScheduleSlots(teacherDataService.getScheduleSlots());
  };

  // Conflict Detection Function
  const checkConflicts = (
    date: string,
    start: string,
    end: string,
    batch: string,
    course: string,
    ignoreId?: string
  ) => {
    // 1. Validate that end time is strictly after start time
    if (!start || !end) {
      setHasConflict(true);
      setConflictReason("Start time and end time are required.");
      return;
    }

    if (end <= start) {
      setHasConflict(true);
      setConflictReason("End time must be strictly later than start time.");
      return;
    }

    // 2. Overlap detection across active slots
    const collision = scheduleSlots.find((s) => {
      if (ignoreId && s.id === ignoreId) return false;
      if (s.date !== date || s.status === "cancelled") return false;

      const sameBatch = s.batch === batch || batch.includes("All") || s.batch.includes("All");
      const sameCourse = s.course === course || !course;
      if (!sameBatch && !sameCourse) return false;

      const overlaps = start < s.endTime && end > s.startTime;
      return overlaps;
    });

    if (collision) {
      setHasConflict(true);
      setConflictReason(
        `Slot collides with "${collision.title}" (${collision.startTime} – ${collision.endTime}) for ${collision.batch}.`
      );
    } else {
      setHasConflict(false);
      setConflictReason("");
    }
  };

  // Run validation whenever form inputs change
  useEffect(() => {
    if (showScheduleModal) {
      checkConflicts(
        slotDate,
        slotStartTime,
        slotEndTime,
        slotBatch,
        slotCourse,
        editingSlot?.id
      );
    }
  }, [slotDate, slotStartTime, slotEndTime, slotBatch, slotCourse, editingSlot, showScheduleModal]);

  // Dynamic 7-day week based on selectedDayDate
  const currentWeekDays = useMemo(() => {
    try {
      const [year, month, day] = selectedDayDate.split("-").map(Number);
      const ref = new Date(year, month - 1, day);
      const dayOfWeek = (ref.getDay() + 6) % 7; // Mon = 0, Sun = 6
      const monday = new Date(ref);
      monday.setDate(ref.getDate() - dayOfWeek);

      const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        days.push({
          label: labels[i],
          date: getLocalDateString(d),
          displayNumber: d.getDate(),
        });
      }
      return days;
    } catch {
      return [];
    }
  }, [selectedDayDate]);

  // Dynamic month days calculation
  const currentMonthData = useMemo(() => {
    try {
      const [year, month] = selectedDayDate.split("-").map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const totalDays = new Date(year, month, 0).getDate();
      const monthName = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const startingDayOffset = (firstDay.getDay() + 6) % 7; // Mon = 0

      return { year, month, totalDays, monthName, startingDayOffset };
    } catch {
      return { year: 2026, month: 10, totalDays: 31, monthName: "October 2026", startingDayOffset: 3 };
    }
  }, [selectedDayDate]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (slotEndTime <= slotStartTime) {
      addNotification({
        title: "Invalid Session Time",
        message: "End time must be later than start time.",
        type: "class",
      });
      return;
    }

    if (hasConflict) {
      addNotification({
        title: "Schedule Conflict Detected",
        message: conflictReason,
        type: "class",
      });
      return;
    }

    const created: TeacherScheduleSlot = {
      id: editingSlot ? editingSlot.id : `sl-${Date.now()}`,
      title: slotTitle.trim() || "Scheduled Session",
      type: slotType,
      date: slotDate,
      startTime: slotStartTime,
      endTime: slotEndTime,
      batch: slotBatch,
      course: slotCourse,
      status: "upcoming",
      meetingUrl: slotType === "live-class" ? "/teacher/classroom/class-agentic-101" : undefined,
    };

    teacherDataService.saveScheduleSlot(created);
    reloadSlots();
    setSelectedDayDate(slotDate);
    setShowScheduleModal(false);
    setEditingSlot(null);
    setSlotTitle("");

    addNotification({
      title: editingSlot ? "Class Rescheduled" : "Class Scheduled Successfully",
      message: `${created.title} synced to cohort calendar (local simulation - student reminders simulated).`,
      type: "class",
    });
  };

  const handleCancelSlot = (slot: TeacherScheduleSlot) => {
    if (window.confirm(`Are you sure you want to cancel "${slot.title}"?`)) {
      const updated: TeacherScheduleSlot = { ...slot, status: "cancelled" };
      teacherDataService.saveScheduleSlot(updated);
      reloadSlots();
      addNotification({
        title: "Session Cancelled",
        message: `"${slot.title}" has been marked as cancelled (local simulation - external alerts simulated).`,
        type: "class",
      });
    }
  };

  const openEditModal = (slot: TeacherScheduleSlot) => {
    setEditingSlot(slot);
    setSlotTitle(slot.title);
    setSlotType(slot.type);
    setSlotDate(slot.date);
    setSlotStartTime(slot.startTime);
    setSlotEndTime(slot.endTime);
    setSlotBatch(slot.batch);
    setSlotCourse(slot.course);
    setHasConflict(false);
    setConflictReason("");
    setShowScheduleModal(true);
  };

  const openNewSlotModal = (presetDate?: string) => {
    setEditingSlot(null);
    setSlotTitle("");
    setSlotType("live-class");
    setSlotDate(presetDate || selectedDayDate || todayStr);
    setSlotStartTime("18:00");
    setSlotEndTime("19:30");
    setSlotBatch("Cohort 7 (Live + Replay)");
    setSlotCourse("Full-Stack AI & LLM Systems");
    setHasConflict(false);
    setConflictReason("");
    setShowScheduleModal(true);
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
            Synchronize live synchronous lectures, office hours, and assessment deadlines with automated conflict detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] p-0.5">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "day" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "week" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "month" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                viewMode === "list" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Agenda
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => openNewSlotModal()}
            className="h-9 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Class
          </Button>
        </div>
      </div>

      {/* VIEW 1: WEEK GRID */}
      {viewMode === "week" && (
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <CalendarIcon className="h-4 w-4 text-emerald-600" />
              <span>
                Teaching Week: {currentWeekDays[0]?.date} – {currentWeekDays[6]?.date}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Live Class
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ml-2" /> Deadline
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block ml-2" /> Office Hours
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {currentWeekDays.map((day) => {
              const daySlots = scheduleSlots.filter(
                (s) => s.date === day.date && s.status !== "cancelled"
              );
              const isSelectedDay = day.date === selectedDayDate;
              const isToday = day.date === todayStr;

              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDayDate(day.date)}
                  className={`rounded-xl border p-2.5 min-h-[220px] space-y-2 cursor-pointer transition ${
                    isSelectedDay
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500/50"
                      : "border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#121c17]"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-1.5">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {day.label} ({day.displayNumber})
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold bg-primary text-primary-foreground px-1 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  {daySlots.length === 0 ? (
                    <div className="text-center pt-8 space-y-1">
                      <span className="text-[10px] text-slate-400 italic block">No events</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openNewSlotModal(day.date);
                        }}
                        className="text-[10px] text-primary hover:underline font-semibold"
                      >
                        + Add slot
                      </button>
                    </div>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-2 rounded-lg border text-xs space-y-1 ${
                          slot.type === "live-class"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-950 dark:text-emerald-200"
                            : slot.type === "deadline"
                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-950 dark:text-amber-200"
                            : "bg-purple-50 dark:bg-purple-950/40 border-purple-300 text-purple-950 dark:text-purple-200"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                          <span>{slot.startTime}</span>
                          <span className="capitalize">{slot.type}</span>
                        </div>
                        <p className="font-bold text-[11px] leading-tight line-clamp-2">{slot.title}</p>
                        <p className="text-[10px] opacity-80 truncate">{slot.batch}</p>

                        <div className="flex justify-between items-center pt-1">
                          {slot.type === "live-class" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/teacher/classroom/class-agentic-101");
                              }}
                              className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              Studio →
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(slot);
                            }}
                            className="text-[10px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* VIEW 2: DAY VIEW */}
      {viewMode === "day" && (
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Schedule: {selectedDayDate}
              </h3>
              {selectedDayDate === todayStr && (
                <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 border-emerald-300">
                  Today
                </Badge>
              )}
            </div>
            <Input
              type="date"
              value={selectedDayDate}
              onChange={(e) => setSelectedDayDate(e.target.value)}
              className="h-8 text-xs w-44"
            />
          </div>

          <div className="space-y-3">
            {scheduleSlots.filter((s) => s.date === selectedDayDate).length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-xs text-slate-400 italic">
                  No classes, deadlines, or office hours scheduled for {selectedDayDate}.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openNewSlotModal(selectedDayDate)}
                  className="text-xs font-semibold"
                >
                  Schedule an event for this day
                </Button>
              </div>
            ) : (
              scheduleSlots
                .filter((s) => s.date === selectedDayDate)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#121c17] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs ${
                          slot.type === "live-class"
                            ? "bg-emerald-100 text-emerald-800"
                            : slot.type === "deadline"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {slot.type === "live-class" && <Video className="h-6 w-6" />}
                        {slot.type === "deadline" && <FileCheck2 className="h-6 w-6" />}
                        {slot.type === "office-hours" && <Clock className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{slot.title}</h4>
                          {slot.status === "cancelled" && (
                            <Badge variant="destructive" className="text-[9px]">CANCELLED</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {slot.startTime} – {slot.endTime} • {slot.batch} • {slot.course}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(slot)}
                        className="h-8 text-xs cursor-pointer"
                      >
                        Reschedule
                      </Button>
                      {slot.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCancelSlot(slot)}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          Cancel
                        </Button>
                      )}
                      {slot.type === "live-class" && slot.status !== "cancelled" && (
                        <Button
                          size="sm"
                          onClick={() => navigate("/teacher/classroom/class-agentic-101")}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          Launch Studio
                        </Button>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>
      )}

      {/* VIEW 3: MONTH CALENDAR */}
      {viewMode === "month" && (
        <Card className="border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {currentMonthData.monthName} Academic Calendar
            </h3>
            <Input
              type="date"
              value={selectedDayDate}
              onChange={(e) => setSelectedDayDate(e.target.value)}
              className="h-7 text-xs w-36 font-mono"
            />
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day} className="font-bold text-slate-500 py-1">{day}</span>
            ))}

            {/* Empty offset placeholders */}
            {Array.from({ length: currentMonthData.startingDayOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="p-2 min-h-[60px] opacity-20" />
            ))}

            {/* Days of month */}
            {Array.from({ length: currentMonthData.totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentMonthData.year}-${String(currentMonthData.month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const count = scheduleSlots.filter((s) => s.date === dateStr && s.status !== "cancelled").length;
              const isSelected = dateStr === selectedDayDate;
              const isCurrentDay = dateStr === todayStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    setSelectedDayDate(dateStr);
                    setViewMode("day");
                  }}
                  className={`p-2 min-h-[60px] rounded-lg border text-left cursor-pointer transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500"
                      : count > 0
                      ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-[#121c17] hover:bg-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
                      {dayNum}
                    </span>
                    {isCurrentDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" title="Today" />
                    )}
                  </div>
                  {count > 0 && (
                    <span className="block mt-1 text-[9px] font-bold bg-emerald-600 text-white rounded px-1 text-center">
                      {count} event{count > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* VIEW 4: AGENDA LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming Scheduled Commitments ({scheduleSlots.filter((s) => s.status !== "cancelled").length} Active)
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openNewSlotModal()}
              className="text-xs"
            >
              + Add Commitment
            </Button>
          </div>

          {scheduleSlots.map((slot) => (
            <Card
              key={slot.id}
              className={`p-4 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] flex items-center justify-between gap-4 ${
                slot.status === "cancelled" ? "opacity-60 bg-slate-50" : ""
              }`}
            >
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
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{slot.title}</h4>
                    {slot.status === "cancelled" && (
                      <Badge variant="destructive" className="text-[9px]">CANCELLED</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {slot.date} ({slot.startTime} – {slot.endTime}) • <span className="font-semibold">{slot.batch}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditModal(slot)} className="h-8 text-xs cursor-pointer">
                  Edit
                </Button>
                {slot.type === "live-class" && slot.status !== "cancelled" && (
                  <Button
                    size="sm"
                    onClick={() => navigate("/teacher/classroom/class-agentic-101")}
                    className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Launch Studio
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule / Reschedule Class Modal with Comprehensive Conflict Detector */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] rounded-2xl border border-slate-200 dark:border-white/10 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingSlot ? "Reschedule Session" : "Schedule Live Lecture / Event"}
              </h3>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingSlot(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Session Topic / Title</label>
                <Input
                  required
                  placeholder="e.g. Lecture 15: Agent Swarm Tool Routing"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Event Type</label>
                  <select
                    value={slotType}
                    onChange={(e) => setSlotType(e.target.value as any)}
                    className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white"
                  >
                    <option value="live-class">Live Lecture</option>
                    <option value="office-hours">Office Hours</option>
                    <option value="deadline">Assessment Deadline</option>
                    <option value="exam">Checkpoint Exam</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Cohort</label>
                  <select
                    value={slotBatch}
                    onChange={(e) => setSlotBatch(e.target.value)}
                    className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white"
                  >
                    <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
                    <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync)</option>
                    <option value="Open to All Cohorts">Open to All Cohorts</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Course</label>
                <select
                  value={slotCourse}
                  onChange={(e) => setSlotCourse(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white"
                >
                  <option value="Full-Stack AI & LLM Systems">Full-Stack AI & LLM Systems</option>
                  <option value="Autonomous Multi-Agent Architectures">Autonomous Multi-Agent Architectures</option>
                  <option value="Direct 1-on-1 Guidance">Direct 1-on-1 Guidance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date</label>
                <Input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
                  <Input
                    type="time"
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Time</label>
                  <Input
                    type="time"
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Conflict Detection Banner */}
              {hasConflict ? (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-start gap-2 text-rose-800 dark:text-rose-300 text-xs">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Schedule Issue Detected:</span>
                    <p className="text-[11px] mt-0.5">{conflictReason}</p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Slot is available with zero cohort or room collisions.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setEditingSlot(null);
                  }}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={hasConflict}
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 cursor-pointer"
                >
                  {editingSlot ? "Update Timetable" : "Confirm & Sync"}
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
