import AppUtils from "../../common/AppUtils";
import {
  FILTER_BOOLEAN_WIDGET_DEVICES,
  SET_BOOLEAN_WIDGET_DATA,
  SET_BOOLEAN_WIDGET_EDIT_MODE,
  SET_BOOLEAN_WIDGET_VALUES
} from "./actionTypes";

export const initialBooleanWidgetSettings = {
  settings: {
    titleColor: "#000",
    icon: 'uil-toggle-off',
    displayOnColor: '#A2D633',
    displayOffColor: '#EF3339',
    backgroundColor: '#FFFFFF',
  }
}

export const initialBooleanWidgetState = {
  values: {
    widgetTitle: '',
    selectedDevice: null,
    config: {
      ...initialBooleanWidgetSettings,
    },
    displayOnText: '',
    displayOffText: '',
    widgetValue: true,
  },
  filterDeviceText: '',
  editMode: false,
  chartData: []
}

const booleanWidgetState = {
  ...AppUtils.createObjectCopy(initialBooleanWidgetState)
}

const booleanWidget = (state = booleanWidgetState, action) => {
  switch (action.type) {
    case SET_BOOLEAN_WIDGET_VALUES:
      return {
        ...state,
        values: action.payload
      }
    case FILTER_BOOLEAN_WIDGET_DEVICES:
      return {
        ...state,
        filterDeviceText: action.payload
      }
    case SET_BOOLEAN_WIDGET_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload
      }
    case SET_BOOLEAN_WIDGET_DATA:
      return {
        ...state,
        chartData: action.payload
      }
    default:
      return state
  }
}
export default booleanWidget