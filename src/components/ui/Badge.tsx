import React from "react";

type BadgeVariant = "success" | "danger" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-200 text-slate-800",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  className = "",
  children,
  ...props
}) => {
  const base = "text-[10px] rounded-full px-2 py-0.5 font-semibold";
  const classes = `${base} ${variantClasses[variant]} ${className}`;
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;

