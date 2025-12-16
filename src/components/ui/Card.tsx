import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {}

export const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  const base =
    "rounded-2xl bg-surface-dark/10 p-4 border border-purple-500/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:transition-shadow shadow-purple-900/50";
  return (
    <article className={`${base} ${className}`} {...props}>
      {children}
    </article>
  );
};

export default Card;
