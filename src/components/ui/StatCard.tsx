import React from "react";
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
  onAction?: () => void;
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
  onAction,
}) => {
  if (highlight) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.25 }}
        className="h-full"
      >
        <div
          className={cn(
            "p-5 rounded-2xl hero-card-pattern text-white relative shadow-sm flex flex-col justify-between min-h-[170px] h-full",
            className
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-800/60 border border-emerald-600/30 flex items-center justify-center text-emerald-300">
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-emerald-100">{title}</span>
            </div>
            {/* Arrow Link Icon */}
            <button
              onClick={onAction}
              className="w-7 h-7 rounded-full bg-emerald-800/40 hover:bg-emerald-700/50 flex items-center justify-center text-emerald-300 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          <div className="my-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
            <span className="inline-flex items-center text-emerald-400 text-xs font-semibold">
              <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-800/50">
            <span className="text-emerald-300/90 font-medium">
              {typeof trend === "object" ? trend.value : change || "Active"}
            </span>
            <span className="text-emerald-200/70">{subtitle}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="h-full"
    >
      <div
        className={cn(
          "p-5 rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-border/80 shadow-2xs flex flex-col justify-between min-h-[170px] h-full",
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{title}</span>
          </div>
          <button
            onClick={onAction}
            className="w-7 h-7 rounded-full bg-slate-50 dark:bg-muted/40 hover:bg-slate-100 dark:hover:bg-muted/70 flex items-center justify-center text-slate-400 cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
        <div className="my-1 flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {value}
            </span>
          </div>
          {/* Mini decorative bar chart */}
          <div className="flex items-end gap-1 h-6 pb-0.5">
            <div className="w-1.5 h-2.5 bg-emerald-100 dark:bg-emerald-900/60 rounded-xs"></div>
            <div className="w-1.5 h-4 bg-emerald-200 dark:bg-emerald-800/60 rounded-xs"></div>
            <div className="w-1.5 h-3.5 bg-emerald-300 dark:bg-emerald-700/60 rounded-xs"></div>
            <div className="w-1.5 h-5 bg-emerald-400 dark:bg-emerald-600/60 rounded-xs"></div>
            <div className="w-1.5 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-xs"></div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-border/60">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
            {trend && typeof trend === "object" ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                {trend.value}
              </>
            ) : change ? (
              change
            ) : (
              "Verified"
            )}
          </span>
          <span className="text-slate-400 truncate max-w-[150px]">{subtitle}</span>
        </div>
      </div>
    </motion.div>
  );
};
export default StatCard;
