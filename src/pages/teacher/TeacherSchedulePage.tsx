import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDataService } from "@/services/mockDataService";

export const TeacherSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const classes = mockDataService.getLiveClasses();

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Faculty Teaching Schedule
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your upcoming live synchronous lectures, studio room links, and batch allocations.
          </p>
        </div>

        <div className="space-y-3.5">
          {classes.map((cls) => (
            <Card key={cls.id} className="border-border/80 shadow-xs rounded-2xl p-4 sm:p-5 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">{cls.title}</h3>
                  {cls.status === "live" ? (
                    <Badge variant="default" className="text-[9px] bg-rose-600 font-bold">LIVE NOW</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px]">SCHEDULED</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cohort: <strong>{cls.batchName}</strong> • Program: {cls.courseTitle}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono pt-1">
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <Clock className="h-3.5 w-3.5" /> {cls.scheduledAt}
                  </span>
                  <span>Duration: {cls.durationMinutes} mins</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => navigate(`/teacher/classroom/${cls.id}`)}
                  className="h-9 text-xs font-bold gap-1.5 shadow-sm"
                >
                  <Video className="h-3.5 w-3.5" /> Enter Studio
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
  );
};
