import React, { useState } from "react";
import {
  User,
  Shield,
  Key,
  Bell,
  Smartphone,
  Laptop,
  Trash2,
  CheckCircle2,
  Award,
  Layers,
  BookOpen,
  LogOut,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const EvaluatorSettingsPage: React.FC = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user.name || "Kavita Rao");
  const [email] = useState(user.email || "kavita.eval@edulms.ai");
  const [institution, setInstitution] = useState("Apex AI Institute");
  const [bio, setBio] = useState(
    "Senior AI Systems Evaluator specializing in retrieval-augmented generation (RAG), vector databases, and multi-agent systems orchestration."
  );

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState([
    { id: "s1", device: "Chrome on macOS (Apple Silicon)", ip: "103.21.244.18", location: "Bengaluru, India", current: true, time: "Active now" },
    { id: "s2", device: "Safari on iPhone 15 Pro", ip: "103.21.244.22", location: "Bengaluru, India", current: false, time: "3 hours ago" },
    { id: "s3", device: "Firefox on Ubuntu Workstation", ip: "49.207.198.12", location: "Hyderabad, India", current: false, time: "2 days ago" },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState({
    newSubmissionsEmail: true,
    newSubmissionsInApp: true,
    slaWarningsEmail: true,
    slaWarningsSms: true,
    reassessmentAlertsEmail: true,
    reassessmentAlertsInApp: true,
    weeklyDigest: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;
    setPasswordNotice(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordNotice(false), 2500);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const domainTags = ["RAG Architecture", "Cohere Rerank", "LangGraph Swarms", "LoRA Fine-Tuning", "Triton K8s MLOps"];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Evaluator Profile & Account Settings
          </h1>
          <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
            Faculty ID: usr-eval-1
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage evaluator credentials, active broadcast sessions, notification dispatch rules, and authorized grading scopes.
        </p>
      </div>

      {/* Profile & Bio Section */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-600" />
              Evaluator Information
            </CardTitle>
            <CardDescription className="text-xs">
              Public profile displayed on official evaluation audits and grade sheets.
            </CardDescription>
          </div>
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Profile Updated
            </span>
          )}
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Institutional Email</label>
                <Input
                  value={email}
                  disabled
                  className="h-9 text-xs bg-zinc-50 dark:bg-zinc-800 text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Academic Institution</label>
                <Input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Role Title</label>
                <Input
                  value="Certified AI Lead Evaluator"
                  disabled
                  className="h-9 text-xs bg-zinc-50 dark:bg-zinc-800 text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Professional Bio & Credentials</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* Specialization Tags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Domain Competencies & Tagged Rubrics</label>
              <div className="flex flex-wrap gap-1.5">
                {domainTags.map((t, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Authorized Assessment Responsibilities & Scopes */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            Authorized Assessment Responsibilities & Quotas
          </CardTitle>
          <CardDescription className="text-xs">
            Course modules and certification milestones authorized under your evaluation charter.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-1">
              <span className="font-bold text-foreground">Authorized Courses:</span>
              <p className="text-muted-foreground text-[11px]">
                • Full-Stack AI & LLM Systems Engineering<br />
                • Autonomous Multi-Agent Architectures<br />
                • Diffusion Models & Generative Vision<br />
                • Production MLOps & Vector Infrastructure
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-1">
              <span className="font-bold text-foreground">Evaluation Governance Limits:</span>
              <p className="text-muted-foreground text-[11px]">
                • Max Daily Grading Cap: <strong>25 Submissions / day</strong><br />
                • Reassessment Moderation Authority: <strong>Level 2 Lead</strong><br />
                • Grade Release Permissions: <strong>Authorized</strong><br />
                • Blind Review Verification: <strong>Mandatory</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-600" />
              Password & Authentication Security
            </CardTitle>
            <CardDescription className="text-xs">
              Manage your institutional single sign-on and portal credentials.
            </CardDescription>
          </div>
          {passwordNotice && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Password Changed
            </span>
          )}
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Current Password</label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">New Password</label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={!newPassword || newPassword !== confirmPassword}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Dispatch Preferences */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-600" />
            Notification Rules & SLA Alerts
          </CardTitle>
          <CardDescription className="text-xs">
            Configure how you receive grading queue dispatches and approaching SLA window warnings.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 text-xs">
            <div>
              <span className="font-semibold text-foreground block">New Submissions Assigned</span>
              <span className="text-[11px] text-muted-foreground">Receive alerts when new candidate repos enter your queue</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.newSubmissionsEmail}
              onChange={(e) => setNotifications({ ...notifications, newSubmissionsEmail: e.target.checked })}
              className="h-4 w-4 rounded accent-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 text-xs">
            <div>
              <span className="font-semibold text-foreground block">Approaching SLA Warnings (&lt;6 hours)</span>
              <span className="text-[11px] text-muted-foreground">Urgent reminder before a submission breaches the 24h turnaround target</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.slaWarningsEmail}
              onChange={(e) => setNotifications({ ...notifications, slaWarningsEmail: e.target.checked })}
              className="h-4 w-4 rounded accent-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 text-xs">
            <div>
              <span className="font-semibold text-foreground block">Reassessment & Regrading Requests</span>
              <span className="text-[11px] text-muted-foreground">Immediate notification when a student submits an official rubric contestation</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.reassessmentAlertsInApp}
              onChange={(e) => setNotifications({ ...notifications, reassessmentAlertsInApp: e.target.checked })}
              className="h-4 w-4 rounded accent-emerald-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Device Sessions */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="p-5 border-b border-zinc-200/70 dark:border-zinc-800">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Laptop className="h-4 w-4 text-emerald-600" />
            Active Login Sessions
          </CardTitle>
          <CardDescription className="text-xs">
            Devices currently authorized to access the evaluation workstation.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-zinc-200/70 dark:divide-zinc-800">
          {sessions.map((s) => (
            <div key={s.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{s.device}</span>
                  {s.current && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                      Current Device
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  IP: {s.ip} • {s.location} • {s.time}
                </p>
              </div>

              {!s.current && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRevokeSession(s.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
