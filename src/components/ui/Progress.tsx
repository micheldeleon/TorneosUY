import React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0..100
}

export const Progress: React.FC<ProgressProps> = ({ value, className = "", ...props }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full bg-transparent border border-white/10 ${className}`} {...props}>
      <div className="h-full bg-gradient-to-r from-purple-600 to-purple-800" style={{ width: `${clamped}%` }} />
      
    </div>
  );
};

export default Progress;

