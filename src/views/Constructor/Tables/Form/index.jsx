import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Tab, TabList, Tabs, TabPanel } from "react-tabs"
import SaveButton from "../../../../components/Buttons/SaveButton"
import Header from "../../../../components/Header"
import PageFallback from "../../../../components/PageFallback"
import contructorFieldService from "../../../../services/contructorFieldService"
import contructorTableService from "../../../../services/contructorTableService"
import {
  createConstructorTableAction,
  updateConstructorTableAction,
} from "../../../../store/contructorTable/contructorTable.thunk"
import Fields from "./Fields"
import MainInfo from "./MainInfo"

const ContructorTablesFormPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loader, setLoader] = useState(true)
  const [btnLoader, setBtnLoader] = useState(false)

  const { handleSubmit, control, reset, getValues } = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
  })

  const getData = useCallback(async () => {
    setLoader(true)

    const getTableData = () => {
      return contructorTableService.getById(id)
    }

    const getFieldsData = () => {
      return contructorFieldService.getList({ table_id: id })
    }

    try {
      const [tableData, { fields }] = await Promise.all([
        getTableData(),
        getFieldsData(),
      ])

      reset({
        ...tableData,
        fields,
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

    dispatch(updateConstructorTableAction(data))
      .unwrap()
      .then((res) => {
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
          <div>
            <h1>LAYOUT</h1>
          </div>
        </TabPanel>

        <TabPanel>
          <Fields control={control} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default ContructorTablesFormPage
