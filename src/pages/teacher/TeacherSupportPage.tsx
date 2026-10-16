import React, { useState, useRef, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LifeBuoy,
  Send,
  Paperclip,
  X,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  PlusCircle,
  Check,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High";

export type TicketCategory =
  | "Live Studio & AV"
  | "Assessments & Grading"
  | "Attendance & Rosters"
  | "Course Curriculum & Materials"
  | "AI Whisper & Recordings"
  | "Account & Security"
  | "Platform Glitch & Other";

export interface TicketAttachment {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  type: string;
  previewUrl?: string;
}

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: "faculty" | "support_agent" | "system";
  timestamp: string;
  message: string;
  attachments?: TicketAttachment[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

const STORAGE_KEY_TICKETS = "apex_lms_teacher_support_tickets";

// ==========================================
// INITIAL MOCK TICKETS
// ==========================================
const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "TICK-1042",
    subject: "Audio loopback latency during Cohort 7 Swarm Architecture broadcast",
    category: "Live Studio & AV",
    priority: "High",
    status: "In Progress",
    createdAt: "Oct 14, 2026, 04:15 PM",
    lastUpdated: "Oct 15, 2026, 09:30 AM",
    messages: [
      {
        id: "msg-1",
        senderName: "Prof. Rajesh Verma",
        senderRole: "faculty",
        timestamp: "Oct 14, 2026, 04:15 PM",
        message:
          "During today's live lecture on LangGraph supervisor nodes, students noted approximately 250ms audio latency and a soft echo loop when screen-sharing the Docker terminal. Microphone hardware test in studio preview showed green.",
        attachments: [
          {
            id: "att-1",
            name: "webrtc_stream_diagnostics.log",
            size: 42300,
            sizeFormatted: "41.3 KB",
            type: "text/plain",
          },
        ],
      },
      {
        id: "msg-2",
        senderName: "Priya Sharma (Tier 2 AV Specialist)",
        senderRole: "support_agent",
        timestamp: "Oct 14, 2026, 05:40 PM",
        message:
          "Hello Prof. Verma, our AV streaming engineering team reviewed the WebRTC session logs. The echo loop originated from the dual virtual audio cable input mixing Chrome tab audio. We have adjusted your encoder buffer profile to low-latency studio mode (60ms). Please test the audio preview monitor before your next broadcast.",
      },
    ],
  },
  {
    id: "TICK-0985",
    subject: "Awaiting approval for Whisper ASR chapter marker timestamp at 00:14:30",
    category: "AI Whisper & Recordings",
    priority: "Medium",
    status: "Resolved",
    createdAt: "Oct 12, 2026, 11:20 AM",
    lastUpdated: "Oct 13, 2026, 03:10 PM",
    messages: [
      {
        id: "msg-3",
        senderName: "Prof. Rajesh Verma",
        senderRole: "faculty",
        timestamp: "Oct 12, 2026, 11:20 AM",
        message:
          "Submitted a correction proposal for Lecture 14 chapter marker (LangGraph Swarm consensus protocol). Could you confirm if the update has been certified and synced for student replay library?",
      },
      {
        id: "msg-4",
        senderName: "Anand Patel (Academic Ops)",
        senderRole: "support_agent",
        timestamp: "Oct 13, 2026, 03:10 PM",
        message:
          "Prof. Rajesh, the timestamp marker update was reviewed and merged into the official Cohort 7 video manifest. Students watching the replay now see the corrected chapter division at 00:14:30.",
      },
    ],
  },
  {
    id: "TICK-0871",
    subject: "Formatting cohort distinction roster export for Senate Academic Audit",
    category: "Assessments & Grading",
    priority: "Low",
    status: "Closed",
    createdAt: "Oct 08, 2026, 02:45 PM",
    lastUpdated: "Oct 09, 2026, 10:15 AM",
    messages: [
      {
        id: "msg-5",
        senderName: "Prof. Rajesh Verma",
        senderRole: "faculty",
        timestamp: "Oct 08, 2026, 02:45 PM",
        message:
          "Need confirmation on whether the Grade Roster CSV export includes student institutional registration numbers and distinction percentiles required for the external accreditation committee.",
      },
      {
        id: "msg-6",
        senderName: "Deepak Mehta (Registrar Tech Desk)",
        senderRole: "support_agent",
        timestamp: "Oct 09, 2026, 10:15 AM",
        message:
          "Confirmed. The CSV export under 'Results & Feedback' includes the full audit schema: Registration ID, Roll Number, Normalized Assessment Scores, Final GPA, and Accreditation Standing tags.",
      },
    ],
  },
  {
    id: "TICK-1108",
    subject: "Attendance record override request for learner with verified medical note",
    category: "Attendance & Rosters",
    priority: "Medium",
    status: "Open",
    createdAt: "Oct 15, 2026, 08:30 AM",
    lastUpdated: "Oct 15, 2026, 08:30 AM",
    messages: [
      {
        id: "msg-7",
        senderName: "Prof. Rajesh Verma",
        senderRole: "faculty",
        timestamp: "Oct 15, 2026, 08:30 AM",
        message:
          "Student Arpit Sethi (Cohort 7) experienced a campus connectivity drop during the live attendance roll on Oct 14. Attached the verifiable log confirming login before disconnect.",
        attachments: [
          {
            id: "att-2",
            name: "connectivity_session_audit.png",
            size: 158200,
            sizeFormatted: "154.5 KB",
            type: "image/png",
          },
        ],
      },
    ],
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export const TeacherSupportPage: React.FC = () => {
  const { addNotification } = useNotifications();

  // New Support Request Modal State (Pop-up)
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // Tickets state loaded from localStorage or fallback
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TICKETS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TICKETS;
  });

  const saveTickets = (updated: SupportTicket[]) => {
    setTickets(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(updated));
    } catch {
      // localStorage fallback
    }
  };

  // Selected ticket for detailed conversation view
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Search & Filter state for Tickets
  const [ticketSearch, setTicketSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  // New Ticket Form State (Category, Subject, Description, Attachments)
  const [formCategory, setFormCategory] = useState<TicketCategory>("Live Studio & AV");
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAttachments, setFormAttachments] = useState<TicketAttachment[]>([]);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reply Form State
  const [replyText, setReplyText] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<TicketAttachment[]>([]);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  // Drag-and-drop state
  const [isDragging, setIsDragging] = useState(false);

  // Close helper for New Support Request modal
  const handleCancelNewTicket = () => {
    setIsNewTicketModalOpen(false);
    setFormError("");
  };

  // Keyboard navigation: Escape key closes active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isNewTicketModalOpen) {
        handleCancelNewTicket();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNewTicketModalOpen]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isNewTicketModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNewTicketModalOpen]);

  // Selected Ticket Object
  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(ticketSearch.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, ticketSearch, statusFilter, priorityFilter]);

  // Helper: Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper: Handle file processing
  const processFiles = (files: FileList | null, isReply = false) => {
    if (!files || files.length === 0) return;

    const allowedExtensions = ["png", "jpg", "jpeg", "webp", "pdf", "txt", "log", "json"];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const validAttachments: TicketAttachment[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(ext)) {
        addNotification({
          title: "Unsupported File Format",
          message: `File "${file.name}" is not supported. Use PNG, JPG, PDF, TXT, or LOG.`,
          type: "system",
        });
        return;
      }

      if (file.size > maxSizeBytes) {
        addNotification({
          title: "File Exceeds Size Limit",
          message: `File "${file.name}" exceeds the 10MB threshold.`,
          type: "system",
        });
        return;
      }

      const isImage = file.type.startsWith("image/");
      const attachment: TicketAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type || "application/octet-stream",
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      };

      validAttachments.push(attachment);
    });

    if (isReply) {
      setReplyAttachments((prev) => [...prev, ...validAttachments]);
    } else {
      setFormAttachments((prev) => [...prev, ...validAttachments]);
    }
  };

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, isReply = false) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files, isReply);
  };

  // Remove Attachment
  const handleRemoveAttachment = (id: string, isReply = false) => {
    if (isReply) {
      setReplyAttachments((prev) => prev.filter((a) => a.id !== id));
    } else {
      setFormAttachments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Submit Contact Support Form
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formSubject.trim()) {
      setFormError("Please provide an issue subject.");
      return;
    }

    if (!formDescription.trim()) {
      setFormError("Please enter a detailed description of the issue.");
      return;
    }

    const newTicketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowFormatted = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newTicket: SupportTicket = {
      id: newTicketId,
      subject: formSubject.trim(),
      category: formCategory,
      priority: "Medium",
      status: "Open",
      createdAt: nowFormatted,
      lastUpdated: nowFormatted,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: "Prof. Rajesh Verma",
          senderRole: "faculty",
          timestamp: nowFormatted,
          message: formDescription.trim(),
          attachments: formAttachments.length > 0 ? [...formAttachments] : undefined,
        },
      ],
    };

    const updatedTickets = [newTicket, ...tickets];
    saveTickets(updatedTickets);

    // Reset Form
    setFormSubject("");
    setFormDescription("");
    setFormAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Close modal on successful submission
    setIsNewTicketModalOpen(false);

    addNotification({
      title: "Support Ticket Created (Demo Simulation)",
      message: `Ticket #${newTicketId} has been saved locally for this frontend demo. In production, this request would be dispatched to the academic support team queue.`,
      type: "system",
    });

    // Select the newly created ticket to inspect details immediately
    setSelectedTicketId(newTicketId);
  };

  // Send Reply on Existing Ticket
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || (!replyText.trim() && replyAttachments.length === 0)) return;

    const nowFormatted = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newReplyMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      senderName: "Prof. Rajesh Verma",
      senderRole: "faculty",
      timestamp: nowFormatted,
      message: replyText.trim() || "(Attachments submitted without text note)",
      attachments: replyAttachments.length > 0 ? [...replyAttachments] : undefined,
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          lastUpdated: nowFormatted,
          messages: [...t.messages, newReplyMessage],
        };
      }
      return t;
    });

    saveTickets(updatedTickets);
    setReplyText("");
    setReplyAttachments([]);
    if (replyFileInputRef.current) replyFileInputRef.current.value = "";

    addNotification({
      title: "Reply Saved (Demo Simulation)",
      message: `Your reply to #${activeTicket.id} has been recorded locally. In production, an alert would be dispatched to the assigned support engineer.`,
      type: "system",
    });
  };

  // Status Styling Helper
  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return (
          <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 text-[10px] font-semibold gap-1">
            <Clock className="h-3 w-3" /> Open
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 text-[10px] font-semibold gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" /> In Progress
          </Badge>
        );
      case "Resolved":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-[10px] font-semibold gap-1">
            <CheckCircle2 className="h-3 w-3" /> Resolved
          </Badge>
        );
      case "Closed":
        return (
          <Badge variant="outline" className="text-slate-500 border-slate-300 text-[10px] font-semibold gap-1">
            <Check className="h-3 w-3" /> Closed
          </Badge>
        );
    }
  };

  // Priority Styling Helper
  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "High":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
            HIGH
          </span>
        );
      case "Medium":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            MED
          </span>
        );
      case "Low":
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40">
              <ShieldCheck className="h-3 w-3 mr-1" /> Faculty Assistance Desk
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Avg Turnaround ~14m
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <LifeBuoy className="h-6 w-6 text-primary" /> Teacher Support & Help Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Submit technical inquiries and review open ticket conversations with the academic support desk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setIsNewTicketModalOpen(true);
              setFormError("");
            }}
            className="h-9 text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New Support Request
          </Button>
        </div>
      </div>

      {/* Main Support Area: Ticket Details View OR Support Tickets List */}
      <div className="space-y-4">
        {activeTicket ? (
            /* Ticket Details View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedTicketId(null)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                >
                  ← Back to All Tickets
                </button>
                <div className="flex items-center gap-2">
                  {getStatusBadge(activeTicket.status)}
                  {getPriorityBadge(activeTicket.priority)}
                </div>
              </div>

              {/* Ticket Card Header */}
              <Card className="p-5 border-border/80 shadow-xs rounded-2xl bg-card space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{activeTicket.id}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-semibold text-foreground">{activeTicket.category}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground mt-1">
                      {activeTicket.subject}
                    </h2>
                  </div>
                  <div className="text-left md:text-right text-[11px] text-muted-foreground font-mono">
                    <div>Opened: {activeTicket.createdAt}</div>
                    <div>Updated: {activeTicket.lastUpdated}</div>
                  </div>
                </div>

                {/* Conversation History Thread */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    Conversation History ({activeTicket.messages.length})
                  </h3>

                  <div className="space-y-3">
                    {activeTicket.messages.map((msg) => {
                      const isFaculty = msg.senderRole === "faculty";
                      return (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isFaculty
                              ? "bg-slate-50/70 dark:bg-[#121c17] border-slate-200 dark:border-white/10"
                              : "bg-primary/5 border-primary/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  isFaculty
                                    ? "bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200"
                                    : "bg-primary text-primary-foreground"
                                }`}
                              >
                                {isFaculty ? "PR" : "TS"}
                              </span>
                              <div>
                                <span className="text-xs font-bold text-foreground block leading-tight">
                                  {msg.senderName}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  {isFaculty ? "Faculty Member" : "Technical Support Engineer"}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">{msg.timestamp}</span>
                          </div>

                          <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line pl-9">
                            {msg.message}
                          </p>

                          {/* Message Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 pl-9 space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                Attachments ({msg.attachments.length}):
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {msg.attachments.map((att) => (
                                  <div
                                    key={att.id}
                                    className="p-2 rounded-xl bg-background/80 border border-border flex items-center gap-2 text-xs"
                                  >
                                    {att.previewUrl ? (
                                      <img
                                        src={att.previewUrl}
                                        alt={att.name}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                    ) : (
                                      <FileText className="h-4 w-4 text-primary shrink-0" />
                                    )}
                                    <div className="max-w-xs truncate">
                                      <p className="font-medium truncate text-foreground text-[11px]">{att.name}</p>
                                      <p className="text-[10px] text-muted-foreground">{att.sizeFormatted}</p>
                                    </div>
                                    <span className="text-[10px] text-emerald-600 font-medium ml-1">Attached</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-border/60 space-y-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" /> Post Faculty Reply
                  </h4>

                  <textarea
                    rows={3}
                    placeholder="Type your message, diagnostic logs, or follow-up feedback..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-input bg-background/70 text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  {/* Reply Attachments Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, true)}
                    className={`p-3 rounded-xl border border-dashed transition-colors flex flex-col sm:flex-row items-center justify-between gap-2 ${
                      isDragging ? "border-primary bg-primary/10" : "border-border/80 bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Paperclip className="h-4 w-4 text-primary shrink-0" />
                      <span>Attach logs, screenshots, or receipts (Max 10MB per file)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        multiple
                        ref={replyFileInputRef}
                        onChange={(e) => processFiles(e.target.files, true)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => replyFileInputRef.current?.click()}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <Paperclip className="h-3 w-3" /> Select Files
                      </Button>
                    </div>
                  </div>

                  {/* Preview Reply Attachments */}
                  {replyAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {replyAttachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-1.5 px-2.5 rounded-lg bg-card border border-border flex items-center gap-2 text-xs"
                        >
                          {att.previewUrl ? (
                            <img src={att.previewUrl} alt={att.name} className="w-5 h-5 rounded object-cover" />
                          ) : (
                            <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                          <span className="font-mono text-[11px] truncate max-w-[160px]">{att.name}</span>
                          <span className="text-[10px] text-muted-foreground">({att.sizeFormatted})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id, true)}
                            className="text-muted-foreground hover:text-destructive cursor-pointer ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted-foreground italic">
                      Simulated frontend reply. Files are isolated to support tickets only.
                    </span>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" /> Send Reply
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          ) : (
            /* Tickets List View */
            <div className="space-y-4">
              {/* Search & Filters */}
              <Card className="p-4 border-border/80 shadow-xs rounded-2xl bg-card">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets by ID, subject, or category..."
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Tickets Cards Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Showing {filteredTickets.length} faculty support requests</span>
                  <span className="font-mono text-[11px]">Sorted by recent activity</span>
                </div>

                {filteredTickets.length === 0 ? (
                  <Card className="p-12 text-center border-dashed border-border/80">
                    <LifeBuoy className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground">No support requests match your search or filter.</p>
                  </Card>
                ) : (
                  filteredTickets.map((t) => (
                    <Card
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className="p-4 border-border/80 shadow-xs rounded-2xl bg-card hover:border-primary/40 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-primary">{t.id}</span>
                          <span className="text-[11px] text-muted-foreground font-medium">({t.category})</span>
                          {getStatusBadge(t.status)}
                          {getPriorityBadge(t.priority)}
                        </div>

                        <h3 className="text-sm font-bold text-foreground truncate">{t.subject}</h3>

                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {t.messages[t.messages.length - 1]?.message || "No messages"}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-border/60">
                        <span className="text-[11px] text-muted-foreground font-mono">{t.lastUpdated}</span>
                        <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                          <span>{t.messages.length} messages</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      {/* ========================================================
          NEW SUPPORT REQUEST MODAL / POPUP
      ======================================================== */}
      {isNewTicketModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={handleCancelNewTicket}
        >
          <div
            className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto sleek-scrollbar relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" /> Create Support Request
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submit technical or operational requests to the academic support desk. Provide detailed diagnostics or screenshots for rapid resolution.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelNewTicket}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Error Alert */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Issue Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as TicketCategory)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="Live Studio & AV">Live Studio & AV</option>
                  <option value="Assessments & Grading">Assessments & Grading</option>
                  <option value="Attendance & Rosters">Attendance & Rosters</option>
                  <option value="Course Curriculum & Materials">Course Curriculum & Materials</option>
                  <option value="AI Whisper & Recordings">AI Whisper & Recordings</option>
                  <option value="Account & Security">Account & Security</option>
                  <option value="Platform Glitch & Other">Platform Glitch & Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Subject *</label>
                <Input
                  placeholder="Brief summary of the issue (e.g., Audio delay during live lecture screen-share)"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide step-by-step reproduction details, cohort number, affected students, or error codes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-input bg-background/80 text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Drag & Drop File Upload Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Attachments (Screenshots / Crash Logs)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    Permitted solely for support diagnostics
                  </span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, false)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all text-center space-y-2 ${
                    isDragging
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : "border-border/80 bg-muted/10 hover:bg-muted/20"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Paperclip className="h-4 w-4" />
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">
                      Drag and drop diagnostic files here, or{" "}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary hover:underline font-bold cursor-pointer"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                      Supports PNG, JPG, WEBP, PDF, TXT, LOG up to 10MB each
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => processFiles(e.target.files, false)}
                    className="hidden"
                  />
                </div>

                {/* Attachments List with Image Previews */}
                {formAttachments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-foreground">
                      Attached Files ({formAttachments.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formAttachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-2 rounded-xl border border-border bg-card flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {att.previewUrl ? (
                              <img
                                src={att.previewUrl}
                                alt={att.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <FileText className="h-4 w-4" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-foreground truncate text-xs">{att.name}</p>
                              <p className="text-[10px] text-muted-foreground">{att.sizeFormatted}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id, false)}
                            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted cursor-pointer shrink-0"
                            aria-label={`Remove ${att.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Scope / Policy Notice */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#121c17] border border-slate-200 dark:border-white/10 text-[10px] sm:text-[11px] text-muted-foreground space-y-0.5">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Isolated Support Scope
                </span>
                <p>
                  File attachments are strictly scoped to support ticket diagnostic handling. They do not enable direct uploads or publishing of official courses, student learning materials, or assessments.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelNewTicket}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSupportPage;
