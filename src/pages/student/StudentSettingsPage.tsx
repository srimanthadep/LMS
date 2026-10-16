import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  Shield,
  KeyRound,
  Bell,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Lock,
  Moon,
  Sparkles,
  User,
  ArrowRight,
  Info,
  Clock,
  Volume2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";

export const StudentSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Password & Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notifications State
  const [notifLiveAlerts, setNotifLiveAlerts] = useState(true);
  const [notifDoubtReplies, setNotifDoubtReplies] = useState(true);
  const [notifDeadlineReminders, setNotifDeadlineReminders] = useState(true);
  const [notifEmailDigest, setNotifEmailDigest] = useState(false);

  // Accessibility & Preferences State
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST, UTC+5:30)");
  const [sessionTimeout, setSessionTimeout] = useState("4hours");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current active password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    addNotification({
      title: "Password Updated",
      message: "Your LMS portal credentials have been updated securely.",
      type: "system",
    });

    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      title: "Preferences Saved",
      message: "Your notification and accessibility settings have been applied to this session.",
      type: "system",
    });
  };

  // Password Strength Calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Not entered", color: "bg-muted" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-destructive" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Strong & Resilient", color: "bg-emerald-500" };
      default:
        return { score: 10, label: "Too short", color: "bg-destructive" };
    }
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Settings className="h-6 w-6 text-primary" /> Student Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your credentials, two-factor authentication, notification channels, and portal accessibility.
          </p>
        </div>

        <Link to="/student/profile">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs h-9">
            <User className="h-3.5 w-3.5 text-primary" /> View Student Profile
          </Button>
        </Link>
      </div>

      {/* Info Notice */}
      <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          Academic records, enrolled courses, and resume details are kept in your dedicated{" "}
          <Link to="/student/profile" className="text-primary font-semibold hover:underline">
            Student Profile
          </Link>
          . Account security and communication channels are configured below.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Password & Security */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" /> Password & Authentication
            </CardTitle>
            <CardDescription className="text-xs">
              Change your password to protect your LMS portal and live studio access
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {passwordError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> Password updated successfully!
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Current Password</label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-9 rounded-xl text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">New Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 h-9 rounded-xl text-xs"
                  />
                  {newPassword && (
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Strength: <span className="font-semibold">{strength.label}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Confirm New Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter new password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 h-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9"
                >
                  <Save className="h-3.5 w-3.5" /> Update Password
                </Button>
              </div>
            </form>

            {/* 2FA Toggle */}
            <div className="pt-4 border-t border-border/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-primary" /> Two-Factor Authentication (2FA)
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Protect account sign-ins using Authenticator App (TOTP) or SMS OTP codes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={twoFactorEnabled ? "default" : "secondary"}
                  className={`text-[10px] ${twoFactorEnabled ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : ""}`}
                >
                  {twoFactorEnabled ? "Active" : "Disabled"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    addNotification({
                      title: "2FA Status Changed",
                      message: `Two-factor authentication is now ${!twoFactorEnabled ? "Enabled" : "Disabled"}.`,
                      type: "system",
                    });
                  }}
                  className="rounded-xl text-xs h-8"
                >
                  {twoFactorEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Notification Preferences */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Notification Channels & Alerts
            </CardTitle>
            <CardDescription className="text-xs">
              Choose which LMS activities trigger in-app banners and urgent push notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5">
            <label className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-foreground">Live Class Broadcast & Studio Alerts</p>
                <p className="text-[11px] text-muted-foreground">
                  Receive instant notifications when a teacher opens a live interactive studio or webinar.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifLiveAlerts}
                onChange={(e) => setNotifLiveAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-foreground">Faculty & Mentor Doubt Replies</p>
                <p className="text-[11px] text-muted-foreground">
                  Get notified whenever an assigned mentor or teacher answers your question or doubt thread.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifDoubtReplies}
                onChange={(e) => setNotifDoubtReplies(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-foreground">Assignment & Test Deadline Reminders</p>
                <p className="text-[11px] text-muted-foreground">
                  24-hour and 2-hour warnings before timed assessment submissions lock.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifDeadlineReminders}
                onChange={(e) => setNotifDeadlineReminders(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <p className="text-xs font-bold text-foreground">Weekly Digest & Learning Progress Email</p>
                <p className="text-[11px] text-muted-foreground">
                  A Monday morning executive email summarizing your weekly study streak and cohort rank.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifEmailDigest}
                onChange={(e) => setNotifEmailDigest(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
            </label>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSavePreferences}
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9"
              >
                <Save className="h-3.5 w-3.5" /> Save Notification Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Regional & Accessibility Preferences */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Regional & Accessibility Settings
            </CardTitle>
            <CardDescription className="text-xs">
              Timezone formatting, motion reduction, and session duration
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Portal Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Asia/Kolkata (IST, UTC+5:30)">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="America/New_York (EST, UTC-5:00)">America/New_York (EST, UTC-5:00)</option>
                  <option value="Europe/London (GMT, UTC+0:00)">Europe/London (GMT, UTC+0:00)</option>
                  <option value="Asia/Singapore (SGT, UTC+8:00)">Asia/Singapore (SGT, UTC+8:00)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Inactivity Session Timeout</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="1hour">1 Hour of inactivity</option>
                  <option value="4hours">4 Hours of inactivity</option>
                  <option value="8hours">8 Hours (Full study day)</option>
                  <option value="never">Don't auto-logout</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                <div className="space-y-0.5 pr-4">
                  <p className="text-xs font-bold text-foreground">Reduced Motion UI</p>
                  <p className="text-[11px] text-muted-foreground">
                    Minimize UI transitions and bell shake animations for enhanced visual comfort.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => {
                    setReducedMotion(e.target.checked);
                    addNotification({
                      title: "Accessibility Updated",
                      message: `Reduced motion is now ${e.target.checked ? "Enabled" : "Disabled"}.`,
                      type: "system",
                    });
                  }}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                <div className="space-y-0.5 pr-4">
                  <p className="text-xs font-bold text-foreground">High Contrast Mode</p>
                  <p className="text-[11px] text-muted-foreground">
                    Increase card border visibility and text distinction for low-light environments.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => {
                    setHighContrast(e.target.checked);
                    addNotification({
                      title: "Accessibility Updated",
                      message: `High contrast is now ${e.target.checked ? "Enabled" : "Disabled"}.`,
                      type: "system",
                    });
                  }}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
