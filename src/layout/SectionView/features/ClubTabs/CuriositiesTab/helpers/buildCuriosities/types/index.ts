export interface HighlightItem {
  label: string;
  value: string;
}

export interface RankingItem {
  label: string;
  count: number;
}

export interface TimelineEvent {
  minute: number;
  isMine: boolean;
  player: string;
  strMin: string;
}
