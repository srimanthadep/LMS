import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserRole, UserProfile } from "@/types/auth";

export interface UserAuditEntry {
  id: string;
  action: string;
  timestamp: string;
  performedBy: string;
  ip: string;
  details?: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  permissions: string[];
  lastActive: string;
  dateAdded: string;
  status: "active" | "suspended" | "pending";
  twoFactorEnabled: boolean;
  organization: string;
  department: string;
  enrolledCourses?: string[];
  assignedBatches?: string[];
  lastLoginIp?: string;
  sessionsCount?: number;
  auditLog: UserAuditEntry[];
}

interface UserContextType {
  users: ManagedUser[];
  getUserById: (id: string) => ManagedUser | undefined;
  addUser: (userData: Omit<ManagedUser, "id" | "dateAdded" | "lastActive" | "auditLog">) => ManagedUser;
  updateUser: (id: string, updates: Partial<ManagedUser>, auditReason?: string) => ManagedUser | undefined;
  deleteUser: (id: string, reason?: string) => void;
  toggleUserStatus: (id: string, reason?: string) => ManagedUser | undefined;
  toggleUser2FA: (id: string) => ManagedUser | undefined;
  resetUserPassword: (id: string) => { tempPass: string; message: string };
  terminateUserSessions: (id: string) => void;
  bulkActivate: (ids: string[]) => void;
  bulkSuspend: (ids: string[], reason?: string) => void;
  bulkDelete: (ids: string[]) => void;
  exportUsersCSV: (selectedIds?: string[]) => void;
  undoLastAction: () => boolean;
  canUndo: boolean;
  lastActionDescription: string | null;
}

const STORAGE_KEY = "lms_managed_users_v2";

