import { SortableSidebarTree } from "./components/SortableSidebarTree";
import { useSidebarListProps } from "./useSidebarListProps";

export const SidebarList = ({
  menuList,
  setMenuList,
  handlers,
  setSelectedFolder,
  selectedApp,
  setSelectedApp,
  menu,
  setMenu,
}) => {
  const { getMenuLabel, menuChilds } = useSidebarListProps();

  return (
    <SortableSidebarTree
      menuList={menuList}
      setMenuList={setMenuList}
      menuChilds={menuChilds}
      getMenuLabel={getMenuLabel}
      handlers={handlers}
      setSelectedFolder={setSelectedFolder}
      selectedApp={selectedApp}
      setSelectedApp={setSelectedApp}
      menu={menu}
      setMenu={setMenu}
    />
  );
};
