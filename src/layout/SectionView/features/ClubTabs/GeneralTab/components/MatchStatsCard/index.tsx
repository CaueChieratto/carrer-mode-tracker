import Card from "../../../../../../../ui/Card";
import Titles from "../../GeneralTab.module.css";
import Styles from "./MatchStatsCard.module.css";
import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import { Career } from "../../../../../../../common/interfaces/Career";
import { useMatchStats } from "./hooks/UseMatchStats";
import { BsCopy } from "react-icons/bs";
import { Copy } from "../../../../../../../common/utils/Copy";
import { buildMatchStatsCopyText } from "./helpers/buildMatchStatsCopyText";

type MatchStatsCardProps = {
  season: ClubData;
  career: Career;
};

const MatchStatsCard = ({ season, career }: MatchStatsCardProps) => {
  const { content } = useMatchStats(career, season);

  if (content.length === 0) {
    return null;
  }

  const copyClubStats = async () => {
    const text = buildMatchStatsCopyText(content);
    await Copy(text, "Estatísticas copiadas com sucesso!");
  };

  return (
    <Card className={Titles.card}>
      <div className={Styles.container_card}>
        <div className={Styles.wrapper}>
          <h1 className={Titles.h1}> Estatísticas da Equipe</h1>
          <span className={Styles.icon} onClick={copyClubStats}>
            <BsCopy />
          </span>
        </div>

        <div className={Styles.categories_container}>
          {content.map((category, index) => (
            <div key={index} className={Styles.category_section}>
              <h2 className={Styles.category_title}>{category.title}</h2>

              <div className={Styles.list_stats}>
                {category.stats.map((stat, statIndex) => (
                  <div key={statIndex} className={Styles.stat_item}>
                    <span className={Styles.stat_name}>{stat.name}</span>
                    <span className={Styles.stat_value}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MatchStatsCard;
