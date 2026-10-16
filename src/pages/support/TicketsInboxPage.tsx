import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LifeBuoy,
  Search,
  Filter,
  Clock,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { mockDataService } from "@/services/mockDataService";
import { SupportTicket } from "@/types/lms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TicketsInboxPage: React.FC = () => {
  const [tickets] = useState<SupportTicket[]>(mockDataService.getTickets());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = tickets.filter((tkt) => {
    const matchesSearch =
      tkt.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tkt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tkt.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && tkt.status !== statusFilter) return false;
    if (categoryFilter !== "all" && tkt.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            All Tickets & Support Inbox
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage incoming student inquiries, escalation workflows, and approval proposals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/support/sla-escalations">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 font-semibold">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              SLA Command Desk
            </Button>
          </Link>
          <Link to="/support/live-chat">
            <Button size="sm" className="text-xs gap-1.5 bg-primary text-primary-foreground font-semibold">
              <MessageSquare className="h-3.5 w-3.5" />
              Live Chat Desk
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticket #, student, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto text-xs rounded-lg border border-border bg-background p-2"
            >
              <option value="all">All Categories</option>
              <option value="batch_change">Batch Move Requests</option>
              <option value="extension">Validity Extensions</option>
              <option value="doubt_escalation">Doubt Escalations</option>
              <option value="billing">Payment Inquiries</option>
            </select>

            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all" className="text-xs">
                  All ({tickets.length})
                </TabsTrigger>
                <TabsTrigger value="open" className="text-xs">
                  Open
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">
                  Pending Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No tickets matching this filter.
              </div>
            ) : (
              filtered.map((tkt) => (
                <div
                  key={tkt.id}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {tkt.ticketNumber}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {tkt.studentName}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{tkt.createdAt}</span>

                      {tkt.priority === "high" && (
                        <Badge variant="destructive" className="text-[10px]">
                          High
                        </Badge>
                      )}
                      {tkt.status === "open" && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Open
                        </Badge>
                      )}
                      {tkt.status === "pending" && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                          Pending Approval
                        </Badge>
                      )}
                      {tkt.proposedAction && (
                        <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-600 border-violet-500/20">
                          Proposed: {tkt.proposedAction.type === "batch_move" ? "Batch Move" : "Extension"}
                        </Badge>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-foreground">
                      {tkt.subject}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {tkt.studentBatch} • Assigned Agent: {tkt.assignedAgent}
                    </p>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                    <Link to={`/support/ticket/${tkt.id}`}>
                      <Button size="sm" variant="outline" className="text-xs gap-1.5">
                        Open Workstation <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
