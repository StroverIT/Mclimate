import AppUtils from "../../common/AppUtils";
import {
  SET_CHART_VALUES,
  FILTER_CHART_DEVICES,
  SET_CHART_WIDGET_EDIT_MODE,
  SET_CHART_DEVICES_MODAL,
  SET_CONTROLLERS_FIELDS,
  SET_CHART_DATA
} from "./actionTypes";
import {
  CHART_TIMEFRAME_TYPES,
} from "../../pages/CustomizableDashboard/components/EditWidgetModal/components/ChartEdit/components/Tabs/Timeframe/Timeframe";
import moment from "moment";

export const initialChartWidgetSettings = {
  settings: {
    color: "#000",
    icon: 'uil-chart-bar',
  }
}

export const initialChartWidgetState = {
  values: {
    widgetTitle: '',
    selectedDevices: [],
    fields: [],
    config: {
      ...initialChartWidgetSettings,
    },
    timeframe: CHART_TIMEFRAME_TYPES.HOUR,
    from: null,
    until: null,
    timezone: null,
    dateFormat: {label: moment().format('DD-MMM-YYYY HH:mm'), value: 'DD-MMM-YYYY HH:mm'},
    xGrid: true
  },
  filterDeviceText: '',
  editMode: false,
  isChartDevicesModalOpen: {
    isOpen: false,
    selectedDeviceIndex: -1
  },
  controllersFields: {},
  chartData: []
}

const chartWidgetState = {
  ...AppUtils.createObjectCopy(initialChartWidgetState)
}

const chartWidget = (state = chartWidgetState, action) => {
  switch (action.type) {
    case SET_CHART_VALUES:
      return {
        ...state,
        values: action.payload
      }
    case FILTER_CHART_DEVICES:
      return {
        ...state,
        filterDeviceText: action.payload
      }
    case SET_CHART_WIDGET_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload
      }
    case SET_CHART_DEVICES_MODAL:
      return {
        ...state,
        isChartDevicesModalOpen: action.payload
      }
    case SET_CONTROLLERS_FIELDS:
      return {
        ...state,
        controllersFields: action.payload
      }
    case SET_CHART_DATA:
      return {
        ...state,
        chartData: action.payload
      }
    default:
      return state
  }
}
export default chartWidget