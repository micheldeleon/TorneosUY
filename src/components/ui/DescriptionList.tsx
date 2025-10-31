import React from "react";

export interface DescriptionItem {
  label: string;
  value: React.ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  dense?: boolean;
}

export const DescriptionList: React.FC<DescriptionListProps> = ({ items, dense = true, className = "", ...props }) => {
  return (
    <dl className={`text-slate-800 ${className}`} {...props}>
      {items.map((it) => (
        <div key={it.label} className={`flex items-center justify-between ${dense ? "py-1" : "py-2"}`}>
          <dt className="text-sm font-semibold opacity-80 mr-4">{it.label}</dt>
          <dd className="text-sm text-slate-700">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default DescriptionList;

