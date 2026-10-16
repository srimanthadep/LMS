import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Smile,
  PhoneCall,
  Video,
  CheckCheck,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  Flame,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Award,
  X,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Student360Drawer } from "@/components/shared/Student360Drawer";

interface ChatMessage {
  id: string;
  sender: "student" | "agent" | "bot" | "system";
  text: string;
  time: string;
  isAiSuggested?: boolean;
}

interface ChatSession {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  email: string;
  courseTitle: string;
  batchName: string;
  progressPercent: number;
  attendancePercent: number;
  status: "active" | "queued" | "resolved";
  priority: "urgent" | "normal";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  slaMinutesLeft: number;
  messages: ChatMessage[];
}

const INITIAL_CHATS: ChatSession[] = [
  {
    id: "chat-1",
    studentId: "usr-student-1",
    studentName: "Arjun Mehta",
    avatar: "AM",
    email: "arjun.m@learner.ai",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    progressPercent: 78,
    attendancePercent: 92,
    status: "active",
    priority: "urgent",
    slaMinutesLeft: 3,
    lastMessage: "Can someone confirm if my batch change request to Weekend Bootcamp was approved?",
    lastMessageTime: "2m ago",
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: "m-1",
        sender: "system",
        text: "Arjun Mehta joined the live support channel. Connected to Support Desk Agent.",
        time: "10:18 AM",
      },
      {
        id: "m-2",
        sender: "student",
        text: "Hi support team! I submitted ticket #TKT-1082 this morning regarding moving from Weekday Evening to Weekend Cohort.",
        time: "10:19 AM",
      },
      {
        id: "m-3",
        sender: "agent",
        text: "Hello Arjun! I see your request in the queue. You're at 78% progress with 92% attendance, so you easily qualify for the cohort shift policy.",
        time: "10:20 AM",
      },
      {
        id: "m-4",
        sender: "student",
        text: "Can someone confirm if my batch change request to Weekend Bootcamp was approved by the academic admin?",
        time: "10:22 AM",
      },
    ],
  },
  {
    id: "chat-2",
    studentId: "usr-student-5",
    studentName: "Simran Kaur",
    avatar: "SK",
    email: "simran.k@example.com",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 8 (Replay Only)",
    progressPercent: 44,
    attendancePercent: 60,
    status: "active",
    priority: "urgent",
    slaMinutesLeft: 6,
    lastMessage: "I need to share my medical certificate for the 30-day course validity extension.",
    lastMessageTime: "8m ago",
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: "m-201",
        sender: "student",
        text: "Hello, I was hospitalized last week with severe dengue and missed two modules.",
        time: "10:10 AM",
      },
      {
        id: "m-202",
        sender: "student",
        text: "I need to share my medical certificate for the 30-day course validity extension.",
        time: "10:14 AM",
      },
    ],
  },
  {
    id: "chat-3",
    studentId: "usr-student-2",
    studentName: "Pooja Hegde",
    avatar: "PH",
    email: "pooja.h@example.com",
    courseTitle: "Autonomous Multi-Agent Architectures",
    batchName: "Agentic Systems Bootcamp",
    progressPercent: 85,
    attendancePercent: 88,
    status: "queued",
    priority: "normal",
    slaMinutesLeft: 14,
    lastMessage: "Quick query about GPU server credits for the autonomous swarm project.",
    lastMessageTime: "15m ago",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: "m-301",
        sender: "student",
        text: "Quick query about GPU server credits for the autonomous swarm project.",
        time: "10:05 AM",
      },
    ],
  },
  {
    id: "chat-4",
    studentId: "usr-student-3",
    studentName: "Rohan Nair",
    avatar: "RN",
    email: "rohan.n@tech.io",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    progressPercent: 62,
    attendancePercent: 75,
    status: "resolved",
    priority: "normal",
    slaMinutesLeft: 0,
    lastMessage: "Thanks a lot for the replay link! That worked perfectly.",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: "m-401",
        sender: "student",
        text: "Lecture 6 replay player showed a buffering error.",
        time: "09:15 AM",
      },
      {
        id: "m-402",
        sender: "agent",
        text: "I've flushed the CDN edge cache for your stream token. Please try refreshing now.",
        time: "09:20 AM",
      },
      {
        id: "m-403",
        sender: "student",
        text: "Thanks a lot for the replay link! That worked perfectly.",
        time: "09:22 AM",
      },
    ],
  },
];

