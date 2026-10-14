import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedNotificationIcon } from "@/components/notifications/AnimatedNotificationIcon";
import { useNotifications } from "@/context/NotificationContext";
import { CheckCheck, Video, HelpCircle, Award, AlertCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const navigate = useNavigate();

  const displayedList = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "class":
        return <Video className="h-3.5 w-3.5 text-primary" />;
      case "doubt":
        return <HelpCircle className="h-3.5 w-3.5 text-amber-500" />;
      case "grade":
        return <Award className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5 text-sky-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border/70 hover:bg-muted/70 text-foreground transition-colors group focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <AnimatedNotificationIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-2xl rounded-2xl border-border/80 overflow-hidden"
      >
        <div className="flex items-center justify-between p-3.5 border-b border-border/70 bg-muted/20">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm tracking-tight">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="accent" className="h-5 text-[10px] px-1.5">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark all read</span>
            </Button>
          )}
        </div>

        {/* Filter Tab bar */}
        <div className="flex border-b border-border/60 bg-muted/10 px-3 py-1.5 gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "text-xs px-2.5 py-1 rounded-lg transition-colors font-medium",
              filter === "all" ? "bg-card shadow-xs text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "text-xs px-2.5 py-1 rounded-lg transition-colors font-medium",
              filter === "unread" ? "bg-card shadow-xs text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto sleek-scrollbar divide-y divide-border/60">
          {displayedList.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No notifications to display
            </div>
          ) : (
            displayedList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markAsRead(item.id);
                  if (item.link) {
                    setOpen(false);
                    navigate(item.link);
                  }
                }}
                className={cn(
                  "p-3.5 transition-colors cursor-pointer flex gap-3 text-left hover:bg-muted/40",
                  !item.read && "bg-primary/5"
                )}
              >
                <div className="mt-0.5 p-2 rounded-xl bg-card border border-border/70 shrink-0 self-start shadow-xs">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={cn("text-xs font-semibold truncate", !item.read ? "text-foreground font-bold" : "text-muted-foreground")}>
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  {item.link && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-primary font-medium mt-1">
                      View details <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
