import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, MessageSquare, Mail, Layers, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetCohort: string;
  channel: "WhatsApp & Email" | "In-App Notice" | "Email Only";
  sentAt: string;
  recipientsCount: number;
}

const PAST_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Class Rescheduled: Session 9 to 08:00 PM IST",
    content: "Prof. Verma's hybrid RAG lecture has been moved by 30 mins to avoid conflicting with the industry masterclass.",
    targetCohort: "Cohort 7 (Live + Replay)",
    channel: "WhatsApp & Email",
    sentAt: "Yesterday, 04:00 PM",
    recipientsCount: 112,
  },
  {
    id: "ann-2",
    title: "Milestone 2 Rubrics & Test Cases Published",
    content: "Evaluation test cases for LangChain Contextual Compression are now visible under your Assessments tab.",
    targetCohort: "All Active Cohorts",
    channel: "In-App Notice",
    sentAt: "10 Oct 2026",
    recipientsCount: 340,
  },
];

export const AnnouncementsPage: React.FC = () => {
  const [history, setHistory] = useState<Announcement[]>(PAST_ANNOUNCEMENTS);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cohort, setCohort] = useState("All Active Cohorts");
  const [channel, setChannel] = useState<"WhatsApp & Email" | "In-App Notice" | "Email Only">("WhatsApp & Email");
  const [isSending, setIsSending] = useState(false);
  const { addNotification } = useNotifications();

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSending(true);

    setTimeout(() => {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title,
        content,
        targetCohort: cohort,
        channel,
        sentAt: "Just now",
        recipientsCount: 180,
      };

      setHistory([newAnn, ...history]);
      setTitle("");
      setContent("");
      setIsSending(false);
      addNotification({
        title: "Broadcast Dispatched",
        message: `Announcement "${title}" broadcast via ${channel}.`,
        type: "system",
      });
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Multi-Channel Announcement & Broadcast Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Deliver time-sensitive lecture updates, timetable adjustments, and urgent notices via WhatsApp, Email, and In-App feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Composer (1 col) */}
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" /> Compose Broadcast
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Announcement Title</label>
                <Input
                  required
                  placeholder="e.g. Schedule Update for Tonight's Session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Target Audience / Cohort</label>
                <select
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  <option value="All Active Cohorts">All Active Cohorts (All Learners)</option>
                  <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
                  <option value="Cohort 8 (Replay Only)">Cohort 8 (Replay-Only)</option>
                  <option value="Agentic Systems Bootcamp">Agentic Systems Bootcamp</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Delivery Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs font-semibold"
                >
                  <option value="WhatsApp & Email">WhatsApp Automation + Email Notice</option>
                  <option value="In-App Notice">In-App Notification Feed Only</option>
                  <option value="Email Only">Email Digest Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Broadcast Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your detailed announcement..."
                  className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSending}
                className="w-full h-9 text-xs font-bold gap-1 shadow-sm mt-2"
              >
                <Send className="h-3 w-3" />
                {isSending ? "Dispatching..." : "Send Announcement"}
              </Button>
            </form>
          </Card>

          {/* Broadcast History (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold">
                  Broadcast History & Delivery Log
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {history.length} Broadcasts Logged
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {history.map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-sm text-foreground">{a.title}</span>
                      <Badge variant="accent" className="text-[10px] font-bold">
                        {a.channel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {a.content}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                      <span>Target: <strong>{a.targetCohort}</strong> ({a.recipientsCount} recipients)</span>
                      <span>{a.sentAt}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
