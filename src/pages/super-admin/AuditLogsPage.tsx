import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, ShieldAlert, Download, Filter, Terminal } from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AuditLogEntry } from "@/types/lms";

export const AuditLogsPage: React.FC = () => {
  const [logs] = useState(mockDataService.getAuditLogs());
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" /> Platform Security & Audit Trail
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Append-only immutable record of all permission changes, grade modifications, and authentication events.
            </p>
          </div>

          <Button size="sm" variant="outline" className="text-xs h-9 font-bold gap-1.5 shrink-0">
            <Download className="h-3.5 w-3.5" /> Export Audit Trail (JSON)
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by action, actor, resource, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* Adaptive Table */}
        <div className="sm:hidden space-y-2.5">
          {filteredLogs.map((l) => (
            <div
              key={l.id}
              onClick={() => setSelectedLog(l)}
              className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-xs text-foreground">{l.action}</span>
                <Badge
                  variant={l.status === "success" ? "success" : "warning"}
                  className="text-[9px] uppercase px-1 py-0 shrink-0"
                >
                  {l.status}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2">{l.details}</p>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                <span>Actor: {l.actorName} ({l.actorRole})</span>
                <span>{l.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 pl-5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 pl-5 font-mono text-muted-foreground text-[11px]">
                    {l.timestamp}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-foreground">{l.actorName}</p>
                    <p className="text-[10px] text-muted-foreground">{l.actorRole}</p>
                  </td>
                  <td className="p-3.5 font-semibold text-foreground">{l.action}</td>
                  <td className="p-3.5 text-muted-foreground font-medium">{l.targetResource}</td>
                  <td className="p-3.5 font-mono text-[11px] text-muted-foreground">{l.ipAddress}</td>
                  <td className="p-3.5 text-center">
                    <Badge
                      variant={l.status === "success" ? "success" : "warning"}
                      className="text-[10px] font-bold"
                    >
                      {l.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedLog(l)}
                      className="h-7 text-xs px-2 text-primary hover:text-primary"
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* JSON Detail Modal */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-lg p-6 rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" /> Audit Event Payload
              </DialogTitle>
              <DialogDescription className="text-xs">
                Immutable event record ID: {selectedLog?.id}
              </DialogDescription>
            </DialogHeader>

            {selectedLog && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1.5 font-mono text-[11px]">
                  <div><strong>Action:</strong> {selectedLog.action}</div>
                  <div><strong>Actor:</strong> {selectedLog.actorName} ({selectedLog.actorRole})</div>
                  <div><strong>Target:</strong> {selectedLog.targetResource}</div>
                  <div><strong>IP:</strong> {selectedLog.ipAddress}</div>
                  <div><strong>Timestamp:</strong> {selectedLog.timestamp}</div>
                  <div><strong>Details:</strong> {selectedLog.details}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
