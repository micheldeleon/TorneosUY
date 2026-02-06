import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "violet" | "green";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white hover:cursor-pointer",
  secondary:
    "bg-white/10 text-white hover:bg-white/20",
  violet:
    "bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white",
  outline:
    "border border-muted text-white hover:bg-white/10",
  ghost:
    "bg-transparent text-inherit hover:bg-black/5",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500",
  green:
    "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...props
}) => {
  const base =
    "inline-flex  items-center justify-center rounded-md font-semibold transition focus:outline-none disabled:opacity-60 ";
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
