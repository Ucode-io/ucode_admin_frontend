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
};

export const computedViewTypes = viewTypes.map((el) => ({value: el, label: el}))