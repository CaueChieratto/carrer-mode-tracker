import { LuPencilLine } from "react-icons/lu";
import { League } from "../../../../../../../../../common/utils/Leagues";
import Styles from "./MatchHeader.module.css";
import { Match } from "../../../../types/Match";
import { CgCopy } from "react-icons/cg";

type MatchHeaderProps = {
  leagueName: string;
  leagueData?: League;
  onEdit: () => void;
  isGeralPage: boolean;
  match: Match;
  onClick: () => void;
};

export const MatchHeader = ({
  leagueName,
  leagueData,
  onEdit,
  isGeralPage,
  match,
  onClick,
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

    {!isGeralPage && (
      <div className={Styles.wrapper}>
        {match.status === "FINISHED" && !isGeralPage && (
          <div className={Styles.copy} onClick={onClick}>
            <CgCopy />
          </div>
        )}

        <div className={Styles.edit} onClick={onEdit}>
          <LuPencilLine size={20} />
        </div>
      </div>
    )}
  </header>
);
