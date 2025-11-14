import React from "react";
import Card from "../../ui/Card";
import Styles from "../DetailedPlayerSeasons/InfoPlayerTab/InfoPlayerTab.module.css";

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <Card className={Styles.card}>
    <div className={Styles.container}>
      <h1 className={Styles.title}>{title}</h1>
      {children}
    </div>
  </Card>
);

export default InfoCard;
