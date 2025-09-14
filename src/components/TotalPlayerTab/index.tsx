import { Players } from "../../common/interfaces/playersInfo/players";

type TotalPlayerTabProps = {
  player?: Players;
};

const TotalPlayerTab = ({ player }: TotalPlayerTabProps) => {
  return <div>{player?.name}</div>;
};

export default TotalPlayerTab;
