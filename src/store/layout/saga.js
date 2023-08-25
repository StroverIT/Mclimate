// @flow
import { all, call, fork, takeEvery, put, select } from "redux-saga/effects"

import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_TYPE,
  CHANGE_TOPBAR_THEME,
  SHOW_RIGHT_SIDEBAR,
  CHANGE_DASHBOARD_MODE,
  SET_DASHBOARD_DATE,
  SET_TABLE_COLUMNS,
  SET_ERROR,
  ADD_TOAST,
  CLEAR_TOAST,
  GET_APP_DATA
} from "./actionTypes"

import {
  changeSidebarType as changeSidebarTypeAction,
  changeTopbarTheme as changeTopbarThemeAction,
  toggleDashboardMode, dashboardDate, tableColumns,
  setNError, addNToast, clearNToast, setLoadingAppData
} from "./actions"
import {getBuildingsSuccess} from "../buildings/actions";
import {fetchBuildings, fetchDashboards, getBuildingsSubscriptions, getUserProfile} from "../../helpers/backend_helper";

/**
 * Changes the body attribute
 */
function changeBodyAttribute(attribute, value) {
  if (document.body) document.body.setAttribute(attribute, value)
  return true
}

/**
 * Toggle the class on body
 * @param {*} cssClass
 */
function manageBodyClass(cssClass, action = "toggle") {
  switch (action) {
    case "add":
      if (document.body) document.body.classList.add(cssClass)
      break
    case "remove":
      if (document.body) document.body.classList.remove(cssClass)
      break
    default:
      if (document.body) document.body.classList.toggle(cssClass)
      break
  }

  return true
}

const getUser = state => state.Profile.user
const getUserBuildings = state => state.buildings.buildings

function* loadAppData(props) {
  yield put(setLoadingAppData(true))
  try {
    let user = yield select(getUser);
    let building = yield select(getUserBuildings);

    if (building.length === 0) {
      const response = yield call(fetchBuildings, {});
      let buildings = [];

      if (response._embedded) {
        buildings = response._embedded.BuildingManagement;
        if (buildings.length > 0) {
          const dashboards = yield call(fetchDashboards);
          const subscriptions = yield call(getBuildingsSubscriptions);
          buildings.forEach(building => {
            building['dashboards'] = dashboards?.length > 0 ? dashboards.filter(dashboard => dashboard?.buildingId === building.id) : [];
            building['subscriptions'] = subscriptions?.length > 0 ? subscriptions.filter(subscription => subscription?.buildingId === building.id) : null;
          })
        }
      }
      yield put(getBuildingsSuccess(buildings))
    }

    yield put(setLoadingAppData(false))
  } catch (error) {
    yield put(setLoadingAppData(false))
    console.log(error)
  }
}

/**
 * Changes the layout type
 * @param {*} param0
 */
function* changeLayout({ payload: layout }) {
  try {
    if (layout === "horizontal") {
      yield put(changeTopbarThemeAction("light"))
      document.body.removeAttribute("data-sidebar")
      document.body.removeAttribute("data-sidebar-size")
    } else {
      yield put(changeTopbarThemeAction("light"))
    }
    yield call(changeBodyAttribute, "data-layout", layout)
  } catch (error) {}
}

/**
 * Changes the layout width
 * @param {*} param0
 */
function* changeLayoutWidth({ payload: width }) {
  try {
    if (width === "boxed") {
      yield put(changeSidebarTypeAction("icon"))
      yield call(changeBodyAttribute, "data-layout-size", width)
      yield call(changeBodyAttribute, "data-layout-scrollable", false)
    } else if (width === "scrollable") {
      yield put(changeSidebarTypeAction("default"))
      yield call(changeBodyAttribute, "data-layout-scrollable", true)
    } else {
      yield put(changeSidebarTypeAction("default"))
      yield call(changeBodyAttribute, "data-layout-size", width)
      yield call(changeBodyAttribute, "data-layout-scrollable", false)
    }
  } catch (error) {}
}

/**
 * Changes the left sidebar theme
 * @param {*} param0
 */
function* changeLeftSidebarTheme({ payload: theme }) {
  try {
    yield call(changeBodyAttribute, "data-sidebar", theme)
  } catch (error) {}
}

/**
 * Changes the topbar theme
 * @param {*} param0
 */
function* changeTopbarTheme({ payload: theme }) {
  try {
    yield call(changeBodyAttribute, "data-topbar", theme)
  } catch (error) {}
}

