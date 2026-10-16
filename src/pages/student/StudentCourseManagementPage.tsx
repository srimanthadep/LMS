import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  BookOpen,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Video,
  FileCheck2,
  Search,
  Filter,
  Check,
  ExternalLink,
  MessageSquare,
  Mic,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { mockDataService } from "@/services/mockDataService";
import { Course } from "@/types/lms";
import { useNotifications } from "@/context/NotificationContext";

interface ExtendedCourse extends Course {
  instructorName: string;
  communicationSupport: string;
  prerequisites: string;
  targetRole: string;
  hasViva: boolean;
}

export const StudentCourseManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const rawCourses = mockDataService.getCourses();

  // Selected Course for Purchase Checkout Modal
  const [selectedCourse, setSelectedCourse] = useState<ExtendedCourse | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const catalogCourses: ExtendedCourse[] = rawCourses.map((c) => ({
    ...c,
    instructorName:
      c.id === "course-agentic-101"
        ? "Prof. Rajesh Verma"
        : c.id === "course-kv-cache"
          ? "Karthik Sundaram"
          : "Dr. Priya Sharma",
    communicationSupport:
      c.id === "course-agentic-101"
        ? "Included: Weekly 1:1 Faculty Viva, Technical Articulation & Presentation Drills"
        : "Included: Milestone Defense Viva & Architecture Presentation Evaluation",
    prerequisites: "Python 3.10+, Linear Algebra & Neural Network Fundamentals",
    targetRole: "Staff AI Engineer / Agentic Systems Architect",
    hasViva: true,
  }));

  const filteredCourses = catalogCourses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenPurchase = (course: ExtendedCourse) => {
    setSelectedCourse(course);
    setPurchaseComplete(false);
    setIsProcessing(false);
    setIsPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedCourse) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseComplete(true);

      addNotification({
        title: "Course Purchased Successfully",
        message: `Enrolled in "${selectedCourse.title}". Your receipt has been logged to Receipts & Fees.`,
        type: "system",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Compass className="h-6 w-6 text-primary" /> Course Management & Exploration
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Explore new engineering specializations, inspect curriculum structures, review pricing, and enroll with communication viva support.
          </p>
        </div>

        <Link to="/student/courses">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs h-9 self-start sm:self-auto">
            <BookOpen className="h-3.5 w-3.5 text-primary" /> View My Enrolled Courses
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl border-border/60 shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search available curriculum, instructor, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl text-xs w-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
            >
              <option value="All">All Categories</option>
              <option value="Agentic Systems">Agentic Systems</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Explore Courses / Purchase Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Available Specializations ({filteredCourses.length})
          </h2>
          <span className="text-xs text-muted-foreground">Includes live lab environments & 1:1 viva support</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="rounded-2xl border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm overflow-hidden"
            >
              <div>
                {/* Course Thumbnail Banner */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 right-3 text-[10px] bg-black/75 text-white font-bold backdrop-blur-xs">
                    {course.category}
                  </Badge>
                  <Badge className="absolute bottom-3 left-3 text-[10px] bg-primary/90 text-primary-foreground font-bold">
                    {course.level}
                  </Badge>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-foreground leading-snug line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Faculty: <strong className="text-foreground">{course.instructorName}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Structure */}
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Curriculum:</span>
                      <strong className="text-foreground">{course.modulesCount} Modules • {course.totalHours} Hours</strong>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Target Role:</span>
                      <span className="font-medium text-foreground truncate max-w-[150px]">{course.targetRole}</span>
                    </div>
                  </div>

                  {/* Communication Support Badge */}
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-[11px] text-foreground flex items-start gap-2">
                    <Mic className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="leading-tight">{course.communicationSupport}</span>
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase">Tuition Fee</span>
                      <span className="text-base font-extrabold text-foreground font-mono">
                        ₹{new Intl.NumberFormat("en-IN").format(course.priceRupees)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block uppercase">Cohort Rating</span>
                      <span className="text-xs font-bold text-amber-500 flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 fill-current" /> {course.rating} / 5.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenPurchase(course)}
                  className="flex-1 text-xs h-9 rounded-xl font-bold border-primary/40 text-primary hover:bg-primary/10"
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1" /> Enroll / Purchase
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenPurchase(course)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 rounded-xl"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* MODAL: EXPLORE & PURCHASE CHECKOUT */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          {selectedCourse && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {selectedCourse.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Tuition Checkout</span>
                </div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selectedCourse.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Review program structure, communication viva inclusions, and confirm enrollment.
                </DialogDescription>
              </DialogHeader>

              {!purchaseComplete ? (
                <div className="space-y-4 pt-1">
                  {/* Course Summary Box */}
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Faculty:</span>
                      <strong className="text-foreground">{selectedCourse.instructorName}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Course Structure:</span>
                      <strong className="text-foreground">{selectedCourse.modulesCount} Modules ({selectedCourse.totalHours} hrs)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Prerequisites:</span>
                      <span className="text-foreground text-right">{selectedCourse.prerequisites}</span>
                    </div>
                    <div className="flex items-start justify-between pt-1 border-t border-border/40">
                      <span className="text-muted-foreground">Communication Support:</span>
                      <span className="text-primary font-medium text-right max-w-[250px]">{selectedCourse.communicationSupport}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3 rounded-xl border text-xs text-center font-semibold transition-all ${paymentMethod === "upi"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-muted/40"
                          }`}
                      >
                        UPI / QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded-xl border text-xs text-center font-semibold transition-all ${paymentMethod === "card"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-muted/40"
                          }`}
                      >
                        Credit / Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`p-3 rounded-xl border text-xs text-center font-semibold transition-all ${paymentMethod === "netbanking"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 hover:bg-muted/40"
                          }`}
                      >
                        Net Banking
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Program Tuition:</span>
                      <span className="font-mono text-foreground font-semibold">
                        ₹{new Intl.NumberFormat("en-IN").format(selectedCourse.priceRupees)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">GST (18% Included):</span>
                      <span className="font-mono text-foreground">
                        ₹{new Intl.NumberFormat("en-IN").format(Math.round(selectedCourse.priceRupees * 0.18))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/40 font-bold text-sm">
                      <span className="text-foreground">Total Payable:</span>
                      <span className="font-mono text-primary">
                        ₹{new Intl.NumberFormat("en-IN").format(selectedCourse.priceRupees)}
                      </span>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPurchaseModalOpen(false)}
                      className="rounded-xl text-xs h-9"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={isProcessing}
                      onClick={handleConfirmPurchase}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs h-9 gap-1.5"
                    >
                      {isProcessing ? (
                        "Confirming with Payment Gateway..."
                      ) : (
                        <>
                          <CreditCard className="h-3.5 w-3.5" /> Confirm & Enroll (₹{new Intl.NumberFormat("en-IN").format(selectedCourse.priceRupees)})
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-foreground">Enrollment & Payment Confirmed!</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      You are now enrolled in <strong className="text-foreground">{selectedCourse.title}</strong>. Your payment receipt is accessible under Receipts & Fees.
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsPurchaseModalOpen(false);
                        navigate("/student/payments");
                      }}
                      className="rounded-xl text-xs h-9"
                    >
                      View Invoice in Payments
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsPurchaseModalOpen(false);
                        navigate("/student/courses");
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs h-9"
                    >
                      Go to My Courses
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
