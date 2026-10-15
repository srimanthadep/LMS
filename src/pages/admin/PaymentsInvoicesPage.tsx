import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Tag,
  Eye,
  AlertTriangle,
  RotateCw,
  FileText,
  Mail,
  Send,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
} from "lucide-react";
import { RupeeIcon } from "@/components/icons/RupeeIcon";
import { mockDataService } from "@/services/mockDataService";
import { PaymentTransaction } from "@/types/lms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  validUntil: string;
  status: "active" | "expired";
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cpn-1",
    code: "EARLYBIRD20",
    discountPercent: 20,
    maxUses: 100,
    usedCount: 64,
    validUntil: "2026-11-30",
    status: "active",
  },
  {
    id: "cpn-2",
    code: "AIENGINEER15",
    discountPercent: 15,
    maxUses: 200,
    usedCount: 142,
    validUntil: "2026-12-31",
    status: "active",
  },
  {
    id: "cpn-3",
    code: "DIWALI5000",
    discountPercent: 25,
    maxUses: 50,
    usedCount: 50,
    validUntil: "2026-10-10",
    status: "expired",
  },
];

export const PaymentsInvoicesPage: React.FC = () => {
  const [txns, setTxns] = useState<PaymentTransaction[]>(mockDataService.getTransactions());
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"transactions" | "invoices" | "coupons" | "reconciliation">("transactions");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected Transaction for Invoice Modal
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);

  // Create Coupon Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("15");
  const [maxUses, setMaxUses] = useState("100");
  const [validUntil, setValidUntil] = useState("2026-12-31");

  const { addNotification } = useNotifications();

  const filteredTxns = txns.filter((t) => {
    const matchesSearch =
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.paymentId.toLowerCase().includes(search.toLowerCase()) ||
      t.courseTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "captured" && t.status === "captured") ||
      (statusFilter === "failed" && t.status === "failed") ||
      (statusFilter === "refunded" && t.status === "refunded");
    return matchesSearch && matchesStatus;
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: couponCode.toUpperCase(),
      discountPercent: parseInt(discountPercent) || 10,
      maxUses: parseInt(maxUses) || 50,
      usedCount: 0,
      validUntil,
      status: "active",
    };

    setCoupons([newCoupon, ...coupons]);
    setCouponCode("");
    setCouponModalOpen(false);
    addNotification({
      title: "Discount Coupon Published",
      message: `Coupon code "${newCoupon.code}" (${newCoupon.discountPercent}% OFF) is live on Razorpay checkout.`,
      type: "payment",
    });
  };

  const handleResendInvoice = (txn: PaymentTransaction) => {
    addNotification({
      title: "Invoice Dispatched",
      message: `Tax invoice for ${txn.orderId} emailed to ${txn.studentEmail}.`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" /> Tuition Payments, Invoices & Coupons
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Razorpay live settlement tracking, GST-compliant tax invoices (₹), promotional discount vouchers, and refund operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCouponModalOpen(true)}
            className="text-xs h-9 font-bold gap-1"
          >
            <Tag className="h-3.5 w-3.5 text-primary" /> Create Coupon
          </Button>
          <Button size="sm" className="text-xs h-9 font-bold gap-1 shadow-xs">
            <Download className="h-3.5 w-3.5" /> Export GST Report
          </Button>
        </div>
      </div>

      {/* Financial Summary Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Collections (Gross)</span>
          <div className="text-lg font-extrabold text-foreground mt-0.5 flex items-center">
            <RupeeIcon className="h-4 w-4 mr-0.5" /> 18,45,000
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+18% this month</span>
        </div>
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Net Settlements (Bank)</span>
          <div className="text-lg font-extrabold text-foreground mt-0.5 flex items-center">
            <RupeeIcon className="h-4 w-4 mr-0.5" /> 17,98,875
          </div>
          <span className="text-[10px] text-muted-foreground">Post Razorpay MDR (2%)</span>
        </div>
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Active Coupons</span>
          <div className="text-lg font-extrabold text-foreground mt-0.5">
            {coupons.filter((c) => c.status === "active").length} Active Codes
          </div>
          <span className="text-[10px] text-primary font-bold">206 Total Redemptions</span>
        </div>
        <div className="p-3.5 rounded-2xl border border-border/80 bg-card">
          <span className="text-[11px] text-muted-foreground font-semibold">Pending Invoices / Dues</span>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center">
            <RupeeIcon className="h-4 w-4 mr-0.5" /> 1,24,500
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">6 Students Pending</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/70 gap-2">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "transactions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="h-4 w-4" /> Transactions ({txns.length})
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "coupons"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Tag className="h-4 w-4" /> Coupons & Discounts ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab("reconciliation")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "reconciliation"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-4 w-4" /> Razorpay Reconciliation & MDR
        </button>
      </div>

      {/* TAB 1: Transactions Table */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student, order ID, or payment ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              {["all", "captured", "failed", "refunded"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition-colors font-medium border ${
                    statusFilter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border/70 hover:bg-muted/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Date</th>
                    <th className="p-3.5">Learner</th>
                    <th className="p-3.5">Course Program</th>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5 font-mono">Order Reference</th>
                    <th className="p-3.5 text-right">Amount (₹)</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 pr-5 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTxns.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 pl-5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {t.date}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-foreground text-sm">{t.studentName}</p>
                        <p className="text-[11px] text-muted-foreground">{t.studentEmail}</p>
                      </td>
                      <td className="p-3.5 text-foreground font-semibold">{t.courseTitle}</td>
                      <td className="p-3.5 text-muted-foreground font-medium">{t.method}</td>
                      <td className="p-3.5 font-mono text-[11px] text-muted-foreground">{t.orderId}</td>
                      <td className="p-3.5 text-right font-bold text-foreground font-mono text-sm">
                        ₹{t.amountRupees.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={t.status === "captured" ? "success" : t.status === "failed" ? "destructive" : "warning"}
                          className="text-[10px] font-bold uppercase"
                        >
                          {t.status === "captured" && <CheckCircle2 className="h-3 w-3 mr-1 inline" />}
                          {t.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 pr-5 text-right space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTxn(t)}
                          className="h-7 text-xs font-semibold gap-1 text-primary border-primary/30 hover:bg-primary/10"
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResendInvoice(t)}
                          className="h-7 text-xs text-muted-foreground hover:text-foreground"
                          title="Resend to Email"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Coupons */}
      {activeTab === "coupons" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Promotional discount coupons applied at Razorpay checkout.
            </p>
            <Button
              size="sm"
              onClick={() => setCouponModalOpen(true)}
              className="text-xs h-8 font-bold gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Create Coupon
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <Card key={c.id} className="p-4 rounded-2xl border-border/80 bg-card space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-extrabold text-base text-primary tracking-wide">
                      {c.code}
                    </span>
                    <Badge variant={c.status === "active" ? "success" : "outline"} className="text-[9px] uppercase ml-2">
                      {c.status}
                    </Badge>
                  </div>
                  <span className="font-extrabold text-lg text-foreground font-mono">
                    {c.discountPercent}% OFF
                  </span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Usage:</span>
                    <strong className="text-foreground">{c.usedCount} / {c.maxUses} used</strong>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span>Expiry:</span>
                    <span className="font-mono">{c.validUntil}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Razorpay Reconciliation */}
      {activeTab === "reconciliation" && (
        <Card className="rounded-2xl border-border/80 shadow-xs max-w-2xl">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Razorpay Settlement Reconciliation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="space-y-3 divide-y divide-border/60">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-muted-foreground">Connected Payment Gateway:</span>
                <span className="font-bold text-foreground">Razorpay (Live Production)</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-muted-foreground">Merchant ID:</span>
                <span className="font-mono text-foreground font-bold">rzp_live_K8900124</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-muted-foreground">Payment Settlement Cycle:</span>
                <span className="font-bold text-foreground">T+1 Business Days</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-muted-foreground">Standard MDR Deductions:</span>
                <span className="font-bold text-foreground">2.0% + 18% GST on fee</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-muted-foreground">Last Bank Settlement:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ₹4,20,500 settled on Oct 14, 2026
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1">
                <Download className="h-3.5 w-3.5" /> Download Reconciliation Statement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CREATE COUPON MODAL */}
      <Dialog open={couponModalOpen} onOpenChange={setCouponModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Tag className="h-5 w-5 text-primary" /> Create Discount Coupon
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure checkout coupon code and percentage discount for student registrations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-semibold text-foreground">Coupon Code</label>
              <Input
                placeholder="e.g. FESTIVE25"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="mt-1 h-9 text-xs font-mono font-bold uppercase"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-foreground">Discount Percentage (%)</label>
                <Input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Max Redemptions</label>
                <Input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-foreground">Valid Until</label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-border/60">
              <Button type="button" size="sm" variant="outline" onClick={() => setCouponModalOpen(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-bold px-4">
                Publish Coupon
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* INVOICE PREVIEW MODAL */}
      <Dialog open={!!selectedTxn} onOpenChange={(open) => !open && setSelectedTxn(null)}>
        {selectedTxn && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <FileText className="h-5 w-5 text-primary" /> Tax Invoice & Receipt
              </DialogTitle>
              <DialogDescription className="text-xs">
                GST-compliant receipt for Razorpay Order <span className="font-mono text-foreground font-bold">{selectedTxn.orderId}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs pt-2">
              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-foreground">Apex AI LMS Inc.</span>
                  <Badge variant="success" className="text-[9px]">PAID</Badge>
                </div>
                <div className="text-[11px] text-muted-foreground">GSTIN: 29AABCU9603R1ZM</div>
                <div className="border-t border-border/60 pt-2 space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Student:</span>
                    <strong className="text-foreground">{selectedTxn.studentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Program:</span>
                    <strong className="text-foreground">{selectedTxn.courseTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{selectedTxn.date}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-foreground pt-1 border-t border-border/60">
                    <span>Total Amount Paid:</span>
                    <span>₹{selectedTxn.amountRupees.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResendInvoice(selectedTxn)}
                  className="h-8 text-xs font-semibold gap-1"
                >
                  <Mail className="h-3.5 w-3.5" /> Email to Student
                </Button>
                <Button size="sm" className="h-8 text-xs font-bold gap-1 px-4">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
