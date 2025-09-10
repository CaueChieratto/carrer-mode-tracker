import { CSSProperties } from "react";
import Styles from "./Title.module.css";

type TitleProps = {
  style?: CSSProperties;
  trophyName: string;
  seasonsChampions: number;
};

export const Title = ({ style, trophyName, seasonsChampions }: TitleProps) => {
  return (
    <h1 className={Styles.h1} style={style}>
      {seasonsChampions}X campeão da {trophyName}
    </h1>
  );
};
