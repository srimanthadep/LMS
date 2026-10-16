import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Tag,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface KbArticle {
  id: string;
  title: string;
  category: "Batch Transfers" | "Course Extensions" | "Billing & Refunds" | "LMS Video & Streams" | "AI Evaluation Appeals" | "Account & 2FA";
  summary: string;
  readTime: string;
  updatedAt: string;
  views: number;
  macroSnippet: string;
  content: string[];
  checklist: string[];
}

const ARTICLES: KbArticle[] = [
  {
    id: "kb-1",
    title: "SOP-101: Cohort Shift & Batch Transfer Policy",
    category: "Batch Transfers",
    summary: "Criteria, entitlement preservation rules, and Admin two-person approval requirements when moving students between weekday and weekend batches.",
    readTime: "3 min read",
    updatedAt: "12 Oct 2026",
    views: 428,
    macroSnippet: "Hello! We have reviewed your attendance record and verified your eligibility. A formal batch shift proposal has been routed to Academic Admin for final roster sync. Your lecture replay milestones and quiz history will remain 100% intact.",
    checklist: [
      "Check learner live attendance (>65% required for synchronous transfer)",
      "Verify seat capacity in the target cohort before proposing",
      "Do not edit roster directly — trigger the 'Propose Batch Move' action",
      "Inform student that live timetable updates take up to 2 hours",
    ],
    content: [
      "Students enrolled in Live Synchronous cohorts may request a batch transfer within the first 4 weeks of the cohort start date.",
      "Support agents are strictly restricted from directly modifying course rosters. The 'Propose Batch Move' button must be used to trigger Admin dual-authorization.",
      "Upon Admin approval, the student's historical milestone submissions, test grades, and doubt history automatically migrate without data loss.",
    ],
  },
  {
    id: "kb-2",
    title: "SOP-204: Medical & Professional Course Validity Extension",
    category: "Course Extensions",
    summary: "Standard operating procedure for granting 30, 60, or 90 days extra replay access for medical emergencies, relocation, or academic conflicts.",
    readTime: "4 min read",
    updatedAt: "08 Oct 2026",
    views: 612,
    macroSnippet: "We have reviewed your documentation regarding your recent medical leave. A 30-day course validity extension has been submitted for fast-tracked Admin confirmation so you can complete your remaining projects without disruption.",
    checklist: [
      "Verify student has submitted supporting documentation or explanation",
      "Check current entitlement expiry date in Student 360",
      "Select extension length (standard: 30 days; maximum: 90 days)",
      "Trigger 'Propose Extension' action on the ticket or profile drawer",
    ],
    content: [
      "Validity extensions grant continued access to recorded replays, AI tutor, and self-paced code milestones past the scheduled cohort end date.",
      "Support agents cannot unilaterally execute database expiry overrides. All extensions must be queued via the LMS dual-key proposal workflow.",
      "Students receiving an extension remain eligible for their course certificate upon finishing all required evaluations.",
    ],
  },
  {
    id: "kb-3",
    title: "SOP-305: Resolving CDN Edge Buffering & DRM Replay Issues",
    category: "LMS Video & Streams",
    summary: "Troubleshooting steps for video playback errors, DRM token timeouts, and low-latency WebRTC live stream drops.",
    readTime: "2 min read",
    updatedAt: "14 Oct 2026",
    views: 890,
    macroSnippet: "We have re-issued your secure DRM playback credentials and purged the edge CDN cache node closest to your region. Please try reloading the player in an incognito window or disabling aggressive ad-blocking extensions.",
    checklist: [
      "Ask student for exact browser version and OS",
      "Confirm if issue occurs on replays or during the live WebRTC stream",
      "Check Super-Admin Platform Health for active CDN edge incidents",
      "Instruct student to disable hardware acceleration if screen is black",
    ],
    content: [
      "Our LMS uses Widevine / FairPlay DRM with dynamic watermarking to protect proprietary intellectual property.",
      "If a student sees Error Code 403-DRM, their token expired after 4 hours of idle time. Reloading the page requests a new ephemeral JWT.",
      "For persistent stuttering, verify their ISP speed with our integrated network telemetry diagnostic tool.",
    ],
  },
  {
    id: "kb-4",
    title: "SOP-402: AI Evaluation Appeals & Rubric Grade Re-evaluations",
    category: "AI Evaluation Appeals",
    summary: "Handling student disputes on autograded coding milestones and routing resubmissions to human evaluators.",
    readTime: "5 min read",
    updatedAt: "05 Oct 2026",
    views: 340,
    macroSnippet: "Thank you for detailing your rationale. We have submitted your code submission and comments to our Senior Evaluator queue for manual secondary review. You will receive an updated rubric score within 48 business hours.",
    checklist: [
      "Verify that the milestone has already been finalized and released",
      "Review the objective test cases and autograder rationale",
      "If a genuine edge case was penalized, trigger the 'Re-evaluate' workflow",
      "Do not manually edit rubric scores — route to the assigned human evaluator",
    ],
    content: [
      "Students may appeal their autograded scores within 7 days of score release if they believe the test harness penalized valid alternative architectures.",
      "The evaluator desk provides side-by-side AST diffing and execution logs to confirm if the code satisfied the specification.",
      "If an error was caused by autograder infrastructure timeout, an automatic re-run is granted immediately.",
    ],
  },
  {
    id: "kb-5",
    title: "SOP-510: Payment Capture Failures & Refund Processing",
    category: "Billing & Refunds",
    summary: "Guidelines on diagnosing failed UPI transactions, webhook delays, and processing 7-day money-back guarantee requests.",
    readTime: "3 min read",
    updatedAt: "10 Oct 2026",
    views: 520,
    macroSnippet: "We have verified your transaction status with our payment gateway (Razorpay). The debited funds will either reflect on your enrolled account within 30 minutes or be automatically refunded to your original source account by your bank within 3-5 business days.",
    checklist: [
      "Look up order ID in Admin > Payments desk",
      "Verify payment gateway status (captured vs failed vs authorized)",
      "Check if student's course access was provisioned automatically",
      "For refunds, verify if requested within the 7-day initial window",
    ],
    content: [
      "Transactions marked as 'authorized' but not 'captured' are automatically resolved by our hourly reconciliation cron job.",
      "Refund requests must be formally submitted to the Admin Finance Desk for compliance and GST credit note generation.",
    ],
  },
  {
    id: "kb-6",
    title: "SOP-601: Two-Factor Authentication (2FA) Lockouts & Device Reset",
    category: "Account & 2FA",
    summary: "Emergency procedures for students unable to access their authenticator app (Google Authenticator / Authy) or backup codes.",
    readTime: "2 min read",
    updatedAt: "15 Oct 2026",
    views: 290,
    macroSnippet: "For your account security, we have initiated an identity verification check. Please reply with the government ID associated with your student enrollment to complete your 2FA authenticator reset.",
    checklist: [
      "Verify student's identity via registered phone number or alternate email",
      "Check Super-Admin Security Audit logs for recent suspicious IP logins",
      "Route 2FA reset ticket to Super Admin for final security clearance",
    ],
    content: [
      "2FA reset requests require mandatory dual-factor confirmation to prevent social engineering account takeover attempts.",
      "Once approved by Super Admin, the student receives a one-time recovery link valid for 15 minutes.",
    ],
  },
];

