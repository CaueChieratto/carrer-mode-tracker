import { LuPencilLine } from "react-icons/lu";
import { League } from "../../../../../../common/utils/Leagues";
import Styles from "./MatchHeader.module.css";

type MatchHeaderProps = {
  leagueName: string;
  leagueData?: League;
  onEdit: () => void;
};

export const MatchHeader = ({
  leagueName,
  leagueData,
  onEdit,
}: MatchHeaderProps) => (
  <header className={Styles.header}>
    <div className={Styles.container}>
      {leagueData?.logo && (
        <div className={Styles.background_image}>
          <img src={leagueData.logo} className={Styles.league_image} />
        </div>
      )}
      <span className={Styles.league_name}>{leagueName}</span>
    </div>

    <div className={Styles.container_icon} onClick={onEdit}>
      <LuPencilLine size={20} />
    </div>
  </header>
);