const CANNED_MACROS = [
  {
    label: "Batch Shift SOP",
    tag: "#batch",
    text: "Your batch shift request has been verified against our attendance policy and routed to Academic Admin for final roster sync. You will receive an email confirmation within 2 hours.",
  },
  {
    label: "Validity Extension Policy",
    tag: "#validity",
    text: "We have received your document. The 30-day medical validity extension proposal has been flagged for prioritized approval so you can continue seamless access.",
  },
  {
    label: "CDN & Stream Flush",
    tag: "#cdn",
    text: "We have regenerated your secure LMS streaming tokens and flushed edge CDN caches. Please clear browser cookies and reload the lecture player.",
  },
  {
    label: "GPU Compute Credits",
    tag: "#gpu",
    text: "Your modal/cloud sandbox workspace quota has been augmented with 50 bonus GPU compute minutes for this milestone.",
  },
];

export const LiveChatPage: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string>("chat-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"all" | "active" | "queued" | "resolved">("all");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);
  const [isStudentTyping, setIsStudentTyping] = useState(false);
  const [is360DrawerOpen, setIs360DrawerOpen] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"online" | "busy" | "away">("online");
  const [workflowToast, setWorkflowToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages, isStudentTyping]);

  const activeCount = chats.filter((c) => c.status === "active").length;
  const queuedCount = chats.filter((c) => c.status === "queued").length;
  const resolvedCount = chats.filter((c) => c.status === "resolved").length;
  const urgentCount = chats.filter((c) => c.priority === "urgent" && c.status !== "resolved").length;

  const filteredChats = chats.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusTab !== "all" && c.status !== statusTab) return false;
    if (urgentOnly && c.priority !== "urgent") return false;
    return true;
  });

  const showNotification = (msg: string) => {
    setWorkflowToast(msg);
    setTimeout(() => setWorkflowToast(null), 3500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "agent",
      text: inputText.trim(),
      time: "Just now",
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            lastMessage: newMsg.text,
            lastMessageTime: "Just now",
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );
    setInputText("");

    // Simulate student typing indicator then response
    setTimeout(() => {
      setIsStudentTyping(true);
    }, 1200);

    setTimeout(() => {
      setIsStudentTyping(false);
      const studentReply: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: "student",
        text: "Thank you so much! That really clarifies everything. Appreciate the fast help!",
        time: "Just now",
      };
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === selectedChatId) {
            return {
              ...chat,
              messages: [...chat.messages, studentReply],
              lastMessage: studentReply.text,
              lastMessageTime: "Just now",
            };
          }
          return chat;
        })
      );
    }, 3200);
  };

  const handleApplyMacro = (text: string) => {
    setInputText(text);
    textareaRef.current?.focus();
  };

  const handleAiCopilotGenerate = (type: "general" | "batch" | "validity" | "empathy") => {
    setIsCopilotThinking(true);
    setTimeout(() => {
      setIsCopilotThinking(false);
      let draft = "";
      if (type === "batch") {
        draft = `Hi ${selectedChat.studentName.split(" ")[0]}, I checked ticket #TKT-1082 and can confirm your request to move to the Weekend Intensive Cohort has been approved by the academic committee. Your dashboard timetable and live class invitations will reflect the weekend slot starting this Saturday.`;
      } else if (type === "validity") {
        draft = `Hi ${selectedChat.studentName.split(" ")[0]}, I have received your medical documentation. We have approved a 30-day extension to your course validity so you can recover without any study pressure. Your new expiry is marked in your portal.`;
      } else if (type === "empathy") {
        draft = `Hi ${selectedChat.studentName.split(" ")[0]}, I completely understand how frustrating this must be. Rest assured, I am personally taking ownership of this and expediting resolution with the senior engineering mentors right now.`;
      } else {
        draft = `Hi ${selectedChat.studentName.split(" ")[0]}, I've reviewed your active request for ${selectedChat.courseTitle}. Everything looks in order, and I've processed the approval on your LMS record.`;
      }
      setInputText(draft);
      textareaRef.current?.focus();
    }, 600);
  };

  const handleResolveChat = () => {
    setChats((prev) =>
      prev.map((c) => (c.id === selectedChatId ? { ...c, status: "resolved", unreadCount: 0 } : c))
    );
    showNotification(`Chat session with ${selectedChat.studentName} marked as resolved.`);
  };

  const handleQuickBatchApproval = () => {
    const sysMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: "system",
      text: `Academic Admin verified: ${selectedChat.studentName} moved from ${selectedChat.batchName} to Weekend Intensive Batch.`,
      time: "Just now",
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? {
              ...c,
              batchName: "Weekend Intensive Bootcamp (Approved)",
              messages: [...c.messages, sysMsg],
            }
          : c
      )
    );
    showNotification(`Batch shift approved for ${selectedChat.studentName}. Timetable synced.`);
  };

  const handleQuickValidityExtension = () => {
    const sysMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: "system",
      text: `Medical exception logged: 30-day validity extension granted to ${selectedChat.studentName}.`,
      time: "Just now",
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? {
              ...c,
              messages: [...c.messages, sysMsg],
            }
          : c
      )
    );
    showNotification(`30-day course validity extension granted to ${selectedChat.studentName}.`);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] max-h-[calc(100vh-8.5rem)] flex flex-col gap-2.5 support-page-font overflow-hidden">
      {/* Toast Notification Alert */}
      {workflowToast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-slate-700/50">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{workflowToast}</span>
            <button
              onClick={() => setWorkflowToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Ultra-Compact Control Header (Zero wasted vertical space) */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-card border border-border/80 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-2xs shrink-0">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground truncate">
              Live Chat Desk
            </h1>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
              <span>•</span>
              <span className="font-semibold text-foreground">{activeCount} Active</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">{urgentCount} Urgent SLA</span>
              <span>•</span>
              <span className="text-slate-400 font-mono">Avg: 42s</span>
            </div>
          </div>
        </div>

        {/* Global Desk Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/40 text-[10px] font-semibold">
            <button
              onClick={() => setAgentStatus("online")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                agentStatus === "online"
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setAgentStatus("busy")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                agentStatus === "busy"
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              In Chat
            </button>
            <button
              onClick={() => setAgentStatus("away")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                agentStatus === "away"
                  ? "bg-slate-500/20 text-slate-700 dark:text-slate-300 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Away
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIs360DrawerOpen(true)}
            className="text-xs gap-1.5 h-7 px-2.5 font-semibold"
          >
            <User className="h-3 w-3 text-primary" />
            <span className="hidden sm:inline">Learner 360°</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleResolveChat}
            disabled={selectedChat?.status === "resolved"}
            className="text-xs gap-1.5 h-7 px-2.5 font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>Resolve</span>
          </Button>
        </div>
      </div>

      {/* Main 3-Column Workspace (Fills 100% of remaining space with internal scrolling only) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-hidden">
        {/* =========================================
            COLUMN 1: Conversation Queue (4 cols)
           ========================================= */}
        <Card className="lg:col-span-4 h-full flex flex-col overflow-hidden border-border/80 shadow-2xs">
          {/* Search & Filter Header */}
          <CardHeader className="p-2.5 border-b border-border/70 space-y-2 bg-muted/20 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-7 h-7 text-xs bg-background rounded-lg border-border/80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Filter Tabs with Live Counters */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/60 text-xs flex-1">
                {(["all", "active", "queued", "resolved"] as const).map((tab) => {
                  const count =
                    tab === "all"
                      ? chats.length
                      : tab === "active"
                      ? activeCount
                      : tab === "queued"
                      ? queuedCount
                      : resolvedCount;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusTab(tab)}
                      className={`flex-1 py-0.5 text-[11px] font-semibold rounded-md capitalize transition-all flex items-center justify-center gap-1 ${
                        statusTab === tab
                          ? "bg-background text-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{tab}</span>
                      <span className="text-[10px] opacity-75 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Urgent Toggle Pill */}
              <button
                type="button"
                onClick={() => setUrgentOnly((prev) => !prev)}
                title="Filter by Urgent SLA"
                className={`p-1 rounded-md border transition-all text-xs flex items-center gap-1 shrink-0 ${
                  urgentOnly
                    ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 font-bold"
                    : "bg-background border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Flame className={`h-3.5 w-3.5 ${urgentOnly ? "text-rose-600 animate-pulse" : ""}`} />
              </button>
            </div>
          </CardHeader>

          {/* Conversation Cards List */}
          <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto divide-y divide-border/60 sleek-scrollbar">
            {filteredChats.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                <AlertCircle className="h-5 w-5 mx-auto text-muted-foreground/60 mb-1" />
                <p className="font-semibold text-foreground">No conversations</p>
                <p>Adjust your search or status filter.</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`w-full text-left p-3 flex items-start gap-2.5 transition-all relative ${
                      isSelected
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    {/* Student Avatar + Online indicator */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/20 shadow-2xs">
                        {chat.avatar}
                      </div>
                      {chat.isOnline ? (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                      ) : (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-slate-400 ring-2 ring-background" />
                      )}
                    </div>

                    {/* Chat Content Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-foreground truncate">
                          {chat.studentName}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                          {chat.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground truncate leading-snug">
                        {chat.lastMessage}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 h-4 capitalize font-semibold ${
                            chat.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : chat.status === "queued"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {chat.status}
                        </Badge>

                        {chat.priority === "urgent" && (
                          <Badge
                            variant="destructive"
                            className="text-[9px] px-1.5 py-0 h-4 font-bold gap-1 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                          >
                            <Flame className="h-2.5 w-2.5 animate-pulse" />
                            &lt;{chat.slaMinutesLeft}m SLA
                          </Badge>
                        )}

                        {chat.unreadCount > 0 && (
                          <span className="ml-auto h-4 min-w-[16px] px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* =========================================
            COLUMN 2: Chat Stream Console (5 cols)
           ========================================= */}
        <Card className="lg:col-span-5 h-full flex flex-col overflow-hidden border-border/80 shadow-2xs">
          {/* Active Conversation Header */}
          <div className="p-2.5 border-b border-border/70 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/20 shadow-2xs">
                  {selectedChat.avatar}
                </div>
                {selectedChat.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-foreground truncate">
                    {selectedChat.studentName}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1 py-0 h-3.5 font-medium text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                  >
                    Verified
                  </Badge>
                  {selectedChat.priority === "urgent" && (
                    <Badge variant="destructive" className="text-[9px] px-1 py-0 h-3.5 font-bold">
                      Urgent SLA
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground truncate max-w-[240px]">
                  {selectedChat.courseTitle}
                </p>
              </div>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Simulate Voice Call"
                onClick={() => showNotification(`Initiating direct voice link with ${selectedChat.studentName}...`)}
              >
                <PhoneCall className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Launch Live Screen Share"
                onClick={() => showNotification(`Screen share room created for ${selectedChat.studentName}.`)}
              >
                <Video className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Refresh Thread"
                onClick={() => showNotification("Thread refreshed.")}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 min-h-0 p-3 overflow-y-auto space-y-2.5 sleek-scrollbar bg-card/40">
            {selectedChat.messages.map((msg) => {
              if (msg.sender === "system") {
                return (
                  <div key={msg.id} className="flex justify-center my-1.5">
                    <span className="text-[10px] text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full font-medium border border-border/50 shadow-2xs flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isAgent = msg.sender === "agent";
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${isAgent ? "justify-end" : "justify-start"}`}
                >
                  {!isAgent && (
                    <div className="h-6 w-6 rounded-md bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 ring-1 ring-primary/20">
                      {selectedChat.avatar}
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-xs space-y-1 ${
                      isAgent
                        ? "bg-primary text-primary-foreground rounded-br-xs shadow-primary/10"
                        : "bg-muted/80 text-foreground border border-border/80 rounded-bl-xs"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap text-xs">{msg.text}</p>
                    <div
                      className={`flex items-center gap-1 text-[9px] ${
                        isAgent ? "text-primary-foreground/80 justify-end" : "text-muted-foreground"
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isAgent && <CheckCheck className="h-3 w-3 text-emerald-300" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Typing Simulation */}
            {isStudentTyping && (
              <div className="flex items-end gap-1.5 justify-start animate-in fade-in duration-200">
                <div className="h-6 w-6 rounded-md bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                  {selectedChat.avatar}
                </div>
                <div className="bg-muted/80 text-muted-foreground border border-border/80 rounded-xl rounded-bl-xs px-2.5 py-1 text-xs flex items-center gap-1.5">
                  <span className="text-[10px]">{selectedChat.studentName.split(" ")[0]} is typing</span>
                  <span className="flex gap-1 items-center">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-bounce" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Copilot & Macro Acceleration Bar */}
          <div className="p-2 border-t border-border/70 bg-muted/15 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>AI Draft Suggestions:</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAiCopilotGenerate("batch")}
                  disabled={isCopilotThinking}
                  className="font-bold text-primary hover:bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Bot className="h-2.5 w-2.5" />
                  <span>Batch Shift</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAiCopilotGenerate("validity")}
                  disabled={isCopilotThinking}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="h-2.5 w-2.5" />
                  <span>Medical Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAiCopilotGenerate("empathy")}
                  disabled={isCopilotThinking}
                  className="font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Award className="h-2.5 w-2.5" />
                  <span>Empathetic</span>
                </button>
              </div>
            </div>

            {/* Quick Canned Macros */}
            <div className="flex gap-1 overflow-x-auto pb-0.5 sleek-scrollbar">
              {CANNED_MACROS.map((macro, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyMacro(macro.text)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium border border-border/70 bg-card hover:bg-muted text-foreground shrink-0 transition-all hover:border-primary/40 cursor-pointer flex items-center gap-1"
                >
                  <span className="font-mono text-primary font-bold">{macro.tag}</span>
                  <span>{macro.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Composer */}
          <div className="p-2 border-t border-border/70 bg-background space-y-1.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <textarea
                ref={textareaRef}
                rows={2}
                placeholder="Type response to student... (Enter to send, Shift+Enter for newline)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full text-xs p-2 rounded-lg border border-border/80 bg-card resize-none focus:outline-none focus:ring-1 focus:ring-primary/60 font-sans leading-tight"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  title="Attach File"
                  onClick={() => showNotification("File upload dialog simulated.")}
                >
                  <Paperclip className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  title="Insert Emoji"
                  onClick={() => setInputText((prev) => prev + " 👍 ")}
                >
                  <Smile className="h-3 w-3" />
                </Button>
                <span className="text-[9px] text-muted-foreground font-mono hidden sm:inline ml-1">
                  ↵ Enter to send
                </span>
              </div>

              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="h-7 px-3 bg-primary text-primary-foreground gap-1.5 text-xs font-semibold shrink-0 cursor-pointer shadow-xs hover:bg-primary/90"
              >
                <span>Send</span>
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>

        {/* =========================================
            COLUMN 3: Telemetry & Instant Actions (3 cols)
           ========================================= */}
        <Card className="lg:col-span-3 h-full flex flex-col overflow-hidden border-border/80 shadow-2xs">
          <CardHeader className="p-2.5 border-b border-border/70 bg-muted/20 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              Learner Telemetry
            </CardTitle>
            <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold py-0">
              Live
            </Badge>
          </CardHeader>

          <CardContent className="p-3 space-y-3 text-xs flex-1 min-h-0 overflow-y-auto sleek-scrollbar">
            {/* Student ID Card */}
            <div className="p-2.5 rounded-xl border border-border/80 bg-muted/20 text-center space-y-1 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary font-bold text-xs mx-auto flex items-center justify-center ring-2 ring-primary/20 shadow-xs">
                {selectedChat.avatar}
              </div>
              <h4 className="font-bold text-foreground text-xs leading-tight">
                {selectedChat.studentName}
              </h4>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {selectedChat.email}
              </p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Badge variant="outline" className="text-[9px] font-mono py-0">
                  #{selectedChat.studentId.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[9px] py-0 capitalize ${
                    selectedChat.isOnline
                      ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                      : "text-muted-foreground"
                  }`}
                >
                  {selectedChat.isOnline ? "Active" : "Offline"}
                </Badge>
              </div>
            </div>

            {/* Course & Progress Gauges */}
            <div className="space-y-2 p-2.5 rounded-xl border border-border/70 bg-background/50">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Enrolled Program
              </span>
              <p className="font-bold text-foreground text-xs leading-snug">
                {selectedChat.courseTitle}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {selectedChat.batchName}
              </p>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Course Completion</span>
                  <span className="font-bold text-foreground font-mono">
                    {selectedChat.progressPercent}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${selectedChat.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Attendance</span>
                  <span
                    className={`font-bold font-mono ${
                      selectedChat.attendancePercent >= 80
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {selectedChat.attendancePercent}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedChat.attendancePercent >= 80 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${selectedChat.attendancePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* One-Click Rapid Workflow Actions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                1-Click Resolutions
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickBatchApproval}
                className="w-full text-xs justify-start gap-1.5 h-7 font-semibold bg-primary/5 hover:bg-primary/10 border-primary/30 text-primary transition-all"
              >
                <ArrowRightLeft className="h-3 w-3 shrink-0" />
                <span>Approve Batch Move</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickValidityExtension}
                className="w-full text-xs justify-start gap-1.5 h-7 font-semibold bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 transition-all"
              >
                <Clock className="h-3 w-3 shrink-0" />
                <span>Grant 30d Validity</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIs360DrawerOpen(true)}
                className="w-full text-xs justify-start gap-1.5 h-7 font-semibold hover:border-border transition-all"
              >
                <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span>Inspect Student 360°</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Student360Drawer
        open={is360DrawerOpen}
        onOpenChange={setIs360DrawerOpen}
        studentId={selectedChat.studentId}
      />
    </div>
  );
};
