import { SortableSidebarTree } from "./components/SortableSidebarTree";
import { useSidebarListProps } from "./useSidebarListProps";

export const SidebarList = ({ menuList, setMenuList, getMenuList }) => {
  const { getMenuLabel, menuChilds } = useSidebarListProps({
    menuList,
    setMenuList,
    getMenuList,
  });

  return (
    <SortableSidebarTree
      menuList={menuList}
      setMenuList={setMenuList}
      menuChilds={menuChilds}
      getMenuLabel={getMenuLabel}
    />
  );
};
