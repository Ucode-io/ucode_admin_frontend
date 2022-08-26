import { Close, Delete, Download, Save } from "@mui/icons-material"
import { useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import CSelect from "../../../components/CSelect"
import { CTableCell, CTableRow } from "../../../components/CTable"
import DataTable from "../../../components/DataTable"
import TableRowButton from "../../../components/TableRowButton"
import useDownloader from "../../../hooks/useDownloader"
import documentTemplateService from "../../../services/documentTemplateService"
import objectDocumentService from "../../../services/objectDocumentService"
import { bytesToSize } from "../../../utils/byteToSize"
import listToOptions from "../../../utils/listToOptions"
import FileIconGenerator from "./FileIconGenerator"

const FilesSection = () => {
  const inputRef = useRef()
  const { tableSlug, id: objectId, appId } = useParams()
  const navigate = useNavigate()
  const { download, loader: downloadLoader } = useDownloader()
  const [downLoadedFile, setDownLoadedFile] = useState(null)
  const [createFormVisibe, setCreateFormVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const closeCreateForm = () => {
    setCreateFormVisible(false)
  }

  const {
    data: { documents = [], count = 1 } = { documents: [], count: 1 },
    isLoading,
    refetch,
  } = useQuery(["GET_OBJECT_FILES", { tableSlug, objectId }], () => {
    return objectDocumentService.getList({ object_id: objectId })
  })

  const { data: templates = [] } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      return documentTemplateService.getList({ table_slug: tableSlug })
    },
    {
      select: (res) => {
        return res.htmlTemplates ?? []
      },
    }
  )
  

  const templateOptions = useMemo(() => {
    return listToOptions(templates) 
  }, [ templates ])

  const { mutate: create, isLoading: createLoader } = useMutation(
    (e) => {
      const file = e.target.files[0]

      const data = new FormData()
      data.append("file", file)

      return objectDocumentService.upload(tableSlug, objectId, data)
    },
    {
      onSuccess: () => {
        refetch()
      },
    }
  )

  const { mutate: deleteMutation, isLoading: deleteLoading } = useMutation(
    (row) => {
      return objectDocumentService.delete(row.id)
    },
    {
      onSuccess: () => refetch(),
    }
  )

  const navigateToDocumentEditPage = () => {

    const template = templates.find(el => el.id === selectedTemplate)


    const state = {
      toDocsTab: true,
      template: template,
      objectId: objectId
    }
    
    closeCreateForm()

    navigate(`/main/${appId}/object/${tableSlug}`, { state })
  }

  const columns = [
    {
      id: "1",
      slug: "extention",
      label: "Type",
      render: (val) => <FileIconGenerator type={val} />,
      width: 10,
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
      render: (val) => bytesToSize(val),
    },
    {
      id: "4",
      slug: "",
      width: 10,
      render: (row) => (
        <span className="flex align-center gap-1">
          <RectangleIconButton
            loader={downloadLoader && downLoadedFile === row.id}
            onClick={() => {
              setDownLoadedFile(row.id)
              download({ link: row.file_link, fileName: row.name })
            }}
          >
            <Download color="primary" />
          </RectangleIconButton>
          <RectangleIconButton
            color="error"
            onClick={() => deleteMutation(row)}
          >
            <Delete color="error" />
          </RectangleIconButton>
        </span>
      ),
    },
  ]

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
          <>
            <TableRowButton
              onClick={() => inputRef.current.click()}
              colSpan={columns.length + 1}
              loader={createLoader}
            />

            {!createFormVisibe ? (
              <TableRowButton
                onClick={() => setCreateFormVisible(true)}
                colSpan={columns.length + 1}
                loader={createLoader}
                title="Создать"
              />
            ) : (
              <CTableRow>
                <CTableCell colSpan={4}>
                  <CSelect
                    disabledHelperText
                    placeholder="Template"
                    value={selectedTemplate ?? ''}
                    onChange={e => setSelectedTemplate(e.target.value)}
                    options={templateOptions}
                  />
                </CTableCell>
                <CTableCell>
                  <span className="flex align-center gap-1">
                    <RectangleIconButton
                      onClick={navigateToDocumentEditPage}
                    >
                      <Save color="primary" />
                    </RectangleIconButton>
                    <RectangleIconButton
                      color="error"
                      onClick={closeCreateForm}
                    >
                      <Close color="error" />
                    </RectangleIconButton>
                  </span>
                </CTableCell>
              </CTableRow>
            )}
          </>
        }
        // onPaginationChange={setCurrentPage}
      />
      <input
        className="hidden-element"
        type={"file"}
        ref={inputRef}
        onChange={create}
      />
    </div>
  )
}

export default FilesSection
