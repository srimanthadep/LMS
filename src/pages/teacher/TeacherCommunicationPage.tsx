import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Send,
  MessageSquare,
  Users,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  Mail,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface Announcement {
  id: string;
  title: string;
  body: string;
  targetBatch: string;
  timestamp: string;
  channels: string[];
  reachCount: number;
}

interface StudentMessage {
  id: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "unanswered" | "replied";
  replyText?: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "anc-1",
    title: "Live Studio Session 14: Multi-Agent Consensus tonight at 08:00 PM IST",
    body: "Please ensure your PyTorch environment has flash-attention installed before joining. Colab links have been updated in Module 2.",
    targetBatch: "Cohort 7 (Live + Replay)",
    timestamp: "Today at 02:15 PM",
    channels: ["In-App", "Email", "SMS"],
    reachCount: 112,
  },
  {
    id: "anc-2",
    title: "Capstone 1 Deadline Extended by 24 Hours",
    body: "Due to high traffic on our GPU clusters, the submission deadline for Capstone 1 has been moved to Oct 21, 11:59 PM.",
    targetBatch: "Cohort 7 (Live + Replay)",
    timestamp: "Yesterday",
    channels: ["In-App", "Email"],
    reachCount: 112,
  },
];

const INITIAL_MESSAGES: StudentMessage[] = [
  {
    id: "msg-1",
    studentName: "Devendra Patel",
    studentEmail: "dev.patel@tech.in",
    subject: "Clarification on HNSW Vector Index recall vs latency",
    message: "Prof. Verma, when increasing M in HNSW, does memory consumption scale quadratically or linearly with vector dimension d?",
    timestamp: "1 hour ago",
    status: "unanswered",
  },
  {
    id: "msg-2",
    studentName: "Arjun Mehta",
    studentEmail: "arjun.m@learner.ai",
    subject: "Permission to audit Cohort 4 Advanced Vision replay",
    message: "I am writing my capstone on Multimodal tool calling. Would it be possible to get preview access to the Vision module?",
    timestamp: "Yesterday",
    status: "replied",
    replyText: "Granted Arjun. Support desk has updated your cohort entitlement.",
  },
];

export const TeacherCommunicationPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [messages, setMessages] = useState<StudentMessage[]>(INITIAL_MESSAGES);
  const [activeTab, setActiveTab] = useState<"broadcast" | "inbox">("broadcast");

  // New Announcement Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetBatch, setTargetBatch] = useState("Cohort 7 (Live + Replay)");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(false);

  // Quick Reply State
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { addNotification } = useNotifications();

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const channels = ["In-App"];
    if (sendEmail) channels.push("Email");
    if (sendSms) channels.push("SMS");

    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      title,
      body,
      targetBatch,
      timestamp: "Just now",
      channels,
      reachCount: targetBatch.includes("7") ? 112 : 48,
    };

    setAnnouncements([newAnc, ...announcements]);
    setTitle("");
    setBody("");

    addNotification({
      title: "Announcement Dispatched",
      message: `Broadcast delivered to ${newAnc.reachCount} students via ${channels.join(", ")}.`,
      type: "class",
    });
  };

  const handleSendReply = (msgId: string) => {
    if (!replyContent.trim()) return;

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: "replied", replyText: replyContent } : m))
    );

    addNotification({
      title: "Reply Delivered",
      message: "Student inquiry answered and synced to messaging log.",
      type: "doubt",
    });

    setReplyingId(null);
    setReplyContent("");
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
            Broadcast class announcements, dispatch deadline reminders across SMS & Email, and respond to direct student inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs px-3 py-1">
            Active Broadcast Reach: 160 Learners
          </Badge>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("broadcast")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "broadcast" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Radio className="h-4 w-4" />
          Broadcast Announcements ({announcements.length})
        </button>

        <button
          onClick={() => setActiveTab("inbox")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "inbox" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Student Messages ({messages.filter((m) => m.status === "unanswered").length} Unanswered)
        </button>
      </div>

      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Broadcaster Compose Form */}
          <Card className="lg:col-span-1 p-5 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="h-4 w-4 text-emerald-600" />
              Compose Class Announcement
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Target Cohort / Batch</label>
                <select
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="w-full h-8 text-xs rounded-md border border-slate-200 px-2"
                >
                  <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay) - 112 students</option>
                  <option value="Cohort 4 (Live Sync)">Cohort 4 (Live Sync) - 48 students</option>
                  <option value="All Assigned Batches">All Assigned Batches (160 students)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Announcement Headline</label>
                <Input
                  required
                  placeholder="e.g. Schedule shift or Lab pre-requisites..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide complete instructions, meeting links, or prep materials..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-200 bg-white"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">Dispatch Channels:</span>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Email Blast</span>
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
            <h3 className="text-sm font-bold text-slate-900">Broadcast History & Delivery Telemetry</h3>

            {announcements.map((anc) => (
              <Card key={anc.id} className="p-4 border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                      {anc.targetBatch}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">{anc.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {anc.channels.map((ch) => (
                      <span
                        key={ch}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{anc.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{anc.body}</p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Delivered to {anc.reachCount} recipients
                  </span>
                  <span>100% Delivery SLA</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Student Messages Inbox */}
      {activeTab === "inbox" && (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="p-5 border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {msg.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{msg.studentName}</p>
                    <p className="text-[11px] text-slate-400">{msg.studentEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{msg.timestamp}</span>
                  {msg.status === "replied" ? (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">Replied</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">Unanswered</Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800">{msg.subject}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {msg.message}
                </p>
              </div>

              {msg.replyText ? (
                <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-emerald-900 text-[11px]">Prof. Rajesh Verma:</span>
                  <p className="text-emerald-800">{msg.replyText}</p>
                </div>
              ) : replyingId === msg.id ? (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <textarea
                    rows={3}
                    placeholder="Type your explanation or follow-up..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-md border border-slate-200"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReplyingId(null)}
                      className="h-8 text-xs cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendReply(msg.id)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    >
                      Send Direct Response
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingId(msg.id);
                      setReplyContent("");
                    }}
                    className="h-8 text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                  >
                    Reply to Student
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCommunicationPage;
