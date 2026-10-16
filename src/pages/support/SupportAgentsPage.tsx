import React, { useState } from "react";
import UseAnimations from 'react-useanimations';
import user from 'react-useanimations/lib/user';
import clock from 'react-useanimations/lib/clock';
import HoverStar from "./HoverStar";
import HoverCheck from "./HoverCheck";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Star,
  Shield,
  LifeBuoy,
  MessageSquare,
  TrendingUp,
  Award,
  Calendar,
  AlertCircle,
  MoreVertical,
  UserCheck,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/StatCard";

interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleTier: "Tier 1 Support" | "Senior Technical Mentor" | "Escalations Lead";
  status: "online" | "in_chat" | "away" | "offline";
  activeTickets: number;
  solvedToday: number;
  avgResponseTime: string;
  csatScore: number;
  specialties: string[];
  currentShift: string;
  capacityPercent: number;
}

const AGENTS: SupportAgent[] = [
  {
    id: "agt-1",
    name: "Nikhil Joshi",
    email: "nikhil.j@edtech.com",
    avatar: "NJ",
    roleTier: "Tier 1 Support",
    status: "online",
    activeTickets: 4,
    solvedToday: 18,
    avgResponseTime: "8 mins",
    csatScore: 4.92,
    specialties: ["Batch Moves", "Validity Extensions", "Portal Login"],
    currentShift: "08:00 AM - 04:00 PM (IST)",
    capacityPercent: 80,
  },
  {
    id: "agt-2",
    name: "Aakash Varma",
    email: "aakash.v@edtech.com",
    avatar: "AV",
    roleTier: "Senior Technical Mentor",
    status: "in_chat",
    activeTickets: 5,
    solvedToday: 14,
    avgResponseTime: "12 mins",
    csatScore: 4.96,
    specialties: ["LLM Embeddings", "LangChain & LlamaIndex", "GPU Sandboxes"],
    currentShift: "10:00 AM - 06:00 PM (IST)",
    capacityPercent: 90,
  },
  {
    id: "agt-3",
    name: "Meera Sen",
    email: "meera.s@edtech.com",
    avatar: "MS",
    roleTier: "Escalations Lead",
    status: "online",
    activeTickets: 2,
    solvedToday: 8,
    avgResponseTime: "6 mins",
    csatScore: 4.98,
    specialties: ["SLA Escalations", "Refund Approvals", "Academic Exceptions"],
    currentShift: "09:00 AM - 05:00 PM (IST)",
    capacityPercent: 50,
  },
  {
    id: "agt-4",
    name: "Karan Singhania",
    email: "karan.s@edtech.com",
    avatar: "KS",
    roleTier: "Senior Technical Mentor",
    status: "away",
    activeTickets: 3,
    solvedToday: 11,
    avgResponseTime: "15 mins",
    csatScore: 4.88,
    specialties: ["Multi-Agent Swarms", "Autogen", "FastAPI Serving"],
    currentShift: "02:00 PM - 10:00 PM (IST)",
    capacityPercent: 60,
  },
  {
    id: "agt-5",
    name: "Tanvi Deshmukh",
    email: "tanvi.d@edtech.com",
    avatar: "TD",
    roleTier: "Tier 1 Support",
    status: "online",
    activeTickets: 3,
    solvedToday: 21,
    avgResponseTime: "9 mins",
    csatScore: 4.91,
    specialties: ["Course Access", "Payment Inquiries", "Certificate Verification"],
    currentShift: "08:00 AM - 04:00 PM (IST)",
    capacityPercent: 65,
  },
  {
    id: "agt-6",
    name: "Vikramaditya Roy",
    email: "vikram.r@edtech.com",
    avatar: "VR",
    roleTier: "Senior Technical Mentor",
    status: "offline",
    activeTickets: 0,
    solvedToday: 0,
    avgResponseTime: "18 mins",
    csatScore: 4.85,
    specialties: ["Vector Databases", "Milvus / Qdrant", "RAG Optimization"],
    currentShift: "06:00 PM - 02:00 AM (Night On-Call)",
    capacityPercent: 0,
  },
];

type AgentCardKey = "active" | "response" | "csat" | "resolved";

