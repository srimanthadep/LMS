import React, { useState } from "react";
import {
  Bell,
  Search,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  Pin,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Announcement {
  id: string;
  title: string;
  category: "Urgent Alert" | "Academic Notice" | "Schedule Update" | "Examination";
  author: string;
  authorRole: string;
  date: string;
  isPinned?: boolean;
  content: string;
  read?: boolean;
}

export const StudentAnnouncementsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "ann-1",
      title: "Saturday Faculty Office Hours & 1:1 Consultation Slot Shift",
      category: "Schedule Update",
      author: "Prof. Rajesh Verma",
      authorRole: "Lead Faculty & AI Chair",
      date: "Today at 09:30 AM",
      isPinned: true,
      content:
        "Please note that the Saturday Office Hours for Cohort 7 have been shifted from 11:00 AM to 03:00 PM IST to accommodate committee viva evaluations. Students who booked slots have received updated meeting links.",
    },
    {
      id: "ann-2",
      title: "Mandatory Environment Pre-Check for Capstone Midterm Timed Test",
      category: "Examination",
      author: "Apex Examination Controller",
      authorRole: "Academic Senate",
      date: "Yesterday",
      isPinned: true,
      content:
        "All Cohort 7 candidates must verify their browser camera and microphone permissions before Monday 05:00 PM. The automated test launcher enforces proctoring compliance. Ensure Chromium 120+ or latest Firefox.",
    },
    {
      id: "ann-3",
      title: "GPU Cluster Maintenance Window on Friday Night",
      category: "Urgent Alert",
      author: "Cloud Infrastructure Desk",
      authorRole: "LMS Systems Ops",
      date: "13 Oct 2026",
      content:
        "The NVIDIA A100 laboratory cluster will undergo scheduled firmware patches on Friday between 11:30 PM and 02:00 AM IST. Jupyter notebook sessions will be auto-checkpointed to persistent storage.",
    },
    {
      id: "ann-4",
      title: "Release of Lecture 8 SmartPlayer Chapters & Notes",
      category: "Academic Notice",
      author: "Teaching Assistant Team",
      authorRole: "Curriculum Division",
      date: "11 Oct 2026",
      content:
        "Chapter markers and instructor code repositories for 'Lost-in-the-Middle Context Pruning' have been published in the Replay Library and Course Curriculum view.",
    },
  ]);

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || ann.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Bell className="h-6 w-6 text-primary" /> Announcements
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Official broadcasts, faculty schedule adjustments, examination bulletins, and platform alerts.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-2xl border-border/60 shadow-sm p-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60 overflow-x-auto w-full sm:w-auto">
            {["All", "Urgent Alert", "Academic Notice", "Schedule Update", "Examination"].map((c) => (
              <Button
                key={c}
                variant={categoryFilter === c ? "default" : "ghost"}
                size="sm"
                onClick={() => setCategoryFilter(c)}
                className="rounded-lg text-xs h-7 px-3 shrink-0"
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <Card
            key={ann.id}
            className={`rounded-2xl border transition-all p-5 space-y-3 ${
              ann.isPinned
                ? "border-primary/40 bg-gradient-to-r from-primary/5 via-card to-card shadow-sm"
                : "border-border/70 hover:border-border"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {ann.isPinned && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] gap-1 font-bold">
                    <Pin className="h-3 w-3 fill-current" /> Pinned
                  </Badge>
                )}
                <Badge
                  variant={ann.category === "Urgent Alert" ? "destructive" : "secondary"}
                  className="text-[10px]"
                >
                  {ann.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {ann.date}
                </span>
              </div>

              <span className="text-xs text-muted-foreground">
                By <strong className="text-foreground">{ann.author}</strong> ({ann.authorRole})
              </span>
            </div>

            <h3 className="font-extrabold text-base text-foreground leading-snug">
              {ann.title}
            </h3>

            <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {ann.content}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
