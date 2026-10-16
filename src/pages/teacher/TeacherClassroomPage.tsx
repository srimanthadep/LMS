import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  Hand,
  AlertCircle,
  PhoneOff,
  Send,
  Radio,
  CheckCircle2,
  Wifi,
  WifiOff,
  Disc,
  VolumeX,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isHost?: boolean;
}

interface Participant {
  id: string;
  name: string;
  hasRaisedHand: boolean;
  isMicMuted: boolean;
  isConnected: boolean;
  connectionQuality: "HD" | "Good" | "Fair";
}

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: "p1", name: "Arjun Mehta", hasRaisedHand: false, isMicMuted: true, isConnected: true, connectionQuality: "HD" },
  { id: "p2", name: "Pooja Hegde", hasRaisedHand: true, isMicMuted: true, isConnected: true, connectionQuality: "HD" },
  { id: "p3", name: "Devendra Patel", hasRaisedHand: false, isMicMuted: true, isConnected: true, connectionQuality: "Good" },
  { id: "p4", name: "Simran Kaur", hasRaisedHand: true, isMicMuted: true, isConnected: true, connectionQuality: "HD" },
  { id: "p5", name: "Rohan Varma", hasRaisedHand: false, isMicMuted: true, isConnected: true, connectionQuality: "HD" },
  { id: "p6", name: "Ananya Deshmukh", hasRaisedHand: false, isMicMuted: true, isConnected: true, connectionQuality: "HD" },
  { id: "p7", name: "Kunal Sharma", hasRaisedHand: false, isMicMuted: true, isConnected: true, connectionQuality: "Fair" },
  { id: "p8", name: "Tanvi Saxena", hasRaisedHand: false, isMicMuted: true, isConnected: true, connectionQuality: "Good" },
];

const INITIAL_CHAT: ChatMessage[] = [
  { id: "c1", sender: "Arjun Mehta", text: "Audio and video are crisp, Sir!", time: "06:31 PM" },
  { id: "c2", sender: "Pooja Hegde", text: "Can you explain supervisor fallback if tool returns empty?", time: "06:34 PM" },
  { id: "c3", sender: "Simran Kaur", text: "Does the LangGraph StateGraph require strict Pydantic schemas?", time: "06:36 PM" },
];

