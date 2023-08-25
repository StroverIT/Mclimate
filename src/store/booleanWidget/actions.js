import {FILTER_BOOLEAN_WIDGET_DEVICES, SET_BOOLEAN_WIDGET_VALUES} from "./actionTypes";

export const setBooleanWidgetValues = (values) => {
  return {
    type: SET_BOOLEAN_WIDGET_VALUES,
    payload: values,
  }
}

export const filterDevices = (filterText) => {
  return {
    type: FILTER_BOOLEAN_WIDGET_DEVICES,
    payload: filterText
  }
}