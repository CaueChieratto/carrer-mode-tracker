import Card from "../../../../ui/Card";
import Titles from "../../GeneralTab.module.css";
import Styles from "./CompetitionsCard.module.css";
import { ClubData } from "../../../../common/interfaces/club/clubData";

type CompetitionsCardProps = {
  season: ClubData;
};

const CompetitionsCard = ({ season }: CompetitionsCardProps) => {
  const leagues = season?.leagues || [];

  return (
    <Card className={Titles.card}>
      <div className={Titles.container_card}>
        <h1 className={Titles.h1}>Competições</h1>

        <div className={Styles.container_leagues}>
          {leagues.map((league) => (
            <div key={league.name} className={Styles.league_item}>
              <div className={Styles.background_img}>
                <img
                  src={league.logo}
                  alt={`Logo da competição ${league.name}`}
                  className={Styles.logo}
                />
              </div>
              <span className={Styles.name}>{league.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CompetitionsCard;
