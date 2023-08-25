import {
  GET_BUILDINGS,
  GET_BUILDINGS_SUCCESS,
  START_LOAD_BUILDINGS,
  END_LOAD_BUILDINGS,
  GET_BUILDING_ASSET,
  GET_BUILDING_ASSET_SUCCESS,
  GET_BUILDING_USERS,
  GET_BUILDING_USERS_SUCCESS,
  CREATE_BUILDING_ASSET,
  CREATE_BUILDING_ASSET_SUCCESS,
  END_SAVE_BUILDING,
  UPDATE_BUILDING_ASSET,
  UPDATE_BUILDING_ASSET_SUCCESS,
  DELETE_BUILDING_ASSET,
  CLEAR_BUILDINGS,
  ASSIGN_BUILDING_USER,
  UPDATE_BUILDING_USER,
  DELETE_BUILDING_USER,
  UPDATE_BUILDING_DEVICES,
  DELETE_BUILDING_ASSET_SUCCESS,
  UPDATE_BUILDING_DEVICES_SUCCESS,
  ASSIGN_BUILDING_USER_SUCCESS,
  SET_SELECTED_BUILDING_ID
} from "./actionTypes"

// list
export const clearBuildings = () => ({
  type: CLEAR_BUILDINGS
})

export const getBuildings = (data) => ({
  type: GET_BUILDINGS,
  payload: data
})

export const getBuildingsSuccess = data => ({
  type: GET_BUILDINGS_SUCCESS,
  payload: data
})

export const getBuildingAsset = (asset, id) => ({
  type: GET_BUILDING_ASSET,
  assetType: asset,
  id: id
})

export const getBuildingAssetSuccess = (assetType, data) => ({
  type: GET_BUILDING_ASSET_SUCCESS,
  assetType: assetType,
  payload: data
})

export const startLoading = () => ({
  type: START_LOAD_BUILDINGS
})

export const endLoading = () => ({
  type: END_LOAD_BUILDINGS
})

//user
export const getBuildingUsers = (assetType, id) => ({
  type: GET_BUILDING_USERS,
  assetType: assetType,
  id: id
})

export const getBuildingUsersSuccess = data => ({
  type: GET_BUILDING_USERS_SUCCESS,
  payload: data
})

export const assignBuildingUser = (assetType, data, id, history) => ({
  type: ASSIGN_BUILDING_USER,
  assetType: assetType,
  payload: data,
  id: id,
  history
})

export const assignBuildingUserSuccess = (assetType, data, id) => ({
  type: ASSIGN_BUILDING_USER_SUCCESS,
  assetType: assetType,
  payload: data,
  id: id
})

export const updateBuildingUser = (data, id, history) => ({
  type: UPDATE_BUILDING_USER,
  payload: data,
  id: id,
  history
})

export const deleteBuildingUser = (id, history, callback = false) => ({
  type: DELETE_BUILDING_USER,
  id: id,
  history,
  callback
})

// create
export const createBuildingAsset = (assetType, data, history) => ({
  type: CREATE_BUILDING_ASSET,
  assetType: assetType,
  payload: data,
  history: history
})

export const createBuildingAssetSuccess = data => ({
  type: CREATE_BUILDING_ASSET_SUCCESS,
  payload: data
})

export const endSaving = () => ({
  type: END_SAVE_BUILDING
})

export const updateBuildingAsset = (assetType, data, id, buildingId, history) => ({
  type: UPDATE_BUILDING_ASSET,
  assetType: assetType,
  payload: data,
  id: id,
  buildingId,
  history: history
})

export const updateBuildingAssetSuccess = (assetType, data, id, buildingId, history) => ({
  type: UPDATE_BUILDING_ASSET_SUCCESS,
  assetType: assetType,
  payload: data,
  id: id,
  buildingId: buildingId,
  history: history
})

export const deleteBuildingAsset = (assetType, id, buildingId, history, callback) => ({
  type: DELETE_BUILDING_ASSET,
  assetType,
  id,
  buildingId,
  history,
  callback
})

export const deleteBuildingAssetSuccess = (assetType, id, buildingId) => ({
  type: DELETE_BUILDING_ASSET_SUCCESS,
  assetType: assetType,
  id: id,
  buildingId: buildingId
})

export const updateBuildingDevices = (assetType, data, id, buildingId, history, callback) => ({
  type: UPDATE_BUILDING_DEVICES,
  assetType: assetType,
  data: data,
  id: id,
  buildingId: buildingId,
  history,
  callback
})

export const updateBuildingDevicesSuccess = (assetType, data, id, buildingId, action) => ({
  type: UPDATE_BUILDING_DEVICES_SUCCESS,
  assetType: assetType,
  data: data,
  id: id,
  buildingId: buildingId,
  action
})

export const setBuildingId = (id) => ({
  type: SET_SELECTED_BUILDING_ID,
  payload: id
})

