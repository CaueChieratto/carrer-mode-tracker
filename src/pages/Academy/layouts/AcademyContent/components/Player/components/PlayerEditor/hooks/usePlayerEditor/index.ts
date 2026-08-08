import { useState } from "react";
import { Career } from "../../../../../../../../../../common/interfaces/Career";
import { AcademyPlayers } from "../../../../../../interfaces/AcademyPlayers/AcademyPlayers";
import { PlayerDataPayload } from "../../../../forms/types/PlayerDataPayload";
import { generateEvolutionHistory } from "../../utils/playerEvolution";
import { EditMode } from "../../types";

type UsePlayerEditorProps = {
  player: AcademyPlayers;
  career: Career;
  seasonId: string;
  onUpdatePlayer: (updatedPlayer: AcademyPlayers) => Promise<void>;
};

export const usePlayerEditor = ({
  player,
  career,
  seasonId,
  onUpdatePlayer,
}: UsePlayerEditorProps) => {
  const [editMode, setEditMode] = useState<EditMode>("evolution");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  const evolutionMode = editMode === "evolution";

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setIsReleaseModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleUpdate = async (newData: PlayerDataPayload) => {
    let updatedPlayer: AcademyPlayers;

    if (evolutionMode) {
      updatedPlayer = generateEvolutionHistory(
        player,
        newData,
        career,
        seasonId,
      );
    } else {
      updatedPlayer = { ...player, ...newData };
    }

    await onUpdatePlayer(updatedPlayer);
  };

  return {
    editMode,
    evolutionMode,
    isDeleteModalOpen,
    isReleaseModalOpen,
    setEditMode,
    setIsReleaseModalOpen,
    setIsDeleteModalOpen,
    handleCloseModal,
    handleUpdate,
  };
};
