import { ReactNode } from "react";
import Styles from "./StatCard.module.css";

type StatCardProps = {
  icon: ReactNode;
  value: string | number;
  label: string;
  customColor?: string;
  variant?: "default" | "title";
  isActive?: boolean;
  onClick?: () => void;
};

export const StatCard = ({
  icon,
  value,
  label,
  customColor,
  isActive = false,
  variant = "default",
  onClick,
}: StatCardProps) => {
  const activeStyle = isActive
    ? {
        transform: "translateY(-2px)",
        boxShadow: `0 6px 16px color-mix(in srgb, ${
          customColor || "var(--club-color)"
        } 30%, transparent)`,
        borderColor: customColor || "var(--club-color)",
      }
    : {};

  if (variant === "title") {
    return (
      <div className={Styles.titlesCard} style={activeStyle} onClick={onClick}>
        <div className={Styles.titlesIconWrapper}>
          <div className={Styles.titlesIcon}>{icon}</div>
        </div>

        <div className={Styles.titlesInfo}>
          <span className={Styles.titlesValue}>{value}</span>
          <span className={Styles.titlesLabel}>{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.statCard} style={activeStyle} onClick={onClick}>
      <div
        className={Styles.statIcon}
        style={customColor ? { color: customColor } : undefined}
      >
        {icon}
      </div>

      <span
        className={Styles.statValue}
        style={customColor ? { color: customColor } : undefined}
      >
        {value}
      </span>

      <span className={Styles.statLabel}>{label}</span>
    </div>
  );
};
