export type PeriodKey = "1T" | "2T" | "ET" | "PEN";

export type MatchEvent = {
  id: string;
  type:
    | "goal"
    | "yellow_card"
    | "red_card"
    | "second_yellow"
    | "sub"
    | "penalty_goal"
    | "penalty_miss";
  time: number;
  mainPlayer: string;
  secondaryPlayer?: string;
  period: PeriodKey;
};
