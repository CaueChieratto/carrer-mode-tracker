import Styles from "./AddBadgeClub.module.css";
import Load from "../../../components/Load";
import { useClubColors } from "../../../common/hooks/Colors/UseClubColors";
import { ColorsService } from "../../../common/services/ColorsService";
import { useAddBadge } from "./hooks/useAddBadge";

type AddBadgeClubProps = {
  closeModal: () => void;
  teamName: string;
  careerId: string;
  seasonId: string;
  onSuccess?: () => void;
};

export const AddBadgeClub = ({
  closeModal,
  teamName,
  careerId,
  seasonId,
  onSuccess,
}: AddBadgeClubProps) => {
  const { file, preview, isLoading, error, handleFileChange, handleSubmit } =
    useAddBadge({ careerId, seasonId, teamName, onSuccess, closeModal });

  const { clubColor } = useClubColors(
    ColorsService.getColorSaved(careerId || "default") || "#ffffff",
  );

  if (isLoading) return <Load />;

  return (
    <form className={Styles.form} onSubmit={handleSubmit}>
      <div className={Styles.upload_area}>
        <label htmlFor="badge-upload" className={Styles.file_label}>
          {preview ? (
            <img
              src={preview}
              alt="Preview do escudo"
              className={Styles.preview_img}
            />
          ) : (
            <div className={Styles.placeholder}>
              <span>Clique para selecionar</span>
            </div>
          )}
        </label>
        <input
          id="badge-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className={Styles.file_input}
        />
      </div>

      {error && <span className={Styles.error}>{error}</span>}

      <div className={Styles.actions}>
        <button
          type="button"
          className={Styles.cancel_btn}
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={Styles.save_btn}
          disabled={!file}
          style={{ backgroundColor: clubColor }}
        >
          Salvar
        </button>
      </div>
    </form>
  );
};
