import { useMemo } from "react";

export default function useComputedResource(resource, sidebarElements) {
  const computedResource = useMemo(
    () =>
      resource?.map((resource) => ({
        ...resource,
        name: resource.title,
        isTruncated: true,
        type: "FOLDER",
        children: sidebarElements?.map((item) => ({
          ...item,
          children: item?.children?.map((el) => ({
            ...el,
            name: el.label,
            resourceId: resource.id,
          })),
        })),
      })),
    [resource, sidebarElements]
  );
  return computedResource;
}
