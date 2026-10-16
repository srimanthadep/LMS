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
  Sparkles,
  Flame,
  Trophy,
  Users,
  Medal,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const StudentCertificatesPage: React.FC = () => {
  const certs = mockDataService.getCertificates();
  const cert = certs[0];
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"certificates" | "badges" | "streaks" | "leaderboard">("certificates");


  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://verify.apex-lms.edu/verify/${cert.verificationCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgesList = [
    {
      title: "Agentic Architect",
      category: "Specialization",
      description: "Implemented multi-agent supervisor graphs with cyclic checkpoint recovery.",
      earnedDate: "08 Oct 2026",
      icon: "🤖",
    },
    {
      title: "RAG Retrieval Specialist",
      category: "Mastery",
      description: "Optimized hybrid dense-sparse vector recall with cross-encoder rerankers.",
      earnedDate: "15 Sep 2026",
      icon: "⚡",
    },
    {
      title: "18-Day Learning Streak",
      category: "Dedication",
      description: "Completed daily DPP labs and video lectures without interruption.",
      earnedDate: "Today",
      icon: "🔥",
    },
    {
      title: "100% Studio Attendance",
      category: "Participation",
      description: "Zero missed live broadcast sessions across entire Semester 6 cohort.",
      earnedDate: "01 Oct 2026",
      icon: "🎯",
    },
    {
      title: "Top 5% Cohort Performer",
      category: "Excellence",
      description: "Maintained cumulative GPA >= 3.9 across all timed milestone tests.",
      earnedDate: "11 Oct 2026",
      icon: "🏆",
    },
    {
      title: "Hackathon Finalist",
      category: "Innovation",
      description: "Ranked in top 3 at the Apex Autonomous Swarm Sprint.",
      earnedDate: "20 Sep 2026",
      icon: "🚀",
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Sneha Reddy", xp: 4850, gpa: 4.0, distinction: "Gold Fellow" },
    { rank: 2, name: "Arjun Mehta (You)", xp: 4720, gpa: 3.92, distinction: "High Honors" },
    { rank: 3, name: "Rohan Kulkarni", xp: 4610, gpa: 3.88, distinction: "Honors" },
    { rank: 4, name: "Kavita Rao", xp: 4490, gpa: 3.85, distinction: "Honors" },
    { rank: 5, name: "Devansh Nair", xp: 4380, gpa: 3.82, distinction: "Merit" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Award className="h-6 w-6 text-primary" /> Certificates, Achievements & Leaderboards
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cryptographically verifiable completion certificates, digital badges, learning streaks, and cohort rankings.
          </p>
        </div>

        {/* Category Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60 self-start sm:self-auto">
          <Button
            variant={activeTab === "certificates" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("certificates")}
            className={cn(
              "rounded-lg text-xs h-8 px-2 sm:px-3 font-medium transition-all duration-150 whitespace-nowrap justify-center w-full",
              activeTab === "certificates"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            Verified Certificates
          </Button>
          <Button
            variant={activeTab === "badges" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("badges")}
            className={cn(
              "rounded-lg text-xs h-8 px-2 sm:px-3 font-medium transition-all duration-150 whitespace-nowrap justify-center w-full",
              activeTab === "badges"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            Digital Badges ({badgesList.length})
          </Button>
          <Button
            variant={activeTab === "streaks" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("streaks")}
            className={cn(
              "rounded-lg text-xs h-8 px-2 sm:px-3 font-medium transition-all duration-150 whitespace-nowrap justify-center w-full",
              activeTab === "streaks"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            Streak Rewards
          </Button>
          <Button
            variant={activeTab === "leaderboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("leaderboard")}
            className={cn(
              "rounded-lg text-xs h-8 px-2 sm:px-3 font-medium transition-all duration-150 whitespace-nowrap justify-center w-full",
              activeTab === "leaderboard"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            Cohort Leaderboard
          </Button>
        </div>
      </div>

      {/* TAB 1: VERIFIED CERTIFICATES */}
      {activeTab === "certificates" && (
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
          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-2xl border-border/70 shadow-sm p-5 space-y-4 text-xs">
              <div className="border-b border-border/40 pb-3 flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Credential Details
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                  Active & Verified
                </Badge>
              </div>

              <div>
                <span className="text-muted-foreground">Credential ID</span>
                <p className="font-mono font-bold text-foreground mt-0.5">{cert.certificateNumber}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Verification Hash</span>
                <div className="flex items-center justify-between font-mono bg-muted/40 p-2.5 rounded-xl mt-1 text-[11px] border border-border/40">
                  <span className="truncate">{cert.verificationCode}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  onClick={() => alert("Downloading official high-resolution certificate PDF...")}
                  className="w-full gap-2 text-xs h-9 bg-primary text-primary-foreground font-bold rounded-xl"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download High-Res PDF
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="w-full gap-2 text-xs h-9 rounded-xl"
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
            </Card>

            <Card className="p-5 bg-primary/5 border-primary/20 space-y-3 rounded-2xl">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Share2 className="h-4 w-4" /> Share on Social Profiles
              </h4>
              <p className="text-xs text-muted-foreground">
                Add this verified credential directly to your LinkedIn Licenses & Certifications.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-9 rounded-xl gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                      cert.courseTitle
                    )}&organizationName=Apex+AI+Institute&issueYear=2026&certUrl=${encodeURIComponent(
                      `https://verify.apex-lms.edu/verify/${cert.verificationCode}`
                    )}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-3.5 w-3.5" /> Add to LinkedIn Profile
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL BADGES */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badgesList.map((badge, idx) => (
            <Card key={idx} className="rounded-2xl border-border/70 p-5 space-y-3 hover:border-primary/40 transition-all shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{badge.icon}</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {badge.category}
                </Badge>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-foreground">{badge.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{badge.description}</p>
              </div>
              <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Earned: {badge.earnedDate}</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Claimed
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: STREAK REWARDS */}
      {activeTab === "streaks" && (
        <Card className="rounded-2xl border-border/70 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-3xl shrink-0">
                🔥
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-foreground">18-Day Continuous Study Streak</h3>
                <p className="text-xs text-muted-foreground">You are in the top 3% of active cohort learners this month.</p>
              </div>
            </div>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs font-bold px-3 py-1">
              Active Streak Multiplier: 1.5x XP
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
              <span className="text-muted-foreground">Streak Bonus</span>
              <p className="text-lg font-extrabold text-foreground">+50 Cloud GPU Credits</p>
              <p className="text-[11px] text-muted-foreground">Automatically credited to your lab sandbox.</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
              <span className="text-muted-foreground">Next Milestone</span>
              <p className="text-lg font-extrabold text-primary">25 Days</p>
              <p className="text-[11px] text-muted-foreground">Unlocks 'Mastery Distinction' badge.</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
              <span className="text-muted-foreground">Freeze Tokens</span>
              <p className="text-lg font-extrabold text-foreground">2 Available</p>
              <p className="text-[11px] text-muted-foreground">Protects your streak during emergency days.</p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: COHORT LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" /> Cohort 7 Top Performers
            </span>
            <span className="text-xs text-muted-foreground">Updated weekly after evaluated milestone DPPs</span>
          </div>
          <div className="divide-y divide-border/40 text-xs">
            {leaderboard.map((student) => (
              <div
                key={student.rank}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  student.name.includes("You") ? "bg-primary/5 font-semibold" : "hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      student.rank === 1
                        ? "bg-amber-500 text-white shadow-sm"
                        : student.rank === 2
                        ? "bg-slate-300 dark:bg-slate-700 text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    #{student.rank}
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">{student.name}</h5>
                    <span className="text-[11px] text-muted-foreground">GPA: {student.gpa.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-primary">{student.xp} XP</span>
                  <Badge variant="outline" className="text-[10px]">
                    {student.distinction}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
