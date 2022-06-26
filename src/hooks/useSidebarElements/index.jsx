import { useMemo } from "react"
import { useSelector } from "react-redux"
import { elements, settingsElements } from "./elements"
import { useParams } from "react-router-dom"

const useSidebarElements = () => {
  const { appId } = useParams()
  const constructorElements = useSelector(
    (state) => state.constructorTable.list
  )

  const computedElements = useMemo(() => {
    const computedConstructorElements = constructorElements
      .filter((el) => el.show_in_menu)
      .map((el) => ({
        ...el,
        title: el.label,
        path: `/main/${appId}/object/${el.slug}`,
      }))

    return [
      ...computedConstructorElements,
      ...elements,
    ]
  }, [constructorElements])




  

  return { elements: computedElements ?? [], settingsElements }
}

export default useSidebarElements
