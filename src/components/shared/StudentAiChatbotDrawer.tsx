import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, BookOpen, Clock, HelpCircle, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  quickAction?: { label: string; href: string };
}

const STARTER_PROMPTS = [
  "When is the Milestone 2 deadline?",
  "How does HNSW efSearch balance latency and recall?",
  "Book a 1:1 slot with Prof. Verma",
  "Summarize Lecture 8: Vector Databases",
];

export const StudentAiChatbotDrawer: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello Arjun! 👋 I am your Apex AI Study Copilot. You can ask me questions about your curriculum, assignment rubrics, live timetable, or lecture transcripts.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Here is what I found in your Cohort 7 course repository:";
      let action: { label: string; href: string } | undefined;

      const lower = query.toLowerCase();
      if (lower.includes("deadline") || lower.includes("milestone") || lower.includes("test")) {
        reply = "Milestone 2 (Hybrid RAG with Contextual Compression) is scheduled for today. You scored 95/100 on the first evaluation and 1 re-assessment is currently under faculty review.";
        action = { label: "Open Assessments Hub", href: "/student/assessments" };
      } else if (lower.includes("hnsw") || lower.includes("efsearch") || lower.includes("vector")) {
        reply = "In HNSW graphs, the `efSearch` parameter defines the size of the dynamic candidate list during query time. Higher `efSearch` explores more neighboring nodes, increasing recall (e.g. from 91% to 98%), at the cost of higher query latency.";
        action = { label: "Resume Lecture 8 at 00:24:18", href: "/student/replays/rep-rag-8" };
      } else if (lower.includes("mentor") || lower.includes("verma") || lower.includes("book")) {
        reply = "Prof. Rajesh Verma has open 1:1 mentoring slots on Friday at 05:00 PM and Saturday at 11:00 AM for code review and architecture guidance.";
        action = { label: "Book 1:1 Mentoring", href: "/student/mentors" };
      } else if (lower.includes("summary") || lower.includes("lecture 8")) {
        reply = "Lecture 8 covered: (1) Vector space chunking strategies, (2) Hierarchical Navigable Small World graphs, (3) Hybrid RAG pairing dense embeddings with cross-encoder reranking.";
        action = { label: "View Smart Replay", href: "/student/replays/rep-rag-8" };
      } else {
        reply = `I have verified this against your enrolled curriculum in Full-Stack AI & LLM Systems Engineering. All concepts align with Cohort 7 guidelines.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: reply,
          time: "Just now",
          quickAction: action,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-component="ai-chatbot"
        className="w-full sm:w-[420px] p-0 flex flex-col bg-card border-l border-border/80 shadow-2xl chatbot-drawer-container"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border/70 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#e11d48] text-white flex items-center justify-center shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-sm font-bold flex items-center gap-1.5">
                Apex AI Copilot <Badge variant="outline" className="text-[9px] bg-rose-500/10 text-[#e11d48] border-rose-500/20">Cohort 7</Badge>
              </SheetTitle>
              <SheetDescription className="text-[11px] text-muted-foreground">
                Grounded in lectures, assignments & syllabus
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 sleek-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#e11d48] text-white rounded-tr-xs"
                    : "bg-muted/40 border border-border/70 text-foreground rounded-tl-xs shadow-2xs"
                }`}
              >
                {m.text}

                {m.quickAction && (
                  <div className="mt-2.5 pt-2 border-t border-border/60">
                    <Button
                      size="sm"
                      onClick={() => {
                        onOpenChange(false);
                        navigate(m.quickAction!.href);
                      }}
                      className="w-full h-7 text-[11px] bg-primary text-primary-foreground font-semibold gap-1 cursor-pointer"
                    >
                      {m.quickAction.label} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-2 bg-muted/20 rounded-xl w-24">
              <Sparkles className="h-3 w-3 text-primary animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </div>

        {/* Starter Prompts */}
        <div className="p-3 border-t border-border/60 bg-muted/10 space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-muted-foreground px-1">Suggested Inquiries:</p>
          <div className="flex flex-wrap gap-1">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[10px] bg-card hover:bg-muted border border-border/80 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 transition-colors text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-border/80 bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Cohort 7..."
              className="text-xs h-9 bg-muted/20"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim()}
              className="h-9 w-9 p-0 bg-[#e11d48] hover:bg-[#be123c] text-white shrink-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
