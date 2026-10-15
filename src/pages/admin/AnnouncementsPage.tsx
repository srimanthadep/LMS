import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Send,
  MessageSquare,
  Mail,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Eye,
  Clock,
  Smartphone,
  PhoneCall,
  Check,
  X,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetCohort: string;
  channel: "WhatsApp & Email" | "In-App Notice" | "Email Only";
  sentAt: string;
  recipientsCount: number;
  deliveredCount: number;
  failedCount: number;
  status: "delivered" | "partial" | "scheduled";
}

const PAST_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Class Rescheduled: Session 9 to 08:00 PM IST",
    content: "Prof. Verma's hybrid RAG lecture has been moved by 30 mins to avoid conflicting with the industry masterclass.",
    targetCohort: "Batch 2026-A (Weekend)",
    channel: "WhatsApp & Email",
    sentAt: "Yesterday, 04:00 PM",
    recipientsCount: 112,
    deliveredCount: 110,
    failedCount: 2,
    status: "partial",
  },
  {
    id: "ann-2",
    title: "Milestone 2 Rubrics & Test Cases Published",
    content: "Evaluation test cases for LangChain Contextual Compression are now visible under your Assessments tab.",
    targetCohort: "All Active Cohorts",
    channel: "In-App Notice",
    sentAt: "10 Oct 2026",
    recipientsCount: 340,
    deliveredCount: 340,
    failedCount: 0,
    status: "delivered",
  },
  {
    id: "ann-3",
    title: "Live Lab Reminder: GPU Environment Provisioning",
    content: "Please verify your Modal/RunPod API tokens before tonight's 07:00 PM live coding workshop.",
    targetCohort: "Agentic Systems Bootcamp",
    channel: "WhatsApp & Email",
    sentAt: "08 Oct 2026",
    recipientsCount: 85,
    deliveredCount: 85,
    failedCount: 0,
    status: "delivered",
  },
];

