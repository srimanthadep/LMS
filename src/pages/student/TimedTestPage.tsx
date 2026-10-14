import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Send,
  Code,
  FileText,
  Save,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Question {
  id: number;
  type: "mcq" | "code" | "descriptive";
  title: string;
  points: number;
  prompt: string;
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: "mcq",
    title: "Vector Distance Metrics",
    points: 10,
    prompt:
      "When comparing cosine similarity and dot product on unit-normalized dense embeddings, what is the mathematical relationship?",
    options: [
      "Cosine similarity is strictly greater than dot product",
      "Cosine similarity is mathematically equivalent to the dot product",
      "Dot product is non-monotonic relative to cosine similarity",
      "Cosine similarity requires L1 regularization while dot product does not",
    ],
  },
  {
    id: 2,
    type: "mcq",
    title: "Hierarchical Graph Search Complexity",
    points: 10,
    prompt: "In HNSW, what does increasing the efSearch parameter directly trade off?",
    options: [
      "Higher index build time in exchange for lower memory footprint",
      "Higher retrieval recall in exchange for increased query latency",
      "Lower vector dimension compression in exchange for CPU cache efficiency",
      "Lower precision at rank 1 in exchange for faster GPU throughput",
    ],
  },
  {
    id: 3,
    type: "code",
    title: "Implement Contextual Compression Retriever",
    points: 40,
    prompt:
      "Write a Python function `build_hybrid_pipeline(embeddings, client)` that initializes a Qdrant vector store with search_kwargs k=25 and wraps it in a CohereRerank compressor (top_n=5).",
  },
  {
    id: 4,
    type: "descriptive",
    title: "Lost-in-the-Middle Mitigation Architecture",
    points: 40,
    prompt:
      "Explain your architectural reasoning for limiting top_n to 5 after an initial wide retrieval of 25 chunks. How does this prevent degradation in LLM needle-in-a-haystack attention?",
  },
];

