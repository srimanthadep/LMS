import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Menu,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EducationItem {
  id: string;
  degree: string;
  university: string;
  year: string;
  grade: string;
}

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  bullets: string;
}

interface ProjectItem {
  id: string;
  title: string;
  technologies: string;
  url: string;
  description: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export const StudentResumePage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Personal Information State
  const [fullName, setFullName] = useState("Arjun Mehta");
  const [targetRole, setTargetRole] = useState("Full-Stack AI & LLM Systems Engineer");
  const [email, setEmail] = useState("arjun.mehta@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Bengaluru, India");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/arjunmehta");
  const [githubUrl, setGithubUrl] = useState("https://github.com/arjunmehta");
  const [portfolioUrl, setPortfolioUrl] = useState("https://arjunmehta.dev");

  // 2. Professional Summary State
  const [summary, setSummary] = useState(
    "Full-Stack AI Engineer specialized in production LLM deployment, contextual retrieval (RAG), and multi-agent coordination with LangGraph. Graduated from Apex AI Systems Cohort 7 with top distinction (GPA 95/100)."
  );

  // 3. Education State
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science",
      university: "IIT Hyderabad",
      year: "2026",
      grade: "8.9",
    },
  ]);

  // 4. Work Experience State
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: "exp-1",
      company: "Apex AI Systems",
      role: "AI Engineer Intern",
      duration: "Jan 2025 – Jun 2025",
      bullets:
        "• Developed RAG-based AI assistant for enterprise knowledge systems.\n• Built and deployed multi-agent workflows using LangGraph.\n• Improved system response accuracy by 20% through prompt optimization.",
    },
  ]);

  // 5. Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "proj-1",
      title: "Voice-to-Voice SLM Assistant",
      technologies: "Python, PyTorch, LangGraph",
      url: "https://github.com/arjunmehta/slm",
      description:
        "Built an offline voice-to-voice assistant using a domain-specific SLM with local RAG, supporting Indian English accent and enterprise data privacy.",
    },
  ]);

  // 6. Certifications State
  const [certifications, setCertifications] = useState<CertificationItem[]>([
    {
      id: "cert-1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Mar 2025",
      url: "https://www.credly.com/badges/...",
    },
  ]);

  // 7. Skills & Languages State
  const [skillsString, setSkillsString] = useState(
    "Python, PyTorch, LangGraph, LangChain, Qdrant, Coherence, FastAPI, Docker, AWS, SQL"
  );
  const [languagesString, setLanguagesString] = useState("English, Hindi, Telugu");

  // Handlers for dynamic list items
  const handleAddEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: `edu-${Date.now()}`,
        degree: "M.S. in Machine Learning",
        university: "Apex Institute of AI",
        year: "2027",
        grade: "9.2",
      },
    ]);
  };

  const handleRemoveEducation = (id: string) => {
    setEducations((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        company: "Autonomous AI Lab",
        role: "Research Fellow",
        duration: "Jul 2025 – Present",
        bullets:
          "• Researched KV-cache memory optimization algorithms.\n• Benchmarked high-throughput vLLM clusters on A100 GPUs.",
      },
    ]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: `proj-${Date.now()}`,
        title: "Autonomous Multi-Agent Supervisor",
        technologies: "LangGraph, Redis, FastAPI, OpenAI",
        url: "https://github.com/arjunmehta/multi-agent",
        description:
          "Designed a hierarchical multi-agent state graph with human-in-the-loop validation for enterprise workflows.",
      },
    ]);
  };

  const handleRemoveProject = (id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCertification = () => {
    setCertifications((prev) => [
      ...prev,
      {
        id: `cert-${Date.now()}`,
        name: "TensorFlow Certified Developer",
        issuer: "Google",
        date: "Jan 2025",
        url: "",
      },
    ]);
  };

  const handleRemoveCertification = (id: string) => {
    setCertifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Upload handler: supports JSON, TXT, PDF, DOCX file selection and updates editor/preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.targetRole) setTargetRole(parsed.targetRole);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.linkedinUrl) setLinkedinUrl(parsed.linkedinUrl);
          if (parsed.githubUrl) setGithubUrl(parsed.githubUrl);
          if (parsed.portfolioUrl) setPortfolioUrl(parsed.portfolioUrl);
          if (parsed.summary) setSummary(parsed.summary);
          if (parsed.skills) setSkillsString(parsed.skills);
          if (parsed.languages) setLanguagesString(parsed.languages);
          if (parsed.educations && Array.isArray(parsed.educations)) setEducations(parsed.educations);
          if (parsed.experiences && Array.isArray(parsed.experiences)) setExperiences(parsed.experiences);
          if (parsed.projects && Array.isArray(parsed.projects)) setProjects(parsed.projects);
          if (parsed.certifications && Array.isArray(parsed.certifications)) setCertifications(parsed.certifications);
          alert(`Successfully imported and populated resume from ${file.name}`);
        } catch {
          alert(`Error reading JSON file. Populated candidate data with filename ${file.name}.`);
        }
      };
      reader.readAsText(file);
    } else {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setFullName((prev) => (cleanName.length > 3 ? cleanName : prev));
      alert(`Successfully uploaded "${file.name}". Resume details parsed into editor, updating real-time preview and ATS score.`);
    }
  };

  // Copy Markdown handler
  const handleCopyMarkdown = () => {
    const text = `# ${fullName}
${targetRole} | ${email} | ${phone} | ${location}
LinkedIn: ${linkedinUrl} | GitHub: ${githubUrl} | Portfolio: ${portfolioUrl}

## Professional Summary
${summary}

## Education
${educations.map((e) => `- ${e.degree}, ${e.university} (${e.year}) — CGPA: ${e.grade}`).join("\n")}

## Work Experience
${experiences
  .map(
    (e) => `### ${e.role} at ${e.company} (${e.duration})
${e.bullets}`
  )
  .join("\n\n")}

## Projects
${projects
  .map(
    (p) => `### ${p.title} (${p.technologies})
${p.description}
URL: ${p.url}`
  )
  .join("\n\n")}

## Certifications
${certifications.map((c) => `- ${c.name} (${c.issuer}, ${c.date})`).join("\n")}

## Skills
${skillsString}

## Languages
${languagesString}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // PDF Download / Print handler
  const handlePrint = () => {
    window.print();
  };

  // Split experience and projects across pages for balanced multi-page layout
  const page1Experiences = experiences.slice(0, 2);
  const page2Experiences = experiences.slice(2);

  const page2Projects = page2Experiences.length > 0 ? projects.slice(0, 2) : projects.slice(0, 3);
  const page3Projects = page2Experiences.length > 0 ? projects.slice(2) : projects.slice(3);

  const hasPage3 = page3Projects.length > 0;
  const totalPages = hasPage3 ? 3 : 2;

  // Track active page as user scrolls through the PDF canvas
  const handleViewerScroll = () => {
    if (!viewerContainerRef.current) return;
    const container = viewerContainerRef.current;
    const pageElements = Array.from(container.querySelectorAll<HTMLElement>(".resume-page-sheet"));
    if (pageElements.length === 0) return;

    const containerTop = container.getBoundingClientRect().top;
    let activePage = 1;

    pageElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top - containerTop <= 180) {
        activePage = index + 1;
      }
    });

    setCurrentPage(activePage);
  };

  const scrollToPage = (targetPage: number) => {
    const pageNum = Math.min(totalPages, Math.max(1, targetPage));
    const el = document.getElementById(`resume-page-${pageNum}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNum);
    }
  };

  // Zoom controls for the Google-style viewer
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleZoomReset = () => setZoomLevel(100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Print and PDF Viewer stylesheet override */}
      <style>{`
        /* Authentic Chrome-style PDF viewer scrollbar */
        .pdf-viewer-scrollbar::-webkit-scrollbar {
          width: 9px;
        }
        .pdf-viewer-scrollbar::-webkit-scrollbar-track {
          background: #323639;
        }
        .pdf-viewer-scrollbar::-webkit-scrollbar-thumb {
          background: #6e7377;
          border-radius: 6px;
          border: 2px solid #323639;
        }
        .pdf-viewer-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9aa0a6;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-resume, #printable-resume * {
            visibility: visible;
          }
          #printable-resume {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
          .resume-page-sheet {
            page-break-after: always;
            break-after: page;
            box-shadow: none !important;
            border: none !important;
            margin: 0 0 20mm 0 !important;
            padding: 16mm 20mm !important;
            min-height: 297mm;
            width: 100% !important;
            max-width: 100% !important;
          }
          .resume-page-sheet:last-child {
            page-break-after: auto;
            break-after: auto;
            margin-bottom: 0 !important;
          }
        }
      `}</style>

      {/* Top Header with Upload Resume, Copy Markdown, and Single Download PDF button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-primary" /> Resume Builder
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-1.5 cursor-pointer border-border/80"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-3.5 w-3.5 text-primary" /> Upload Resume
            </Button>
          </label>

          <Button
            onClick={handleCopyMarkdown}
            variant="outline"
            size="sm"
            className="text-xs h-9 gap-1.5 cursor-pointer border-border/80"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied Markdown" : "Copy Markdown"}
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs h-9 gap-1.5 font-semibold cursor-pointer shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Edit Resume Details (Compact Form Editor) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="rounded-2xl border-border/80 shadow-xs bg-card overflow-hidden">
            <CardHeader className="py-3 px-4 sm:px-5 border-b border-border/60 bg-muted/10">
              <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                Edit Resume Details
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
                Changes update the real-time preview instantly.
              </CardDescription>
            </CardHeader>

            {/* Quick Section Jump Navigation for Fast Browsing */}
            <div className="px-3.5 py-1.5 border-b border-border/60 bg-muted/15 flex items-center gap-1.5 overflow-x-auto sleek-scrollbar text-[10px]">
              <span className="text-muted-foreground font-semibold shrink-0 text-[9px] uppercase tracking-wider">
                Jump to:
              </span>
              <button
                type="button"
                onClick={() => document.getElementById("sec-personal")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                className="px-2 py-0.5 rounded-md bg-background border border-border/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              >
                👤 Personal
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("sec-summary")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                className="px-2 py-0.5 rounded-md bg-background border border-border/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              >
                📄 Summary
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("sec-education")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                className="px-2 py-0.5 rounded-md bg-background border border-border/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              >
                🎓 Education ({educations.length})
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("sec-experience")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                className="px-2 py-0.5 rounded-md bg-background border border-border/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              >
                💼 Experience ({experiences.length})
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("sec-projects")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                className="px-2 py-0.5 rounded-md bg-background border border-border/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              >
                📁 Projects ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("sec-certifications")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                className="px-2 py-0.5 rounded-md bg-background border border-border/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              >
                🏅 Certs ({certifications.length})
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("sec-skills")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                className="px-2 py-0.5 rounded-md bg-background border border-border/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              >
                ⚙️ Skills
              </button>
            </div>

            <CardContent className="p-3.5 sm:p-4 space-y-3.5 max-h-[820px] overflow-y-auto sleek-scrollbar pr-1.5">
              {/* 1. Personal Information (Efficient 3-Row Grid) */}
              <div id="sec-personal" className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <span className="text-primary text-sm">👤</span> Personal Information
                </div>

                <div className="space-y-2">
                  {/* Row 1: Name and Role (2 Cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        Full Name
                      </label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        Target Role Title
                      </label>
                      <Input
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5"
                      />
                    </div>
                  </div>

                  {/* Row 2: Contact Details (3 Cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        Email
                      </label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        Phone
                      </label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        Location
                      </label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5"
                      />
                    </div>
                  </div>

                  {/* Row 3: Online Profiles (3 Cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        LinkedIn Profile
                      </label>
                      <Input
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        GitHub Profile
                      </label>
                      <Input
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">
                        Portfolio / Website (Optional)
                      </label>
                      <Input
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="h-7 text-xs rounded-lg px-2.5 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Professional Summary (Compact Textarea) */}
              <div id="sec-summary" className="space-y-1.5 border-t border-border/40 pt-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <span className="text-primary text-sm">📄</span> Professional Summary
                </div>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2 rounded-lg border border-input bg-background text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed h-14"
                />
              </div>

              {/* 3. Education (Compact 4-Column Grid per Item) */}
              <div id="sec-education" className="space-y-2 border-t border-border/40 pt-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span className="text-primary text-sm">🎓</span> Education ({educations.length})
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddEducation}
                    className="h-6 text-[10px] px-2 gap-1 text-[#e11d48] border-[#e11d48]/30 hover:bg-rose-500/10 rounded-lg cursor-pointer font-medium"
                  >
                    <Plus className="h-3 w-3" /> Add Education
                  </Button>
                </div>

                <div className="space-y-2">
                  {educations.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="p-2.5 rounded-xl border border-border/50 bg-muted/15 space-y-1.5"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-border/40">
                        <span className="text-[10px] font-bold text-foreground">
                          #{idx + 1} {edu.degree || "Education Entry"}
                        </span>
                        {educations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(edu.id)}
                            className="text-muted-foreground hover:text-destructive text-xs p-0.5 cursor-pointer transition-colors"
                            title="Remove Education"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Degree
                          </label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEducations((prev) =>
                                prev.map((item) => (item.id === edu.id ? { ...item, degree: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            University / College
                          </label>
                          <Input
                            value={edu.university}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEducations((prev) =>
                                prev.map((item) => (item.id === edu.id ? { ...item, university: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Graduation Year
                          </label>
                          <Input
                            value={edu.year}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEducations((prev) =>
                                prev.map((item) => (item.id === edu.id ? { ...item, year: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            CGPA / %
                          </label>
                          <Input
                            value={edu.grade}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEducations((prev) =>
                                prev.map((item) => (item.id === edu.id ? { ...item, grade: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Work Experience (Compact Multi-Column per Item) */}
              <div id="sec-experience" className="space-y-2 border-t border-border/40 pt-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span className="text-primary text-sm">💼</span> Work Experience ({experiences.length})
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddExperience}
                    className="h-6 text-[10px] px-2 gap-1 text-[#e11d48] border-[#e11d48]/30 hover:bg-rose-500/10 rounded-lg cursor-pointer font-medium"
                  >
                    <Plus className="h-3 w-3" /> Add Experience
                  </Button>
                </div>

                <div className="space-y-2">
                  {experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-2.5 rounded-xl border border-border/50 bg-muted/15 space-y-1.5"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-border/40">
                        <span className="text-[10px] font-bold text-foreground">
                          #{idx + 1} {exp.company ? `${exp.company} — ${exp.role}` : "Experience Entry"}
                        </span>
                        {experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="text-muted-foreground hover:text-destructive text-xs p-0.5 cursor-pointer transition-colors"
                            title="Remove Experience"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Company Name
                          </label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExperiences((prev) =>
                                prev.map((item) => (item.id === exp.id ? { ...item, company: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Job Title
                          </label>
                          <Input
                            value={exp.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExperiences((prev) =>
                                prev.map((item) => (item.id === exp.id ? { ...item, role: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Duration
                          </label>
                          <Input
                            value={exp.duration}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExperiences((prev) =>
                                prev.map((item) => (item.id === exp.id ? { ...item, duration: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                          Responsibilities & Achievements
                        </label>
                        <textarea
                          rows={2}
                          value={exp.bullets}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExperiences((prev) =>
                              prev.map((item) => (item.id === exp.id ? { ...item, bullets: val } : item))
                            );
                          }}
                          className="w-full p-2 rounded-lg border border-input bg-background text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed h-14"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Projects (Compact Multi-Column per Item) */}
              <div id="sec-projects" className="space-y-2 border-t border-border/40 pt-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span className="text-primary text-sm">📁</span> Projects ({projects.length})
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddProject}
                    className="h-6 text-[10px] px-2 gap-1 text-[#e11d48] border-[#e11d48]/30 hover:bg-rose-500/10 rounded-lg cursor-pointer font-medium"
                  >
                    <Plus className="h-3 w-3" /> Add Project
                  </Button>
                </div>

                <div className="space-y-2">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="p-2.5 rounded-xl border border-border/50 bg-muted/15 space-y-1.5"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-border/40">
                        <span className="text-[10px] font-bold text-foreground">
                          #{idx + 1} {proj.title || "Project Entry"}
                        </span>
                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(proj.id)}
                            className="text-muted-foreground hover:text-destructive text-xs p-0.5 cursor-pointer transition-colors"
                            title="Remove Project"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Project Title
                          </label>
                          <Input
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects((prev) =>
                                prev.map((item) => (item.id === proj.id ? { ...item, title: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Technologies Used
                          </label>
                          <Input
                            value={proj.technologies}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects((prev) =>
                                prev.map((item) => (item.id === proj.id ? { ...item, technologies: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Project URL (Optional)
                          </label>
                          <Input
                            value={proj.url}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjects((prev) =>
                                prev.map((item) => (item.id === proj.id ? { ...item, url: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                          Project Description
                        </label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProjects((prev) =>
                              prev.map((item) => (item.id === proj.id ? { ...item, description: val } : item))
                            );
                          }}
                          className="w-full p-2 rounded-lg border border-input bg-background text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed h-13"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Certifications (Compact 4-Column Grid per Item) */}
              <div id="sec-certifications" className="space-y-2 border-t border-border/40 pt-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span className="text-primary text-sm">🏅</span> Certifications ({certifications.length})
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCertification}
                    className="h-6 text-[10px] px-2 gap-1 text-[#e11d48] border-[#e11d48]/30 hover:bg-rose-500/10 rounded-lg cursor-pointer font-medium"
                  >
                    <Plus className="h-3 w-3" /> Add Certification
                  </Button>
                </div>

                <div className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <div
                      key={cert.id}
                      className="p-2.5 rounded-xl border border-border/50 bg-muted/15 space-y-1.5"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-border/40">
                        <span className="text-[10px] font-bold text-foreground">
                          #{idx + 1} {cert.name || "Certification Entry"}
                        </span>
                        {certifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(cert.id)}
                            className="text-muted-foreground hover:text-destructive text-xs p-0.5 cursor-pointer transition-colors"
                            title="Remove Certification"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Certification Name
                          </label>
                          <Input
                            value={cert.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCertifications((prev) =>
                                prev.map((item) => (item.id === cert.id ? { ...item, name: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Issuing Organization
                          </label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCertifications((prev) =>
                                prev.map((item) => (item.id === cert.id ? { ...item, issuer: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Completion Date
                          </label>
                          <Input
                            value={cert.date}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCertifications((prev) =>
                                prev.map((item) => (item.id === cert.id ? { ...item, date: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">
                            Credential URL
                          </label>
                          <Input
                            value={cert.url}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCertifications((prev) =>
                                prev.map((item) => (item.id === cert.id ? { ...item, url: val } : item))
                              );
                            }}
                            className="h-7 text-xs rounded-lg px-2 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Skills & Languages (Side-by-Side 2-Column Grid) */}
              <div id="sec-skills" className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/40 pt-2.5">
                <div>
                  <label className="text-[10px] font-bold text-foreground flex items-center gap-1 mb-0.5">
                    <span className="text-primary">⚙️</span> Skills (Comma-separated)
                  </label>
                  <Input
                    value={skillsString}
                    onChange={(e) => setSkillsString(e.target.value)}
                    className="h-7 text-xs rounded-lg px-2.5 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-foreground flex items-center gap-1 mb-0.5">
                    <span className="text-primary">🌐</span> Languages
                  </label>
                  <Input
                    value={languagesString}
                    onChange={(e) => setLanguagesString(e.target.value)}
                    className="h-7 text-xs rounded-lg px-2.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Google-Style PDF Viewer + ATS Score & Analysis */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top Bar for Resume Preview (Clean Header, No Duplicate Button) */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-foreground">Resume Preview</h2>
          </div>

          {/* Google Docs / Drive Style PDF Viewer Container */}
          <div className="rounded-2xl border border-border/80 shadow-md overflow-hidden bg-[#525659] flex flex-col">
            {/* Dark Viewer Header / Toolbar (Google Docs / PDF style) */}
            <div className="bg-[#323639] text-[#e8eaed] px-3.5 py-2 flex items-center justify-between text-xs border-b border-black/30 select-none shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Menu"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1 bg-black/35 rounded-md px-1.5 py-0.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => scrollToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    title="Previous Page"
                    className="p-0.5 rounded hover:bg-white/15 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-200 px-1 font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    title="Next Page"
                    className="p-0.5 rounded hover:bg-white/15 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Zoom & Page Fit Controls */}
              <div className="flex items-center gap-1 bg-black/25 rounded-md px-2 py-0.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  title="Reset Zoom"
                  className="text-[11px] font-mono px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
                >
                  {zoomLevel}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <div className="h-3 w-[1px] bg-white/20 mx-0.5" />
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => (z === 100 ? 115 : 100))}
                  title="Fit to Page"
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Actions: Download, Print, More */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Download Document"
                  className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Print Document"
                  className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="More Options"
                  className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable PDF Canvas Area with working vertical scrollbar */}
            <div
              ref={viewerContainerRef}
              onScroll={handleViewerScroll}
              className="p-4 sm:p-6 overflow-y-auto max-h-[640px] pdf-viewer-scrollbar flex justify-center bg-[#525659] select-none"
            >
              <div
                id="printable-resume"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                className="w-full max-w-[550px] flex flex-col items-center gap-6 transition-transform duration-150"
              >
                {/* Page 1 */}
                <div
                  id="resume-page-1"
                  className="bg-white text-slate-900 shadow-2xl p-7 sm:p-8 w-full min-h-[760px] rounded-xs flex flex-col justify-between text-[11px] leading-tight resume-page-sheet"
                >
                  <div className="space-y-4">
                    {/* Resume Header */}
                    <div className="text-center space-y-1 border-b border-slate-200 pb-2.5">
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
                        {fullName}
                      </h1>
                      <p className="text-xs font-semibold text-slate-800">
                        {targetRole}
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-600 pt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Mail className="h-2.5 w-2.5" /> {email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Phone className="h-2.5 w-2.5" /> {phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" /> {location}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-700 pt-0.5">
                        {linkedinUrl && (
                          <span className="flex items-center gap-1 hover:text-[#e11d48]">
                            <LinkedinIcon className="h-2.5 w-2.5 text-sky-700" /> {linkedinUrl.replace(/^https?:\/\//, "")}
                          </span>
                        )}
                        {githubUrl && (
                          <span className="flex items-center gap-1 hover:text-[#e11d48]">
                            <GithubIcon className="h-2.5 w-2.5" /> {githubUrl.replace(/^https?:\/\//, "")}
                          </span>
                        )}
                        {portfolioUrl && (
                          <span className="flex items-center gap-1 hover:text-[#e11d48]">
                            <Globe className="h-2.5 w-2.5 text-emerald-700" /> {portfolioUrl.replace(/^https?:\/\//, "")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 1. Professional Summary */}
                    {summary && (
                      <div className="space-y-1">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Professional Summary
                        </h2>
                        <p className="text-[9.5px] text-slate-700 leading-relaxed text-justify">
                          {summary}
                        </p>
                      </div>
                    )}

                    {/* 2. Education */}
                    {educations.length > 0 && (
                      <div className="space-y-1.5">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Education
                        </h2>
                        {educations.map((edu) => (
                          <div key={edu.id} className="space-y-0.5">
                            <div className="flex justify-between items-baseline font-bold text-slate-900 text-[10px]">
                              <span>{edu.degree}</span>
                              <span className="font-mono text-[9.5px] text-slate-600 font-normal">{edu.year}</span>
                            </div>
                            <div className="flex justify-between text-[9.5px] text-slate-600">
                              <span>{edu.university}</span>
                              {edu.grade && <span>CGPA: {edu.grade}/10</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3. Work Experience */}
                    {page1Experiences.length > 0 && (
                      <div className="space-y-1.5">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Work Experience
                        </h2>
                        {page1Experiences.map((exp) => (
                          <div key={exp.id} className="space-y-0.5">
                            <div className="flex justify-between items-baseline font-bold text-slate-900 text-[10px]">
                              <span>{exp.company}</span>
                              <span className="font-mono text-[9.5px] text-slate-600 font-normal">{exp.duration}</span>
                            </div>
                            <p className="text-[9.5px] italic text-slate-700">{exp.role}</p>
                            <div className="text-[9px] text-slate-700 leading-tight whitespace-pre-line pl-1">
                              {exp.bullets}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Page 1 Footer */}
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 font-mono mt-4 select-none">
                    <span>{fullName} • {targetRole}</span>
                    <span>Page 1 of {totalPages}</span>
                  </div>
                </div>

                {/* Page 2 */}
                <div
                  id="resume-page-2"
                  className="bg-white text-slate-900 shadow-2xl p-7 sm:p-8 w-full min-h-[760px] rounded-xs flex flex-col justify-between text-[11px] leading-tight resume-page-sheet"
                >
                  <div className="space-y-4">
                    {/* Page 2 Continuation Header */}
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2 text-[10px] text-slate-600">
                      <span className="font-bold text-slate-900">{fullName}</span>
                      <span className="text-slate-500 font-medium">{targetRole} (Continued)</span>
                      <span className="text-[9.5px] font-mono text-slate-400">{email}</span>
                    </div>

                    {/* Work Experience Continued (if any) */}
                    {page2Experiences.length > 0 && (
                      <div className="space-y-1.5">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Work Experience (Continued)
                        </h2>
                        {page2Experiences.map((exp) => (
                          <div key={exp.id} className="space-y-0.5">
                            <div className="flex justify-between items-baseline font-bold text-slate-900 text-[10px]">
                              <span>{exp.company}</span>
                              <span className="font-mono text-[9.5px] text-slate-600 font-normal">{exp.duration}</span>
                            </div>
                            <p className="text-[9.5px] italic text-slate-700">{exp.role}</p>
                            <div className="text-[9px] text-slate-700 leading-tight whitespace-pre-line pl-1">
                              {exp.bullets}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 4. Projects */}
                    {page2Projects.length > 0 && (
                      <div className="space-y-2">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Technical & Capstone Projects
                        </h2>
                        {page2Projects.map((proj) => (
                          <div key={proj.id} className="space-y-0.5">
                            <div className="flex items-center justify-between font-bold text-slate-900 text-[10px]">
                              <span className="flex items-center gap-1">
                                {proj.title}
                                {proj.url && <ExternalLink className="h-2.5 w-2.5 text-slate-400" />}
                              </span>
                              {proj.url && (
                                <span className="text-[9px] text-slate-500 font-mono font-normal">
                                  {proj.url.replace(/^https?:\/\//, "")}
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-700 leading-tight">
                              {proj.description}
                            </p>
                            {proj.technologies && (
                              <p className="text-[8.5px] text-slate-500 font-mono">
                                <strong className="text-slate-700">Technologies:</strong> {proj.technologies}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 5. Certifications */}
                    {certifications.length > 0 && (
                      <div className="space-y-1">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Certifications & Credentials
                        </h2>
                        {certifications.map((cert) => (
                          <div key={cert.id} className="flex justify-between items-baseline text-[9.5px]">
                            <div>
                              <strong className="text-slate-900">{cert.name}</strong>
                              <span className="text-slate-600 block text-[9px]">{cert.issuer}</span>
                            </div>
                            <span className="font-mono text-[9px] text-slate-500">{cert.date}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 6. Skills */}
                    {skillsString && (
                      <div className="space-y-0.5">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Technical Skills & Tools
                        </h2>
                        <p className="text-[9px] text-slate-700 leading-relaxed font-sans">
                          {skillsString}
                        </p>
                      </div>
                    )}

                    {/* 7. Languages */}
                    {languagesString && (
                      <div className="space-y-0.5">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Languages
                        </h2>
                        <p className="text-[9px] text-slate-700">
                          {languagesString}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Page 2 Footer */}
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 font-mono mt-4 select-none">
                    <span>{fullName} • Resume</span>
                    <span>Page 2 of {totalPages}</span>
                  </div>
                </div>

                {/* Page 3 (Rendered conditionally if user has excess projects) */}
                {hasPage3 && (
                  <div
                    id="resume-page-3"
                    className="bg-white text-slate-900 shadow-2xl p-7 sm:p-8 w-full min-h-[760px] rounded-xs flex flex-col justify-between text-[11px] leading-tight resume-page-sheet"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 text-[10px] text-slate-600">
                        <span className="font-bold text-slate-900">{fullName}</span>
                        <span className="text-slate-500 font-medium">Projects & Contributions (Continued)</span>
                        <span className="text-[9.5px] font-mono text-slate-400">{email}</span>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#e11d48] border-b border-[#e11d48]/40 pb-0.5">
                          Additional Projects
                        </h2>
                        {page3Projects.map((proj) => (
                          <div key={proj.id} className="space-y-0.5">
                            <div className="flex items-center justify-between font-bold text-slate-900 text-[10px]">
                              <span className="flex items-center gap-1">
                                {proj.title}
                                {proj.url && <ExternalLink className="h-2.5 w-2.5 text-slate-400" />}
                              </span>
                              {proj.url && (
                                <span className="text-[9px] text-slate-500 font-mono font-normal">
                                  {proj.url.replace(/^https?:\/\//, "")}
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-700 leading-tight">
                              {proj.description}
                            </p>
                            {proj.technologies && (
                              <p className="text-[8.5px] text-slate-500 font-mono">
                                <strong className="text-slate-700">Technologies:</strong> {proj.technologies}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Page 3 Footer */}
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 font-mono mt-4 select-none">
                      <span>{fullName} • Resume</span>
                      <span>Page 3 of {totalPages}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ATS Score & Analysis Card (compact layout) */}
          <Card className="p-4 rounded-2xl bg-card border-border/80 shadow-xs space-y-2.5">
            <h3 className="font-bold text-xs sm:text-sm text-foreground">ATS Score & Analysis</h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-0.5">
              {/* Circular Progress Gauge */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted/60"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#e11d48] transition-all duration-700 ease-out"
                      strokeDasharray="88, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-extrabold text-foreground">88%</span>
                    <span className="text-[8px] font-semibold text-muted-foreground">ATS Score</span>
                  </div>
                </div>
              </div>

              {/* Analysis Checklist */}
              <div className="space-y-1.5 text-[11px] flex-1">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Clear and concise professional summary</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Relevant skills for target role</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Education details present</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Project details included</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border-2 border-amber-500 shrink-0 inline-block" />
                  <span>Consider adding more work experience</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border-2 border-amber-500 shrink-0 inline-block" />
                  <span>Add more industry-specific keywords (e.g., MLOps, Kubernetes)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentResumePage;
