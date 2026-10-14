import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlaySquare, Search, Play, Clock, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";

export const ReplayLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const recordings = mockDataService.getRecordings();
  const [search, setSearch] = useState("");

  const filtered = recordings.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <PlaySquare className="h-6 w-6 text-primary" /> Video Replay Library & AI Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review past live lectures with synchronized AI chapters, searchable transcripts, and grounded AI tutor.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recordings, topics, or AI concepts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* Replay Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((r) => (
            <Card
              key={r.id}
              className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Thumbnail */}
                <div
                  onClick={() => navigate(`/student/replays/${r.id}`)}
                  className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="h-14 w-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 ml-1" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-[11px]">
                      ⏱ {r.durationFormatted}
                    </span>
                    <Badge variant="accent" className="text-[10px] font-bold">
                      <Sparkles className="h-3 w-3 mr-1" /> {r.chapters.length} AI Chapters
                    </Badge>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {r.courseTitle}
                  </span>
                  <h3
                    onClick={() => navigate(`/student/replays/${r.id}`)}
                    className="font-bold text-sm sm:text-base text-foreground leading-snug cursor-pointer group-hover:text-primary transition-colors"
                  >
                    {r.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {r.aiSummary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  size="sm"
                  onClick={() => navigate(`/student/replays/${r.id}`)}
                  className="w-full text-xs h-9 font-bold gap-1 shadow-2xs"
                >
                  <Play className="h-3 w-3" /> Launch Smart Player with AI Tutor
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
  );
};