export const AnnouncementsPage: React.FC = () => {
  const [history, setHistory] = useState<Announcement[]>(PAST_ANNOUNCEMENTS);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cohort, setCohort] = useState("All Active Cohorts");
  const [channel, setChannel] = useState<"WhatsApp & Email" | "In-App Notice" | "Email Only">("WhatsApp & Email");
  const [isSending, setIsSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"composer" | "history" | "automated">("composer");
  const { addNotification } = useNotifications();

  const handleBroadcast = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title || !content) return;
    setIsSending(true);
    setPreviewOpen(false);

    setTimeout(() => {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title,
        content,
        targetCohort: cohort,
        channel,
        sentAt: "Just now",
        recipientsCount: 180,
        deliveredCount: 178,
        failedCount: 2,
        status: "partial",
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
    }, 600);
  };

  const handleRetryFailed = (id: string) => {
    setHistory((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              deliveredCount: a.deliveredCount + a.failedCount,
              failedCount: 0,
              status: "delivered",
            }
          : a
      )
    );
    addNotification({
      title: "Delivery Retried",
      message: "Resent to undelivered WhatsApp/Email recipients.",
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" /> Announcements & Cohort Communication
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Deliver synchronized lecture updates, timetable adjustments, and urgent notices via WhatsApp Business API, SES Email, and In-App feeds.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/70 gap-2">
        <button
          onClick={() => setActiveTab("composer")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "composer"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Send className="h-4 w-4" /> Broadcast Composer
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" /> Delivery History & Logs ({history.length})
        </button>
        <button
          onClick={() => setActiveTab("automated")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "automated"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="h-4 w-4" /> Automated Class Reminders
        </button>
      </div>

      {/* TAB 1: Composer & Feed */}
      {activeTab === "composer" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Composer (1 col) */}
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" /> Compose Broadcast
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPreviewOpen(true);
              }}
              className="space-y-3.5"
            >
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
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="All Active Cohorts">All Active Cohorts (All Learners)</option>
                  <option value="Batch 2026-A (Weekend)">Batch 2026-A (Weekend)</option>
                  <option value="Batch 2026-B (Weekday)">Batch 2026-B (Weekday)</option>
                  <option value="Agentic Systems Bootcamp">Agentic Systems Bootcamp</option>
                  <option value="Fine-Tuning Intensive 2026">Fine-Tuning Intensive 2026</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Delivery Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold"
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
                  className="w-full rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewOpen(true)}
                  disabled={!title || !content}
                  className="flex-1 h-9 text-xs font-bold gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Button>
                <Button
                  type="submit"
                  disabled={isSending || !title || !content}
                  className="flex-1 h-9 text-xs font-bold gap-1 shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  {isSending ? "Dispatching..." : "Publish"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Broadcast History (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Active Cohort Broadcast Feed
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {history.length} Announcements Logged
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {history.map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/15 transition-colors space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-sm text-foreground">{a.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="accent" className="text-[10px] font-bold">
                          {a.channel}
                        </Badge>
                        <Badge
                          variant={a.status === "delivered" ? "success" : "warning"}
                          className="text-[9px] uppercase font-bold"
                        >
                          {a.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{a.content}</p>
                    <div className="flex flex-wrap justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                      <span>Target: <strong className="text-foreground">{a.targetCohort}</strong></span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ {a.deliveredCount} Delivered
                        </span>
                        {a.failedCount > 0 && (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                            ✕ {a.failedCount} Failed
                            <button
                              onClick={() => handleRetryFailed(a.id)}
                              className="text-primary underline ml-1 hover:text-primary/80"
                            >
                              Retry
                            </button>
                          </span>
                        )}
                        <span>{a.sentAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: Communication History & Provider Delivery */}
      {activeTab === "history" && (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Delivery Log & Provider Telemetry
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Audit trail of outgoing WhatsApp messages and Amazon SES transactional emails.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Dispatch Time</th>
                    <th className="p-3.5">Announcement Title</th>
                    <th className="p-3.5">Audience</th>
                    <th className="p-3.5">Channel</th>
                    <th className="p-3.5 text-center">Delivered</th>
                    <th className="p-3.5 text-center">Failed</th>
                    <th className="p-3.5 pr-5 text-right">Retry / Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {history.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 pl-5 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                        {a.sentAt}
                      </td>
                      <td className="p-3.5 font-bold text-foreground max-w-[200px] truncate">{a.title}</td>
                      <td className="p-3.5 text-muted-foreground">{a.targetCohort}</td>
                      <td className="p-3.5">
                        <Badge variant="outline" className="text-[10px]">
                          {a.channel}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {a.deliveredCount}
                      </td>
                      <td className="p-3.5 text-center font-bold font-mono">
                        {a.failedCount > 0 ? (
                          <span className="text-rose-600 dark:text-rose-400">{a.failedCount}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        {a.failedCount > 0 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetryFailed(a.id)}
                            className="h-7 text-xs font-bold gap-1 text-primary border-primary/30"
                          >
                            <RotateCw className="h-3 w-3" /> Retry Failed
                          </Button>
                        ) : (
                          <Badge variant="success" className="text-[9px] uppercase">
                            Delivered 100%
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Automated Class Reminders */}
      {activeTab === "automated" && (
        <Card className="rounded-2xl border-border/80 shadow-xs max-w-2xl">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" /> Automated Class Reminders & Triggers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <p className="text-muted-foreground">
              Configure system-automated WhatsApp and Email dispatch triggers preceding live virtual classroom sessions.
            </p>

            <div className="space-y-3 divide-y divide-border/60">
              {[
                {
                  title: "1-Hour Pre-Class WhatsApp Ping",
                  desc: "Sends personalized join link and lecture prerequisites to enrolled students.",
                  active: true,
                },
                {
                  title: "15-Minute Broadcast Starting Alert",
                  desc: "Pushes emergency notification if live classroom studio has initiated recording.",
                  active: true,
                },
                {
                  title: "Post-Class Recording Available Digest",
                  desc: "Dispatched automatically once Whisper chapters and AI summary are compiled.",
                  active: true,
                },
                {
                  title: "Assignment Due in 24 Hours Alert",
                  desc: "Notifies pending students with rubric and submission link.",
                  active: false,
                },
              ].map((item, idx) => (
                <div key={idx} className="pt-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-foreground">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <Badge variant={item.active ? "success" : "outline"} className="text-[10px]">
                    {item.active ? "Active" : "Paused"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PREVIEW MODAL */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Eye className="h-5 w-5 text-primary" /> Broadcast Preview
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review how this announcement will appear to students on their selected channels.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs pt-2">
            <div className="p-4 rounded-xl border border-primary/20 bg-muted/30 space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="accent" className="text-[10px] font-bold">
                  {channel}
                </Badge>
                <span className="text-[10px] text-muted-foreground">Target: {cohort}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{title || "Untitled Announcement"}</h4>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{content || "No message body."}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setPreviewOpen(false)} className="h-8 text-xs">
                Back to Edit
              </Button>
              <Button size="sm" onClick={() => handleBroadcast()} className="h-8 text-xs font-bold gap-1 px-4">
                <Send className="h-3 w-3" /> Confirm & Dispatch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
