import React, { useState } from "react";
import {
  Share2,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Save,
  Globe,
  FileCode,
  BookOpen,
  Info,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/context/NotificationContext";

export const StudentLinksPage: React.FC = () => {
  const { addNotification } = useNotifications();

  // Social Links State
  const [githubUrl, setGithubUrl] = useState("https://github.com/arjunmehta-ai");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/arjun-mehta-lms");
  const [portfolioUrl, setPortfolioUrl] = useState("https://arjunmehta.dev");
  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    addNotification({
      title: "Links Updated",
      message: "Your social and portfolio URLs have been updated in your active profile.",
      type: "system",
    });
  };

  const institutionalLinks = [
    {
      title: "Apex AI Curriculum Code Repository",
      category: "Official Codebase",
      url: "https://github.com/topics/autonomous-agents",
      description: "Official hands-on lab code, starter notebooks, and PyTorch CUDA kernel templates.",
      icon: FileCode,
    },
    {
      title: "Apex Academic Research Library & ArXiv Index",
      category: "Research",
      url: "https://arxiv.org/abs/2309.06180",
      description: "Foundational papers on PagedAttention, continuous batching, and LangGraph architectures.",
      icon: BookOpen,
    },
    {
      title: "Apex Student Community Discord & Discussions",
      category: "Community",
      url: "https://discord.com",
      description: "Real-time voice channels, hackathon team matching, and peer code review rooms.",
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Share2 className="h-6 w-6 text-primary" /> Verified Student Links & Profiles
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Direct authenticated destinations for your GitHub, LinkedIn, portfolio, and curriculum repositories.
          </p>
        </div>

        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2 rounded-xl text-xs h-9 self-start sm:self-auto"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Social Links
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSaveLinks}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 self-start sm:self-auto"
          >
            <Save className="h-3.5 w-3.5" /> Save Changes
          </Button>
        )}
      </div>

      {/* Guidance Notice */}
      <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          Verified destination check: All social handles link to confirmed student profiles. These URLs are synced with your ATS resume export and certificate sharing cards.
        </p>
      </div>

      {/* Personal Professional Profiles */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Personal Verified Profiles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GitHub Card */}
          <Card className="rounded-2xl border-border/70 hover:border-primary/40 shadow-sm transition-all p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center border border-border/60">
                  <GithubIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">GitHub Profile</h3>
                  <span className="text-[11px] text-muted-foreground">Code repositories & capstone PRs</span>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">Verified</Badge>
            </div>

            {isEditing ? (
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            ) : (
              <p className="font-mono text-xs text-primary truncate bg-muted/30 p-2 rounded-lg">
                {githubUrl}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" className="w-full text-xs h-8 rounded-lg gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <ExternalLink className="h-3 w-3" /> Visit GitHub
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(githubUrl, "github")}
                className="text-xs h-8 rounded-lg gap-1"
              >
                {copiedKey === "github" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copiedKey === "github" ? "Copied" : "Copy"}
              </Button>
            </div>
          </Card>

          {/* LinkedIn Card */}
          <Card className="rounded-2xl border-border/70 hover:border-primary/40 shadow-sm transition-all p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center border border-border/60">
                  <LinkedinIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">LinkedIn Profile</h3>
                  <span className="text-[11px] text-muted-foreground">Credentials & professional network</span>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">Verified</Badge>
            </div>

            {isEditing ? (
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="h-9 rounded-xl text-xs"
              />
            ) : (
              <p className="font-mono text-xs text-primary truncate bg-muted/30 p-2 rounded-lg">
                {linkedinUrl}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" className="w-full text-xs h-8 rounded-lg gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <ExternalLink className="h-3 w-3" /> Visit LinkedIn
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(linkedinUrl, "linkedin")}
                className="text-xs h-8 rounded-lg gap-1"
              >
                {copiedKey === "linkedin" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copiedKey === "linkedin" ? "Copied" : "Copy"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Institutional Learning Resources Links */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Curriculum & Institutional Repositories
        </h2>

        <div className="space-y-3">
          {institutionalLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="rounded-2xl border-border/60 shadow-sm p-4 hover:border-primary/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="shrink-0 self-end sm:self-center">
                    <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5">
                      <ExternalLink className="h-3 w-3 text-primary" /> Open Link
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
