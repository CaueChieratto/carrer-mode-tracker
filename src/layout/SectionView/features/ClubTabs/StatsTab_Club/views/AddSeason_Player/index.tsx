import { Career } from "../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import AddSeason_PlayerScreen from "./screens/AddSeason_PlayerScreen";

type AddSeasonPlayerProps = {
  career: Career;
  season: ClubData;
  playerId?: string;
  onClose: () => void;
};

export default function AddSeason_Player(props: AddSeasonPlayerProps) {
  const player = props.playerId
    ? props.season.players.find((p) => p.id === props.playerId)
    : undefined;

  return <AddSeason_PlayerScreen {...props} player={player} />;
}
