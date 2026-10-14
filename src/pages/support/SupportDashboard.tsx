import React from "react";
import { Link } from "react-router-dom";
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
  ShieldAlert,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const SupportDashboard: React.FC = () => {
  const tickets = mockDataService.getTickets();
  const openCount = tickets.filter((t) => t.status === "open").length;
  const pendingCount = tickets.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Support & Mentor Workstation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resolve student queries, coordinate cohort batch shifts, and process validity extensions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/support/students-360">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              Student 360° Lookup
            </Button>
          </Link>
          <Link to="/support/inbox">
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground shadow-sm">
              <MessageSquare className="h-4 w-4" />
              Open Ticket Inbox
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value={openCount}
          icon={LifeBuoy}
          trend={{ value: "3 urgent SLA", isPositive: false }}
          highlight
        />
        <StatCard
          title="Pending Approval"
          value={pendingCount}
          icon={Clock}
          trend={{ value: "Waiting for Admin", isPositive: true }}
        />
        <StatCard
          title="Avg Response Time"
          value="18 mins"
          icon={TrendingUp}
          trend={{ value: "94% SLA compliant", isPositive: true }}
        />
        <StatCard
          title="First Contact Resolution"
          value="82.4%"
          icon={CheckCircle2}
          trend={{ value: "+4.1% this month", isPositive: true }}
        />
      </div>

      {/* High Priority Inbox & Proactive Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Tickets (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Active Support Queue
                </CardTitle>
                <CardDescription className="text-xs">
                  Escalated tickets requiring student assistance or mentor intervention.
                </CardDescription>
              </div>
              <Link to="/support/inbox">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View All ({tickets.length}) <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1.5">
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
                          Pending Admin Approval
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
                    <Button size="sm" variant="outline" className="text-xs gap-1.5 shrink-0">
                      Open Ticket <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Policy & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="p-4 border-b border-primary/20">
              <CardTitle className="text-xs font-bold text-primary flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" /> Mentorship Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs text-foreground/90 space-y-2 leading-relaxed">
              <p>
                <strong>Restricted Role Permissions:</strong> Support agents cannot directly modify batch rosters or payment refunds.
                Always use the <strong>"Propose Batch Move"</strong> or <strong>"Propose Validity Extension"</strong> workflows to trigger Admin two-person approval.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-xs font-bold text-foreground">
                Quick Action Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Link to="/support/students-360" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Look up Learner 360 Record
                </Button>
              </Link>
              <Link to="/support/analytics" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  View SLA & Ticket Volume
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
