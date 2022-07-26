import { createSlice } from "@reduxjs/toolkit"

export const { actions: tableColumnActions, reducer: tableColumnReducer } =
  createSlice({
    name: "tableColumn",
    initialState: {
      list: {},
      groupColumnIds: {},
    },
    reducers: {
      setList: (state, { payload: { tableSlug, columns } }) => {
        if (!state.list[tableSlug]) {
          state.list[tableSlug] = columns.map((column) => ({
            ...column,
            isVisible: true,
            isFilterVisible: false
          }))
        } else {
          const newColumns = []

          columns.forEach((column) => {
            const index = state.list[tableSlug]?.findIndex(
              (item) => item.id === column.id
            )

            if (index === -1) {
              newColumns.push({ ...column, isVisible: true })
            } else {
              state.list[tableSlug][index] = {
                ...column,
                isVisible: state.list[tableSlug][index].isVisible,
                isFilterVisible: state.list[tableSlug][index].isFilterVisible,
              }
            }
          })

          state.list[tableSlug] = [
            ...state.list[tableSlug],
            ...newColumns,
          ].filter(
            (el) => columns.findIndex((column) => column.id === el.id) > -1
          )
        }
      },
      setColumnVisible: (
        state,
        { payload: { tableSlug, index, isVisible } }
      ) => {
        state.list[tableSlug][index].isVisible = isVisible
      },

      setColumnFilterVisible: (
        state,
        { payload: { tableSlug, index, isFilterVisible } }
      ) => {
        state.list[tableSlug][index].isFilterVisible = isFilterVisible
      },

      setAllColumnsVisible: (state, { payload: { tableSlug, isVisible } }) => {
        state.list[tableSlug].forEach((column) => {
          column.isVisible = isVisible
        })
      },
      setColumnsPosition: (state, { payload: { tableSlug, columns } }) => {
        state.list[tableSlug] = columns
      },
      setGroupColumnId: (state, { payload: { tableSlug, id } }) => {
        state.groupColumnIds[tableSlug] = id
      },
    },
  })
