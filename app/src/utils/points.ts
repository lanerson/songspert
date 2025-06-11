export function calcPoints(rank: number): number {
  const nChar = rank.toString().length;
  return nChar * Math.floor(Math.log(rank));
}