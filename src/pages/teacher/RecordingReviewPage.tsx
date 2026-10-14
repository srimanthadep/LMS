import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SmartVideoPlayer } from "@/components/shared/SmartVideoPlayer";
import { mockDataService } from "@/services/mockDataService";
import { VideoChapter, TranscriptSnippet } from "@/types/lms";
import { Bot, CheckCircle2, Save, Sparkles, FileText, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export const RecordingReviewPage: React.FC = () => {
  const recording = mockDataService.getRecordings()[0];
  const [chapters, setChapters] = useState<VideoChapter[]>(recording.chapters);
  const [transcript, setTranscript] = useState<TranscriptSnippet[]>(recording.transcript);
  const [aiSummary, setAiSummary] = useState(recording.aiSummary);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPublished, setIsPublished] = useState(recording.status === "published");
  const { addNotification } = useNotifications();

  const handleUpdateChapterTitle = (id: string, newTitle: string) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handlePublish = () => {
    setIsPublished(true);
    addNotification({
      title: "Lecture Approved & Published",
      message: `"${recording.title}" with verified AI chapters and transcripts is now visible to enrolled cohorts.`,
      type: "class",
      link: `/student/replays/${recording.id}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" /> Post-Lecture AI Processing & Chapter Review
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review automated Whisper ASR transcripts, modify topic segment markers, and approve lecture summary for cohort publication.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                addNotification({
                  title: "Draft Saved",
                  message: "Edited chapters and summary saved as draft.",
                  type: "system",
                });
              }}
              className="text-xs h-9 font-semibold gap-1"
            >
              <Save className="h-3.5 w-3.5" /> Save Draft
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="text-xs h-9 font-bold gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isPublished ? "Published to Cohort ✓" : "Approve & Publish to Students"}
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/25 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground">AI Intelligence Status:</span>
            <span className="text-muted-foreground">Whisper ASR Completed • 5 Chapters Segmented • 98.4% Confidence</span>
          </div>
          <Badge variant={isPublished ? "success" : "warning"} className="text-[10px] font-bold">
            {isPublished ? "PUBLISHED & LIVE" : "IN FACULTY REVIEW"}
          </Badge>
        </div>

        {/* Video Player & Chapters Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <SmartVideoPlayer
              title={recording.title}
              durationSeconds={5325}
              chapters={chapters}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
            />

            {/* AI Summary Editor */}
            <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> AI Generated Lecture Summary
                </CardTitle>
                <span className="text-[10px] text-muted-foreground font-semibold">Editable</span>
              </div>
              <textarea
                rows={4}
                value={aiSummary}
                onChange={(e) => setAiSummary(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none leading-relaxed"
              />
            </Card>
          </div>

          {/* Chapters List & Transcript Editor (1 col) */}
          <div className="space-y-4">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card h-[540px] flex flex-col justify-between">
              <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-primary" /> AI Chapters ({chapters.length})
                </CardTitle>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary px-2 font-semibold">
                  + Add Marker
                </Button>
              </CardHeader>

              <CardContent className="p-3.5 overflow-y-auto space-y-2.5 sleek-scrollbar flex-1">
                {chapters.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setCurrentTime(ch.timestampSeconds)}
                        className="font-mono text-primary font-bold hover:underline"
                      >
                        ▶ {ch.timestampFormatted}
                      </button>
                      <span className="text-[10px] text-muted-foreground">Jump to Sec</span>
                    </div>

                    <Input
                      value={ch.title}
                      onChange={(e) => handleUpdateChapterTitle(ch.id, e.target.value)}
                      className="h-8 text-xs font-semibold bg-background"
                    />

                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {ch.summary}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