export const SupportAgentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<SupportAgent | null>(null);
  const [hoveredCard, setHoveredCard] = useState<AgentCardKey | null>(null);
  const [selectedCard, setSelectedCard] = useState<AgentCardKey | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const handleCardClick = (key: AgentCardKey) => {
    setSelectedCard((prev) => (prev === key ? null : key));
  };

  const isHighlighted = (key: AgentCardKey): boolean => {
    if (hoveredCard !== null) return hoveredCard === key;
    if (selectedCard !== null) return selectedCard === key;
    return false;
  };

  const filteredAgents = AGENTS.filter((agt) => {
    const matchesSearch =
      agt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agt.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (tierFilter !== "all" && agt.roleTier !== tierFilter) return false;
    if (statusFilter !== "all" && agt.status !== statusFilter) return false;
    return true;
  });

  const onlineCount = AGENTS.filter((a) => a.status === "online" || a.status === "in_chat").length;
  const inChatCount = AGENTS.filter((a) => a.status === "in_chat").length;

  return (
    <div className="space-y-6 support-page-font">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Support Agents & Mentors Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Monitor real-time agent presence, active ticket distribution, CSAT scores, and shift coverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {onlineCount} of {AGENTS.length} Agents Available
          </Badge>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { key: "active" as AgentCardKey, index: 0, title: "Active Agents", value: `${onlineCount} / ${AGENTS.length}`, icon: () => <UseAnimations animation={user} size={32} />, trend: { value: `${inChatCount} handling live chats`, isPositive: true }, hint: "active agents" },
          { key: "response" as AgentCardKey, index: 1, title: "Team Avg First Response", value: "10 mins", icon: () => <UseAnimations animation={clock} size={32} />, trend: { value: "-4 mins vs SLA benchmark", isPositive: true }, hint: "response time" },
          { key: "csat" as AgentCardKey, index: 2, title: "Average CSAT Rating", value: "4.92 / 5.0", icon: () => <HoverStar />, trend: { value: "98.4% positive feedback", isPositive: true }, hint: "CSAT rating" },
          { key: "resolved" as AgentCardKey, index: 3, title: "Tickets Resolved Today", value: "72", icon: () => <HoverCheck />, trend: { value: "+18% vs yesterday", isPositive: true }, hint: "resolved tickets" },
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
              onAction={() => handleCardClick(card.key)}
              hideChart
              highlight={isHighlighted(card.key)}
            />
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by agent name, specialty, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="text-xs rounded-lg border border-border bg-background p-2"
            >
              <option value="all">All Tiers</option>
              <option value="Tier 1 Support">Tier 1 Support</option>
              <option value="Senior Technical Mentor">Senior Technical Mentors</option>
              <option value="Escalations Lead">Escalations Lead</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-lg border border-border bg-background p-2"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="in_chat">In Live Chat</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Agents Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agt) => (
          <div
            key={agt.id}
            onMouseEnter={() => setHoveredAgent(agt.id)}
            onMouseLeave={() => setHoveredAgent(null)}
            className={`rounded-2xl transition-all duration-200
              ${hoveredAgent === agt.id ? "-translate-y-1.5 shadow-2xl" : ""}
              ${hoveredAgent !== null && hoveredAgent !== agt.id ? "opacity-60 scale-[0.985]" : ""}
            `}
          >
          <Card className={`transition-all duration-200 flex flex-col h-full
            ${hoveredAgent === agt.id
              ? "border-primary/50 ring-1 ring-primary/20"
              : "hover:border-border"}
          `}>
            <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm ring-2 ring-primary/20">
                    {agt.avatar}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-background ${agt.status === "online"
                        ? "bg-emerald-500"
                        : agt.status === "in_chat"
                          ? "bg-blue-500 animate-pulse"
                          : agt.status === "away"
                            ? "bg-amber-500"
                            : "bg-muted-foreground"
                      }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{agt.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">{agt.email}</p>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`text-[10px] capitalize font-medium ${agt.status === "online"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : agt.status === "in_chat"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                      : agt.status === "away"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        : "bg-muted text-muted-foreground"
                  }`}
              >
                {agt.status.replace("_", " ")}
              </Badge>
            </CardHeader>

            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4 text-xs">
              {/* Role Tier and Shift */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{agt.roleTier}</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" /> {agt.csatScore}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Shift: {agt.currentShift}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-muted/20 border border-border/60 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground">Active</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{agt.activeTickets}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Solved Today</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{agt.solvedToday}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Avg Response</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{agt.avgResponseTime}</p>
                </div>
              </div>

              {/* Workload Capacity Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Workload Capacity</span>
                  <span className={`font-bold ${agt.capacityPercent > 80 ? "text-amber-500" : "text-foreground"}`}>
                    {agt.capacityPercent}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${agt.capacityPercent > 80 ? "bg-amber-500" : "bg-primary"
                      }`}
                    style={{ width: `${agt.capacityPercent}%` }}
                  />
                </div>
              </div>

              {/* Specialties Tags */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Specialties & Coverage
                </p>
                <div className="flex flex-wrap gap-1">
                  {agt.specialties.map((spec, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5 bg-background">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border/60 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-8 gap-1.5 font-semibold"
                  onClick={() => alert(`Direct ticket delegation initiated for ${agt.name}.`)}
                >
                  <LifeBuoy className="h-3.5 w-3.5 text-primary" />
                  Delegate Tickets
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => alert(`Direct internal chat with ${agt.name} opened.`)}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
