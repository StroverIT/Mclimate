import {
  GET_DEVICE,
  TRANSFORM_COMPONENT_ACTIVE,
  REMOVE_DEVICE,
  SET_UPDATE_DEVICE,
  SET_PLAN,
  SET_EDIT_MODE,
  OPEN_CLOSE_CONTROLLER_MODAL,
  FILTER_DEVICES,
  SET_INITIAL_STATE,
  SET_FP_SCALE,
  SAVE_BUILDING_FLOORPLANS
} from "./actionTypes";

export const setFloorPlan = (plan) => {
  return {
    type: SET_PLAN,
    payload: plan,
  }
}

export const setUpdateFPDevice = (device) => {
  return {
    type: SET_UPDATE_DEVICE,
    payload: device,
  }
}

export const getFPDevice = (device) => {
  return {
    type: GET_DEVICE,
    payload: device,
  }
}

export const removeFPDevice = (deviceId) => {
  return {
    type: REMOVE_DEVICE,
    payload: deviceId,
  }
}

export const setTransformComponentActive = (active) => {
  return {
    type: TRANSFORM_COMPONENT_ACTIVE,
    payload: active,
  }
}

export const setEditMode = (isEditMode) => {
  return {
    type: SET_EDIT_MODE,
    payload: isEditMode,
  }
}

export const openCloseControllerModal = (isOpen) => {
  return {
    type: OPEN_CLOSE_CONTROLLER_MODAL,
    payload: isOpen,
  }
}

export const filterDevices = (filterText) => {
  return {
    type: FILTER_DEVICES,
    payload: filterText,
  }
}

export const setInitialState = () => {
  return {
    type: SET_INITIAL_STATE,
    payload: null,
  }
}

export const setFpScale = (scale) => {
  return {
    type: SET_FP_SCALE,
    payload: scale,
  }
}

export const saveBuildingFloorPlans = (data) => {
  return {
    type: SAVE_BUILDING_FLOORPLANS,
    payload: data
  }
}