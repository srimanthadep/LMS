import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Search, Plus, Download, CheckCircle2, Tag } from "lucide-react";
import { RupeeIcon } from "@/components/icons/RupeeIcon";
import { mockDataService } from "@/services/mockDataService";
import { PaymentTransaction } from "@/types/lms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";

export const PaymentsInvoicesPage: React.FC = () => {
  const [txns] = useState<PaymentTransaction[]>(mockDataService.getTransactions());
  const [search, setSearch] = useState("");
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("15");
  const { addNotification } = useNotifications();

  const filteredTxns = txns.filter(
    (t) =>
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.paymentId.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    addNotification({
      title: "Discount Coupon Published",
      message: `Coupon code "${couponCode.toUpperCase()}" (${discountPercent}% OFF) is now live on Razorpay checkout.`,
      type: "payment",
    });
    setCouponCode("");
    setCouponModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" /> Tuition Payments, Invoices & Coupons
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Razorpay order reconciliation, GST tax invoices (₹), and promotional discount vouchers.
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
            <Button size="sm" className="text-xs h-9 font-bold gap-1 shadow-sm">
              <Download className="h-3.5 w-3.5" /> Export GST Report
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, order ID, or payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* Adaptive Table */}
        <div className="sm:hidden space-y-2.5">
          {filteredTxns.map((t) => (
            <div key={t.id} className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm text-foreground">{t.studentName}</p>
                  <p className="text-[11px] text-muted-foreground">{t.courseTitle}</p>
                </div>
                <span className="font-mono font-bold text-sm text-primary">
                  ₹{t.amountRupees.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>Order: <span className="font-mono text-foreground">{t.orderId}</span></p>
                <p>Method: {t.method}</p>
                <p>Date: {t.date}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/60 text-xs">
                <Badge variant="success" className="text-[10px] font-bold">Captured</Badge>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary gap-1">
                  <Download className="h-3 w-3" /> Invoice
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 pl-5">Date</th>
                <th className="p-3.5">Learner</th>
                <th className="p-3.5">Course Program</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5 font-mono">Razorpay Order ID</th>
                <th className="p-3.5 text-right">Amount (₹)</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 pl-5 font-mono text-[11px] text-muted-foreground">{t.date}</td>
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
                    <Badge variant="success" className="text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Captured
                    </Badge>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <Button size="sm" variant="outline" className="h-7 text-xs font-semibold gap-1 text-primary">
                      <Download className="h-3 w-3" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Create Discount Coupon */}
        <Dialog open={couponModalOpen} onOpenChange={setCouponModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Generate Discount Coupon</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Deploy promotional promo codes applicable at Razorpay payment checkout.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Coupon Code</label>
                <Input
                  required
                  placeholder="e.g. AIAPEX15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-9 text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Discount Percentage (%)</label>
                <Input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setCouponModalOpen(false)} className="text-xs h-9">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs h-9 font-bold">
                  Deploy Coupon
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
