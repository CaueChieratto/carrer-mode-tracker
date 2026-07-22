import Styles from "./FooterSection_Player.module.css";
import Data from "../../Section.module.css";
import { formatDisplayValue } from "../../../../../../../../../../common/utils/FormatValue";
import { getVisualContract } from "./utils/getVisualContract";
import { Match } from "../../../../../../../../../../common/interfaces/Match";

type FooterSection_PlayerProps = {
  playerValue: number;
  salary: number;
  contractTime: number;
  matches: Match[];
  currency?: string;
};

const FooterSection_Player = ({
  playerValue,
  salary,
  contractTime,
  matches,
  currency,
}: FooterSection_PlayerProps) => {
  return (
    <footer className={Styles.player_contract}>
      <h3 className={Data.data_title}>
        {formatDisplayValue(playerValue, currency)}
      </h3>
      <div className={Styles.player_contract_bottom}>
        <h3 className={Data.data}>{formatDisplayValue(salary, currency)}</h3>
        <div className={Data.data}>
          {getVisualContract(contractTime, matches)}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection_Player;
