import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ThemeAccentPicker } from "@/components/ui/ThemeAccentPicker";

export const TwoFactorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const targetRole = (searchParams.get("role") || user.role) as UserRole;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setError("Please input the complete 6-digit TOTP code.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      navigate(`/${targetRole}/dashboard`);
    }, 600);
  };

  const handleQuickFill = () => {
    setOtp(["8", "4", "2", "9", "1", "0"]);
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
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Two-Factor Authentication</h1>
          <p className="text-xs text-muted-foreground">
            Staff Security Guard for <strong>{user.name}</strong> ({targetRole.replace("-", " ")})
          </p>
        </div>

        <Card className="border-border/80 shadow-xl rounded-2xl overflow-hidden bg-card/95 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Enter 6-Digit TOTP</CardTitle>
              <Badge variant="accent" className="text-[10px] uppercase font-bold">
                Mandatory Staff 2FA
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Check your Google Authenticator or registered hardware token.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              {/* OTP Digits */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    autoFocus={i === 0}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-lg rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-ring outline-none transition-all shadow-xs"
                  />
                ))}
              </div>

              {/* Demo auto-fill helper */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] text-primary hover:underline font-bold"
                >
                  ⚡ Auto-fill Demo TOTP: 842910
                </button>
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full h-10 font-bold text-xs gap-1.5 shadow-sm"
              >
                {isVerifying ? (
                  <span>Verifying TOTP...</span>
                ) : (
                  <>
                    <span>Verify & Access Platform</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                <span>Resend push / SMS in</span>
                <span className="font-mono font-bold text-foreground">{countdown}s</span>
              </p>
            </div>
          </CardContent>

          <CardFooter className="py-3 px-5 border-t border-border/60 bg-muted/10 justify-center">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              SOC2 Type II & ISO 27001 Compliant Auth Engine
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center text-[11px] text-muted-foreground py-2">
        © 2026 Apex AI Learning Systems
      </div>
    </div>
  );
};
