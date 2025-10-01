import { viewTypes } from "@/utils/constants/viewTypes";

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
  WEBSITE: "globe.svg",
  TREE: "tree.svg",
};

export const useViewCreateProps = () => {
  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));
  return {
    computedViewTypes,
    viewIcons,
  };
};
