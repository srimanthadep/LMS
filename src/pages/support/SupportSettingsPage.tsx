import React, { useState } from "react";
import {
  Settings,
  Bell,
  Clock,
  Shield,
  MessageSquare,
  Sparkles,
  Save,
  CheckCircle2,
  Sliders,
  Webhook,
  Mail,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const SupportSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [deskName, setDeskName] = useState("Tier-1 Mentor & Support Desk");
  const [autoAssignMode, setAutoAssignMode] = useState("load_balanced");
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [operatingHours, setOperatingHours] = useState("08:00 AM - 11:00 PM (IST)");
  
  // SLA thresholds
  const [p1Sla, setP1Sla] = useState("30");
  const [p2Sla, setP2Sla] = useState("120");
  const [p3Sla, setP3Sla] = useState("360");
  const [p4Sla, setP4Sla] = useState("1440");

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T00/B00/X00EXAMPLE");
  const [browserPush, setBrowserPush] = useState(true);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 support-page-font">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Support Desk Operational Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure routing algorithms, SLA thresholds, automated macros, and webhook alerting channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" /> Changes saved successfully!
            </span>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs font-semibold gap-1.5 bg-primary text-primary-foreground shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="general" className="text-xs">
            Desk Preferences
          </TabsTrigger>
          <TabsTrigger value="sla" className="text-xs">
            SLA Targets
          </TabsTrigger>
          <TabsTrigger value="routing" className="text-xs">
            Auto-Routing
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs">
            Alert Webhooks
          </TabsTrigger>
        </TabsList>

        {/* General Desk Preferences */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader className="p-5 border-b border-border/70">
              <CardTitle className="text-sm font-bold text-foreground">
                Support Workstation & Coverage Hours
              </CardTitle>
              <CardDescription className="text-xs">
                Operating windows displayed to learners when submitting doubt inquiries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Desk Display Name</label>
                  <Input
                    value={deskName}
                    onChange={(e) => setDeskName(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground">Visible on public ticket receipts.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Operational Hours</label>
                  <Input
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground">Outside this window, an automated out-of-office response is dispatched.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">Enable Live Chat Channel</h4>
                  <p className="text-[11px] text-muted-foreground">Allow students to start synchronous real-time chat sessions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLiveChatEnabled(!liveChatEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    liveChatEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      liveChatEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Targets */}
        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader className="p-5 border-b border-border/70">
              <CardTitle className="text-sm font-bold text-foreground">
                Service Level Agreement (SLA) Time Thresholds
              </CardTitle>
              <CardDescription className="text-xs">
                Resolution deadlines in minutes before automated escalation to Academic Admin or Super Admin.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-red-600 dark:text-red-400">P1 Urgent Threshold (Mins)</span>
                    <Badge variant="destructive" className="text-[10px]">Critical</Badge>
                  </div>
                  <Input
                    type="number"
                    value={p1Sla}
                    onChange={(e) => setP1Sla(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Live stream interruption & billing duplication.</p>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-600 dark:text-amber-400">P2 High Threshold (Mins)</span>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">High</Badge>
                  </div>
                  <Input
                    type="number"
                    value={p2Sla}
                    onChange={(e) => setP2Sla(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Validity extensions & 2FA device lockouts.</p>
                </div>

                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600 dark:text-blue-400">P3 Medium Threshold (Mins)</span>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">Medium</Badge>
                  </div>
                  <Input
                    type="number"
                    value={p3Sla}
                    onChange={(e) => setP3Sla(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Batch moves & timetable clashes.</p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">P4 Low Threshold (Mins)</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Low</Badge>
                  </div>
                  <Input
                    type="number"
                    value={p4Sla}
                    onChange={(e) => setP4Sla(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">General inquiries & certificate requests.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Routing */}
        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader className="p-5 border-b border-border/70">
              <CardTitle className="text-sm font-bold text-foreground">
                Intelligent Ticket Dispatch Engine
              </CardTitle>
              <CardDescription className="text-xs">
                Select how new inbound student queries are assigned to active agents.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-3">
                {[
                  {
                    id: "load_balanced",
                    title: "Dynamic Load-Balanced (Recommended)",
                    desc: "Assigns to the available agent with the lowest open ticket count.",
                  },
                  {
                    id: "round_robin",
                    title: "Sequential Round-Robin",
                    desc: "Rotates evenly across all online agents regardless of open tickets.",
                  },
                  {
                    id: "skill_based",
                    title: "Specialty & Course-Based Routing",
                    desc: "Directs LLM questions to technical mentors and billing to tier-1 desk.",
                  },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      autoAssignMode === mode.id
                        ? "border-primary bg-primary/5"
                        : "border-border/70 hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="autoAssign"
                      value={mode.id}
                      checked={autoAssignMode === mode.id}
                      onChange={() => setAutoAssignMode(mode.id)}
                      className="mt-1"
                    />
                    <div>
                      <h4 className="font-bold text-foreground">{mode.title}</h4>
                      <p className="text-[11px] text-muted-foreground">{mode.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Webhooks */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader className="p-5 border-b border-border/70">
              <CardTitle className="text-sm font-bold text-foreground">
                Alert Channels & Webhook Integrations
              </CardTitle>
              <CardDescription className="text-xs">
                Notify mentor leads and support staff when tickets approach breach.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Webhook className="h-4 w-4 text-primary" /> Slack Escalation Channel Webhook
                </label>
                <Input
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
                <p className="text-[11px] text-muted-foreground">Incoming webhook for sending instant alerts when SLA countdown reaches 15 minutes.</p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">Browser Push Notifications</h4>
                  <p className="text-[11px] text-muted-foreground">Alert agent on new live chats even when the tab is backgrounded.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBrowserPush(!browserPush)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    browserPush ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      browserPush ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
