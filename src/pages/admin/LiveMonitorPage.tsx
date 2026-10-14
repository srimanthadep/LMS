import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Activity, Users, Radio, Shield, Wifi, Volume2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";

export const LiveMonitorPage: React.FC = () => {
  const navigate = useNavigate();
  const liveClasses = mockDataService.getLiveClasses().filter((c) => c.status === "live");

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="h-8 text-xs gap-1 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              Live Classroom Telemetry & NOC Monitor
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Network Operations Center (NOC) observing live broadcasts, packet jitter, and audio/video synchronization.
            </p>
          </div>
        </div>

        {liveClasses.map((cls) => (
          <div key={cls.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream Stage Canvas (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-black aspect-video relative border border-border/80 shadow-2xl flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between z-10">
                  <Badge variant="default" className="text-[10px] font-bold px-2 py-0.5 bg-rose-600 text-white animate-pulse">
                    OBSERVER MODE
                  </Badge>
                  <span className="text-xs font-mono bg-black/60 px-2 py-0.5 rounded border border-white/20">
                    TURN Relay: Asia-South1 (Mumbai)
                  </span>
                </div>

                <div className="text-center z-10 space-y-1">
                  <p className="text-xs font-mono text-primary font-bold">STREAM TELEMETRY ACTIVE</p>
                  <h3 className="text-lg font-bold">{cls.title}</h3>
                  <p className="text-xs text-slate-300">
                    Faculty: {cls.instructorName} • Current Topic: {cls.activeTopic}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs z-10 bg-black/70 p-2 rounded-xl backdrop-blur-md">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Wifi className="h-4 w-4" /> 1080p @ 60fps (4,200 kbps)
                  </span>
                  <span className="font-mono text-slate-300">
                    Active Concurrency: <strong>{cls.viewerCount} students</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Live Metrics & Telemetry (1 col) */}
            <div className="space-y-4">
              <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Session Diagnostics
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                    <span className="text-muted-foreground">Audio Sample Rate</span>
                    <strong className="text-foreground font-mono">48 kHz Stereo</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                    <span className="text-muted-foreground">Packet Loss Rate</span>
                    <strong className="text-emerald-600 font-mono">0.02% (Optimal)</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                    <span className="text-muted-foreground">RTT Latency</span>
                    <strong className="text-emerald-600 font-mono">22 ms</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                    <span className="text-muted-foreground">I'm Lost Indicators</span>
                    <strong className="text-amber-500 font-mono">{cls.confusionCount || 3} students</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/70 space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/teacher/classroom/${cls.id}`)}
                    className="w-full text-xs h-9 font-bold"
                  >
                    Enter Live Studio as Co-Host
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
  );
};
