import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Hand,
  AlertCircle,
  MessageSquare,
  BarChart2,
  Send,
  Radio,
  FileText,
  CheckCircle2,
  PhoneOff,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export const StudentClassroomPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Classroom interaction state
  const [activeTab, setActiveTab] = useState<"chat" | "poll" | "notes">("chat");
  const [chatMessages, setChatMessages] = useState([
    { id: "c1", sender: "Prof. Rajesh Verma", text: "Welcome everyone! Today we build LangGraph hierarchical supervisor nodes.", time: "06:30 PM" },
    { id: "c2", sender: "Pooja Hegde", text: "Excited for this session! Audio is clear.", time: "06:31 PM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const [handRaised, setHandRaised] = useState(false);
  const [isLost, setIsLost] = useState(false);

  // Poll state
  const [votedOptionIndex, setVotedOptionIndex] = useState<number | null>(null);
  const [pollOptions, setPollOptions] = useState([
    { text: "HNSW", votes: 8 },
    { text: "IVF-PQ", votes: 42 },
    { text: "Flat L2", votes: 2 },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: `chat-${Date.now()}`,
        sender: "Arjun Mehta (You)",
        text: chatInput,
        time: "Just now",
      },
    ]);
    setChatInput("");
  };

  const handleToggleHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    if (next) {
      addNotification({
        title: "Hand Raised in Classroom",
        message: "Prof. Verma has been alerted that you have an active query.",
        type: "class",
      });
    }
  };

  const handleToggleLost = () => {
    const next = !isLost;
    setIsLost(next);
    if (next) {
      addNotification({
        title: "'I'm Lost' Signal Sent",
        message: "An anonymous feedback ping was sent to Prof. Verma to slow down pacing.",
        type: "class",
      });
    }
  };

  const handleVotePoll = (index: number) => {
    if (votedOptionIndex !== null) return;
    const updated = [...pollOptions];
    updated[index].votes += 1;
    setPollOptions(updated);
    setVotedOptionIndex(index);
    addNotification({
      title: "Poll Vote Recorded",
      message: `Your vote for "${pollOptions[index].text}" was counted.`,
      type: "class",
    });
  };

  return (
    <div className="space-y-4">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Radio className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-foreground">
                  Session 4: Multi-Agent Consensus & Hierarchical Supervision
                </h1>
                <Badge variant="default" className="text-[9px] bg-rose-600 font-bold">LIVE</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Instructor: <strong>Prof. Rajesh Verma</strong> • Topic: Hierarchical Supervisor Node Execution
              </p>
            </div>
          </div>

          {/* Student Interaction Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleLost}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isLost
                  ? "bg-amber-500 text-white shadow-xs animate-bounce"
                  : "bg-muted hover:bg-muted/80 text-foreground border border-border/70"
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{isLost ? "I'm Lost (Signaled ✓)" : "I'm Lost (Slow Down)"}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleHand}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                handRaised
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted hover:bg-muted/80 text-foreground border border-border/70"
              }`}
            >
              <Hand className="h-3.5 w-3.5" />
              <span>{handRaised ? "Hand Raised ✋" : "Raise Hand"}</span>
            </button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/student/dashboard")}
              className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <PhoneOff className="h-3.5 w-3.5 mr-1" /> Leave Room
            </Button>
          </div>
        </div>

        {/* Video Canvas & Student Interaction Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Live Stream Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-2xl overflow-hidden bg-slate-950 aspect-video relative border border-border/80 shadow-2xl flex flex-col justify-between p-4 text-white">
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 border border-white/20">
                  Live Broadcast Feed (1080p WebRTC Low Latency)
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE CONNECTED
                </span>
              </div>

              {/* Virtual stage graphics */}
              <div className="text-center z-10 space-y-2 max-w-md mx-auto">
                <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto shadow-xl">
                  <Video className="h-9 w-9 text-primary" />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  Prof. Rajesh Verma's Teaching Studio
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  StateGraph Cyclic Agents & Interrupt Fallbacks
                </p>
              </div>

              <div className="z-10 flex items-center justify-between text-xs bg-black/70 p-2 rounded-xl backdrop-blur-md">
                <span className="text-slate-300">
                  Topic Marker: <strong>Hierarchical Supervisor Node Execution</strong>
                </span>
                <span className="font-mono text-emerald-400">Audio/Video Sync: 0ms</span>
              </div>
            </div>
          </div>

          {/* Student Tabs: Chat, Poll, Notes (1 col) */}
          <div className="space-y-3">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card h-[480px] flex flex-col justify-between">
              {/* Tab Selector */}
              <div className="grid grid-cols-3 p-1.5 border-b border-border/70 bg-muted/20 text-xs">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "chat" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Class Chat
                </button>
                <button
                  onClick={() => setActiveTab("poll")}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "poll" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Live Poll
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === "notes" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* Tab 1: Chat */}
              {activeTab === "chat" && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 sleek-scrollbar text-xs">
                    {chatMessages.map((m) => (
                      <div key={m.id} className="p-2.5 rounded-xl bg-muted/20 border border-border/50 space-y-0.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-foreground">{m.sender}</span>
                          <span className="text-[10px] text-muted-foreground">{m.time}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="p-3 border-t border-border/70 flex gap-2 bg-card">
                    <Input
                      placeholder="Ask query in chat..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button type="submit" size="sm" className="h-9 px-3 shrink-0">
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              )}

              {/* Tab 2: Poll Voting */}
              {activeTab === "poll" && (
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 sleek-scrollbar text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Teacher Question</span>
                    <Badge variant="default" className="text-[9px]">LIVE</Badge>
                  </div>
                  <p className="font-bold text-foreground text-xs leading-snug">
                    Which vector index structure prioritizes low RAM over raw recall?
                  </p>

                  <div className="space-y-2 pt-1">
                    {pollOptions.map((opt, i) => {
                      const totalVotes = pollOptions.reduce((a, b) => a + b.votes, 0);
                      const pct = Math.round((opt.votes / totalVotes) * 100);
                      const isSelected = votedOptionIndex === i;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={votedOptionIndex !== null}
                          onClick={() => handleVotePoll(i)}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                              : "border-border/70 bg-card hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>{opt.text}</span>
                            {votedOptionIndex !== null && (
                              <span className="font-mono text-primary">{pct}% ({opt.votes})</span>
                            )}
                          </div>
                          {votedOptionIndex !== null && (
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {votedOptionIndex !== null && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Your vote has been recorded!
                    </p>
                  )}
                </div>
              )}

              {/* Tab 3: Notes */}
              {activeTab === "notes" && (
                <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p className="font-bold text-foreground text-xs">Live Lesson Key Takeaways</p>
                  <ul className="list-disc pl-4 space-y-1.5">
                    <li>LangGraph StateGraphs require clear reducer functions on the Messages key.</li>
                    <li>Hierarchical supervisors can route sub-tasks to child agents concurrently.</li>
                    <li>Always use thread checkpointers to preserve approval state across interruptions.</li>
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
  );
};
