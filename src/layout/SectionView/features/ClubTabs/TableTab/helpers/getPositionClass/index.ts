import Styles from "../../TableTab.module.css";
import { QualificationZone } from "../../../../../../../common/interfaces/Table";

export const getPositionClass = (zone: QualificationZone) => {
  switch (zone) {
    case "first":
      return Styles.pos_first;
    case "champions":
      return Styles.pos_champions;
    case "europa":
      return Styles.pos_europa;
    case "conference":
      return Styles.pos_conference;
    case "relegation":
      return Styles.pos_relegation;
    case "promotion":
      return Styles.pos_promotion;
    case "promotion_playoff":
      return Styles.pos_promotion_playoff;
    default:
      return Styles.pos_default;
  }
};
