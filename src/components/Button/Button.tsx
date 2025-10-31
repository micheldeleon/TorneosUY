import { type ReactNode } from "react";
import "./Button.css";

interface ButtonProps {
  // Define any props if needed
  label?: string,
  parentMethod?: () => void
}

interface ChildrenProps {
  children: ReactNode
}

export const ColorRed = ({ children }: ChildrenProps) => {
  return (<div className="color-red">{children}</div>);
};
export const Button = ({ label, parentMethod }: ButtonProps) => {
  return (
    <button className="custom-button" onClick={parentMethod}>
      {label}
    </button>
  );
};
