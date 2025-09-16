import Styles from "./StatisticsTable_Title.module.css";
import { RiCloseCircleLine } from "react-icons/ri";
import { UseOverallColor } from "../../common/hooks/Colors/GetOverallColor";
import { GrExpand } from "react-icons/gr";
import { GrContract } from "react-icons/gr";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

type StatisticsTable_TitleProps = {
  type: "info" | "expand" | "league";
  expand?: boolean;
  isPlayer?: boolean;
  setExpand?: Dispatch<SetStateAction<boolean>>;
  playerName?: string;
  overall?: number;
  leagueName?: string;
  leagueImage?: string;
  icon?: ReactNode;
};

const StatisticsTable_Title = ({
  type,
  expand,
  isPlayer,
  overall,
  playerName,
  leagueName,
  leagueImage,
  icon,
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
      leagueImage: leagueImage,
      leagueName: leagueName,
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
            className={
              !isPlayer ? Styles.container_name_over : Styles.container_season
            }
            onTouchMove={(e) => e.stopPropagation()}
          >
            <h3 className={!isPlayer ? Styles.name : Styles.season}>
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
        const {
          name: expandName,
          iconClose,
          iconExpand,
          leagueImage,
          leagueName,
        } = content.expand;
        return (
          <div
            className={
              !isPlayer ? Styles.container_name_over : Styles.container_season
            }
            onTouchMove={(e) => e.stopPropagation()}
          >
            <h3 className={Styles.expand_container}>
              {icon ? (
                <>
                  {icon} {expand ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </>
              ) : isPlayer ? (
                <>
                  <img
                    src={leagueImage}
                    alt={leagueName}
                    className={Styles.logo}
                  />
                  {expand ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </>
              ) : (
                <>
                  {expandName}
                  {expand ? iconExpand : iconClose}
                </>
              )}
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
