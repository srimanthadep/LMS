import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Shield,
  Download,
  Filter,
  Eye,
  Calendar,
  User,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { mockDataService } from "@/services/mockDataService";
import { AuditLogEntry } from "@/types/lms";

// Operational specific audit log events
const initialOperationalLogs: (AuditLogEntry & {
  actorId?: string;
  category: "enrollment" | "grading" | "payment" | "access" | "batch";
  beforeState?: string;
  afterState?: string;
  reason?: string;
})[] = [
  {
    id: "aud-op-001",
    timestamp: "2026-10-15 10:14:22",
    actorId: "usr-admin-01",
    actorName: "Priya Sharma",
    actorRole: "Admin",
    action: "BATCH_TRANSFER_APPROVED",
    targetResource: "Student: Rahul Verma (STU-1049)",
    category: "enrollment",
    status: "success",
    ipAddress: "192.168.1.104",
    details: "Approved batch transfer from Batch 2026-A to Batch 2026-B due to weekday conflict.",
    beforeState: "Batch: GenAI Foundations (2026-A)",
    afterState: "Batch: GenAI Advanced & Agents (2026-B)",
    reason: "Student submitted schedule conflict request approved by Academic Dean.",
  },
  {
    id: "aud-op-002",
    timestamp: "2026-10-15 09:42:15",
    actorId: "usr-admin-01",
    actorName: "Priya Sharma",
    actorRole: "Admin",
    action: "ACCESS_EXTENSION_GRANTED",
    targetResource: "Enrollment: ENR-8841 (Neha Gupta)",
    category: "access",
    status: "success",
    ipAddress: "192.168.1.104",
    details: "Extended LMS replay access by +30 days following verified medical leave request.",
    beforeState: "Expiry: 2026-11-01",
    afterState: "Expiry: 2026-12-01",
    reason: "Medical leave verification verified via ticket #MED-4091.",
  },
  {
    id: "aud-op-003",
    timestamp: "2026-10-14 18:30:00",
    actorId: "usr-admin-02",
    actorName: "Karan Johar",
    actorRole: "Admin",
    action: "GRADE_OVERRIDE_RECORDED",
    targetResource: "Assessment: ASM-LangChain-02 (Arjun Patel)",
    category: "grading",
    status: "success",
    ipAddress: "192.168.1.189",
    details: "Manual score adjustment of +5 marks following lead instructor re-evaluation.",
    beforeState: "Score: 78/100 (B+)",
    afterState: "Score: 83/100 (A-)",
    reason: "Lead teacher Dr. Ramesh approved rubric reconsideration on Code Execution criteria.",
  },
  {
    id: "aud-op-004",
    timestamp: "2026-10-14 14:15:33",
    actorId: "usr-admin-01",
    actorName: "Priya Sharma",
    actorRole: "Admin",
    action: "REFUND_REQUEST_AUTHORIZED",
    targetResource: "Transaction: TXN-RZP-9921 (Vikram Rao)",
    category: "payment",
    status: "success",
    ipAddress: "192.168.1.104",
    details: "Authorized 100% money-back guarantee within 7-day introductory trial window.",
    beforeState: "Status: Paid (₹24,999)",
    afterState: "Status: Refund Processing (₹24,999)",
    reason: "Student exercised 7-day satisfaction guarantee prior to module 2 release.",
  },
  {
    id: "aud-op-005",
    timestamp: "2026-10-14 11:05:10",
    actorId: "usr-admin-01",
    actorName: "Priya Sharma",
    actorRole: "Admin",
    action: "ENTITLEMENT_TYPE_CHANGED",
    targetResource: "Student: Devika Soni (STU-2091)",
    category: "access",
    status: "success",
    ipAddress: "192.168.1.104",
    details: "Upgraded enrollment tier from 'Replay Only' to 'Live + Replay'.",
    beforeState: "Tier: Replay Only (₹14,999)",
    afterState: "Tier: Live + Replay (₹24,999)",
    reason: "Tuition difference settled via payment link TXN-RZP-9950.",
  },
  {
    id: "aud-op-006",
    timestamp: "2026-10-13 16:50:22",
    actorId: "usr-admin-02",
    actorName: "Karan Johar",
    actorRole: "Admin",
    action: "RECORDING_DELAY_OVERRIDE",
    targetResource: "Batch: Autonomous AI Agents (2026-Alpha)",
    category: "batch",
    status: "success",
    ipAddress: "192.168.1.189",
    details: "Temporary reduction of recording publication delay from 24h to 2h for hackathon prep.",
    beforeState: "Delay: 24 Hours",
    afterState: "Delay: 2 Hours",
    reason: "Hackathon sprint weekend batch requested immediate lecture replays.",
  },
];

