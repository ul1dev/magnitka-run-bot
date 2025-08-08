export function randomInclusive(from: number = 0, to: number = 100): number {
  if (from > to) return 0;

  return Math.floor(Math.random() * (to - from + 1)) + from;
}
