import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input: React.FC<InputProps> = ({
  hasError = false,
  className = "",
  ...props
}) => {
  const base =
    "w-full px-4 py-2 rounded-md font-medium outline-none transition-all focus:ring-2";

  const ok =
    "bg-transparent border border-white/60 text-white placeholder-white/40 focus:ring-white/20";

  const err =
    "bg-transparent border border-red-500 placeholder-red-400 text-red-700 focus:ring-red-500";

  const classes = `${base} ${hasError ? err : ok} ${className}`;

  return <input className={classes} {...props} />;
};

export default Input;
