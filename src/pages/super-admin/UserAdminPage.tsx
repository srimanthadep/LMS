import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  permissions: string[];
  lastActive: string;
  dateAdded: string;
  status: "active" | "suspended";
  twoFactorEnabled: boolean;
  organization: string;
}

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "usr-1",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    permissions: ["Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
  },
  {
    id: "usr-2",
    name: "Amélie Laurent",
    email: "amelie@untitledui.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    permissions: ["Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
  },
  {
    id: "usr-3",
    name: "Ammar Foley",
    email: "ammar@untitledui.com",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    permissions: ["Live Host", "Course Author"],
    lastActive: "Mar 2, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
  },
  {
    id: "usr-4",
    name: "Caitlyn King",
    email: "caitlyn@untitledui.com",
    role: "evaluator",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    permissions: ["Grade Override", "Rubric Review"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
  },
  {
    id: "usr-5",
    name: "Sienna Hewitt",
    email: "sienna@untitledui.com",
    role: "support",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    permissions: ["Ticket Agent", "Student 360"],
    lastActive: "Mar 8, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
  },
  {
    id: "usr-6",
    name: "Olly Shroeder",
    email: "olly@untitledui.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    permissions: ["Live + Replay", "Doubt Desk"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: false,
    organization: "Apex AI Institute",
  },
  {
    id: "usr-7",
    name: "Mathilde Lewis",
    email: "mathilde@untitledui.com",
    role: "super-admin",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    permissions: ["Full Governance", "API Keys", "Billing"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
  },
  {
    id: "usr-8",
    name: "Jaya Willis",
    email: "jaya@untitledui.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    permissions: ["Replay Only", "Lab Cloud"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "suspended",
    twoFactorEnabled: false,
    organization: "Apex AI Institute",
  },
];

export const UserAdminPage: React.FC = () => {
  const { impersonateUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalUser, setEditModalUser] = useState<ManagedUser | null>(null);
  const [inspectUser, setInspectUser] = useState<ManagedUser | null>(null);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("admin");
  const [newPermissions, setNewPermissions] = useState("Data Export, Data Import");

  // Floating Toast Notification state matching screenshot
  const [toastMessage, setToastMessage] = useState<string | null>("“Amélie Laurent” details updated");
  const [toastVisible, setToastVisible] = useState(true);
  const [lastUpdatedUser, setLastUpdatedUser] = useState<ManagedUser | null>(INITIAL_USERS[1]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const showToast = (message: string, targetUser?: ManagedUser) => {
    setToastMessage(message);
    if (targetUser) setLastUpdatedUser(targetUser);
    setToastVisible(true);
  };

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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const perms = newPermissions.split(",").map((p) => p.trim()).filter(Boolean);
    const created: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      permissions: perms.length > 0 ? perms : ["Data Export", "Data Import"],
      lastActive: "Just now",
      dateAdded: "Oct 15, 2026",
      status: "active",
      twoFactorEnabled: ["super-admin", "admin", "teacher", "evaluator"].includes(newRole),
      organization: "Apex AI Institute",
    };

    setUsers([created, ...users]);
    setAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    showToast(`“${created.name}” user added`, created);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === editModalUser.id ? editModalUser : u))
    );
    showToast(`“${editModalUser.name}” details updated`, editModalUser);
    setEditModalUser(null);
  };

  const handleToggleStatus = (u: ManagedUser) => {
    const nextStatus = u.status === "active" ? "suspended" : "active";
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`“${u.name}” account marked as ${nextStatus}`, u);
  };

  const handleToggle2fa = (u: ManagedUser) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === u.id ? { ...item, twoFactorEnabled: !item.twoFactorEnabled } : item
      )
    );
    showToast(`2FA policy toggled for “${u.name}”`, u);
  };

  const handleImpersonate = (u: ManagedUser) => {
    const profile: UserProfile = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      organization: u.organization,
      twoFactorEnabled: u.twoFactorEnabled,
    };
    impersonateUser(profile);
    navigate(`/${u.role}/dashboard`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast(`“${name}” removed from directory`);
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "super-admin":
      case "admin":
        return "bg-[#ECFDF3] text-[#027A48] border-[#D1FADF]";
      case "teacher":
        return "bg-[#F9F5FF] text-[#6941C6] border-[#E9D7FE]";
      case "student":
        return "bg-[#F0F9FF] text-[#026AA2] border-[#B9E6FE]";
      case "evaluator":
        return "bg-[#FEF6EE] text-[#B54708] border-[#F9DBAF]";
      case "support":
        return "bg-[#FFF1F3] text-[#C01048] border-[#FECDCA]";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPermissionBadgeClass = (perm: string) => {
    if (perm.toLowerCase().includes("export")) {
      return "bg-[#F0F9FF] text-[#026AA2] border-[#B9E6FE]";
    }
    if (perm.toLowerCase().includes("import")) {
      return "bg-[#F9F5FF] text-[#6941C6] border-[#E9D7FE]";
    }
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="flex justify-center w-full">
      <main className="w-full max-w-[1240px] bg-white dark:bg-card rounded-2xl shadow-xs border border-gray-200/80 dark:border-border/80 p-6 md:p-8 relative">
        {/* BEGIN: PageHeader */}
        <header className="mb-8" data-purpose="page-header">
          <h1 className="text-[28px] sm:text-[30px] font-semibold text-gray-900 dark:text-white tracking-tight leading-tight">
            User management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your team members and their account permissions here.
          </p>
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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                placeholder="Search"
                type="text"
              />
            </div>

            {/* Filters Button with Dropdown */}
            <DropdownMenu open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium border rounded-lg transition shadow-2xs ${
                    roleFilter !== "all" || statusFilter !== "all"
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
                  {(roleFilter !== "all" || statusFilter !== "all") && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Filter By Role</DropdownMenuLabel>
                {["all", "super-admin", "admin", "teacher", "student", "evaluator", "support"].map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`text-xs capitalize cursor-pointer rounded-md ${
                      roleFilter === r ? "font-bold text-primary" : ""
                    }`}
                  >
                    {r === "all" ? "All Roles" : r.replace("-", " ")}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Filter By Status</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("all")}
                  className={`text-xs cursor-pointer rounded-md ${statusFilter === "all" ? "font-bold text-primary" : ""}`}
                >
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("active")}
                  className={`text-xs cursor-pointer rounded-md ${statusFilter === "active" ? "font-bold text-primary" : ""}`}
                >
                  Active Only
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("suspended")}
                  className={`text-xs cursor-pointer rounded-md ${statusFilter === "suspended" ? "font-bold text-primary" : ""}`}
                >
                  Suspended Only
                </DropdownMenuItem>
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
          <div className="mb-4 p-3 bg-gray-50 dark:bg-muted/40 border border-gray-200 dark:border-border rounded-xl flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {selectedIds.length} users selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUsers((prev) =>
                    prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: "suspended" } : u))
                  );
                  showToast(`${selectedIds.length} users suspended`);
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-md hover:bg-gray-100"
              >
                Suspend Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* BEGIN: UsersTableSection */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-border/80 mb-8" data-purpose="users-table-container">
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
                <th className="py-3 px-3 font-medium text-gray-500 dark:text-gray-400">User name</th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Access</th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <span>Last active</span>
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </th>
                <th className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date added</th>
                <th className="py-3 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 dark:divide-border/60 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No users match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
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
                            // Fallback if image load fails
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 leading-tight flex items-center gap-1.5">
                            {user.name}
                            {user.status === "suspended" && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200">
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
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {user.role.replace("-", " ")}
                        </span>

                        {/* Permission Badges */}
                        {user.permissions.map((perm, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPermissionBadgeClass(
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
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl shadow-lg">
                          <DropdownMenuItem
                            onClick={() => setEditModalUser(user)}
                            className="text-xs cursor-pointer rounded-lg"
                          >
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setInspectUser(user)}
                            className="text-xs cursor-pointer rounded-lg"
                          >
                            View full profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleImpersonate(user)}
                            className="text-xs cursor-pointer rounded-lg font-semibold text-primary"
                          >
                            View as user (Impersonate)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggle2fa(user)}
                            className="text-xs cursor-pointer rounded-lg"
                          >
                            {user.twoFactorEnabled ? "Disable 2FA" : "Require 2FA"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                            className="text-xs cursor-pointer rounded-lg"
                          >
                            {user.status === "active" ? "Suspend account" : "Reactivate account"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-xs cursor-pointer rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            Delete user
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
          {[1, 2, 3, 4, 5, 6].map((p) => (
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

        {/* BEGIN: ToastNotification matching screenshot */}
        {toastVisible && toastMessage && (
          <aside
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 bg-[#16181D] text-white rounded-2xl px-5 py-4 shadow-2xl flex items-start gap-3.5 max-w-sm border border-gray-800 animate-in fade-in slide-in-from-bottom-3 duration-300"
            data-purpose="toast-notification"
            role="status"
          >
            {/* Green Outline Checkmark Icon */}
            <div className="mt-0.5 shrink-0 text-emerald-400">
              <svg className="w-5 h-5 rounded-full ring-2 ring-emerald-500/30 p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
            {/* Toast Content */}
            <div className="flex-1 text-xs">
              <p className="font-semibold text-white tracking-wide text-[13px]">{toastMessage}</p>
              <div className="mt-2 flex items-center gap-3 font-medium">
                <button
                  onClick={() => {
                    setToastVisible(false);
                  }}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                  type="button"
                >
                  Undo
                </button>
                <button
                  onClick={() => {
                    if (lastUpdatedUser) setInspectUser(lastUpdatedUser);
                  }}
                  className="text-white hover:underline transition cursor-pointer"
                  type="button"
                >
                  View profile
                </button>
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

        {/* MODAL: ADD USER */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Add new team member
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                Create a user account and configure permissions across your institution.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddUser} className="space-y-4 pt-2 text-xs">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Full name</label>
                <input
                  required
                  placeholder="e.g. Amélie Laurent"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="amelie@untitledui.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                >
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="evaluator">Evaluator</option>
                  <option value="support">Support</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300">Permissions (comma separated)</label>
                <input
                  value={newPermissions}
                  onChange={(e) => setNewPermissions(e.target.value)}
                  placeholder="Data Export, Data Import, Live Host"
                  className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-sm font-medium text-white bg-[#111318] hover:bg-black rounded-lg transition shadow-2xs cursor-pointer"
                >
                  Add user
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL: EDIT USER */}
        <Dialog open={!!editModalUser} onOpenChange={(open) => !open && setEditModalUser(null)}>
          {editModalUser && (
            <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit user details
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                  Update account contact information, role assignments, and permissions.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpdateUser} className="space-y-4 pt-2 text-xs">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Full name</label>
                  <input
                    value={editModalUser.name}
                    onChange={(e) => setEditModalUser({ ...editModalUser, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Email address</label>
                  <input
                    type="email"
                    value={editModalUser.email}
                    onChange={(e) => setEditModalUser({ ...editModalUser, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Assigned role</label>
                  <select
                    value={editModalUser.role}
                    onChange={(e) =>
                      setEditModalUser({ ...editModalUser, role: e.target.value as UserRole })
                    }
                    className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="evaluator">Evaluator</option>
                    <option value="support">Support</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Account status</label>
                  <select
                    value={editModalUser.status}
                    onChange={(e) =>
                      setEditModalUser({
                        ...editModalUser,
                        status: e.target.value as "active" | "suspended",
                      })
                    }
                    className="w-full mt-1 px-3 py-2 text-sm bg-white dark:bg-background border border-gray-200 dark:border-border rounded-lg text-gray-900 dark:text-gray-100"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalUser(null)}
                    className="px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-sm font-medium text-white bg-[#111318] hover:bg-black rounded-lg transition shadow-2xs cursor-pointer"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </DialogContent>
          )}
        </Dialog>

        {/* MODAL: VIEW PROFILE */}
        <Dialog open={!!inspectUser} onOpenChange={(open) => !open && setInspectUser(null)}>
          {inspectUser && (
            <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  User profile
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                  Detailed account metadata and security posture.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50 dark:bg-muted/40 border border-gray-200 dark:border-border">
                  <img
                    src={inspectUser.avatar}
                    alt={inspectUser.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{inspectUser.name}</h3>
                    <p className="text-xs text-gray-500">{inspectUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize ${getRoleBadgeClass(inspectUser.role)}`}>
                        {inspectUser.role.replace("-", " ")}
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono">ID: {inspectUser.id}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-border bg-gray-50/50 dark:bg-muted/20">
                    <span className="text-gray-500 text-[11px] block">Last active</span>
                    <strong className="text-gray-900 dark:text-white font-medium">{inspectUser.lastActive}</strong>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-border bg-gray-50/50 dark:bg-muted/20">
                    <span className="text-gray-500 text-[11px] block">Date added</span>
                    <strong className="text-gray-900 dark:text-white font-medium">{inspectUser.dateAdded}</strong>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-border bg-gray-50/50 dark:bg-muted/20">
                    <span className="text-gray-500 text-[11px] block">Account status</span>
                    <strong className={`capitalize font-medium ${inspectUser.status === "active" ? "text-emerald-600" : "text-rose-600"}`}>
                      {inspectUser.status}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-100 dark:border-border bg-gray-50/50 dark:bg-muted/20">
                    <span className="text-gray-500 text-[11px] block">2FA policy</span>
                    <strong className="text-gray-900 dark:text-white font-medium">
                      {inspectUser.twoFactorEnabled ? "Enforced ✓" : "Disabled"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 font-medium block mb-1">Granted permissions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectUser.permissions.map((p, idx) => (
                      <span key={idx} className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPermissionBadgeClass(p)}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-gray-100 dark:border-border">
                  <button
                    onClick={() => handleImpersonate(inspectUser)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    View as user (Impersonate)
                  </button>
                  <button
                    onClick={() => setInspectUser(null)}
                    className="px-3.5 py-1.5 text-xs font-medium bg-gray-100 dark:bg-muted text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-muted/80 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
};
