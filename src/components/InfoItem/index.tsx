import React from "react";
import Styles from "../DetailedPlayerSeasons/InfoPlayerTab/InfoPlayerTab.module.css";

type InfoItemProps = {
  label: string | number;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon, color }) => (
  <div className={Styles.contents} style={{ color }}>
    <h1 className={Styles.info}>{label}</h1>
    <h2 className={Styles.value}>{value}</h2>
    <h3 className={Styles.icon}>{icon}</h3>
  </div>
);

export default InfoItem;
