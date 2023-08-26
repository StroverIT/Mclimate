import { SET_IFRAME_WIDGET_VALUES} from "./actionTypes";

export const setIframeWidgetValues = (values) => {
  return {
    type: SET_IFRAME_WIDGET_VALUES,
    payload: values,
  }
}
