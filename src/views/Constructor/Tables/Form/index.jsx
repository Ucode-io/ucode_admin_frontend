import { useEffect, useState } from "react"
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
import Relations from "./Relations"
import constructorRelationService from "../../../../services/constructorRelationService"
import { computeSections, computeSectionsOnSubmit } from "../utils"
import { addOrderNumberToSections } from "../../../../utils/sectionsOrderNumber"

const ConstructorTablesFormPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id, slug } = useParams()

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

    // const getFieldsData = constructorFieldService.getList({ table_id: id })

    const getSectionsData = constructorSectionService.getList({ table_id: id })

    try {
      const [tableData, { sections = [] }] = await Promise.all(
        [getTableData, getSectionsData]
      )

      mainForm.reset({
        ...tableData,
        fields: [],
        sections: computeSections(sections),
      })

      await getRelationFields()
    } finally {
      setLoader(false)
    }
  }

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
     
      const getFieldsData = constructorFieldService.getList({ table_id: id })

      const getRelations = constructorRelationService.getList({
        table_slug: slug,
      })

      const [{ relations = [] }, { fields = [] }] = await Promise.all([getRelations, getFieldsData])


      mainForm.setValue("fields", fields)
      

      const relationsWithRelatedTableSlug = relations.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === slug ? "table_from" : "table_to",
      }))

      const layoutRelations = []
      const tableRelations = []

      relationsWithRelatedTableSlug.forEach((relation) => {
        if (
          (relation.type === "Many2One" && relation.table_from.slug === slug) ||
          (relation.type === "One2Many" && relation.table_to.slug === slug)
        )
          layoutRelations.push(relation)
        else tableRelations.push(relation)
      })
      const layoutRelationsFields = layoutRelations.map((relation) => ({
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label: relation[relation.relatedTableSlug]?.label,
      }))

      // const actions = layoutRelations.map(
      //   (relation) =>
      //     new Promise((resolve, reject) =>
      //       constructorFieldService
      //         .getList({ table_slug: relation[relation.relatedTableSlug]?.slug })
      //         .then((res) => {
      //           const computedFields =
      //             res.fields?.map((field) => ({
      //               ...field,
      //               table_slug: relation[relation.relatedTableSlug]?.slug,
      //               id: `${relation[relation.relatedTableSlug]?.slug}#${field.id}`
      //             })) ?? []

      //           const computedRelation = {
      //             ...relation,
      //             fields: computedFields,
      //           }

      //           resolve(computedRelation)
      //         })
      //         .catch((err) => {
      //           reject(err)
      //         })
      //     )
      // )
      // const layoutRelationsWithFields = await Promise.all(actions)

      mainForm.setValue("relations", relations)
      mainForm.setValue("layoutRelations", layoutRelationsFields)
      mainForm.setValue("tableRelations", tableRelations)

      resolve()
    })
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
      sections: addOrderNumberToSections(data.sections),
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
          <Relations
            mainForm={mainForm}
            getRelationFields={getRelationFields}
          />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ConstructorTablesFormPage
