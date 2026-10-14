import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Save, Check, X, RotateCcw } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface PermissionRow {
  resource: string;
  superAdmin: boolean;
  admin: boolean;
  teacher: boolean;
  student: boolean;
  evaluator: boolean;
  support: boolean;
}

const INITIAL_PERMISSIONS: PermissionRow[] = [
  { resource: "System Integrations & API Keys", superAdmin: true, admin: false, teacher: false, student: false, evaluator: false, support: false },
  { resource: "LLM Costs & Token Allocation", superAdmin: true, admin: false, teacher: false, student: false, evaluator: false, support: false },
  { resource: "Course Creation & Archival", superAdmin: true, admin: true, teacher: false, student: false, evaluator: false, support: false },
  { resource: "Batch Entitlements & Pricing (₹)", superAdmin: true, admin: true, teacher: false, student: false, evaluator: false, support: false },
  { resource: "Live Lecture Broadcasting", superAdmin: true, admin: true, teacher: true, student: false, evaluator: false, support: false },
  { resource: "AI Chapters & Transcript Editing", superAdmin: true, admin: true, teacher: true, student: false, evaluator: false, support: false },
  { resource: "Student Doubt Answering", superAdmin: true, admin: true, teacher: true, student: false, evaluator: false, support: true },
  { resource: "Submission Grading & Rubrics", superAdmin: true, admin: true, teacher: true, student: false, evaluator: true, support: false },
  { resource: "Student 360 Full Profile View", superAdmin: true, admin: true, teacher: false, student: false, evaluator: false, support: true },
  { resource: "Batch Move & Validity Extension Approvals", superAdmin: true, admin: true, teacher: false, student: false, evaluator: false, support: false },
  { resource: "Payment Gateway Logs & Invoices", superAdmin: true, admin: true, teacher: false, student: false, evaluator: false, support: false },
  { resource: "Immutable Security Audit Inspection", superAdmin: true, admin: false, teacher: false, student: false, evaluator: false, support: false },
];

export const RolePermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionRow[]>(INITIAL_PERMISSIONS);
  const [isSaved, setIsSaved] = useState(false);
  const { addNotification } = useNotifications();

  const handleToggle = (rowIndex: number, roleKey: keyof PermissionRow) => {
    if (roleKey === "superAdmin") return; // Super admin always maintains full security
    const updated = [...permissions];
    (updated[rowIndex] as any)[roleKey] = !(updated[rowIndex] as any)[roleKey];
    setPermissions(updated);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    addNotification({
      title: "Permission Matrix Saved",
      message: "Security privileges updated across all six platform roles.",
      type: "system",
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" /> Role & Permission Matrix
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Enforce least-privilege security boundaries across resources and sensitive actions.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs h-9 font-bold gap-1.5 shadow-sm shrink-0"
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {isSaved ? "Saved Successfully" : "Commit Matrix Changes"}
          </Button>
        </div>

        <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
          <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold">
                Granular Resource Permissions
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Click any cell to toggle authorization. Super Admin permissions remain fixed by security policy.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto sleek-scrollbar">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-bold">
                <tr>
                  <th className="p-3.5 pl-5">Protected Resource / Action</th>
                  <th className="p-3.5 text-center">Super Admin</th>
                  <th className="p-3.5 text-center">Admin</th>
                  <th className="p-3.5 text-center">Teacher</th>
                  <th className="p-3.5 text-center">Student</th>
                  <th className="p-3.5 text-center">Evaluator</th>
                  <th className="p-3.5 pr-5 text-center">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {permissions.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 pl-5 font-semibold text-foreground">
                      {row.resource}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </td>
                    {(["admin", "teacher", "student", "evaluator", "support"] as (keyof PermissionRow)[]).map((rKey) => {
                      const enabled = row[rKey] as boolean;
                      return (
                        <td key={rKey} className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(idx, rKey)}
                            className={`inline-flex items-center justify-center h-6 w-6 rounded-md transition-all ${
                              enabled
                                ? "bg-primary text-primary-foreground shadow-2xs hover:scale-105"
                                : "bg-muted text-muted-foreground/60 hover:bg-muted/80"
                            }`}
                          >
                            {enabled ? <Check className="h-3.5 w-3.5" /> : <X className="h-3 w-3" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
  );
};
