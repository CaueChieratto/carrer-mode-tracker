import Styles from "./MatchStatsTab.module.css";
import { StatRow, StatRowProps } from "./components/StatRow";
import {
  CircularStatRow,
  CircularStatRowProps,
} from "./components/CircularStatRow";

type MixedStat =
  | ({ type: "standard" } & StatRowProps)
  | ({ type: "circular" } & CircularStatRowProps);

const STATS_DATA: MixedStat[] = [
  {
    type: "standard",
    label: "Gols esperados (xG)",
    home: 2.8,
    away: 1.8,
    info: true,
  },
  {
    type: "standard",
    label: "Recuperação de bola (segundos)",
    home: 12,
    away: 15,
    suffix: "s",
    reverseWinner: true,
  },
  { type: "standard", label: "Finalizações", home: 20, away: 9 },

  {
    type: "circular",
    label: "Precisão nas finalizações",
    homeSuccess: 9,
    homeTotal: 20,
    awaySuccess: 3,
    awayTotal: 9,
  },

  { type: "standard", label: "Passes", home: 628, away: 317 },

  {
    type: "circular",
    label: "Precisão nos passes",
    homeSuccess: 552,
    homeTotal: 628,
    awaySuccess: 237,
    awayTotal: 317,
  },

  { type: "standard", label: "Divididas", home: 15, away: 12 },
  { type: "standard", label: "Divididas ganhas", home: 10, away: 8 },
  { type: "standard", label: "Interceptações", home: 5, away: 3 },
  { type: "standard", label: "Defesas", home: 4, away: 2 },
  {
    type: "standard",
    label: "Faltas cometidas",
    home: 10,
    away: 9,
    reverseWinner: true,
  },
  {
    type: "standard",
    label: "Impedimentos",
    home: 2,
    away: 1,
    reverseWinner: true,
  },
  { type: "standard", label: "Escanteios", home: 9, away: 3 },
  { type: "standard", label: "Pênaltis", home: 1, away: 0 },
  {
    type: "standard",
    label: "Cartões amarelos",
    home: 2,
    away: 3,
    reverseWinner: true,
  },
  { type: "standard", label: "Cartões vermelhos", home: 1, away: 1 },
];

export const MatchStatsTab = () => {
  const homePossession = 64;
  const awayPossession = 100 - homePossession;

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <h2 className={Styles.title}>Visão geral da partida</h2>

        <div className={Styles.possession_container}>
          <div className={Styles.stat_header}>
            <span className={`${Styles.badge} ${Styles.bg_home}`}>
              {homePossession}%
            </span>

            <span className={Styles.label_wrapper}>Posse de bola</span>

            <span className={`${Styles.badge} ${Styles.bg_away}`}>
              {awayPossession}%
            </span>
          </div>

          <div className={Styles.possession_bar_wrapper}>
            <div
              className={Styles.bg_home}
              style={{ width: `${homePossession}%` }}
            />
            <div
              className={Styles.bg_away}
              style={{ width: `${awayPossession}%` }}
            />
          </div>
        </div>

        {STATS_DATA.map((stat) => {
          if (stat.type === "circular") {
            const { ...props } = stat;
            return <CircularStatRow key={stat.label} {...props} />;
          }

          const { ...props } = stat;
          return <StatRow key={stat.label} {...props} />;
        })}
      </div>
    </div>
  );
};
