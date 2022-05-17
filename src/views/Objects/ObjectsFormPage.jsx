import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../components/Buttons/SaveButton"
import Header from "../../components/Header"
import PageFallback from "../../components/PageFallback"
import constructorObjectService from "../../services/constructorObjectService"
import constructorSectionService from "../../services/constructorSectionService"
import { sortByOrder } from "../../utils/sortByOrder"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import MainInfo from "./MainInfo"
import constructorRelationService from "../../services/constructorRelationService"
import IconGenerator from "../../components/IconPicker/IconGenerator"
import ObjectsPage from "."
import InfoIcon from '@mui/icons-material/Info';
 
const ObjectsFormPage = () => {
  const { tableSlug, id } = useParams()
  const navigate = useNavigate()
  
  const tablesList = useSelector((state) => state.constructorTable.list)
 
  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)

  const [sections, setSections] = useState([])
  const [tableRelations, setTableRelations] = useState([])

  const tableInfo = useMemo(() => {
    return tablesList.find((el) => el.slug === tableSlug)
  }, [tablesList, tableSlug])

  const computedSections = useMemo(() => {
    return (
      sections
        ?.map((section) => ({
          ...section,
          column1:
            section.fields
              ?.filter((field) => field.column !== 2)
              .sort(sortByOrder) ?? [],
          column2:
            section.fields
              ?.filter((field) => field.column === 2)
              .sort(sortByOrder) ?? [],
        }))
        .sort(sortByOrder) ?? []
    )
  }, [sections])

  const getAllData = async () => {
    const getSections = constructorSectionService.getList({
      table_slug: tableSlug,
    })

    const getFormData = constructorObjectService.getById(tableSlug, id)

    const getRelations = constructorRelationService.getList({
      table_slug: tableSlug,
    })

    try {
      const [{ sections = [] }, { data = {} }, { relations = [] }] =
        await Promise.all([getSections, getFormData, getRelations])

      setSections(sections)

      setTableRelations(
        relations
          .filter(
            (relation) =>
              (relation.type === "Many2One" &&
                relation.table_to?.slug === tableSlug) ||
              (relation.type === "One2Many" &&
                relation.table_from?.slug === tableSlug)
          )
          .map((relation) => ({
            ...relation,
            relatedTable:
              relation.type === "Many2One"
                ? relation.table_from
                : relation.table_to,
          }))
      )

      reset(data.response ?? {})
    } finally {
      setLoader(false)
    }
  }

  const getFields = async () => {
    try {
      const { sections = [] } = await constructorSectionService.getList({
        table_slug: tableSlug,
      })

      setSections(sections)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    if (!tableInfo) return
    if (id) getAllData()
    else getFields()
  }, [id, tableInfo])

  const update = (data) => {
    setBtnLoader(true)

    constructorObjectService
      .update(tableSlug, { data })
      .then(() => navigate(-1))
      .catch(() => setBtnLoader(false))
  }

  const create = (data) => {
    setBtnLoader(true)

    constructorObjectService
      .create(tableSlug, { data })
      .then(() => navigate(-1))
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (data) => {
    if (id) update(data)
    else create(data)
  }

  const { handleSubmit, control, reset } = useForm()

  if (loader) return <PageFallback />

  return (
    <div>
      <Tabs direction={"ltr"} forceRenderTabPanel>
        <Header
          title={tableInfo.label}
          backButtonLink={-1}
          sticky
          subtitle={id ? "Edit" : "Create"}
          extra={
            <SaveButton loading={btnLoader} onClick={handleSubmit(onSubmit)} />
          }
        >
          {id && !!tableRelations?.length && <TabList>
            <Tab> <InfoIcon /> Main info</Tab>

            {tableRelations?.map((relation) => (
              <Tab>
                <IconGenerator icon={relation.relatedTable.icon} />
                {relation.relatedTable.label}
              </Tab>
            ))}
          </TabList>}
        </Header>

        <TabPanel>
          <MainInfo control={control} computedSections={computedSections} />
        </TabPanel>

        {tableRelations?.map((relation) => (
          <TabPanel>
            <ObjectsPage
              relation={relation}
              isRelation
              tableSlug={relation.relatedTable.slug}
              filters={{ [`${tableSlug}_id`]: id }}
            />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}

export default ObjectsFormPage
