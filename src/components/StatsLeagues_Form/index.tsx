import { HiPencilSquare } from "react-icons/hi2";
import { LeagueStats } from "../../common/interfaces/playersStats/leagueStats";
import Styles from "./StatsLeagues_Form.module.css";
import ContainerIcon from "../ContainerIcon";
import classNames from "classnames";

type StatsLeagues_FormProps = {
  leagues: LeagueStats[];
  clubColor: string;
  isGoalkeeper?: boolean;
  onLeagueClick?: (league: LeagueStats) => void;
  originalLeagueNameToEdit?: string | null;
};

const StatsLeagues_Form = ({
  leagues,
  clubColor,
  isGoalkeeper,
  onLeagueClick,
  originalLeagueNameToEdit,
}: StatsLeagues_FormProps) => {
  return (
    <div className={Styles.container}>
      {leagues.map((league, index) => (
        <div
          key={`${league.leagueName}-${index}`}
          className={classNames(Styles.league_container, {
            [Styles.hidden]: league.leagueName === originalLeagueNameToEdit,
          })}
        >
          <h2
            className={Styles.section_title}
            onClick={() => onLeagueClick?.(league)}
          >
            <div className={Styles.img_name_league}>
              <img src={league.leagueImage} className={Styles.img} />
              {league.leagueName}
              <ContainerIcon className={Styles.icon}>
                <HiPencilSquare />
              </ContainerIcon>
            </div>
          </h2>
          <div className={Styles.form_section}>
            <p className={Styles.stats} style={{ backgroundColor: clubColor }}>
              Jogos: {league.stats.games}
            </p>
            {isGoalkeeper ? (
              <p
                className={Styles.stats}
                style={{ backgroundColor: clubColor }}
              >
                JSG: {league.stats.cleanSheets}
              </p>
            ) : (
              <p
                className={Styles.stats}
                style={{ backgroundColor: clubColor }}
              >
                Gols: {league.stats.goals}
              </p>
            )}
            <p className={Styles.stats} style={{ backgroundColor: clubColor }}>
              Assist: {league.stats.assists}
            </p>
            <p className={Styles.stats} style={{ backgroundColor: clubColor }}>
              Nota: {league.stats.rating}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsLeagues_Form;
