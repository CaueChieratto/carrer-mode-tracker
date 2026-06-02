import { Match } from "../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";

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

export type MatchWithOpponentEvents = Omit<Match, "opponentEvents"> & {
  opponentEvents?: OpponentEvents;
};
