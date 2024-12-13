// src/utils/dateUtils.ts

/**
 * Compara duas datas considerando apenas o dia, mês e ano.
 * Retorna `true` se `date1` for posterior a `date2`, caso contrário, retorna `false`.
 *
 * @param date1 - A primeira data para comparação.
 * @param date2 - A segunda data para comparação.
 * @returns `true` se `date1` for depois de `date2` (mesmo dia é considerado não posterior), caso contrário, `false`.
 */
export const isDateAfter = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1 > d2;
};
