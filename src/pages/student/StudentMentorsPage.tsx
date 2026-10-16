import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Video,
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Star,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Building2,
  Briefcase,
  BookOpen,
  MapPin,
  CheckCircle2,
  Send,
  X,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/context/NotificationContext";

// Single mentor assigned to the logged-in student (Prof. Rajesh Verma)
const ASSIGNED_MENTOR = {
  id: "m-1",
  mentorId: "MTR-AI-101",
  name: "Prof. Rajesh Verma",
  role: "Lead Faculty & AI Systems Chair",
  department: "Department of Computer Science & AI Systems",
  affiliation: "Apex AI Institute • Ex-Google Research",
  specialization: "Hierarchical Multi-Agent Graphs, KV-Cache Optimization, LLM Inference",
  expertiseList: [
    "Hierarchical Multi-Agent Graphs",
    "KV-Cache Optimization",
    "LLM Inference & Throughput",
    "Distributed AI Systems",
    "LangGraph State Machines",
  ],
  experience: "14+ Years in Distributed AI Systems & Academic Mentorship",
  about:
    "Prof. Rajesh Verma is the Lead Faculty and Academic Chair for AI Systems at Apex Institute. He brings over 14 years of research and industry experience, having previously worked at Google Research on distributed systems and high-throughput machine learning architectures. As your dedicated faculty mentor, Prof. Verma guides your capstone development, architecture reviews, and technical career readiness throughout your cohort journey.",
  email: "rajesh.verma@apex.edu",
  phone: "+91 (080) 4129-8820 (Ext: 401)",
  office: "AI Systems Wing, Academic Block B, Room 401",
  assignedCohort: "Cohort 7 (Autonomous Systems & AI)",
  assignedStudentsCount: 28,
  consultationSchedule: "Tuesdays & Thursdays (04:00 PM – 06:30 PM IST), Saturdays (11:00 AM – 01:00 PM IST)",
  rating: 4.95,
  avatar: "RV",
};

export const StudentMentorsPage: React.FC = () => {
  const { addNotification } = useNotifications();

  // Email Contact Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(
    "Academic Inquiry from Arjun Mehta (ID: APEX-2026-STU-4810)"
  );
  const [emailBody, setEmailBody] = useState(
    `Dear ${ASSIGNED_MENTOR.name},\n\nI am writing regarding my recent coursework and capstone architecture...\n\nSincerely,\nArjun Mehta\nCohort 7`
  );

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailModalOpen(false);
    addNotification({
      title: "Message Dispatched to Mentor",
      message: `Your message to ${ASSIGNED_MENTOR.name} (${ASSIGNED_MENTOR.email}) was queued successfully.`,
      type: "system",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-6 w-6 text-primary" /> Mentor Details
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Overview and academic consultation details for your assigned faculty mentor.
          </p>
        </div>

        {/* Quick Link to 1:1 Session */}
        <Link to="/student/mentor-session">
          <Button
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 shadow-sm"
          >
            <Video className="h-3.5 w-3.5" /> 1:1 Mentor Session
            <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
          </Button>
        </Link>
      </div>

      {/* Primary Dedicated Assigned Mentor Card */}
      <Card className="rounded-3xl border border-border/80 shadow-md bg-card overflow-hidden">
        {/* Top Gradient Banner with Badges */}
        <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 sm:p-8 border-b border-border/60">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Profile Avatar / Photo */}
              <div className="relative">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-primary text-primary-foreground font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-md ring-4 ring-primary/20">
                  {ASSIGNED_MENTOR.avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background ring-2 ring-emerald-500/20" />
              </div>

              {/* Name, Role & Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {ASSIGNED_MENTOR.name}
                  </h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                    Your Assigned Mentor
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs border-border/80">
                    {ASSIGNED_MENTOR.mentorId}
                  </Badge>
                </div>

                <p className="text-sm sm:text-base font-semibold text-foreground">
                  {ASSIGNED_MENTOR.role}
                </p>

                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  {ASSIGNED_MENTOR.department}
                </p>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {ASSIGNED_MENTOR.affiliation}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" /> {ASSIGNED_MENTOR.rating} / 5.0
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-primary" /> {ASSIGNED_MENTOR.assignedCohort}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
              <Button
                variant="outline"
                onClick={() => setIsEmailModalOpen(true)}
                className="gap-2 rounded-xl text-xs h-9 border-border/80 flex-1 md:flex-initial"
              >
                <Mail className="h-3.5 w-3.5 text-primary" /> Contact via Email
              </Button>
              <Link to="/student/mentor-session" className="flex-1 md:flex-initial">
                <Button
                  className="w-full gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-xl text-xs h-9 shadow-sm"
                >
                  <Video className="h-3.5 w-3.5" /> Join 1:1 Session
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* About / Mentor Introduction */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> About & Introduction
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed p-4 rounded-2xl bg-muted/30 border border-border/40">
              {ASSIGNED_MENTOR.about}
            </p>
          </div>

          {/* Department & Areas of Expertise */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Department & Areas of Expertise
            </h3>
            <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-3">
              <p className="text-xs text-muted-foreground font-medium">
                <span className="text-foreground font-semibold">Department:</span> {ASSIGNED_MENTOR.department}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {ASSIGNED_MENTOR.expertiseList.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="rounded-lg text-xs py-1 px-2.5 bg-muted/60 text-foreground border border-border/60"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Professional Experience
            </h3>
            <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2 text-xs">
              <p className="font-bold text-foreground text-sm">
                {ASSIGNED_MENTOR.experience}
              </p>
              <ul className="space-y-1.5 text-muted-foreground pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Lead Faculty & AI Systems Chair, Apex AI Institute</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Ex-Google Research • Senior Research Scientist, Distributed AI Systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Published author on KV-Cache Optimization & Multi-Agent Consensus Mechanisms</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Two-Column Grid: Availability & Direct Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Availability Information */}
            <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Availability & Consultation Hours
              </div>
              <p className="text-sm font-semibold text-foreground">
                {ASSIGNED_MENTOR.consultationSchedule}
              </p>
              <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Regular 1:1 consultation slots follow the institutional timetable. To join your scheduled session, proceed to the 1:1 Mentor Session page.
              </p>
            </div>

            {/* Direct Contact Details */}
            <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" /> Contact Details
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <a
                    href={`mailto:${ASSIGNED_MENTOR.email}`}
                    className="font-mono text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    {ASSIGNED_MENTOR.email}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-mono text-foreground font-medium">
                    {ASSIGNED_MENTOR.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Office:</span>
                  <span className="text-foreground font-medium text-right">
                    {ASSIGNED_MENTOR.office}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Contact Dialog */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Contact Mentor via Email
            </DialogTitle>
            <DialogDescription className="text-xs">
              Direct academic correspondence to {ASSIGNED_MENTOR.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendEmail} className="space-y-4 pt-2">
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-mono text-foreground font-semibold">
                {ASSIGNED_MENTOR.email}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Subject Line</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-1 h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Message Body</label>
              <textarea
                rows={5}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${ASSIGNED_MENTOR.email}?subject=${encodeURIComponent(
                  emailSubject
                )}&body=${encodeURIComponent(emailBody)}`}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <ExternalLink className="h-3 w-3" /> Open in Mail App
              </a>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="rounded-xl text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Send Message
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
