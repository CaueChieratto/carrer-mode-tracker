import Styles from "./FooterSection_Player.module.css";
import Data from "../../Section.module.css";
import { formatDisplayValue } from "../../../../../../../common/utils/FormatValue";
import { getVisualContract } from "./utils/getVisualContract";
import { Match } from "../../../../../../AllMatchesTab/types/Match";

type FooterSection_PlayerProps = {
  playerValue: number;
  salary: number;
  contractTime: number;
  matches: Match[];
};

const FooterSection_Player = ({
  playerValue,
  salary,
  contractTime,
  matches,
}: FooterSection_PlayerProps) => {
  return (
    <footer className={Styles.player_contract}>
      <h3 className={Data.data_title}>{formatDisplayValue(playerValue)}</h3>
      <div className={Styles.player_contract_bottom}>
        <h3 className={Data.data}>{formatDisplayValue(salary)}</h3>
        <div className={Data.data}>
          {getVisualContract(contractTime, matches)}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection_Player;
