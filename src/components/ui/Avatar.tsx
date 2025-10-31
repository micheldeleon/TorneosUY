import React from "react";

type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const Avatar: React.FC<AvatarProps> = ({ size = "sm", className = "", ...props }) => {
  const base = "rounded-full border border-white/30 object-cover";
  const classes = `${base} ${sizeClasses[size]} ${className}`;
  return <img className={classes} {...props} />;
};

export default Avatar;

