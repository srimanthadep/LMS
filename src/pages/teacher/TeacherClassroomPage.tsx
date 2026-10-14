import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  Users,
  MessageSquare,
  BarChart2,
  Hand,
  AlertCircle,
  HelpCircle,
  PhoneOff,
  Sparkles,
  Send,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

const INITIAL_CHAT: ChatMessage[] = [
  { id: "c1", sender: "Arjun Mehta", text: "Audio and video are crisp, Sir!", time: "06:31 PM" },
  { id: "c2", sender: "Pooja Hegde", text: "Can you explain supervisor fallback if tool returns empty?", time: "06:34 PM" },
];

export const TeacherClassroomPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Teacher Controls State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "participants" | "polls" | "doubts">("chat");

  // Interaction State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [newChatText, setNewChatText] = useState("");
  const [confusionCount, setConfusionCount] = useState(3);
  const [handRaiseCount, setHandRaiseCount] = useState(2);
  const [activeTopic, setActiveTopic] = useState("Hierarchical Supervisor Node Execution");

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("Which vector index structure prioritizes low RAM over raw recall?");
  const [pollOptions, setPollOptions] = useState([
    { text: "HNSW", votes: 8 },
    { text: "IVF-PQ", votes: 42 },
    { text: "Flat L2", votes: 2 },
  ]);
  const [pollLive, setPollLive] = useState(true);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: `chat-${Date.now()}`,
        sender: "Prof. Rajesh Verma (Host)",
        text: newChatText,
        time: "Just now",
      },
    ]);
    setNewChatText("");
  };

  const handleEndClass = () => {
    addNotification({
      title: "Lecture Broadcast Concluded",
      message: "Recording has been sent to the AI processing pipeline for transcription and chaptering.",
      type: "class",
      link: "/teacher/recordings",
    });
    navigate("/teacher/recordings");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Top Studio Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Radio className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-foreground">Teacher Live Studio</h1>
                <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4 bg-rose-600">
                  LIVE
                </Badge>
                <span className="text-xs font-mono text-muted-foreground font-semibold">
                  72 Students Attending
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-md">
                Active Topic: <strong>{activeTopic}</strong>
              </p>
            </div>
          </div>

          {/* Quick confusion meter & Raise Hands */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-bold">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{confusionCount} "I'm Lost" Signals</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-bold">
              <Hand className="h-3.5 w-3.5" />
              <span>{handRaiseCount} Raised Hands</span>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleEndClass}
              className="text-xs h-8 font-bold gap-1 shadow-xs"
            >
              <PhoneOff className="h-3.5 w-3.5" /> End Lecture
            </Button>
          </div>
        </div>

        {/* Studio Stage Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Video Stage Canvas (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-2xl overflow-hidden bg-slate-950 aspect-video relative border border-border/80 shadow-2xl flex flex-col justify-between p-4 text-white">
              {/* Top Overlays */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 border border-white/20">
                  Host: Prof. Rajesh Verma (1080p 60fps)
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> REC ACTIVE
                </span>
              </div>

              {/* Stage Visual Placeholder */}
              <div className="text-center z-10 space-y-2 max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto shadow-xl">
                  <Video className="h-9 w-9 text-primary" />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  {screenSharing ? "Screen Share Active (VS Code / Architecture Diagram)" : "Faculty Camera Studio Feed"}
                </h3>
                <p className="text-xs text-slate-400">
                  Agentic Systems Bootcamp • Cohort 3 • LangGraph Supervision Nodes
                </p>
              </div>

              {/* Media Controls Toolbar */}
              <div className="z-10 flex items-center justify-center gap-2 bg-black/70 p-2 rounded-xl backdrop-blur-md max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setMicOn(!micOn)}
                  className={`p-2.5 rounded-xl transition-all ${
                    micOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-600 text-white"
                  }`}
                  title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setCamOn(!camOn)}
                  className={`p-2.5 rounded-xl transition-all ${
                    camOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-rose-600 text-white"
                  }`}
                  title={camOn ? "Stop Camera" : "Start Camera"}
                >
                  {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setScreenSharing(!screenSharing)}
                  className={`p-2.5 rounded-xl transition-all ${
                    screenSharing ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  title="Share Screen"
                >
                  <ScreenShare className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Topic Marker Bar */}
            <div className="p-3 rounded-xl border border-border/70 bg-card flex items-center justify-between text-xs gap-3">
              <span className="font-semibold text-muted-foreground whitespace-nowrap">
                Current Topic Marker:
              </span>
              <Input
                value={activeTopic}
                onChange={(e) => setActiveTopic(e.target.value)}
                className="h-8 text-xs font-bold"
              />
              <Button size="sm" variant="outline" className="h-8 text-xs shrink-0 font-semibold">
                Set Marker
              </Button>
            </div>
          </div>

          {/* Right Tabbed Drawer: Chat, Polls, Hands, Doubts (1 col) */}
          <div className="space-y-3">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card h-[540px] flex flex-col justify-between">
              {/* Tab Selector */}
              <div className="grid grid-cols-4 p-1.5 border-b border-border/70 bg-muted/20 text-xs">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "chat" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("polls")}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "polls" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Polls
                </button>
                <button
                  onClick={() => setActiveTab("participants")}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "participants" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Roster ({72})
                </button>
                <button
                  onClick={() => setActiveTab("doubts")}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "doubts" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Hands ({handRaiseCount})
                </button>
              </div>

              {/* Tab 1: Live Chat */}
              {activeTab === "chat" && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 sleek-scrollbar text-xs">
                    {chatMessages.map((m) => (
                      <div key={m.id} className="p-2.5 rounded-xl bg-muted/20 border border-border/50 space-y-0.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-foreground">{m.sender}</span>
                          <span className="text-[10px] text-muted-foreground">{m.time}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="p-3 border-t border-border/70 flex gap-2 bg-card">
                    <Input
                      placeholder="Send message to classroom..."
                      value={newChatText}
                      onChange={(e) => setNewChatText(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button type="submit" size="sm" className="h-9 px-3 shrink-0">
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              )}

              {/* Tab 2: Polls */}
              {activeTab === "polls" && (
                <div className="flex-1 p-4 overflow-y-auto space-y-3 sleek-scrollbar text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Active Classroom Poll</span>
                    <Badge variant="default" className="text-[9px]">LIVE</Badge>
                  </div>
                  <p className="font-semibold text-foreground text-xs leading-snug">{pollQuestion}</p>

                  <div className="space-y-2 pt-1">
                    {pollOptions.map((opt, i) => {
                      const totalVotes = pollOptions.reduce((a, b) => a + b.votes, 0);
                      const pct = Math.round((opt.votes / totalVotes) * 100);
                      return (
                        <div key={i} className="p-2.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span>{opt.text}</span>
                            <span className="font-mono text-primary">{opt.votes} votes ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-8 font-semibold mt-2"
                  >
                    + Launch New Poll
                  </Button>
                </div>
              )}

              {/* Tab 3: Roster */}
              {activeTab === "participants" && (
                <div className="flex-1 p-3.5 overflow-y-auto space-y-2 sleek-scrollbar text-xs">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    72 Learners In Session
                  </p>
                  {["Arjun Mehta", "Pooja Hegde", "Rohan Nair", "Devendra Patel", "Simran Kaur"].map((name, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-card">
                      <span className="font-semibold text-foreground">{name}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Connected ✓</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Doubts & Hands */}
              {activeTab === "doubts" && (
                <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 sleek-scrollbar text-xs">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Raised Hands Queue
                  </p>
                  <div className="p-3 rounded-xl border border-primary/25 bg-primary/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-foreground">Pooja Hegde</strong>
                      <Badge variant="accent" className="text-[9px]">Hand Raised #1</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Requested audio mic permission to clarify LangGraph thread interrupts.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="h-7 text-[10px] px-2 font-bold">Grant Mic</Button>
                      <Button size="sm" variant="outline" className="h-7 text-[10px] px-2">Lower Hand</Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
