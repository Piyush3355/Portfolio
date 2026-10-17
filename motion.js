/** @param {number} value */
export function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

/** @param {number} scrollY @param {number} viewportHeight @param {number} documentHeight */
export function pageProgress(scrollY, viewportHeight, documentHeight) {
  const distance = documentHeight - viewportHeight;
  return distance > 0 ? clamp01(scrollY / distance) : 0;
}

/** @param {number} current @param {number} target @param {number} delta */
export function damp(current, target, delta) {
  return current + (target - current) * (1 - Math.exp(-5 * Math.max(0, delta)));
}
