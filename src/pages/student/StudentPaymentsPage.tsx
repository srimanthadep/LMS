import React, { useState } from "react";
import {
  CreditCard,
  Download,
  CheckCircle2,
  Receipt,
  Eye,
  Calendar,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { PaymentTransaction } from "@/types/lms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RupeeIcon } from "@/components/icons/RupeeIcon";

export const StudentPaymentsPage: React.FC = () => {
  const transactions = mockDataService.getTransactions();
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);

  const formatRupees = (amount: number) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Fee Receipts & Invoices
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review cohort tuition receipts, payment gateways, and GST tax invoices.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-xs text-muted-foreground">Total Tuition Invested</span>
          <div className="text-2xl font-bold text-foreground flex items-center">
            <RupeeIcon className="h-5 w-5 mr-1" />
            {formatRupees(
              transactions.reduce((acc, curr) => acc + (curr.amountRupees || 0), 0)
            )}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Fully Cleared
          </span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs text-muted-foreground">Active Subscriptions</span>
          <div className="text-2xl font-bold text-foreground">1 Cohort</div>
          <span className="text-[11px] text-muted-foreground">
            Cohort 7 (Live + Replay)
          </span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs text-muted-foreground">Payment Gateway</span>
          <div className="text-2xl font-bold text-foreground">Razorpay</div>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-primary" /> 256-bit Encrypted
          </span>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-base font-bold text-foreground">
            Transaction History
          </CardTitle>
          <CardDescription className="text-xs">
            Official GST invoices compliant with Indian tax regulations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {txn.invoiceNumber}
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                      Paid
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {txn.courseTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {txn.batchName} • Via {txn.method}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-left md:text-right">
                    <div className="text-lg font-bold text-foreground flex items-center md:justify-end">
                      <RupeeIcon className="h-4 w-4 mr-0.5" />
                      {formatRupees(txn.amountRupees)}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {txn.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTxn(txn)}
                      className="gap-1.5 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs text-primary"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      <Dialog open={!!selectedTxn} onOpenChange={() => setSelectedTxn(null)}>
        {selectedTxn && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Tax Invoice {selectedTxn.invoiceNumber}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/40 rounded-xl">
                <div>
                  <span className="text-muted-foreground">Billed To:</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedTxn.studentName}</p>
                  <p className="text-muted-foreground">{selectedTxn.studentEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">Date of Transaction:</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedTxn.date}</p>
                  <p className="font-mono text-muted-foreground">{selectedTxn.paymentId}</p>
                </div>
              </div>

              {/* Price computation */}
              <div className="rounded-xl border border-border p-4 space-y-2">
                <div className="flex justify-between font-medium">
                  <span>{selectedTxn.courseTitle} ({selectedTxn.batchName})</span>
                  <span>₹{formatRupees(Math.round(selectedTxn.amountRupees / 1.18))}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>CGST (9%)</span>
                  <span>₹{formatRupees(Math.round((selectedTxn.amountRupees * 0.09) / 1.18))}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SGST (9%)</span>
                  <span>₹{formatRupees(Math.round((selectedTxn.amountRupees * 0.09) / 1.18))}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border">
                  <span>Total Amount Paid</span>
                  <span className="text-primary">₹{formatRupees(selectedTxn.amountRupees)}</span>
                </div>
              </div>

              <div className="text-center text-[11px] text-muted-foreground">
                GSTIN: 27AABCT3518Q1ZP • Razorpay Payment ID: {selectedTxn.paymentId}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
