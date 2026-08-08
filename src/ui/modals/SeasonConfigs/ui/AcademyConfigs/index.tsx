import { useState } from "react";
import Styles from "./AcademyConfigs.module.css";
import {
  IoBusinessOutline,
  IoTrophyOutline,
  IoPeopleOutline,
} from "react-icons/io5";

type AcademyConfigsProps = {
  clubColor?: string;
  onClose: () => void;
  onSave: (
    academyName: string,
    tournamentName: string,
    youthNickname: string,
  ) => void;
  isSaving: boolean;
  initialData?: { name: string; tournament: string; nickname: string };
};

export const AcademyConfigs = ({
  clubColor,
  onClose,
  onSave,
  isSaving,
  initialData,
}: AcademyConfigsProps) => {
  const [academyName, setAcademyName] = useState(initialData?.name || "");
  const [tournamentName, setTournamentName] = useState(
    initialData?.tournament || "",
  );
  const [youthNickname, setYouthNickname] = useState(
    initialData?.nickname || "",
  );

  const handleSave = () => {
    const finalAcademy = academyName.trim() || "Elenco da base";
    const finalTournament = tournamentName.trim() || "Torneio da base";
    const finalNickname = youthNickname.trim() || "Jovens promessas";

    onSave(finalAcademy, finalTournament, finalNickname);
  };

  return (
    <div
      className={Styles.container}
      style={
        {
          "--club-color": clubColor || "#ffffff",
        } as React.CSSProperties
      }
    >
      <div className={Styles.wrapper}>
        <div className={Styles.header}>
          <h2 className={Styles.title}>Dados da Base</h2>
          <p className={Styles.subtitle}>
            Anote as informações para acompanhar os jovens talentos do seu save
          </p>
        </div>

        <div className={Styles.cards_wrapper}>
          <div className={Styles.input_card}>
            <div className={Styles.icon_wrap}>
              <IoBusinessOutline />
            </div>
            <div className={Styles.input_content}>
              <label className={Styles.label}>Complexo da Base</label>
              <input
                type="text"
                className={Styles.input}
                placeholder="Ex: La Masia"
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
              />
            </div>
          </div>

          <div className={Styles.input_card}>
            <div className={Styles.icon_wrap}>
              <IoTrophyOutline />
            </div>
            <div className={Styles.input_content}>
              <label className={Styles.label}>Principal Torneio</label>
              <input
                type="text"
                className={Styles.input}
                placeholder="Ex: Copinha"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
              />
            </div>
          </div>

          <div className={Styles.input_card}>
            <div className={Styles.icon_wrap}>
              <IoPeopleOutline />
            </div>
            <div className={Styles.input_content}>
              <label className={Styles.label}>Identidade dos Atletas</label>
              <input
                type="text"
                className={Styles.input}
                placeholder="Ex: Meninos da Vila"
                value={youthNickname}
                onChange={(e) => setYouthNickname(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={Styles.footer}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={Styles.save_button}
        >
          {isSaving ? "Salvando..." : "Salvar Dados"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className={Styles.back}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};
