import { FaHistory, FaPlus, FaTrophy, FaUsers } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Career } from "../../../../../common/interfaces/Career";
import Button from "../../../../../components/Button";
import { FeedItem } from "../components/FeedItem";
import { PlayerItem } from "../components/Player/components/PlayerItem";
import { AcademyPlayers } from "../interfaces/AcademyPlayers/AcademyPlayers";
import { SkeletonButton, SkeletonItem } from "../ui/SkeletonCard";
import { IconType } from "react-icons";
import Styles from "../AcademyContent.module.css";
import { AcademyTournaments } from "../interfaces/AcademyTournaments/AcademyTournaments";
import { TournamentListItem } from "../components/Tournament/components/TournamentListItem";
import { FeedEvent } from "../components/FeedItem/types/FeedEvent";

export type configProps = {
  career: Career;
  playersAcademy: AcademyPlayers[];
  tournamentsAcademy: AcademyTournaments[];
  feedData: FeedEvent[];
  activeCardIndex: number | null;
  selectedPlayerId: string | null;
  selectedTournamentId: string | null;
  onAddPlayerClick: () => void;
  onAddTournamentClick: () => void;
  onPromotePlayerClick: () => void;
  onPlayerClick: (playerId: string) => void;
  onTournamentClick: (id: string) => void;
  playerSort: string;
  setPlayerSort: (val: string) => void;
  tournamentSort: string;
  setTournamentSort: (val: string) => void;
};

export type DashboardCardConfig = {
  Icon: IconType;
  title: string;
  actionText?: string;
  skeletonContent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sortOptions?: { value: string; label: string }[];
  currentSort?: string;
  onSortChange?: (value: string) => void;
};

export const getConfig = ({
  career,
  playersAcademy,
  feedData,
  activeCardIndex,
  selectedPlayerId,
  tournamentsAcademy,
  selectedTournamentId,
  onAddPlayerClick,
  onAddTournamentClick,
  onPromotePlayerClick,
  onPlayerClick,
  onTournamentClick,
  playerSort,
  setPlayerSort,
  tournamentSort,
  setTournamentSort,
}: configProps) => {
  const playersSkeletonCount =
    playersAcademy.length > 0
      ? activeCardIndex === 0
        ? playersAcademy.length
        : Math.min(playersAcademy.length, 3)
      : 3;

  const clubName = career.clubName;

  return [
    {
      Icon: FaUsers,
      title: career.academy!.nickname,
      actionText: "Ver todos",
      sortOptions: [
        { value: "arrival-desc", label: "Padrão" },
        { value: "overall-desc", label: "Por Overall" },
        { value: "potential-desc", label: "Por Potencial" },
        { value: "age-asc", label: "Por Idade" },
      ],
      currentSort: playerSort,
      onSortChange: setPlayerSort,
      skeletonContent: (
        <>
          {Array.from({ length: playersSkeletonCount }).map((_, i) => (
            <SkeletonItem key={i} index={i} />
          ))}
        </>
      ),
      children: (
        <div className={Styles.wrapper}>
          {playersAcademy.length > 0 ? (
            (activeCardIndex === 0 || selectedPlayerId !== null
              ? playersAcademy
              : playersAcademy.slice(0, 3)
            ).map((player) => (
              <PlayerItem
                key={player.id}
                playersAcademy={player}
                onClick={() => onPlayerClick(player.id)}
                isSelected={player.id === selectedPlayerId}
              />
            ))
          ) : (
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-tertiary)",
                textAlign: "center",
                margin: "10px 0",
              }}
            >
              Nenhum jogador na base.
            </p>
          )}
        </div>
      ),
    },
    {
      Icon: FaTrophy,
      title: career.academy!.tournament,
      actionText: "Ver todos",
      sortOptions: [
        { value: "date-asc", label: "Padrão" },
        { value: "matches-desc", label: "Por Partidas" },
      ],
      currentSort: tournamentSort,
      onSortChange: setTournamentSort,
      skeletonContent: (
        <>
          <SkeletonItem index={0} />
          <SkeletonItem index={1} />
          <SkeletonItem index={2} />
        </>
      ),
      children: (
        <div className={Styles.wrapper}>
          {tournamentsAcademy.length > 0 ? (
            (activeCardIndex === 1 || selectedTournamentId !== null
              ? tournamentsAcademy
              : tournamentsAcademy.slice(0, 3)
            ).map((tourn) => (
              <TournamentListItem
                key={tourn.id}
                tournament={tourn}
                onClick={() => onTournamentClick(tourn.id)}
                isSelected={tourn.id === selectedTournamentId}
              />
            ))
          ) : (
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-tertiary)",
                textAlign: "center",
                margin: "10px 0",
              }}
            >
              Nenhum torneio cadastrado.
            </p>
          )}
        </div>
      ),
    },
    {
      Icon: FaHistory,
      title: "Feed de Atividades",
      actionText: "Ver feed completo",
      skeletonContent: (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonItem key={i} index={i} />
          ))}
        </>
      ),
      children: (
        <div className={Styles.wrapperFeed}>
          {feedData.length > 0 ? (
            (activeCardIndex === 2 ? feedData : feedData.slice(0, 3)).map(
              (update) => {
                return (
                  <FeedItem
                    key={update.id}
                    id={update.id}
                    title={update.title}
                    subtitle={update.subtitle}
                    type={update.type}
                    time={update.time}
                    details={update.details}
                    clubName={clubName}
                  />
                );
              },
            )
          ) : (
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-tertiary)",
                textAlign: "center",
                margin: "10px 0",
              }}
            >
              Nenhum evento registrado ainda.
            </p>
          )}
        </div>
      ),
    },
    {
      Icon: HiOutlineDocumentReport,
      title: "Ações Rápidas",
      className: Styles.actionsWidget,
      skeletonContent: (
        <>
          <SkeletonButton />
          <SkeletonButton />
          <SkeletonButton />
        </>
      ),
      children: (
        <div className={Styles.wrapper}>
          <Button className={Styles.actionBtn} onClick={onAddPlayerClick}>
            <FaPlus /> Adicionar Jogador
          </Button>
          <Button className={Styles.actionBtn} onClick={onAddTournamentClick}>
            <FaTrophy /> Adicionar Torneio
          </Button>
          <Button
            className={`${Styles.actionBtn} ${Styles.promoteBtn}`}
            onClick={onPromotePlayerClick}
          >
            Promover ao Profissional
          </Button>
        </div>
      ),
    },
  ];
};
