import React from "react";
import Card from "../../ui/Card";
import Styles from "../DetailedPlayerSeasons/InfoPlayerTab/InfoPlayerTab.module.css";

type InfoCardProps = {
  title: string;
  color: string;
  children: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, color, children }) => (
  <Card className={Styles.card}>
    <div className={Styles.container}>
      <h1 className={Styles.title} style={{ color }}>
        {title}
      </h1>
      {children}
    </div>
  </Card>
);

export default InfoCard;
