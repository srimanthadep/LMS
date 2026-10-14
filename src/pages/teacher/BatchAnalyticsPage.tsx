import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/StatCard";
import { BarChart3, TrendingUp, AlertCircle, Users, Eye, HelpCircle } from "lucide-react";

export const BatchAnalyticsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Batch Performance & Comprehension Heatmaps
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Identify difficult conceptual clusters, lecture replay rewinds, and student attendance retention.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
          <StatCard
            index={0}
            title="Avg Cohort Attendance"
            value="88.4%"
            subtitle="112 students in Batch C7"
            icon={Users}
            trend={{ value: "+3.2% vs baseline", isPositive: true }}
          />
          <StatCard
            index={1}
            title="Most Replayed Segment"
            value="00:24:18"
            subtitle="HNSW Graph Construction"
            icon={Eye}
            trend={{ value: "320 replay loops", isPositive: false }}
            highlight
          />
          <StatCard
            index={2}
            title="Top Confusion Cluster"
            value="IVF-PQ Centroids"
            subtitle="18 questions asked"
            icon={HelpCircle}
            trend={{ value: "Recommended for revision", isPositive: false }}
          />
          <StatCard
            index={3}
            title="Assignment Pass Rate"
            value="94.2%"
            subtitle="Milestones 1 & 2 combined"
            icon={TrendingUp}
            trend={{ value: "Above target", isPositive: true }}
          />
        </div>

        {/* Replay Heatmap Visualization */}
        <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Lecture 8: Video Replay Scrubbing Heatmap
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Spikes indicate where students frequently re-watched or slowed playback down to 0.75x.
              </p>
            </div>
            <Badge variant="accent" className="text-[10px]">
              High Engagement
            </Badge>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-end gap-1.5 h-32 w-full pt-4">
              {[20, 35, 45, 85, 95, 70, 50, 40, 90, 60, 30, 25, 45, 80, 55, 30].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      val > 75 ? "bg-rose-500 hover:bg-rose-600" : "bg-primary/70 hover:bg-primary"
                    }`}
                    style={{ height: `${val}%` }}
                    title={`Segment ${idx + 1}: ${val}% rewind volume`}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground opacity-60">
                    {idx * 5}m
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/60">
              <span>00:00:00 (Start)</span>
              <span className="font-bold text-rose-500">Peak Friction: 00:24:18 (HNSW Graph Derivation)</span>
              <span>01:28:45 (End)</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
