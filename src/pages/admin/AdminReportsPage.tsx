import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Users,
  Award,
  Video,
  CreditCard,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  FileSpreadsheet,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { RupeeIcon } from "@/components/icons/RupeeIcon";

export const AdminReportsPage: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<"overview" | "attendance" | "progress" | "batches" | "revenue">("overview");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const courses = mockDataService.getCourses();
  const batches = mockDataService.getBatches();

  const handleExport = (reportName: string) => {
    setExportNotice(`Generated & exported ${reportName} (CSV) for ${dateRange}.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Reports & Educational Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Attendance telemetry, cohort completion velocity, assessment benchmarks, and revenue reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportNotice && (
            <Badge variant="success" className="text-xs py-1 px-2.5 gap-1 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> {exportNotice}
            </Badge>
          )}
          <Button
            size="sm"
            onClick={() => handleExport("Complete_Operational_Report")}
            className="text-xs h-9 font-bold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Export Report (CSV)
          </Button>
        </div>
      </div>

      {/* Report Category Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/80 pb-2 overflow-x-auto sleek-scrollbar">
        <button
          type="button"
          onClick={() => setActiveReportTab("overview")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeReportTab === "overview"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" /> Reports Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab("attendance")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeReportTab === "attendance"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Attendance Reports
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab("progress")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeReportTab === "progress"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Award className="h-3.5 w-3.5" /> Student Progress & Grades
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab("batches")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeReportTab === "batches"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> Cohort Benchmarking
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab("revenue")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeReportTab === "revenue"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" /> Revenue & Collections
        </button>
      </div>

      {/* TAB 1: REPORTS OVERVIEW (Bento Dashboard) */}
      {activeReportTab === "overview" && (
        <div className="space-y-6">
          {/* Top 4 Key Indicator Bento Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-border/80 bg-card p-4 space-y-2 shadow-xs">
              <span className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
                Average Live Attendance
                <Users className="h-4 w-4 text-primary" />
              </span>
              <p className="text-2xl font-extrabold text-foreground">88.4%</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                +4.2% higher vs Cohort 6
              </span>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card p-4 space-y-2 shadow-xs">
              <span className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
                Capstone Pass Velocity
                <Award className="h-4 w-4 text-primary" />
              </span>
              <p className="text-2xl font-extrabold text-foreground">94.2%</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                142 submissions cleared
              </span>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card p-4 space-y-2 shadow-xs">
              <span className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
                Replay Turnaround SLA
                <Video className="h-4 w-4 text-primary" />
              </span>
              <p className="text-2xl font-extrabold text-foreground">18 mins</p>
              <span className="text-[11px] text-muted-foreground font-medium block">
                Live stream to HLS + chapters
              </span>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card p-4 space-y-2 shadow-xs">
              <span className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
                30-Day Gross Collection
                <RupeeIcon className="h-4 w-4 text-primary" />
              </span>
              <p className="text-2xl font-extrabold text-foreground">₹18,45,000</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                98.8% payment reconciliation
              </span>
            </Card>
          </div>

          {/* Detailed Analytical Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Cohort Completion Velocity</h3>
                <Badge variant="outline" className="text-[10px]">Active Batches</Badge>
              </div>

              <div className="space-y-3 pt-1">
                {batches.map((b) => (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground truncate max-w-xs">{b.name}</span>
                      <strong className="text-primary font-mono">
                        {Math.round((b.enrolledCount / b.maxSeats) * 100)}%
                      </strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round((b.enrolledCount / b.maxSeats) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Recent Operational Analytics Reports</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleExport("All_Reports_Archive")}
                  className="text-xs h-7 text-primary font-semibold"
                >
                  Download All
                </Button>
              </div>

              <div className="divide-y divide-border/60 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">Cohort 7 Live Synchronous Attendance Log</p>
                    <p className="text-[10px] text-muted-foreground">14 Lectures · 112 Active Learners</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("Cohort7_Attendance")}
                    className="h-7 text-xs font-semibold"
                  >
                    Export
                  </Button>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">Agentic Swarms Capstone Evaluation Matrix</p>
                    <p className="text-[10px] text-muted-foreground">Rubric scores, turnaround times, and overrides</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("Capstone_Evaluation_Matrix")}
                    className="h-7 text-xs font-semibold"
                  >
                    Export
                  </Button>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">Monthly Payment Invoices & Tax Reconciliation</p>
                    <p className="text-[10px] text-muted-foreground">Razorpay captured transactions + GST breakdowns</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("Payment_GST_Reconciliation")}
                    className="h-7 text-xs font-semibold"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE REPORTS */}
      {activeReportTab === "attendance" && (
        <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Live Attendance Rates by Class Session</h3>
              <p className="text-xs text-muted-foreground">Includes verified WebRTC presence & minutes watched.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("Live_Attendance_Breakdown")}
              className="text-xs h-8 font-semibold gap-1"
            >
              <Download className="h-3 w-3" /> Export Attendance CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Class Session Title</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Attended / Enrolled</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="hover:bg-muted/15 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">Session 14: Multi-Agent Consensus & Hierarchical Supervision</td>
                  <td className="py-3 px-4">Prof. Rajesh Verma</td>
                  <td className="py-3 px-4 text-muted-foreground">Today</td>
                  <td className="py-3 px-4">72 / 112</td>
                  <td className="py-3 px-4 font-bold text-primary">64.3% (Streaming Now)</td>
                </tr>
                <tr className="hover:bg-muted/15 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">Session 13: Distributed GPU Vector Quantization & HNSW</td>
                  <td className="py-3 px-4">Prof. Rajesh Verma</td>
                  <td className="py-3 px-4 text-muted-foreground">Yesterday</td>
                  <td className="py-3 px-4">104 / 112</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">92.8%</td>
                </tr>
                <tr className="hover:bg-muted/15 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">Session 12: Tool Routing & Sandboxed Execution with E2B</td>
                  <td className="py-3 px-4">Prof. Rajesh Verma</td>
                  <td className="py-3 px-4 text-muted-foreground">3 days ago</td>
                  <td className="py-3 px-4">98 / 112</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">87.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: PROGRESS */}
      {activeReportTab === "progress" && (
        <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Student Assessment Milestones & Passing Status</h3>
              <p className="text-xs text-muted-foreground">Tracks eligibility for certification and grading turnaround.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("Student_Progress_Grades")}
              className="text-xs h-8 font-semibold gap-1"
            >
              <Download className="h-3 w-3" /> Export Grades CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Cohort</th>
                  <th className="py-3 px-4">Curriculum Completed</th>
                  <th className="py-3 px-4">Weighted GPA</th>
                  <th className="py-3 px-4">Certificate Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="hover:bg-muted/15 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-foreground">Arjun Mehta</p>
                    <p className="text-[10px] text-muted-foreground">arjun.m@learner.ai</p>
                  </td>
                  <td className="py-3 px-4">Cohort 7</td>
                  <td className="py-3 px-4 font-bold text-foreground">68% (14 Modules)</td>
                  <td className="py-3 px-4 font-extrabold text-primary">95 / 100</td>
                  <td className="py-3 px-4">
                    <Badge variant="success" className="text-[10px]">Distinction Track</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-muted/15 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-foreground">Pooja Hegde</p>
                    <p className="text-[10px] text-muted-foreground">pooja.h@example.com</p>
                  </td>
                  <td className="py-3 px-4">Cohort 4</td>
                  <td className="py-3 px-4 font-bold text-foreground">82% (8 Modules)</td>
                  <td className="py-3 px-4 font-extrabold text-primary">92 / 100</td>
                  <td className="py-3 px-4">
                    <Badge variant="success" className="text-[10px]">Eligible</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: BATCHES */}
      {activeReportTab === "batches" && (
        <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Batch Performance Comparison</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("Cohort_Comparison")}
              className="text-xs h-8 font-semibold gap-1"
            >
              <Download className="h-3 w-3" /> Export Cohorts CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-border/70 bg-muted/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-foreground">{b.name}</h4>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">{b.cohortCode}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] text-muted-foreground block">Enrolled</span>
                    <strong className="text-foreground">{b.enrolledCount} Students</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] text-muted-foreground block">Faculty</span>
                    <strong className="text-foreground truncate block">{b.teacherName.split(" ")[1]}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] text-muted-foreground block">Capacity</span>
                    <strong className="text-foreground">{Math.round((b.enrolledCount / b.maxSeats) * 100)}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: REVENUE */}
      {activeReportTab === "revenue" && (
        <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Revenue Collection & Razorpay Settlement</h3>
              <p className="text-xs text-muted-foreground">Daily payment volumes, net collections, and coupon discounts.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExport("Revenue_Collections_Report")}
              className="text-xs h-8 font-semibold gap-1"
            >
              <Download className="h-3 w-3" /> Export Financial Summary
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-xs text-muted-foreground block">Gross Enrollment Volume</span>
              <p className="text-2xl font-extrabold text-foreground mt-1">₹18,45,000</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+18.5% MoM</span>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-xs text-muted-foreground block">Coupon Discounts Redeemed</span>
              <p className="text-2xl font-extrabold text-foreground mt-1">₹1,24,000</p>
              <span className="text-[11px] text-muted-foreground font-semibold">48 coupons applied</span>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-xs text-muted-foreground block">Net Settled to Bank (T+2)</span>
              <p className="text-2xl font-extrabold text-primary mt-1">₹17,21,000</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Settled</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
