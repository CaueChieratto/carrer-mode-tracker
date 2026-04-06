import Styles from "./FieldMarkings.module.css";

export const FieldMarkings = () => (
  <>
    <div className={Styles.field_center_circle} />
    <div className={Styles.field_center_line} />
    <div className={Styles.field_penalty_top} />
    <div className={Styles.field_penalty_bottom} />
    <div className={Styles.field_goal_top} />
    <div className={Styles.field_goal_bottom} />
  </>
);
