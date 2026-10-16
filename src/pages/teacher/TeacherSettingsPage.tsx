import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Shield,
  Bell,
  BookOpen,
  KeyRound,
  CheckCircle2,
  Smartphone,
  LogOut,
  Mail,
  Layers,
  Lock,
  AlertTriangle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { teacherDataService, TeacherProfileSettings } from "./teacherDataService";

export const TeacherSettingsPage: React.FC = () => {
  const { role } = useAuth();
  const { addNotification } = useNotifications();

  const [profile, setProfile] = useState<TeacherProfileSettings>(() =>
    teacherDataService.getProfile()
  );

  // Profile Form State
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [officeHours, setOfficeHours] = useState(profile.officeHours);
  const [bio, setBio] = useState(profile.bio);

  // Password State & Validation
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notification Toggles
  const [notifyDoubts, setNotifyDoubts] = useState(profile.notifyDoubts);
  const [notifySubmissions, setNotifySubmissions] = useState(profile.notifySubmissions);
  const [notifyLiveReminder, setNotifyLiveReminder] = useState(profile.notifyLiveReminder);
  const [notifySmsAlerts, setNotifySmsAlerts] = useState(profile.notifySmsAlerts);

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "workload">("profile");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const updated: TeacherProfileSettings = {
      ...profile,
      name,
      title,
      email,
      phone,
      officeHours,
      bio,
      role: "teacher", // Guaranteed immutable
    };

    teacherDataService.saveProfile(updated);
    setProfile(updated);

    addNotification({
      title: "Profile Saved",
      message: "Personal details, office hours, and faculty bio updated.",
      type: "system",
    });
  };

  const handleSaveNotifications = () => {
    const updated: TeacherProfileSettings = {
      ...profile,
      notifyDoubts,
      notifySubmissions,
      notifyLiveReminder,
      notifySmsAlerts,
    };
    teacherDataService.saveProfile(updated);
    setProfile(updated);

    addNotification({
      title: "Notification Preferences Saved",
      message: "Alert thresholds and dispatch channels updated.",
      type: "system",
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    addNotification({
      title: "Password Updated (Simulated)",
      message: "Faculty credentials simulated as updated for this local demo. Production authentication backend is not connected.",
      type: "system",
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Profile & Faculty Settings
            <Badge variant="accent" className="text-[10px] font-bold">
              Faculty Desk
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your faculty bio, contact details, security credentials, alert thresholds, and teaching commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-xs px-3 py-1">
            Role: Lead Faculty (Teacher)
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "profile"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <User className="h-4 w-4" />
          Faculty Profile & Bio
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Shield className="h-4 w-4" />
          Security & Access Governance
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "notifications"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Bell className="h-4 w-4" />
          Notification Preferences
        </button>

        <button
          onClick={() => setActiveTab("workload")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "workload"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Teaching Responsibilities
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-300 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-extrabold text-2xl shadow-xs shrink-0">
              RV
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-[10px]">
                  Verified Lead Faculty
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {profile.organization}
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Official Faculty Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Office Hours & Mentorship Slot</label>
              <Input
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Tue & Thu: 04:00 PM – 06:00 PM IST"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Faculty Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-white/10">
              <Button type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Security & Permissions Guard */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Permission Card */}
          <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Privileges</h3>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101713] border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Current Assigned Role:</span>
                <span className="ml-2 font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase">TEACHER (FACULTY)</span>
              </div>
              <Badge variant="outline" className="text-[10px] text-slate-500 font-mono">
                <Lock className="h-2.5 w-2.5 mr-1" /> Verified
              </Badge>
            </div>
          </Card>

          {/* Change Password Card */}
          <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-emerald-600" />
              Change Faculty Account Password
            </h3>

            {passwordError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                <Input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password (Min 8 chars)</label>
                <Input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="At least 8 characters..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="Re-enter new password..."
                />
              </div>

              <Button type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Update Password
              </Button>
            </form>
          </Card>

          {/* Active Sessions */}
          <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  Active Devices & Broadcast Nodes
                </h3>
                <p className="text-xs text-slate-500">Manage authenticated sessions and studio broadcaster workstations.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addNotification({
                    title: "Sessions Revoked",
                    message: "All other sessions except this current device have been logged out.",
                    type: "system",
                  })
                }
                className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Revoke All Other Sessions
              </Button>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    MAC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Chrome on macOS (San Francisco, US)</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Current Active Broadcast Session</p>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">Active Now</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    IOS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Safari on iPhone 15 Pro</p>
                    <p className="text-[11px] text-slate-400">Last active 3 hours ago</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Mobile App</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === "notifications" && (
        <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Faculty Alert Thresholds & Channels</h3>
              <p className="text-xs text-slate-500">Configure how and when you receive automated platform triggers.</p>
            </div>
            <Button size="sm" onClick={handleSaveNotifications} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Preferences
            </Button>
          </div>

          <div className="space-y-3 pt-2 divide-y divide-slate-100 dark:divide-white/5">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Unanswered Student Doubts</p>
                <p className="text-[11px] text-slate-500">Notify when student submits query with video timestamp</p>
              </div>
              <input
                type="checkbox"
                checked={notifyDoubts}
                onChange={(e) => setNotifyDoubts(e.target.checked)}
                className="rounded text-emerald-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">New Assignment Submissions</p>
                <p className="text-[11px] text-slate-500">Trigger email alert when cohort students submit lab capstones</p>
              </div>
              <input
                type="checkbox"
                checked={notifySubmissions}
                onChange={(e) => setNotifySubmissions(e.target.checked)}
                className="rounded text-emerald-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Live Studio 15-Minute Countdown Reminder</p>
                <p className="text-[11px] text-slate-500">Receive SMS and calendar alert 15 minutes before broadcast</p>
              </div>
              <input
                type="checkbox"
                checked={notifyLiveReminder}
                onChange={(e) => setNotifyLiveReminder(e.target.checked)}
                className="rounded text-emerald-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">SMS Alerts for Student Confusion Spikes</p>
                <p className="text-[11px] text-slate-500">Send alert if &gt;5 students click "I'm Lost" within 5 minutes</p>
              </div>
              <input
                type="checkbox"
                checked={notifySmsAlerts}
                onChange={(e) => setNotifySmsAlerts(e.target.checked)}
                className="rounded text-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Teaching Workload */}
      {activeTab === "workload" && (
        <Card className="p-6 border-slate-200 dark:border-white/10 bg-white dark:bg-[#151f1a] space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Teaching Scope & Academic Load</h3>
          <p className="text-xs text-slate-500">Summary of assigned academic courses, teaching credits, and student counts.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713]">
              <span className="text-xs font-medium text-slate-500">Total Teaching Hours</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">140 Live Hours</p>
              <p className="text-[11px] text-emerald-600 font-medium">84h completed this term</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713]">
              <span className="text-xs font-medium text-slate-500">Active Enrolled Learners</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">160 Students</p>
              <p className="text-[11px] text-blue-600 font-medium">Cohort 7 & Cohort 4</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101713]">
              <span className="text-xs font-medium text-slate-500">Evaluation SLA Rate</span>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">98.2%</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Avg grading time: 14.2h</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherSettingsPage;
