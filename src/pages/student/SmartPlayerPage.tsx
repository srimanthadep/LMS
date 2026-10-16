import React, { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  BookOpen,
  FileText,
  Sparkles,
  HelpCircle,
  Clock,
  Download,
  Share2,
  CheckCircle2,
  Bookmark,
  Layers,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { SmartVideoPlayer } from "@/components/shared/SmartVideoPlayer";
import { GroundedAiTutor } from "@/components/shared/GroundedAiTutor";
import { DoubtSubmissionModal } from "@/components/shared/DoubtSubmissionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const SmartPlayerPage: React.FC = () => {
  const { recordingId } = useParams<{ recordingId?: string }>();
  const [searchParams] = useSearchParams();
  const initialTime = Number(searchParams.get("t")) || 0;

  const recordings = mockDataService.getRecordings();
  const recording = recordings.find((r) => r.id === recordingId) || recordings[0];

  const [currentPlayTime, setCurrentPlayTime] = useState<number>(initialTime);
  const [activeTab, setActiveTab] = useState<string>("chapters");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [doubtTimestamp, setDoubtTimestamp] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; time: number; label: string }>>([
    { id: "b1", time: 540, label: "Crucial chunking boundary rule" },
    { id: "b2", time: 1458, label: "HNSW multi-layer graph explanation" },
  ]);
  const [userNotes, setUserNotes] = useState(
    "Key Takeaway: Never chunk by character count alone in production. Always preserve natural paragraph semantics to retain sentence context."
  );
  const [isSavedNote, setIsSavedNote] = useState(true);

  const handleSeek = (seconds: number) => {
    setCurrentPlayTime(seconds);
  };

  const handleAskDoubt = (seconds: number) => {
    setDoubtTimestamp(seconds);
    setIsDoubtModalOpen(true);
  };

  const addBookmarkAtCurrent = () => {
    const formatted = new Date(currentPlayTime * 1000).toISOString().substr(11, 8);
    setBookmarks((prev) => [
      ...prev,
      {
        id: `bm-${Date.now()}`,
        time: currentPlayTime,
        label: `Bookmark at ${formatted}`,
      },
    ]);
  };

  const filteredTranscript = recording.transcript.filter(
    (t) =>
      t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/student/replays">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Replay Library
            </Button>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
            {recording.courseTitle}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDoubtTimestamp(currentPlayTime);
              setIsDoubtModalOpen(true);
            }}
            className="gap-2"
          >
            <HelpCircle className="h-4 w-4 text-amber-500" />
            Ask Doubt at Current Time
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAiTutorOpen(true)}
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:from-violet-700 hover:to-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            Ask Grounded AI Tutor
          </Button>
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Player & Contextual Info (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <SmartVideoPlayer
            title={recording.title}
            durationSeconds={5325}
            chapters={recording.chapters}
            currentTime={currentPlayTime}
            onTimeUpdate={(t) => setCurrentPlayTime(t)}
            onOpenDoubtModal={handleAskDoubt}
          />

          {/* Lecture Metadata Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    {recording.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Duration: {recording.durationFormatted} • Published: {recording.publishedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={addBookmarkAtCurrent} className="gap-2 text-xs">
                    <Bookmark className="h-3.5 w-3.5 text-primary" />
                    Bookmark Sec
                  </Button>
                  {recording.pdfNotesUrl && (
                    <Button variant="outline" size="sm" asChild className="gap-2 text-xs">
                      <a href={recording.pdfNotesUrl} download>
                        <Download className="h-3.5 w-3.5" />
                        PDF Slides
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* AI Generated Executive Summary Box */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <Sparkles className="h-4 w-4" />
                  AI-Generated Key Takeaways
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {recording.aiSummary}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {recording.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-background px-2.5 py-1 text-xs font-medium border border-border text-foreground/80 shadow-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chapters, Searchable Transcript, Notes (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="h-[740px] flex flex-col">
            <CardHeader className="p-4 pb-2 border-b border-border">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="chapters" className="text-xs">
                    Chapters ({recording.chapters.length})
                  </TabsTrigger>
                  <TabsTrigger value="transcript" className="text-xs">
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">
                    Notes
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="p-4 flex-1 overflow-hidden flex flex-col">
              {/* TAB 1: CHAPTERS */}
              {activeTab === "chapters" && (
                <div className="overflow-y-auto sleek-scrollbar space-y-2.5 flex-1 pr-1">
                  {recording.chapters.map((ch, idx) => {
                    const isCurrent =
                      currentPlayTime >= ch.timestampSeconds &&
                      (idx === recording.chapters.length - 1 ||
                        currentPlayTime < recording.chapters[idx + 1].timestampSeconds);

                    return (
                      <div
                        key={ch.id}
                        onClick={() => handleSeek(ch.timestampSeconds)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-primary/10 border-primary shadow-xs"
                            : "bg-card hover:bg-muted/50 border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            {ch.timestampFormatted}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Part {idx + 1}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                          {ch.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                          {ch.summary}
                        </p>
                        {ch.keyKeywords && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {ch.keyKeywords.map((k) => (
                              <span
                                key={k}
                                className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                              >
                                #{k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: SEARCHABLE TRANSCRIPT */}
              {activeTab === "transcript" && (
                <div className="flex flex-col flex-1 overflow-hidden space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search lecture spoken words..."
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      className="pl-8 text-xs h-9"
                    />
                  </div>

                  <div className="overflow-y-auto sleek-scrollbar space-y-3 flex-1 pr-1">
                    {filteredTranscript.length === 0 ? (
                      <div className="py-12 text-center text-xs text-muted-foreground">
                        No spoken sentences match "{transcriptSearch}"
                      </div>
                    ) : (
                      filteredTranscript.map((line) => (
                        <div
                          key={line.id}
                          onClick={() => handleSeek(line.timestampSeconds)}
                          className="p-2.5 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/40 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-foreground group-hover:text-primary">
                              {line.speaker}
                            </span>
                            <span className="font-mono text-muted-foreground group-hover:text-primary">
                              {line.timestampFormatted}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {line.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES & BOOKMARKS */}
              {activeTab === "notes" && (
                <div className="flex flex-col flex-1 overflow-hidden space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Personal Study Notes
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {isSavedNote ? "Saved automatically" : "Editing..."}
                      </span>
                    </div>
                    <textarea
                      value={userNotes}
                      onChange={(e) => {
                        setUserNotes(e.target.value);
                        setIsSavedNote(false);
                      }}
                      onBlur={() => setIsSavedNote(true)}
                      rows={6}
                      className="w-full text-xs rounded-lg border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      placeholder="Type your contextual observations here..."
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto sleek-scrollbar space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Saved Bookmarks ({bookmarks.length})
                    </h5>
                    {bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        onClick={() => handleSeek(bm.time)}
                        className="flex items-center justify-between p-2 rounded-md border border-border text-xs hover:bg-muted/50 cursor-pointer"
                      >
                        <span className="font-medium truncate max-w-[190px]">
                          {bm.label}
                        </span>
                        <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {new Date(bm.time * 1000).toISOString().substr(14, 5)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grounded AI Tutor Drawer */}
      <GroundedAiTutor
        open={isAiTutorOpen}
        onOpenChange={setIsAiTutorOpen}
        lectureTitle={recording.title}
        onSeekTimestamp={handleSeek}
      />

      {/* Doubt Submission Modal */}
      <DoubtSubmissionModal
        open={isDoubtModalOpen}
        onOpenChange={setIsDoubtModalOpen}
        courseTitle={recording.courseTitle}
        batchName="Cohort 7 (Live + Replay)"
        classTitle={recording.title}
        timestampSeconds={doubtTimestamp}
      />
    </div>
  );
};
