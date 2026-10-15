import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Shield,
  Cpu,
  Video,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Globe,
  Database,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "ai" | "recording">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings State
  const [platformName, setPlatformName] = useState("Apex AI Institute");
  const [supportEmail, setSupportEmail] = useState("ops@edulms.ai");
  const [defaultCurrency, setDefaultCurrency] = useState("INR (₹)");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security Settings State
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState("60");
  const [maxConcurrentLogins, setMaxConcurrentLogins] = useState("2");
  const [requireStaff2FA, setRequireStaff2FA] = useState(true);
  const [lockoutAttempts, setLockoutAttempts] = useState("5");

  // AI Configuration State
  const [defaultLlmModel, setDefaultLlmModel] = useState("gpt-4o");
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-3-small");
  const [chunkSize, setChunkSize] = useState("512");
  const [chunkOverlap, setChunkOverlap] = useState("64");
  const [moderationThreshold, setModerationThreshold] = useState("85");

  // Recording & Retention State
  const [defaultRecordingDelay, setDefaultRecordingDelay] = useState("0");
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [rawMediaRetentionDays, setRawMediaRetentionDays] = useState("180");
  const [hlsPreset, setHlsPreset] = useState("1080p60_Adaptive");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" /> Global System Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Enterprise platform configuration, security protocols, AI model pipelines, and recording retention policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <Badge variant="success" className="text-xs py-1 px-2.5 gap-1 shadow-xs animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> Changes Persisted
            </Badge>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs h-9 font-bold gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {isSaving ? "Saving..." : "Save System Config"}
          </Button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/80 pb-2 overflow-x-auto sleek-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "general"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Globe className="h-3.5 w-3.5" /> General Configuration
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "security"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Shield className="h-3.5 w-3.5" /> Security & 2FA Governance
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "ai"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" /> AI Model & Vector Pipeline
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("recording")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "recording"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Video className="h-3.5 w-3.5" /> Recording & Retention Defaults
        </button>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: GENERAL */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> Tenant & Platform Identity
                </CardTitle>
                <CardDescription className="text-xs">
                  Global branding and contact parameters applied across student and staff workspaces.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Platform Legal Name
                  </label>
                  <Input
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Appears on invoices, certificates, and student portals.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Operations & Governance Support Email
                  </label>
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Destination for escalated security events and student grievances.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Base Operational Currency
                  </label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="INR (₹)">Indian Rupee — INR (₹)</option>
                    <option value="USD ($)">US Dollar — USD ($)</option>
                    <option value="EUR (€)">Euro — EUR (€)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Platform Maintenance & Service Mode
                </CardTitle>
                <CardDescription className="text-xs">
                  Temporarily lock student and faculty logins during scheduled infrastructure deployments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Maintenance Mode
                      </p>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                        {maintenanceMode
                          ? "ACTIVE: Only Super Admins can access platform endpoints."
                          : "DISABLED: All portals accessible to registered learners and staff."}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-muted peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> API webhooks queue automatically during maintenance.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Live WebRTC streams remain uninterrupted if in-flight.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: SECURITY */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Session Security & Timeout Controls
                </CardTitle>
                <CardDescription className="text-xs">
                  Prevent unauthorized session retention across untrusted devices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Inactivity Session Timeout (Minutes)
                  </label>
                  <Input
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Learners are prompted to re-authenticate after idle timeout.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Max Concurrent Sessions per Account
                  </label>
                  <Input
                    type="number"
                    value={maxConcurrentLogins}
                    onChange={(e) => setMaxConcurrentLogins(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Enforces anti-credential sharing rules for live cohorts.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Brute-Force Lockout Attempts Threshold
                  </label>
                  <Input
                    type="number"
                    value={lockoutAttempts}
                    onChange={(e) => setLockoutAttempts(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Locks account for 30 minutes after consecutive failed passwords.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Multi-Factor Authentication Governance
                </CardTitle>
                <CardDescription className="text-xs">
                  Strict DPR mandate: Privileged staff roles require time-based 2FA tokens.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Enforce 2FA for Staff Roles
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Mandatory for Super Admin, Admin, Evaluator, and Support staff.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireStaff2FA}
                        onChange={(e) => setRequireStaff2FA(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-muted peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                    Protected Staff Roles
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-[11px]">Super Admin (Required)</Badge>
                    <Badge variant="outline" className="text-[11px]">Admin (Required)</Badge>
                    <Badge variant="outline" className="text-[11px]">Evaluator (Required)</Badge>
                    <Badge variant="outline" className="text-[11px]">Support (Required)</Badge>
                    <Badge variant="secondary" className="text-[11px]">Student (Optional)</Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Notice: Ordinary Admins are blocked by database RLS policies from promoting themselves or others to Super Admin.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: AI CONFIGURATION */}
        {activeTab === "ai" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" /> Primary LLM Inference Routing
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure default foundation models for automated code grading, transcription chaptering, and doubt resolution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Default High-Intelligence LLM (Complex Evaluations & Syllabi)
                  </label>
                  <select
                    value={defaultLlmModel}
                    onChange={(e) => setDefaultLlmModel(e.target.value)}
                    className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="gpt-4o">OpenAI GPT-4o (Production Default)</option>
                    <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                    <option value="gemini-1-5-pro">Google Gemini 1.5 Pro</option>
                  </select>
                  <p className="text-[11px] text-muted-foreground mt-1">Automatic fallback to Claude 3.5 Sonnet if OpenAI latency &gt; 4000ms.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Auto-Moderation Sensitivity Threshold (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="50"
                      max="100"
                      value={moderationThreshold}
                      onChange={(e) => setModerationThreshold(e.target.value)}
                      className="text-xs h-9 w-28"
                    />
                    <span className="text-xs text-muted-foreground">Flags inappropriate doubt queries above {moderationThreshold}% confidence.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/60 text-xs text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary inline mr-1" />
                  Evaluator AI Concordance runs on <strong>GPT-4o Structured Outputs</strong> with strict JSON Schema schema validation.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" /> Semantic Vector Index Parameters
                </CardTitle>
                <CardDescription className="text-xs">
                  Controls RAG retrieval accuracy across lecture transcripts and course code repositories.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Embedding Model Provider
                  </label>
                  <select
                    value={embeddingModel}
                    onChange={(e) => setEmbeddingModel(e.target.value)}
                    className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="text-embedding-3-small">OpenAI text-embedding-3-small (1536 dim)</option>
                    <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072 dim)</option>
                    <option value="cohere-embed-v3">Cohere Embed English v3.0 (1024 dim)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Chunk Size (Tokens)
                    </label>
                    <Input
                      type="number"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Chunk Overlap (Tokens)
                    </label>
                    <Input
                      type="number"
                      value={chunkOverlap}
                      onChange={(e) => setChunkOverlap(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/60 text-xs text-muted-foreground space-y-1">
                  <p><strong>Vector Engine:</strong> Milvus 2.4 Distributed GPU Cluster</p>
                  <p><strong>Index Metric:</strong> Cosine Similarity (M=16, efConstruction=200)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: RECORDING & RETENTION */}
        {activeTab === "recording" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" /> Live Recording Release Defaults
                </CardTitle>
                <CardDescription className="text-xs">
                  Controls default access timing and video transcoding pipelines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Default Replay Availability Delay (Hours)
                  </label>
                  <Input
                    type="number"
                    value={defaultRecordingDelay}
                    onChange={(e) => setDefaultRecordingDelay(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Set to 0 for instant release upon class conclusion. Batches can override this entitlement.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Adaptive Transcoding Bitrate Preset
                  </label>
                  <select
                    value={hlsPreset}
                    onChange={(e) => setHlsPreset(e.target.value)}
                    className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="1080p60_Adaptive">1080p60 + 720p + 480p Multi-Bitrate HLS</option>
                    <option value="720p30_BandwidthSaving">720p30 Bandwidth-Optimized HLS</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Automatic Whisper Transcription
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Dispatches AI speech-to-text pipeline immediately after live stream ends.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTranscribe}
                      onChange={(e) => setAutoTranscribe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-muted peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-primary"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Storage Life-Cycle & Retention Policy
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated storage cleanup to control AWS S3 and Cloudflare R2 egress charges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Raw WebRTC Segment Retention (Days)
                  </label>
                  <Input
                    type="number"
                    value={rawMediaRetentionDays}
                    onChange={(e) => setRawMediaRetentionDays(e.target.value)}
                    className="text-xs h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Raw chunks are purged after {rawMediaRetentionDays} days once HLS and chapters are confirmed.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/60 text-xs text-muted-foreground space-y-1">
                  <p><strong>Processed HLS Recordings:</strong> Indefinite (Guaranteed student course validity)</p>
                  <p><strong>Vector Embeddings:</strong> Synchronized with published lesson syllabus</p>
                  <p><strong>Audit Logs:</strong> 7-Year Immutable Compliance Retention</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </form>
    </div>
  );
};