export const AdminAuditLogPage: React.FC = () => {
  const [logs] = useState(initialOperationalLogs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<(typeof initialOperationalLogs)[0] | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || l.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const exportAuditCSV = () => {
    const headers = "ID,Timestamp,Actor,Role,Action,Target,Category,Status,Reason,Details\n";
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.targetResource}","${l.category}","${l.status}","${l.reason || ""}","${l.details}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `operational_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with read-only badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" /> Operational Audit Viewer
            </h1>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] font-bold">
              <Lock className="h-3 w-3 mr-1" /> READ-ONLY
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Immutable operational records tracking student enrollments, batch transfers, grade adjustments, and fee overrides.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={exportAuditCSV}
          className="text-xs h-9 font-bold gap-1.5 shrink-0 hover:bg-primary/5 hover:text-primary border-border/80"
        >
          <Download className="h-3.5 w-3.5" /> Export Report (CSV)
        </Button>
      </div>

      {/* Compliance Notice */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200">
          <span className="font-bold">Administrative Compliance Policy:</span> All operational interventions require explicit justifications and are signed with your authenticated Staff ID. Operational audit records are cryptographically verified and cannot be edited or erased by administrative accounts.
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, action, operator or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Operations" },
            { id: "enrollment", label: "Enrollments" },
            { id: "access", label: "Access & Expiry" },
            { id: "grading", label: "Grade Overrides" },
            { id: "payment", label: "Refunds & Payments" },
            { id: "batch", label: "Batch Config" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium border ${
                categoryFilter === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border/70 hover:bg-muted/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 pl-5">Timestamp</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No operational audit events match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{log.actorName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{log.actorId}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[11px] font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-foreground max-w-[200px] truncate" title={log.targetResource}>
                      {log.targetResource}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="capitalize text-[10px] border-border/80">
                        {log.category}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge variant="success" className="text-[10px] px-1.5 py-0.5 uppercase">
                        {log.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedLog(log)}
                        className="h-7 text-xs gap-1 font-bold text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Event Details Inspection Modal */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        {selectedLog && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <FileText className="h-5 w-5 text-primary" /> Audit Event Details
              </DialogTitle>
              <DialogDescription className="text-xs">
                Immutable event record ID: <span className="font-mono text-foreground font-bold">{selectedLog.id}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs pt-2">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <div>
                  <div className="text-muted-foreground text-[11px]">Timestamp (UTC+5:30)</div>
                  <div className="font-semibold font-mono text-foreground mt-0.5">{selectedLog.timestamp}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[11px]">Operator</div>
                  <div className="font-semibold text-foreground mt-0.5">
                    {selectedLog.actorName} ({selectedLog.actorRole})
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[11px]">Action Type</div>
                  <div className="font-mono font-bold text-primary mt-0.5">{selectedLog.action}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[11px]">Network IP</div>
                  <div className="font-mono text-foreground mt-0.5">{selectedLog.ipAddress}</div>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground text-[11px] font-semibold">Target Resource</label>
                <div className="mt-1 p-2.5 rounded-lg bg-card border border-border/80 font-mono text-[11px] text-foreground">
                  {selectedLog.targetResource}
                </div>
              </div>

              <div>
                <label className="text-muted-foreground text-[11px] font-semibold">Execution Description</label>
                <div className="mt-1 p-2.5 rounded-lg bg-card border border-border/80 text-foreground">
                  {selectedLog.details}
                </div>
              </div>

              {selectedLog.reason && (
                <div>
                  <label className="text-muted-foreground text-[11px] font-semibold">Mandatory Operational Justification</label>
                  <div className="mt-1 p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-foreground font-medium">
                    "{selectedLog.reason}"
                  </div>
                </div>
              )}

              {(selectedLog.beforeState || selectedLog.afterState) && (
                <div>
                  <label className="text-muted-foreground text-[11px] font-semibold">State Transition Snapshot</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                      <div className="text-[10px] text-muted-foreground font-bold uppercase">Before Change</div>
                      <div className="text-[11px] font-mono text-foreground mt-1">{selectedLog.beforeState || "N/A"}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="text-[10px] text-primary font-bold uppercase">After Change</div>
                      <div className="text-[11px] font-mono text-primary font-bold mt-1">{selectedLog.afterState || "N/A"}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => setSelectedLog(null)} className="h-8 text-xs font-bold px-4">
                  Close Inspection
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
