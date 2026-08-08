import { FormInput } from "../../../../../../../FormInput";
import Styles from "./ScoreRow.module.css";

type ScoreRowProps = {
  userGoals: number | string;
  setUserGoals: (goals: number | string) => void;
  opponentGoals: number | string;
  setOpponentGoals: (goals: number | string) => void;
  opponentTeam: string;
};

export const ScoreRow = ({
  userGoals,
  setUserGoals,
  opponentGoals,
  setOpponentGoals,
  opponentTeam,
}: ScoreRowProps) => {
  return (
    <div className={Styles.scoreRow}>
      <FormInput
        label="Seus Gols"
        type="number"
        placeholder="Ex: 3"
        min={0}
        value={userGoals === null ? "" : userGoals}
        onChange={(e) =>
          setUserGoals(e.target.value === "" ? "" : Number(e.target.value))
        }
      />
      <FormInput
        label={`Gols ${opponentTeam}`}
        type="number"
        placeholder="Ex: 2"
        min={0}
        value={opponentGoals === null ? "" : opponentGoals}
        onChange={(e) =>
          setOpponentGoals(e.target.value === "" ? "" : Number(e.target.value))
        }
      />
    </div>
  );
};
