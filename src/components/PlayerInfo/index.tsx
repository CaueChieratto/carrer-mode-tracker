import React from "react";
import Styles from "./PlayerInfo.module.css";
import CaptainArmbandIcon from "../../ui/CaptainArmbandIcon";

export type PlayerInfoProps = {
  name: string;
  position: string;
  shirtNumber: string | number;
  age: number | string;
  nation: string;
  captain?: boolean;
  customContainerClass?: string;
  onTouchMove?: React.TouchEventHandler<HTMLElement>;
};

export const PlayerInfo = ({
  name,
  position,
  shirtNumber,
  age,
  nation,
  captain,
  customContainerClass = "",
  onTouchMove,
}: PlayerInfoProps) => {
  return (
    <header
      className={`${Styles.player_info} ${customContainerClass}`}
      onTouchMove={onTouchMove}
    >
      <div className={Styles.player_info_top}>
        <h2 className={Styles.data_title}>{name}</h2>
        <div className={Styles.data}>{position}</div>
        <div className={Styles.data}>{shirtNumber}</div>
        {captain && <CaptainArmbandIcon />}
      </div>
      <div className={Styles.player_info_bottom}>
        <h2 className={Styles.data}>{age} anos</h2>
        <div className={Styles.data}>{nation}</div>
      </div>
    </header>
  );
};
