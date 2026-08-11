import { FaArrowRight } from "react-icons/fa";
import { FeedEvent } from "../../../../types/FeedEvent";
import Styles from "./StatsDetails.module.css";

type StatsDetailsProps = {
  details: NonNullable<FeedEvent["details"]>;
  type: string;
};

const getLabel = (t: string): string => {
  const map: Record<string, string> = {
    overall: "OVERALL",
    potential: "POTENCIAL",
    age: "IDADE",
    height: "ALTURA",
    weight: "PESO",
  };
  return map[t] || t.toUpperCase();
};

export const StatsDetails = ({ details, type }: StatsDetailsProps) => {
  const oldV = details.oldValue;
  const newV = details.newValue;

  let diff: number | null = null;
  if (typeof oldV === "number" && typeof newV === "number") {
    diff = newV - oldV;
  } else if (!isNaN(Number(oldV)) && !isNaN(Number(newV))) {
    diff = Number(newV) - Number(oldV);
  }

  const unit = type === "weight" ? "kg" : type === "height" ? "cm" : "";

  return (
    <div className={Styles.socialCard}>
      <div className={Styles.statTypeTag}>{getLabel(type)}</div>

      <div className={Styles.evolutionRow}>
        <span className={Styles.oldSocialStat}>{oldV}</span>
        <FaArrowRight className={Styles.socialArrow} />
        <span className={Styles.newSocialStat}>{newV}</span>
      </div>

      {diff !== null && diff !== 0 && (
        <div
          className={`${Styles.diffBadge} ${
            diff > 0 ? Styles.diffPos : Styles.diffNeg
          }`}
        >
          {diff > 0 ? `+${diff}` : diff}
          {unit}
        </div>
      )}
    </div>
  );
};
