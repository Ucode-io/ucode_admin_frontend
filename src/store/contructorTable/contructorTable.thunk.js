import { createAsyncThunk } from "@reduxjs/toolkit"
import contructorTableService from "../../services/contructorTableService"
import { contructorTableActions } from "./contructorTable.slice"

export const fetchContructorTableListAction = createAsyncThunk(
  "object/fetchContructorTableList",
  async (_, { dispatch }) => {
    dispatch(contructorTableActions.setLoader(true))
    try {
      const res = await contructorTableService.getList()
      dispatch(contructorTableActions.setList(res.tables))
    } catch (error) {
      console.log(error)
      throw new Error(error)
    } finally {
      dispatch(contructorTableActions.setLoader(false))
    }
  }
)

export const createConstructorTableAction = createAsyncThunk(
  "object/createConstructorTable",
  async (data, { dispatch }) => {
    try {
      const res = await contructorTableService.create(data)

      dispatch(
        contructorTableActions.add({
          ...data,
          ...res,
        })
      )
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
)

export const updateConstructorTableAction = createAsyncThunk(
  "object/updateConstructorTable",
  async (data, { dispatch }) => {
    try {
      await contructorTableService.update(data)

      dispatch(
        contructorTableActions.setDataById(data)
      )
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
)

export const deleteConstructorTableAction = createAsyncThunk(
  "object/deleteConstructorTable",
  async (id, { dispatch }) => {
    dispatch(contructorTableActions.setLoader(true))
    try {
      await contructorTableService.delete(id)

      dispatch(
        contructorTableActions.delete(id)
      )
    } catch (error) {
      console.log(error)
      throw new Error(error)
    } finally {
      dispatch(contructorTableActions.setLoader(false))
    }
  }
)
