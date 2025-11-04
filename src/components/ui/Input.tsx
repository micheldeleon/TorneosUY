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
    "w-full px-4 py-3 rounded-md font-medium outline-none transition-all";
  const ok = "bg-muted border-2 border-transparent text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-brand-deep";
  const err = "bg-red-100 border-2 border-red-500 placeholder-red-400 text-red-700 focus:ring-2 focus:ring-red-500";
  const classes = `${base} ${hasError ? err : ok} ${className}`;
  return <input className={classes} {...props} />;
};

export default Input;
