export type Formation = {
  name: string;
  lines: number[][];
};

export const FORMATIONS: Formation[] = [
  {
    name: "4-4-2",
    lines: [[4], [4], [2]],
  },
  {
    name: "4-3-3",
    lines: [[4], [3], [3]],
  },
  {
    name: "4-2-3-1",
    lines: [[4], [2], [3], [1]],
  },
  {
    name: "4-1-4-1",
    lines: [[4], [1], [4], [1]],
  },
  {
    name: "3-5-2",
    lines: [[3], [5], [2]],
  },
  {
    name: "3-4-3",
    lines: [[3], [4], [3]],
  },
  {
    name: "5-3-2",
    lines: [[5], [3], [2]],
  },
  {
    name: "5-4-1",
    lines: [[5], [4], [1]],
  },
  {
    name: "4-5-1",
    lines: [[4], [5], [1]],
  },
];

export const FORMATION_NAMES = FORMATIONS.map((f) => f.name);
