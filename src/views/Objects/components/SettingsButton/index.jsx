import { Settings } from "@mui/icons-material"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { NavLink, useParams } from "react-router-dom"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"

const SettingsButton = () => {
  const { tableSlug, appId } = useParams()

  const tables = useSelector((state) => state.constructorTable.list)

  const tableInfo = useMemo(() => {
    return tables?.find((table) => table.slug === tableSlug)
  }, [tables, tableSlug])

  const url = `/settings/constructor/apps/${appId}/objects/${tableInfo?.id}/${tableInfo?.slug}`

  return (
    <NavLink to={url} target={"_blank"} >
      <RectangleIconButton color="grey">
        <Settings color="primary" />
      </RectangleIconButton>
    </NavLink>
  )
}

export default SettingsButton
