import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  Award,
  Sparkles,
  PieChart,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const EvaluatorAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const weeklyTrends = [
    { week: "Week 1", count: 28, onTimePercent: 98 },
    { week: "Week 2", count: 34, onTimePercent: 96 },
    { week: "Week 3", count: 42, onTimePercent: 95 },
    { week: "Week 4", count: 38, onTimePercent: 97 },
  ];

  const scoreDistribution = [
    { range: "90 - 100% (A+)", count: 46, percent: 32 },
    { range: "80 - 89% (A)", count: 58, percent: 41 },
    { range: "70 - 79% (B)", count: 26, percent: 18 },
    { range: "60 - 69% (C)", count: 9, percent: 6 },
    { range: "< 60% (Remedial)", count: 4, percent: 3 },
  ];

  const courseWorkloads = [
    { name: "Full-Stack AI & LLM Systems", evaluated: 58, avgTime: "16 min", consistencyScore: "96.2%" },
    { name: "Autonomous Multi-Agent Architectures", evaluated: 36, avgTime: "22 min", consistencyScore: "94.5%" },
    { name: "Diffusion Models & Generative Vision", evaluated: 24, avgTime: "18 min", consistencyScore: "95.1%" },
    { name: "Production MLOps & Vector Infra", evaluated: 34, avgTime: "14 min", consistencyScore: "97.8%" },
  ];

  const handleDownloadReport = () => {
    const reportData = `EVALUATOR PERFORMANCE AUDIT REPORT
Evaluator: Kavita Rao (ID: usr-eval-1)
Period: Last 30 Days
Total Submissions Evaluated: 152
Average Turnaround Time: 3.8 Hours
On-Time SLA Adherence: 96.5%
Reassessment Contestation Rate: 3.2%
Grading Consistency Index: 95.9%

COURSE BREAKDOWN:
- Full-Stack AI & LLM Systems: 58 evaluated | 16 min avg | 96.2% consistency
- Autonomous Multi-Agent Architectures: 36 evaluated | 22 min avg | 94.5% consistency
- Diffusion Models & Generative Vision: 24 evaluated | 18 min avg | 95.1% consistency
- Production MLOps & Vector Infra: 34 evaluated | 14 min avg | 97.8% consistency
`;
    const blob = new Blob([reportData], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `evaluator_analytics_report_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Evaluation Analytics & Reports
            </h1>
            <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
              Q4 Faculty Audit
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Review turnaround latency, grading consistency curves, reassessment rates, and SLA compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">This Semester</option>
          </select>

          <Button
            size="sm"
            onClick={handleDownloadReport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 font-semibold shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Download Audit Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Evaluated"
          value="152"
          icon={FileCheck2}
          trend={{ value: "+28 this cycle", isPositive: true }}
          highlight
        />
        <StatCard
          title="Avg Turnaround Time"
          value="3.8 hrs"
          icon={Clock}
          trend={{ value: "Target < 24 hrs", isPositive: true }}
        />
        <StatCard
          title="On-Time SLA Adherence"
          value="96.5%"
          icon={CheckCircle2}
          trend={{ value: "99.2% overall goal", isPositive: true }}
        />
        <StatCard
          title="Reassessment Rate"
          value="3.2%"
          icon={TrendingUp}
          trend={{ value: "Low dispute frequency", isPositive: true }}
        />
      </div>

      {/* Weekly Throughput & Grade Distribution Bell Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Throughput (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-zinc-200/80 dark:border-zinc-800">
            <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Evaluation Completion Trends
                </CardTitle>
                <CardDescription className="text-xs">
                  Weekly evaluated submission volume and corresponding SLA compliance.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-4">
                {weeklyTrends.map((w, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{w.week}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{w.count} submissions</span>
                        <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/20 font-mono">
                          {w.onTimePercent}% SLA
                        </Badge>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(w.count / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Monthly Evaluation Velocity</span>
                <span className="font-bold text-foreground">38.0 submissions / week</span>
              </div>
            </CardContent>
          </Card>

          {/* Workload Breakdown by Course */}
          <Card className="border-zinc-200/80 dark:border-zinc-800">
            <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                Workload & Speed by Course
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/70 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-[11px] font-bold text-muted-foreground uppercase">
                    <th className="p-3.5">Course Cohort</th>
                    <th className="p-3.5">Submissions</th>
                    <th className="p-3.5">Avg Speed</th>
                    <th className="p-3.5 text-right">Consistency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800">
                  {courseWorkloads.map((cw, i) => (
                    <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                      <td className="p-3.5 font-semibold text-foreground">{cw.name}</td>
                      <td className="p-3.5 font-mono">{cw.evaluated}</td>
                      <td className="p-3.5 font-mono text-muted-foreground">{cw.avgTime}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600">{cw.consistencyScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Grading Consistency Bell Curve (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-zinc-200/80 dark:border-zinc-800">
            <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                Score Distribution Bell Curve
              </CardTitle>
              <CardDescription className="text-xs">
                Evaluator score variance and standard deviation across cohort submissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {scoreDistribution.map((d, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{d.range}</span>
                    <span className="font-mono text-muted-foreground">
                      <strong>{d.count}</strong> ({d.percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${d.percent * 2.2}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Calibrated Normal Distribution
                </span>
                <p className="text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed">
                  Scoring metrics demonstrate standard deviation σ = 8.4, confirming balanced grading without harsh or lenient skew.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quality & Audit Protection Badge */}
          <Card className="border-zinc-200/80 dark:border-zinc-800 p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Institutional Audit Compliance
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All evaluations pass blind review verification and are signed cryptographically with evaluator credentials for audit traceability.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
