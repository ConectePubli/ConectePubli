export function getDaysInMonth(year: number, monthIndex: number) {
  // monthIndex vai de 0 (Janeiro) a 11 (Dezembro)
  return new Date(year, monthIndex + 1, 0).getDate();
}
