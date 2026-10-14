import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { TestSubmission } from "@/types/lms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SubmissionsQueuePage: React.FC = () => {
  const [submissions] = useState<TestSubmission[]>(mockDataService.getSubmissions());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isBlindGrading, setIsBlindGrading] = useState(true);

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    return s.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Evaluation Submissions Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Grade milestone code repositories, multi-agent capstones, and subjective responses.
          </p>
        </div>

        {/* Blind Grading Toggle */}
        <div className="flex items-center gap-3 p-2 rounded-xl border border-border bg-card">
          <Button
            variant={isBlindGrading ? "default" : "outline"}
            size="sm"
            onClick={() => setIsBlindGrading(!isBlindGrading)}
            className="gap-2 text-xs"
          >
            {isBlindGrading ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-primary-foreground" />
                Blind Grading Active
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Identified Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by milestone or candidate token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all" className="text-xs">
                All ({submissions.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Pending
              </TabsTrigger>
              <TabsTrigger value="draft" className="text-xs">
                Draft Saved
              </TabsTrigger>
              <TabsTrigger value="graded" className="text-xs">
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submissions Table / Cards */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No submissions matching this filter query.
              </div>
            ) : (
              filtered.map((sub) => {
                const displayName = isBlindGrading
                  ? sub.studentName.includes("Blind")
                    ? sub.studentName
                    : `Candidate #${sub.id.replace(/\D/g, "") || "4810"}`
                  : "Arjun Mehta (usr-student-1)";

                return (
                  <div
                    key={sub.id}
                    className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {displayName}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{sub.submittedAt}</span>
                        {sub.status === "graded" && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                            Graded ({sub.totalScore}/{sub.maxScore})
                          </Badge>
                        )}
                        {sub.status === "pending" && (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                            Pending Evaluation
                          </Badge>
                        )}
                        {sub.status === "draft" && (
                          <Badge variant="secondary" className="text-xs">
                            Draft Saved
                          </Badge>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-foreground">
                        {sub.testTitle}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {sub.courseTitle} • {sub.batchName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                      {sub.aiSuggestedScore && (
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] text-muted-foreground block flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-violet-500" /> AI Proposal
                          </span>
                          <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
                            {sub.aiSuggestedScore} / {sub.maxScore}
                          </span>
                        </div>
                      )}

                      <Link to={`/evaluator/grading/${sub.id}`}>
                        <Button
                          size="sm"
                          variant={sub.status === "graded" ? "outline" : "default"}
                          className="text-xs gap-1.5"
                        >
                          {sub.status === "graded" ? "View / Edit Grade" : "Evaluate Submission"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
