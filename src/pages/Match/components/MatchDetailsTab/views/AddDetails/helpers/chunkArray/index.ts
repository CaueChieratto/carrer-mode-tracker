export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.length > 0
    ? Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size),
      )
    : [];
