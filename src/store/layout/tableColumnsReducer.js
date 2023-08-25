import {
  SET_TABLE_COLUMNS
} from "./actionTypes"

const INIT_STATE = {
  tableColumns: []
}

const TableColumns = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_TABLE_COLUMNS:
      return {
        ...state,
        [action.payload.type]: action.payload.columns,
      }

    default:
      return state
  }
}

export default TableColumns
