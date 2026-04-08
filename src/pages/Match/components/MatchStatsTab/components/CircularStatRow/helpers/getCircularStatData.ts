type Params = {
  success: number;
  total: number;
};

export function getPercentage({ success, total }: Params): number {
  if (total === 0) return 0;
  return Math.round((success / total) * 100);
}
