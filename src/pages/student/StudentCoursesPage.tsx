import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, Clock, ShieldCheck, ArrowRight, Video, PlaySquare, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";

export const StudentCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const batches = mockDataService.getBatches();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> My Enrolled Programs & Cohort Entitlements
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Understand your active cohort entitlements, live broadcasting permissions, and replay release windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batches.slice(0, 2).map((b) => {
            const isLiveTier = b.entitlement.accessType === "live_and_replay";

            return (
              <Card
                key={b.id}
                className={`border shadow-xs rounded-2xl overflow-hidden bg-card flex flex-col justify-between ${
                  isLiveTier ? "border-primary/40 ring-1 ring-primary/20" : "border-border/80"
                }`}
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant={isLiveTier ? "accent" : "warning"}
                      className="text-[10px] font-bold"
                    >
                      {isLiveTier ? "LIVE + REPLAY ENTITLE" : "REPLAY-ONLY ENTITLE"}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                      {b.cohortCode}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {b.courseTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      Cohort: {b.name} • Faculty: {b.teacherName}
                    </p>
                  </div>

                  {/* Entitlement Breakdown Box */}
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-primary" /> Live Classroom Access:
                      </span>
                      <strong className={isLiveTier ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                        {isLiveTier ? "Granted (Live Broadcasting)" : "Restricted (Replays Only)"}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <PlaySquare className="h-3.5 w-3.5 text-primary" /> Replay Availability:
                      </span>
                      <strong className="text-foreground">
                        {b.entitlement.replayReleaseDelayHours === 0
                          ? "Instantaneous (0h)"
                          : `Delayed: 24h Post-Class`}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary" /> Validity Expiry:
                      </span>
                      <strong className="text-foreground font-mono">
                        Expires {b.entitlement.accessExpiryDate}
                      </strong>
                    </div>
                  </div>

                  {!isLiveTier && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>This is a self-paced tier. Lectures unlock 24 hours after live faculty broadcast.</span>
                    </div>
                  )}
                </div>

                <div className="p-5 pt-0">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/student/courses/${b.courseId}`)}
                    className="w-full text-xs h-9 font-bold gap-1 shadow-2xs"
                  >
                    Open Curriculum & Replays <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};
