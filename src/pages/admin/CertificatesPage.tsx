import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Award,
  Plus,
  CheckCircle2,
  Download,
  Search,
  ShieldCheck,
  QrCode,
  Settings,
  RefreshCw,
  ExternalLink,
  Edit2,
  Sliders,
  Users,
  Check,
  AlertTriangle,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { CertificateRecord } from "@/types/lms";
import { useNotifications } from "@/context/NotificationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const CertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<CertificateRecord[]>(mockDataService.getCertificates());
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"directory" | "eligible" | "rules">("directory");
  const { addNotification } = useNotifications();

  // Verification & Reissue Modals
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [reissueCert, setReissueCert] = useState<CertificateRecord | null>(null);
  const [correctedName, setCorrectedName] = useState("");
  const [reissueReason, setReissueReason] = useState("");

  // Certificate Completion Rules State
  const [rules, setRules] = useState({
    minAttendancePercent: 80,
    minCapstoneScore: 75,
    evaluatorClearanceRequired: true,
    autoIssueOnCompletion: false,
    includeDistinctionBadge: true,
  });

  // Eligible students pending certificate generation
  const [eligibleStudents, setEligibleStudents] = useState([
    {
      id: "elig-1",
      name: "Rhea Sen",
      email: "rhea.sen@example.com",
      batch: "Batch 2026-A (Weekend)",
      attendance: 94,
      capstoneScore: 88,
      status: "Ready to Issue",
    },
    {
      id: "elig-2",
      name: "Manoj Nambiar",
      email: "manoj.n@example.com",
      batch: "Batch 2026-A (Weekend)",
      attendance: 86,
      capstoneScore: 82,
      status: "Ready to Issue",
    },
    {
      id: "elig-3",
      name: "Divya Krishnan",
      email: "divya.k@example.com",
      batch: "Agentic Systems Bootcamp",
      attendance: 92,
      capstoneScore: 91,
      status: "Ready to Issue",
    },
  ]);

  const filteredCerts = certs.filter(
    (c) =>
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleIssueSingle = (studentId: string, studentName: string) => {
    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      studentId,
      studentName,
      courseTitle: "Full-Stack AI & LLM Systems Engineering",
      batchName: "Batch 2026-A",
      issueDate: "2026-10-15",
      certificateNumber: `APX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationCode: `VRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      gradeAwarded: "Distinction (95%)",
    };

    setCerts([newCert, ...certs]);
    setEligibleStudents((prev) => prev.filter((s) => s.id !== studentId));
    addNotification({
      title: "Certificate Dispatched",
      message: `Verifiable credential issued to ${studentName}.`,
      type: "grade",
    });
  };

  const handleReissueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reissueCert) return;

    setCerts((prev) =>
      prev.map((c) =>
        c.id === reissueCert.id
          ? {
              ...c,
              studentName: correctedName || c.studentName,
              verificationCode: `VRF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            }
          : c
      )
    );

    addNotification({
      title: "Certificate Reissued",
      message: `Reissued certificate with updated credentials for ${correctedName || reissueCert.studentName}.`,
      type: "system",
    });

    setReissueCert(null);
    setCorrectedName("");
    setReissueReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" /> Certificate Management & Verifiable Credentials
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure completion rules, review eligible students, issue tamper-evident graduation certificates, and handle reissue requests.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setActiveTab("eligible")}
          className="text-xs h-9 font-bold gap-1 shadow-xs shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Issue Eligible Credentials ({eligibleStudents.length})
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/70 gap-2">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "directory"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="h-4 w-4" /> Issued Credentials ({certs.length})
        </button>
        <button
          onClick={() => setActiveTab("eligible")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "eligible"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" /> Eligible Students ({eligibleStudents.length})
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "rules"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders className="h-4 w-4" /> Completion Rules & Templates
        </button>
      </div>

      {/* TAB 1: Issued Directory */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student, certificate #, or verification code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCerts.map((c) => (
              <Card key={c.id} className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <Badge variant="success" className="text-[10px] font-bold">
                    <ShieldCheck className="h-3 w-3 mr-1 inline" /> Verifiable
                  </Badge>
                </div>

                <div>
                  <p className="text-[11px] font-mono text-muted-foreground">{c.certificateNumber}</p>
                  <h3 className="font-bold text-base text-foreground mt-0.5">{c.studentName}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.courseTitle}</p>
                  <p className="text-[11px] text-primary font-bold mt-1">{c.gradeAwarded}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs flex justify-between items-center font-mono">
                  <span className="text-[10px] text-muted-foreground">Verification Code:</span>
                  <span className="font-bold text-foreground">{c.verificationCode}</span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-border/60">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCert(c)}
                    className="flex-1 text-xs h-8 gap-1 font-semibold"
                  >
                    <QrCode className="h-3 w-3" /> Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReissueCert(c);
                      setCorrectedName(c.studentName);
                    }}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    title="Reissue / Correct"
                  >
                    <Edit2 className="h-3 w-3" /> Reissue
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Eligible Students */}
      {activeTab === "eligible" && (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Students Eligible for Graduation Credentials
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Learners meeting both minimum attendance (80%) and capstone assessment benchmarks.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Student Learner</th>
                    <th className="p-3.5">Cohort Batch</th>
                    <th className="p-3.5 text-center">Attendance %</th>
                    <th className="p-3.5 text-center">Capstone Score</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {eligibleStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        All eligible learners have been awarded credentials.
                      </td>
                    </tr>
                  ) : (
                    eligibleStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-foreground">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground">{s.email}</div>
                        </td>
                        <td className="p-3.5 font-medium text-foreground">{s.batch}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {s.attendance}%
                        </td>
                        <td className="p-3.5 text-center font-bold font-mono text-foreground">
                          {s.capstoneScore}/100
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                            {s.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleIssueSingle(s.id, s.name)}
                            className="h-7 text-xs font-bold gap-1 shadow-xs"
                          >
                            <Award className="h-3 w-3" /> Issue Credential
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Completion Rules */}
      {activeTab === "rules" && (
        <Card className="rounded-2xl border-border/80 shadow-xs max-w-2xl">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" /> Certificate Issuance Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-foreground">Minimum Class Attendance (%)</label>
                <Input
                  type="number"
                  value={rules.minAttendancePercent}
                  onChange={(e) => setRules({ ...rules, minAttendancePercent: parseInt(e.target.value) || 0 })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Minimum Capstone Score (Marks)</label>
                <Input
                  type="number"
                  value={rules.minCapstoneScore}
                  onChange={(e) => setRules({ ...rules, minCapstoneScore: parseInt(e.target.value) || 0 })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3 divide-y divide-border/60">
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Require Evaluator Sign-off</div>
                  <div className="text-[11px] text-muted-foreground">Capstone project code must have approved evaluator rubric.</div>
                </div>
                <input
                  type="checkbox"
                  checked={rules.evaluatorClearanceRequired}
                  onChange={(e) => setRules({ ...rules, evaluatorClearanceRequired: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
              </div>
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Include Distinction Honors Badge</div>
                  <div className="text-[11px] text-muted-foreground">Display gold seal on certificate for students scoring &gt;= 90%.</div>
                </div>
                <input
                  type="checkbox"
                  checked={rules.includeDistinctionBadge}
                  onChange={(e) => setRules({ ...rules, includeDistinctionBadge: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                size="sm"
                onClick={() =>
                  addNotification({
                    title: "Rules Updated",
                    message: "Certificate qualification policies saved.",
                    type: "system",
                  })
                }
                className="h-8 text-xs font-bold gap-1 px-4"
              >
                <Check className="h-3.5 w-3.5" /> Save Policies
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* VERIFICATION DETAIL MODAL */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        {selectedCert && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <ShieldCheck className="h-5 w-5 text-emerald-600" /> Verifiable Credential Record
              </DialogTitle>
              <DialogDescription className="text-xs">
                Public blockchain/cryptographic signature verification.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-2">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-center space-y-2">
                <Award className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-base font-extrabold text-foreground">{selectedCert.studentName}</h3>
                <p className="text-xs text-muted-foreground">{selectedCert.courseTitle}</p>
                <Badge variant="outline" className="text-primary font-bold">
                  {selectedCert.gradeAwarded}
                </Badge>
              </div>

              <div className="space-y-1 text-muted-foreground text-[11px]">
                <div className="flex justify-between">
                  <span>Certificate ID:</span>
                  <span className="font-mono font-bold text-foreground">{selectedCert.certificateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification Code:</span>
                  <span className="font-mono font-bold text-foreground">{selectedCert.verificationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Issued Date:</span>
                  <span className="font-mono text-foreground">{selectedCert.issueDate}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedCert(null)} className="h-8 text-xs">
                  Close
                </Button>
                <Button size="sm" className="h-8 text-xs font-bold gap-1">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* REISSUE / CORRECT MODAL */}
      <Dialog open={!!reissueCert} onOpenChange={(open) => !open && setReissueCert(null)}>
        {reissueCert && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Edit2 className="h-5 w-5 text-primary" /> Reissue / Correct Credential
              </DialogTitle>
              <DialogDescription className="text-xs">
                Fix spelling or grade errors under an authorized operational workflow.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleReissueCertificate} className="space-y-3 text-xs pt-2">
              <div>
                <label className="font-semibold text-foreground">Recipient Full Name</label>
                <Input
                  value={correctedName}
                  onChange={(e) => setCorrectedName(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-foreground">Operational Justification / Ticket #</label>
                <Input
                  placeholder="e.g. Ticket #SUP-1082: Spelling fix on passport verification"
                  value={reissueReason}
                  onChange={(e) => setReissueReason(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5 inline mr-1 text-amber-600" />
                This invalidates the previous verification code and generates a new cryptographic hash.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border/60">
                <Button type="button" size="sm" variant="outline" onClick={() => setReissueCert(null)} className="h-8 text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs font-bold px-4">
                  Reissue Credential
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
