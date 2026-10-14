import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  LifeBuoy,
  Send,
  User,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MoveRight,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Student360Drawer } from "@/components/shared/Student360Drawer";

export const TicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId?: string }>();
  const tickets = mockDataService.getTickets();
  const ticket = tickets.find((t) => t.id === ticketId) || tickets[0];

  const [messages, setMessages] = useState(ticket.messages);
  const [replyText, setReplyText] = useState("");
  const [isStudent360Open, setIsStudent360Open] = useState(false);
  const [isBatchMoveModalOpen, setIsBatchMoveModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [proposedStatus, setProposedStatus] = useState<string | null>(
    ticket.proposedAction ? ticket.proposedAction.type : null
  );

  const cannedResponses = [
    {
      title: "Batch Move Approval Pending",
      content:
        "Hi there, I have forwarded your request for cohort migration to our Operations Admin team. Since you have met the minimum milestone completion requirement, your progress will be preserved upon confirmation.",
    },
    {
      title: "Medical Extension Guidance",
      content:
        "We are sorry to hear about your illness. As per organization policy, we have proposed a 30-day access validity extension for Admin approval. Please take care of your health.",
    },
    {
      title: "Recording Replay Access Delay",
      content:
        "Please note that for self-paced batches, replays are released 24 hours after the live session completes to allow transcript alignment and AI chapter indexing.",
    },
  ];

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "Nikhil Joshi (Mentor)",
      role: "agent" as const,
      message: replyText,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyText("");
  };

  const handleProposeBatchMove = () => {
    setProposedStatus("batch_move");
    setIsBatchMoveModalOpen(false);
    mockDataService.updateTicketStatus(ticket.id, "pending");
  };

  const handleProposeExtension = () => {
    setProposedStatus("validity_extension");
    setIsExtensionModalOpen(false);
    mockDataService.updateTicketStatus(ticket.id, "pending");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/support/inbox">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ticket Inbox
            </Button>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
            {ticket.ticketNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {proposedStatus && (
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1">
              <Clock className="h-3 w-3" />
              Admin Proposal Active: {proposedStatus === "batch_move" ? "Cohort Transfer" : "Validity Extension"}
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStudent360Open(true)}
            className="gap-1.5 text-xs"
          >
            <Users className="h-3.5 w-3.5 text-primary" />
            Inspect Student 360°
          </Button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conversation thread & Reply composer (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="p-5 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {ticket.subject}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Student: {ticket.studentName} ({ticket.studentEmail}) • {ticket.studentBatch}
                  </CardDescription>
                </div>
                <Badge variant={ticket.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                  {ticket.priority.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Message History */}
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      msg.role === "agent"
                        ? "bg-primary/5 border-primary/20 ml-6"
                        : "bg-muted/40 border-border mr-6"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        {msg.role === "agent" ? (
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        {msg.sender}
                      </span>
                      <span className="text-muted-foreground text-[11px] font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    Draft Reply or Select Canned Template
                  </span>

                  <select
                    onChange={(e) => {
                      if (e.target.value) setReplyText(e.target.value);
                    }}
                    className="text-xs rounded-lg border border-border bg-background p-1.5 max-w-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Insert Canned Response...
                    </option>
                    {cannedResponses.map((cr, idx) => (
                      <option key={idx} value={cr.content}>
                        {cr.title}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to the student..."
                  className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="gap-2 text-xs bg-primary text-primary-foreground"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Workflow Actions & Approval Triggers (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-xs font-bold text-foreground">
                Mentor Governance Actions
              </CardTitle>
              <CardDescription className="text-[11px]">
                Support proposals trigger Admin approval before altering records.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBatchMoveModalOpen(true)}
                className="w-full justify-start text-xs gap-2"
              >
                <MoveRight className="h-3.5 w-3.5 text-primary" />
                Propose Cohort Batch Shift
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExtensionModalOpen(true)}
                className="w-full justify-start text-xs gap-2"
              >
                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                Propose Validity Extension
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Escalated to Lead Instructor Prof. Rajesh Verma")}
                className="w-full justify-start text-xs gap-2 text-amber-600 dark:text-amber-400"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Escalate Doubt to Instructor
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 p-4 space-y-2 text-xs">
            <h4 className="font-semibold text-primary flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Two-Person Integrity
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              In accordance with platform governance, mentors propose student entitlement changes. Only certified Admins possess execution keys.
            </p>
          </Card>
        </div>
      </div>

      {/* Propose Batch Move Modal */}
      <Dialog open={isBatchMoveModalOpen} onOpenChange={setIsBatchMoveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MoveRight className="h-5 w-5 text-primary" />
              Propose Cohort Batch Transfer
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs sm:text-sm">
            <p className="text-muted-foreground">
              Select the destination cohort for <strong>{ticket.studentName}</strong>. Historical test submissions and attendance will transfer seamlessly.
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Current Enrolled Batch</label>
              <div className="p-2.5 rounded-lg bg-muted border border-border font-medium text-xs">
                {ticket.studentBatch}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Target Destination Cohort</label>
              <select className="w-full text-xs rounded-lg border border-border bg-background p-2.5">
                <option>Agentic Systems Bootcamp (Weekend Cohort)</option>
                <option>Full-Stack AI & LLM Systems - Cohort 8 (Self-Paced Replay)</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsBatchMoveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProposeBatchMove} className="bg-primary text-primary-foreground">
              Submit Proposal for Admin Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Propose Extension Modal */}
      <Dialog open={isExtensionModalOpen} onOpenChange={setIsExtensionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              Propose Access Validity Extension
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs sm:text-sm">
            <p className="text-muted-foreground">
              Specify the number of extension days to grant <strong>{ticket.studentName}</strong> for course milestone completion.
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Extension Duration</label>
              <select className="w-full text-xs rounded-lg border border-border bg-background p-2.5">
                <option value="15">15 Days Extension</option>
                <option value="30">30 Days Extension (Standard Medical/Work)</option>
                <option value="60">60 Days Extension</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsExtensionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProposeExtension} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Submit Extension Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student 360 Drawer */}
      <Student360Drawer
        open={isStudent360Open}
        onOpenChange={setIsStudent360Open}
        studentId={ticket.studentId}
      />
    </div>
  );
};
