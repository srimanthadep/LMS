import React, { useState } from "react";
import {
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDataService } from "@/services/mockDataService";
import { DeviceCheckModal } from "@/components/shared/DeviceCheckModal";

interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  code: string;
  type: "Live Broadcast" | "Hands-on Lab" | "Faculty Viva" | "Replay Review";
  faculty: string;
  batch: string;
  roomUrl: string;
  status: "Live Now" | "Upcoming" | "Completed" | "Rescheduled";
}

export const StudentSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [selectedClassTitle, setSelectedClassTitle] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("class-agentic-101");

  const dailySchedule: TimetableSlot[] = [
    {
      day: "Today (Thursday)",
      time: "06:30 PM – 08:30 PM IST",
      subject: "Multi-Agent Consensus & Hierarchical Supervisor Design",
      code: "AI-701",
      type: "Live Broadcast",
      faculty: "Prof. Rajesh Verma",
      batch: "Cohort 7 (Advanced AI)",
      roomUrl: "https://meet.apex-lms.edu/room-rv-4810",
      status: "Live Now",
    },
    {
      day: "Today (Thursday)",
      time: "09:00 PM – 10:00 PM IST",
      subject: "Live Laboratory: LangGraph Interrupt Checkpoint Debugging",
      code: "LAB-701",
      type: "Hands-on Lab",
      faculty: "Prof. Rajesh Verma & Teaching Assistants",
      batch: "Cohort 7 (Advanced AI)",
      roomUrl: "https://meet.apex-lms.edu/lab-gpu-01",
      status: "Upcoming",
    },
  ];

  const weeklySchedule: TimetableSlot[] = [
    {
      day: "Monday",
      time: "06:30 PM – 08:30 PM",
      subject: "PagedAttention & KV-Cache Infrastructure Foundations",
      code: "CS-604",
      type: "Live Broadcast",
      faculty: "Karthik Sundaram",
      batch: "Cohort 7",
      roomUrl: "https://meet.apex-lms.edu/room-ks-305",
      status: "Completed",
    },
    {
      day: "Tuesday",
      time: "05:00 PM – 06:30 PM",
      subject: "1:1 Technical Viva & Communication Articulation Check",
      code: "VIVA-101",
      type: "Faculty Viva",
      faculty: "Dr. Priya Sharma",
      batch: "Cohort 7",
      roomUrl: "https://meet.apex-lms.edu/room-ps-204",
      status: "Completed",
    },
    {
      day: "Wednesday",
      time: "06:30 PM – 08:30 PM",
      subject: "Vector DB Sharding & IVF-PQ Quantization Benchmarking",
      code: "AI-702",
      type: "Hands-on Lab",
      faculty: "Prof. Rajesh Verma",
      batch: "Cohort 7",
      roomUrl: "https://meet.apex-lms.edu/lab-gpu-02",
      status: "Completed",
    },
    {
      day: "Thursday (Today)",
      time: "06:30 PM – 08:30 PM",
      subject: "Multi-Agent Consensus & Hierarchical Supervisor Design",
      code: "AI-701",
      type: "Live Broadcast",
      faculty: "Prof. Rajesh Verma",
      batch: "Cohort 7",
      roomUrl: "https://meet.apex-lms.edu/room-rv-4810",
      status: "Live Now",
    },
    {
      day: "Friday",
      time: "04:00 PM – 06:00 PM",
      subject: "Capstone Project Sprint Review & Oral Defense",
      code: "PROJ-701",
      type: "Live Broadcast",
      faculty: "Apex Faculty Committee",
      batch: "Cohort 7",
      roomUrl: "https://meet.apex-lms.edu/room-comm-01",
      status: "Upcoming",
    },
    {
      day: "Saturday",
      time: "11:00 AM – 01:00 PM",
      subject: "Faculty Consultation Office Hours & Doubt Clearing",
      code: "MTR-AI",
      type: "Faculty Viva",
      faculty: "Prof. Rajesh Verma",
      batch: "Cohort 7",
      roomUrl: "https://meet.apex-lms.edu/office-hours",
      status: "Upcoming",
    },
  ];

  const handleOpenDeviceCheck = (slot: TimetableSlot) => {
    setSelectedClassTitle(`${slot.code}: ${slot.subject}`);
    setSelectedClassId("class-agentic-101");
    setDeviceModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Clock className="h-6 w-6 text-primary" /> Class Timetable & Studio Schedule
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Synchronous class schedule, laboratory sessions, room deep-links, and daily/weekly timetable views.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60 self-start sm:self-auto">
          <Button
            variant={viewMode === "daily" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("daily")}
            className="rounded-lg text-xs h-8 px-3"
          >
            Daily Timetable
          </Button>
          <Button
            variant={viewMode === "weekly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("weekly")}
            className="rounded-lg text-xs h-8 px-3"
          >
            Weekly Timetable
          </Button>
        </div>
      </div>

      {/* DAILY TIMETABLE */}
      {viewMode === "daily" && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Today's Synchronous Sessions ({dailySchedule.length})
          </h2>

          <div className="space-y-3.5">
            {dailySchedule.map((slot, idx) => (
              <Card
                key={idx}
                className="rounded-2xl border-border/80 shadow-sm p-5 hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {slot.code}
                      </Badge>
                      <Badge
                        className={`text-[10px] font-bold ${
                          slot.status === "Live Now"
                            ? "bg-rose-600 text-white animate-pulse"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {slot.status}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {slot.type}
                      </Badge>
                    </div>

                    <h3 className="font-extrabold text-base text-foreground leading-snug">
                      {slot.subject}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      Faculty: <strong className="text-foreground">{slot.faculty}</strong> • {slot.batch}
                    </p>

                    <p className="text-xs font-mono font-semibold text-primary flex items-center gap-1.5 pt-0.5">
                      <Clock className="h-3.5 w-3.5" /> {slot.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleOpenDeviceCheck(slot)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 rounded-xl gap-1.5 shadow-sm"
                    >
                      <Video className="h-3.5 w-3.5" /> Pre-Join Check & Enter
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* WEEKLY TIMETABLE */}
      {viewMode === "weekly" && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Complete Weekly Academic Timetable
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklySchedule.map((slot, idx) => (
              <Card
                key={idx}
                className="rounded-2xl border-border/70 hover:border-primary/40 transition-all p-4 flex flex-col justify-between shadow-2xs space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary uppercase tracking-wider font-mono">
                      {slot.day}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {slot.code}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                    {slot.subject}
                  </h4>

                  <p className="text-xs text-muted-foreground">
                    {slot.faculty}
                  </p>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/40 text-[11px] font-mono text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Time:</span>
                      <strong className="text-foreground">{slot.time}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="text-primary font-medium">{slot.type}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDeviceCheck(slot)}
                    className="w-full text-xs h-8 rounded-lg font-semibold gap-1"
                  >
                    <Video className="h-3 w-3 text-primary" /> Test Room Hardware
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Device Check Modal */}
      <DeviceCheckModal
        open={deviceModalOpen}
        onOpenChange={setDeviceModalOpen}
        targetClassId={selectedClassId}
        classTitle={selectedClassTitle}
      />
    </div>
  );
};
