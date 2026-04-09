import { GiSoccerBall } from "react-icons/gi";
import Styles from "./EventIcon.module.css";
import { PenaltyGoal } from "../../../../../../../../../../ui/IconsSVG/PenaltyGoal";
import { PenaltyMiss } from "../../../../../../../../../../ui/IconsSVG/PenaltyMiss";
import { RefereeCard } from "../../../../../../../../../../ui/IconsSVG/RefereeCard";
import { Sub } from "../../../../../../../../../../ui/IconsSVG/Sub";
import { MatchEvent } from "../../../../../../types";

type Props = {
  type: MatchEvent["type"];
};

export const EventIcon = ({ type }: Props) => {
  switch (type) {
    case "goal":
      return <GiSoccerBall />;
    case "penalty_goal":
      return <PenaltyGoal />;
    case "yellow_card":
      return <RefereeCard type="yellow" className={Styles.icon_card} />;
    case "second_yellow":
      return <RefereeCard type="second-yellow" className={Styles.icon_card} />;
    case "red_card":
      return <RefereeCard type="red" className={Styles.icon_card} />;
    case "sub":
      return <Sub className={Styles.icon_sub} />;
    case "penalty_miss":
      return <PenaltyMiss />;
    default:
      return null;
  }
};
