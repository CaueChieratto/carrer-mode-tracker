import Button from "../../../../../../../components/Button";
import { Career } from "../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import { TransferPlayerProvider } from "./contexts/TransferPlayerProvider";
import { TransferPlayerScreen } from "./screens/TransferPlayerScreen";

type TransferPlayerProps = {
  career: Career;
  season: ClubData;
  playerId: string;
  mode?: "transfer" | "loan";
  onClose: () => void;
};

export default function TransferPlayer(props: TransferPlayerProps) {
  const player = props.season.players.find((p) => p.id === props.playerId);

  if (!player) {
    return <Button onClick={props.onClose}>Dados não encontrados.</Button>;
  }

  return (
    <TransferPlayerProvider {...props} player={player}>
      <TransferPlayerScreen />
    </TransferPlayerProvider>
  );
}
