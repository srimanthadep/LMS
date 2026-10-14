import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockDataService } from "@/services/mockDataService";
import { Layers, ArrowLeft, Users, Calendar, ShieldCheck, Clock, Plus, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export const BatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const batches = mockDataService.getBatches();
  const batch = batches.find((b) => b.id === id) || batches[0];
  const { addNotification } = useNotifications();

  // Entitlement editor state
  const [accessType, setAccessType] = useState(batch.entitlement.accessType);
  const [delayHours, setDelayHours] = useState(batch.entitlement.replayReleaseDelayHours.toString());
  const [expiryDate, setExpiryDate] = useState(batch.entitlement.accessExpiryDate);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveEntitlements = () => {
    batch.entitlement.accessType = accessType;
    batch.entitlement.replayReleaseDelayHours = Number(delayHours);
    batch.entitlement.accessExpiryDate = expiryDate;
    setIsSaved(true);
    addNotification({
      title: "Batch Entitlements Updated",
      message: `Entitlements for ${batch.name} have been updated.`,
      type: "system",
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  const sampleRoster = [
    { id: "s1", name: "Arjun Mehta", email: "arjun.m@learner.ai", attendance: "88%", status: "Active" },
    { id: "s2", name: "Pooja Hegde", email: "pooja.h@example.com", attendance: "92%", status: "Active" },
    { id: "s3", name: "Rohan Nair", email: "rohan.n@tech.com", attendance: "75%", status: "Active" },
    { id: "s4", name: "Devendra Patel", email: "dev.patel@tech.in", attendance: "81%", status: "Active" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/admin/batches")}
            className="h-8 text-xs gap-1 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Batches
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">{batch.name}</h1>
            <Badge
              variant={batch.entitlement.accessType === "live_and_replay" ? "accent" : "warning"}
              className="text-[10px] font-bold"
            >
              {batch.entitlement.accessType === "live_and_replay" ? "LIVE + REPLAY" : "REPLAY ONLY"}
            </Badge>
          </div>
        </div>

        {/* Bento Grid: Entitlements Editor & Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entitlement Editor (1 col) */}
          <div className="space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Batch Entitlement Rules
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rules configured here determine whether students in this cohort can join live broadcasts or must wait for delayed replay releases.
              </p>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Access Privilege Tier</label>
                  <select
                    value={accessType}
                    onChange={(e) => setAccessType(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                  >
                    <option value="live_and_replay">Full Access (Live Classes + Replays)</option>
                    <option value="replay_only">Replay-Only (No Live Broadcasting)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Replay Release Delay</label>
                  <select
                    value={delayHours}
                    onChange={(e) => setDelayHours(e.target.value)}
                    className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                  >
                    <option value="0">Immediate Release (0 hours)</option>
                    <option value="12">12 Hours post-class</option>
                    <option value="24">24 Hours post-class</option>
                    <option value="48">48 Hours post-class</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Cohort Validity Expiry</label>
                  <Input
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <Button
                  onClick={handleSaveEntitlements}
                  className="w-full h-9 text-xs font-bold mt-2 shadow-xs"
                >
                  {isSaved ? "Saved ✓" : "Update Entitlement Rules"}
                </Button>
              </div>
            </Card>

            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-muted/20 space-y-2 text-xs">
              <p className="font-bold text-foreground">Cohort Metadata</p>
              <div className="space-y-1 text-muted-foreground">
                <p>Course: <strong>{batch.courseTitle}</strong></p>
                <p>Faculty Lead: <strong>{batch.teacherName}</strong></p>
                <p>Capacity: <strong>{batch.enrolledCount} / {batch.maxSeats} Seats</strong></p>
                <p>Status: <strong className="text-emerald-600 capitalize">{batch.status}</strong></p>
              </div>
            </Card>
          </div>

          {/* Student Roster (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Enrolled Student Roster
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live attendance percentage and learner progress tracking
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-8 font-semibold">
                  <Plus className="h-3 w-3 mr-1" /> Enroll Student
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto sleek-scrollbar">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3.5 pl-5">Student</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5 text-center">Live Attendance</th>
                      <th className="p-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {sampleRoster.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-foreground">{s.name}</td>
                        <td className="p-3.5 text-muted-foreground font-mono">{s.email}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {s.attendance}
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge variant="success" className="text-[10px] font-bold">
                            {s.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
