import AppUtils from "../../common/AppUtils";
import {
  SET_IFRAME_WIDGET_DATA,
   SET_IFRAME_WIDGET_EDIT_MODE,
   SET_IFRAME_WIDGET_VALUES
} from "./actionTypes";

export const initialIFrameWidgetSettings = {
  settings: {
    titleColor: "#000",
    icon: 'uil-toggle-off',
    displayOnColor: '#A2D633',
    displayOffColor: '#EF3339',
    backgroundColor: '#FFFFFF',
  }
}

export const initialIframeWidgetState = {
  values: {
    title: '',
    iframe: "",
    isHiddenBg: false,
    isFullScreenHeight: false,
    selectedDevice: null,
    config: {
      ...initialIFrameWidgetSettings,
    },
    widgetValue: true,
  },
  editMode: false,
}

const iframeWidgetState = {
  ...AppUtils.createObjectCopy(initialIframeWidgetState)
}

const iframeWidget = (state = iframeWidgetState, action) => {
  switch (action.type) {
    case SET_IFRAME_WIDGET_VALUES:
      // console.log("SET_IFRAME_WIDGET_VALUES", action.payload);

      return {
        ...state,
        values: action.payload
      }
   
    case SET_IFRAME_WIDGET_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload
      }
    case SET_IFRAME_WIDGET_DATA:
      return {
        ...state,
        chartData: action.payload
      }
    default:
      return state
  }
}
export default iframeWidget