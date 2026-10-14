import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlight?: boolean;
  index?: number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
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
          "overflow-hidden relative shadow-xs border-border/80 h-full flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all duration-200",
          highlight && "bg-gradient-to-br from-primary/10 via-card to-card border-primary/30",
          className
        )}
      >
        <div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight pr-2 min-h-[2.25rem] sm:min-h-[2.5rem] flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
              {title}
            </CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex-shrink-0 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {value}
            </div>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                {trend && (
                  <span
                    className={cn(
                      "font-semibold",
                      trend.isPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {trend.value}
                  </span>
                )}
                <span>{subtitle}</span>
              </p>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};
