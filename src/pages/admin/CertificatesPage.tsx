import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, CheckCircle2, Download, Search, ShieldCheck } from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { CertificateRecord } from "@/types/lms";
import { useNotifications } from "@/context/NotificationContext";

export const CertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<CertificateRecord[]>(mockDataService.getCertificates());
  const { addNotification } = useNotifications();

  const handleIssueBatchCertificates = () => {
    addNotification({
      title: "Batch Certificates Issued",
      message: "Automated credentials dispatched for Cohort 7 graduates with distinction badges.",
      type: "grade",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" /> Certificate Configuration & Verification Log
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Cryptographically verifiable course completion credentials and graduation honors.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleIssueBatchCertificates}
            className="text-xs h-9 font-bold gap-1 shadow-sm shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Issue Batch Credentials
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c) => (
            <Card key={c.id} className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <Badge variant="success" className="text-[10px] font-bold">
                  Verified ✓
                </Badge>
              </div>

              <div>
                <p className="text-[11px] font-mono text-muted-foreground">{c.certificateNumber}</p>
                <h3 className="font-bold text-base text-foreground mt-0.5">{c.studentName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.courseTitle}</p>
                <p className="text-[11px] text-primary font-bold mt-1">{c.gradeAwarded}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs flex justify-between items-center font-mono">
                <span className="text-[10px] text-muted-foreground">Verification Code:</span>
                <span className="font-bold text-foreground">{c.verificationCode}</span>
              </div>

              <div className="flex gap-2 pt-1 border-t border-border/60">
                <Button size="sm" variant="outline" className="w-full text-xs h-8 gap-1 font-semibold">
                  <Download className="h-3 w-3" /> Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
