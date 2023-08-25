import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_TYPE,
  CHANGE_TOPBAR_THEME,
  SHOW_RIGHT_SIDEBAR,
  CHANGE_PRELOADER,
  TOGGLE_LEFTMENU,
  SHOW_SIDEBAR,
  CHANGE_DASHBOARD_MODE,
  SET_DASHBOARD_DATE,
  SET_ERROR,
  ADD_TOAST,
  CLEAR_TOAST,
  LOADING_APP_DATA,
} from "./actionTypes"

const INIT_STATE = {
  layoutType: "vertical",
  layoutWidth: "fluid",
  leftSideBarTheme: "light",
  leftSideBarType: "default",
  topbarTheme: "light",
  isPreloader: false,
  showRightSidebar: false,
  isMobile: false,
  showSidebar: true,
  leftMenu: true,
  dashboardMode: 'table',
  dashboardDate: {},
  tableColumns: [],
  error: false,
  errorMessage: 'Something went wrong. Please try again.',
  toasts: [],
  loadingAppData: true
}

const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOADING_APP_DATA:
      return {
        ...state,
        loadingAppData: action.payload,
      }
    case CHANGE_LAYOUT:
      return {
        ...state,
        layoutType: action.payload,
      }
    case CHANGE_PRELOADER:
      return {
        ...state,
        isPreloader: action.payload,
      }

    case CHANGE_LAYOUT_WIDTH:
      return {
        ...state,
        layoutWidth: action.payload,
      }
    case CHANGE_SIDEBAR_THEME:
      return {
        ...state,
        leftSideBarTheme: action.payload,
      }
    case CHANGE_SIDEBAR_TYPE:
      return {
        ...state,
        leftSideBarType: action.payload.sidebarType,
      }
    case CHANGE_TOPBAR_THEME:
      return {
        ...state,
        topbarTheme: action.payload,
      }
    case SHOW_RIGHT_SIDEBAR:
      return {
        ...state,
        showRightSidebar: action.payload,
      }
    case SHOW_SIDEBAR:
      return {
        ...state,
        showSidebar: action.payload,
      }
    case TOGGLE_LEFTMENU:
      return {
        ...state,
        leftMenu: action.payload,
      }

    case CHANGE_DASHBOARD_MODE:
      return {
        ...state,
        dashboardMode: action.payload,
      }

    case SET_DASHBOARD_DATE:
      return {
        ...state,
        dashboardDate: action.payload,
      }

    case SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        errorMessage: action.payload.message
      }

    case ADD_TOAST:
      return {
        ...state,
        toasts: state.toasts !== undefined ? [...state.toasts, action.payload] : [action.payload]
      }

    case CLEAR_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(t => t.time !== action.payload)
      }

    default:
      return state
  }
}

export default Layout
