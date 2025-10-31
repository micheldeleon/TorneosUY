import React from "react";

export const Menu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => {
  const base = "bg-white text-slate-800 rounded-lg shadow-lg overflow-hidden";
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  className = "",
  danger = false,
  children,
  ...props
}) => {
  const base = "block w-full text-left px-4 py-2 text-sm hover:bg-slate-100";
  const color = danger ? "text-red-600 hover:bg-red-50" : "";
  return (
    <button className={`${base} ${color} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const MenuSeparator: React.FC = () => (
  <div className="my-1 h-px bg-slate-200" />
);

