import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Sparkles,
  UserCheck,
  Clock,
  Search,
  Filter,
  ArrowRight,
  PlusCircle,
  MessageSquare,
  Play,
  CheckCircle2,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { StudentDoubt } from "@/types/lms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoubtSubmissionModal } from "@/components/shared/DoubtSubmissionModal";

export const StudentDoubtsPage: React.FC = () => {
  const [doubts, setDoubts] = useState<StudentDoubt[]>(mockDataService.getDoubts());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const filteredDoubts = doubts.filter((d) => {
    const matchesSearch =
      d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.classTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    return d.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Doubts & Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track timestamped questions submitted during live lectures and recording replays.
          </p>
        </div>
        <Button
          onClick={() => setIsSubmitModalOpen(true)}
          className="gap-2 bg-primary text-primary-foreground shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Ask New Doubt
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doubts or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all" className="text-xs">
                All ({doubts.length})
              </TabsTrigger>
              <TabsTrigger value="ai_answered" className="text-xs">
                AI Answered
              </TabsTrigger>
              <TabsTrigger value="teacher_replied" className="text-xs">
                Teacher Replied
              </TabsTrigger>
              <TabsTrigger value="open" className="text-xs">
                Pending
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Doubts Feed */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <Card className="p-12 text-center">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No doubts found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              You haven't submitted any questions matching this filter. Ask a question while watching any lecture replay!
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(true)}
              className="mt-4 gap-2"
            >
              Ask Question Now
            </Button>
          </Card>
        ) : (
          filteredDoubts.map((doubt) => (
            <Card key={doubt.id} className="overflow-hidden hover:border-border/80 transition-all">
              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-medium">
                      {doubt.courseTitle}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {doubt.classTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {doubt.createdAt}
                    </span>
                    {doubt.status === "ai_answered" && (
                      <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-xs gap-1">
                        <Sparkles className="h-3 w-3" /> AI Answered
                      </Badge>
                    )}
                    {doubt.status === "teacher_replied" && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1">
                        <UserCheck className="h-3 w-3" /> Teacher Replied
                      </Badge>
                    )}
                    {doubt.status === "open" && (
                      <Badge variant="secondary" className="text-xs">
                        In Review Queue
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Question Section */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground">
                          {doubt.question}
                        </h4>
                        <Link
                          to={`/student/replays/rep-rag-8?t=${doubt.timestampSeconds}`}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded transition-colors"
                        >
                          <Play className="h-2.5 w-2.5 fill-current" />
                          {doubt.timestampFormatted}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Section */}
                {doubt.teacherReply && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4" />
                        Instructor Verified Reply (Prof. Rajesh Verma)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {doubt.teacherReply}
                    </p>
                  </div>
                )}

                {doubt.aiAnswer && (
                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-violet-700 dark:text-violet-400">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        Grounded AI Answer (Linked to Lecture @ {doubt.timestampFormatted})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {doubt.aiAnswer}
                    </p>
                  </div>
                )}

                {doubt.status === "open" && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Our teaching assistant team is reviewing your question. Expected response within 4 hours.</span>
                    <span className="text-[11px] font-medium text-primary">SLA Active</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reusable Doubt Submission Modal */}
      <DoubtSubmissionModal
        open={isSubmitModalOpen}
        onOpenChange={(val) => {
          setIsSubmitModalOpen(val);
          if (!val) setDoubts(mockDataService.getDoubts());
        }}
        courseTitle="Full-Stack AI & LLM Systems Engineering"
        batchName="Cohort 7 (Live + Replay)"
        classTitle="Lecture 8: Vector Databases, Chunking Strategies"
        timestampSeconds={1458}
      />
    </div>
  );
};
