import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { UserProfile, UserRole } from "@/types/auth";
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Eye,
  Lock,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const ALL_USERS: UserProfile[] = [
  DEMO_USERS["super-admin"],
  DEMO_USERS["admin"],
  DEMO_USERS["teacher"],
  DEMO_USERS["student"],
  DEMO_USERS["evaluator"],
  DEMO_USERS["support"],
  {
    id: "usr-student-2",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    role: "student",
    organization: "Apex AI Institute",
    activeBatch: "Agentic Systems Bootcamp",
    twoFactorEnabled: false,
  },
  {
    id: "usr-student-3",
    name: "Rohan Nair",
    email: "rohan.n@tech.com",
    role: "student",
    organization: "Apex AI Institute",
    activeBatch: "Cohort 7 (Live + Replay)",
    twoFactorEnabled: false,
  },
];

export const UserAdminPage: React.FC = () => {
  const { impersonateUser } = useAuth();
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState<UserProfile[]>(ALL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("student");

  const filteredUsers = usersList.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleToggle2fa = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, twoFactorEnabled: !u.twoFactorEnabled } : u))
    );
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      organization: "Apex AI Institute",
      twoFactorEnabled: ["super-admin", "admin", "evaluator", "support"].includes(newUserRole),
    };

    setUsersList([newUser, ...usersList]);
    setNewUserName("");
    setNewUserEmail("");
    setNewModalOpen(false);
  };

  const handleImpersonate = (u: UserProfile) => {
    impersonateUser(u);
    navigate(`/${u.role}/dashboard`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> User & Role Governance
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Control RBAC assignments, 2FA policies, and safe "View As" read-only session impersonation.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setNewModalOpen(true)}
            className="text-xs h-9 font-bold gap-1 shadow-sm shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Provision New User
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or user ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sleek-scrollbar">
            {["all", "student", "teacher", "admin", "super-admin", "evaluator", "support"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  roleFilter === r
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "All Roles" : r.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Adaptive Table: Mobile Cards vs Desktop Table */}
        <div className="sm:hidden space-y-2.5">
          {filteredUsers.map((u) => (
            <div key={u.id} className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-foreground">{u.name}</p>
                  <p className="text-[11px] text-muted-foreground">{u.email}</p>
                </div>
                <Badge variant="accent" className="text-[10px] font-bold capitalize">
                  {u.role.replace("-", " ")}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  2FA: {u.twoFactorEnabled ? "Enforced" : "Disabled"}
                </span>

                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggle2fa(u.id)}
                    className="h-7 text-[10px] px-2"
                  >
                    Toggle 2FA
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleImpersonate(u)}
                    className="h-7 text-[10px] px-2 font-bold gap-1"
                  >
                    <Eye className="h-3 w-3" /> View As
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 pl-5">User</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Organization</th>
                <th className="p-3.5">Two-Factor (2FA)</th>
                <th className="p-3.5 pr-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 pl-5">
                    <p className="font-bold text-foreground text-sm">{u.name}</p>
                    <p className="text-[11px] text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="text-xs font-semibold capitalize bg-primary/5 border-primary/20 text-primary">
                      {u.role.replace("-", " ")}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-muted-foreground font-medium">
                    {u.organization}
                  </td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggle2fa(u.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        u.twoFactorEnabled
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {u.twoFactorEnabled ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Enabled
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Disabled
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5 pr-5 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleImpersonate(u)}
                      className="h-8 text-xs font-bold gap-1 border-primary/30 hover:bg-primary/10 text-primary"
                    >
                      <Eye className="h-3.5 w-3.5" /> View As
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Add User */}
        <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl border-border/80 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Provision Organization User</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Register a new student, teacher, or administrative personnel.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddUser} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Full Name</label>
                <Input
                  required
                  placeholder="e.g. Dr. Ayesha Khan"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="ayesha.k@edulms.ai"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Assign Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full h-9 rounded-xl border border-input bg-background/80 px-3 text-xs"
                >
                  <option value="student">Student / Learner</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="admin">Operations Admin</option>
                  <option value="evaluator">Submission Evaluator</option>
                  <option value="support">Student Success Mentor</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setNewModalOpen(false)} className="text-xs h-9">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs h-9 font-bold">
                  Save & Provision
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};
