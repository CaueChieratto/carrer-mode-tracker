import Button from "../../../../../../../../../../../../components/Button";
import Styles from "./TournamentMatchActions.module.css";

type TournamentMatchActionsProps = {
  onEnterMatch: () => void;
};

export const TournamentMatchActions = ({
  onEnterMatch,
}: TournamentMatchActionsProps) => {
  return (
    <div className={Styles.wrapperBtn}>
      <Button className={Styles.enterMatchBtn} onClick={onEnterMatch}>
        Entrar na Partida
      </Button>
    </div>
  );
};
