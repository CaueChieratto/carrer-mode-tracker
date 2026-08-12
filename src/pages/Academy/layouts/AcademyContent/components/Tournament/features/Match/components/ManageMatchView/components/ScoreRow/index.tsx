import { FormInput } from "../../../../../../../FormInput";
import Styles from "./ScoreRow.module.css";

type ScoreRowProps = {
  userGoals: number | string;
  setUserGoals: (goals: number | string) => void;
  opponentGoals: number | string;
  setOpponentGoals: (goals: number | string) => void;
  userPenalties: number | string;
  setUserPenalties: (goals: number | string) => void;
  opponentPenalties: number | string;
  setOpponentPenalties: (goals: number | string) => void;
  opponentTeam: string;
};

export const ScoreRow = ({
  userGoals,
  setUserGoals,
  opponentGoals,
  setOpponentGoals,
  userPenalties,
  setUserPenalties,
  opponentPenalties,
  setOpponentPenalties,
  opponentTeam,
}: ScoreRowProps) => {
  const isTie =
    userGoals !== "" &&
    opponentGoals !== "" &&
    Number(userGoals) === Number(opponentGoals);

  return (
    <div className={Styles.container}>
      <div className={Styles.scoreRow}>
        <FormInput
          label="Seus Gols"
          type="number"
          placeholder="Ex: 3"
          min={0}
          value={userGoals === null ? "" : userGoals}
          onChange={(e) => {
            const val = e.target.value;
            setUserGoals(val === "" ? "" : Number(val));
            if (val !== String(opponentGoals)) {
              setUserPenalties("");
              setOpponentPenalties("");
            }
          }}
        />
        <FormInput
          label={`Gols ${opponentTeam}`}
          type="number"
          placeholder="Ex: 2"
          min={0}
          value={opponentGoals === null ? "" : opponentGoals}
          onChange={(e) => {
            const val = e.target.value;
            setOpponentGoals(val === "" ? "" : Number(val));
            if (val !== String(userGoals)) {
              setUserPenalties("");
              setOpponentPenalties("");
            }
          }}
        />
      </div>

      {isTie && (
        <>
          <div className={Styles.divider}>
            <span>Pênaltis</span>
          </div>
          <div className={Styles.scoreRow}>
            <FormInput
              isLarge
              label="Pênaltis (Seus)"
              type="number"
              placeholder="Ex: 5"
              min={0}
              value={userPenalties === null ? "" : userPenalties}
              onChange={(e) =>
                setUserPenalties(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            />
            <FormInput
              isLarge
              label={`Pênaltis (${opponentTeam})`}
              type="number"
              placeholder="Ex: 4"
              min={0}
              value={opponentPenalties === null ? "" : opponentPenalties}
              onChange={(e) =>
                setOpponentPenalties(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            />
          </div>
        </>
      )}
    </div>
  );
};
