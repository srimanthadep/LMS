import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const UnauthorizedPage: React.FC = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5 mb-2">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
        403 — Privileged Access Restricted
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
        Your current role (<strong>{role}</strong>) does not hold authorization to access this administrative route. Role-based security policies isolate governance tasks from non-authorized users.
      </p>

      <div className="flex gap-2 pt-2">
        <Button asChild variant="outline" size="sm" className="text-xs gap-1.5 h-9">
          <Link to={`/${role}/dashboard`}>
            <Home className="h-3.5 w-3.5" /> Return to My Dashboard
          </Link>
        </Button>
        <Button asChild size="sm" className="text-xs gap-1.5 h-9">
          <Link to="/auth/login">
            <ArrowLeft className="h-3.5 w-3.5" /> Switch Persona
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="text-6xl font-black text-primary/40 font-mono tracking-widest">
        404
      </div>
      <h2 className="text-xl font-bold text-foreground">Resource Not Found</h2>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
        The classroom, replay, or operational view you requested does not exist or has been archived.
      </p>
      <Button asChild size="sm" className="text-xs h-9 gap-1.5">
        <Link to={`/${role}/dashboard`}>
          <Home className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
      </Button>
    </div>
  );
};
