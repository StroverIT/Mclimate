import {
  FILTER_CHART_DEVICES,
  SET_CHART_WIDGET_EDIT_MODE,
  SET_CHART_VALUES,
  SET_CHART_DEVICES_MODAL,
  SET_CONTROLLERS_FIELDS,
  SET_CHART_DATA
} from "./actionTypes";

export const setChartWidgetValues = (values) => {
  return {
    type: SET_CHART_VALUES,
    payload: values,
  }
}

export const filterDevices = (filterText) => {
  return {
    type: FILTER_CHART_DEVICES,
    payload: filterText
  }
}

export const setChartWidgetEditMode = (editMode) => {
  return {
    type: SET_CHART_WIDGET_EDIT_MODE,
    payload: editMode
  }
}

export const setChartDevicesModal = (isOpenObj) => {
  return {
    type: SET_CHART_DEVICES_MODAL,
    payload: isOpenObj
  }
}

export const setControllersFields = (fields) => {
  return {
    type: SET_CONTROLLERS_FIELDS,
    payload: fields
  }
}

export const setChartData = (data) => {
  return {
    type: SET_CHART_DATA,
    payload: data,
  }
}