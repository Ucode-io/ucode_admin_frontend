import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { MenuItem } from "../MenuItem23"

export const MenuList = ({items, ...props}) => {

  return <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
    {items.map((item) => (
      <MenuItem key={item.id} element={item} {...props} />
    ))}
  </SortableContext>
}
