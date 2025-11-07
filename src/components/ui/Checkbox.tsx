import React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = "", ...props }) => {
  return (
    <label className={`inline-flex items-center gap-2 text-sm text-slate-100 select-none ${className}`}>
      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-700 focus:ring-indigo-600" {...props} />
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;

