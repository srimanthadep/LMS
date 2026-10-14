import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  icon: React.ElementType;
  trend?:
    | {
        value: string;
        isPositive?: boolean;
      }
    | "up"
    | "down"
    | "neutral";
  highlight?: boolean;
  index?: number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  trend,
  highlight = false,
  index = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="h-full"
    >
      <Card
        className={cn(
          "overflow-hidden relative shadow-xs border-border/80 h-full flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-card/80 backdrop-blur-xs",
          highlight && "bg-gradient-to-br from-primary/10 via-card to-card border-primary/30",
          className
        )}
      >
        <div className="p-5 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
              {title}
            </span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all">
              <Icon className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {value}
            </div>

            {(trend || subtitle || change) && (
              <div className="text-[11px] sm:text-xs text-muted-foreground mt-2 flex items-center gap-1.5 flex-wrap">
                {trend && typeof trend === "object" && (
                  <span
                    className={cn(
                      "font-bold",
                      trend.isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {trend.value}
                  </span>
                )}
                {change && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {change}
                  </span>
                )}
                {subtitle && <span>{subtitle}</span>}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
