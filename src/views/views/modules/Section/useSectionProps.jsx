import { useViewContext } from "@/providers/ViewProvider"
import { useFieldsContext } from "../../providers/FieldsProvider";

export const useSectionProps = () => {
  const { 
    view,
    selectedTabIndex,
    layoutData,
    layout,
    rootForm,
    onSectionSubmit,
    selectedRow,
    projectInfo,
    updateLayout,
    handleMouseDown,
  } = useViewContext();

  const {
    fieldsMap,
  } = useFieldsContext()

  return { 
    view,
    selectedTabIndex,
    layoutData,
    layout,
    rootForm,
    onSectionSubmit,
    selectedRow,
    fieldsMap,
    projectInfo,
    updateLayout,
    handleMouseDown,
  }

}
