import Styles from "./FooterSection_Player.module.css";
import Data from "../../common/elements/SquadElements/Section/Section.module.css";
import { formatDisplayValue } from "../../common/utils/FormatValue";

type FooterSection_PlayerProps = {
  playerValue: number;
  salary: number;
  contractTime: number;
};

const FooterSection_Player = ({
  playerValue,
  salary,
  contractTime,
}: FooterSection_PlayerProps) => {
  return (
    <footer className={Styles.player_contract}>
      <h3 className={Data.data_title}>{formatDisplayValue(playerValue)}</h3>
      <div className={Styles.player_contract_bottom}>
        <h3 className={Data.data}>{formatDisplayValue(salary)}</h3>
        <div className={Data.data}>
          {contractTime <= 1 ? `${contractTime} ano` : `${contractTime} anos`}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection_Player;
