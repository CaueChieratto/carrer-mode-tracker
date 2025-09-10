import AddSeason_Player from "../../../components/AddSeason_Player";
import AddSquad_Player from "../../../components/AddSquad_Player";
import { Career } from "../../interfaces/Career";
import { ClubData } from "../../interfaces/club/clubData";
import { Players } from "../../interfaces/playersInfo/players";
import { ModalType } from "../../types/enums/ModalType";

type SaveAction = (formData: FormData) => void;

type PlayerFormComponentProps = {
  player?: Players;
  career: Career;
  season: ClubData;
  openModal: (modal: ModalType, career?: Career) => void;
};

type PlayerFormComponentType = React.ForwardRefExoticComponent<
  PlayerFormComponentProps & React.RefAttributes<HTMLFormElement>
>;

type PlayerFormConfig = {
  label: string;
  component: PlayerFormComponentType;
  saveAction: SaveAction;
};

type ConfigMap = {
  [key: string]: PlayerFormConfig;
};

export const getAddPlayerConfig = (
  player: Players | undefined,
  squadSaveAction: SaveAction,
  statsSaveAction: SaveAction
): ConfigMap => ({
  squad: {
    label: player ? "Editar Jogador" : "Adicionar Jogador",
    component: AddSquad_Player,
    saveAction: squadSaveAction,
  },
  stats: {
    label: "Salvar Desempenho",
    component: AddSeason_Player,
    saveAction: statsSaveAction,
  },
});
