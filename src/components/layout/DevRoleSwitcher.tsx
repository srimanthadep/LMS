import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { Shield, Eye, X, Check } from "lucide-react";
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

export const DevRoleSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { user, role, impersonatingFrom, switchRole, stopImpersonation } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole, defaultPath: string) => {
    switchRole(newRole);
    navigate(defaultPath);
  };

  if (impersonatingFrom) {
    return (
      <div className={cn("flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-xl text-xs", className)}>
        <Eye className="h-3.5 w-3.5 animate-pulse text-amber-600 shrink-0" />
        <span className="font-semibold truncate max-w-[200px] sm:max-w-none">
          Viewing as <strong>{user.name}</strong> ({user.role})
        </span>
        <button
          onClick={stopImpersonation}
          className="ml-auto flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded-lg transition-colors shrink-0"
        >
          <X className="h-3 w-3" />
          Exit
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-xl border border-border/70 bg-muted/40 text-xs overflow-x-auto sleek-scrollbar", className)}>
      <span className="text-[10px] font-bold text-muted-foreground uppercase px-2 hidden xl:flex items-center gap-1 shrink-0">
        <Shield className="h-3 w-3 text-primary" /> Role
      </span>
      {ROLE_OPTIONS.map((opt) => {
        const isActive = role === opt.role;
        return (
          <button
            key={opt.role}
            type="button"
            onClick={() => handleRoleChange(opt.role, opt.defaultPath)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 select-none",
              isActive
                ? "bg-primary text-primary-foreground shadow-xs scale-100"
                : "text-muted-foreground hover:text-foreground hover:bg-card/70"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
