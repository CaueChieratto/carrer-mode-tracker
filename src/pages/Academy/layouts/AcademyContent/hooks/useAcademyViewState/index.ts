import { useState, useEffect } from "react";

export const useAcademyViewState = (careerId: string) => {
  const storageKey = `@academy_viewState_${careerId}`;

  const getInitialState = () => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  };

  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(() => {
    return getInitialState().activeCardIndex ?? null;
  });

  const [isAddingPlayer, setIsAddingPlayer] = useState<boolean>(() => {
    return getInitialState().isAddingPlayer ?? false;
  });

  const [isAddingTournament, setIsAddingTournament] = useState<boolean>(() => {
    return getInitialState().isAddingTournament ?? false;
  });

  const [isPromotingPlayer, setIsPromotingPlayer] = useState<boolean>(() => {
    return getInitialState().isPromotingPlayer ?? false;
  });

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
    () => {
      const savedState = getInitialState();
      if (savedState.selectedPlayerId) return savedState.selectedPlayerId;
      return null;
    },
  );

  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(() => {
    const savedState = getInitialState();
    if (savedState.selectedTournamentId) return savedState.selectedTournamentId;
    return null;
  });

  const [isAnimationDisabled, setIsAnimationDisabled] = useState(false);

  useEffect(() => {
    const stateToSave = {
      activeCardIndex,
      isAddingPlayer,
      isAddingTournament,
      isPromotingPlayer,
      selectedTournamentId,
      selectedPlayerId,
    };

    const hasActiveState =
      activeCardIndex !== null ||
      isAddingPlayer ||
      isAddingTournament ||
      isPromotingPlayer ||
      selectedPlayerId !== null ||
      selectedTournamentId !== null;

    if (hasActiveState) {
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [
    activeCardIndex,
    isAddingPlayer,
    isAddingTournament,
    isPromotingPlayer,
    selectedPlayerId,
    selectedTournamentId,
    storageKey,
  ]);

  const tournamentClick = (id: string, forceOpen?: boolean) => {
    setIsAnimationDisabled(true);
    setSelectedTournamentId((prev) => {
      const next = forceOpen ? id : prev === id ? null : id;
      return next;
    });
  };

  const playerClick = (id: string, forceOpen?: boolean) => {
    setIsAnimationDisabled(true);
    setSelectedPlayerId((prev) => {
      if (forceOpen) return id;
      return prev === id ? null : id;
    });
  };

  const back = () => {
    setIsAnimationDisabled(false);
    if (selectedPlayerId !== null || selectedTournamentId !== null) {
      setSelectedPlayerId(null);
      setSelectedTournamentId(null);
      return;
    }

    if (isAddingPlayer) setIsAddingPlayer(false);
    else if (isAddingTournament) setIsAddingTournament(false);
    else if (isPromotingPlayer) setIsPromotingPlayer(false);
    else if (activeCardIndex !== null) setActiveCardIndex(null);
  };

  const openCard = (index: number | null) => {
    setIsAnimationDisabled(false);
    setActiveCardIndex(index);
  };

  const isFocusedViewActive =
    activeCardIndex !== null ||
    isAddingPlayer ||
    isAddingTournament ||
    isPromotingPlayer;

  return {
    activeCardIndex,
    setActiveCardIndex: openCard,
    isAddingPlayer,
    setIsAddingPlayer,
    isAddingTournament,
    setIsAddingTournament,
    isPromotingPlayer,
    setIsPromotingPlayer,
    selectedPlayerId,
    setSelectedPlayerId,
    selectedTournamentId,
    setSelectedTournamentId,
    playerClick,
    tournamentClick,
    back,
    isFocusedViewActive,
    isAnimationDisabled,
  };
};
