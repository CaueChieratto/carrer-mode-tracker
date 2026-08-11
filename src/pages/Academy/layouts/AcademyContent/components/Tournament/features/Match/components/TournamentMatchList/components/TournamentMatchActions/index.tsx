import Button from "../../../../../../../../../../../../components/Button";
import Styles from "./TournamentMatchActions.module.css";

type TournamentMatchActionsProps = {
  onEnterMatch: () => void;
  hasLineup: boolean;
};

export const TournamentMatchActions = ({
  onEnterMatch,
  hasLineup,
}: TournamentMatchActionsProps) => {
  return (
    <div
      className={Styles.wrapperBtn}
      style={hasLineup ? { borderTop: "1px solid var(--border-navbar)" } : {}}
    >
      <Button className={Styles.enterMatchBtn} onClick={onEnterMatch}>
        Entrar na Partida
      </Button>
    </div>
  );
};
