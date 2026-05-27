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
  isOpponent?: boolean;
};

export type GoalListItem = {
  playerName: string;
  time: number;
  displayTime: string;
  sortTime: number;
};

export type OpponentGoal = {
  player: string;
  minute: string;
};

export type OpponentAssist = {
  player: string;
  goalReference: string;
};

export type OpponentCard = {
  player: string;
  yellow: boolean;
  yellowMinute: string;
  secondYellow: boolean;
  secondYellowMinute: string;
  red: boolean;
  redMinute: string;
};

export type OpponentEvents = {
  goals?: OpponentGoal[];
  assists?: OpponentAssist[];
  cards?: OpponentCard[];
};
