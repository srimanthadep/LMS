import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Archive, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export const DataRetentionPage: React.FC = () => {
  const [retentionDays, setRetentionDays] = useState("180");
  const [archiveOption, setArchiveOption] = useState("glacier");
  const { addNotification } = useNotifications();

  const handleSavePolicy = () => {
    addNotification({
      title: "Data Retention Policy Updated",
      message: `Recordings older than ${retentionDays} days will automatically move to ${archiveOption.toUpperCase()} storage.`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-primary" /> Data Retention, Purge & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure automated archival windows for HD lecture recordings, student submission data purge schedules, and GDPR/DPDP export requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Policy Card */}
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Archive className="h-4 w-4 text-primary" />
              Automated Lecture Archival Rule
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a lecture batch concludes, recordings and raw WebM assets are retained in hot SSD storage before transitioning to compressed archival cold storage.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Hot Storage Retention Period:
                </label>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  <option value="90">90 Days post-batch completion</option>
                  <option value="180">180 Days (Recommended for technical cohorts)</option>
                  <option value="365">1 Year (365 Days)</option>
                  <option value="indefinite">Indefinite Retention (Highest storage cost)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Cold Archival Target:
                </label>
                <select
                  value={archiveOption}
                  onChange={(e) => setArchiveOption(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  <option value="glacier">AWS S3 Glacier Instant Retrieval</option>
                  <option value="gcs-cold">Google Cloud Storage Coldline</option>
                  <option value="local">Encrypted On-Premise NAS Server</option>
                </select>
              </div>

              <Button onClick={handleSavePolicy} className="w-full h-9 text-xs font-bold mt-2 shadow-xs">
                Save Archival Schedule
              </Button>
            </div>
          </Card>

          {/* Student Privacy & Right to be Forgotten (DPDP India) */}
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              Student Data Deletion & DPDP Compliance
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Indian Digital Personal Data Protection (DPDP) Act workflows for student erasure requests, grade archiving, and auditable data purges.
            </p>

            <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Active Erasure Requests</span>
                <Badge variant="outline" className="text-[10px]">0 Pending</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                All previous cohort data purge tickets have been verified and sealed.
              </p>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="w-full h-9 text-xs font-bold border-amber-500/30 hover:bg-amber-500/10">
                Trigger Verification Audit Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
  );
};
