export type PeriodKey = "1T" | "2T" | "1ET" | "2ET" | "PEN";

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
  displayTime?: string;
  sortTime: number;
  mainPlayer: string;
  secondaryPlayer?: string;
  period: PeriodKey;
};
