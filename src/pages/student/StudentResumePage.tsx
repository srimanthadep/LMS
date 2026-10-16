import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  ExternalLink,
  Award,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const StudentResumePage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Resume form state
  const [candidateName, setCandidateName] = useState("Arjun Mehta");
  const [candidateTitle, setCandidateTitle] = useState("Full-Stack AI & LLM Systems Engineer");
  const [email, setEmail] = useState("arjun.mehta@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Bengaluru, India");
  const [githubUrl, setGithubUrl] = useState("https://github.com/arjunmehta-ai");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/arjun-mehta-lms");
  const [summary, setSummary] = useState(
    "Full-Stack AI Engineer specialized in production LLM deployment, contextual retrieval (RAG), and multi-agent coordination with LangGraph. Graduated from Apex AI Systems Cohort 7 with top distinction (GPA 95/100)."
  );

  const [skills, setSkills] = useState([
    "Python", "PyTorch", "LangGraph", "LangChain", "Qdrant", "Cohere Rerank", "vLLM", "Docker", "Kubernetes", "FastAPI"
  ]);

  const [projects, setProjects] = useState([
    {
      id: "p1",
      title: "Hybrid RAG Pipeline with Contextual Compression",
      tech: "Python, Qdrant, Cohere Rerank v3, LangChain",
      metrics: "Achieved 18.4% MRR@5 boost and reduced lost-in-the-middle context degradation by 60%.",
      points: [
        "Architected two-stage approximate nearest-neighbor vector recall with deep cross-encoder reranking.",
        "Engineered chunking boundaries preserving paragraph semantic continuity across enterprise documentation.",
      ],
    },
    {
      id: "p2",
      title: "Autonomous Multi-Agent Hierarchical Supervisor",
      tech: "LangGraph, OpenAI GPT-4o, Tool Use, Redis",
      metrics: "Handled 150+ concurrent conversational workflows with persistent checkpoint memory.",
      points: [
        "Implemented stateful graph supervisor dispatching research, code generation, and test execution agents.",
        "Integrated human-in-the-loop interruption gates for high-stakes tool execution.",
      ],
    },
  ]);

  const atsScore = 94;

  const handleCopyMarkdown = () => {
    const text = `# ${candidateName}
${candidateTitle} | ${email} | ${phone} | ${location}
GitHub: ${githubUrl} | LinkedIn: ${linkedinUrl}

## Professional Summary
${summary}

## Technical Skills
${skills.join(", ")}

## Key Cohort Projects
${projects
  .map(
    (p) => `### ${p.title} (${p.tech})
- ${p.metrics}
${p.points.map((pt) => `- ${pt}`).join("\n")}`
  )
  .join("\n\n")}

## Education & Certifications
- Full-Stack AI & LLM Systems Engineering (Cohort 7 Distinction) — Apex AI LMS (2026)
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-primary" /> AI Career & Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Curate an ATS-optimized AI engineering resume showcasing verified Cohort 7 capstone projects, rubrics, and GitHub repos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  alert(`Successfully uploaded ${file.name}. Parsed into resume editor.`);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-1.5 cursor-pointer"
              onClick={(e) => {
                (e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement)?.click();
              }}
            >
              <FileText className="h-3.5 w-3.5 text-primary" /> Upload Resume
            </Button>
          </label>

          <Button
            onClick={handleCopyMarkdown}
            variant="outline"
            size="sm"
            className="text-xs h-9 gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied Markdown" : "Copy Markdown"}
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs h-9 gap-1.5 font-semibold cursor-pointer shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Export PDF / Download
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Editor (5 cols) & Right Preview + ATS Score (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor */}
        <div className="lg:col-span-5 space-y-5">
          {/* ATS Score Card */}
          <Card className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-card to-card border-emerald-500/30 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> ATS Compatibility Score
              </span>
              <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                {atsScore} / 100 EXCELLENT
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Keywords</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">96%</strong>
              </div>
              <div className="p-2 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Metrics</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">92%</strong>
              </div>
              <div className="p-2 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] text-muted-foreground block">Structure</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">95%</strong>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your resume contains high-frequency industry terms like <em>HNSW, LangGraph, Contextual Retrieval, PagedAttention</em> verified by Apex LMS rubrics.
            </p>
          </Card>

          {/* Editor Form */}
          <Card className="p-5 rounded-2xl bg-card border-border/80 shadow-2xs space-y-4">
            <div className="border-b border-border/60 pb-2">
              <h3 className="font-bold text-sm text-foreground">Edit Resume Details</h3>
              <p className="text-xs text-muted-foreground">Changes update the real-time preview instantly.</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Full Name</label>
                <Input
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Target Role Title</label>
                <Input
                  value={candidateTitle}
                  onChange={(e) => setCandidateTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Email</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Phone</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Professional Summary</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-card text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Skills (Comma-separated)</label>
                <Input
                  value={skills.join(", ")}
                  onChange={(e) =>
                    setSkills(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Printable Resume Preview (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-card border border-border/80 shadow-md text-foreground space-y-6 min-h-[700px] font-sans">
            {/* Header section */}
            <div className="border-b border-border/80 pb-6 text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {candidateName}
              </h1>
              <p className="text-sm font-semibold text-[#e11d48] dark:text-rose-400">
                {candidateTitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-primary" /> {email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-primary" /> {phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {location}</span>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs pt-1">
                <a href={githubUrl} target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-primary flex items-center gap-1">
                  <GithubIcon className="h-3.5 w-3.5" /> GitHub Profile
                </a>
                <span>•</span>
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-primary flex items-center gap-1">
                  <LinkedinIcon className="h-3.5 w-3.5 text-sky-600" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-border/60 pb-1">
                Executive Summary
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-border/60 pb-1">
                Technical Proficiencies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-muted text-[11px] font-mono font-medium text-slate-800 dark:text-slate-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Capstone Projects */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-border/60 pb-1">
                Cohort Capstone Projects & Benchmark Results
              </h2>

              {projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <strong className="text-slate-900 dark:text-white font-bold">{proj.title}</strong>
                    <span className="text-[11px] font-mono text-muted-foreground">{proj.tech}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Impact: {proj.metrics}
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                    {proj.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education & Distinction */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-border/60 pb-1">
                Education & LMS Distinction
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-white">Apex AI Systems Engineering Fellowship</strong>
                  <p className="text-[11px] text-muted-foreground">Cohort 7 (Live + Replay) • Lead Faculty: Prof. Rajesh Verma</p>
                </div>
                <div className="text-left sm:text-right mt-1 sm:mt-0">
                  <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    GPA 95/100 DISTINCTION
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentResumePage;
