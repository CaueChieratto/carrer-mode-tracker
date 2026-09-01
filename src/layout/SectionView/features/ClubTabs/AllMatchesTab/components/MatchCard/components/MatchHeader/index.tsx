import { LuPencilLine } from "react-icons/lu";
import { League } from "../../../../../../../../../common/interfaces/League";
import Styles from "./MatchHeader.module.css";
import { Match } from "../../../../../../../../../common/interfaces/Match";
import { CgCopy } from "react-icons/cg";
import { useMatchesContext } from "../../../../contexts/MatchesContext";

type MatchHeaderProps = {
  leagueName: string;
  leagueData?: League;
  onEdit: () => void;
  match: Match;
  onClick: () => void;
};

export const MatchHeader = ({
  leagueName,
  leagueData,
  onEdit,
  match,
  onClick,
}: MatchHeaderProps) => {
  const { isGeralPage } = useMatchesContext();

  return (
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
};
