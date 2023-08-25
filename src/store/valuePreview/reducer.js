import {
  SET_VALUES,
  FILTER_DEVICES,
  SET_VALUE_WIDGET_EDIT_MODE
} from "./actionTypes";
import {
  OPERATION,
  TIMEFRAME_TYPES
} from "../../pages/CustomizableDashboard/components/EditWidgetModal/components/ValueEdit/components/Tabs/Timeframe/Timeframe";
import AppUtils from "../../common/AppUtils";

export const initialWidgetSettings = {
  settings: {
    backgroundColor: "#fff",
    color: "#000",
    icon: '',
  }
}

export const initialState = {
  values: {
    widgetTitle: '',
    widgetType: 'linear',
    value: 0,
    selectedDevice: null,
    field: null,
    unit: '',
    decimals: 0,
    config: {
      ...initialWidgetSettings,
      chartSettings: []
    },
    timeframeOperationType: TIMEFRAME_TYPES.CURRENT_VALUE,
    operation: OPERATION.MAXIMUM,
    timezone: null,
    from: null,
    until: null
  },
  filterDeviceText: '',
  editMode: false
}

const valueWidgetState = {
  ...AppUtils.createObjectCopy(initialState)
}

const widgetValueComponent = (state = valueWidgetState, action) => {
  switch (action.type) {
    case SET_VALUES:
      return {
        ...state,
        values: action.payload
      }
    case FILTER_DEVICES:
      return {
        ...state,
        filterDeviceText: action.payload
      }
    case SET_VALUE_WIDGET_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload
      }
    default:
      return state
  }
}
export default widgetValueComponent