/**
 * Changes the left sidebar type
 * @param {*} param0
 */
function* changeLeftSidebarType({ payload: { sidebarType, isMobile } }) {
  try {
    switch (sidebarType) {
      case "compact":
        yield call(changeBodyAttribute, "data-sidebar-size", "small")
        yield call(manageBodyClass, "sidebar-enable", "remove")
        break
      case "icon":
        yield call(changeBodyAttribute, "data-keep-enlarged", "true")
        break
      case "condensed":
        // yield call(manageBodyClass, "sidebar-enable", "add")
        // if (!isMobile) yield call(manageBodyClass, "vertical-collpsed", "add")
        yield call(manageBodyClass, "sidebar-enable", "add")
        if (window.screen.width >= 992) {
          yield call(manageBodyClass, "sidebar-enable", "remove")
          yield call(manageBodyClass, "sidebar-enable", "add")
        } else {
          yield call(manageBodyClass, "sidebar-enable", "add")
        }
        break
      default:
        yield call(changeBodyAttribute, "data-sidebar-size", "")
        yield call(manageBodyClass, "sidebar-enable", "remove")
        if (!isMobile)
        break
    }
  } catch (error) {}
}

/**
 * Show the rightsidebar
 */
function* showRightSidebar() {
  try {
    yield call(manageBodyClass, "right-bar-enabled", "add")
  } catch (error) {}
}


/**
 * Change dashboard mode
 */
 function* changeDashboardMode(mode) {
  try {
    yield call(toggleDashboardMode, mode)
  } catch (error) {}
}

/**
 * Set dashboard dates
 */
 function* setDashboardDate(date) {
  try {
    yield call(dashboardDate, date)
  } catch (error) {}
}

/**
 * Set table columns
 * currently working only for dashboard
 */
 function* setTableColumns(columns) {
  try {
    yield call(tableColumns, columns)
  } catch (error) {
    console.log(error)
  }
}

function* setError(data) {
  try {
    yield call(setNError, data)
  } catch (error) {
    console.log(error)
  }
}

function* addToast(data) {
  try {
    yield call(addNToast, data)
  } catch (error) {
    console.log(error)
  }
}

function* clearToast(data) {
  try {
    yield call(clearNToast, data)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Watchers
 */
export function* watchChangeLayoutType() {
  yield takeEvery(CHANGE_LAYOUT, changeLayout)
}

export function* watchChangeLayoutWidth() {
  yield takeEvery(CHANGE_LAYOUT_WIDTH, changeLayoutWidth)
}

export function* watchChangeLeftSidebarTheme() {
  yield takeEvery(CHANGE_SIDEBAR_THEME, changeLeftSidebarTheme)
}

export function* watchChangeLeftSidebarType() {
  yield takeEvery(CHANGE_SIDEBAR_TYPE, changeLeftSidebarType)
}

export function* watchChangeTopbarTheme() {
  yield takeEvery(CHANGE_TOPBAR_THEME, changeTopbarTheme)
}

export function* watchShowRightSidebar() {
  yield takeEvery(SHOW_RIGHT_SIDEBAR, showRightSidebar)
}

export function* watchDashboardMode() {
  yield takeEvery(CHANGE_DASHBOARD_MODE, changeDashboardMode)
}

export function* watchDashboardDate() {
  yield takeEvery(SET_DASHBOARD_DATE, setDashboardDate)
}

export function* watchTableColumns() {
  yield takeEvery(SET_TABLE_COLUMNS, setTableColumns)
}

export function* watchSetError() {
  yield takeEvery(SET_ERROR, setError)
}

export function* watchAddToast() {
  yield takeEvery(ADD_TOAST, addToast)
}

export function* watchClearToast() {
  yield takeEvery(CLEAR_TOAST, clearToast)
}

export function* getAppData() {
  yield takeEvery(GET_APP_DATA, loadAppData)
}


function* LayoutSaga() {
  yield all([
    fork(watchChangeLayoutType),
    fork(watchChangeLayoutWidth),
    fork(watchChangeLeftSidebarTheme),
    fork(watchChangeLeftSidebarType),
    fork(watchShowRightSidebar),
    fork(watchChangeTopbarTheme),
    fork(watchDashboardMode),
    fork(watchDashboardDate),
    fork(watchTableColumns),
    fork(watchSetError),
    fork(watchAddToast),
    fork(watchClearToast),
    fork(getAppData)
  ])
}

export default LayoutSaga
