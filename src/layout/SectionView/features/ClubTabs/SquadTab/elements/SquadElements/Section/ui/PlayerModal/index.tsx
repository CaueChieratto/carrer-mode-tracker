import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { IoPersonOutline, IoCreateOutline } from "react-icons/io5";
import Modal from "../../../../../../../../../../components/Modal";
import Button from "../../../../../../../../../../components/Button";
import { CardsModal } from "../../../../../../../../../../ui/modals/SeasonConfigs/components/CardsModal";
import { useClubColors } from "../../../../../../../../../../common/hooks/Colors/UseClubColors";
import { ColorsService } from "../../../../../../../../../../common/services/ColorsService";

import Styles from "./PlayerModal.module.css";

type PlayerModalProps = {
  id: string;
  playerName: string;
  onClose: () => void;
};

export const PlayerModal = ({ id, playerName, onClose }: PlayerModalProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const { careerId, seasonId } = useParams();

  const { clubColor, darkClubColor } = useClubColors(
    ColorsService.getColorSaved(careerId || "") || "#ffffff",
  );

  const viewPath = `/Career/${careerId}/Geral/Player/${id}`;
  const editPath = `/Career/${careerId}/Season/${seasonId}/EditPlayer/${id}`;

  const modalContent = (
    <Modal
      isOpen={true}
      closeModal={onClose}
      animationContainer="grow"
      text={playerName}
    >
      <div className={Styles.container}>
        <div className={Styles.grid}>
          <CardsModal
            icon={<IoPersonOutline className={Styles.icon} />}
            label="Visualizar"
            title="Jogador"
            onClick={() => setSelectedPath(viewPath)}
            clubColor={clubColor}
            darkClubColor={darkClubColor}
            className={selectedPath === viewPath ? Styles.selected_card : ""}
          />
          <CardsModal
            icon={<IoCreateOutline className={Styles.icon} />}
            label="Editar"
            title="Jogador"
            onClick={() => setSelectedPath(editPath)}
            clubColor={clubColor}
            darkClubColor={darkClubColor}
            className={selectedPath === editPath ? Styles.selected_card : ""}
          />
        </div>

        {selectedPath && (
          <Button
            className={Styles.button}
            onClick={() => {
              document.body.classList.remove("modal-open");
              navigate(selectedPath);
            }}
            style={{
              backgroundColor: clubColor,
              border: `1px solid ${darkClubColor}`,
            }}
          >
            Entrar{" "}
            {selectedPath.includes("Edit") ? "na Edição" : "na Visualização"}
          </Button>
        )}
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
};
