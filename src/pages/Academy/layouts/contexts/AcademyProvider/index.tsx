import { ReactNode, useEffect, useState } from "react";
import { Career } from "../../../../../common/interfaces/Career";
import { getConfig } from "../../AcademyContent/config";
import { useAcademyActions } from "../../AcademyContent/hooks/useAcademyActions";
import { useAcademyPlayers } from "../../AcademyContent/hooks/useAcademyPlayers";
import { useAcademyViewState } from "../../AcademyContent/hooks/useAcademyViewState";
import { AcademyContext } from "../AcademyContext";
import { useAcademyTournaments } from "../../AcademyContent/hooks/useAcademyTournaments";
import {
  PlayerSortOption,
  useSortedPlayers,
} from "../../AcademyContent/hooks/Sorts/useSortedPlayers";
import {
  TournamentSortOption,
  useSortedTournaments,
} from "../../AcademyContent/hooks/Sorts/useSortedTournaments";
import { useAcademyFeed } from "../../AcademyContent/components/FeedItem/hooks/useAcademyFeed";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../../../common/services/Firebase";
import { getAsyncUser } from "../../AcademyContent/services/AcademyService/helpers";

type ProviderProps = {
  children: ReactNode;
  career: Career;
  seasonId: string;
};

export const AcademyProvider = ({
  children,
  career,
  seasonId,
}: ProviderProps) => {
  const [allCareers, setAllCareers] = useState<Career[]>([career]);

  useEffect(() => {
    const fetchAllCareers = async () => {
      try {
        const user = await getAsyncUser();

        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/careers`),
        );
        const careers = querySnapshot.docs.map((doc) => doc.data() as Career);
        setAllCareers(careers);
      } catch (error) {
        console.error("Erro ao carregar todas as carreiras:", error);
      }
    };

    fetchAllCareers();
  }, []);

  const {
    playersAcademy: rawPlayers,
    allPlayersAcademy,
    setPlayersAcademy,
    isLoading,
    refetchPlayers,
  } = useAcademyPlayers(career.id, seasonId);

  const {
    tournamentsAcademy: rawTournaments,
    setTournamentsAcademy,
    refetchTournaments,
  } = useAcademyTournaments(career.id, seasonId);

  const {
    sortedPlayers: playersAcademy,
    playerSort,
    setPlayerSort,
  } = useSortedPlayers(rawPlayers, career);

  const {
    sortedTournaments: tournamentsAcademy,
    tournamentSort,
    setTournamentSort,
  } = useSortedTournaments(rawTournaments);

  const {
    activeCardIndex,
    setActiveCardIndex,
    isAddingPlayer,
    setIsAddingPlayer,
    isAddingTournament,
    setIsAddingTournament,
    isPromotingPlayer,
    setIsPromotingPlayer,
    selectedPlayerId,
    playerClick,
    tournamentClick,
    back,
    isFocusedViewActive,
    isAnimationDisabled,
    selectedTournamentId,
    setSelectedTournamentId,
  } = useAcademyViewState(career.id);

  const {
    handlePlayerClick,
    handleTournamentClick,
    updatePlayer,
    deletePlayer,
    releasePlayer,
    updateTournament,
    deleteTournament,
  } = useAcademyActions({
    careerId: career.id,
    seasonId,
    selectedPlayerId,
    selectedTournamentId,
    refetchPlayers,
    refetchTournaments,
    setPlayersAcademy,
    setTournamentsAcademy,
    playerClick,
    tournamentClick,
    back,
  });

  const dynamicFeedData = useAcademyFeed(
    career,
    allPlayersAcademy,
    tournamentsAcademy,
  );

  const selectedPlayer = playersAcademy.find((p) => p.id === selectedPlayerId);
  const selectedTournament = tournamentsAcademy.find(
    (t) => t.id === selectedTournamentId,
  );

  const dashboardCards = getConfig({
    career,
    playersAcademy,
    tournamentsAcademy,
    feedData: dynamicFeedData,
    activeCardIndex,
    selectedPlayerId,
    selectedTournamentId,
    playerSort,
    tournamentSort,
    onAddPlayerClick: () => setIsAddingPlayer(true),
    onAddTournamentClick: () => setIsAddingTournament(true),
    onPromotePlayerClick: () => setIsPromotingPlayer(true),
    onPlayerClick: handlePlayerClick,
    onTournamentClick: handleTournamentClick,
    setPlayerSort: (val: string) => setPlayerSort(val as PlayerSortOption),
    setTournamentSort: (val: string) =>
      setTournamentSort(val as TournamentSortOption),
  });

  return (
    <AcademyContext.Provider
      value={{
        career,
        allCareers,
        seasonId,
        playersAcademy,
        allPlayersAcademy,
        tournamentsAcademy,
        isLoading,
        isAddingPlayer,
        isAddingTournament,
        isPromotingPlayer,
        activeCardIndex,
        selectedPlayer,
        selectedTournament,
        dashboardCards,
        isAnimationDisabled,
        selectedTournamentId,
        setSelectedTournamentId,
        isFocusedViewActive,
        setIsAddingPlayer,
        setIsAddingTournament,
        setIsPromotingPlayer,
        setActiveCardIndex,
        onUpdatePlayer: updatePlayer,
        onDeletePlayer: deletePlayer,
        onReleasePlayer: releasePlayer,
        onUpdateTournament: updateTournament,
        onDeleteTournament: deleteTournament,
        refetchTournaments,
        refetchPlayers,
        back,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};
