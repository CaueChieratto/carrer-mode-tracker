type GetStatRowDataParams = {
  home: number;
  away: number;
  reverseWinner?: boolean;
};

type GetStatRowDataResult = {
  homeWidth: number;
  awayWidth: number;
  homeWins: boolean;
  awayWins: boolean;
};

export function getStatRowData({
  home,
  away,
  reverseWinner,
}: GetStatRowDataParams): GetStatRowDataResult {
  const max = Math.max(home, away);

  const homeWidth = max === 0 ? 0 : (home / max) * 100;
  const awayWidth = max === 0 ? 0 : (away / max) * 100;

  let homeWins = home > away;
  let awayWins = away > home;

  if (reverseWinner) {
    homeWins = home < away;
    awayWins = away < home;
  }

  if (home === away) {
    homeWins = true;
    awayWins = true;
  }

  return {
    homeWidth,
    awayWidth,
    homeWins,
    awayWins,
  };
}
