import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileCheck2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export const TestCreationPage: React.FC = () => {
  const [testTitle, setTestTitle] = useState("Milestone 3: Agent Swarm Coordination");
  const [durationMins, setDurationMins] = useState("90");
  const [passingMarks, setPassingMarks] = useState("70");
  const { addNotification } = useNotifications();

  const [criteria, setCriteria] = useState([
    { id: "c1", name: "Multi-Agent Protocol Correctness", maxScore: 25 },
    { id: "c2", name: "Tool Routing & Schema Validation", maxScore: 25 },
    { id: "c3", name: "Resilient Error Recovery & Fallbacks", maxScore: 25 },
    { id: "c4", name: "Code Cleanliness & Test Coverage", maxScore: 25 },
  ]);

  const handleAddCriterion = () => {
    setCriteria([...criteria, { id: `c-${Date.now()}`, name: "New Rubric Dimension", maxScore: 20 }]);
  };

  const handlePublishTest = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      title: "Assessment Published",
      message: `"${testTitle}" with a 100-mark rubric is now active for student submissions.`,
      type: "grade",
      link: "/student/assessments",
    });
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-primary" /> Assessment & Rubric Builder
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Formulate multi-dimensional grading rubrics for automated objective scoring and subjective code evaluations.
          </p>
        </div>

        <form onSubmit={handlePublishTest} className="space-y-6">
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Assessment Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Assessment Title</label>
                <Input
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Time Limit (Minutes)</label>
                <Input
                  type="number"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Passing Score (%)</label>
                <Input
                  type="number"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </Card>

          {/* Rubric Criteria Builder */}
          <Card className="border-border/80 shadow-xs rounded-2xl bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Subjective Rubric Criteria</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Evaluators will grade student code submissions against these explicit dimensions.
                </p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={handleAddCriterion} className="text-xs h-8">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Criterion
              </Button>
            </div>

            <div className="space-y-3">
              {criteria.map((crit, index) => (
                <div key={crit.id} className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-xs font-bold text-primary font-mono shrink-0">#{index + 1}</span>
                  <Input
                    value={crit.name}
                    onChange={(e) => {
                      const updated = [...criteria];
                      updated[index].name = e.target.value;
                      setCriteria(updated);
                    }}
                    className="h-9 text-xs flex-1 bg-background"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">Max Marks:</span>
                    <Input
                      type="number"
                      value={crit.maxScore}
                      onChange={(e) => {
                        const updated = [...criteria];
                        updated[index].maxScore = Number(e.target.value);
                        setCriteria(updated);
                      }}
                      className="h-9 w-20 text-xs bg-background"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border/70 flex justify-end">
              <Button type="submit" className="text-xs h-9 font-bold gap-1 shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5" /> Publish Assessment to Cohorts
              </Button>
            </div>
          </Card>
        </form>
      </div>
  );
};
