import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles, ArrowLeft, MailCheck, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeAccentPicker } from "@/components/ui/ThemeAccentPicker";

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end gap-2">
        <ThemeToggle />
        <ThemeAccentPicker />
      </div>

      <div className="max-w-md w-full mx-auto my-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Apex AI LMS</h1>
          <p className="text-xs text-muted-foreground">Account Access Recovery</p>
        </div>

        <Card className="border-border/80 shadow-xl rounded-2xl overflow-hidden bg-card/95 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
            <CardTitle className="text-base font-bold">Reset Password</CardTitle>
            <CardDescription className="text-xs">
              Enter your registered institute email to receive an access recovery link.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5">
            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
                  <MailCheck className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-foreground">Password Recovery Email Dispatched</h4>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  If an account exists for <strong>{email}</strong>, you will receive password reset instructions within 2 minutes.
                </p>
                <div className="pt-2">
                  <Button asChild variant="outline" className="text-xs h-9">
                    <Link to="/auth/login" className="gap-1.5">
                      <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Registered Email</label>
                  <Input
                    type="email"
                    required
                    placeholder="name@edulms.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 font-bold text-xs shadow-sm"
                >
                  {isLoading ? "Sending Link..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="py-3 px-5 border-t border-border/60 bg-muted/10 justify-center">
            <Link
              to="/auth/login"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="h-3 w-3" /> Return to Login
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center text-[11px] text-muted-foreground py-2">
        © 2026 Apex AI LMS Security
      </div>
    </div>
  );
};
