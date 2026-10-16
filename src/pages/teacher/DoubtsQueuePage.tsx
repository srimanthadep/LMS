import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Search,
  Send,
  Clock,
  Bot,
  CheckCircle2,
  User,
  ArrowUpRight,
  Paperclip,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  Filter,
  Check,
} from "lucide-react";
import { StudentDoubt } from "@/types/lms";
import { useNotifications } from "@/context/NotificationContext";
import { teacherDataService } from "./teacherDataService";

export const DoubtsQueuePage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [doubts, setDoubts] = useState<StudentDoubt[]>(() => teacherDataService.getDoubts());
  const [selectedDoubtId, setSelectedDoubtId] = useState<string>(() => doubts[0]?.id || "");
  const [replyText, setReplyText] = useState("");
  const [attachedResource, setAttachedResource] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");

  const reloadDoubts = () => {
    setDoubts(teacherDataService.getDoubts());
  };

  const filteredDoubts = doubts.filter((d) => {
    if (!d) return false;
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "open"
        ? d.status === "open" || d.status === "ai_answered"
        : filter === "resolved"
        ? d.status === "teacher_replied" || d.status === "resolved"
        : d.status === filter;

    const matchesBatch = batchFilter === "all" || d.batchName === batchFilter;
    const matchesSearch =
      (d.question || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.classTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesBatch && matchesSearch;
  });

  const availableResources = teacherDataService.getResources();

  // Ensure safely selected doubt even if queue changes or filter reduces items
  const selectedDoubt =
    filteredDoubts.find((d) => d.id === selectedDoubtId) || filteredDoubts[0] || null;

  useEffect(() => {
    if (selectedDoubt) {
      setReplyText(selectedDoubt.teacherReply || "");
    } else {
      setReplyText("");
    }
  }, [selectedDoubt?.id, selectedDoubt?.teacherReply]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDoubt) return;

    const updatedText = attachedResource
      ? `${replyText}\n\n[Attached Reference: ${attachedResource}]`
      : replyText;

    const updatedDoubt: StudentDoubt = {
      ...selectedDoubt,
      teacherReply: updatedText,
      status: "teacher_replied",
    };

    // Immutable update
    teacherDataService.saveDoubt(updatedDoubt);
    reloadDoubts();
    setReplyText(updatedText);
    setAttachedResource("");

    addNotification({
      title: "Doubt Cleared (Simulated)",
      message: `Your explanation was saved and simulated as dispatched to ${selectedDoubt.studentName}.`,
      type: "doubt",
    });
  };

  const handleResolveDoubt = () => {
    if (!selectedDoubt) return;
    const updatedDoubt: StudentDoubt = {
      ...selectedDoubt,
      status: "resolved",
    };
    teacherDataService.saveDoubt(updatedDoubt);
    reloadDoubts();

    addNotification({
      title: "Doubt Marked Resolved",
      message: `Query marked as resolved in local cohort ledger.`,
      type: "system",
    });
  };

  const handleReopenDoubt = () => {
    if (!selectedDoubt) return;
    const updatedDoubt: StudentDoubt = {
      ...selectedDoubt,
      status: "open",
    };
    teacherDataService.saveDoubt(updatedDoubt);
    reloadDoubts();

    addNotification({
      title: "Doubt Reopened",
      message: `Query moved back to pending clearance queue.`,
      type: "system",
    });
  };

  const handleEscalateDoubt = () => {
    if (!selectedDoubt) return;
    const updatedDoubt: StudentDoubt = {
      ...selectedDoubt,
      status: "escalated",
    };
    teacherDataService.saveDoubt(updatedDoubt);
    reloadDoubts();

    addNotification({
      title: "Doubt Escalated (Simulated)",
      message: `Query escalated to Senior Faculty panel (simulated workflow).`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" /> Faculty Doubts & Escalations Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Resolve student doubts anchored to lecture timestamps with AI pre-draft verification and resource attachment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-xs px-3 py-1">
            {doubts.filter((d) => d.status === "open" || d.status === "ai_answered").length} Unanswered Queries
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/70">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doubt keywords, student name, or lecture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {[
              { id: "all", label: "All Doubts" },
              { id: "open", label: "Pending" },
              { id: "resolved", label: "Resolved" },
              { id: "escalated", label: "Escalated" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  filter === tab.id
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/30 text-muted-foreground border-border/70 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="h-8 text-xs rounded-md border border-input bg-background px-2"
          >
            <option value="all">All Batches</option>
            <option value="Cohort 7 (Live + Replay)">Cohort 7</option>
            <option value="Cohort 4 (Live Sync)">Cohort 4</option>
          </select>
        </div>
      </div>

      {/* Split Workstation: Doubt Feed & Answering Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed (1 col) */}
        <div className="space-y-3 max-h-[680px] overflow-y-auto sleek-scrollbar">
          {filteredDoubts.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
              No doubts found in this filter view.
            </div>
          ) : (
            filteredDoubts.map((d) => {
              const isSelected = selectedDoubt?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDoubtId(d.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 select-none shadow-xs ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border/80 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{d.studentName}</span>
                    <span className="font-mono text-[10px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                      ▶ {d.timestampFormatted || "00:14:20"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    "{d.question}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    <span className="truncate max-w-[150px]">{d.classTitle}</span>
                    <Badge
                      variant={
                        d.status === "teacher_replied" || d.status === "resolved"
                          ? "success"
                          : d.status === "escalated"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-[9px]"
                    >
                      {d.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Answering Detail Pane (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDoubt ? (
            <Card className="border-border/80 shadow-xs rounded-2xl bg-card overflow-hidden">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm sm:text-base font-bold">
                        Query by {selectedDoubt.studentName}
                      </CardTitle>
                      <Badge variant="accent" className="text-[10px] font-bold">
                        {selectedDoubt.batchName}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {selectedDoubt.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Lecture: <strong>{selectedDoubt.classTitle}</strong> • Anchored at:{" "}
                      <strong className="text-primary font-mono">{selectedDoubt.timestampFormatted || "00:14:20"}</strong>
                    </p>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center gap-1.5">
                    {selectedDoubt.status !== "resolved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResolveDoubt}
                        className="h-7 text-xs text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                      >
                        <Check className="h-3 w-3 mr-1" /> Mark Resolved
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleReopenDoubt}
                        className="h-7 text-xs text-amber-700 hover:bg-amber-50 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" /> Reopen
                      </Button>
                    )}

                    {selectedDoubt.status !== "escalated" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEscalateDoubt}
                        className="h-7 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" /> Escalate
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-5">
                {/* Student Question */}
                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Student Inquiry
                  </span>
                  <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed">
                    "{selectedDoubt.question}"
                  </p>
                </div>

                {/* AI Pre-Draft Answer if available */}
                {selectedDoubt.aiAnswer && (
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                      <Bot className="h-4 w-4" /> Grounded AI Pre-Answer (Verifiable Citation)
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selectedDoubt.aiAnswer}
                    </p>
                    <span className="text-[10px] text-muted-foreground italic">
                      * Synthesized from lecture transcript for faculty review.
                    </span>
                  </div>
                )}

                {/* Faculty Response form */}
                <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-border/70">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">
                      Faculty Response & Video Annotation:
                    </label>
                    <div className="flex items-center gap-1">
                      <select
                        value={attachedResource}
                        onChange={(e) => setAttachedResource(e.target.value)}
                        className="h-7 text-[11px] rounded border border-input bg-background px-2 max-w-[220px]"
                      >
                        <option value="">Attach Learning Resource...</option>
                        {availableResources.map((res) => (
                          <option key={res.id} value={`${res.title} (${res.type})`}>
                            {res.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write authoritative clarification, attach code snippets, or reference related lectures..."
                    className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none leading-relaxed"
                  />

                  {attachedResource && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <Paperclip className="h-3.5 w-3.5" />
                      <span>Attached: {attachedResource}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button type="submit" className="text-xs h-9 font-bold gap-1 shadow-sm">
                      <Send className="h-3 w-3" />
                      {selectedDoubt.teacherReply ? "Update Faculty Answer" : "Dispatch Clarification to Student"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground border border-dashed rounded-2xl">
              Select a doubt from the queue to review and answer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtsQueuePage;
