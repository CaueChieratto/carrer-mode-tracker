import { forwardRef, InputHTMLAttributes } from "react";
import Styles from "./Input.module.css";

type InputProps = {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={className ?? Styles.input} {...props} />;
  }
);

Input.displayName = "Input";

export default Input;
