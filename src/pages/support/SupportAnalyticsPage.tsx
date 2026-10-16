import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UseAnimations from "react-useanimations";
import clock from "react-useanimations/lib/clock";
import shield from "react-useanimations/lib/shield";
import HoverStar from "./HoverStar";
import HoverCheck from "./HoverCheck";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LifeBuoy,
  Users,
  Award,
  ArrowUpRight,
  ChevronRight,
  MessageSquare,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";

type AnalyticsCardKey = "response" | "compliance" | "resolved" | "escalations";

export const SupportAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<AnalyticsCardKey | null>(null);
  const [hoveredCard, setHoveredCard] = useState<AnalyticsCardKey | null>(null);

  const handleCardClick = (key: AnalyticsCardKey) => {
    setSelectedCard((prev) => (prev === key ? null : key));
  };

  const isHighlighted = (key: AnalyticsCardKey): boolean => {
    if (hoveredCard !== null) return hoveredCard === key;
    if (selectedCard !== null) return selectedCard === key;
    return false;
  };

  const kpiCards: {
    key: AnalyticsCardKey;
    index: number;
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend: { value: string; isPositive: boolean };
    hint: string;
    nav: string;
  }[] = [
    {
      key: "response",
      index: 0,
      title: "Avg First Response",
      value: "14 mins",
      icon: () => <UseAnimations animation={clock} size={32} />,
      trend: { value: "-6 mins vs target", isPositive: true },
      hint: "response time",
      nav: "/support/tickets",
    },
    {
      key: "compliance",
      index: 1,
      title: "SLA Compliance Rate",
      value: "96.8%",
      icon: () => <HoverCheck />,
      trend: { value: "+1.2% this week", isPositive: true },
      hint: "SLA compliance",
      nav: "/support/sla-escalations",
    },
    {
      key: "resolved",
      index: 2,
      title: "Resolved This Month",
      value: "184",
      icon: () => <HoverStar />,
      trend: { value: "92% satisfied", isPositive: true },
      hint: "resolved tickets",
      nav: "/support/tickets",
    },
    {
      key: "escalations",
      index: 3,
      title: "Active Escalations",
      value: "3",
      icon: () => <UseAnimations animation={shield} size={32} />,
      trend: { value: "2 awaiting Admin", isPositive: false },
      hint: "active escalations",
      nav: "/support/sla-escalations",
    },
  ];

  return (
    <div className="space-y-6 support-page-font">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart2 className="h-6 w-6 text-primary" />
              Reports & Support Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Monitor response velocity, SLA compliance trends, ticket volume distributions, and mentor workload.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Real-time Metrics Active
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 font-semibold"
            onClick={() => alert("Monthly Support & SLA Performance Report (PDF) generated and sent to Admin desk.")}
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
            Export Monthly Report
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.key}
            onClick={() => {
              handleCardClick(card.key);
              navigate(card.nav);
            }}
            onMouseEnter={() => setHoveredCard(card.key)}
            onMouseLeave={() => setHoveredCard(null)}
            onFocus={() => setHoveredCard(card.key)}
            onBlur={() => setHoveredCard(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(card.key);
                navigate(card.nav);
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

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Category Distribution (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Inquiry Category Breakdown
                </CardTitle>
                <CardDescription className="text-xs">
                  Distribution across platform request types over the last 30 days.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 gap-1 font-semibold"
                onClick={() => navigate("/support/tickets")}
              >
                <span>View Queue</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Batch Move Requests (Work/Schedule shifts)</span>
                  <span className="text-primary font-mono">38% (70 tickets)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "38%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Course Validity & Medical Extensions</span>
                  <span className="text-emerald-500 font-mono">28% (52 tickets)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "28%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Replay Delay & Recording Inquiries</span>
                  <span className="text-violet-500 font-mono">20% (37 tickets)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Payment Gateway / Invoice GST Questions</span>
                  <span className="text-amber-500 font-mono">14% (25 tickets)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "14%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mentor Performance Leaderboard (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Mentor Team Performance
                </CardTitle>
                <CardDescription className="text-xs">
                  Active team members handling learner inquiries and batch shifts.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 gap-1 font-semibold"
                onClick={() => navigate("/support/agents")}
              >
                <span>View Directory</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    NJ
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Nikhil Joshi</h4>
                    <p className="text-[11px] text-muted-foreground">Lead Student Mentor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="font-bold text-foreground">78 Resolved</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1.5 font-semibold"
                      onClick={() => navigate("/support/agents")}
                    >
                      <LifeBuoy className="h-3.5 w-3.5 text-primary" />
                      Delegate Tickets
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate("/support/live-chat")}
                      title="Direct Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-violet-500/10 text-violet-600 font-bold flex items-center justify-center text-xs">
                    AM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Ankita Mukhopadhyay</h4>
                    <p className="text-[11px] text-muted-foreground">Academic Counselor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="font-bold text-foreground">64 Resolved</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">4.85/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1.5 font-semibold"
                      onClick={() => navigate("/support/agents")}
                    >
                      <LifeBuoy className="h-3.5 w-3.5 text-primary" />
                      Delegate Tickets
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate("/support/live-chat")}
                      title="Direct Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center text-xs">
                    RS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Rahul Sharma</h4>
                    <p className="text-[11px] text-muted-foreground">Technical Doubts Support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="font-bold text-foreground">42 Resolved</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">4.8/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1.5 font-semibold"
                      onClick={() => navigate("/support/agents")}
                    >
                      <LifeBuoy className="h-3.5 w-3.5 text-primary" />
                      Delegate Tickets
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate("/support/live-chat")}
                      title="Direct Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
