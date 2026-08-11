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
import { FormInput } from "../../../FormInput";

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
    isUndoModalOpen,
    isLoadingStatus,
    exitDate,
    setEditMode,
    setIsReleaseModalOpen,
    setIsDeleteModalOpen,
    setIsUndoModalOpen,
    setExitDate,
    handleCloseModal,
    handleUpdate,
    handleEditEvolution,
    handleUpdateDates,
    handleUndoStatus,
    isEditingEvolution,
    editingEvolutionEvent,
  } = usePlayerEditor({
    player: selectedPlayer!,
    career,
    seasonId,
    onUpdatePlayer,
  });

  if (!selectedPlayer) return null;

  if (
    selectedPlayer.status === "promoted" ||
    selectedPlayer.status === "released"
  ) {
    return (
      <div className={Styles.detailsContainer}>
        <form className={Styles.section} onSubmit={handleUpdateDates}>
          <div
            className={Styles.contentBox}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <FormInput
              label={
                selectedPlayer.status === "promoted"
                  ? "Data da Promoção"
                  : "Data da Dispensa"
              }
              placeholder="DD/MM"
              value={exitDate}
              maxLength={5}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 2) {
                  val = val.substring(0, 2) + "/" + val.substring(2, 4);
                }
                setExitDate(val);
              }}
            />
            <Button
              className={Styles.saveBtn}
              type="submit"
              disabled={isLoadingStatus}
            >
              {isLoadingStatus ? "Salvando..." : "Salvar Data"}
            </Button>
          </div>
        </form>

        <Button
          className={Styles.undoBtn}
          type="button"
          onClick={() => setIsUndoModalOpen(true)}
          disabled={isLoadingStatus}
        >
          {selectedPlayer.status === "promoted"
            ? "Desfazer Promoção"
            : "Desfazer Dispensa"}
        </Button>

        {isUndoModalOpen && (
          <Modal
            isOpen
            closeModal={handleCloseModal}
            animationContainer="grow"
            text={
              selectedPlayer.status === "promoted"
                ? "Desfazer Promoção?"
                : "Desfazer Dispensa?"
            }
          >
            <DeleteConfirmModal
              onConfirm={handleUndoStatus}
              closeModal={handleCloseModal}
            />
          </Modal>
        )}
      </div>
    );
  }

  const evolutionEventForEdit = isEditingEvolution
    ? selectedPlayer.evolutionHistory?.find(
        (h) => h.id === editingEvolutionEvent?.historyId,
      )
    : null;

  const initialDataForForm =
    isEditingEvolution && evolutionEventForEdit
      ? {
          ...selectedPlayer,
          [editingEvolutionEvent!.attribute]: evolutionEventForEdit.newValue,
          evolutionDate: evolutionEventForEdit.date.substring(0, 5),
        }
      : selectedPlayer;

  const customTabs = [
    { value: "evolution", label: "Registrar Evolução" },
    { value: "correction", label: "Corrigir Cadastro" },
  ];

  if (isEditingEvolution) {
    customTabs.push({ value: "edit-evolution", label: "Editar Evolução" });
  }

  return (
    <div className={Styles.detailsContainer}>
      {!isEditingEvolution && (
        <ButtonsSwitch
          isAcademy
          isMatches={true}
          activeTab={editMode}
          setActiveTab={(tab) => setEditMode(tab as EditMode)}
          customTabs={customTabs}
        />
      )}

      <PlayerForm
        key={selectedPlayer.id}
        texts={{
          ...TEXTS,
          submitText:
            editMode === "correction"
              ? "Salvar Correções"
              : editMode === "edit-evolution"
                ? "Salvar Edição"
                : "Salvar Evolução",
        }}
        isEvolution={evolutionMode || editMode === "edit-evolution"}
        editingAttribute={
          editMode === "edit-evolution"
            ? editingEvolutionEvent?.attribute
            : undefined
        }
        onSubmitData={
          editMode === "edit-evolution" ? handleEditEvolution : handleUpdate
        }
        initialData={initialDataForForm}
      />

      {(editMode === "evolution" || editMode === "correction") && (
        <>
          <Button
            className={Styles.deleteBtn}
            type="button"
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
