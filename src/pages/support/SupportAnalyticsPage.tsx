import React from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LifeBuoy,
  Users,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";

export const SupportAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Support & Mentor Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor response times, SLA adherence, ticket distributions, and mentor workload.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg First Response"
          value="14 mins"
          icon={Clock}
          trend={{ value: "-6 mins vs target", isPositive: true }}
        />
        <StatCard
          title="SLA Compliance Rate"
          value="96.8%"
          icon={CheckCircle2}
          trend={{ value: "+1.2% this week", isPositive: true }}
        />
        <StatCard
          title="Resolved This Month"
          value="184"
          icon={LifeBuoy}
          trend={{ value: "92% satisfied", isPositive: true }}
        />
        <StatCard
          title="Active Escalations"
          value="3"
          icon={AlertTriangle}
          trend={{ value: "2 awaiting Admin", isPositive: false }}
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Category Distribution (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                Inquiry Category Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Distribution across platform request types over the last 30 days.
              </CardDescription>
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
            <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                Mentor Team Performance
              </CardTitle>
              <CardDescription className="text-xs">
                Active team members handling learner inquiries and batch shifts.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              <div className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    NJ
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Nikhil Joshi</h4>
                    <p className="text-[11px] text-muted-foreground">Lead Student Mentor</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-foreground">78 Resolved</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">4.9/5 Rating</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-violet-500/10 text-violet-600 font-bold flex items-center justify-center text-xs">
                    AM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Ankita Mukhopadhyay</h4>
                    <p className="text-[11px] text-muted-foreground">Academic Counselor</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-foreground">64 Resolved</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">4.85/5 Rating</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center text-xs">
                    RS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Rahul Sharma</h4>
                    <p className="text-[11px] text-muted-foreground">Technical Doubts Support</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-foreground">42 Resolved</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">4.8/5 Rating</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
