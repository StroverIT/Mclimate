import {
  SET_VALUES,
  FILTER_DEVICES,
  SET_VALUE_WIDGET_EDIT_MODE
} from "./actionTypes";

export const setValues = (values) => {
  return {
    type: SET_VALUES,
    payload: values,
  }
}

export const filterDevices = (filterText) => {
  return {
    type: FILTER_DEVICES,
    payload: filterText
  }
}

export const setValueWidgetEditMode = (editMode) => {
  return {
    type: SET_VALUE_WIDGET_EDIT_MODE,
    payload: editMode
  }
}