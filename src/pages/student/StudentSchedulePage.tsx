import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { DeviceCheckModal } from "@/components/shared/DeviceCheckModal";

export const StudentSchedulePage: React.FC = () => {
  const classes = mockDataService.getLiveClasses();
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(classes[0]);

  const handleOpenDeviceCheck = (cls: any) => {
    setSelectedClass(cls);
    setDeviceModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Live Class Schedule & Timetable
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your live synchronous learning calendar with one-click hardware pre-join checks.
          </p>
        </div>

        <div className="space-y-3.5">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="border-border/80 shadow-xs rounded-2xl p-4 sm:p-5 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">{cls.title}</h3>
                  {cls.status === "live" ? (
                    <Badge variant="default" className="text-[9px] bg-rose-600 font-bold">LIVE NOW</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px]">UPCOMING</Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Faculty: <strong>{cls.instructorName}</strong> • {cls.batchName}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono pt-1">
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <Clock className="h-3.5 w-3.5" /> {cls.scheduledAt}
                  </span>
                  <span>Duration: {cls.durationMinutes} mins</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleOpenDeviceCheck(cls)}
                  className="h-9 text-xs font-bold gap-1.5 shadow-sm"
                >
                  <Video className="h-3.5 w-3.5" /> Pre-Join Check & Join
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {selectedClass && (
          <DeviceCheckModal
            open={deviceModalOpen}
            onOpenChange={setDeviceModalOpen}
            targetClassId={selectedClass.id}
            classTitle={selectedClass.title}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
