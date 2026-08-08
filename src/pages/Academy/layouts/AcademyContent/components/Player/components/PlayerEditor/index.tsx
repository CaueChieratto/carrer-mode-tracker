import Styles from "./PlayerEditor.module.css";
import { PlayerForm } from "../../forms/components/PlayerForm";
import { EditMode } from "./types";
import { usePlayerEditor } from "./hooks/usePlayerEditor";
import Button from "../../../../../../../../components/Button";
import { ButtonsSwitch } from "../../../../../../../../components/ButtonsSwitch";
import Modal from "../../../../../../../../components/Modal";
import DeleteConfirmModal from "../../../../../../../../ui/modals/DeleteConfirmModal";
import { TEXTS } from "../../containers/CreateAcademyPlayerForm/constants/TEXTS";
import ReturnLoanConfirmModal from "../../../../../../../../ui/modals/ReturnLoanConfirmModal";
import { useAcademyContext } from "../../../../../contexts/AcademyContext/hooks/useAcademyContext";
import { getSeasonStartYear } from "../../../../utils/getSeasonStartYear";

export const PlayerEditor = () => {
  const {
    selectedPlayer,
    career,
    seasonId,
    onUpdatePlayer,
    onDeletePlayer,
    onReleasePlayer,
  } = useAcademyContext();

  const {
    editMode,
    evolutionMode,
    isDeleteModalOpen,
    isReleaseModalOpen,
    setEditMode,
    setIsReleaseModalOpen,
    setIsDeleteModalOpen,
    handleCloseModal,
    handleUpdate,
  } = usePlayerEditor({
    player: selectedPlayer!,
    career,
    seasonId,
    onUpdatePlayer,
  });

  if (!selectedPlayer) return null;

  return (
    <div className={Styles.detailsContainer}>
      <ButtonsSwitch
        isAcademy
        isMatches={true}
        activeTab={editMode}
        setActiveTab={(tab) => setEditMode(tab as EditMode)}
        customTabs={[
          { value: "evolution", label: "Registrar Evolução" },
          { value: "correction", label: "Corrigir Cadastro" },
        ]}
      />

      <PlayerForm
        key={selectedPlayer.id}
        texts={{
          ...TEXTS,
          submitText:
            editMode === "correction" ? "Salvar Correções" : "Salvar Evolução",
        }}
        isEvolution={evolutionMode}
        onSubmitData={handleUpdate}
        initialData={selectedPlayer}
      />

      {(editMode === "evolution" || editMode === "correction") && (
        <>
          <Button
            type="button"
            className={Styles.deleteBtn}
            onClick={() =>
              editMode === "evolution"
                ? setIsReleaseModalOpen(true)
                : setIsDeleteModalOpen(true)
            }
          >
            {editMode === "evolution" ? "Dispensar Atleta" : "Apagar Jogador"}
          </Button>

          {(isReleaseModalOpen || isDeleteModalOpen) && (
            <Modal
              isOpen
              closeModal={handleCloseModal}
              animationContainer="grow"
              text={
                editMode === "evolution"
                  ? "Dispensar Atleta"
                  : "Deletar Jogador?"
              }
            >
              {editMode === "evolution" ? (
                <ReturnLoanConfirmModal
                  isAcademy
                  onConfirm={(date) => {
                    const [day, month] = date.split("/");
                    const startYear = getSeasonStartYear(career, seasonId);
                    const finalReleaseDate = `${day}/${month}/${startYear}`;
                    onReleasePlayer(selectedPlayer, finalReleaseDate);
                    handleCloseModal();
                  }}
                  closeModal={handleCloseModal}
                />
              ) : (
                <DeleteConfirmModal
                  onConfirm={() => {
                    onDeletePlayer(selectedPlayer.id);
                    handleCloseModal();
                  }}
                  closeModal={handleCloseModal}
                />
              )}
            </Modal>
          )}
        </>
      )}
    </div>
  );
};
