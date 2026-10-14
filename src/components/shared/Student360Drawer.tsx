import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Award, HelpCircle, LifeBuoy, ArrowRightLeft, Clock, ShieldCheck } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface Student360DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId?: string;
}

export const Student360Drawer: React.FC<Student360DrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const [proposedActionMessage, setProposedActionMessage] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const handleProposeMove = () => {
    setProposedActionMessage("Proposal logged: Moving Arjun Mehta to Weekend Cohort. Routed to Admin.");
    addNotification({
      title: "Batch Move Proposed",
      message: "Batch transfer request for Arjun Mehta submitted for Admin approval.",
      type: "system",
      link: "/admin/batches",
    });
  };

  const handleProposeExtension = () => {
    setProposedActionMessage("Proposal logged: 30-Day validity extension. Routed to Admin.");
    addNotification({
      title: "Extension Proposed",
      message: "30-day course extension for Arjun Mehta submitted for Admin approval.",
      type: "system",
      link: "/admin/students",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-card border-l border-border/80">
        <SheetHeader className="p-4 sm:p-5 border-b border-border/70 bg-muted/20 text-left">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base ring-2 ring-primary/20">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base font-bold text-foreground">
                  Arjun Mehta
                </SheetTitle>
                <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4">
                  Active Enrolled
                </Badge>
              </div>
              <SheetDescription className="text-xs text-muted-foreground">
                arjun.m@learner.ai • Student ID: #USR-4810
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 sleek-scrollbar">
          {proposedActionMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{proposedActionMessage}</span>
            </div>
          )}

          {/* Enrolled Batch & Entitlement Capsule */}
          <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Enrolled Program</span>
              <Badge variant="accent" className="text-[10px] font-bold">
                Live + Replay Access
              </Badge>
            </div>
            <p className="text-sm font-bold text-foreground">
              Full-Stack AI & LLM Systems Engineering
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
              <span>Cohort: <strong>Cohort 7 (Evening)</strong></span>
              <span>Expires: <strong>31 Dec 2026</strong></span>
            </div>
          </div>

          {/* High-level Engagement Metrics */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
              Academic & Attendance Metrics
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <p className="text-[11px] text-muted-foreground">Live Attendance</p>
                <p className="text-lg font-bold text-foreground mt-0.5">88%</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  14/16 sessions attended
                </span>
              </div>
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <p className="text-[11px] text-muted-foreground">Replay Watch Time</p>
                <p className="text-lg font-bold text-foreground mt-0.5">42.5 hrs</p>
                <span className="text-[10px] text-muted-foreground">92% completion</span>
              </div>
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <p className="text-[11px] text-muted-foreground">Milestones Graded</p>
                <p className="text-lg font-bold text-foreground mt-0.5">2 / 3</p>
                <span className="text-[10px] text-primary font-bold">Avg Score: 95%</span>
              </div>
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <p className="text-[11px] text-muted-foreground">Total Doubts Asked</p>
                <p className="text-lg font-bold text-foreground mt-0.5">4</p>
                <span className="text-[10px] text-emerald-600 font-semibold">100% Resolved</span>
              </div>
            </div>
          </div>

          {/* Recent Doubts Stream */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-amber-500" /> Recent Doubts Log
            </p>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl border border-border/60 bg-muted/15 text-xs space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-foreground">Lecture 8 @ 00:24:18</span>
                  <Badge variant="outline" className="text-[9px]">Resolved</Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  HNSW efSearch parameter nuance in production.
                </p>
              </div>
            </div>
          </div>

          {/* Support Actions */}
          <div className="pt-2 border-t border-border/70 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Privileged Mentor Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleProposeMove}
                className="text-xs h-9 gap-1 font-semibold"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                Propose Cohort Move
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProposeExtension}
                className="text-xs h-9 gap-1 font-semibold"
              >
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Propose Extension
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
