import { Delete, Download } from "@mui/icons-material"
import { useRef } from "react"
import { useMutation, useQuery } from "react-query"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import DataTable from "../../../components/DataTable"
import TableRowButton from "../../../components/TableRowButton"
import useDownloader from "../../../hooks/useDownloader"
import objectDocumentService from "../../../services/objectDocumentService"
import { bytesToSize } from "../../../utils/byteToSize"
import FileIconGenerator from "./FileIconGenerator"

const FilesSection = () => {
  const inputRef = useRef()
  const { tableSlug, id: objectId } = useParams()
  const { download } = useDownloader()
  

  const {
    data: { documents = [], count = 1 } = { documents: [], count: 1 },
    isLoading,
    refetch
  } = useQuery(["GET_OBJECT_FILES", { tableSlug, objectId }], () => {
    return objectDocumentService.getList({ object_id: objectId })
  })

  const { mutate: create, isLoading: createLoader } = useMutation((e) => {
    const file = e.target.files[0]

    const data = new FormData()
    data.append("file", file)

    return objectDocumentService.upload(tableSlug, objectId, data)
  }, {
    onSuccess: () => {
      refetch()
    }
  })

  const { mutate: deleteMutation, isLoading: deleteLoading } = useMutation(row => {
    return objectDocumentService.delete(row.id)
  }, {
    onSuccess: () => refetch()
  })

  const columns = [
    {
      id: "1",
      slug: "extention",
      label: "Type",
      render: (val) => <FileIconGenerator type={val} />,
      width: 10
    },
    {
      id: "2",
      slug: "name",
      label: "Name",
    },
    {
      id: "3",
      slug: "size",
      label: "Size",
      width: 120,
      render: (val) => bytesToSize(val)
    },
    {
      id: "4",
      slug: "",
      width: 10,
      render: (row) => (
        <span className="flex align-center gap-1">
          <RectangleIconButton
            onClick={() => download({link: 'https://' + row.file_link, fileName: row.name})}
          >
            <Download color="primary" />
          </RectangleIconButton>
          <RectangleIconButton color="error" onClick={() => deleteMutation(row)} >
            <Delete color="error" />
          </RectangleIconButton>
        </span>
      ),
    },
  ]

  console.log("DATA ==>", documents)

  return (
    <div className="p-1">
      <DataTable
        data={documents}
        columns={columns}
        pagesCount={Math.ceil(count / 10)}
        loader={isLoading || deleteLoading}
        removableHeight={false}
        currentPage={1}
        disableFilters
        additionalRow={
          <TableRowButton
            onClick={() => inputRef.current.click()}
            colSpan={columns.length + 1}
            loader={createLoader}
          />
        }
        // onPaginationChange={setCurrentPage}
      />
      <input className="hidden-element" type={'file'} ref={inputRef} onChange={create} />
    </div>
  )
}

export default FilesSection