export const TimedTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60); // 45 minutes
  const [answers, setAnswers] = useState<Record<number, any>>({
    1: 1, // option 2
    2: 1, // option 2
    3: `import os\nfrom langchain_community.vectorstores import Qdrant\nfrom langchain_cohere import CohereRerank\nfrom langchain.retrievers import ContextualCompressionRetriever\n\ndef build_hybrid_pipeline(embeddings, client):\n    vector_retriever = Qdrant(\n        client=client,\n        collection_name="enterprise_docs",\n        embeddings=embeddings\n    ).as_retriever(search_kwargs={"k": 25})\n    \n    compressor = CohereRerank(model="rerank-english-v3.0", top_n=5)\n    return ContextualCompressionRetriever(\n        base_compressor=compressor,\n        base_retriever=vector_retriever\n    )`,
    4: `Initial dense vector search casts a wide net with high recall (k=25). The cross-encoder then reranks candidates by full token interaction. Limiting the LLM context to top 5 chunks eliminates noisy distractors and prevents lost-in-the-middle degradation where middle tokens are neglected by causal attention.`,
  });
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState("Just now");

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQ = QUESTIONS[currentIdx];

  const handleToggleFlag = (id: number) => {
    setFlagged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    navigate("/student/test-results/sub-1");
  };

  return (
    <div className="space-y-6">
      {/* Test Sticky Header */}
      <div className="sticky top-16 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
              Graded Milestone
            </Badge>
            <span className="text-xs text-muted-foreground">• Full-Stack AI & LLM Systems</span>
          </div>
          <h2 className="text-lg font-bold text-foreground mt-0.5">
            Milestone 2: Hybrid RAG System with Cohere Rerank
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Live countdown */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${
              secondsRemaining < 300
                ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
                : "bg-muted text-foreground border-border"
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTimer(secondsRemaining)}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Save className="h-3.5 w-3.5 text-emerald-500" />
            Auto-saved {lastSaved}
          </div>

          <Button
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="gap-2 bg-primary text-primary-foreground shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Submit Test
          </Button>
        </div>
      </div>

      {/* Main Grid: Question Palette on left (3 cols), Workstation on right (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2 border-b border-border">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Question Navigator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {QUESTIONS.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";
                  const isFlagged = flagged[q.id];
                  const isCurrent = idx === currentIdx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-11 rounded-lg border flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                        isCurrent
                          ? "ring-2 ring-primary ring-offset-2 bg-primary/10 border-primary text-primary"
                          : isAnswered
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span>Q{q.id}</span>
                      <span className="text-[10px] font-normal opacity-75">{q.points}pts</span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-xs bg-emerald-500/20 border border-emerald-500/40" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-xs bg-muted border border-border" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Flagged for review</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 p-4 text-xs space-y-2">
            <h4 className="font-semibold text-primary flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Assessment Rules
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Anti-plagiarism scanning active. Do not switch tabs. AI code evaluation is performed automatically upon submission.
            </p>
          </Card>
        </div>

        {/* Question Workstation */}
        <div className="lg:col-span-9 space-y-6">
          <Card>
            <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Question {currentQ.id} of {QUESTIONS.length} • {currentQ.type.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-foreground mt-1">{currentQ.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFlag(currentQ.id)}
                  className={`gap-1.5 text-xs ${
                    flagged[currentQ.id] ? "border-amber-500 text-amber-500 bg-amber-500/10" : ""
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  {flagged[currentQ.id] ? "Flagged" : "Flag"}
                </Button>
                <Badge variant="secondary" className="text-xs">
                  {currentQ.points} Points
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {currentQ.prompt}
              </p>

              {/* MCQ Options */}
              {currentQ.type === "mcq" && currentQ.options && (
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => {
                          setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
                          setLastSaved("Just now");
                        }}
                        className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary shadow-xs"
                            : "bg-card hover:bg-muted/50 border-border"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground text-muted-foreground"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-xs sm:text-sm text-foreground">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Code Submission Workstation */}
              {currentQ.type === "code" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <Code className="h-3.5 w-3.5 text-primary" /> solution.py
                    </span>
                    <span>Python 3.11</span>
                  </div>
                  <textarea
                    rows={12}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }));
                      setLastSaved("Just now");
                    }}
                    className="w-full font-mono text-xs rounded-xl border border-border bg-muted/40 p-4 focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
                    placeholder="# Write your implementation here..."
                  />
                </div>
              )}

              {/* Descriptive Workstation */}
              {currentQ.type === "descriptive" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-primary" /> Technical Justification
                    </span>
                    <span>Rubric: Conceptual Depth, Clarity, System Tradeoffs</span>
                  </div>
                  <textarea
                    rows={8}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => {
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }));
                      setLastSaved("Just now");
                    }}
                    className="w-full text-xs rounded-xl border border-border bg-background p-4 focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
                    placeholder="Provide your architectural rationale..."
                  />
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => i - 1)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>

                {currentIdx < QUESTIONS.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentIdx((i) => i + 1)}
                    className="gap-2"
                  >
                    Next Question <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="gap-2 bg-primary text-primary-foreground"
                  >
                    Review & Submit <Send className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Submission Dialog */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Confirm Test Submission
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs sm:text-sm text-muted-foreground">
            <p>
              You have answered all <strong>{QUESTIONS.length} questions</strong>.
            </p>
            <p>
              Once submitted, your answers will be locked and routed to the automated AI evaluator and human evaluator queue.
            </p>
            <div className="rounded-lg border border-border p-3 bg-muted/30 text-xs text-foreground space-y-1">
              <div>Time Remaining: <strong>{formatTimer(secondsRemaining)}</strong></div>
              <div>Auto-saved Version: <strong>Ready</strong></div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Keep Working
            </Button>
            <Button onClick={handleConfirmSubmit} className="bg-primary text-primary-foreground">
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
