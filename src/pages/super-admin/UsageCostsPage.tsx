import React from "react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, DollarSign, Bot, Activity, AlertCircle, HardDrive, BarChart2 } from "lucide-react";
import { RupeeIcon } from "@/components/icons/RupeeIcon";

export const UsageCostsPage: React.FC = () => {
  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" /> LLM Tokens & Infrastructure Cost Analytics
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Live consumption telemetry across generative language models, Whisper speech transcription, and Qdrant vector storage.
            </p>
          </div>

          <Button size="sm" variant="outline" className="text-xs h-9 font-bold gap-1 shrink-0">
            Export Billing CSV
          </Button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
          <StatCard
            index={0}
            title="Total LLM Spend (MTD)"
            value="₹48,240"
            subtitle="Budget: ₹1,00,000"
            icon={RupeeIcon}
            trend={{ value: "48% of quota", isPositive: true }}
            highlight
          />
          <StatCard
            index={1}
            title="Total Tokens Ingested"
            value="42,850,210"
            subtitle="Prompts + Completions"
            icon={Bot}
            trend={{ value: "+8.4% vs last week", isPositive: true }}
          />
          <StatCard
            index={2}
            title="Speech-to-Text Audio"
            value="384 Hours"
            subtitle="Whisper ASR processed"
            icon={Activity}
            trend={{ value: "₹4,600 audio cost", isPositive: true }}
          />
          <StatCard
            index={3}
            title="Qdrant Vector Footprint"
            value="14.2 GB"
            subtitle="2.4M embeddings indexed"
            icon={HardDrive}
            trend={{ value: "HNSW 1536-dim", isPositive: true }}
          />
        </div>

        {/* Model Breakdown Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base font-bold">
                    Model-Wise Token & Cost Distribution
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Breakdown of API inference costs incurred by students and teaching staff
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Visual bar distributions */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-foreground">GPT-4o (Grounded AI Tutor & Summaries)</span>
                      <span className="font-bold text-primary font-mono">₹26,400 (55%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "55%" }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">24.2M tokens consumed</span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-foreground">Claude 3.5 Sonnet (Evaluator Code Grading)</span>
                      <span className="font-bold text-primary font-mono">₹14,800 (31%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/70 rounded-full" style={{ width: "31%" }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">11.6M tokens consumed</span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-foreground">Whisper Large v3 (Lecture Transcripts)</span>
                      <span className="font-bold text-primary font-mono">₹4,600 (10%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "10%" }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">384 lecture hours transcribed</span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-foreground">text-embedding-3-large (Vector Embeddings)</span>
                      <span className="font-bold text-primary font-mono">₹2,440 (4%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "4%" }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">7.0M tokens indexed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Limit & Alert Policy (1 col) */}
          <div className="space-y-6">
            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" /> Budget Cap & Safeguards
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Platform budget limit is set to <strong>₹1,00,000 / month</strong>. When spending reaches 85%, automatic rate limiting engages on student tutoring queries to protect organization cash flow.
              </p>

              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Current Utilization</span>
                  <span className="text-primary font-bold">48.2%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "48.2%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>₹48,240 spent</span>
                  <span>₹51,760 remaining</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Alert Webhook</span>
                  <Badge variant="outline" className="text-[10px]">Slack & Email</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Hard Stop Threshold</span>
                  <span className="font-bold text-foreground">₹1,20,000</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};
