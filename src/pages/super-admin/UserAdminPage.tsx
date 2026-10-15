import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserManagement, ManagedUser } from "@/context/UserContext";
import { UserProfile, UserRole } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Trash2,
  UserX,
  UserCheck,
  Eye,
  Edit2,
  Clock,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

const AVAILABLE_PERMISSIONS: { id: string; label: string; category: string }[] = [
  { id: "Data Export", label: "Data Export (CSV & Audit)", category: "Compliance" },
  { id: "Data Import", label: "Data Import (Bulk Students/Rosters)", category: "Compliance" },
  { id: "Live Host", label: "Live Classroom Broadcast Host", category: "Teaching" },
  { id: "Course Author", label: "Course Curriculum Authoring", category: "Teaching" },
  { id: "Rubric Review", label: "Rubric Configuration & Oversight", category: "Evaluation" },
  { id: "Grade Override", label: "Grade Override & Recalculation", category: "Evaluation" },
  { id: "Ticket Agent", label: "Student Doubt Ticket Resolution", category: "Support" },
  { id: "Student 360", label: "Student 360 Diagnostic History", category: "Support" },
  { id: "Billing & Invoicing", label: "Payment Gateway & Billing Ops", category: "Governance" },
  { id: "Full Governance", label: "Root Governance & API Key Control", category: "Governance" },
];

