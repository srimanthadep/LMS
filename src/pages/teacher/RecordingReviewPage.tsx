import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SmartVideoPlayer } from "@/components/shared/SmartVideoPlayer";
import { VideoChapter, TranscriptSnippet, LectureRecording } from "@/types/lms";
import {
  Bot,
  Sparkles,
  FileText,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  X,
  Play,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { teacherDataService, RecordingCorrectionSuggestion } from "./teacherDataService";

export const RecordingReviewPage: React.FC = () => {
  const { recordingId } = useParams<{ recordingId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [recordings] = useState<LectureRecording[]>(() =>
    teacherDataService.getRecordings()
  );

  const selectedRecording =
    recordings.find((r) => r.id === recordingId) || recordings[0];

  const [currentRecordingId, setCurrentRecordingId] = useState(selectedRecording?.id || "");
  const activeRecording =
    recordings.find((r) => r.id === currentRecordingId) || selectedRecording;

  const [currentTime, setCurrentTime] = useState(0);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<RecordingCorrectionSuggestion[]>([]);

  // Suggestion modal state
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestionType, setSuggestionType] = useState<"chapter" | "transcript" | "summary" | "other">("transcript");
  const [suggestionTimeFormatted, setSuggestionTimeFormatted] = useState("");
  const [suggestionDetails, setSuggestionDetails] = useState("");
  const [suggestedCorrection, setSuggestedCorrection] = useState("");
  const [suggestionUrgency, setSuggestionUrgency] = useState<"low" | "normal" | "high">("normal");

  // Load suggestions whenever active recording changes
  useEffect(() => {
    if (activeRecording) {
      setSuggestions(teacherDataService.getRecordingSuggestions(activeRecording.id));
    }
  }, [activeRecording]);

  const openSuggestModal = (
    type: "chapter" | "transcript" | "summary" | "other",
    prefillTime?: string,
    prefillDetails?: string
  ) => {
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const formattedNow = `00:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;

    setSuggestionType(type);
    setSuggestionTimeFormatted(prefillTime || formattedNow);
    setSuggestionDetails(prefillDetails || "");
    setSuggestedCorrection("");
    setSuggestionUrgency("normal");
    setShowSuggestModal(true);
  };

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecording || !suggestedCorrection.trim()) return;

    const newSuggestion: RecordingCorrectionSuggestion = {
      id: `sug-${Date.now()}`,
      recordingId: activeRecording.id,
      recordingTitle: activeRecording.title,
      type: suggestionType,
      targetTimeFormatted: suggestionTimeFormatted.trim() || undefined,
      targetDetails: suggestionDetails.trim() || `Correction proposed for ${suggestionType}`,
      suggestedCorrection: suggestedCorrection.trim(),
      urgency: suggestionUrgency,
      submittedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending_review",
    };

    teacherDataService.submitRecordingSuggestion(newSuggestion);
    setSuggestions((prev) => [newSuggestion, ...prev]);
    setShowSuggestModal(false);

    addNotification({
      title: "Correction Submitted",
      message: `Your proposed ${suggestionType} correction for "${activeRecording.title}" has been submitted.`,
      type: "system",
    });
  };

  if (!activeRecording) {
    return <div className="p-8 text-center text-xs text-muted-foreground">No lecture recordings available.</div>;
  }

  const chapters: VideoChapter[] = activeRecording.chapters || [];
  const transcript: TranscriptSnippet[] = activeRecording.transcript || [];
  const aiSummary = activeRecording.aiSummary || "No AI summary generated yet for this recording.";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40">
              <ShieldCheck className="h-3 w-3 mr-1" /> Lecture Recording
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> Lecture Recording & AI Intelligence Review
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Review automated Whisper ASR transcripts, video chapter markers, and executive summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Recording Selector */}
          <select
            value={currentRecordingId}
            onChange={(e) => setCurrentRecordingId(e.target.value)}
            className="h-9 text-xs rounded-xl border border-input bg-card px-2.5 max-w-xs truncate font-medium text-foreground"
          >
            {recordings.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={() => openSuggestModal("other")}
            className="text-xs h-9 font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            Suggest Correction
          </Button>
        </div>
      </div>

      {/* Main Content: Player, Summary, Transcript, Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Player + Summary + Transcripts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Video Player */}
          <SmartVideoPlayer
            title={activeRecording.title}
            durationSeconds={5325}
            chapters={chapters}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
          />

          {/* AI Summary Card (Read-Only) */}
          <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Executive Lecture Summary (AI-Generated)
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300">
                  Verified
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openSuggestModal("summary", undefined, "Executive Summary clarification")}
                className="text-xs h-7 gap-1 border-slate-200 dark:border-white/10 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
              >
                <MessageSquare className="h-3 w-3" />
                Suggest Summary Edit
              </Button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121c17] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {aiSummary}
            </div>
          </Card>

          {/* Whisper ASR Transcript Review (Read-Only with jump and suggest) */}
          <Card className="border-border/80 shadow-xs rounded-2xl p-5 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> Whisper ASR Transcripts
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Synchronized automated speech-to-text transcript. Select any snippet to jump playback or submit a correction.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {transcript.length} Snippets
              </Badge>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
              {transcript.map((snip) => (
                <div
                  key={snip.id}
                  className="p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <Play className="h-2.5 w-2.5 fill-current" />
                      {snip.speaker} ({snip.timestampFormatted})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentTime(snip.timestampSeconds)}
                        className="hover:underline text-emerald-600 font-semibold cursor-pointer"
                      >
                        Jump to audio
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() =>
                          openSuggestModal("transcript", snip.timestampFormatted, `Snippet: "${snip.text}"`)
                        }
                        className="hover:underline text-primary font-semibold cursor-pointer"
                      >
                        Suggest Correction
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed pl-1">
                    {snip.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Chapters List + Faculty Correction History */}
        <div className="space-y-5">
          {/* Official Chapters Card */}
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card flex flex-col">
            <CardHeader className="p-4 border-b border-border/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-primary" /> Lecture Chapters ({chapters.length})
                </CardTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5">Timestamp markers</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openSuggestModal("chapter")}
                className="h-7 text-xs text-primary px-2 font-semibold cursor-pointer hover:bg-primary/10"
              >
                + Propose Marker
              </Button>
            </CardHeader>

            <CardContent className="p-3.5 space-y-2.5 max-h-[340px] overflow-y-auto">
              {chapters.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  No chapters defined for this lecture.
                </p>
              ) : (
                chapters.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setCurrentTime(ch.timestampSeconds)}
                        className="font-mono text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="h-3 w-3" />
                        {ch.timestampFormatted}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openSuggestModal("chapter", ch.timestampFormatted, `Chapter: "${ch.title}"`)
                        }
                        className="text-[11px] text-muted-foreground hover:text-primary cursor-pointer hover:underline"
                      >
                        Suggest change
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-foreground">{ch.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {ch.summary}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Faculty Feedback & Correction History Card */}
          <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card flex flex-col">
            <CardHeader className="p-4 border-b border-border/70">
              <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-600" /> My Correction Submissions ({suggestions.length})
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">Track status of submitted correction proposals</p>
            </CardHeader>

            <CardContent className="p-3.5 space-y-2.5 max-h-[300px] overflow-y-auto">
              {suggestions.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-6">
                  No pending correction requests for this lecture. Use the button above to suggest updates.
                </p>
              ) : (
                suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="p-3 rounded-xl border border-border/70 bg-slate-50/60 dark:bg-[#121c17] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase font-bold ${
                          sug.status === "approved"
                            ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                            : sug.status === "rejected"
                            ? "border-rose-500 text-rose-700 bg-rose-50"
                            : "border-amber-500 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {sug.status === "approved"
                          ? "Approved"
                          : sug.status === "rejected"
                          ? "Declined"
                          : "Pending Review"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">{sug.submittedAt}</span>
                    </div>

                    <div className="text-xs text-foreground font-medium">
                      <span className="text-[10px] font-bold uppercase text-primary font-mono mr-1.5">
                        [{sug.type} {sug.targetTimeFormatted ? `@ ${sug.targetTimeFormatted}` : ""}]
                      </span>
                      {sug.suggestedCorrection}
                    </div>

                    {sug.targetDetails && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        Target: {sug.targetDetails}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Suggest Correction Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141e19] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
                  Content Feedback
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Suggest Content Correction
                </h3>
              </div>
              <button
                onClick={() => setShowSuggestModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit your proposed update for <strong>{activeRecording.title}</strong>.
            </p>

            <form onSubmit={handleSubmitSuggestion} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Content Category
                  </label>
                  <select
                    value={suggestionType}
                    onChange={(e) => setSuggestionType(e.target.value as any)}
                    className="w-full h-9 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] px-2 text-slate-900 dark:text-white"
                  >
                    <option value="transcript">Whisper ASR Transcript</option>
                    <option value="chapter">Chapter Timestamp / Title</option>
                    <option value="summary">Executive AI Summary</option>
                    <option value="other">Audio / Video Issue</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Timestamp Reference (HH:MM:SS)
                  </label>
                  <Input
                    placeholder="e.g. 00:14:30"
                    value={suggestionTimeFormatted}
                    onChange={(e) => setSuggestionTimeFormatted(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Snippet or Current Content
                </label>
                <Input
                  placeholder="e.g. Current snippet reads 'soft match normal'"
                  value={suggestionDetails}
                  onChange={(e) => setSuggestionDetails(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Proposed Correction / Faculty Note <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the precise change needed and why it should be corrected..."
                  value={suggestedCorrection}
                  onChange={(e) => setSuggestedCorrection(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101713] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {(["low", "normal", "high"] as const).map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setSuggestionUrgency(urg)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border capitalize cursor-pointer transition ${
                        suggestionUrgency === urg
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSuggestModal(false)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  Submit Suggestion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingReviewPage;
