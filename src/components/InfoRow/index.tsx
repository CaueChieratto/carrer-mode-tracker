import React from "react";
import Styles from "../DetailedPlayerSeasons/InfoPlayerTab/InfoPlayerTab.module.css";

type InfoRowProps = {
  children: React.ReactNode;
};

const InfoRow: React.FC<InfoRowProps> = ({ children }) => (
  <div className={Styles.content_container}>{children}</div>
);

export default InfoRow;
