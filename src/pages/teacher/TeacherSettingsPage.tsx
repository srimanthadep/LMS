import React, { useState } from "react";
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
  Camera,
  Layers,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export const TeacherSettingsPage: React.FC = () => {
  const { addNotification } = useNotifications();

  // Profile Form State
  const [name, setName] = useState("Prof. Rajesh Verma");
  const [title, setTitle] = useState("Lead AI Systems Faculty & Principal Researcher");
  const [email, setEmail] = useState("rajesh.verma@edulms.ai");
  const [phone, setPhone] = useState("+91 98450 12345");
  const [officeHours, setOfficeHours] = useState("Mon & Thu: 04:00 PM – 06:00 PM IST");
  const [bio, setBio] = useState(
    "15+ years in distributed systems, neural networks, and large language model architectures. Ex-Principal Architect at DeepScale AI."
  );

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Notification Toggles
  const [notifyDoubts, setNotifyDoubts] = useState(true);
  const [notifySubmissions, setNotifySubmissions] = useState(true);
  const [notifyLiveReminder, setNotifyLiveReminder] = useState(true);
  const [notifySmsAlerts, setNotifySmsAlerts] = useState(false);

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "workload">("profile");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      title: "Profile Updated",
      message: "Personal details and office hours saved successfully.",
      type: "system",
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    addNotification({
      title: "Password Changed",
      message: "Security credentials updated. All active sessions re-authenticated.",
      type: "system",
    });
    setCurrentPassword("");
    setNewPassword("");
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
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "profile" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="h-4 w-4" />
          Faculty Profile & Bio
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "security" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Shield className="h-4 w-4" />
          Security & Active Sessions
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "notifications" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bell className="h-4 w-4" />
          Notification Preferences
        </button>

        <button
          onClick={() => setActiveTab("workload")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === "workload" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Teaching Responsibilities
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === "profile" && (
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-800 font-extrabold text-2xl shadow-xs">
                RV
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{name}</h3>
              <p className="text-xs text-slate-500">{title}</p>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] mt-1">
                Verified Lead Faculty
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Academic Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Faculty Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Office Hours & Mentorship Slot</label>
              <Input
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Tue & Thu: 04:00 PM – 06:00 PM IST"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Faculty Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 text-xs rounded-md border border-slate-200 bg-white"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Security & Sessions */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-emerald-600" />
              Change Faculty Account Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Current Password</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-9 text-xs font-mono"
                  placeholder="At least 8 characters..."
                />
              </div>

              <Button type="submit" size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Update Password
              </Button>
            </form>
          </Card>

          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  Active Devices & Broadcast Nodes
                </h3>
                <p className="text-xs text-slate-500">Manage signed-in web sessions and studio broadcaster nodes.</p>
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
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    MAC
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Chrome on macOS (San Francisco, US)</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Current Active Broadcast Session</p>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">Active Now</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    IOS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Safari on iPhone 15 Pro</p>
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
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Faculty Alert Thresholds & Channels</h3>
          <p className="text-xs text-slate-500">Configure how and when you receive automated platform triggers.</p>

          <div className="space-y-3 pt-2 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800">Unanswered Student Doubts</p>
                <p className="text-[11px] text-slate-500">Notify when student submits query with video timestamp</p>
              </div>
              <input
                type="checkbox"
                checked={notifyDoubts}
                onChange={(e) => setNotifyDoubts(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800">New Assignment Submissions</p>
                <p className="text-[11px] text-slate-500">Trigger email alert when cohort students submit lab capstones</p>
              </div>
              <input
                type="checkbox"
                checked={notifySubmissions}
                onChange={(e) => setNotifySubmissions(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800">Live Studio 15-Minute Countdown Reminder</p>
                <p className="text-[11px] text-slate-500">Receive SMS and calendar alert 15 minutes before broadcast</p>
              </div>
              <input
                type="checkbox"
                checked={notifyLiveReminder}
                onChange={(e) => setNotifyLiveReminder(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-bold text-slate-800">SMS Alerts for Student Confusion Spikes</p>
                <p className="text-[11px] text-slate-500">Send alert if &gt;5 students click "I'm Lost" within 5 minutes</p>
              </div>
              <input
                type="checkbox"
                checked={notifySmsAlerts}
                onChange={(e) => setNotifySmsAlerts(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Teaching Workload */}
      {activeTab === "workload" && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Teaching Scope & Academic Load</h3>
          <p className="text-xs text-slate-500">Summary of assigned academic courses, teaching credits, and student counts.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">Total Teaching Hours</span>
              <p className="text-xl font-bold text-slate-900 mt-1">140 Live Hours</p>
              <p className="text-[11px] text-emerald-600 font-medium">84h completed this term</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">Active Enrolled Learners</span>
              <p className="text-xl font-bold text-slate-900 mt-1">160 Students</p>
              <p className="text-[11px] text-blue-600 font-medium">Cohort 7 & Cohort 4</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">Evaluation SLA Rate</span>
              <p className="text-xl font-bold text-emerald-700 mt-1">98.2%</p>
              <p className="text-[11px] text-emerald-700 font-medium">Avg grading time: 14.2h</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherSettingsPage;
