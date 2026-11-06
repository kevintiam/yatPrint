/**
 * Outils de pagination (découper une liste en pages).
 */

/**
 * Numéros de pages à afficher : 1 … 4 5 6 … 12 (null = « … »).
 * @param {number} page - page actuelle
 * @param {number} pageCount - nombre de pages
 * @returns {(number|null)[]}
 */
export function getPageNumbers(page, pageCount) {
  const numbers = [];
  for (let number = 1; number <= pageCount; number += 1) {
    const isEdge = number === 1 || number === pageCount;
    const isNear = Math.abs(number - page) <= 1;
    if (isEdge || isNear) {
      numbers.push(number);
    } else if (numbers[numbers.length - 1] !== null) {
      numbers.push(null);
    }
  }
  return numbers;
}

/**
 * Renvoie les éléments d'une page (pagination dans le navigateur).
 * Une page trop grande est ramenée à la dernière page.
 * @param {any[]} list
 * @param {number} page - à partir de 1
 * @param {number} pageSize
 * @returns {{items: any[], page: number, pageCount: number, total: number}}
 */
export function paginate(list, page, pageSize) {
  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;

  return { items: list.slice(start, start + pageSize), page: safePage, pageCount, total };
}
