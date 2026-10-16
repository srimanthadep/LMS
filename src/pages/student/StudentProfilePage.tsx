import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  BookOpen,
  Award,
  FileText,
  Upload,
  Download,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  User,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";

interface EnrolledCourse {
  id: string;
  title: string;
  code: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  grade: string;
  status: "In Progress" | "Completed";
  lastAccessed: string;
}

interface EducationRecord {
  degree: string;
  institution: string;
  year: string;
  score: string;
  field: string;
}

interface CertificateItem {
  id: string;
  title: string;
  certNumber: string;
  issuedDate: string;
  issuer: string;
  credentialUrl: string;
}

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState("Arjun_Mehta_AI_Engineer_Resume.pdf");
  const [resumeLastUpdated, setResumeLastUpdated] = useState("12 Oct 2026");

  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState({
    fullName: user.name || "Arjun Mehta",
    studentId: "APEX-2026-STU-4810",
    email: user.email || "arjun.mehta@apex.edu",
    phone: "+91 98765 43210",
    dob: "2002-08-14",
    gender: "Male",
    address: "Flat 402, Green Meadows, Tech Corridor, Outer Ring Road, Bengaluru, Karnataka - 560103",
  });

  // Academic Details State
  const [academicDetails, setAcademicDetails] = useState({
    institution: "Apex Institute of Technology & Autonomous Systems",
    department: "Department of Computer Science & AI Systems",
    degree: "B.Tech in Artificial Intelligence & Machine Learning",
    semester: "Semester 6 (Academic Year 2025–2026)",
    batch: "Cohort 7 (Enrolled 2023 - 2027)",
    mentor: "Prof. Rajesh Verma (Lead Faculty & AI Systems Chair)",
    mentorId: "MTR-AI-101",
  });

  // Temporary edit states
  const [editPersonal, setEditPersonal] = useState({ ...personalDetails });
  const [editAcademic, setEditAcademic] = useState({ ...academicDetails });

  // Skills
  const [skills, setSkills] = useState([
    "Python",
    "PyTorch",
    "LangGraph & Multi-Agents",
    "TypeScript & React",
    "FastAPI",
    "Vector DBs (Qdrant/Pinecone)",
    "vLLM & KV-Caching",
    "RAG Architecture",
    "Prompt Engineering",
    "System Design",
    "Verbal Articulation",
    "Technical Presentations",
  ]);
  const [newSkill, setNewSkill] = useState("");

  // Enrolled Courses
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: "course-agentic-101",
      title: "Full-Stack AI Engineering & Autonomous Agents",
      code: "AI-701",
      progress: 85,
      completedModules: 28,
      totalModules: 32,
      grade: "A+",
      status: "In Progress",
      lastAccessed: "Today, 10:15 AM",
    },
    {
      id: "course-kv-cache",
      title: "Distributed Systems & KV-Cache Infrastructure",
      code: "CS-604",
      progress: 72,
      completedModules: 18,
      totalModules: 24,
      grade: "A",
      status: "In Progress",
      lastAccessed: "Yesterday",
    },
    {
      id: "course-rag-specialist",
      title: "Foundations of LLM Fine-Tuning & Evaluation",
      code: "AI-602",
      progress: 100,
      completedModules: 22,
      totalModules: 22,
      grade: "O (Outstanding)",
      status: "Completed",
      lastAccessed: "08 Oct 2026",
    },
  ];

  // Achievements & Certificates
  const certificates: CertificateItem[] = [
    {
      id: "cert-1",
      title: "Certified Autonomous Agent Architect - Honors",
      certNumber: "APX-CERT-2026-091",
      issuedDate: "08 Oct 2026",
      issuer: "Apex AI Institute & Academic Senate",
      credentialUrl: "/student/certificates",
    },
    {
      id: "cert-2",
      title: "Production RAG Specialist with Vector Optimization",
      certNumber: "APX-CERT-2026-044",
      issuedDate: "15 Sep 2026",
      issuer: "Apex Institute of Technology",
      credentialUrl: "/student/certificates",
    },
  ];

  const educationHistory: EducationRecord[] = [
    {
      degree: "Higher Secondary Certificate (Class XII)",
      institution: "National Public School, Indiranagar, Bengaluru",
      year: "2021 – 2023",
      score: "94.6% (CBSE Science - Physics, Chem, Math, CS)",
      field: "Science & Computer Science",
    },
    {
      degree: "Secondary School Examination (Class X)",
      institution: "St. Joseph's Academy, Bengaluru",
      year: "2020 – 2021",
      score: "96.2% (ICSE Distinction)",
      field: "General Sciences & Mathematics",
    },
  ];

  const handleStartEdit = () => {
    setEditPersonal({ ...personalDetails });
    setEditAcademic({ ...academicDetails });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditPersonal({ ...personalDetails });
    setEditAcademic({ ...academicDetails });
    setIsEditing(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalDetails({ ...editPersonal });
    setAcademicDetails({ ...editAcademic });
    setIsEditing(false);

    addNotification({
      title: "Profile Updated",
      message: "Your student personal and academic details were updated in your session.",
      type: "system",
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        addNotification({
          title: "Profile Photo Updated",
          message: "New profile photo preview loaded successfully.",
          type: "system",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      setResumeLastUpdated("Just now");
      addNotification({
        title: "Resume Uploaded",
        message: `Successfully uploaded ${file.name}.`,
        type: "system",
      });
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner Notice */}
      <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Dedicated Student Profile</h4>
            <p className="text-xs text-muted-foreground">
              Official institutional record. Profile settings such as passwords and notifications are managed in{" "}
              <Link to="/student/settings" className="text-primary hover:underline font-medium">
                Student Settings
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {!isEditing ? (
            <Button
              onClick={handleStartEdit}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="gap-1.5 rounded-xl text-xs h-9"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProfile}
                className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 shadow-sm"
              >
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden bg-card/60 backdrop-blur-sm">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary/20 via-rose-500/10 to-primary/5 relative">
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/20 text-primary gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified Student
            </Badge>
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              ID: {personalDetails.studentId}
            </Badge>
          </div>
        </div>

        <CardContent className="pt-0 relative px-4 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Avatar with Upload */}
            <div className="relative group">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-background bg-muted shadow-md overflow-hidden flex items-center justify-center text-3xl font-extrabold text-primary">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={personalDetails.fullName} className="h-full w-full object-cover" />
                ) : (
                  <span>
                    {personalDetails.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform active:scale-95 group-hover:scale-105"
                title="Upload or update profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Headline Details */}
            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {personalDetails.fullName}
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {academicDetails.batch}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                {academicDetails.degree}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {academicDetails.institution}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <Link to="/student/resume" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs w-full sm:w-auto h-9">
                  <FileText className="h-3.5 w-3.5 text-primary" /> View & Edit Resume
                </Button>
              </Link>
              <Link to="/student/mentors" className="w-full sm:w-auto">
                <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-xs w-full sm:w-auto h-9 text-muted-foreground hover:text-foreground">
                  <User className="h-3.5 w-3.5" /> Assigned Mentor
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Sections A & B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: Personal Details */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> A. Personal Details
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Official identity and contact information
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {isEditing ? "Editing Mode" : "Institutional Record"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                    <Input
                      value={editPersonal.fullName}
                      onChange={(e) => setEditPersonal({ ...editPersonal, fullName: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Student ID / Reg No</label>
                    <Input
                      value={editPersonal.studentId}
                      disabled
                      className="mt-1 h-9 rounded-xl text-xs bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                    <Input
                      type="email"
                      value={editPersonal.email}
                      onChange={(e) => setEditPersonal({ ...editPersonal, email: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                    <Input
                      value={editPersonal.phone}
                      onChange={(e) => setEditPersonal({ ...editPersonal, phone: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Date of Birth</label>
                    <Input
                      type="date"
                      value={editPersonal.dob}
                      onChange={(e) => setEditPersonal({ ...editPersonal, dob: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Gender</label>
                    <select
                      value={editPersonal.gender}
                      onChange={(e) => setEditPersonal({ ...editPersonal, gender: e.target.value })}
                      className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Residential / Mailing Address</label>
                  <textarea
                    rows={2}
                    value={editPersonal.address}
                    onChange={(e) => setEditPersonal({ ...editPersonal, address: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary" /> Full Name
                  </span>
                  <span className="font-semibold text-foreground">{personalDetails.fullName}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Student ID / Reg No
                  </span>
                  <span className="font-mono font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    {personalDetails.studentId}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
                  </span>
                  <span className="font-medium text-foreground">{personalDetails.email}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
                  </span>
                  <span className="font-medium text-foreground">{personalDetails.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Date of Birth
                  </span>
                  <span className="font-medium text-foreground">{personalDetails.dob}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary" /> Gender
                  </span>
                  <span className="font-medium text-foreground">{personalDetails.gender}</span>
                </div>
                <div className="pt-1">
                  <span className="text-muted-foreground flex items-center gap-2 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Permanent Address
                  </span>
                  <p className="text-foreground font-medium pl-5 leading-relaxed">
                    {personalDetails.address}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section B: Academic Details */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" /> B. Academic Details
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Curricular enrollment, institution, and faculty mentorship
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                Active Cohort
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">University / Institution</label>
                  <Input
                    value={editAcademic.institution}
                    onChange={(e) => setEditAcademic({ ...editAcademic, institution: e.target.value })}
                    className="mt-1 h-9 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Department & Course</label>
                  <Input
                    value={editAcademic.department}
                    onChange={(e) => setEditAcademic({ ...editAcademic, department: e.target.value })}
                    className="mt-1 h-9 rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Degree / Program</label>
                    <Input
                      value={editAcademic.degree}
                      onChange={(e) => setEditAcademic({ ...editAcademic, degree: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Current Semester</label>
                    <Input
                      value={editAcademic.semester}
                      onChange={(e) => setEditAcademic({ ...editAcademic, semester: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Batch / Enrollment Year</label>
                    <Input
                      value={editAcademic.batch}
                      onChange={(e) => setEditAcademic({ ...editAcademic, batch: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Assigned Mentor</label>
                    <Input
                      value={editAcademic.mentor}
                      onChange={(e) => setEditAcademic({ ...editAcademic, mentor: e.target.value })}
                      className="mt-1 h-9 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-primary" /> University / Institution
                  </span>
                  <span className="font-semibold text-foreground text-right">{academicDetails.institution}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-primary" /> Department
                  </span>
                  <span className="font-medium text-foreground text-right">{academicDetails.department}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-primary" /> Degree / Program
                  </span>
                  <span className="font-medium text-foreground text-right">{academicDetails.degree}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Current Semester
                  </span>
                  <span className="font-medium text-foreground">{academicDetails.semester}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-primary" /> Batch / Enrollment
                  </span>
                  <span className="font-medium text-foreground">{academicDetails.batch}</span>
                </div>
                <div className="pt-2 flex items-start justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary" /> Assigned Faculty Mentor
                  </span>
                  <div className="text-right">
                    <Link
                      to="/student/mentors"
                      className="font-semibold text-primary hover:underline flex items-center gap-1 justify-end"
                    >
                      {academicDetails.mentor} <ExternalLink className="h-3 w-3" />
                    </Link>
                    <span className="text-[11px] text-muted-foreground">ID: {academicDetails.mentorId}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section C: Learning Profile */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> C. Learning Profile
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Active enrollments, module completion metrics, competencies, and achievements
              </CardDescription>
            </div>
            <Link to="/student/courses">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary/90 h-8">
                View All Courses <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          {/* Enrolled Courses Progress */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Enrolled Courses & Completion Progress
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enrolledCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {c.code}
                      </Badge>
                      <Badge
                        variant={c.status === "Completed" ? "default" : "secondary"}
                        className={`text-[10px] ${
                          c.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : ""
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <h5 className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
                      {c.title}
                    </h5>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold text-foreground font-mono">{c.progress}%</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>{c.completedModules}/{c.totalModules} modules</span>
                      <span className="font-semibold text-primary">Grade: {c.grade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="pt-2 border-t border-border/40">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" /> Technical & Soft Skills Profile
              </h4>
              <span className="text-xs text-muted-foreground">{skills.length} competencies indexed</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-muted/60 text-foreground border border-border/60 hover:border-primary/40 transition-colors"
                >
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <form onSubmit={handleAddSkill} className="flex gap-2 mt-3 max-w-sm">
                <Input
                  placeholder="Add a new skill (e.g. LangChain, Docker)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="h-8 rounded-xl text-xs"
                />
                <Button type="submit" size="sm" className="h-8 rounded-xl text-xs bg-primary hover:bg-primary/90">
                  Add
                </Button>
              </form>
            )}
          </div>

          {/* Achievements and Certificates */}
          <div className="pt-2 border-t border-border/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" /> Achievements & Verified Certificates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500 shrink-0" />
                      <h6 className="text-xs font-bold text-foreground leading-snug">{cert.title}</h6>
                    </div>
                    <p className="text-[11px] text-muted-foreground pl-6">
                      ID: <span className="font-mono text-foreground">{cert.certNumber}</span> • Issued: {cert.issuedDate}
                    </p>
                    <p className="text-[11px] text-muted-foreground pl-6">
                      By {cert.issuer}
                    </p>
                  </div>
                  <Link to={cert.credentialUrl}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] text-primary gap-1 shrink-0">
                      View <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section D: Education and Resume */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> D. Education & Resume
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Past academic history, active resume file, and ATS profile integration
              </CardDescription>
            </div>
            <Link to="/student/resume">
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs rounded-xl h-8">
                <Sparkles className="h-3.5 w-3.5" /> AI Resume Builder
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          {/* Previous Education Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-primary" /> Previous Academic History
            </h4>
            <div className="space-y-3">
              {educationHistory.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-foreground">{edu.degree}</h5>
                    <p className="text-xs text-muted-foreground">{edu.institution}</p>
                    <p className="text-[11px] text-primary font-medium">{edu.field}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {edu.score}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground mt-1">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Upload and Download */}
          <div className="pt-2 border-t border-border/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5 text-primary" /> Resume Management & ATS Integration
            </h4>

            <div className="p-4 rounded-xl border-2 border-dashed border-border/80 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                    {resumeFileName}
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      ATS Score: 94/100
                    </Badge>
                  </h5>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Last updated: {resumeLastUpdated} • PDF format (184 KB)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,.docx"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resumeInputRef.current?.click()}
                  className="gap-1.5 rounded-xl text-xs h-9 flex-1 sm:flex-none"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload New
                </Button>
                <a
                  href={`#download-${resumeFileName}`}
                  onClick={(e) => {
                    e.preventDefault();
                    addNotification({
                      title: "Resume Downloaded",
                      message: `Downloaded ${resumeFileName}.`,
                      type: "system",
                    });
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    size="sm"
                    className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 w-full"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
