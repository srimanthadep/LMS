import React from "react";

import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  BookOpen,
  Calendar,
  Video,
  Users,
  CreditCard,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { RupeeIcon } from "@/components/icons/RupeeIcon";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const courses = mockDataService.getCourses();
  const batches = mockDataService.getBatches();
  const liveClasses = mockDataService.getLiveClasses();
  const pendingGrading = mockDataService.getSubmissions().filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Academic Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Live batch orchestration, schedule management, fee collections, and student entitlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate("/admin/batches")}
            className="text-xs h-9 font-bold gap-1 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> New Batch
          </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/admin/schedule")}
              className="text-xs h-9 gap-1"
            >
              <Calendar className="h-3.5 w-3.5" /> Class Timetable
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/admin/courses")}
              className="text-xs h-9 font-bold gap-1 shadow-sm"
            >
              <BookOpen className="h-3.5 w-3.5" /> Course Catalog
            </Button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
          <StatCard
            index={0}
            title="Active Batches"
            value={batches.length.toString()}
            subtitle="Across 4 flagship AI courses"
            icon={Layers}
            trend={{ value: "+2 starting next week", isPositive: true }}
          />
          <StatCard
            index={1}
            title="Scheduled Lectures (Today)"
            value="3 Classes"
            subtitle="1 currently broadcasting"
            icon={Video}
            trend={{ value: "All faculty confirmed", isPositive: true }}
            highlight
          />
          <StatCard
            index={2}
            title="Pending Evaluations"
            value={pendingGrading.length.toString()}
            subtitle="Requires evaluator turnaround"
            icon={Clock}
            trend={{ value: "24h SLA target", isPositive: false }}
          />
          <StatCard
            index={3}
            title="Total Tuition Collected"
            value="₹18,45,000"
            subtitle="Razorpay live integration"
            icon={RupeeIcon}
            trend={{ value: "+18% this cohort", isPositive: true }}
          />
        </div>

        {/* Bento Grid: Today's Lectures & Cohorts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Lectures Schedule (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Today's Live Class Timetable
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Synchronous lecture rooms and attendance readiness
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/admin/schedule")}
                  className="text-xs h-8 text-primary font-semibold gap-1"
                >
                  Full Calendar <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3">
                {liveClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{cls.title}</span>
                        {cls.status === "live" ? (
                          <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4">LIVE NOW</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">SCHEDULED</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Batch: <strong>{cls.batchName}</strong> • Faculty: {cls.instructorName}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        ⏰ {cls.scheduledAt} ({cls.durationMinutes} mins)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cls.status === "live" ? (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => navigate("/admin/live-monitor")}
                          className="h-8 text-xs font-bold gap-1 shadow-xs"
                        >
                          <Video className="h-3 w-3" /> Live Monitor
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate("/admin/schedule")}
                          className="h-8 text-xs font-semibold"
                        >
                          Manage Session
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Cohorts Entitlements Overview */}
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Active Cohort Entitlements
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live vs. Replay-Only access types and delayed release schedules
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/admin/batches")}
                  className="text-xs h-8 text-primary font-semibold gap-1"
                >
                  Manage All Batches <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-muted/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{b.name}</span>
                        <Badge
                          variant={b.entitlement.accessType === "live_and_replay" ? "accent" : "warning"}
                          className="text-[10px] font-bold"
                        >
                          {b.entitlement.accessType === "live_and_replay" ? "Live + Replay" : "Replay Only"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {b.courseTitle} • Lead: {b.teacherName}
                      </p>
                      <div className="flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
                        <span>Enrolled: <strong>{b.enrolledCount} / {b.maxSeats}</strong></span>
                        {b.entitlement.replayReleaseDelayHours > 0 && (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            Replay Delay: {b.entitlement.replayReleaseDelayHours}h
                          </span>
                        )}
                        <span>Expires: {b.entitlement.accessExpiryDate}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/batches/${b.id}`)}
                      className="h-8 text-xs shrink-0 font-semibold"
                    >
                      Configure
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Quick Operational Actions & Pending Evaluator Queue (1 col) */}
          <div className="space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Daily Operational Actions
              </h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/announcements")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  📢 Broadcast WhatsApp Notice
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/payments")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  🏷️ Issue Discount Coupon
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/certificates")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  🎓 Issue Batch Certificates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/students")}
                  className="w-full justify-start text-xs h-9 font-semibold"
                >
                  👥 Extend Student Validity
                </Button>
              </div>
            </Card>

            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">Course Catalog Summary</h4>
                <Badge variant="outline" className="text-[10px]">{courses.length} Active</Badge>
              </div>
              <div className="space-y-2.5">
                {courses.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
                    <p className="font-bold text-foreground truncate">{c.title}</p>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                      <span>{c.modulesCount} modules • {c.totalHours} hrs</span>
                      <span className="font-bold text-primary font-mono">₹{c.priceRupees.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};
