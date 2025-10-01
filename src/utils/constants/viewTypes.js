export const viewTypes = [
  "TABLE",
  "CALENDAR",
  "TIMELINE",
  "BOARD",
  "TREE",
  "WEBSITE",
  "GRID",
];

export const VIEW_TYPES_MAP = {
  TABLE: "TABLE",
  CALENDAR: "CALENDAR",
  TIMELINE: "TIMELINE",
  TREE: "TREE",
  WEBSITE: "WEBSITE",
  GRID: "GRID",
  BOARD: "BOARD",
  SECTION: "SECTION",
};

export const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
  WEBSITE: "globe.svg",
  TREE: "tree.svg",
  SECTION: "layout.svg",
};

export const computedViewTypes = viewTypes.map((el) => ({value: el, label: el}))