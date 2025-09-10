import { ReactNode, SelectHTMLAttributes } from "react";
import Styles from "./Select.module.css";

type SelectProps = {
  children: ReactNode;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ children, className, ...props }: SelectProps) => {
  return (
    <select className={className ?? Styles.select} {...props}>
      {children}
    </select>
  );
};

export default Select;
