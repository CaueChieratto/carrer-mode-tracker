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
} from "react-icons/md";
import Card from "../../../../../ui/Card";
import { OverflowText } from "../../../../../components/OverflowText";

type CuriositiesTabProps = {
  season: ClubData;
  career: Career;
};

type RankingType = "goals" | "assists" | "times";

const RankingCard = ({
  title,
  icon,
  data,
  type = "times",
  isMinuteLabel = false,
  accentColor = "#a855f7",
}: {
  title: string;
  icon: React.ReactNode;
  data: { label: string; count: number }[];
  type?: RankingType;
  isMinuteLabel?: boolean;
  accentColor?: string;
}) => {
  const getSuffix = (count: number) => {
    if (type === "goals") return count === 1 ? "gol" : "gols";
    if (type === "assists") return count === 1 ? "assistência" : "assistências";
    return count === 1 ? "vez" : "vezes";
  };

  return (
    <div className={Styles.ranking_card}>
      <div
        className={Styles.ranking_header}
        style={{ borderBottomColor: accentColor }}
      >
        <div className={Styles.header_icon} style={{ color: accentColor }}>
          {icon}
        </div>
        <h3>{title}</h3>
      </div>
      <ul className={Styles.ranking_list}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index} className={Styles.ranking_item}>
              <div className={Styles.ranking_position_wrapper}>
                <span
                  className={Styles.ranking_position}
                  style={{ color: index < 3 ? accentColor : "var(--color)" }}
                >
                  {index + 1}º
                </span>
              </div>

              <div className={Styles.ranking_label_container}>
                <OverflowText
                  text={`${item.label}${isMinuteLabel ? "'" : ""}`}
                  disableDynamicMinWidth
                  className={Styles.ranking_label}
                />
              </div>

              <div className={Styles.ranking_count_badge}>
                <span className={Styles.count_number}>{item.count}</span>
                <span className={Styles.count_suffix}>
                  {getSuffix(item.count)}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className={Styles.empty_ranking}>
            <MdOutlineWarning size={16} /> Dados insuficientes
          </li>
        )}
      </ul>
    </div>
  );
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
            isMinuteLabel={true}
            accentColor="#10b981"
          />

          <RankingCard
            title="Carrascos Reincidentes"
            icon={<MdOutlineWarning />}
            data={rankings.topReincidents}
            type="times"
            accentColor="#f97316"
          />

          <RankingCard
            title="Placares Repetidos"
            icon={<MdOutlineStarBorder />}
            data={rankings.topScores}
            type="times"
            accentColor="#22c55e"
          />

          <RankingCard
            title="Rivais Mais Frequentes"
            icon={<MdPeopleOutline />}
            data={rankings.topOpponents}
            type="times"
            accentColor="#eab308"
          />

          <RankingCard
            title="Minutos de Tensão (Gols Sofridos)"
            icon={<MdAccessTime />}
            data={rankings.topConcedingMinutes}
            type="goals"
            isMinuteLabel={true}
            accentColor="#ef4444"
          />

          <RankingCard
            title="Maiores Carrascos"
            icon={<MdOutlineWarning />}
            data={rankings.topOpponentScorers}
            type="goals"
            accentColor="#f59e0b"
          />

          <RankingCard
            title="Duplas Letais (Rivais)"
            icon={<MdPeopleOutline />}
            data={rankings.topOpponentDuos}
            type="goals"
            accentColor="#ef4444"
          />
        </div>
      </div>
    </div>
  );
};