export const TeacherClassroomPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Media & Hardware State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [recordSeconds, setRecordSeconds] = useState(2580); // ~43 mins in
  const [connectionState, setConnectionState] = useState<"connected" | "reconnecting" | "error">("connected");
  const [hardwareError, setHardwareError] = useState<string | null>(null);

  // Tabs & Views
  const [activeTab, setActiveTab] = useState<"chat" | "participants" | "polls" | "hands">("chat");

  // Interaction State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [newChatText, setNewChatText] = useState("");
  const [confusionCount, setConfusionCount] = useState(3);
  const [activeTopic, setActiveTopic] = useState("Hierarchical Supervisor Node Execution");
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [searchRoster, setSearchRoster] = useState("");

  // Poll State
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("Which vector index structure prioritizes low RAM over raw recall?");
  const [pollOptions, setPollOptions] = useState([
    { text: "HNSW", votes: 8 },
    { text: "IVF-PQ", votes: 42 },
    { text: "Flat L2", votes: 2 },
  ]);
  const [pollLive, setPollLive] = useState(true);

  // New Poll Form
  const [newPollQ, setNewPollQ] = useState("");
  const [newPollOpts, setNewPollOpts] = useState(["", "", ""]);

  // Media track refs for clean teardown
  const micStreamRef = useRef<MediaStream | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const recordTimerRef = useRef<any>(null);

  // Recording Timer effect
  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    }
    return () => {
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    };
  }, [isRecording]);

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  // Hardware integration toggles
  const handleToggleMic = async () => {
    if (!micOn) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;
        }
        setMicOn(true);
        setHardwareError(null);
      } catch (err) {
        // Do NOT claim connection succeeded if device access fails
        setMicOn(false);
        setHardwareError(
          `Microphone access denied: ${err instanceof Error ? err.message : "Hardware device unavailable or permission blocked by browser."}`
        );
      }
    } else {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      setMicOn(false);
    }
  };

  const handleToggleCam = async () => {
    if (!camOn) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          camStreamRef.current = stream;
        }
        setCamOn(true);
        setHardwareError(null);
      } catch (err) {
        // Do NOT claim connection succeeded if device access fails
        setCamOn(false);
        setHardwareError(
          `Camera access denied: ${err instanceof Error ? err.message : "Hardware webcam unavailable or permission blocked."}`
        );
      }
    } else {
      if (camStreamRef.current) {
        camStreamRef.current.getTracks().forEach((track) => track.stop());
        camStreamRef.current = null;
      }
      setCamOn(false);
    }
  };

  const handleToggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = stream;
          stream.getVideoTracks()[0].onended = () => {
            setScreenSharing(false);
            screenStreamRef.current = null;
          };
        }
        setScreenSharing(true);
        setHardwareError(null);
      } catch (err) {
        setScreenSharing(false);
        setHardwareError(
          `Screen share cancelled: ${err instanceof Error ? err.message : "Display capture request declined."}`
        );
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setScreenSharing(false);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording((prev) => !prev);
    addNotification({
      title: !isRecording ? "Recording Resumed" : "Recording Paused",
      message: !isRecording
        ? "Session recording is now active."
        : "Session recording paused in local studio state.",
      type: "system",
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: `chat-${Date.now()}`,
        sender: "Prof. Rajesh Verma (Host)",
        text: newChatText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isHost: true,
      },
    ]);
    setNewChatText("");
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const validOpts = newPollOpts.filter((o) => o.trim().length > 0);
    if (!newPollQ.trim() || validOpts.length < 2) return;

    setPollQuestion(newPollQ);
    setPollOptions(validOpts.map((text) => ({ text, votes: 0 })));
    setPollLive(true);
    setShowNewPollModal(false);
    setNewPollQ("");
    setNewPollOpts(["", "", ""]);

    addNotification({
      title: "Class Poll Launched",
      message: "Interactive poll broadcasted to connected students in classroom.",
      type: "class",
    });
  };

  const handleSimulateVote = (optIndex: number) => {
    setPollOptions((prev) =>
      prev.map((opt, i) => (i === optIndex ? { ...opt, votes: opt.votes + 1 } : opt))
    );
  };

  const handleToggleParticipantMic = (pId: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === pId ? { ...p, isMicMuted: !p.isMicMuted } : p))
    );
  };

  const handleLowerHand = (pId: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === pId ? { ...p, hasRaisedHand: false } : p))
    );
  };

  const handleMuteAll = () => {
    setParticipants((prev) => prev.map((p) => ({ ...p, isMicMuted: true })));
    addNotification({
      title: "All Students Muted",
      message: "Microphone permission muted across all attendees.",
      type: "system",
    });
  };

  const handleAcknowledgeConfusion = () => {
    setConfusionCount(0);
    addNotification({
      title: "Confusion Signals Reset",
      message: "Clarified current concept segment and cleared 'I'm Lost' telemetry.",
      type: "system",
    });
  };

  const handleEndClass = () => {
    if (window.confirm("Conclude live studio broadcast? Audio/video tracks and recording will stop.")) {
      // Cleanly stop all active media tracks
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (camStreamRef.current) {
        camStreamRef.current.getTracks().forEach((track) => track.stop());
        camStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }

      // Stop recording and timers
      setIsRecording(false);
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }

      setMicOn(false);
      setCamOn(false);
      setScreenSharing(false);

      addNotification({
        title: "Lecture Broadcast Concluded",
        message: "Studio broadcast stopped and recording saved to local review library (simulated - external AI pipeline not connected).",
        type: "class",
        link: "/teacher/recordings",
      });
      navigate("/teacher/recordings");
    }
  };

  const handRaisedParticipants = participants.filter((p) => p.hasRaisedHand);
  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchRoster.toLowerCase())
  );

  return (
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
              <span className="text-xs font-mono text-muted-foreground font-semibold flex items-center gap-1">
                <Wifi className="h-3 w-3 text-emerald-500" /> 72 Students Connected
              </span>
              <span
                onClick={() => setConnectionState((prev) => (prev === "connected" ? "reconnecting" : "connected"))}
                className={`text-xs font-mono font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition ${
                  connectionState === "connected"
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                    : connectionState === "reconnecting"
                    ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 animate-pulse"
                    : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
                }`}
                title="Connection Health (Click to test reconnect)"
              >
                {connectionState === "connected" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {connectionState === "connected" ? "Link: 12ms (Optimal)" : connectionState === "reconnecting" ? "Re-syncing..." : "Degraded"}
              </span>
              <span className="text-xs font-mono text-rose-500 font-bold flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                <Disc className="h-3 w-3 animate-spin" /> REC {formatTimer(recordSeconds)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-md">
              Current Session: <strong>Multi-Agent Consensus & Supervision (Cohort 7)</strong>
            </p>
          </div>
        </div>

        {/* Quick Confusion Meter & Raise Hands */}
        <div className="flex items-center gap-2">
          {confusionCount > 0 ? (
            <button
              onClick={handleAcknowledgeConfusion}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/25 cursor-pointer transition"
              title="Click to acknowledge and clear confusion spike"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{confusionCount} "I'm Lost" Signals (Reset)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>No Active Confusion</span>
            </div>
          )}

          <div
            onClick={() => setActiveTab("hands")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-bold cursor-pointer hover:bg-primary/20 transition"
          >
            <Hand className="h-3.5 w-3.5" />
            <span>{handRaisedParticipants.length} Raised Hands</span>
          </div>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleEndClass}
            className="text-xs h-8 font-bold gap-1 shadow-xs cursor-pointer"
          >
            <PhoneOff className="h-3.5 w-3.5" /> End Lecture
          </Button>
        </div>
      </div>

      {hardwareError && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{hardwareError}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setHardwareError(null)} className="h-6 px-2 text-xs hover:bg-amber-200/50">
            Dismiss
          </Button>
        </div>
      )}

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
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> AI REPLAY ACTIVE
              </span>
            </div>

            {/* Stage Visual Placeholder / Stream view */}
            <div className="text-center z-10 space-y-2 max-w-md mx-auto">
              <div className="h-20 w-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mx-auto shadow-xl">
                <Video className="h-9 w-9 text-primary" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                {screenSharing
                  ? "Screen Share Active (VS Code LangGraph Swarm & Docker Nodes)"
                  : camOn
                  ? "Faculty Studio High-Definition Camera Stream"
                  : "Faculty Camera Paused"}
              </h3>
              <p className="text-xs text-slate-400">
                Active Topic: <span className="text-primary font-semibold">{activeTopic}</span>
              </p>
            </div>

            {/* Media Controls Toolbar */}
            <div className="z-10 flex items-center justify-center gap-2 bg-black/80 p-2 rounded-xl backdrop-blur-md max-w-md mx-auto border border-white/10">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  micOn ? "bg-white/15 hover:bg-white/25 text-white" : "bg-rose-600 text-white"
                }`}
                title={micOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleToggleCam}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  camOn ? "bg-white/15 hover:bg-white/25 text-white" : "bg-rose-600 text-white"
                }`}
                title={camOn ? "Stop Camera" : "Start Camera"}
              >
                {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleToggleScreenShare}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  screenSharing ? "bg-primary text-white" : "bg-white/15 hover:bg-white/25 text-white"
                }`}
                title="Share Screen"
              >
                <ScreenShare className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isRecording ? "bg-rose-600/80 text-white" : "bg-white/15 text-white"
                }`}
                title={isRecording ? "Pause Recording" : "Resume Recording"}
              >
                <Disc className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Topic Marker Bar */}
          <div className="p-3 rounded-xl border border-border/70 bg-card flex items-center justify-between text-xs gap-3">
            <span className="font-semibold text-muted-foreground whitespace-nowrap">
              Timestamp Topic Marker:
            </span>
            <Input
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
              className="h-8 text-xs font-bold"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                addNotification({
                  title: "Topic Marker Placed",
                  message: `Segment "${activeTopic}" tagged at ${formatTimer(recordSeconds)}.`,
                  type: "class",
                })
              }
              className="h-8 text-xs shrink-0 font-semibold cursor-pointer"
            >
              Tag Marker
            </Button>
          </div>
        </div>

        {/* Right Tabbed Drawer: Chat, Polls, Hands, Roster (1 col) */}
        <div className="space-y-3">
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card h-[540px] flex flex-col justify-between">
            {/* Tab Selector */}
            <div className="grid grid-cols-4 p-1.5 border-b border-border/70 bg-muted/20 text-xs">
              <button
                onClick={() => setActiveTab("chat")}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "chat" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("polls")}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "polls" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Polls
              </button>
              <button
                onClick={() => setActiveTab("participants")}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "participants" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Roster ({participants.length})
              </button>
              <button
                onClick={() => setActiveTab("hands")}
                className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "hands" ? "bg-card shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hands ({handRaisedParticipants.length})
              </button>
            </div>

            {/* Tab 1: Live Chat */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 sleek-scrollbar text-xs">
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-xl border space-y-0.5 ${
                        m.isHost
                          ? "bg-primary/10 border-primary/30"
                          : "bg-muted/20 border-border/50"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[11px]">
                        <span className={`font-bold ${m.isHost ? "text-primary" : "text-foreground"}`}>
                          {m.sender}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="p-3 border-t border-border/70 flex gap-2 bg-card">
                  <Input
                    placeholder="Broadcast message to classroom..."
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Button type="submit" size="sm" className="h-9 px-3 shrink-0 cursor-pointer">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            )}

            {/* Tab 2: Polls */}
            {activeTab === "polls" && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3 sleek-scrollbar text-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Classroom Live Poll</span>
                    <Badge variant={pollLive ? "default" : "outline"} className="text-[9px]">
                      {pollLive ? "LIVE ACTIVE" : "CLOSED"}
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground text-xs leading-snug">{pollQuestion}</p>

                  <div className="space-y-2 pt-1">
                    {pollOptions.map((opt, i) => {
                      const totalVotes = pollOptions.reduce((a, b) => a + b.votes, 0) || 1;
                      const pct = Math.round((opt.votes / totalVotes) * 100);
                      return (
                        <div key={i} className="p-2.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span>{opt.text}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-primary">{opt.votes} votes ({pct}%)</span>
                              {pollLive && (
                                <button
                                  type="button"
                                  onClick={() => handleSimulateVote(i)}
                                  className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded hover:bg-primary/30"
                                >
                                  +1 Vote
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border/70">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPollLive(!pollLive)}
                    className="flex-1 text-xs h-8 cursor-pointer"
                  >
                    {pollLive ? "Close Poll" : "Reopen Poll"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowNewPollModal(true)}
                    className="flex-1 text-xs h-8 cursor-pointer"
                  >
                    + New Poll
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 3: Roster */}
            {activeTab === "participants" && (
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 sleek-scrollbar text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Connected Attendees ({participants.length})
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleMuteAll}
                      className="h-6 text-[10px] text-rose-600 hover:bg-rose-50"
                    >
                      <VolumeX className="h-3 w-3 mr-1" /> Mute All
                    </Button>
                  </div>

                  <Input
                    placeholder="Search attendee by name..."
                    value={searchRoster}
                    onChange={(e) => setSearchRoster(e.target.value)}
                    className="h-7 text-xs mb-2"
                  />

                  <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
                    {filteredParticipants.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-card hover:bg-muted/20"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-foreground">{p.name}</span>
                          {p.hasRaisedHand && (
                            <Badge variant="accent" className="text-[8px] px-1 py-0">Hand</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground font-mono">{p.connectionQuality}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleParticipantMic(p.id)}
                            className={`p-1 rounded ${
                              p.isMicMuted ? "text-slate-400 hover:text-slate-600" : "text-emerald-600 bg-emerald-50"
                            }`}
                            title={p.isMicMuted ? "Unmute Student Mic" : "Mute Student Mic"}
                          >
                            {p.isMicMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Doubts & Hands */}
            {activeTab === "hands" && (
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 sleek-scrollbar text-xs">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Raised Hands Queue ({handRaisedParticipants.length})
                </p>

                {handRaisedParticipants.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic text-center py-8">
                    No active hands raised in the queue right now.
                  </p>
                ) : (
                  handRaisedParticipants.map((p, idx) => (
                    <div key={p.id} className="p-3 rounded-xl border border-primary/25 bg-primary/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <strong className="text-foreground">{p.name}</strong>
                        <Badge variant="accent" className="text-[9px]">Priority #{idx + 1}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Requested audio permission to clarify consensus synchronization node.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => {
                            handleToggleParticipantMic(p.id);
                            addNotification({
                              title: `Mic Granted to ${p.name}`,
                              message: "Student now has live audio transmission rights.",
                              type: "class",
                            });
                          }}
                          className="h-7 text-[10px] px-2 font-bold cursor-pointer"
                        >
                          {p.isMicMuted ? "Grant Mic" : "Revoke Mic"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLowerHand(p.id)}
                          className="h-7 text-[10px] px-2 cursor-pointer"
                        >
                          Lower Hand
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* New Poll Creator Modal */}
      {showNewPollModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Instant Classroom Poll</h3>
              <button onClick={() => setShowNewPollModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Question</label>
                <Input
                  required
                  placeholder="e.g. In LangGraph, when should you return END?"
                  value={newPollQ}
                  onChange={(e) => setNewPollQ(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Answer Choices</label>
                {newPollOpts.map((opt, i) => (
                  <Input
                    key={i}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newPollOpts];
                      updated[i] = e.target.value;
                      setNewPollOpts(updated);
                    }}
                    className="h-8 text-xs"
                  />
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNewPollModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  Launch to Students
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassroomPage;
