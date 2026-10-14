import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Search, Send, Clock, Bot, CheckCircle2, User, ArrowUpRight } from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { StudentDoubt } from "@/types/lms";
import { useNotifications } from "@/context/NotificationContext";

export const DoubtsQueuePage: React.FC = () => {
  const [doubts, setDoubts] = useState<StudentDoubt[]>(mockDataService.getDoubts());
  const [selectedDoubt, setSelectedDoubt] = useState<StudentDoubt>(doubts[0]);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const { addNotification } = useNotifications();

  const filteredDoubts = doubts.filter((d) => {
    if (filter === "open") return d.status === "open" || d.status === "ai_answered";
    if (filter === "resolved") return d.status === "teacher_replied" || d.status === "resolved";
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDoubt) return;

    selectedDoubt.teacherReply = replyText;
    selectedDoubt.status = "teacher_replied";

    setDoubts([...doubts]);
    setReplyText("");

    addNotification({
      title: "Doubt Cleared",
      message: `Your answer was dispatched to ${selectedDoubt.studentName}.`,
      type: "doubt",
    });
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" /> Faculty Doubts & Escalations Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Resolve student doubts anchored to exact lecture timestamps with AI pre-draft assistance.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2">
          {["all", "open", "resolved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All Doubts" : tab === "open" ? "Pending Clearance" : "Resolved"}
            </button>
          ))}
        </div>

        {/* Split Workstation: Doubt Feed & Answering Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed (1 col) */}
          <div className="space-y-3 max-h-[650px] overflow-y-auto sleek-scrollbar">
            {filteredDoubts.map((d) => {
              const isSelected = selectedDoubt?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDoubt(d)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 select-none shadow-xs ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border/80 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{d.studentName}</span>
                    <span className="font-mono text-[10px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                      ▶ {d.timestampFormatted}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    "{d.question}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    <span className="truncate max-w-[150px]">{d.classTitle}</span>
                    <Badge
                      variant={d.status === "teacher_replied" ? "success" : "warning"}
                      className="text-[9px]"
                    >
                      {d.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Answering Detail Pane (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {selectedDoubt ? (
              <Card className="border-border/80 shadow-xs rounded-2xl bg-card overflow-hidden">
                <CardHeader className="p-4 sm:p-5 border-b border-border/70 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm sm:text-base font-bold">
                          Query by {selectedDoubt.studentName}
                        </CardTitle>
                        <Badge variant="accent" className="text-[10px] font-bold">
                          {selectedDoubt.batchName}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Lecture: <strong>{selectedDoubt.classTitle}</strong> • Anchored at:{" "}
                        <strong className="text-primary font-mono">{selectedDoubt.timestampFormatted}</strong>
                      </p>
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
                    <label className="text-xs font-bold text-foreground">
                      Faculty Response / Video Annotation:
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={replyText || selectedDoubt.teacherReply || ""}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write authoritative clarification, attach code snippets, or reference related lectures..."
                      className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="submit" className="text-xs h-9 font-bold gap-1 shadow-sm">
                        <Send className="h-3 w-3" />
                        {selectedDoubt.teacherReply ? "Update Response" : "Dispatch Faculty Clarification"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="p-12 text-center text-xs text-muted-foreground">
                Select a doubt from the queue to review and answer.
              </div>
            )}
          </div>
        </div>
      </div>
  );
};
