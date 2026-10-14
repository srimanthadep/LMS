import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layers, Search, Plus, Calendar, Clock, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";
import { Batch } from "@/types/lms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const BatchesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>(mockDataService.getBatches());
  const [search, setSearch] = useState("");
  const [entitlementFilter, setEntitlementFilter] = useState("all");
  const [newModalOpen, setNewModalOpen] = useState(false);

  // New batch form state
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("course-ai-eng");
  const [teacherName, setTeacherName] = useState("Prof. Rajesh Verma");
  const [accessType, setAccessType] = useState<"live_and_replay" | "replay_only">("live_and_replay");
  const [delayHours, setDelayHours] = useState("0");
  const [expiryDate, setExpiryDate] = useState("31 Dec 2026");
  const [maxSeats, setMaxSeats] = useState("120");

  const courses = mockDataService.getCourses();

  const filteredBatches = batches.filter((b) => {
    const matchesQuery = b.name.toLowerCase().includes(search.toLowerCase()) || b.courseTitle.toLowerCase().includes(search.toLowerCase());
    const matchesEntitlement =
      entitlementFilter === "all" || b.entitlement.accessType === entitlementFilter;
    return matchesQuery && matchesEntitlement;
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const courseObj = courses.find((c) => c.id === courseId) || courses[0];

    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      courseId: courseObj.id,
      courseTitle: courseObj.title,
      name,
      cohortCode: `COHORT-${Math.floor(100 + Math.random() * 900)}`,
      startDate: "01 Nov 2026",
      endDate: expiryDate,
      teacherId: "usr-teacher-1",
      teacherName,
      maxSeats: Number(maxSeats),
      enrolledCount: 0,
      status: "upcoming",
      entitlement: {
        accessType,
        replayReleaseDelayHours: Number(delayHours),
        accessExpiryDate: expiryDate,
        allowLiveChat: accessType === "live_and_replay",
        allowDoubts: true,
        allowAiTutor: true,
        allowCertificates: true,
      },
    };

    setBatches([newBatch, ...batches]);
    setName("");
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" /> Batches, Cohorts & Entitlements
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Configure student cohort enrollments, live vs replay-only tiers, release delays, and validity expiration windows.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setNewModalOpen(true)}
            className="text-xs h-9 font-bold gap-1 shadow-sm shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Create New Cohort
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by cohort name or course title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sleek-scrollbar">
            {[
              { id: "all", label: "All Entitlements" },
              { id: "live_and_replay", label: "Live + Replay Only" },
              { id: "replay_only", label: "Replay-Only Cohorts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEntitlementFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  entitlementFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map((b) => (
            <Card
              key={b.id}
              className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant={b.entitlement.accessType === "live_and_replay" ? "accent" : "warning"}
                    className="text-[10px] font-bold"
                  >
                    {b.entitlement.accessType === "live_and_replay" ? "LIVE + REPLAY TIER" : "REPLAY-ONLY TIER"}
                  </Badge>
                  <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                    {b.cohortCode}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                  {b.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Course: {b.courseTitle}
                </p>

                {/* Granular Entitlement Specs */}
                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Replay Release:</span>
                    <strong className="text-foreground">
                      {b.entitlement.replayReleaseDelayHours === 0
                        ? "Instantaneous (0h)"
                        : `Delayed (${b.entitlement.replayReleaseDelayHours}h post-live)`}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Access Validity:</span>
                    <strong className="text-foreground">Expires {b.entitlement.accessExpiryDate}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Enrolled Learners:</span>
                    <strong className="text-foreground font-mono">{b.enrolledCount} / {b.maxSeats}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/batches/${b.id}`)}
                  className="w-full text-xs h-9 font-bold gap-1 shadow-2xs"
                >
                  Manage Batch & Roster <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal: Create Batch */}
        <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Create Cohort & Entitlement Rules</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set cohort access boundaries, replay delays, and validity expiration.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateBatch} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Cohort Title</label>
                <Input
                  required
                  placeholder="e.g. Cohort 9 (Weekend Fast-Track)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Course Program</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Entitlement Selector */}
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Entitlement Rules
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Access Type</label>
                  <select
                    value={accessType}
                    onChange={(e) => setAccessType(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="live_and_replay">Full Access (Live Classes + Replays)</option>
                    <option value="replay_only">Replay-Only (No Live Classroom Broadcast)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Replay Release Delay</label>
                    <select
                      value={delayHours}
                      onChange={(e) => setDelayHours(e.target.value)}
                      className="w-full h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    >
                      <option value="0">Immediate (0h)</option>
                      <option value="12">12 Hours Delay</option>
                      <option value="24">24 Hours Delay</option>
                      <option value="48">48 Hours Delay</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Seat Capacity</label>
                    <Input
                      type="number"
                      value={maxSeats}
                      onChange={(e) => setMaxSeats(e.target.value)}
                      className="h-8 text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Access Expiry Date</label>
                  <Input
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="e.g. 31 Dec 2026"
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setNewModalOpen(false)} className="text-xs h-9">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs h-9 font-bold">
                  Deploy Cohort
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
};
