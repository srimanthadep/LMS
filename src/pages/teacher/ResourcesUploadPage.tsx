import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Upload, FileText, Code, CheckCircle2, Download, Trash2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

interface ResourceItem {
  id: string;
  title: string;
  type: "Slide Deck (PDF)" | "Source Code (ZIP)" | "Daily Practice Problem (DPP)";
  batchName: string;
  fileSize: string;
  uploadedAt: string;
}

const INITIAL_RESOURCES: ResourceItem[] = [
  { id: "r1", title: "Lecture 8: Vector Databases & Chunking Slides", type: "Slide Deck (PDF)", batchName: "Cohort 7 (Live + Replay)", fileSize: "14.2 MB", uploadedAt: "Yesterday" },
  { id: "r2", title: "Milestone 2 Starter Repo: LangChain Hybrid RAG", type: "Source Code (ZIP)", batchName: "Cohort 7 (Live + Replay)", fileSize: "2.8 MB", uploadedAt: "3 days ago" },
  { id: "r3", title: "DPP 4: HNSW efSearch Optimization Exercises", type: "Daily Practice Problem (DPP)", batchName: "All Cohorts", fileSize: "1.1 MB", uploadedAt: "5 days ago" },
];

export const ResourcesUploadPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ResourceItem["type"]>("Slide Deck (PDF)");
  const [batchName, setBatchName] = useState("Cohort 7 (Live + Replay)");
  const { addNotification } = useNotifications();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      title,
      type,
      batchName,
      fileSize: "4.8 MB",
      uploadedAt: "Just now",
    };

    setResources([newRes, ...resources]);
    setTitle("");
    addNotification({
      title: "Resource Published",
      message: `"${title}" has been attached to ${batchName} study materials.`,
      type: "class",
    });
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Faculty Resource & Slide Library
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Upload slide decks, GitHub reference templates, and Daily Practice Problems (DPPs).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form (1 col) */}
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" /> Publish Material
            </h3>

            <form onSubmit={handleUpload} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Material Title</label>
                <Input
                  required
                  placeholder="e.g. Session 9 Annotated Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Material Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  <option value="Slide Deck (PDF)">Slide Deck (PDF)</option>
                  <option value="Source Code (ZIP)">Source Code (ZIP)</option>
                  <option value="Daily Practice Problem (DPP)">Daily Practice Problem (DPP)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Cohort Access</label>
                <select
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  <option value="Cohort 7 (Live + Replay)">Cohort 7 (Live + Replay)</option>
                  <option value="Cohort 8 (Replay Only)">Cohort 8 (Replay Only)</option>
                  <option value="All Cohorts">All Cohorts</option>
                </select>
              </div>

              {/* Drag drop dropzone simulator */}
              <div className="border border-dashed border-border/80 rounded-xl p-4 text-center space-y-1 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors">
                <Upload className="h-6 w-6 text-primary mx-auto opacity-70" />
                <p className="text-xs font-semibold text-foreground">Click to upload file</p>
                <p className="text-[10px] text-muted-foreground">PDF, ZIP, or Notebook up to 50MB</p>
              </div>

              <Button type="submit" className="w-full h-9 text-xs font-bold shadow-sm">
                Publish Resource
              </Button>
            </form>
          </Card>

          {/* Resources List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <Card className="border-border/80 shadow-xs rounded-2xl overflow-hidden bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold">Published Cohort Files</CardTitle>
                <Badge variant="outline" className="text-[10px]">{resources.length} Files Active</Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                        {res.type.includes("Code") ? <Code className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-xs sm:text-sm">{res.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {res.type} • {res.batchName} • {res.fileSize}
                        </p>
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" className="h-8 text-xs text-primary gap-1">
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};
