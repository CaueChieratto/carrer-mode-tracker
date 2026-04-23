import Card from "../../../../ui/Card";
import Titles from "../../GeneralTab.module.css";
import Styles from "./MatchStatsCard.module.css";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Career } from "../../../../common/interfaces/Career";
import { useMatchStats } from "./hooks/UseMatchStats";

type MatchStatsCardProps = {
  season: ClubData;
  career: Career;
};

const MatchStatsCard = ({ season, career }: MatchStatsCardProps) => {
  const { content } = useMatchStats(career, season);

  if (content.length === 0) {
    return null;
  }

  return (
    <Card className={Titles.card}>
      <div className={Titles.container_card}>
        <h1 className={Titles.h1}>Estatísticas da Equipe</h1>

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
