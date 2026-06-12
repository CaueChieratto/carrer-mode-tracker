import React from "react";
import Styles from "./StatRow.module.css";
import { UseRatingColor } from "../../../../common/hooks/Colors/GetOverallColor";

interface StatRowProps {
  label: string;
  val1: React.ReactNode;
  val2: React.ReactNode;
  isRating?: boolean;
}

export const StatRow = ({
  label,
  val1,
  val2,
  isRating = false,
}: StatRowProps) => (
  <div className={Styles.statRow}>
    <div className={Styles.statValue}>
      {isRating && val1 !== "-" ? (
        <span
          className={Styles.ratingBadge}
          style={{ backgroundColor: UseRatingColor(Number(val1)) }}
        >
          {val1}
        </span>
      ) : (
        val1 || "-"
      )}
    </div>
    <div className={Styles.statLabel}>{label}</div>
    <div className={Styles.statValue}>
      {isRating && val2 !== "-" ? (
        <span
          className={Styles.ratingBadge}
          style={{ backgroundColor: UseRatingColor(Number(val2)) }}
        >
          {val2}
        </span>
      ) : (
        val2 || "-"
      )}
    </div>
  </div>
);
