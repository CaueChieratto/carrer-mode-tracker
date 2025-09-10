import { LabelHTMLAttributes, ReactNode } from "react";
import Styles from "./Label.module.css";

type LabelProps = {
  children: ReactNode;
  htmlFor: string;
  className?: string;
  onClick?: () => void;
} & LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({
  children,
  htmlFor,
  className,
  onClick,
  ...props
}: LabelProps) => {
  return (
    <label
      onClick={onClick}
      htmlFor={htmlFor}
      className={className ?? Styles.label}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
