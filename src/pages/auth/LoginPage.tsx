import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeAccentPicker } from "@/components/ui/ThemeAccentPicker";

const ROLES_LIST: { role: UserRole; title: string; desc: string; icon: string }[] = [
  { role: "student", title: "Student / Learner", desc: "Arjun Mehta (Live + Replay cohort)", icon: "🎓" },
  { role: "teacher", title: "Faculty / Instructor", desc: "Prof. Rajesh Verma (AI Studio)", icon: "👨‍🏫" },
  { role: "admin", title: "Academic Admin", desc: "Ananya Iyer (Operations & Batches)", icon: "⚡" },
  { role: "super-admin", title: "Super Admin", desc: "Dr. Vikram Sethi (Platform Owner)", icon: "🛡️" },
  { role: "evaluator", title: "Evaluator", desc: "Kavita Rao (Grading & Rubrics)", icon: "📝" },
  { role: "support", title: "Mentor / Support", desc: "Nikhil Joshi (Student 360 & Tickets)", icon: "🎧" },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [email, setEmail] = useState("arjun.m@learner.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleQuickSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role].email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      switchRole(selectedRole);

      // Check if role requires 2FA
      if (DEMO_USERS[selectedRole].twoFactorEnabled) {
        navigate(`/auth/2fa?role=${selectedRole}`);
      } else {
        navigate(`/${selectedRole}/dashboard`);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top right theme controls */}
      <div className="flex justify-end gap-2">
        <ThemeToggle />
        <ThemeAccentPicker />
      </div>

      <div className="max-w-md w-full mx-auto my-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Apex AI LMS</h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Enterprise AI-First Live Cohort & Lecture Intelligence Platform
          </p>
        </div>

        <Card className="border-border/80 shadow-xl rounded-2xl overflow-hidden bg-card/95 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Sign In to Workspace</CardTitle>
              <Badge variant="accent" className="text-[10px] uppercase font-bold">
                Role-Aware
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Select your persona below to test role-specific entitlements and workflows.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Role Picker Grid */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Quick Role Selection (Demo)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES_LIST.map((r) => {
                  const isSelected = selectedRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleRoleQuickSelect(r.role)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 select-none ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                          : "border-border/70 hover:bg-muted/50 bg-background/50"
                      }`}
                    >
                      <span className="text-base leading-none">{r.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {r.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Organization Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Password</label>
                  <Link
                    to="/auth/reset-password"
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 font-bold text-xs gap-1.5 mt-2 shadow-sm"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter {selectedRole.replace("-", " ").toUpperCase()} Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="py-3 px-5 border-t border-border/60 bg-muted/10 text-center justify-center">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Protected by enterprise 2FA and RBAC governance
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center text-[11px] text-muted-foreground py-2">
        © 2026 Apex AI Learning Systems. All academic rights reserved.
      </div>
    </div>
  );
};
