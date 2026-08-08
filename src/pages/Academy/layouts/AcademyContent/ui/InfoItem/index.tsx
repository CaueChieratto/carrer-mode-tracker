import { ReactNode } from "react";
import Styles from "./InfoItem.module.css";

type InfoItemProps = {
  children: ReactNode;
  isTitle?: boolean;
  className?: string;
};

export const InfoItem = ({ children, isTitle, className }: InfoItemProps) => {
  return (
    <span
      className={`${isTitle ? Styles.title : Styles.subtitle} ${className || ""}`.trim()}
    >
      {children}
    </span>
  );
};