export const UserAdminPage: React.FC = () => {
  const { impersonateUser } = useAuth();
  const navigate = useNavigate();

  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    toggleUser2FA,
    resetUserPassword,
    terminateUserSessions,
    bulkActivate,
    bulkSuspend,
    bulkDelete,
    exportUsersCSV,
    undoLastAction,
    canUndo,
  } = useUserManagement();

  // Search, Filters & Sorting
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [twoFaFilter, setTwoFaFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "lastActive" | "dateAdded">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Floating Toast State (matches screenshot)
  const [toastVisible, setToastVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState<string>("“Amélie Laurent” details updated");
  const [lastTargetUser, setLastTargetUser] = useState<ManagedUser | null>(
    users.find((u) => u.name.includes("Amélie")) || users[0] || null
  );

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalUser, setEditModalUser] = useState<ManagedUser | null>(null);
  const [inspectUser, setInspectUser] = useState<ManagedUser | null>(null);
  const [inspectActiveTab, setInspectActiveTab] = useState<string>("overview");

  // Secondary modals: Reset Password, Suspend Reason, Delete confirmation
  const [resetPassModal, setResetPassModal] = useState<{ user: ManagedUser; tempPass: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);
  const [suspendModalUser, setSuspendModalUser] = useState<ManagedUser | null>(null);
  const [suspendReason, setSuspendReason] = useState("Administrative policy compliance hold");
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<ManagedUser | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("+91 98765 ");
  const [newUserRole, setNewUserRole] = useState<UserRole>("admin");
  const [newUserOrg, setNewUserOrg] = useState("Apex AI Institute");
  const [newUserDept, setNewUserDept] = useState("Academic Operations");
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>(["Data Export", "Data Import"]);
  const [newUser2FA, setNewUser2FA] = useState(true);
  const [newUserWelcomeEmail, setNewUserWelcomeEmail] = useState(true);

  // Edit User Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("admin");
  const [editOrg, setEditOrg] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState<"active" | "suspended">("active");

  const showToast = (message: string, user?: ManagedUser) => {
    setToastMessage(message);
    if (user) {
      setLastTargetUser(user);
    }
    setToastVisible(true);
  };

  const handleUndo = () => {
    const success = undoLastAction();
    if (success) {
      showToast("Previous change was undone successfully");
    }
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users
      .filter((u) => {
        const matchesSearch =
          q === "" ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.organization.toLowerCase().includes(q) ||
          u.department?.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q);

        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        const matchesStatus = statusFilter === "all" || u.status === statusFilter;
        const matches2FA =
          twoFaFilter === "all" ||
          (twoFaFilter === "enabled" && u.twoFactorEnabled) ||
          (twoFaFilter === "disabled" && !u.twoFactorEnabled);

        return matchesSearch && matchesRole && matchesStatus && matches2FA;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === "dateAdded") {
          cmp = a.dateAdded.localeCompare(b.dateAdded);
        } else if (sortField === "lastActive") {
          cmp = a.lastActive.localeCompare(b.lastActive);
        }
        return sortDirection === "asc" ? cmp : -cmp;
      });
  }, [users, search, roleFilter, statusFilter, twoFaFilter, sortField, sortDirection]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Edit Modal
  const openEditModal = (u: ManagedUser) => {
    setEditModalUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone || "");
    setEditRole(u.role);
    setEditOrg(u.organization || "Apex AI Institute");
    setEditDept(u.department || "Academic Operations");
    setEditPermissions([...u.permissions]);
    setEditStatus(u.status === "suspended" ? "suspended" : "active");
  };

  // Save Edit User
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;

    const updated = updateUser(
      editModalUser.id,
      {
        name: editName,
        email: editEmail,
        phone: editPhone,
        role: editRole,
        organization: editOrg,
        department: editDept,
        permissions: editPermissions,
        status: editStatus,
      },
      "Admin updated profile and credentials"
    );

    if (updated) {
      showToast(`“${updated.name}” details updated`, updated);
      if (inspectUser && inspectUser.id === updated.id) {
        setInspectUser(updated);
      }
    }
    setEditModalUser(null);
  };

  // Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    // Pick avatar based on role/gender heuristic
    const defaultAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    ];
    const avatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const created = addUser({
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      role: newUserRole,
      avatar,
      permissions: newUserPermissions,
      status: "active",
      twoFactorEnabled: newUser2FA,
      organization: newUserOrg,
      department: newUserDept,
      sessionsCount: 0,
    });

    showToast(`“${created.name}” account created successfully`, created);
    setAddModalOpen(false);

    // Reset Form
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("+91 98765 ");
    setNewUserPermissions(["Data Export", "Data Import"]);
  };

  // Impersonate ("View as user")
  const handleImpersonate = (u: ManagedUser) => {
    const profile: UserProfile = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      organization: u.organization,
      twoFactorEnabled: u.twoFactorEnabled,
    };
    impersonateUser(profile);

    const rolePaths: Record<UserRole, string> = {
      "super-admin": "/super-admin/dashboard",
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      student: "/student/dashboard",
      evaluator: "/evaluator/dashboard",
      support: "/support/dashboard",
    };

    navigate(rolePaths[u.role] || "/");
    showToast(`Now impersonating ${u.name}`);
  };

  // Toggle 2FA
  const handleToggle2fa = (u: ManagedUser) => {
    const updated = toggleUser2FA(u.id);
    if (updated) {
      showToast(`${updated.twoFactorEnabled ? "2FA required" : "2FA waived"} for “${updated.name}”`, updated);
      if (inspectUser && inspectUser.id === updated.id) {
        setInspectUser(updated);
      }
    }
  };

  // Confirm Suspend / Reactivate
  const handleConfirmSuspend = () => {
    if (!suspendModalUser) return;
    const updated = toggleUserStatus(suspendModalUser.id, suspendReason);
    if (updated) {
      showToast(
        updated.status === "suspended"
          ? `“${updated.name}” account suspended`
          : `“${updated.name}” account reactivated`,
        updated
      );
      if (inspectUser && inspectUser.id === updated.id) {
        setInspectUser(updated);
      }
    }
    setSuspendModalUser(null);
  };

  // Handle Reset Password
  const handleTriggerResetPass = (u: ManagedUser) => {
    const res = resetUserPassword(u.id);
    setResetPassModal({ user: u, tempPass: res.tempPass });
    setCopiedPass(false);
    showToast(`Temporary password issued for “${u.name}”`, u);
  };

  // Handle Delete User
  const handleConfirmDelete = () => {
    if (!deleteConfirmUser) return;
    deleteUser(deleteConfirmUser.id);
    showToast(`“${deleteConfirmUser.name}” deleted permanently`);
    if (inspectUser && inspectUser.id === deleteConfirmUser.id) {
      setInspectUser(null);
    }
    setDeleteConfirmUser(null);
  };

  // Badge styling matching the user HTML template exactly
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "super-admin":
      case "admin":
        return "badge-admin bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]";
      case "teacher":
        return "bg-[#F9F5FF] text-[#6941C6] border border-[#E9D7FE]";
      case "student":
        return "bg-[#F0F9FF] text-[#026AA2] border border-[#B9E6FE]";
      case "evaluator":
        return "bg-[#FEF6EE] text-[#B54708] border border-[#F9DBAF]";
      case "support":
        return "bg-[#FFF1F3] text-[#C01048] border border-[#FECDCA]";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getPermissionBadgeClass = (perm: string) => {
    const p = perm.toLowerCase();
    if (p.includes("export")) {
      return "badge-data-export bg-[#F0F9FF] text-[#026AA2] border border-[#B9E6FE]";
    }
    if (p.includes("import")) {
      return "badge-data-import bg-[#F9F5FF] text-[#6941C6] border border-[#E9D7FE]";
    }
    if (p.includes("live") || p.includes("host")) {
      return "bg-[#F9F5FF] text-[#6941C6] border border-[#E9D7FE]";
    }
    if (p.includes("governance") || p.includes("billing")) {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    return "bg-gray-50 text-gray-700 border border-gray-200";
  };

  return (
    <div className="flex justify-center w-full">
      <main className="w-full max-w-[1240px] bg-white dark:bg-card rounded-2xl shadow-xs border border-gray-200/80 dark:border-border/80 p-6 md:p-8 relative">
        {/* BEGIN: PageHeader */}
        <header className="mb-8" data-purpose="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[30px] font-semibold text-gray-900 dark:text-white tracking-tight leading-tight">
                User management
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                Manage your team members and their account permissions here.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportUsersCSV(selectedIds.length > 0 ? selectedIds : undefined)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-muted border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 dark:hover:bg-muted/80 transition cursor-pointer shadow-2xs"
                type="button"
                title="Export user directory as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
              </button>
            </div>
          </div>
        </header>
        {/* END: PageHeader */}

        {/* BEGIN: ControlsBar */}
        <section
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          data-purpose="table-controls"
        >
          {/* User Count Title */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All users</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-muted text-gray-700 dark:text-gray-300">
              {filteredUsers.length}
            </span>
          </div>

          {/* Action Tools: Search, Filter, Add User */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                placeholder="Search"
                type="text"
              />
            </div>

            {/* Filters Button */}
            <DropdownMenu open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium border rounded-lg transition shadow-2xs cursor-pointer ${
                    roleFilter !== "all" || statusFilter !== "all" || twoFaFilter !== "all"
                      ? "bg-gray-100 dark:bg-muted text-gray-900 dark:text-white border-gray-300 dark:border-border"
                      : "text-gray-700 dark:text-gray-300 bg-white dark:bg-card border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50"
                  }`}
                  type="button"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Filters
                  {(roleFilter !== "all" || statusFilter !== "all" || twoFaFilter !== "all") && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Filter By Role</DropdownMenuLabel>
                {["all", "super-admin", "admin", "teacher", "student", "evaluator", "support"].map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => {
                      setRoleFilter(r);
                      setCurrentPage(1);
                    }}
                    className={`text-xs capitalize cursor-pointer rounded-md ${
                      roleFilter === r ? "font-bold text-primary bg-primary/10" : ""
                    }`}
                  >
                    {r === "all" ? "All Roles" : r.replace("-", " ")}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Filter By Status</DropdownMenuLabel>
                {[
                  { id: "all", label: "All Statuses" },
                  { id: "active", label: "Active Only" },
                  { id: "suspended", label: "Suspended Only" },
                ].map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => {
                      setStatusFilter(s.id);
                      setCurrentPage(1);
                    }}
                    className={`text-xs cursor-pointer rounded-md ${
                      statusFilter === s.id ? "font-bold text-primary bg-primary/10" : ""
                    }`}
                  >
                    {s.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Filter By 2FA</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setTwoFaFilter("all");
                    setCurrentPage(1);
                  }}
                  className={`text-xs cursor-pointer rounded-md ${twoFaFilter === "all" ? "font-bold text-primary" : ""}`}
                >
                  All 2FA States
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTwoFaFilter("enabled");
                    setCurrentPage(1);
                  }}
                  className={`text-xs cursor-pointer rounded-md ${twoFaFilter === "enabled" ? "font-bold text-primary" : ""}`}
                >
                  2FA Enforced Only
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTwoFaFilter("disabled");
                    setCurrentPage(1);
                  }}
                  className={`text-xs cursor-pointer rounded-md ${twoFaFilter === "disabled" ? "font-bold text-primary" : ""}`}
                >
                  2FA Not Enforced
                </DropdownMenuItem>
                {(roleFilter !== "all" || statusFilter !== "all" || twoFaFilter !== "all") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setRoleFilter("all");
                        setStatusFilter("all");
                        setTwoFaFilter("all");
                        setCurrentPage(1);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Reset All Filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add User Button */}
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-[#111318] hover:bg-black rounded-lg transition shadow-2xs cursor-pointer"
              type="button"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Add user
            </button>
          </div>
        </section>
        {/* END: ControlsBar */}

        {/* Optional Bulk Selection Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-muted/40 border border-gray-200 dark:border-border rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {selectedIds.length} user{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  bulkActivate(selectedIds);
                  showToast(`${selectedIds.length} users marked active`);
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md font-medium cursor-pointer"
              >
                Activate Selected
              </button>
              <button
                onClick={() => {
                  bulkSuspend(selectedIds, "Bulk administrative suspension");
                  showToast(`${selectedIds.length} users suspended`);
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md font-medium cursor-pointer"
              >
                Suspend Selected
              </button>
              <button
                onClick={() => exportUsersCSV(selectedIds)}
                className="px-2.5 py-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-md hover:bg-gray-100 cursor-pointer font-medium"
              >
                Export CSV
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) {
                    bulkDelete(selectedIds);
                    showToast(`${selectedIds.length} users deleted`);
                    setSelectedIds([]);
                  }
                }}
                className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md font-medium cursor-pointer"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* BEGIN: UsersTableSection */}
        <div
          className="overflow-x-auto rounded-xl border border-gray-100 dark:border-border/80 mb-8"
          data-purpose="users-table-container"
        >
          <table className="w-full text-left border-collapse" id="users-table">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-100 dark:border-border/80 bg-[#FAFAFA]/70 dark:bg-muted/30 text-[12px] font-medium text-gray-500 dark:text-gray-400">
                <th className="py-3 px-4 w-10">
                  <input
                    checked={selectedIds.length > 0 && selectedIds.length === filteredUsers.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer"
                    type="checkbox"
                  />
                </th>
                <th
                  onClick={() => {
                    setSortField("name");
                    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="py-3 px-3 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-800"
                >
                  <div className="flex items-center gap-1">
                    <span>User name</span>
                    {sortField === "name" && (
                      <span className="text-[10px]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Access</th>
                <th
                  onClick={() => {
                    setSortField("lastActive");
                    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Last active</span>
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField("dateAdded");
                    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Date added</span>
                    {sortField === "dateAdded" && (
                      <span className="text-[10px]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 dark:divide-border/60 text-sm">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No users match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 dark:hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <input
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleSelectRow(user.id)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
                          src={user.avatar}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 leading-tight flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setInspectUser(user);
                                setInspectActiveTab("overview");
                              }}
                              className="hover:underline text-left cursor-pointer font-medium"
                            >
                              {user.name}
                            </button>
                            {user.status === "suspended" && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200">
                                Suspended
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-normal">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Primary Role Badge */}
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {user.role.replace("-", " ")}
                        </span>

                        {/* Permission Badges */}
                        {user.permissions.map((perm, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPermissionBadgeClass(
                              perm
                            )}`}
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                      {user.lastActive}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                      {user.dateAdded}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            aria-label="More actions"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md transition-colors cursor-pointer"
                          >
                            <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-lg">
                          <DropdownMenuItem
                            onClick={() => openEditModal(user)}
                            className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-gray-500" /> Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setInspectUser(user);
                              setInspectActiveTab("overview");
                            }}
                            className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" /> View full profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleImpersonate(user)}
                            className="text-xs cursor-pointer rounded-lg font-semibold text-primary flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View as user (Impersonate)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleTriggerResetPass(user)}
                            className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                          >
                            <Key className="w-3.5 h-3.5 text-gray-500" /> Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggle2fa(user)}
                            className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                          >
                            <Shield className="w-3.5 h-3.5 text-gray-500" />
                            {user.twoFactorEnabled ? "Waive MFA Requirement" : "Enforce MFA (2FA)"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              terminateUserSessions(user.id);
                              showToast(`Terminated active sessions for “${user.name}”`, user);
                            }}
                            className="text-xs cursor-pointer rounded-lg flex items-center gap-2 text-amber-700"
                          >
                            <Laptop className="w-3.5 h-3.5" /> Force Logout (All Sessions)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSuspendModalUser(user);
                              setSuspendReason(
                                user.status === "active"
                                  ? "Administrative hold / policy review"
                                  : "Reactivation authorized"
                              );
                            }}
                            className="text-xs cursor-pointer rounded-lg flex items-center gap-2"
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="w-3.5 h-3.5 text-amber-600" /> Suspend account
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Reactivate account
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirmUser(user)}
                            className="text-xs cursor-pointer rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* END: UsersTableSection */}

        {/* BEGIN: Pagination */}
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-1.5 py-2"
          data-purpose="pagination-controls"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              aria-current={currentPage === p ? "page" : undefined}
              className={`w-8 h-8 rounded-lg font-medium text-sm flex items-center justify-center transition cursor-pointer ${
                currentPage === p
                  ? "bg-gray-100 dark:bg-muted text-gray-900 dark:text-white font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-muted text-gray-600 dark:text-gray-400"
              }`}
            >
              {p}
            </button>
          ))}
        </nav>
        {/* END: Pagination */}

        {/* BEGIN: ToastNotification matching screenshot overlay */}
        {toastVisible && toastMessage && (
          <aside
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 bg-[#16181D] text-white rounded-2xl px-5 py-4 shadow-2xl flex items-start gap-3.5 max-w-sm border border-gray-800 animate-in fade-in slide-in-from-bottom-3 duration-300"
            data-purpose="toast-notification"
            role="status"
          >
            {/* Green Outline Checkmark Icon */}
            <div className="mt-0.5 shrink-0 text-emerald-400">
              <svg
                className="w-5 h-5 rounded-full ring-2 ring-emerald-500/30 p-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
            {/* Toast Content */}
            <div className="flex-1 text-xs">
              <p className="font-semibold text-white tracking-wide text-[13px]">{toastMessage}</p>
              <div className="mt-2 flex items-center gap-3 font-medium">
                {canUndo && (
                  <button
                    onClick={handleUndo}
                    className="text-gray-400 hover:text-white transition cursor-pointer"
                    type="button"
                  >
                    Undo
                  </button>
                )}
                {lastTargetUser && (
                  <button
                    onClick={() => {
                      setInspectUser(lastTargetUser);
                      setInspectActiveTab("overview");
                    }}
                    className="text-white hover:underline transition cursor-pointer"
                    type="button"
                  >
                    View profile
                  </button>
                )}
              </div>
            </div>
            {/* Close Action */}
            <button
              onClick={() => setToastVisible(false)}
              aria-label="Close notification"
              className="text-gray-400 hover:text-white transition -mr-1 -mt-0.5 cursor-pointer"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </aside>
        )}
        {/* END: ToastNotification */}

        {/* ========================================================================= */}
        {/* MODAL 1: ADD USER                                                         */}
        {/* ========================================================================= */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="max-w-lg p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Add new team member
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Create a user account and configure permissions across your institution.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Full name *
                </label>
                <input
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Amélie Laurent"
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Email address *
                  </label>
                  <input
                    required
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="amelie@untitledui.com"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Phone number
                  </label>
                  <input
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Platform Role *
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                  >
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="evaluator">Evaluator</option>
                    <option value="support">Support & Mentor</option>
                    <option value="student">Student / Learner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Department
                  </label>
                  <input
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    placeholder="Academic Operations"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Granular Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-gray-50 dark:bg-muted/40 rounded-xl border border-gray-100 dark:border-border/80">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = newUserPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewUserPermissions((p) => p.filter((x) => x !== perm.id));
                            } else {
                              setNewUserPermissions((p) => [...p, perm.id]);
                            }
                          }}
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                        />
                        <span className="truncate">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-border">
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUser2FA}
                    onChange={(e) => setNewUser2FA(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-4 h-4"
                  />
                  <span>Require Multi-Factor Authentication (MFA / 2FA) on initial login</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserWelcomeEmail}
                    onChange={(e) => setNewUserWelcomeEmail(e.target.checked)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-4 h-4"
                  />
                  <span>Send account activation link & temporary credentials via email</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-border">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-muted rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#111318] hover:bg-black rounded-xl transition cursor-pointer shadow-xs"
                >
                  Add user
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL 2: EDIT USER                                                        */}
        {/* ========================================================================= */}
        <Dialog open={!!editModalUser} onOpenChange={(open) => !open && setEditModalUser(null)}>
          <DialogContent className="max-w-lg p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Edit team member details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Update account details, role permissions, and access states for {editModalUser?.name}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Full name
                </label>
                <input
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Phone number
                  </label>
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                  >
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="evaluator">Evaluator</option>
                    <option value="support">Support & Mentor</option>
                    <option value="student">Student / Learner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "active" | "suspended")}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  Assigned Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-gray-50 dark:bg-muted/40 rounded-xl border border-gray-100 dark:border-border/80">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = editPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setEditPermissions((p) => p.filter((x) => x !== perm.id));
                            } else {
                              setEditPermissions((p) => [...p, perm.id]);
                            }
                          }}
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                        />
                        <span className="truncate">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-border">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-muted rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#111318] hover:bg-black rounded-xl transition cursor-pointer shadow-xs"
                >
                  Save changes
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL 3: VIEW FULL PROFILE DRAWER / MODAL                                 */}
        {/* ========================================================================= */}
        <Dialog open={!!inspectUser} onOpenChange={(open) => !open && setInspectUser(null)}>
          <DialogContent className="max-w-2xl p-6 rounded-2xl">
            {inspectUser && (
              <>
                <DialogHeader className="border-b border-gray-100 dark:border-border pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        alt={inspectUser.name}
                        className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-gray-100 dark:ring-gray-800"
                        src={inspectUser.avatar}
                      />
                      <div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          {inspectUser.name}
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeClass(
                              inspectUser.role
                            )}`}
                          >
                            {inspectUser.role.replace("-", " ")}
                          </span>
                          {inspectUser.status === "suspended" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200">
                              Suspended
                            </span>
                          )}
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{inspectUser.email}</p>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                {/* Direct Pill Tabs */}
                <div className="grid grid-cols-4 w-full bg-muted/60 p-1 rounded-xl border border-border/60 text-xs mt-3">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "permissions", label: "Permissions" },
                    { id: "security", label: "Security & MFA" },
                    { id: "audit", label: "Audit Trail" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setInspectActiveTab(t.id)}
                      className={`py-1.5 rounded-lg font-medium transition cursor-pointer text-center ${
                        inspectActiveTab === t.id
                          ? "bg-card text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: OVERVIEW */}
                {inspectActiveTab === "overview" && (
                  <div className="space-y-4 pt-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-muted/40 border border-gray-100 dark:border-border/80">
                        <span className="text-muted-foreground block text-[11px]">Organization</span>
                        <span className="font-semibold text-foreground text-sm">{inspectUser.organization}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-muted/40 border border-gray-100 dark:border-border/80">
                        <span className="text-muted-foreground block text-[11px]">Department / Unit</span>
                        <span className="font-semibold text-foreground text-sm">{inspectUser.department || "Operations"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-muted/40 border border-gray-100 dark:border-border/80">
                        <span className="text-muted-foreground block text-[11px]">Phone Contact</span>
                        <span className="font-semibold text-foreground text-sm">{inspectUser.phone || "Not configured"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-muted/40 border border-gray-100 dark:border-border/80">
                        <span className="text-muted-foreground block text-[11px]">Account ID</span>
                        <span className="font-mono text-[11px] text-foreground">{inspectUser.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-muted/40 border border-gray-100 dark:border-border/80 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Registration Date</span>
                        <span className="font-medium text-foreground">{inspectUser.dateAdded}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Last Activity</span>
                        <span className="font-medium text-foreground">{inspectUser.lastActive}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Active Sessions</span>
                        <span className="font-semibold text-emerald-600">{inspectUser.sessionsCount || 1} online</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PERMISSIONS */}
                {inspectActiveTab === "permissions" && (
                  <div className="space-y-3 pt-3">
                    <p className="text-xs text-muted-foreground">
                      Click below to grant or revoke granular capabilities for this user:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_PERMISSIONS.map((perm) => {
                        const hasPerm = inspectUser.permissions.includes(perm.id);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => {
                              const newPerms = hasPerm
                                ? inspectUser.permissions.filter((p) => p !== perm.id)
                                : [...inspectUser.permissions, perm.id];
                              const updated = updateUser(
                                inspectUser.id,
                                { permissions: newPerms },
                                `Permission ${hasPerm ? "revoked" : "granted"}: ${perm.id}`
                              );
                              if (updated) setInspectUser(updated);
                            }}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                              hasPerm
                                ? "bg-primary/5 border-primary/30 text-foreground font-semibold"
                                : "bg-card border-border/80 text-muted-foreground hover:bg-muted/30"
                            }`}
                          >
                            <span className="truncate">{perm.label}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                                hasPerm ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {hasPerm ? "Active" : "Off"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: SECURITY & MFA */}
                {inspectActiveTab === "security" && (
                  <div className="space-y-3 pt-3">
                    <div className="p-3.5 rounded-xl border border-gray-200 dark:border-border flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-primary" />
                          Multi-Factor Authentication (2FA)
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {inspectUser.twoFactorEnabled
                            ? "Enforced via Authenticator App / Hardware Security Key"
                            : "Optional / Not enforced on this profile"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle2fa(inspectUser)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                          inspectUser.twoFactorEnabled
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {inspectUser.twoFactorEnabled ? "Waive MFA" : "Enforce 2FA"}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-200 dark:border-border flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-primary" />
                          Credentials & Password Reset
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Generate a one-time temporary password or dispatch reset instructions.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTriggerResetPass(inspectUser)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-gray-100 dark:bg-muted text-gray-800 dark:text-gray-200 hover:bg-gray-200 cursor-pointer"
                      >
                        Reset Password
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-200 dark:border-border flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Laptop className="w-3.5 h-3.5 text-amber-600" />
                          Active Sessions ({inspectUser.sessionsCount || 1})
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Last known IP: {inspectUser.lastLoginIp || "103.212.144.12"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          terminateUserSessions(inspectUser.id);
                          showToast(`Terminated all active sessions for ${inspectUser.name}`, inspectUser);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                      >
                        Force Logout All
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: AUDIT TRAIL */}
                {inspectActiveTab === "audit" && (
                  <div className="space-y-2 pt-3">
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {inspectUser.auditLog && inspectUser.auditLog.length > 0 ? (
                        inspectUser.auditLog.map((log) => (
                          <div
                            key={log.id}
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-muted/40 border border-gray-100 dark:border-border/80 text-xs flex items-center justify-between"
                          >
                            <div>
                              <p className="font-semibold text-foreground">{log.action}</p>
                              <p className="text-[10px] text-muted-foreground">
                                By {log.performedBy} • IP {log.ip}
                              </p>
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground py-4 text-center">No recent security events recorded.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-border mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleImpersonate(inspectUser)}
                      className="px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View as user
                    </button>
                    <button
                      onClick={() => {
                        setInspectUser(null);
                        openEditModal(inspectUser);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-muted text-gray-800 dark:text-gray-200 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                    >
                      Edit details
                    </button>
                  </div>
                  <button
                    onClick={() => setInspectUser(null)}
                    className="px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL 4: TEMPORARY PASSWORD ISSUED                                        */}
        {/* ========================================================================= */}
        <Dialog open={!!resetPassModal} onOpenChange={(open) => !open && setResetPassModal(null)}>
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" /> Temporary Password Generated
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Copy and securely share this temporary password with {resetPassModal?.user.name}.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 p-3 bg-muted/50 rounded-xl border border-border flex items-center justify-between">
              <span className="font-mono text-base font-bold text-foreground tracking-wider">
                {resetPassModal?.tempPass}
              </span>
              <button
                onClick={() => {
                  if (resetPassModal) {
                    navigator.clipboard.writeText(resetPassModal.tempPass);
                    setCopiedPass(true);
                    setTimeout(() => setCopiedPass(false), 2000);
                  }
                }}
                className="p-1.5 rounded-lg bg-card border border-border text-xs font-semibold flex items-center gap-1 hover:bg-muted cursor-pointer"
              >
                {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPass ? "Copied" : "Copy"}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              The user will be prompted to choose a permanent secure password upon next sign-in.
            </p>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setResetPassModal(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#111318] hover:bg-black rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL 5: SUSPEND / REACTIVATE REASON                                      */}
        {/* ========================================================================= */}
        <Dialog open={!!suspendModalUser} onOpenChange={(open) => !open && setSuspendModalUser(null)}>
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                {suspendModalUser?.status === "active" ? "Suspend Account" : "Reactivate Account"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {suspendModalUser?.status === "active"
                  ? `Are you sure you want to suspend access for ${suspendModalUser?.name}? They will immediately lose access to LMS courses, live studio, and grading.`
                  : `Restore active platform access and live session privileges for ${suspendModalUser?.name}?`}
              </DialogDescription>
            </DialogHeader>

            <div className="my-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Audit Reason / Note *
              </label>
              <input
                required
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g. Tuition fee pending review or security policy flag"
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSuspendModalUser(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl cursor-pointer ${
                  suspendModalUser?.status === "active"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {suspendModalUser?.status === "active" ? "Confirm Suspension" : "Confirm Reactivation"}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ========================================================================= */}
        {/* MODAL 6: DELETE CONFIRMATION                                              */}
        {/* ========================================================================= */}
        <Dialog open={!!deleteConfirmUser} onOpenChange={(open) => !open && setDeleteConfirmUser(null)}>
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold tracking-tight text-rose-600 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Permanently Delete User
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                This action cannot be undone. All data, course permissions, and session records for{" "}
                <strong>{deleteConfirmUser?.name}</strong> will be erased.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
