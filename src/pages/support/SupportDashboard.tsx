import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UseAnimations from 'react-useanimations';
import inbox from 'react-useanimations/lib/inbox';
import clock from 'react-useanimations/lib/clock';
import arrowUpRight from 'react-useanimations/lib/arrowUpRight';
import HoverStar from "./HoverStar";
import HoverCheck from "./HoverCheck";
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Users,
  Search,
  MessageSquare,
  BookOpen,
  Settings,
  Flame,
  Star,
  Activity,
  Headphones,
  Check,
  ChevronRight,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { SupportTicket } from "@/types/lms";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CardKey = "open" | "pending" | "resolved" | "csat";

export const SupportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [agentPresence, setAgentPresence] = useState<"online" | "away" | "busy">("online");
  const [selectedCard, setSelectedCard] = useState<CardKey | null>(null);
  const [hoveredCard, setHoveredCard] = useState<CardKey | null>(null);

  // Load tickets and include additional active demo tickets so scrolling is available when queue is full
  const baseTickets = mockDataService.getTickets();
  const [tickets] = useState<SupportTicket[]>([
    ...baseTickets,
    {
      id: "tkt-1084",
      ticketNumber: "TKT-1084",
      studentId: "usr-student-8",
      studentName: "Rohan Verma",
      studentEmail: "rohan.v@example.com",
      studentBatch: "Cohort 6 (Full Access)",
      category: "account_access",
      priority: "high",
      status: "open",
      assignedAgent: "Nikhil Joshi",
      subject: "GPU Jupyter Notebook instance out of CUDA memory during PyTorch lab",
      createdAt: "Today, 11:15 AM",
      messages: [],
    },
    {
      id: "tkt-1085",
      ticketNumber: "TKT-1085",
      studentId: "usr-student-12",
      studentName: "Ananya Sharma",
      studentEmail: "ananya.s@example.com",
      studentBatch: "Cohort 7 (Live + Replay)",
      category: "payment_issue",
      priority: "medium",
      status: "open",
      assignedAgent: "Nikhil Joshi",
      subject: "GST invoice download returns 404 for recent installment payment",
      createdAt: "Today, 10:45 AM",
      messages: [],
    },
    {
      id: "tkt-1086",
      ticketNumber: "TKT-1086",
      studentId: "usr-student-15",
      studentName: "Devendra Rao",
      studentEmail: "devendra.r@example.com",
      studentBatch: "Cohort 5 (Agentic Systems)",
      category: "academic_doubt",
      priority: "medium",
      status: "pending",
      assignedAgent: "Pooja Hegde",
      subject: "Capstone project milestone 2 submission lock reset request",
      createdAt: "Today, 08:20 AM",
      messages: [],
    },
    {
      id: "tkt-1087",
      ticketNumber: "TKT-1087",
      studentId: "usr-student-19",
      studentName: "Sneha Patel",
      studentEmail: "sneha.p@example.com",
      studentBatch: "Cohort 8 (Replay Only)",
      category: "account_access",
      priority: "low",
      status: "open",
      assignedAgent: "Rahul Sharma",
      subject: "Live stream audio-video sync latency on mobile safari browser",
      createdAt: "Yesterday, 07:10 PM",
      messages: [],
    },
    {
      id: "tkt-1088",
      ticketNumber: "TKT-1088",
      studentId: "usr-student-21",
      studentName: "Priyanka Nair",
      studentEmail: "priyanka.n@example.com",
      studentBatch: "Cohort 6 (Full Access)",
      category: "academic_doubt",
      priority: "medium",
      status: "resolved",
      assignedAgent: "Nikhil Joshi",
      subject: "Docker container port mapping issue resolved for Flask API exercise",
      createdAt: "Yesterday, 04:30 PM",
      messages: [],
    },
  ]);

  const handleCardClick = (key: CardKey) => {
    setSelectedCard((prev) => (prev === key ? null : key));
  };

  const openCount = tickets.filter((t) => t.status === "open").length;
  const pendingCount = tickets.filter((t) => t.status === "pending").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length || 142;

  const filteredTickets = tickets.filter((tkt) => {
    if (selectedCard === "open") return tkt.status === "open";
    if (selectedCard === "pending") return tkt.status === "pending";
    if (selectedCard === "resolved") return tkt.status === "resolved";
    return true;
  });

  /**
   * Highlight logic:
   * - Default (no hover, no selection) → all cards are white (not highlighted)
   * - Hover over a card → only that card highlights, others stay white
   * - Click a card → that card stays highlighted (locked), click again to reset
   */
  const isHighlighted = (key: CardKey): boolean => {
    if (hoveredCard !== null) return hoveredCard === key;
    if (selectedCard !== null) return selectedCard === key;
    return false;
  };

  const kpiCards: { key: CardKey; index: number; title: string; value: string | number; icon: React.ElementType; trend: { value: string; isPositive: boolean }; hint: string; nav: string }[] = [
    {
      key: "open",
      index: 0,
      title: "Open Tickets",
      value: openCount,
      icon: () => <UseAnimations animation={inbox} size={32} />,
      trend: { value: "1 approaching SLA limit", isPositive: false },
      hint: "open tickets",
      nav: "/support/tickets",
    },
    {
      key: "pending",
      index: 1,
      title: "Pending Approval",
      value: pendingCount,
      icon: () => <UseAnimations animation={clock} size={32} />,
      trend: { value: "Awaiting Academic Admin", isPositive: true },
      hint: "pending approvals",
      nav: "/support/tickets",
    },
    {
      key: "resolved",
      index: 2,
      title: "Resolved Tickets",
      value: resolvedCount,
      icon: () => <HoverCheck />,
      trend: { value: "98.2% within SLA", isPositive: true },
      hint: "resolved tickets",
      nav: "/support/tickets",
    },
    {
      key: "csat",
      index: 3,
      title: "Customer CSAT Score",
      value: "4.92 / 5.0",
      icon: () => <HoverStar />,
      trend: { value: "+0.2 vs last month", isPositive: true },
      hint: "CSAT rating",
      nav: "/support/analytics",
    },
  ];

  return (
    <div className="space-y-4 support-page-font">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Support &amp; Mentor Command Center
            </h1>
            <Badge
              variant="outline"
              className="capitalize gap-1.5 font-bold"
              style={
                agentPresence === "online"
                  ? { backgroundColor: "rgba(34, 197, 94, 0.12)", borderColor: "rgba(34, 197, 94, 0.4)", color: "#16a34a" }
                  : agentPresence === "busy"
                    ? { backgroundColor: "rgba(239, 68, 68, 0.12)", borderColor: "rgba(239, 68, 68, 0.4)", color: "#ef4444" }
                    : { backgroundColor: "rgba(245, 158, 11, 0.12)", borderColor: "rgba(245, 158, 11, 0.4)", color: "#d97706" }
              }
            >
              <span
                className={`h-2 w-2 rounded-full ${agentPresence === "online" ? "animate-pulse" : ""}`}
                style={{
                  backgroundColor:
                    agentPresence === "online" ? "#22c55e" : agentPresence === "busy" ? "#ef4444" : "#f59e0b",
                }}
              />
              Agent Status: {agentPresence}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Resolve student tickets, handle live chat sessions, monitor SLA countdowns, and manage customer records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/40 text-xs">
            {(["online", "away", "busy"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setAgentPresence(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize transition-all ${agentPresence === st
                  ? st === "online"
                    ? "text-white shadow-xs"
                    : st === "busy"
                      ? "bg-red-500 text-white shadow-xs"
                      : "bg-amber-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                style={
                  agentPresence === st && st === "online"
                    ? { backgroundColor: "#16a34a", color: "#ffffff" }
                    : undefined
                }
              >
                {st}
              </button>
            ))}
          </div>

          <Link to="/support/live-chat">
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground shadow-sm text-xs font-semibold group">
              <MessageSquare className="h-4 w-4" />
              <span>Live Chat Desk (3)</span>
              <UseAnimations animation={arrowUpRight} size={18} strokeColor="currentColor" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.key}
            onClick={() => handleCardClick(card.key)}
            onMouseEnter={() => setHoveredCard(card.key)}
            onMouseLeave={() => setHoveredCard(null)}
            onFocus={() => setHoveredCard(card.key)}
            onBlur={() => setHoveredCard(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(card.key);
              }
            }}
            role="button"
            tabIndex={0}
            title={selectedCard === card.key ? "Click to show all" : `Click to focus ${card.hint}`}
            className={`cursor-pointer select-none h-full rounded-2xl transition-all duration-200
              active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
              ${hoveredCard === card.key ? "-translate-y-1 shadow-xl" : ""}
              ${hoveredCard !== null && hoveredCard !== card.key ? "opacity-60 scale-[0.98]" : ""}
            `}
          >
            <StatCard
              index={card.index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              onAction={() => navigate(card.nav)}
              hideChart
              highlight={isHighlighted(card.key)}
            />
          </div>
        ))}
      </div>

      {/* Main Grid: Priority Inbox & Fast Operational Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Tickets Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="shadow-xs border-border/80 flex flex-col h-[460px]">
            <CardHeader className="p-4 sm:px-5 sm:py-3.5 border-b border-border/70 flex flex-row items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    Active Support Queue
                  </CardTitle>
                  {selectedCard && (
                    <Badge variant="secondary" className="text-[11px] gap-1 font-medium bg-muted text-foreground">
                      Filtered:{" "}
                      {selectedCard === "open"
                        ? "Open Tickets"
                        : selectedCard === "pending"
                          ? "Pending Approval"
                          : selectedCard === "resolved"
                            ? "Resolved"
                            : "CSAT"}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedCard(null); }}
                        className="ml-1 hover:text-destructive cursor-pointer font-bold"
                        title="Show all"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {selectedCard
                    ? `Showing ${filteredTickets.length} ticket(s) matching ${selectedCard}. Click the highlighted card again to show all.`
                    : "Urgent tickets and batch change proposals requiring mentor response."}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/support/tickets">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 h-8">
                    View All ({tickets.length}) <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent
              className="p-0 divide-y divide-border/60 flex-1 min-h-0 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30"
            >
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2 h-full">
                  <p>No tickets found in this filtered category.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold h-7"
                    onClick={() => setSelectedCard(null)}
                  >
                    Reset Filter &amp; Show All
                  </Button>
                </div>
              ) : (
                filteredTickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="p-3.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {tkt.ticketNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-semibold text-foreground">
                          {tkt.studentName}
                        </span>
                        {tkt.priority === "high" && (
                          <Badge variant="destructive" className="text-[10px]">
                            High Priority
                          </Badge>
                        )}
                        {tkt.status === "open" && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                            Open
                          </Badge>
                        )}
                        {tkt.status === "pending" && (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                            Pending Admin
                          </Badge>
                        )}
                        {tkt.status === "resolved" && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-foreground">
                        {tkt.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Batch: {tkt.studentBatch} • Assigned to: {tkt.assignedAgent}
                      </p>
                    </div>

                    <Link to={`/support/ticket/${tkt.id}`}>
                      <Button size="sm" variant="outline" className="text-xs gap-1.5 shrink-0 font-semibold h-8 px-3">
                        Open Ticket <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
            <div className="p-2.5 sm:px-5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground shrink-0">
              <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
              {selectedCard && (
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-primary hover:underline font-medium text-xs cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Portal Navigation & Live Quick Access (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Mentor Inbox Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent border border-violet-500/20 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <LifeBuoy className="h-3.5 w-3.5" /> Mentor Inbox
              </span>
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-foreground leading-snug">
              2 Open Inquiries
            </p>
            <p className="text-xs text-muted-foreground">
              Avg SLA: 14 mins response
            </p>
            <Link to="/support/tickets" className="block pt-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full h-8 text-xs rounded-xl gap-1.5 font-semibold border-violet-500/30 text-violet-700 dark:text-violet-300 hover:bg-violet-500/10 hover:text-violet-800 dark:hover:text-violet-200 transition-all"
              >
                <span>Open Tickets</span> <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
