import { forwardRef, FormHTMLAttributes, ReactNode } from "react";
import Styles from "./Form.module.css";
import classNames from "classnames";

type FormProps = {
  children: ReactNode;
  gap?: "normal" | "big";
} & FormHTMLAttributes<HTMLFormElement>;

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, gap = "normal", ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={classNames(Styles.form, Styles[gap])}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = "Form";

export default Form;
