import React from "react";
import UseAnimations from "react-useanimations";
import check from "react-useanimations/lib/check";

export interface HoverCheckProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  strokeColor?: string;
  interaction?: "hover" | "hover-replay" | "click-replay" | "hover-loop" | "loop";
  className?: string;
}

export const HoverCheck: React.FC<HoverCheckProps> = ({
  size = 32,
  strokeColor,
  interaction = "hover",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 ${className}`}
      title="Live SLA Compliance check"
      {...props}
    >
      <UseAnimations
        animation={check}
        size={size}
        strokeColor={strokeColor || "currentColor"}
        interaction={interaction}
      />
    </div>
  );
};

export default HoverCheck;
