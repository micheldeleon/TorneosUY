import React from "react";

export interface SectionHeaderProps {
  title: string;
  right?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, right, className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-start to-brand-end text-white px-5 py-2 shadow-sm select-none">
        <span className="text-sm font-semibold">{title}</span>
      </div>
      {right}
    </div>
  );
};

export default SectionHeader;
