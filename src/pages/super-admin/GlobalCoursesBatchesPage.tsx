import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Layers,
  Search,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldAlert,
  PlaySquare,
  ArrowUpRight,
  Filter,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockDataService } from "@/services/mockDataService";
import { Course, Batch } from "@/types/lms";

export const GlobalCoursesBatchesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "batches" | "entitlements">("courses");
  const [courses, setCourses] = useState<Course[]>(mockDataService.getCourses());
  const [batches, setBatches] = useState<Batch[]>(mockDataService.getBatches());
  const [search, setSearch] = useState("");

  // Intervention Modal State
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [interventionReason, setInterventionReason] = useState("");
  const [interventionAction, setInterventionAction] = useState<"unlock_recordings" | "expand_seats" | "force_publish">("unlock_recordings");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBatches = batches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenIntervention = (batch: Batch) => {
    setSelectedBatch(batch);
    setInterventionModalOpen(true);
  };

  const handleExecuteIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch || !interventionReason) return;

    if (interventionAction === "unlock_recordings") {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === selectedBatch.id
            ? {
                ...b,
                entitlement: {
                  ...b.entitlement,
                  replayReleaseDelayHours: 0,
                },
              }
            : b
        )
      );
      setActionSuccess(`Force-unlocked instant recording entitlement for ${selectedBatch.cohortCode}`);
    } else if (interventionAction === "expand_seats") {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === selectedBatch.id ? { ...b, maxSeats: b.maxSeats + 50 } : b
        )
      );
      setActionSuccess(`Expanded seat limit by +50 for ${selectedBatch.cohortCode}`);
    }

    setInterventionModalOpen(false);
    setInterventionReason("");
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Global Courses & Batches Governance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Omniscient oversight across all educational programs, faculty allocations, student cohort sizes, and recording entitlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {actionSuccess && (
            <Badge variant="success" className="text-xs py-1 px-2.5 gap-1 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> {actionSuccess}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs font-mono py-1 px-2.5">
            Super Admin Override Authority
          </Badge>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "courses"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> All Courses ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("batches")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "batches"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> All Batches ({batches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("entitlements")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "entitlements"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Entitlement Health (2 Flags)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search programs, cohorts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-card"
          />
        </div>
      </div>

      {/* TAB 1: ALL COURSES */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((c) => (
            <Card key={c.id} className="rounded-2xl border-border/80 bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {c.category}
                    </Badge>
                    <Badge variant="success" className="text-[10px] capitalize">
                      {c.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{c.title}</h3>
                </div>
                <span className="text-xs font-extrabold text-foreground bg-muted/30 px-2.5 py-1 rounded-lg border border-border/60">
                  ₹{c.priceRupees.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {c.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <div className="p-2 rounded-lg bg-muted/20">
                  <span className="text-[10px] block text-muted-foreground">Enrolled</span>
                  <strong className="text-foreground">{c.enrolledStudentsCount} Learners</strong>
                </div>
                <div className="p-2 rounded-lg bg-muted/20">
                  <span className="text-[10px] block text-muted-foreground">Curriculum</span>
                  <strong className="text-foreground">{c.modulesCount} Modules</strong>
                </div>
                <div className="p-2 rounded-lg bg-muted/20">
                  <span className="text-[10px] block text-muted-foreground">Duration</span>
                  <strong className="text-foreground">{c.totalHours} Hours</strong>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: ALL BATCHES */}
      {activeTab === "batches" && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/80 bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Cohort & Course</th>
                    <th className="py-3 px-4">Lead Faculty</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Enrollment</th>
                    <th className="py-3 px-4">Recording Access</th>
                    <th className="py-3 px-4 text-right">Super Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBatches.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/15 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground text-xs">{b.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-xs">{b.courseTitle}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {b.teacherName}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {b.startDate} – {b.endDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">
                            {b.enrolledCount} / {b.maxSeats}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({Math.round((b.enrolledCount / b.maxSeats) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={b.entitlement.replayReleaseDelayHours === 0 ? "success" : "outline"}
                          className="text-[10px] gap-1"
                        >
                          <PlaySquare className="h-3 w-3" />
                          {b.entitlement.replayReleaseDelayHours === 0
                            ? "Instant Live Sync"
                            : `${b.entitlement.replayReleaseDelayHours}h Delay`}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenIntervention(b)}
                          className="h-7 text-xs font-semibold gap-1 text-primary border-primary/30 hover:bg-primary/10 cursor-pointer"
                        >
                          <Unlock className="h-3 w-3" /> Intervene
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: ENTITLEMENT HEALTH */}
      {activeTab === "entitlements" && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-amber-500/30 bg-amber-500/5 p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  Entitlement Inconsistency Scanner Active
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  2 learners in Cohort 7 were flagged for access expiry date mismatch versus their Razorpay invoice duration.
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Student: Rohan Nair (rohan.n@tech.com)</p>
                <p className="text-[11px] text-muted-foreground">
                  Issue: Enrolled in Live + Replay Tier, but recording HLS access token was delayed by 24h.
                </p>
              </div>
              <Button
                size="sm"
                className="text-xs h-7 font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setActionSuccess("Re-synced recording access entitlements for rohan.n@tech.com")}
              >
                <CheckCircle2 className="h-3 w-3" /> Force Re-Sync
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Super Admin Intervention Modal */}
      <Dialog open={interventionModalOpen} onOpenChange={setInterventionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> Global Administrative Intervention
            </DialogTitle>
            <DialogDescription className="text-xs">
              Override operational batch limits or entitlements for <strong>{selectedBatch?.name}</strong>. This action is permanently recorded in the immutable audit trail.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleExecuteIntervention} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Intervention Action
              </label>
              <select
                value={interventionAction}
                onChange={(e) => setInterventionAction(e.target.value as any)}
                className="w-full text-xs h-9 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="unlock_recordings">Instant Recording Access (0h Delay Override)</option>
                <option value="expand_seats">Expand Cohort Capacity (+50 Seats)</option>
                <option value="force_publish">Force-Publish Pending Classes</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                DPR Justification & Audit Reason *
              </label>
              <Input
                required
                placeholder="e.g. Approved sponsor cohort expansion authorized by director"
                value={interventionReason}
                onChange={(e) => setInterventionReason(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInterventionModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Execute & Log Audit Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
