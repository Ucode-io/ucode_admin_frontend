export const viewTypes = [
  "TABLE",
  "CALENDAR",
  "TIMELINE",
  "BOARD",
  "TREE",
  "WEBSITE",
  "GRID",
];

export const computedViewTypes = viewTypes.map((el) => ({value: el, label: el}))