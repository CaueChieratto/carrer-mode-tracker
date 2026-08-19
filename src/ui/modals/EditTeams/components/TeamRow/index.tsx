import { FaTrashCan, FaFloppyDisk } from "react-icons/fa6";
import { EditableTeam } from "../../types";
import { isCustomTeam } from "../../helpers/isCustomTeam";
import Styles from "./TeamRow.module.css";

interface TeamRowProps {
  team: EditableTeam;
  isEditing: boolean;
  onNameChange: (originalName: string, newName: string) => void;
  onFileChange: (
    originalName: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onAction: (team: EditableTeam, isDeleting?: boolean) => void;
  rowRef: (el: HTMLDivElement | null) => void;
}

export const TeamRow = ({
  team,
  isEditing,
  onNameChange,
  onFileChange,
  onAction,
  rowRef,
}: TeamRowProps) => {
  const isCustom = isCustomTeam(team);
  const isDirty =
    team.name !== team.originalName ||
    (team.badge || "") !== team.originalBadge ||
    !!team.file;
  const displayBadge = team.previewUrl || team.badge;

  return (
    <div ref={rowRef} className={Styles.teamRow}>
      {isCustom ? (
        <label
          className={`${Styles.badgeContainer} ${Styles.badgeLabel}`}
          title="Clique para alterar a imagem"
        >
          {displayBadge ? (
            <img src={displayBadge} alt={team.name} className={Styles.badge} />
          ) : (
            <span className={Styles.uploadPlaceholder}>+</span>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className={Styles.hiddenFileInput}
            onChange={(e) => onFileChange(team.originalName, e)}
            disabled={isEditing}
          />
        </label>
      ) : (
        <div className={Styles.badgeContainer}>
          {displayBadge && (
            <img src={displayBadge} alt={team.name} className={Styles.badge} />
          )}
        </div>
      )}

      <div className={Styles.inputs}>
        <input
          type="text"
          value={team.name}
          onChange={(e) => onNameChange(team.originalName, e.target.value)}
          placeholder="Nome do Time"
          className={Styles.input}
          disabled={isEditing}
        />
      </div>

      <div className={Styles.rowActions}>
        <button
          onClick={() => onAction(team, false)}
          disabled={!isDirty || isEditing}
          className={`${Styles.iconBtn} ${Styles.saveBtn}`}
          title="Salvar alterações deste time"
        >
          {isEditing ? <div className={Styles.spinner} /> : <FaFloppyDisk />}
        </button>
        <button
          onClick={() => onAction(team, true)}
          disabled={isEditing}
          className={`${Styles.iconBtn} ${Styles.deleteBtn}`}
          title="Excluir Time"
        >
          <FaTrashCan />
        </button>
      </div>
    </div>
  );
};
