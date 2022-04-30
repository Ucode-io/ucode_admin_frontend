import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Tab, TabList, Tabs, TabPanel } from "react-tabs"
import SaveButton from "../../../../components/Buttons/SaveButton"
import Header from "../../../../components/Header"
import PageFallback from "../../../../components/PageFallback"
import constructorSectionService from "../../../../services/constructorSectionService"
import constructorFieldService from "../../../../services/constructorFieldService"
import constructorTableService from "../../../../services/constructorTableService"
import { constructorTableActions } from "../../../../store/constructorTable/constructorTable.slice"
import { createConstructorTableAction } from "../../../../store/constructorTable/constructorTable.thunk"
import Fields from "./Fields"
import Layout from "./Layout"
import MainInfo from "./MainInfo"

const ConstructorTablesFormPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)

  const { handleSubmit, control, reset, getValues } = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      sections: [],
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
  })

  const getData = useCallback(async () => {
    setLoader(true)

    const getTableData = constructorTableService.getById(id)

    const getFieldsData = constructorFieldService.getList({ table_id: id })

    const getSessionsData = constructorSectionService.getList({ table_id: id })

    try {
      const [tableData, { fields = [] }, { sections = [] }] = await Promise.all(
        [getTableData, getFieldsData, getSessionsData]
      )

      reset({
        ...tableData,
        fields,
        sections,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }, [id, reset])

  const createConstructorTable = (data) => {
    setBtnLoader(true)

    dispatch(createConstructorTableAction(data))
      .unwrap()
      .then((res) => {
        navigate("/constructor/tables")
      })
      .catch(() => setBtnLoader(false))
  }

  const updateConstructorTable = (data) => {
    setBtnLoader(true)

    const sections =
      data.sections.map((section, sectionIndex) => ({
        ...section,
        order: sectionIndex + 1,
        fields:
          section.fields.map((field, fieldIndex) => ({
            ...field,
            order: fieldIndex + 1,
          })) ?? [],
      })) ?? []

    const updateTableData = constructorTableService.update(data)

    const updateSectionData = constructorSectionService.update({
      sections,
      table_slug: data.slug,
      table_id: id,
    })

    Promise.all([updateTableData, updateSectionData])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data))
        navigate("/constructor/tables")
      })
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (data) => {
    if (id) updateConstructorTable(data)
    else createConstructorTable(data)
  }

  useEffect(() => {
    if (!id) setLoader(false)
    else getData()
  }, [getData, id])

  if (loader) return <PageFallback />

  return (
    <div>
      <Tabs direction={"ltr"}>
        <Header
          title="Objects"
          subtitle={id ? getValues("label") : "Добавить"}
          icon={getValues("icon")}
          backButtonLink={-1}
          sticky
          extra={
            <SaveButton onClick={handleSubmit(onSubmit)} loading={btnLoader} />
          }
        >
          <TabList>
            <Tab>Details</Tab>
            <Tab>Layouts</Tab>
            <Tab>Fields</Tab>
          </TabList>
        </Header>

        <TabPanel>
          <MainInfo control={control} />
        </TabPanel>

        <TabPanel>
          <Layout control={control} />
        </TabPanel>

        <TabPanel>
          <Fields control={control} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ConstructorTablesFormPage
