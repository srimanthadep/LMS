import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  LifeBuoy,
  FileCheck2,
  Info,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  link?: { text: string; url: string };
  category?: string;
}

export const StudentChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Hello Arjun! I'm your Apex AI Study Copilot. I can explain course concepts (KV-cache, PagedAttention), find study notes, remind you about deadlines, explain your test results, and help you navigate the portal. What would you like to explore today?",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const SUGGESTED_QUERIES = [
    {
      label: "Explain KV-Cache Concept",
      prompt: "Explain how PagedAttention solves KV-cache memory fragmentation.",
      category: "Course Concepts",
    },
    {
      label: "Upcoming Deadlines",
      prompt: "When is my next live class and assignment deadline?",
      category: "Deadlines",
    },
    {
      label: "Explain Test Results",
      prompt: "What revision topics are recommended based on my recent test score?",
      category: "Test Results",
    },
    {
      label: "Find Study Notes & DPPs",
      prompt: "Where can I find lecture replays and download DPP laboratory materials?",
      category: "Study Materials",
    },
    {
      label: "Certificates & Credentials",
      prompt: "How do I download my course completion certificate and share it on LinkedIn?",
      category: "Certificates",
    },
    {
      label: "Payments & Invoices",
      prompt: "Where can I view my tuition receipt and GST invoice for Cohort 7?",
      category: "Payments",
    },
    {
      label: "Portal Navigation Help",
      prompt: "How do I request a 1:1 session with my assigned mentor Prof. Rajesh Verma?",
      category: "Navigation",
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";
      let linkObj: { text: string; url: string } | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes("pagedattention") || lower.includes("kv-cache") || lower.includes("concept")) {
        replyText =
          "PagedAttention solves external memory fragmentation by partitioning a transformer's Key-Value cache into fixed-size physical blocks (typically 16 or 32 tokens). Instead of pre-allocating large contiguous memory buffers that result in 60-80% memory waste, GPU kernels look up blocks dynamically via a block table, boosting serving throughput by 2.5x to 4x.";
        linkObj = { text: "Watch KV-Cache SmartPlayer Lecture", url: "/student/replays/rep-rag-8" };
      } else if (lower.includes("deadline") || lower.includes("class") || lower.includes("upcoming")) {
        replyText =
          "Your next synchronous live broadcast is 'Session 4: Multi-Agent Consensus' scheduled for Today at 06:30 PM IST with Prof. Rajesh Verma. Your Milestone 2 DPP assignment on Hybrid RAG is due Tomorrow at 11:59 PM IST.";
        linkObj = { text: "Open Academic Calendar & Schedule", url: "/student/calendar" };
      } else if (lower.includes("test") || lower.includes("score") || lower.includes("result") || lower.includes("revision")) {
        replyText =
          "You scored 95/100 on Module 1 DPP and 88/100 on the Midterm Defense (Cumulative GPA: 3.92/4.0). Recommended revision focus: Review late-interaction ColBERT indices and ensure tighter speech transitions for your next viva!";
        linkObj = { text: "View Results Breakdown", url: "/student/results" };
      } else if (lower.includes("certificate") || lower.includes("linkedin")) {
        replyText =
          "Your verified credential 'Certified Autonomous Agent Architect - Honors' (APX-CERT-2026-091) is active. You can download the high-resolution PDF or use the 1-click Add to LinkedIn button.";
        linkObj = { text: "Open Certificates & Achievements", url: "/student/certificates" };
      } else if (lower.includes("payment") || lower.includes("invoice") || lower.includes("receipt")) {
        replyText =
          "Your Cohort 7 tuition payment of ₹49,999 is fully cleared with Razorpay transaction ID #INV-2026-8821. Tax invoice compliant with GST regulations is ready for download.";
        linkObj = { text: "View Receipts & Invoices", url: "/student/payments" };
      } else if (lower.includes("mentor") || lower.includes("rajesh")) {
        replyText =
          "Your assigned faculty mentor is Prof. Rajesh Verma (Lead Faculty & AI Systems Chair). He is available for 1:1 consultations on Tuesdays, Thursdays, and Saturdays. You can book a slot directly from Mentor Details.";
        linkObj = { text: "Book 1:1 Mentoring Slot", url: "/student/mentors" };
      } else {
        replyText =
          "I have grounded this answer against your active LMS student record. For technical questions, you can also tag instructors on the discussion forum or raise an operations ticket if you encounter platform bugs.";
        linkObj = { text: "Open Support & Help Desk", url: "/student/support" };
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: replyText,
        timestamp: "Just now",
        link: linkObj,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-primary" /> Student AI Study Copilot
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Grounded assistant for answering course concepts, deadline alerts, test diagnostics, portal navigation, and revision help.
          </p>
        </div>

        <Badge variant="outline" className="text-xs border-primary/20 text-primary self-start sm:self-auto gap-1">
          <Bot className="h-3.5 w-3.5" /> LMS Grounded Assistant
        </Badge>
      </div>

      {/* Backend Integration Note Banner */}
      <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">AI Grounding Architecture:</strong> This assistant answers student queries using active course syllabus context, personal schedules, test grades, and portal routes. Live generative streaming connects to your configured LLM API endpoint.
        </p>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5 text-primary" /> Suggested Student Queries
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q.prompt)}
              className="text-xs px-3 py-1.5 rounded-xl border border-border/70 bg-card hover:bg-muted/40 hover:border-primary/40 transition-colors text-left flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sleek-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted border border-border/60 text-primary"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs space-y-2 max-w-[85%] sm:max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                    : "bg-muted/40 border border-border/60 text-foreground rounded-tl-none"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {msg.link && (
                  <div className="pt-2 border-t border-border/30">
                    <Link
                      to={msg.link.url}
                      className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
                    >
                      <span>{msg.link.text}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-muted border border-border/60 text-primary flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-75" />
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150" />
                <span className="ml-1">Copilot is synthesizing grounded answer...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-border/60 bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Ask anything about course concepts, deadlines, results, notes..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-10 rounded-xl text-xs flex-1"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputText.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 px-4 rounded-xl gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" /> Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