export const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeArticle, setActiveArticle] = useState<KbArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);

  const categories = [
    "all",
    "Batch Transfers",
    "Course Extensions",
    "Billing & Refunds",
    "LMS Video & Streams",
    "AI Evaluation Appeals",
    "Account & 2FA",
  ];

  const filtered = ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory !== "all" && art.category !== selectedCategory) return false;
    return true;
  });

  const handleCopyMacro = (art: KbArticle) => {
    navigator.clipboard.writeText(art.macroSnippet);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 support-page-font">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Support Knowledge Base & SOPs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Standard operating procedures, policy guidelines, and quick response macros for support agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 border-primary/30 text-primary bg-primary/10 font-semibold">
            {ARTICLES.length} Verified SOP Articles
          </Badge>
        </div>
      </div>

      {/* Search and Category Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SOPs by keyword, ticket category, or error code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sleek-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All SOP Categories" : cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((art) => (
          <div
            key={art.id}
            onMouseEnter={() => setHoveredArticle(art.id)}
            onMouseLeave={() => setHoveredArticle(null)}
            className={`rounded-2xl transition-all duration-200
              ${hoveredArticle === art.id ? "-translate-y-1.5 shadow-2xl" : ""}
              ${hoveredArticle !== null && hoveredArticle !== art.id ? "opacity-60 scale-[0.985]" : ""}
            `}
          >
            <Card
              className={`transition-all duration-200 flex flex-col justify-between cursor-pointer group h-full
                ${hoveredArticle === art.id
                  ? "border-primary/50 ring-1 ring-primary/20"
                  : "hover:border-border"}
              `}
              onClick={() => setActiveArticle(art)}
            >
              <CardHeader className="p-4 border-b border-border/70 space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-semibold bg-primary/10 text-primary border-primary/20">
                    {art.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {art.readTime}
                  </span>
                </div>

                <CardTitle className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {art.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4 text-xs">
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                  {art.summary}
                </p>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Updated: {art.updatedAt}</span>
                    <span>{art.views} agent views</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs h-8 gap-1.5 font-semibold group-hover:border-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveArticle(art);
                      }}
                    >
                      Read Full SOP <ArrowRight className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                      title="Copy response macro"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyMacro(art);
                      }}
                    >
                      {copiedId === art.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Full Article Modal Dialog */}
      {activeArticle && (
        <Dialog open={!!activeArticle} onOpenChange={() => setActiveArticle(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto sleek-scrollbar">
            <DialogHeader className="space-y-2 border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {activeArticle.category}
                </Badge>
                <span className="text-xs text-muted-foreground">Updated: {activeArticle.updatedAt}</span>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {activeArticle.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {activeArticle.summary}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-3 text-xs leading-relaxed">
              {/* Agent Action Checklist */}
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> Agent Operational Checklist
                </h4>
                <ul className="space-y-1.5 text-foreground/90">
                  {activeArticle.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Policy Body */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                  Detailed Policy Guidelines
                </h4>
                {activeArticle.content.map((p, i) => (
                  <p key={i} className="text-muted-foreground text-xs leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Copyable Macro Box */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Approved Response Macro
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1"
                    onClick={() => handleCopyMacro(activeArticle)}
                  >
                    {copiedId === activeArticle.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Snippet
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border/60 font-mono text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">
                  {activeArticle.macroSnippet}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
