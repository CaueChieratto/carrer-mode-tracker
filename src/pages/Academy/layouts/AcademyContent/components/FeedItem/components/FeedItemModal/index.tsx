import { createPortal } from "react-dom";
import {
  FaArrowRight,
  FaTrophy,
  FaStar,
  FaRocket,
  FaHandshake,
  FaCheckCircle,
  FaMapSigns,
} from "react-icons/fa";
import Styles from "./FeedItemModal.module.css";
import { FeedEvent } from "../../types/FeedEvent";

export type FeedItemModalProps = {
  title: string;
  subtitle: string;
  socialSubtitle?: string;
  time: string;
  type: string;
  details?: FeedEvent["details"];
  onClose: (e?: React.MouseEvent) => void;
  clubName: string;
};

export const FeedItemModal = ({
  title,
  subtitle,
  socialSubtitle,
  time,
  type,
  details,
  clubName,
  onClose,
}: FeedItemModalProps) => {
  const modalText = socialSubtitle || subtitle;

  const renderSocialContent = () => {
    if (type === "match" && details?.lineup) {
      const playersWithStats = details.lineup.filter(
        (p) => p.rating !== null || (p.goals && p.goals > 0),
      );

      const isChamp = details.tournamentResult === "Campeão";

      return (
        <div className={Styles.matchDetails}>
          {details.tournamentResult && (
            <div
              className={`${Styles.socialCard} ${isChamp ? Styles.goldCard : ""}`}
            >
              <FaTrophy
                className={Styles.bigIcon}
                style={{ fontSize: "36px", marginBottom: "8px" }}
              />
              <div className={Styles.tournResult} style={{ fontSize: "20px" }}>
                {details.tournamentResult.toUpperCase()}
              </div>
            </div>
          )}

          <div className={Styles.scoreBoard}>
            <span>{clubName}</span>
            <span>
              {details.userGoals ?? 0} x {details.opponentGoals ?? 0}
            </span>
            <span>{details.opponentTeam}</span>
          </div>

          {playersWithStats.length > 0 && (
            <div className={Styles.lineupList}>
              <strong>Destaques da Partida:</strong>
              {playersWithStats.map((player) => {
                const goals = player.goals || 0;
                const rating = player.rating !== null ? player.rating : "-";

                return (
                  <div key={player.playerName} className={Styles.lineupItem}>
                    <span>{player.playerName}</span>
                    <div className={Styles.playerStats}>
                      <span className={Styles.rating}>Nota: {rating}</span>
                      {goals > 0 && (
                        <span className={Styles.goals}>⚽ {goals}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (type === "tournament" && details) {
      const isChamp = details.tournamentResult === "Campeão";
      return (
        <div
          className={`${Styles.socialCard} ${isChamp ? Styles.goldCard : ""}`}
        >
          <FaTrophy className={Styles.bigIcon} />
          <div className={Styles.tournResult}>
            {details.tournamentResult?.toUpperCase()}
          </div>
        </div>
      );
    }

    if (type === "status" && details) {
      const isPromoted = details.newValue === "promoted";
      const isAcademy = details.newValue === "academy";
      const isReleased = details.newValue === "released";

      let icon = <FaStar />;
      let text = "ATUALIZAÇÃO DE STATUS";

      if (isPromoted) {
        icon = <FaRocket />;
        text = "PROMOVIDO AO PROFISSIONAL!";
      } else if (isAcademy) {
        icon = <FaStar />;
        text = "NOVO TALENTO NA BASE!";
      } else if (isReleased) {
        icon = <FaHandshake />;
        text = "DISPENSADO DA BASE";
      }

      return (
        <div className={Styles.socialCard}>
          <div className={Styles.statusIcon}>{icon}</div>
          <div className={Styles.statusText}>{text}</div>
        </div>
      );
    }

    if (type === "position" && details?.oldValue && details?.newValue) {
      return (
        <div className={Styles.socialCard}>
          <div className={Styles.statTypeTag}>NOVA POSIÇÃO</div>
          <FaMapSigns className={Styles.positionIcon} />
          <div className={Styles.evolutionRow}>
            <span className={Styles.oldPosition}>{details.oldValue}</span>
            <FaArrowRight className={Styles.socialArrow} />
            <span className={Styles.newPosition}>{details.newValue}</span>
          </div>
          <div className={Styles.socialDesc}>{modalText}</div>
        </div>
      );
    }

    if (
      ["overall", "potential", "age", "height", "weight"].includes(type) &&
      details?.oldValue !== undefined &&
      details?.newValue !== undefined
    ) {
      const oldV = details.oldValue;
      const newV = details.newValue;
      let diff: number | null = null;

      if (typeof oldV === "number" && typeof newV === "number") {
        diff = newV - oldV;
      } else if (!isNaN(Number(oldV)) && !isNaN(Number(newV))) {
        diff = Number(newV) - Number(oldV);
      }

      const getLabel = (t: string) => {
        const map: Record<string, string> = {
          overall: "OVERALL",
          potential: "POTENCIAL",
          age: "IDADE",
          height: "ALTURA",
          weight: "PESO",
        };
        return map[t] || t.toUpperCase();
      };

      return (
        <div className={Styles.socialCard}>
          <div className={Styles.statTypeTag}>{getLabel(type)}</div>
          <div className={Styles.evolutionRow}>
            <span className={Styles.oldSocialStat}>{oldV}</span>
            <FaArrowRight className={Styles.socialArrow} />
            <span className={Styles.newSocialStat}>{newV}</span>
          </div>

          {diff !== null && diff !== 0 && (
            <div
              className={`${Styles.diffBadge} ${
                diff > 0 ? Styles.diffPos : Styles.diffNeg
              }`}
            >
              {diff > 0 ? `+${diff}` : diff}
              {type === "weight" ? "kg" : type === "height" ? "cm" : ""}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={Styles.socialCard}>
        <div className={Styles.statusIcon}>
          <FaCheckCircle />
        </div>
        <div className={Styles.genericText}>{modalText}</div>
      </div>
    );
  };

  const getModalTitle = () => {
    if (type === "match") return "Resumo da Partida";
    if (type === "tournament") return "Fim de Torneio";
    if (type === "status") return "Novo Status";
    if (type === "position") return "Readequação Tática";
    if (["overall", "potential", "age", "height", "weight"].includes(type))
      return "Atualização do Atleta";

    return "Detalhes do Evento";
  };

  return createPortal(
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.modalHeader}>
          <span className={Styles.ttTitle}>{getModalTitle()}</span>
          <span className={Styles.ttValue}>{title}</span>
        </div>
        <div className={Styles.dynamicContent}>{renderSocialContent()}</div>
        <span className={Styles.ttDate}>{time}</span>
      </div>
    </div>,
    document.body,
  );
};
