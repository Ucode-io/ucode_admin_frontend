// @ts-check
/** @typedef {import('./types').UISpecV1} UISpecV1 */

/**
 * Runtime type guard for UISpecV1
 *
 * @param {*} x
 * @returns {x is UISpecV1}
 */

export function isUISpecV1(x) {
  if (!x || typeof x !== "object") return false;
  if (x.version !== "v1") return false;

  const layout = x.layout;
  if (!layout || layout.type !== "admin") return false;

  /** @type {Array<'header' | 'sidebar' | 'footer'>} */
  const layoutKeys = ["header", "sidebar", "footer"];

  for (const k of layoutKeys) {
    if (typeof layout[k] !== "boolean") return false;
  }

  const nav = x.navigation;
  if (!nav || !Array.isArray(nav.sidebar)) return false;

  const tables = x.tables;
  if (!Array.isArray(tables)) return false;

  /** @type {Set<string>} */
  const tableSlugs = new Set();

  for (const t of tables) {
    if (!t || typeof t !== "object") return false;
    if (typeof t.label !== "string") return false;
    if (typeof t.slug !== "string") return false;
    if (!t.attributes || typeof t.attributes !== "object") return false;

    tableSlugs.add(t.slug);
  }

  // sidebar items must reference existing table slugs
  for (const item of nav.sidebar) {
    if (!item || typeof item !== "object") return false;
    if (item.type !== "table") return false;
    if (typeof item.slug !== "string") return false;
    if (!tableSlugs.has(item.slug)) return false;
  }

  return true;
}
