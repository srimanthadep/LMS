import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Calendar,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  User,
  ArrowLeft,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const StudentMentorSessionPage: React.FC = () => {
  // Assigned mentor and upcoming session from the existing system
  const mentor = {
    name: "Prof. Rajesh Verma",
    role: "Lead Faculty & AI Systems Chair",
    avatar: "RV",
    affiliation: "Apex AI Institute • Ex-Google Research",
    email: "rajesh.verma@apex.edu",
    cohort: "Cohort 7 (Autonomous Systems & AI)",
  };

  // Scheduled 1:1 session details from existing system data
  const session = {
    topic: "Multi-Agent Graph State Synchronization Review",
    dateTime: "Tomorrow, 04:30 PM IST",
    duration: "45 Minutes",
    agenda: "Reviewing cycle detection in LangGraph supervisor node and context pruning strategy.",
    status: "Confirmed",
  };

  // Actual Zoom URL supplied or configured by the mentor/system
  // Check if a link has been configured/shared in system state or local storage
  const configuredZoomUrl =
    (typeof window !== "undefined" && window.localStorage.getItem("mentor_zoom_session_url")) || "";

  // The mentor has not shared a link yet unless an actual valid Zoom URL was supplied
  const [meetingUrl] = useState<string>(configuredZoomUrl);

  const hasValidMeetingUrl = Boolean(
    meetingUrl && meetingUrl.trim().length > 0 && meetingUrl.startsWith("http")
  );

  const handleJoinZoom = () => {
    if (hasValidMeetingUrl) {
      window.open(meetingUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Breadcrumb / Nav helper */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/mentors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Mentor Details
        </Link>
        <Badge variant="outline" className="text-[11px] font-medium border-border/80">
          Cohort 7 • 1:1 Academic Mentorship
        </Badge>
      </div>

      {/* Main 1:1 Session Card */}
      <Card className="rounded-3xl border border-border/80 shadow-md bg-card overflow-hidden">
        {/* Decorative Top Accent Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
                  <Video className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  One-to-One Mentoring
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Your 1:1 Mentor Session
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Live consultation with your assigned faculty mentor.
              </p>
            </div>

            {/* Scheduled Status Pill */}
            <div className="self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {session.status}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Assigned Mentor Info Strip */}
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mentor Avatar */}
              <div className="relative">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary text-primary-foreground font-black text-xl flex items-center justify-center shrink-0 shadow-sm ring-2 ring-primary/20">
                  {mentor.avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    {mentor.name}
                  </h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold">
                    Your Assigned Mentor
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{mentor.role}</p>
                <p className="text-[11px] text-muted-foreground/90">{mentor.affiliation}</p>
              </div>
            </div>

            <Link to="/student/mentors">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs h-8 border-border/80 hover:bg-muted/60 self-start sm:self-auto"
              >
                View Profile
              </Button>
            </Link>
          </div>

          {/* Session Details Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scheduled Date & Time */}
            <div className="p-4 rounded-2xl border border-border/60 bg-card space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Scheduled Date & Time
              </div>
              <p className="text-sm sm:text-base font-extrabold text-foreground">
                {session.dateTime}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Duration: {session.duration}
              </div>
            </div>

            {/* Session Topic & Focus */}
            <div className="p-4 rounded-2xl border border-border/60 bg-card space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Discussion Topic
              </div>
              <p className="text-sm font-bold text-foreground line-clamp-1">
                {session.topic}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 pt-0.5">
                {session.agenda}
              </p>
            </div>
          </div>

          {/* Zoom Meeting Link Section */}
          <div className="p-6 rounded-2xl border-2 border-border/80 bg-gradient-to-b from-card to-muted/20 space-y-5 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
                <Video className="h-4 w-4 text-primary" /> Zoom Meeting Room
              </h3>
              {/* Short message explaining that the mentor will share the meeting link */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                The 1:1 session is hosted via Zoom. Your mentor will share the meeting link with you prior to the call.
              </p>
            </div>

            {/* Meeting Link Status Callout */}
            {hasValidMeetingUrl ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zoom link is confirmed and ready for your session.</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <p className="font-bold text-amber-950 dark:text-amber-100">
                    Your mentor will share the Zoom link with you.
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    The join button will be enabled once your mentor provides the session link. Please keep this page open or check back shortly before the scheduled time.
                  </p>
                </div>
              </div>
            )}

            {/* Prominent Join on Zoom Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={handleJoinZoom}
                disabled={!hasValidMeetingUrl}
                size="lg"
                className={`w-full sm:w-auto px-8 py-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all ${
                  hasValidMeetingUrl
                    ? "bg-[#e11d48] hover:bg-[#be123c] text-white hover:shadow-md cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed border border-border/80"
                }`}
              >
                <Video className="h-5 w-5" />
                Join on Zoom
                {hasValidMeetingUrl && <ExternalLink className="h-4 w-4 ml-1" />}
              </Button>

              <span className="text-[11px] text-muted-foreground text-center sm:text-left">
                {hasValidMeetingUrl
                  ? "Click to open Zoom in a new window."
                  : "Button activates automatically once the link is shared."}
              </span>
            </div>
          </div>

          {/* Quick Pre-Session Checklist */}
          <div className="border-t border-border/60 pt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Session Checklist & Guidelines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                <span className="font-semibold text-foreground block">1. Technical Setup</span>
                <p className="text-[11px]">Test your microphone, camera, and Zoom client beforehand.</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                <span className="font-semibold text-foreground block">2. Discussion Agenda</span>
                <p className="text-[11px]">Have your code snippets, architecture questions, or capstone notes ready.</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                <span className="font-semibold text-foreground block">3. Mentor Contact</span>
                <p className="text-[11px]">
                  Need to reschedule? Email{" "}
                  <a href={`mailto:${mentor.email}`} className="text-primary hover:underline">
                    {mentor.email}
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
