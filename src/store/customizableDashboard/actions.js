import {
  SET_EDIT_MODE,
  OPEN_CLOSE_WIDGET_MODAL,
  SET_DASHBOARD,
  OPEN_CLOSE_EDIT_WIDGET_MODAL,
  SET_EDIT_WIDGET,
  OPEN_CLOSE_CREATE_DASHBOARD_MODAL,
  SET_PENDING_FOR_DATA_WIDGETS
} from "./actionTypes";

export const setEditMode = (isEditMode) => {
  return {
    type: SET_EDIT_MODE,
    payload: isEditMode,
  }
}

export const openCloseWidgetModal = (isOpen) => {
  return {
    type: OPEN_CLOSE_WIDGET_MODAL,
    payload: isOpen,
  }
}

export const setDashboard = (dashboard) => {
  return {
    type: SET_DASHBOARD,
    payload: dashboard,
  }
}

export const openCloseEditWidgetModal = (isOpen) => {
  return {
    type: OPEN_CLOSE_EDIT_WIDGET_MODAL,
    payload: isOpen,
  }
}

export const openCloseCreateDashboardModal = (modalData) => {
  return {
    type: OPEN_CLOSE_CREATE_DASHBOARD_MODAL,
    payload: modalData,
  }
}

export const setEditWidget = (widget) => {
  return {
    type: SET_EDIT_WIDGET,
    payload: widget,
  }
}

export const setPendingForDataWidgets = (widgets) => {
  let pendingWidgets = {};
  if (Array.isArray(widgets)) {
    widgets.forEach(widget => {
      if (widget.type === 'chart' || widget.type === 'value' || widget.type === 'boolean') {
        pendingWidgets[widget.id] = {
          pending: true
        }
      }
    })
  } else {
    pendingWidgets = widgets
  }

  return {
    type: SET_PENDING_FOR_DATA_WIDGETS,
    payload: pendingWidgets,
  }
}