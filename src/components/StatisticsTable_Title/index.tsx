import Styles from "./StatisticsTable_Title.module.css";
import { RiCloseCircleLine } from "react-icons/ri";
import { UseOverallColor } from "../../common/hooks/Colors/GetOverallColor";
import { GrExpand } from "react-icons/gr";
import { GrContract } from "react-icons/gr";
import { Dispatch, SetStateAction } from "react";

type StatisticsTable_TitleProps = {
  type: "info" | "expand" | "league";
  expand?: boolean;
  setExpand?: Dispatch<SetStateAction<boolean>>;
  playerName?: string;
  overall?: number;
  leagueName?: string;
  leagueImage?: string;
};

const StatisticsTable_Title = ({
  type,
  expand,
  overall,
  playerName,
  leagueName,
  leagueImage,
}: StatisticsTable_TitleProps) => {
  const content = {
    info: {
      name: playerName,
      overall: overall,
      icon: <RiCloseCircleLine />,
    },
    expand: {
      name: "Expandir",
      iconExpand: <GrExpand />,
      iconClose: <GrContract />,
    },
    league: {
      leagueImage: leagueImage,
      name: leagueName,
    },
  };

  const renderContent = () => {
    switch (type) {
      case "info": {
        const { name, overall } = content.info;
        return (
          <div
            className={Styles.container_name_over}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <h3 className={Styles.name}>
              {name}
              <span
                className={Styles.over}
                style={{ color: UseOverallColor(overall ?? 0) }}
              >
                {overall}
              </span>
            </h3>
          </div>
        );
      }

      case "expand": {
        const { name: expandName, iconClose, iconExpand } = content.expand;
        return (
          <div
            className={Styles.container_name_over}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <h3 className={Styles.expand_container}>
              {expandName}
              {expand ? iconExpand : iconClose}
            </h3>
          </div>
        );
      }

      case "league": {
        const { leagueImage, name: leagueName } = content.league;
        return (
          <div
            className={Styles.container_league}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className={Styles.league_container}>
              <img
                src={leagueImage}
                alt={leagueName}
                className={Styles.league_image}
              />
              <span className={Styles.league_name}>{leagueName}</span>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default StatisticsTable_Title;
