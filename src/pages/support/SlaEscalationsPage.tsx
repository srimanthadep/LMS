import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UseAnimations from 'react-useanimations';
import shield from 'react-useanimations/lib/shield';
import HoverCheck from "./HoverCheck";
import HoverStar from "./HoverStar";
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown,
  CheckCircle2,
  Users,
  LifeBuoy,
  Flame,
  ArrowRight,
  RefreshCw,
  BellRing,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";

interface EscalatedTicket {
  id: string;
  ticketNumber: string;
  studentName: string;
  category: string;
  subject: string;
  priority: "urgent" | "high" | "medium";
  assignedAgent: string;
  slaTargetMinutes: number;
  minutesRemaining: number;
  escalationTier: "Tier 1: Desk" | "Tier 2: Senior Mentor" | "Tier 3: Academic Admin" | "Tier 4: Super Admin";
  status: "approaching_breach" | "breached" | "pending_admin";
}

const INITIAL_ESCALATIONS: EscalatedTicket[] = [
  {
    id: "tkt-1083",
    ticketNumber: "TKT-1083",
    studentName: "Simran Kaur",
    category: "Validity Extension",
    subject: "Medical pause: Requesting 30-day access validity extension",
    priority: "high",
    assignedAgent: "Nikhil Joshi",
    slaTargetMinutes: 120,
    minutesRemaining: 18,
    escalationTier: "Tier 3: Academic Admin",
    status: "approaching_breach",
  },
  {
    id: "tkt-1082",
    ticketNumber: "TKT-1082",
    studentName: "Arjun Mehta",
    category: "Batch Change",
    subject: "Requesting move from Weekday Evening to Weekend Intensive cohort",
    priority: "medium",
    assignedAgent: "Nikhil Joshi",
    slaTargetMinutes: 360,
    minutesRemaining: 145,
    escalationTier: "Tier 2: Senior Mentor",
    status: "pending_admin",
  },
  {
    id: "tkt-1089",
    ticketNumber: "TKT-1089",
    studentName: "Devendra Patel",
    category: "Payment Double Charge",
    subject: "Duplicate UPI debit during Cohort 8 enrollment checkout",
    priority: "urgent",
    assignedAgent: "Meera Sen",
    slaTargetMinutes: 30,
    minutesRemaining: 6,
    escalationTier: "Tier 3: Academic Admin",
    status: "approaching_breach",
  },
  {
    id: "tkt-1077",
    ticketNumber: "TKT-1077",
    studentName: "Ananya Deshmukh",
    category: "DRM Stream Blackscreen",
    subject: "Lecture 9 live stream video blackscreen error on Linux Brave browser",
    priority: "high",
    assignedAgent: "Aakash Varma",
    slaTargetMinutes: 120,
    minutesRemaining: -12,
    escalationTier: "Tier 4: Super Admin",
    status: "breached",
  },
];

