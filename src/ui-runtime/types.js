/**
 * @typedef {Object} UISpecV1
 * @property {'v1'} version
 * @property {Object} layout
 * @property {'admin'} layout.type
 * @property {boolean} layout.header
 * @property {boolean} layout.sidebar
 * @property {boolean} layout.footer
 * @property {Object} navigation
 * @property {SidebarItem[]} navigation.sidebar
 * @property {TableSpec[]} tables
 */

/**
 * @typedef {Object} SidebarItem
 * @property {'table'} type
 * @property {string} label
 * @property {string} slug
 * @property {string} icon
 */

/**
 * @typedef {Object} TableSpec
 * @property {string} label
 * @property {string} slug
 * @property {Object.<string, string>} attributes
 */

/**
 * This file is a types-only module.
 * The export below exists only to make it a valid ES module
 * so it can be imported via JSDoc `import()`.
 */
export {};
