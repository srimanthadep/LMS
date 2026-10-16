import React, { useState } from "react";
import {
  CircleHelp,
  LifeBuoy,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Paperclip,
  Send,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  X,
  User,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";

export type TicketCategory =
  | "Login and Account"
  | "Courses and Learning Materials"
  | "Live Classes and Recordings"
  | "Assignments and Tests"
  | "Payments and Refunds"
  | "Certificates and Results"
  | "Technical Issues"
  | "Communication Support"
  | "Other";

export type TicketStatus = "Open" | "In Progress" | "Waiting for Student" | "Resolved" | "Closed";

export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export interface TicketMessage {
  id: string;
  sender: string;
  role: "student" | "support_agent" | "system";
  message: string;
  timestamp: string;
}

export interface StudentTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
  relatedCourseOrFeature?: string;
  description: string;
  attachmentName?: string;
  messages: TicketMessage[];
}

const INITIAL_TICKETS: StudentTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-2026-STU-1082",
    subject: "KV-Cache lecture timestamp link not advancing player on Chapter 3",
    category: "Live Classes and Recordings",
    priority: "High",
    status: "In Progress",
    createdAt: "13 Oct 2026, 11:20 AM",
    updatedAt: "14 Oct 2026, 04:15 PM",
    assignedAgent: "Rohan Desai (LMS Operations)",
    relatedCourseOrFeature: "Distributed Systems & KV-Cache Infrastructure",
    description:
      "When clicking the timestamp markers in the notes tab for Chapter 3, the video player reloads from 0:00 instead of jumping to 42:15.",
    attachmentName: "player_console_screenshot.png",
    messages: [
      {
        id: "m-1",
        sender: "Arjun Mehta (You)",
        role: "student",
        message:
          "Hello Support, when clicking the timestamp markers in the notes tab for Chapter 3, the video player reloads from 0:00 instead of jumping to 42:15.",
        timestamp: "13 Oct 2026, 11:20 AM",
      },
      {
        id: "m-2",
        sender: "Rohan Desai (LMS Operations)",
        role: "support_agent",
        message:
          "Hi Arjun! Thank you for the detailed report and screenshot. We reproduced the deep-link URL parsing issue on Chromium mobile viewports. A hotfix patch is being deployed to the SmartPlayer component.",
        timestamp: "14 Oct 2026, 04:15 PM",
      },
    ],
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-2026-STU-1045",
    subject: "Autonomous Agent Architect Certificate verification badge missing on LinkedIn",
    category: "Certificates and Results",
    priority: "Medium",
    status: "Resolved",
    createdAt: "09 Oct 2026, 02:40 PM",
    updatedAt: "10 Oct 2026, 09:30 AM",
    assignedAgent: "Aayushi Patel (Academic Registrar)",
    relatedCourseOrFeature: "Certificates Portal",
    description: "The OpenBadge metadata URL returned 404 when syncing my certificate APX-CERT-2026-091.",
    messages: [
      {
        id: "m-3",
        sender: "Arjun Mehta (You)",
        role: "student",
        message: "The OpenBadge metadata URL returned 404 when syncing my certificate APX-CERT-2026-091.",
        timestamp: "09 Oct 2026, 02:40 PM",
      },
      {
        id: "m-4",
        sender: "Aayushi Patel (Academic Registrar)",
        role: "support_agent",
        message:
          "Resolved! The metadata JSON endpoint had a caching delay on our verification server. Your verifiable credential URL is now live and confirmed on the blockchain registrar.",
        timestamp: "10 Oct 2026, 09:30 AM",
      },
    ],
  },
  {
    id: "tkt-3",
    ticketNumber: "TKT-2026-STU-1011",
    subject: "Inquiry on Communication Viva schedule slot reservation",
    category: "Communication Support",
    priority: "Low",
    status: "Closed",
    createdAt: "28 Sep 2026, 10:00 AM",
    updatedAt: "29 Sep 2026, 03:00 PM",
    assignedAgent: "Support AI Bot",
    relatedCourseOrFeature: "Communication Support Module",
    description: "Wanted to confirm if viva slots can be rescheduled up to 2 hours prior without academic penalty.",
    messages: [
      {
        id: "m-5",
        sender: "Arjun Mehta (You)",
        role: "student",
        message: "Wanted to confirm if viva slots can be rescheduled up to 2 hours prior without academic penalty.",
        timestamp: "28 Sep 2026, 10:00 AM",
      },
      {
        id: "m-6",
        sender: "Support AI Bot",
        role: "system",
        message:
          "Yes! Per the Academic Handbook, viva slots may be freely rescheduled up to 2 hours prior directly from the 1:1 Mentors portal or Communication Support hub.",
        timestamp: "29 Sep 2026, 03:00 PM",
      },
    ],
  },
];

