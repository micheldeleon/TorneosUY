import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {}

export const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  const base =
    "rounded-2xl bg-white p-4 border border-black/5 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg";
  return (
    <article className={`${base} ${className}`} {...props}>
      {children}
    </article>
  );
};

export default Card;