export const SlaEscalationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [escalations, setEscalations] = useState<EscalatedTicket[]>(INITIAL_ESCALATIONS);
  const [filterTier, setFilterTier] = useState("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (key: string) => {
    setSelectedCard((prev) => (prev === key ? null : key));
  };

  const isHighlighted = (key: string): boolean => {
    if (hoveredCard !== null) return hoveredCard === key;
    if (selectedCard !== null) return selectedCard === key;
    return false;
  };

  const handleEscalateHigher = (id: string) => {
    setEscalations((prev) =>
      prev.map((tkt) => {
        if (tkt.id === id) {
          return {
            ...tkt,
            escalationTier: "Tier 4: Super Admin",
            minutesRemaining: Math.max(tkt.minutesRemaining, 30),
          };
        }
        return tkt;
      })
    );
    alert(`Ticket ${id} escalated to Super Admin queue with executive priority tag.`);
  };

  const filtered = escalations.filter((t) => {
    if (filterTier !== "all" && !t.escalationTier.includes(filterTier)) return false;
    return true;
  });

  const breachedCount = escalations.filter((e) => e.status === "breached").length;
  const atRiskCount = escalations.filter((e) => e.status === "approaching_breach").length;

  return (
    <div className="space-y-6 support-page-font">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              SLA Monitoring & Escalation Command Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time countdown monitors, SLA breach prevention alarms, and multi-tier escalation hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {breachedCount > 0 ? (
            <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 animate-bounce" />
              {breachedCount} SLA Breach Active
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% SLA Maintained Today
            </Badge>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { key: "adherence", index: 0, title: "Overall SLA Adherence", value: "96.8%", icon: () => <HoverCheck />, trend: { value: "+1.4% vs monthly target", isPositive: true }, hint: "SLA adherence", nav: "/support/analytics" },
          { key: "atrisk", index: 1, title: "Tickets At Risk (< 20m)", value: atRiskCount, icon: () => <UseAnimations animation={shield} size={32} />, trend: { value: "Requires immediate agent dispatch", isPositive: false }, hint: "at-risk tickets", nav: "/support/tickets" },
          { key: "escalated", index: 2, title: "Escalated to Admin", value: "2", icon: () => <HoverStar />, trend: { value: "Dual-authorization pending", isPositive: true }, hint: "escalated tickets", nav: "/support/tickets" },
          { key: "recovery", index: 3, title: "Avg Breach Recovery", value: "14 mins", icon: () => <HoverCheck />, trend: { value: "Rapid triage protocol active", isPositive: true }, hint: "recovery time", nav: "/support/sla-escalations" },
        ]).map((card) => (
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
            title={selectedCard === card.key ? "Click to reset" : `Click to focus ${card.hint}`}
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

      {/* SLA Tiers Adherence Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-red-600 dark:text-red-400">P1 Urgent (30 Mins)</span>
            <Badge variant="destructive" className="text-[10px]">100%</Badge>
          </div>
          <p className="text-xl font-extrabold text-foreground">12m avg</p>
          <div className="h-1.5 w-full rounded-full bg-red-500/20 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: "100%" }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Double charges & live stream cutoffs</p>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400">P2 High (2 Hours)</span>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">94.2%</Badge>
          </div>
          <p className="text-xl font-extrabold text-foreground">58m avg</p>
          <div className="h-1.5 w-full rounded-full bg-amber-500/20 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: "94.2%" }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Validity extensions & 2FA lockouts</p>
        </div>

        <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-blue-600 dark:text-blue-400">P3 Medium (6 Hours)</span>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">98.5%</Badge>
          </div>
          <p className="text-xl font-extrabold text-foreground">2.4h avg</p>
          <div className="h-1.5 w-full rounded-full bg-blue-500/20 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "98.5%" }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Batch transfers & schedule clashes</p>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">P4 Low (24 Hours)</span>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">99.8%</Badge>
          </div>
          <p className="text-xl font-extrabold text-foreground">8.2h avg</p>
          <div className="h-1.5 w-full rounded-full bg-emerald-500/20 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.8%" }} />
          </div>
          <p className="text-[10px] text-muted-foreground">General questions & certificate queries</p>
        </div>
      </div>

      {/* Escalation Queue Table */}
      <Card>
        <CardHeader className="p-5 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Active SLA Countdown Queue
            </CardTitle>
            <CardDescription className="text-xs">
              Live tickets prioritized by remaining resolution window.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="text-xs rounded-lg border border-border bg-background p-2"
            >
              <option value="all">All Escalation Tiers</option>
              <option value="Tier 2">Tier 2: Senior Mentor</option>
              <option value="Tier 3">Tier 3: Academic Admin</option>
              <option value="Tier 4">Tier 4: Super Admin</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/60">
          {filtered.map((tkt) => {
            const isBreached = tkt.minutesRemaining <= 0;
            const isCritical = tkt.minutesRemaining > 0 && tkt.minutesRemaining <= 20;

            return (
              <div
                key={tkt.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {tkt.ticketNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-semibold text-foreground">
                      {tkt.studentName}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {tkt.category}
                    </Badge>
                    <Badge
                      className={`text-[10px] font-semibold ${tkt.priority === "urgent"
                        ? "bg-red-500/10 text-red-600 border-red-500/30"
                        : tkt.priority === "high"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                          : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                        }`}
                    >
                      {tkt.priority.toUpperCase()}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-semibold text-foreground">
                    {tkt.subject}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                    <span>Assigned: <strong>{tkt.assignedAgent}</strong></span>
                    <span>Current Escalation: <strong className="text-foreground">{tkt.escalationTier}</strong></span>
                  </div>
                </div>

                {/* Countdown & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      SLA Countdown
                    </p>
                    <div
                      className={`text-base font-extrabold font-mono mt-0.5 flex items-center justify-end gap-1 ${isBreached
                        ? "text-red-600 animate-pulse"
                        : isCritical
                          ? "text-amber-500 animate-pulse"
                          : "text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      <Clock className="h-4 w-4" />
                      {isBreached
                        ? `BREACHED (-${Math.abs(tkt.minutesRemaining)}m)`
                        : `${tkt.minutesRemaining}m remaining`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 font-semibold"
                      onClick={() => handleEscalateHigher(tkt.id)}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Escalate to Super Admin
                    </Button>

                    <Link to={`/support/ticket/${tkt.id}`}>
                      <Button size="sm" className="text-xs h-8 gap-1 bg-primary text-primary-foreground font-semibold">
                        Open Ticket <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
