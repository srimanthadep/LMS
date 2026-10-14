import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { Shield, Eye, X, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { role: UserRole; label: string; defaultPath: string }[] = [
  { role: "super-admin", label: "Super Admin", defaultPath: "/super-admin/dashboard" },
  { role: "admin", label: "Admin", defaultPath: "/admin/dashboard" },
  { role: "teacher", label: "Teacher", defaultPath: "/teacher/dashboard" },
  { role: "student", label: "Student", defaultPath: "/student/dashboard" },
  { role: "evaluator", label: "Evaluator", defaultPath: "/evaluator/dashboard" },
  { role: "support", label: "Support", defaultPath: "/support/dashboard" },
];

export const DevRoleSwitcher: React.FC = () => {
  const { user, role, impersonatingFrom, switchRole, stopImpersonation } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole, defaultPath: string) => {
    switchRole(newRole);
    navigate(defaultPath);
  };

  return (
    <div className="w-full bg-muted/40 border-b border-border/70 text-xs px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 z-30 select-none">
      {/* Impersonation Warning Banner */}
      {impersonatingFrom ? (
        <div className="flex-1 flex items-center justify-between bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-xl">
          <div className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 animate-pulse text-amber-600" />
            <span className="font-semibold">
              Impersonation Mode: Viewing platform as <strong>{user.name}</strong> ({user.role})
            </span>
          </div>
          <button
            onClick={stopImpersonation}
            className="flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded-lg transition-colors"
          >
            <X className="h-3 w-3" />
            Exit Impersonation
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
              <Shield className="h-3 w-3 text-primary" />
              Active Role:
            </span>
            <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 capitalize">
              {role.replace("-", " ")}
            </span>
            <span className="text-muted-foreground hidden md:inline text-[11px]">
              ({user.name})
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 sleek-scrollbar">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold hidden sm:inline mr-1">
              <ArrowRightLeft className="h-2.5 w-2.5 inline mr-0.5" />
              Switch:
            </span>
            {ROLE_OPTIONS.map((opt) => {
              const isActive = role === opt.role;
              return (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => handleRoleChange(opt.role, opt.defaultPath)}
                  className={cn(
                    "px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                      : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