export const StudentSupportPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [tickets, setTickets] = useState<StudentTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<StudentTicket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Create Ticket Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Technical Issues");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [relatedCourse, setRelatedCourse] = useState("Full-Stack AI Engineering & Autonomous Agents");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // Reply in ticket thread
  const [replyText, setReplyText] = useState("");


  const handleOpenTicketDetail = (ticket: StudentTicket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
    setReplyText("");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert("Please provide both a ticket subject and description.");
      return;
    }

    const newTicketNumber = `TKT-2026-STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: StudentTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: newTicketNumber,
      subject,
      category,
      priority,
      status: "Open",
      createdAt: "Just now",
      updatedAt: "Just now",
      assignedAgent: "Queue Desk (Unassigned)",
      relatedCourseOrFeature: relatedCourse,
      description,
      attachmentName: attachment ? attachment.name : undefined,
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "Arjun Mehta (You)",
          role: "student",
          message: description,
          timestamp: "Just now",
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setIsCreateModalOpen(false);

    // Reset Form
    setSubject("");
    setDescription("");
    setAttachment(null);

    addNotification({
      title: "Support Ticket Created",
      message: `Your ticket ${newTicketNumber} has been logged and queued for support review.`,
      type: "system",
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const newMsg: TicketMessage = {
      id: `m-${Date.now()}`,
      sender: "Arjun Mehta (You)",
      role: "student",
      message: replyText,
      timestamp: "Just now",
    };

    const updatedTicket: StudentTicket = {
      ...selectedTicket,
      updatedAt: "Just now",
      status: selectedTicket.status === "Resolved" ? "In Progress" : selectedTicket.status,
      messages: [...selectedTicket.messages, newMsg],
    };

    setSelectedTicket(updatedTicket);
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    setReplyText("");

    addNotification({
      title: "Reply Sent",
      message: `Reply posted to ticket ${selectedTicket.ticketNumber}.`,
      type: "system",
    });
  };

  const handleReopenTicket = () => {
    if (!selectedTicket) return;

    const updatedTicket: StudentTicket = {
      ...selectedTicket,
      status: "In Progress",
      updatedAt: "Just now",
      messages: [
        ...selectedTicket.messages,
        {
          id: `m-${Date.now()}`,
          sender: "System",
          role: "system",
          message: "Ticket was reopened by the student for additional clarification.",
          timestamp: "Just now",
        },
      ],
    };

    setSelectedTicket(updatedTicket);
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));

    addNotification({
      title: "Ticket Reopened",
      message: `Ticket ${selectedTicket.ticketNumber} is now marked In Progress.`,
      type: "system",
    });
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "In Progress" && (t.status === "In Progress" || t.status === "Waiting for Student")) ||
      (statusFilter === "Resolved" && (t.status === "Resolved" || t.status === "Closed")) ||
      t.status === statusFilter;

    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">Open</Badge>;
      case "In Progress":
        return <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">In Progress</Badge>;
      case "Waiting for Student":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs">Waiting for Student</Badge>;
      case "Resolved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">Resolved</Badge>;
      case "Closed":
        return <Badge variant="secondary" className="text-xs">Closed</Badge>;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "Urgent":
        return <Badge variant="destructive" className="text-[10px] uppercase font-bold">Urgent</Badge>;
      case "High":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px]">High</Badge>;
      case "Medium":
        return <Badge variant="secondary" className="text-[10px]">Medium</Badge>;
      case "Low":
        return <Badge variant="outline" className="text-[10px]">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <CircleHelp className="h-6 w-6 text-primary" /> Support & Help Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Submit inquiries, track technical issues, and interact with the student operations team.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Create Support Ticket
        </Button>
      </div>


      {/* Search and Filters Bar */}
      <Card className="rounded-2xl border-border/60 shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search by ticket #, subject, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved / Closed</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
            >
              <option value="All">All Categories</option>
              <option value="Login and Account">Login & Account</option>
              <option value="Courses and Learning Materials">Courses & Materials</option>
              <option value="Live Classes and Recordings">Live Classes & Recordings</option>
              <option value="Assignments and Tests">Assignments & Tests</option>
              <option value="Payments and Refunds">Payments & Refunds</option>
              <option value="Certificates and Results">Certificates & Results</option>
              <option value="Technical Issues">Technical Issues</option>
              <option value="Communication Support">Communication Support</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Section C: Ticket Tracking List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Ticket Tracking & History ({filteredTickets.length})
          </h3>
          <span className="text-xs text-muted-foreground">Click ticket to view thread or reply</span>
        </div>

        {filteredTickets.length === 0 ? (
          <Card className="rounded-2xl border-border/60 p-8 text-center space-y-2">
            <LifeBuoy className="h-8 w-8 text-muted-foreground mx-auto" />
            <h4 className="text-sm font-bold text-foreground">No Tickets Found</h4>
            <p className="text-xs text-muted-foreground">
              No support tickets match the current filter criteria.
            </p>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              onClick={() => handleOpenTicketDetail(ticket)}
              className="rounded-2xl border-border/60 hover:border-primary/40 transition-all cursor-pointer shadow-sm hover:shadow-md p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {ticket.ticketNumber}
                    </span>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                    <Badge variant="outline" className="text-[11px]">
                      {ticket.category}
                    </Badge>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {ticket.subject}
                  </h4>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                    <span>Created: {ticket.createdAt}</span>
                    <span>•</span>
                    <span>Updated: {ticket.updatedAt}</span>
                    {ticket.assignedAgent && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <User className="h-3 w-3 text-primary" /> {ticket.assignedAgent}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" /> {ticket.messages.length} replies
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* MODAL: CREATE SUPPORT TICKET (SECTION B) */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" /> Create Support Ticket
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submit your inquiry to the student support team with relevant details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Ticket Subject *</label>
              <Input
                placeholder="Brief summary of the issue (e.g. Cannot download graded certificate)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Issue Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Login and Account">Login and Account</option>
                  <option value="Courses and Learning Materials">Courses and Learning Materials</option>
                  <option value="Live Classes and Recordings">Live Classes and Recordings</option>
                  <option value="Assignments and Tests">Assignments and Tests</option>
                  <option value="Payments and Refunds">Payments and Refunds</option>
                  <option value="Certificates and Results">Certificates and Results</option>
                  <option value="Technical Issues">Technical Issues</option>
                  <option value="Communication Support">Communication Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Low">Low (General guidance)</option>
                  <option value="Medium">Medium (Standard priority)</option>
                  <option value="High">High (Coursework impaired)</option>
                  <option value="Urgent">Urgent (Exam or payment block)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Related Course or Feature</label>
              <select
                value={relatedCourse}
                onChange={(e) => setRelatedCourse(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Full-Stack AI Engineering & Autonomous Agents">
                  Full-Stack AI Engineering & Autonomous Agents
                </option>
                <option value="Distributed Systems & KV-Cache Infrastructure">
                  Distributed Systems & KV-Cache Infrastructure
                </option>
                <option value="Foundations of LLM Fine-Tuning">Foundations of LLM Fine-Tuning</option>
                <option value="Smart Video Player & Replays">Smart Video Player & Replays</option>
                <option value="Timed Assessments & Quizzes">Timed Assessments & Quizzes</option>
                <option value="Certificates Portal">Certificates Portal</option>
                <option value="Payment Gateway">Payment Gateway</option>
                <option value="Other / General">Other / General</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Detailed Issue Description *</label>
              <textarea
                rows={4}
                placeholder="Explain the issue, steps to reproduce, or exact error message observed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Attachment Upload */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Attachment (Screenshot or Logs)</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="file"
                  id="ticket-file"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("ticket-file")?.click()}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <Paperclip className="h-3.5 w-3.5 text-primary" />
                  {attachment ? "Replace File" : "Attach File"}
                </Button>
                {attachment ? (
                  <span className="text-xs font-mono text-foreground flex items-center gap-1.5">
                    {attachment.name} ({(attachment.size / 1024).toFixed(0)} KB)
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">PNG, JPG, PDF up to 5MB</span>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 gap-1.5"
              >
                <Send className="h-3.5 w-3.5" /> Submit Support Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: TICKET DETAILS & CONVERSATION THREAD */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {selectedTicket.ticketNumber}
                  </span>
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  <Badge variant="outline" className="text-xs">
                    {selectedTicket.category}
                  </Badge>
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                  {selectedTicket.subject}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Created {selectedTicket.createdAt} • Assigned:{" "}
                  <span className="font-semibold text-foreground">{selectedTicket.assignedAgent || "Unassigned"}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Related Course & Attachment Notice */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs space-y-1">
                {selectedTicket.relatedCourseOrFeature && (
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Related:</span> {selectedTicket.relatedCourseOrFeature}
                  </p>
                )}
                {selectedTicket.attachmentName && (
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Paperclip className="h-3 w-3 text-primary" />
                    <span className="font-semibold text-foreground">Attachment:</span> {selectedTicket.attachmentName}
                  </p>
                )}
              </div>

              {/* Conversation Messages */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" /> Conversation History
                </h5>

                <div className="space-y-3">
                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        msg.role === "student"
                          ? "bg-primary/5 border-primary/20 ml-4 sm:ml-8"
                          : msg.role === "support_agent"
                          ? "bg-muted/40 border-border/60 mr-4 sm:mr-8"
                          : "bg-muted/20 border-dashed border-border/60 text-center"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-foreground">{msg.sender}</span>
                        <span className="text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box or Reopen Option */}
              {selectedTicket.status === "Closed" || selectedTicket.status === "Resolved" ? (
                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    This ticket is currently marked as {selectedTicket.status}.
                  </span>
                  <Button
                    onClick={handleReopenTicket}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs rounded-xl h-8 text-primary border-primary/30"
                  >
                    <RefreshCw className="h-3 w-3" /> Reopen Ticket
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="pt-3 border-t border-border/40 space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground">Reply to Support Agent</label>
                  <textarea
                    rows={3}
                    placeholder="Type your response or follow-up question..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-8 gap-1.5"
                    >
                      <Send className="h-3 w-3" /> Send Reply
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
