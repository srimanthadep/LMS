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
  onClick?: () => void;
  isActive?: boolean;
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
  onClick,
  isActive = false,
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
          onClick={onClick}
          className={cn(
            "p-4 sm:p-5 rounded-2xl hero-card-pattern text-white relative shadow-sm flex flex-col justify-between h-full min-h-[135px] transition-all",
            onClick && "cursor-pointer active:scale-[0.99]",
            className
          )}
        >
          {/* Top row: Pure icon without background + Title + Subtle Arrow */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Icon className="w-4 h-4 text-white shrink-0" />
              <span className="text-xs font-semibold text-rose-100 truncate" title={title}>
                {title}
              </span>
            </div>
            {onAction ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
                className="text-white/70 hover:text-white p-0.5 rounded transition-colors shrink-0 cursor-pointer"
                title="View details"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M7 17L17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <span className="text-white/40 shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M7 17L17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>

          {/* Value without bar chart */}
          <div className="my-2.5">
            <span className="text-2xl sm:text-[28px] font-bold tracking-tight tabular-nums text-white leading-none">
              {value}
            </span>
          </div>

          {/* Bottom row: Trend & Subtitle with proper spacing */}
          <div className="flex items-center justify-between gap-2 text-[11px] pt-2 border-t border-rose-900/40">
            <span className="text-rose-200 font-semibold inline-flex items-center gap-1 shrink-0">
              {typeof trend === "object" ? trend.value : change || "Active"}
            </span>
            {subtitle && (
              <span className="text-rose-100/70 truncate text-right ml-auto">{subtitle}</span>
            )}
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
        onClick={onClick}
        className={cn(
          "p-4 sm:p-5 rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-border/80 shadow-2xs flex flex-col justify-between h-full min-h-[135px] transition-all duration-200",
          onClick && "cursor-pointer hover:border-primary/50 hover:shadow-xs active:scale-[0.99]",
          isActive && "ring-2 ring-primary border-primary bg-primary/[0.03] dark:bg-primary/10 shadow-xs",
          className
        )}
      >
        {/* Top row: Pure icon without background + Title + Optional Action */}
        <div className="flex items-start justify-between gap-1.5 min-h-[30px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <span className="text-[11.5px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {title}
            </span>
          </div>
          {onAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction();
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
              title="View details"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M7 17L17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Value without bar chart */}
        <div className="my-2">
          <span className="text-2xl sm:text-[26px] font-bold tracking-tight tabular-nums text-slate-900 dark:text-white leading-none">
            {value}
          </span>
        </div>

        {/* Bottom row: Trend & Subtitle with proper spacing and no collision */}
        <div className="flex items-center justify-between gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-border/60">
          <span className={cn(
            "inline-flex items-center gap-1 font-semibold shrink-0",
            trend && typeof trend === "object"
              ? trend.isPositive
                ? "text-[#e11d48] dark:text-rose-400"
                : "text-slate-600 dark:text-slate-400"
              : "text-[#e11d48] dark:text-rose-400"
          )}>
            {trend && typeof trend === "object" ? (
              <>
                {trend.isPositive && (
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span>{trend.value}</span>
              </>
            ) : change ? (
              change
            ) : (
              "Verified"
            )}
          </span>
          {subtitle && (
            <span className="text-slate-400 dark:text-slate-400 truncate text-right ml-auto" title={subtitle}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default StatCard;
