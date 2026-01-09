import { DndContext, DragOverlay, MouseSensor, pointerWithin, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { useSidebarListProps } from "./useSidebarListProps";
import { SidebarTree } from "./temp/SidebarTree";

import cls from "./styles.module.scss";

export const SidebarList = ({
  sidebarIsOpen,
  menuList,
  setSubMenuIsOpen,
  selectedApp,
  handleOpenNotify,
  setSelectedFolder,
  setSelectedApp,
  setMenuList,
  getMenuList,
}) => {

  const {
    handleDragEnd,
    activeId,
    setActiveId,
    getMenuLabel,
    findItemEverywhere,
    menuChilds,
    rootDropId,
  } = useSidebarListProps({ menuList, setMenuList, getMenuList });
  
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const activeItem = activeId
  ? findItemEverywhere(activeId, { menuList, menuChilds })
  : null;
  
  return <DndContext
    sensors={sensors}
    collisionDetection={pointerWithin}
    onDragStart={({ active }) => setActiveId(active.id)}
    onDragEnd={handleDragEnd}
  >

    <SidebarTree
      menuList={menuList}
      setMenuList={setMenuList}
      depth={0}
      sidebarIsOpen={sidebarIsOpen}
      setSubMenuIsOpen={setSubMenuIsOpen}
      handleOpenNotify={handleOpenNotify}
      selectedApp={selectedApp}
      setSelectedFolder={setSelectedFolder}
      setSelectedApp={setSelectedApp}
      getMenuList={getMenuList}
      menuStyle={{}}
      rootDropId={rootDropId}
    />

    <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2,0,0,1)' }}>
      {activeItem && (
        <div className={cls.dragOverlay}>
          {getMenuLabel(activeItem)}
        </div>
      )}
    </DragOverlay>
  </DndContext>
}