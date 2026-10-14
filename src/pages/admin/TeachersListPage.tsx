import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Video, Calendar, Star, Plus } from "lucide-react";

export const TeachersListPage: React.FC = () => {
  const teachers = [
    {
      id: "t-1",
      name: "Prof. Rajesh Verma",
      email: "rajesh.verma@edulms.ai",
      specialization: "LLM Systems, Agentic Architectures & RAG",
      activeBatches: 2,
      scheduledHoursThisWeek: 8,
      rating: 4.95,
      avatar: "RV",
    },
    {
      id: "t-2",
      name: "Dr. Meera Swaminathan",
      email: "meera.s@edulms.ai",
      specialization: "Diffusion Models & Computer Vision",
      activeBatches: 1,
      scheduledHoursThisWeek: 4,
      rating: 4.91,
      avatar: "MS",
    },
    {
      id: "t-3",
      name: "Er. Karthik Iyer",
      email: "karthik.i@edulms.ai",
      specialization: "MLOps, Kubernetes GPU & Vector Indexing",
      activeBatches: 1,
      scheduledHoursThisWeek: 6,
      rating: 4.88,
      avatar: "KI",
    },
  ];

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> Faculty Directory & Workload
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Assigned teaching faculty, live lecture commitments, and instructor ratings.
            </p>
          </div>

          <Button size="sm" className="text-xs h-9 font-bold gap-1 shadow-sm shrink-0">
            <Plus className="h-3.5 w-3.5" /> Allocate Faculty
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teachers.map((t) => (
            <Card key={t.id} className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base ring-2 ring-primary/20">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-foreground truncate">{t.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                  <p className="text-[11px] text-primary font-semibold truncate mt-0.5">{t.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-[10px] text-muted-foreground block">Active Cohorts</span>
                  <strong className="text-foreground">{t.activeBatches} Batches</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-[10px] text-muted-foreground block">Weekly Load</span>
                  <strong className="text-foreground">{t.scheduledHoursThisWeek} Hours</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1 font-bold text-foreground">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {t.rating} / 5.0
                </span>
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                  View Timetable
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
  );
};
