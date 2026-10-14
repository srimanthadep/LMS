import React, { useState } from "react";
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const StudentCertificatesPage: React.FC = () => {
  const certs = mockDataService.getCertificates();
  const cert = certs[0];
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://verify.apex-lms.edu/verify/${cert.verificationCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Certificates & Credentials
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cryptographically verifiable certificates of completion and cohort distinction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Certificate Visual Card (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl border-4 border-double border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-8 sm:p-12 shadow-lg overflow-hidden text-center space-y-6">
            {/* Background watermark badge */}
            <Award className="absolute -right-8 -bottom-8 h-64 w-64 text-primary/5 pointer-events-none" />

            <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Verified Certificate of Specialization
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                This is proudly presented to
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-2 font-serif">
                {cert.studentName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              for successfully completing all advanced curriculum milestones, live synchronous capstone projects, and continuous evaluations in
            </p>

            <h3 className="text-lg sm:text-2xl font-bold text-primary max-w-xl mx-auto">
              {cert.courseTitle}
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-foreground/80 pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> Issued on {cert.issueDate}
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Grade: {cert.gradeAwarded}
              </span>
            </div>

            {/* Signature & Seal row */}
            <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
              <div className="text-center sm:text-left">
                <div className="font-serif italic text-base text-foreground font-semibold">
                  Prof. Rajesh Verma
                </div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Lead Instructor & AI Chair
                </div>
              </div>

              {/* Ornate Gold/Primary Seal */}
              <div className="h-16 w-16 rounded-full border-2 border-primary/50 bg-primary/10 flex flex-col items-center justify-center text-[9px] font-bold text-primary uppercase text-center shadow-xs">
                <span>APEX</span>
                <span>VERIFIED</span>
                <span>2026</span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-serif italic text-base text-foreground font-semibold">
                  Dr. Vikram Sethi
                </div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  Academic Director
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification & Actions Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="p-5 border-b border-border">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Credential Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-muted-foreground">Credential ID</span>
                <p className="font-mono font-bold text-foreground mt-0.5">{cert.certificateNumber}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Verification Hash</span>
                <div className="flex items-center justify-between font-mono bg-muted p-2 rounded-lg mt-1 text-[11px]">
                  <span>{cert.verificationCode}</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button className="w-full gap-2 text-xs bg-primary text-primary-foreground">
                  <Download className="h-3.5 w-3.5" />
                  Download High-Res PDF
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="w-full gap-2 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Verification URL Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Verification Link
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="p-5 bg-primary/5 border-primary/20 space-y-3">
            <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Share2 className="h-4 w-4" /> Share on Social Profiles
            </h4>
            <p className="text-xs text-muted-foreground">
              Add this certified credential to your LinkedIn Licenses & Certifications with 1 click.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={() => window.open("https://linkedin.com", "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Add to LinkedIn Profile
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
