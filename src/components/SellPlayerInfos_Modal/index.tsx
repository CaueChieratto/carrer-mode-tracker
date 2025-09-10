import { UseOverallColor } from "../../common/hooks/Colors/GetOverallColor";
import { Players } from "../../common/interfaces/playersInfo/players";
import { formatDisplayValue } from "../../common/utils/FormatValue";
import Styles from "./SellPlayerInfos_Modal.module.css";

type SellPlayerInfos_ModalProps = {
  player: Players;
};

const SellPlayerInfos_Modal = ({ player }: SellPlayerInfos_ModalProps) => {
  return (
    <div className={Styles.player_info_card}>
      <div className={Styles.player_details}>
        <div className={Styles.player_name_position}>
          <span className={Styles.player_name}>{player.name}</span>
          <span className={Styles.player_position}>{player.position}</span>
        </div>
        <div
          className={Styles.player_overall}
          style={{ backgroundColor: UseOverallColor(player.overall) }}
        >
          {player.overall}
        </div>
      </div>
      <div className={Styles.player_value_info}>
        <span>Valor atual: {formatDisplayValue(player.playerValue)}</span>
      </div>
    </div>
  );
};

export default SellPlayerInfos_Modal;
