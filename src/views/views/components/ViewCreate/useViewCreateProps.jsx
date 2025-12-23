import { viewIcons, viewTypes } from "@/utils/constants/viewTypes";

export const useViewCreateProps = () => {
  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));
  return {
    computedViewTypes,
    viewIcons,
  };
};
