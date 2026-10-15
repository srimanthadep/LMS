import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  LogOut,
  Mail,
  Phone,
  Building,
  QrCode,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AdminProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  // Profile Form State
  const [name, setName] = useState(user?.name || "Priya Sharma");
  const [email, setEmail] = useState(user?.email || "admin@apex.ai");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [department, setDepartment] = useState("Academic Operations");
  const [roleTitle, setRoleTitle] = useState("Senior Academic Administrator");
  const [bio, setBio] = useState("Managing AI/ML cohort scheduling, live broadcasts, and student enrollment integrity.");
  const [isSaved, setIsSaved] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    liveClassStarting: true,
    studentEscalation: true,
    paymentFailure: true,
    batchCapacityAlert: true,
    dailyAttendanceDigest: false,
    contentProcessingFailed: true,
    whatsappAlerts: true,
  });

  // Active Sessions Mock
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "MacBook Pro 16” — Chrome",
      location: "Bengaluru, India",
      ip: "103.212.144.12",
      current: true,
      lastActive: "Active Now",
    },
    {
      id: "sess-2",
      device: "iPhone 15 Pro — Safari Mobile",
      location: "Bengaluru, India",
      ip: "103.212.144.15",
      current: false,
      lastActive: "2 hours ago",
    },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setSecuritySaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSecuritySaved(false), 3000);
    }
  };

  const terminateSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-primary" /> Profile & Operational Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your administrative identity, two-factor authentication credentials, and operational alert delivery channels.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/70 gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" /> My Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="h-4 w-4" /> Account Security & 2FA
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="h-4 w-4" /> Operational Notifications
        </button>
      </div>

      {/* TAB 1: Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-xl font-bold">
                  {name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                      Operations Admin
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">STAFF-ID: 8092</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-9 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Official Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-9 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Phone Number</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Department</label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Role Title</label>
                <Input
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Administrative Responsibilities</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
                />
              </div>

              {isSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Profile information updated successfully.
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" className="h-9 text-xs font-bold gap-1.5 px-5">
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* TAB 2: Security & 2FA */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Two-Factor Authentication Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Two-Factor Authentication (2FA)
                </div>
                <Badge
                  variant={twoFactorEnabled ? "success" : "warning"}
                  className="text-[10px] uppercase font-bold"
                >
                  {twoFactorEnabled ? "Mandatory Enabled" : "Not Configured"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground">
                In compliance with institution security policies, all administrative accounts require hardware-backed or Time-based One-Time Password (TOTP) 2FA before executing grade overrides or batch transfers.
              </p>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">Google Authenticator / 1Password</div>
                    <div className="text-[11px] text-muted-foreground">Configured on October 01, 2026 at 09:15 AM</div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="text-xs h-8 font-bold gap-1"
                >
                  <QrCode className="h-3.5 w-3.5" /> {showQrModal ? "Hide QR Key" : "Re-enroll Device"}
                </Button>
              </div>

              {showQrModal && (
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                  <div className="text-xs font-bold text-foreground">Scan with your Authenticator App:</div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-white rounded-lg border shadow-xs">
                      {/* Simulated QR Code */}
                      <div className="w-28 h-28 bg-gray-900 flex items-center justify-center text-white text-[10px] font-mono text-center p-2 rounded">
                        [APEX-2FA-TOTP-SECRET-QR]
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="text-muted-foreground">Secret Key:</div>
                      <div className="font-mono font-bold text-foreground bg-muted p-1.5 rounded select-all">
                        HX72-99AB-KL44-MM90
                      </div>
                      <p className="text-[11px] text-muted-foreground pt-1">
                        Enter the 6-digit TOTP code generated on your authenticator app to complete verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold text-foreground">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 h-9 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 h-9 text-xs"
                    placeholder="Min 12 chars, upper, lower, symbol"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 h-9 text-xs"
                    required
                  />
                </div>

                {securitySaved && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Password updated successfully.
                  </div>
                )}

                <Button type="submit" size="sm" className="h-9 text-xs font-bold gap-1.5 px-4">
                  <Lock className="h-3.5 w-3.5" /> Update Credentials
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-primary" /> Active Login Sessions
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {sessions.length} Authorized Devices
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl border border-border/70 bg-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-bold text-xs text-foreground flex items-center gap-2">
                        {sess.device}
                        {sess.current && (
                          <Badge variant="success" className="text-[9px] py-0 px-1">
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {sess.location} • <span className="font-mono">{sess.ip}</span> • {sess.lastActive}
                      </div>
                    </div>
                  </div>

                  {!sess.current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => terminateSession(sess.id)}
                      className="text-xs h-7 text-rose-600 hover:bg-rose-50 border-rose-200"
                    >
                      <LogOut className="h-3 w-3 mr-1" /> Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Operational Notifications */}
      {activeTab === "notifications" && (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Operational Alert Triggers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-xs text-muted-foreground">
              Select which live class events, cohort capacity thresholds, and payment reconciliation issues notify your administrative dashboard and connected channels.
            </p>

            <div className="space-y-3 divide-y divide-border/60">
              {[
                {
                  id: "liveClassStarting" as const,
                  title: "Live Class Broadcast Starting (15 min prior)",
                  desc: "Notification when virtual studio or Zoom room initiates pre-flight connection.",
                },
                {
                  id: "studentEscalation" as const,
                  title: "Student Support & Access Escalations",
                  desc: "Urgent tickets filed regarding recording playback errors or meeting access locks.",
                },
                {
                  id: "paymentFailure" as const,
                  title: "Razorpay Failed Checkout Webhook",
                  desc: "Alerts when student payment fails at checkout to trigger recovery assistance.",
                },
                {
                  id: "batchCapacityAlert" as const,
                  title: "Batch Capacity Threshold (>= 90% full)",
                  desc: "Notify when batch fills up to prompt opening next cohort schedule.",
                },
                {
                  id: "contentProcessingFailed" as const,
                  title: "AI Video Transcription / Chapter Failures",
                  desc: "Instant ping if automated Whisper/LLM pipeline throws worker timeout errors.",
                },
                {
                  id: "dailyAttendanceDigest" as const,
                  title: "Daily Attendance & Attendance Shortfall Digest",
                  desc: "Morning summary report sent at 08:00 AM for all scheduled classes.",
                },
                {
                  id: "whatsappAlerts" as const,
                  title: "High-Priority WhatsApp Admin Bridge",
                  desc: "Mirror critical live class broadcasting outages to verified admin mobile.",
                },
              ].map((item) => (
                <div key={item.id} className="pt-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-xs text-foreground">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.id]}
                    onChange={(e) =>
                      setNotifications((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-border/60">
              <Button size="sm" className="h-8 text-xs font-bold gap-1 px-4">
                <Check className="h-3.5 w-3.5" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
