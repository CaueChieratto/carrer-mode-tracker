import Styles from "./PlayerName.module.css";

type PlayerName = {
  playerName: string;
};

export const PlayerName = ({ playerName }: PlayerName) => {
  return <span className={Styles.playerName}>{playerName}</span>;
};
