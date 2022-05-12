import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
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
import { sortByOrder } from "../../../../utils/sortByOrder"
import Relations from "./Relations"
import constructorRelationService from "../../../../services/constructorRelationService"
import { computeSections, computeSectionsOnSubmit } from "../utils"

const ConstructorTablesFormPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id, slug } = useParams()

  const allConstructorTables = useSelector(
    (state) => state.constructorTable.list
  )

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)

  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      sections: [],
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  })

  const getData = async () => {
    setLoader(true)

    const getTableData = constructorTableService.getById(id)

    const getFieldsData = constructorFieldService.getList({ table_id: id })

    const getSectionsData = constructorSectionService.getList({ table_id: id })

    const getReletionsData = constructorRelationService.getList({
      table_slug: slug,
    })

    try {
      const [
        tableData,
        { fields = [] },
        { sections = [] },
        { relations = [] },
      ] = await Promise.all([
        getTableData,
        getFieldsData,
        getSectionsData,
        getReletionsData,
      ])

      mainForm.reset({
        ...tableData,
        fields,
        sections: computeSections(sections),
        relations,
      })

      getRelationFields(relations)
    } finally {
      setLoader(false)
    }
  }

  const getRelationFields = async (relations = []) => {
    const tables = relations
      .filter(
        (relation) =>
          relation.type === "One2Many" && relation.table_from === slug
      )
      .map((relation) =>
        allConstructorTables.find((table) => table.slug === relation.table_to)
      )

    const actions = tables.map((table) =>
      constructorFieldService.getList({ table_id: table.id })
    )

    const fields = await Promise.all(actions)

    const computedFields = fields.map((field) =>
      field.fields.map((field) => ({
        ...field,
        table_slug: tables.find((table) => table.id === field.table_id)?.slug,
      }))
    )

    if(!computedFields?.length) return

    mainForm.setValue("fields", [
      ...mainForm.getValues('fields'),
      ...[].concat(...computedFields)
    ])
  }
  

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

    const updateTableData = constructorTableService.update(data)

    const updateSectionData = constructorSectionService.update({
      sections: data.sections ?? [],
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
    const computedData = {
      ...data,
      sections: computeSectionsOnSubmit(data.sections),
    }

    if (id) updateConstructorTable(computedData)
    else createConstructorTable(computedData)
  }

  useEffect(() => {
    if (!id) setLoader(false)
    else getData()
  }, [id])

  if (loader) return <PageFallback />

  return (
    <div>
      <Tabs direction={"ltr"}>
        <Header
          title="Objects"
          subtitle={id ? mainForm.getValues("label") : "Добавить"}
          icon={mainForm.getValues("icon")}
          backButtonLink={-1}
          sticky
          extra={
            <SaveButton
              onClick={mainForm.handleSubmit(onSubmit)}
              loading={btnLoader}
            />
          }
        >
          <TabList>
            <Tab>Details</Tab>
            <Tab>Layouts</Tab>
            <Tab>Fields</Tab>
            <Tab>Relations</Tab>
          </TabList>
        </Header>

        <TabPanel>
          <MainInfo control={mainForm.control} />
        </TabPanel>

        <TabPanel>
          <Layout mainForm={mainForm} />
        </TabPanel>

        <TabPanel>
          <Fields mainForm={mainForm} />
        </TabPanel>

        <TabPanel>
          <Relations mainForm={mainForm} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ConstructorTablesFormPage
