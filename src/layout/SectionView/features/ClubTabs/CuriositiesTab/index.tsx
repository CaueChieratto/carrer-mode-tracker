import { useLocation } from "react-router-dom";
import { Career } from "../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { ContainerClubContent } from "../../../../../components/ContainerClubContent";
import NoStatsMessage from "../../../../../components/NoStatsMessage";
import { useCuriosities } from "./hooks/useCuriosities";
import Styles from "./CuriositiesTab.module.css";
import {
  MdAccessTime,
  MdPeopleOutline,
  MdOutlineWarning,
  MdOutlineStarBorder,
  MdSportsSoccer,
  MdTimer,
} from "react-icons/md";
import Card from "../../../../../ui/Card";
import { OverflowText } from "../../../../../components/OverflowText";
import { RankingCard } from "./components/RankingCard";

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
          <RankingCard
            title="Jogadores Decisivos (Gols da Vitória)"
            icon={<MdOutlineStarBorder />}
            data={rankings.topDecisivePlayers}
            type="goals"
            accentColor="#eab308"
          />
          <RankingCard
            title="Especialistas em Abrir o Placar"
            icon={<MdSportsSoccer />}
            data={rankings.topOpeners}
            type="goals"
            accentColor="#f97316"
          />
          <RankingCard
            title="Reis da Assistência (Em Vitórias)"
            icon={<MdPeopleOutline />}
            data={rankings.topWinAssistants}
            type="assists"
            accentColor="#3b82f6"
          />
          <RankingCard
            title="Especialistas dos Acréscimos (90'+)"
            icon={<MdTimer />}
            data={rankings.topStoppageTimeExperts}
            type="goals"
            accentColor="#8b5cf6"
          />
          <RankingCard
            title="Duplas Dinâmicas"
            icon={<MdPeopleOutline />}
            data={rankings.topTeamDuos}
            type="goals"
            accentColor="#8b5cf6"
          />
          <RankingCard
            title="Jogador & Minuto Letal"
            icon={<MdOutlineStarBorder />}
            data={rankings.topPlayerGoalMinutes}
            type="goals"
            accentColor="#10b981"
          />
          <RankingCard
            title="Assistente & Minuto Letal"
            icon={<MdPeopleOutline />}
            data={rankings.topPlayerAssistMinutes}
            type="assists"
            accentColor="#3b82f6"
          />
          <RankingCard
            title="Minutos Letais (Gols Pró)"
            icon={<MdAccessTime />}
            data={rankings.topScoringMinutes}
            type="goals"
            isMinuteLabel
            accentColor="#10b981"
          />

          <RankingCard
            title="Intervalos Mais Perigosos"
            icon={<MdOutlineWarning />}
            data={rankings.dangerousIntervals}
            type="goals"
            accentColor="#f43f5e"
          />
          <RankingCard
            title="Minutos de Tensão (Gols Sofridos)"
            icon={<MdAccessTime />}
            data={rankings.topConcedingMinutes}
            type="goals"
            isMinuteLabel
            accentColor="#ef4444"
          />

          <RankingCard
            title="Rivais Mais Frequentes"
            icon={<MdPeopleOutline />}
            data={rankings.topOpponents}
            type="times"
            accentColor="#eab308"
          />
          <RankingCard
            title="Maiores Vítimas (Gols Marcados)"
            icon={<MdOutlineStarBorder />}
            data={rankings.topVictims}
            type="goals"
            accentColor="#22c55e"
          />
          <RankingCard
            title="Sacos de Pancada (Saldo de Gols)"
            icon={<MdOutlineStarBorder />}
            data={rankings.topPunchingBags}
            type="goals"
            accentColor="#14b8a6"
          />

          <RankingCard
            title="Times Pedras no Sapato (Gols Sofridos)"
            icon={<MdOutlineWarning />}
            data={rankings.topOpponentTeamsScorers}
            type="goals"
            accentColor="#ef4444"
          />
          <RankingCard
            title="Maiores Carrascos (Jogadores)"
            icon={<MdOutlineWarning />}
            data={rankings.topOpponentScorers}
            type="goals"
            accentColor="#f59e0b"
          />
          <RankingCard
            title="Carrascos Reincidentes"
            icon={<MdOutlineWarning />}
            data={rankings.topReincidents}
            type="times"
            accentColor="#f97316"
          />
          <RankingCard
            title="Duplas Letais (Rivais)"
            icon={<MdPeopleOutline />}
            data={rankings.topOpponentDuos}
            type="goals"
            accentColor="#ef4444"
          />

          <RankingCard
            title="Placares Repetidos"
            icon={<MdOutlineStarBorder />}
            data={rankings.topScores}
            type="times"
            accentColor="#3b82f6"
          />
        </div>
      </div>
    </div>
  );
};
