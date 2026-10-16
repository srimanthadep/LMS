import React, { useState } from "react";
import {
  Layers,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Award,
  Pin,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/NotificationContext";

interface CampusEvent {
  id: string;
  title: string;
  type: "Hackathon" | "Guest Lecture" | "Hands-on Workshop" | "Industry Mixer";
  date: string;
  time: string;
  location: string;
  organizer: string;
  rsvpd: boolean;
  seatsLeft: number;
  description: string;
  prizes?: string;
}

export const StudentNoticeBoardPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [events, setEvents] = useState<CampusEvent[]>([
    {
      id: "ev-1",
      title: "Apex Autonomous Agent Swarm Hackathon 2026",
      type: "Hackathon",
      date: "24 – 25 Oct 2026",
      time: "36-Hour Sprint (Starts Saturday 09:00 AM)",
      location: "Virtual & Apex Distributed Systems Lab",
      organizer: "Apex AI Institute & Industry Partners",
      rsvpd: true,
      seatsLeft: 14,
      description:
        "Build collaborative multi-agent swarms with persistent LangGraph checkpoints and real-time execution sandboxes. Judged by principal architects from Microsoft, Google, and Antigravity.",
      prizes: "₹3,00,000 Cash Pool + Cloud GPU Credits",
    },
    {
      id: "ev-2",
      title: "Guest Masterclass: KV-Cache Compression at 100K Token Scales",
      type: "Guest Lecture",
      date: "28 Oct 2026",
      time: "07:00 PM – 08:30 PM IST",
      location: "Auditorium Studio Room Alpha",
      organizer: "Dr. Vikram Sethi & Ex-DeepMind Researchers",
      rsvpd: false,
      seatsLeft: 38,
      description:
        "An in-depth mathematical exploration of attention degradation, streaming KV-cache eviction policies, and low-rank adapter inference acceleration.",
    },
    {
      id: "ev-3",
      title: "Hands-on Workshop: Custom Triton Kernels for Matrix Multiplication",
      type: "Hands-on Workshop",
      date: "03 Nov 2026",
      time: "04:00 PM – 07:00 PM IST",
      location: "GPU Cluster Lab 3",
      organizer: "Karthik Sundaram (Staff MLOps)",
      rsvpd: false,
      seatsLeft: 19,
      description:
        "Write custom GPU kernels using OpenAI Triton. Benchmarking FP16 and INT8 GEMM operations against cuBLAS baseline.",
    },
  ]);

  const handleToggleRSVP = (eventId: string) => {
    setEvents(
      events.map((ev) => {
        if (ev.id === eventId) {
          const newStatus = !ev.rsvpd;
          addNotification({
            title: newStatus ? "Event RSVP Confirmed" : "RSVP Cancelled",
            message: newStatus ? `You are registered for "${ev.title}".` : `Unregistered from "${ev.title}".`,
            type: "system",
          });
          return {
            ...ev,
            rsvpd: newStatus,
            seatsLeft: newStatus ? ev.seatsLeft - 1 : ev.seatsLeft + 1,
          };
        }
        return ev;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Layers className="h-6 w-6 text-primary" /> Events & Notice Board
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Upcoming engineering hackathons, distinguished guest lectures, hands-on lab masterclasses, and RSVP desk.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Featured Events & Competitions ({events.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card
              key={ev.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between shadow-sm overflow-hidden ${
                ev.rsvpd ? "border-primary/40 bg-card" : "border-border/70 bg-card"
              }`}
            >
              <div className="p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {ev.type}
                  </Badge>
                  {ev.rsvpd ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1 font-semibold">
                      <CheckCircle2 className="h-3 w-3" /> RSVP Confirmed
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">{ev.seatsLeft} seats left</span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-foreground leading-snug">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    By {ev.organizer}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {ev.description}
                </p>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs space-y-1.5 font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{ev.location}</span>
                  </div>
                </div>

                {ev.prizes && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Award className="h-4 w-4 shrink-0" />
                    <span>{ev.prizes}</span>
                  </div>
                )}
              </div>

              <div className="p-5 pt-0">
                <Button
                  onClick={() => handleToggleRSVP(ev.id)}
                  variant={ev.rsvpd ? "outline" : "default"}
                  size="sm"
                  className={`w-full text-xs font-bold h-9 rounded-xl ${
                    !ev.rsvpd ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "border-border"
                  }`}
                >
                  {ev.rsvpd ? "Cancel RSVP" : "Confirm My RSVP"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
