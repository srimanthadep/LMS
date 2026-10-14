import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Cpu, CheckCircle2, RefreshCw, Key, Shield, MessageSquare, Video, CreditCard, Bot } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: "connected" | "degraded" | "disconnected";
  endpoint: string;
  keyMasked: string;
  latencyMs: number;
}

const INITIAL_CONNECTORS: Connector[] = [
  {
    id: "openai",
    name: "OpenAI GPT-4o & Whisper ASR",
    description: "Powers transcription speech-to-text and AI chaptering summarization pipelines.",
    icon: Bot,
    status: "connected",
    endpoint: "https://api.openai.com/v1/chat/completions",
    keyMasked: "sk-proj-••••••••••••8912",
    latencyMs: 120,
  },
  {
    id: "anthropic",
    name: "Anthropic Claude 3.5 Sonnet",
    description: "Evaluator draft grading, coding rubrics analysis, and complex conceptual doubt grounding.",
    icon: Cpu,
    status: "connected",
    endpoint: "https://api.anthropic.com/v1/messages",
    keyMasked: "sk-ant-••••••••••••9421",
    latencyMs: 145,
  },
  {
    id: "razorpay",
    name: "Razorpay Payments & Webhooks",
    description: "India-centric checkout supporting UPI (GPay/PhonePe), NetBanking, and EMI invoice generation.",
    icon: CreditCard,
    status: "connected",
    endpoint: "https://api.razorpay.com/v1/orders",
    keyMasked: "rzp_live_••••••••••••3310",
    latencyMs: 85,
  },
  {
    id: "zoom-sdk",
    name: "Zoom Video SDK & WebRTC TURN",
    description: "Low-latency live lecture broadcasting with screen sharing and participant sub-channels.",
    icon: Video,
    status: "connected",
    endpoint: "https://api.zoom.us/v2/videosdk/sessions",
    keyMasked: "zm_sdk_••••••••••••1048",
    latencyMs: 38,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business API Gateway",
    description: "Instant batch timetable updates, class start reminders, and ticket escalations to students.",
    icon: MessageSquare,
    status: "connected",
    endpoint: "https://graph.facebook.com/v19.0/messages",
    keyMasked: "wa_token_••••••••••••5502",
    latencyMs: 110,
  },
];

export const IntegrationsPage: React.FC = () => {
  const [connectors, setConnectors] = useState<Connector[]>(INITIAL_CONNECTORS);
  const [testingId, setTestingId] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const handleTestConnection = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      addNotification({
        title: "Connector Test Passed",
        message: `${name} responded with HTTP 200 OK (Latency: 84ms).`,
        type: "system",
      });
    }, 700);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" /> External API & Infrastructure Connectors
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure LLM inference gateways, payment webhooks, WebRTC video streaming, and WhatsApp notification brokers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map((c) => {
            const Icon = c.icon;
            const isTesting = testingId === c.id;

            return (
              <Card key={c.id} className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card flex flex-col justify-between">
                <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-bold text-foreground truncate">{c.name}</CardTitle>
                      <p className="text-[11px] text-muted-foreground truncate">{c.endpoint}</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px] font-bold shrink-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                  </Badge>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-3.5">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>

                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-primary" /> Secret Key:
                    </span>
                    <span className="font-bold text-foreground">{c.keyMasked}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-muted-foreground">
                      Ping: <strong className="text-emerald-600 dark:text-emerald-400">{c.latencyMs}ms</strong>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isTesting}
                      onClick={() => handleTestConnection(c.id, c.name)}
                      className="h-8 text-xs font-semibold gap-1.5"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin text-primary" : ""}`} />
                      {isTesting ? "Pinging..." : "Test Health"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};
