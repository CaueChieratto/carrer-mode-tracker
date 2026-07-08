import { useLocation } from "react-router-dom";
import { Career } from "../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { ContainerClubContent } from "../../../../../components/ContainerClubContent";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import { useCuriosities } from "./hooks/useCuriosities";
import Styles from "./CuriositiesTab.module.css";
import Card from "../../../../../ui/Card";
import { OverflowText } from "../../../../../components/OverflowText";
import { RankingCard } from "./components/RankingCard";
import { rankingCards } from "./constants";

type CuriositiesTabProps = {
  season: ClubData;
  career: Career;
};

export const CuriositiesTab = ({ season, career }: CuriositiesTabProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");
  const { highlights, rankings } = useCuriosities(career, season, isGeralPage);

  if (
    !rankings ||
    (highlights.length === 0 && rankings.topScoringMinutes.length === 0)
  ) {
    return (
      <ContainerClubContent>
        <NoStatsMessage
          textOne="Ainda não há dados suficientes"
          textTwo="Adicione partidas com gols e assistências para gerar os rankings."
        />
      </ContainerClubContent>
    );
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.section}>
        <h3 className={Styles.section_title}>Destaques Gerais</h3>
        <Card className={Styles.highlights_card}>
          {highlights.map((stat, index) => (
            <div key={index} className={Styles.highlight_item}>
              <span className={Styles.highlight_label}>{stat.label}</span>
              <div className={Styles.overflow_wrapper}>
                <OverflowText
                  text={stat.value}
                  disableDynamicMinWidth
                  className={Styles.highlight_value}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div className={Styles.section}>
        <h3 className={Styles.section_title}>Rankings</h3>
        <div className={Styles.rankings_grid}>
          {rankingCards.map((card) => (
            <RankingCard
              key={card.key}
              title={card.title}
              icon={card.icon}
              data={rankings[card.key]}
              type={card.type}
              accentColor={card.accentColor}
              isMinuteLabel={card.isMinuteLabel}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
