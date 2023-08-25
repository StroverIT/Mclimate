import {
  OPEN_CLOSE_CREATE_DASHBOARD_MODAL,
  OPEN_CLOSE_EDIT_WIDGET_MODAL,
  OPEN_CLOSE_WIDGET_MODAL,
  SET_DASHBOARD,
  SET_EDIT_MODE,
  SET_EDIT_WIDGET,
  SET_PENDING_FOR_DATA_WIDGETS
} from "./actionTypes";

const initialState = {
  isEditMode: false,
  isWidgetsModalOpen: false,
  isEditWidgetModalOpen: false,
  createDashboardModalData: {
    isModalOpen: false,
    buildingId: -1
  },
  dashboard: null,
  widget: null,
  pendingForDataWidgets: null
}

export const closeCreateDashboardModal = {
  isModalOpen: false,
  buildingId: -1
}

const customizableDashboard = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDIT_MODE:
      return {
        ...state,
        isEditMode: action.payload
      }
    case SET_DASHBOARD:
      return {
        ...state,
        dashboard: action.payload
      }
    case OPEN_CLOSE_WIDGET_MODAL:
      return {
        ...state,
        isWidgetsModalOpen: action.payload
      }
    case OPEN_CLOSE_EDIT_WIDGET_MODAL:
      return {
        ...state,
        isEditWidgetModalOpen: action.payload
      }
    case OPEN_CLOSE_CREATE_DASHBOARD_MODAL:
      return {
        ...state,
        createDashboardModalData: action.payload
      }
    case SET_EDIT_WIDGET:
      return {
        ...state,
        widget: action.payload
      }
    case SET_PENDING_FOR_DATA_WIDGETS:
      return {
        ...state,
        pendingForDataWidgets: action.payload
      }
    default:
      return state
  }
}
export default customizableDashboard