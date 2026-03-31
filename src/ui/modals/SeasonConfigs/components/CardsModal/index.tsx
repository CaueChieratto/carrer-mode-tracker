import ContainerButton from "../../../../../components/ContainerButton";
import Styles from "./CardsModal.module.css";

type CardsModalProps = {
  icon: React.ReactNode;
  label: string;
  title: string;
  onClick: () => void;
  clubColor: string;
  darkClubColor: string;
};

export const CardsModal = ({
  icon,
  label,
  title,
  onClick,
  clubColor,
  darkClubColor,
}: CardsModalProps) => {
  return (
    <ContainerButton
      className={Styles.card}
      style={
        {
          "--club-color": clubColor,
          "--club-color-dark": darkClubColor,
        } as React.CSSProperties
      }
    >
      <div className={Styles.card_inner} onClick={onClick}>
        <div className={Styles.icon_wrap}>{icon}</div>

        <div className={Styles.card_content}>
          <span className={Styles.card_label}>{label}</span>
          <span className={Styles.card_title}>{title}</span>
        </div>
      </div>
    </ContainerButton>
  );
};
