import Styles from "./SummaryItem.module.css";
import Titles from "../GeneralTab/GeneralTab.module.css";
import React from "react";

type SummaryItemProps = {
  info: string;
  number: string | number;
  icon: React.ReactNode;
};

const SummaryItem = ({ info, number, icon }: SummaryItemProps) => (
  <div className={Styles.infos}>
    <h2 className={Titles.h2}>{info}</h2>
    <span className={Titles.number}>{number}</span>
    <div className={Titles.icon}>{icon}</div>
  </div>
);

export default SummaryItem;