export const INITIAL_SEED_USERS: ManagedUser[] = [
  {
    id: "usr-1",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    phone: "+91 98765 00001",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    permissions: ["Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Academic Operations",
    lastLoginIp: "103.212.144.12",
    sessionsCount: 2,
    auditLog: [
      { id: "a-1", action: "Account created", timestamp: "July 4, 2022, 10:00 AM", performedBy: "Super Admin", ip: "103.212.144.1" },
      { id: "a-2", action: "Assigned Admin permissions", timestamp: "July 4, 2022, 10:05 AM", performedBy: "Super Admin", ip: "103.212.144.1" },
    ],
  },
  {
    id: "usr-2",
    name: "Amélie Laurent",
    email: "amelie@untitledui.com",
    phone: "+91 98765 00002",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    permissions: ["Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Operations Governance",
    lastLoginIp: "103.212.144.18",
    sessionsCount: 1,
    auditLog: [
      { id: "a-3", action: "Account created", timestamp: "July 4, 2022, 10:30 AM", performedBy: "Super Admin", ip: "103.212.144.1" },
    ],
  },
  {
    id: "usr-3",
    name: "Ammar Foley",
    email: "ammar@untitledui.com",
    phone: "+91 98765 00003",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    permissions: ["Live Host", "Course Author", "Data Export", "Data Import"],
    lastActive: "Mar 2, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Faculty of AI Engineering",
    lastLoginIp: "103.212.144.22",
    sessionsCount: 3,
    auditLog: [
      { id: "a-4", action: "Account created", timestamp: "July 4, 2022, 11:00 AM", performedBy: "Super Admin", ip: "103.212.144.1" },
    ],
  },
  {
    id: "usr-4",
    name: "Caitlyn King",
    email: "caitlyn@untitledui.com",
    phone: "+91 98765 00004",
    role: "evaluator",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    permissions: ["Grade Override", "Rubric Review", "Data Export", "Data Import"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Examination & Assessment Board",
    lastLoginIp: "103.212.144.29",
    sessionsCount: 1,
    auditLog: [
      { id: "a-5", action: "Account created", timestamp: "July 4, 2022, 11:30 AM", performedBy: "Super Admin", ip: "103.212.144.1" },
    ],
  },
  {
    id: "usr-5",
    name: "Sienna Hewitt",
    email: "sienna@untitledui.com",
    phone: "+91 98765 00005",
    role: "support",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    permissions: ["Ticket Agent", "Student 360", "Data Export", "Data Import"],
    lastActive: "Mar 8, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Student Experience & Doubts Desk",
    lastLoginIp: "103.212.144.33",
    sessionsCount: 2,
    auditLog: [
      { id: "a-6", action: "Account created", timestamp: "July 4, 2022, 01:00 PM", performedBy: "Super Admin", ip: "103.212.144.1" },
    ],
  },
  {
    id: "usr-6",
    name: "Olly Shroeder",
    email: "olly@untitledui.com",
    phone: "+91 98765 00006",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    permissions: ["Live + Replay", "Doubt Desk", "Data Export", "Data Import"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: false,
    organization: "Apex AI Institute",
    department: "Cohort 2026-Alpha",
    lastLoginIp: "103.212.144.40",
    sessionsCount: 1,
    auditLog: [
      { id: "a-7", action: "Enrolled in Full-Stack AI Course", timestamp: "July 4, 2022, 02:00 PM", performedBy: "Admissions Ops", ip: "103.212.144.1" },
    ],
  },
  {
    id: "usr-7",
    name: "Mathilde Lewis",
    email: "mathilde@untitledui.com",
    phone: "+91 98765 00007",
    role: "super-admin",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    permissions: ["Full Governance", "API Keys", "Billing", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Executive Technology Board",
    lastLoginIp: "103.212.144.55",
    sessionsCount: 4,
    auditLog: [
      { id: "a-8", action: "Super Admin privileges granted", timestamp: "July 4, 2022, 09:00 AM", performedBy: "Root System", ip: "127.0.0.1" },
    ],
  },
  {
    id: "usr-8",
    name: "Jaya Willis",
    email: "jaya@untitledui.com",
    phone: "+91 98765 00008",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    permissions: ["Replay Only", "Lab Cloud", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
    status: "suspended",
    twoFactorEnabled: false,
    organization: "Apex AI Institute",
    department: "Cohort 2026-Beta",
    lastLoginIp: "103.212.144.71",
    sessionsCount: 0,
    auditLog: [
      { id: "a-9", action: "Account suspended due to tuition fee review", timestamp: "Mar 4, 2024, 04:30 PM", performedBy: "Ananya Iyer", ip: "103.212.144.12" },
    ],
  },
  {
    id: "usr-super-1",
    name: "Dr. Vikram Sethi",
    email: "dr.vikram@edulms.ai",
    phone: "+91 98765 10001",
    role: "super-admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    permissions: ["Full Governance", "API Keys", "Billing", "Data Export", "Data Import"],
    lastActive: "Active Now",
    dateAdded: "Jan 10, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Chancellor & Chief Academic Officer",
    lastLoginIp: "103.212.144.1",
    sessionsCount: 2,
    auditLog: [
      { id: "a-10", action: "Platform initial setup completed", timestamp: "Jan 10, 2022, 08:00 AM", performedBy: "Root System", ip: "127.0.0.1" },
    ],
  },
  {
    id: "usr-admin-1",
    name: "Ananya Iyer",
    email: "ananya.ops@edulms.ai",
    phone: "+91 98765 10002",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    permissions: ["Data Export", "Data Import", "Student 360", "Batch Management"],
    lastActive: "15 mins ago",
    dateAdded: "Feb 15, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Academic Program Director",
    lastLoginIp: "103.212.144.14",
    sessionsCount: 1,
    auditLog: [
      { id: "a-11", action: "Promoted to Operations Lead", timestamp: "Feb 15, 2022, 10:00 AM", performedBy: "Dr. Vikram Sethi", ip: "103.212.144.1" },
    ],
  },
  {
    id: "usr-teacher-1",
    name: "Prof. Rajesh Verma",
    email: "rajesh.verma@edulms.ai",
    phone: "+91 98765 10003",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    permissions: ["Live Host", "Course Author", "Data Export"],
    lastActive: "45 mins ago",
    dateAdded: "Mar 01, 2022",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Lead AI Systems Faculty",
    lastLoginIp: "103.212.144.88",
    sessionsCount: 3,
    auditLog: [
      { id: "a-12", action: "Published 'Agentic RAG Architecture' syllabus", timestamp: "Mar 01, 2022, 11:00 AM", performedBy: "Prof. Rajesh Verma", ip: "103.212.144.88" },
    ],
  },
  {
    id: "usr-student-1",
    name: "Arjun Mehta",
    email: "arjun.m@learner.ai",
    phone: "+91 98765 10004",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    permissions: ["Live + Replay", "Doubt Desk", "Lab Cloud"],
    lastActive: "1 hour ago",
    dateAdded: "Jun 18, 2023",
    status: "active",
    twoFactorEnabled: false,
    organization: "Apex AI Institute",
    department: "Cohort 7 (Weekend Live)",
    lastLoginIp: "103.212.144.92",
    sessionsCount: 1,
    auditLog: [
      { id: "a-13", action: "Submitted Assignment 4", timestamp: "Oct 14, 2026, 06:15 PM", performedBy: "Arjun Mehta", ip: "103.212.144.92" },
    ],
  },
  {
    id: "usr-eval-1",
    name: "Kavita Rao",
    email: "kavita.eval@edulms.ai",
    phone: "+91 98765 10005",
    role: "evaluator",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    permissions: ["Grade Override", "Rubric Review", "Data Export"],
    lastActive: "2 hours ago",
    dateAdded: "Aug 12, 2023",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "AI/ML Evaluation Panel",
    lastLoginIp: "103.212.144.102",
    sessionsCount: 1,
    auditLog: [
      { id: "a-14", action: "Completed grading batch for Module 3", timestamp: "Oct 14, 2026, 02:00 PM", performedBy: "Kavita Rao", ip: "103.212.144.102" },
    ],
  },
  {
    id: "usr-support-1",
    name: "Nikhil Joshi",
    email: "nikhil.mentor@edulms.ai",
    phone: "+91 98765 10006",
    role: "support",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    permissions: ["Ticket Agent", "Student 360", "Doubt Desk"],
    lastActive: "3 hours ago",
    dateAdded: "Sep 05, 2023",
    status: "active",
    twoFactorEnabled: true,
    organization: "Apex AI Institute",
    department: "Academic Mentorship",
    lastLoginIp: "103.212.144.110",
    sessionsCount: 2,
    auditLog: [
      { id: "a-15", action: "Resolved doubt ticket #8942", timestamp: "Oct 15, 2026, 11:30 AM", performedBy: "Nikhil Joshi", ip: "103.212.144.110" },
    ],
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load users from localStorage", e);
    }
    return INITIAL_SEED_USERS;
  });

  // History stack for Undo capability
  const [history, setHistory] = useState<ManagedUser[][]>([]);
  const [lastActionDescription, setLastActionDescription] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users to localStorage", e);
    }
  }, [users]);

  const pushHistory = useCallback((description: string) => {
    setHistory((prev) => [...prev.slice(-10), users]);
    setLastActionDescription(description);
  }, [users]);

  const undoLastAction = useCallback((): boolean => {
    if (history.length === 0) return false;
    const prevUsers = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setUsers(prevUsers);
    setLastActionDescription(null);
    return true;
  }, [history]);

  const getUserById = useCallback((id: string) => {
    return users.find((u) => u.id === id);
  }, [users]);

  const addUser = useCallback((userData: Omit<ManagedUser, "id" | "dateAdded" | "lastActive" | "auditLog">): ManagedUser => {
    pushHistory(`Added user “${userData.name}”`);
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const formattedTime = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

    const newUser: ManagedUser = {
      ...userData,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dateAdded: formattedDate,
      lastActive: "Just now",
      sessionsCount: 0,
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          action: "Account created via User Management",
          timestamp: formattedTime,
          performedBy: "Current Administrator",
          ip: "103.212.144.1",
          details: `Role assigned: ${userData.role}`,
        },
      ],
    };

    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, [pushHistory]);

  const updateUser = useCallback((id: string, updates: Partial<ManagedUser>, auditReason?: string): ManagedUser | undefined => {
    let updatedUser: ManagedUser | undefined;
    const target = users.find((u) => u.id === id);
    if (!target) return undefined;

    pushHistory(`Updated “${target.name}” details`);

    const now = new Date();
    const formattedTime = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newAudit: UserAuditEntry = {
            id: `aud-${Date.now()}`,
            action: auditReason || "Profile details updated",
            timestamp: formattedTime,
            performedBy: "Current Administrator",
            ip: "103.212.144.1",
          };
          updatedUser = {
            ...u,
            ...updates,
            auditLog: [newAudit, ...(u.auditLog || [])],
          };
          return updatedUser;
        }
        return u;
      })
    );

    return updatedUser;
  }, [users, pushHistory]);

  const deleteUser = useCallback((id: string, reason?: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    pushHistory(`Deleted user “${target.name}”`);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, [users, pushHistory]);

  const toggleUserStatus = useCallback((id: string, reason?: string): ManagedUser | undefined => {
    let resultUser: ManagedUser | undefined;
    const target = users.find((u) => u.id === id);
    if (!target) return undefined;

    const nextStatus = target.status === "active" ? "suspended" : "active";
    pushHistory(`${nextStatus === "suspended" ? "Suspended" : "Activated"} user “${target.name}”`);

    const now = new Date();
    const formattedTime = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          resultUser = {
            ...u,
            status: nextStatus,
            auditLog: [
              {
                id: `aud-${Date.now()}`,
                action: `Account status changed to ${nextStatus}: ${reason || "Administrative toggle"}`,
                timestamp: formattedTime,
                performedBy: "Current Administrator",
                ip: "103.212.144.1",
              },
              ...(u.auditLog || []),
            ],
          };
          return resultUser;
        }
        return u;
      })
    );

    return resultUser;
  }, [users, pushHistory]);

  const toggleUser2FA = useCallback((id: string): ManagedUser | undefined => {
    let resultUser: ManagedUser | undefined;
    const target = users.find((u) => u.id === id);
    if (!target) return undefined;

    const next2FA = !target.twoFactorEnabled;
    pushHistory(`${next2FA ? "Enforced" : "Disabled"} 2FA for “${target.name}”`);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          resultUser = {
            ...u,
            twoFactorEnabled: next2FA,
            auditLog: [
              {
                id: `aud-${Date.now()}`,
                action: next2FA ? "MFA enforcement enabled" : "MFA requirement waived",
                timestamp: new Date().toLocaleTimeString(),
                performedBy: "Current Administrator",
                ip: "103.212.144.1",
              },
              ...(u.auditLog || []),
            ],
          };
          return resultUser;
        }
        return u;
      })
    );

    return resultUser;
  }, [users, pushHistory]);

  const resetUserPassword = useCallback((id: string) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let tempPass = "";
    for (let i = 0; i < 10; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const target = users.find((u) => u.id === id);
    if (target) {
      pushHistory(`Reset password for “${target.name}”`);
      updateUser(id, {}, "Temporary password generated by Administrator");
    }
    return {
      tempPass: `Apex#${tempPass}`,
      message: `Temporary password generated for ${target?.name || "user"}. An encrypted password reset notification has been recorded.`,
    };
  }, [users, pushHistory, updateUser]);

  const terminateUserSessions = useCallback((id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    pushHistory(`Terminated all active sessions for “${target.name}”`);
    updateUser(id, { sessionsCount: 0 }, "Forced termination of all active browser/mobile sessions");
  }, [users, pushHistory, updateUser]);

  const bulkActivate = useCallback((ids: string[]) => {
    pushHistory(`Activated ${ids.length} selected users`);
    setUsers((prev) =>
      prev.map((u) => (ids.includes(u.id) ? { ...u, status: "active" as const } : u))
    );
  }, [pushHistory]);

  const bulkSuspend = useCallback((ids: string[], reason?: string) => {
    pushHistory(`Suspended ${ids.length} selected users`);
    setUsers((prev) =>
      prev.map((u) => (ids.includes(u.id) ? { ...u, status: "suspended" as const } : u))
    );
  }, [pushHistory]);

  const bulkDelete = useCallback((ids: string[]) => {
    pushHistory(`Deleted ${ids.length} selected users`);
    setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
  }, [pushHistory]);

  const exportUsersCSV = useCallback((selectedIds?: string[]) => {
    const exportList = selectedIds && selectedIds.length > 0
      ? users.filter((u) => selectedIds.includes(u.id))
      : users;

    const headers = [
      "User ID",
      "Full Name",
      "Email Address",
      "Phone",
      "Role",
      "Status",
      "Permissions",
      "2FA Enabled",
      "Organization",
      "Department",
      "Last Active",
      "Date Added",
    ];

    const rows = exportList.map((u) => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      `"${u.phone || ""}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.permissions.join("; ")}"`,
      `"${u.twoFactorEnabled ? "Yes" : "No"}"`,
      `"${u.organization || ""}"`,
      `"${u.department || ""}"`,
      `"${u.lastActive}"`,
      `"${u.dateAdded}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lms_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [users]);

  return (
    <UserContext.Provider
      value={{
        users,
        getUserById,
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
        canUndo: history.length > 0,
        lastActionDescription,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserManagement = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserManagement must be used within a UserProvider");
  }
  return context;
};
