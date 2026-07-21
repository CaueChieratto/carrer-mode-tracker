import React from "react";
import Styles from "./PlayerInfo.module.css";
import CaptainArmbandIcon from "../../ui/CaptainArmbandIcon";
import { PlayerCircle } from "../../pages/Match/components/LineupTab/layouts/Section/components/SlotButton/components/PlayerDetails/PlayerCircle";
import { OverflowText } from "../OverflowText";

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
      <div className={Styles.player_header}>
        <PlayerCircle isSquad shirtNumber={shirtNumber} />
        <div className={Styles.player_content}>
          <OverflowText
            className={Styles.player_info_top}
            disableDynamicMinWidth={true}
            style={{ display: "flex", minWidth: "auto" }}
            text={
              (
                <>
                  <span className={Styles.data_title}>{name}</span>
                  <span className={Styles.data}>{position}</span>
                  {captain && <CaptainArmbandIcon />}
                </>
              ) as unknown as string
            }
          />

          <div className={Styles.player_info_bottom}>
            <div className={Styles.data}>{age} anos</div>
            <div className={Styles.data}>{nation}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
