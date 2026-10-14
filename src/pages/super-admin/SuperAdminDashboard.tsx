import React from "react";

import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Cpu,
  ShieldCheck,
  Zap,
  Server,
  DollarSign,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { RupeeIcon } from "@/components/icons/RupeeIcon";

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const auditLogs = mockDataService.getAuditLogs();
  const liveClasses = mockDataService.getLiveClasses().filter((c) => c.status === "live");

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Super Admin Platform Health
            <Badge variant="success" className="text-[10px] uppercase font-bold">
              100% Operational
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Enterprise governance, LLM token quotas, tenant security, and real-time infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/super-admin/usage-costs")}
            className="text-xs h-9 gap-1 font-semibold"
          >
            <Activity className="h-3.5 w-3.5 text-primary" /> Cost Alerts (Normal)
          </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/super-admin/audit-logs")}
              className="text-xs h-9"
            >
              Audit Trail
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/super-admin/users")}
              className="text-xs h-9 font-bold gap-1 shadow-sm"
            >
              <Users className="h-3.5 w-3.5" /> Manage Users
            </Button>
          </div>
        </div>

        {/* 4-Column Stat Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
          <StatCard
            index={0}
            title="Total Active Learners"
            value="892"
            subtitle="Across 6 concurrent batches"
            icon={Users}
            trend={{ value: "+14% this month", isPositive: true }}
            highlight
          />
          <StatCard
            index={1}
            title="LLM Token Usage (30d)"
            value="42.8M"
            subtitle="GPT-4o & Claude 3.5 Sonnet"
            icon={Cpu}
            trend={{ value: "₹48,200 spend", isPositive: true }}
          />
          <StatCard
            index={2}
            title="Live Sessions Running"
            value={liveClasses.length.toString()}
            subtitle="72 current student viewers"
            icon={Zap}
            trend={{ value: "0 packet drops", isPositive: true }}
          />
          <StatCard
            index={3}
            title="Platform Revenue (MTD)"
            value="₹18,45,000"
            subtitle="Via Razorpay gateway"
            icon={RupeeIcon}
            trend={{ value: "+22% YoY", isPositive: true }}
          />
        </div>

        {/* Bento Grid: 2-columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Live Class Monitoring Card (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Virtual Classroom Cluster
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time audio/video bitrate and participant concurrency
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/admin/live-monitor")}
                  className="text-xs h-8 gap-1 text-primary font-semibold"
                >
                  Live Monitor <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4">
                {liveClasses.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No active sessions streaming at this moment.
                  </p>
                ) : (
                  liveClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{cls.title}</span>
                          <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4">LIVE</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Instructor: <strong>{cls.instructorName}</strong> • Batch: {cls.batchName}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span>Active Viewers: <strong>{cls.viewerCount}</strong></span>
                          <span>Topic: <strong>{cls.activeTopic}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => navigate(`/teacher/classroom/${cls.id}`)}
                          className="h-8 text-xs font-bold gap-1 shadow-xs"
                        >
                          <Play className="h-3 w-3" /> Observe Session
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                {/* Infrastructure telemetry */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-border/70 bg-card">
                    <p className="text-[11px] text-muted-foreground">Whisper ASR Latency</p>
                    <p className="text-base font-bold text-foreground mt-0.5">850 ms</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Sub-second</span>
                  </div>
                  <div className="p-3 rounded-xl border border-border/70 bg-card">
                    <p className="text-[11px] text-muted-foreground">Qdrant Vector Node</p>
                    <p className="text-base font-bold text-foreground mt-0.5">14.2 ms</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">p99 query SLA</span>
                  </div>
                  <div className="p-3 rounded-xl border border-border/70 bg-card">
                    <p className="text-[11px] text-muted-foreground">WebRTC TURN Health</p>
                    <p className="text-base font-bold text-foreground mt-0.5">100%</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Zero lost</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Impersonation Shortcut */}
            <Card className="border-border/80 shadow-xs rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-amber-600" /> View-As-User Persona Simulator
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Audit user entitlements, blind grading views, and student dashboards in a safe read-only sandbox.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/super-admin/users")}
                  className="text-xs h-8 shrink-0 font-semibold border-amber-500/30 hover:bg-amber-500/10"
                >
                  Select User to Impersonate
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Security & Immutable Audit Stream (1 col) */}
          <div className="space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden h-full flex flex-col justify-between">
              <div>
                <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-primary" />
                    Live Security Audit
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate("/super-admin/audit-logs")}
                    className="text-xs h-7 text-primary p-0"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl border border-border/60 bg-muted/20 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground truncate max-w-[170px]">{log.action}</span>
                        <Badge
                          variant={log.status === "success" ? "success" : "warning"}
                          className="text-[9px] px-1 py-0"
                        >
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {log.details}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                        <span>By {log.actorName}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </div>

              {/* Integrations health capsule */}
              <div className="p-4 border-t border-border/70 bg-muted/10 m-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">API Connectors</span>
                  <Badge variant="success" className="text-[9px]">4 / 4 Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>OpenAI API</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Anthropic Claude</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Razorpay Webhooks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Zoom Video SDK</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};
