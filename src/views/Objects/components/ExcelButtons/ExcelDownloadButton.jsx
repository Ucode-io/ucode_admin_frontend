import { Download } from "@mui/icons-material"
import { useState } from "react"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import useDownloader from "../../../../hooks/useDownloader"
import constructorObjectService from "../../../../services/constructorObjectService"

const ExcelDownloadButton = () => {
  const { tableSlug } = useParams()
  const { download } = useDownloader()
  const [loader, setLoader] = useState(false)


  const onClick = async () => {
    try {
      setLoader(true)
      const {data} = await constructorObjectService.downloadExcel(tableSlug, { data: {} })

      const fileName = `${tableSlug}.xlsx`
      // window.open('https://' + data.link, { target: '__blank' })
      await download({ link: 'https://' + data.link, fileName })

    } finally {
      setLoader(false)
    }

  }
  return (
    <RectangleIconButton loader={loader} color="white" onClick={onClick} >
      <Download />
    </RectangleIconButton>
  )
}

export default ExcelDownloadButton
