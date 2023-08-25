import axios from "axios"
import { post, del, get, patch } from "./api_helper"
import * as url from "./url_helper" 
import {DefinedAxiosInstances} from "../App";
import {DASHBOARDS, GET_PRODUCT_PRICES} from "./url_helper";
import {generatePath} from "react-router-dom";

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user")
  if (user) return JSON.parse(user)
  return null
}

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null
}

// Register Method
const postFakeRegister = (data) => post(url.POST_FAKE_REGISTER, data)

// Login Method
const postFakeLogin = data => post(url.POST_FAKE_LOGIN, data)

// postForgetPwd
const postFakeForgetPwd = data => post(url.POST_FAKE_PASSWORD_FORGET, data)

// Edit profile
const postJwtProfile = data => post(url.POST_EDIT_JWT_PROFILE, data)

const postFakeProfile = data => post(url.POST_EDIT_PROFILE, data)

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch(err => {
      let message
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found"
            break
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team"
            break
          case 401:
            message = "Invalid credentials"
            break
          default:
            message = err[1]
            break
        }
      }
      throw message
    })
}

// Login Method
const postJwtLogin = data => post(url.POST_FAKE_JWT_LOGIN, data)

// postForgetPwd
const postJwtForgetPwd = data => post(url.POST_FAKE_JWT_PASSWORD_FORGET, data)

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data)

// get contacts
export const getUsers = () => get(url.GET_USERS)

export const getUserProfile = () => get(url.USER_PROFILE, {headers: {"Accept-Response": "Advanced"}})
export const updateProfile = data => patch(url.USER_PROFILE, data)
export const getPersonalInfo = () => get(url.GET_PERSONAL_DATA)
export const delProfile = () => del(url.USER_PROFILE)


// post mellisa login
export const postMellisaLogin = (data) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  return post(url.POST_LOGIN, data, { headers: headers })
}

// post mclimate forgot password
export const postForgotPass = (data) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  return post(url.POST_FORGOT_PASS, data, { headers: headers })
}

// post register
export const postRegistration = (data) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  return post(url.POST_REGISTER, data, { headers: headers })
}

export const onRenameController = (name, serialNumber) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  const patchUrl = (url.RENAME_CONTROLLER).replace('%s', serialNumber);
  return patch(patchUrl, { name }, { headers: headers })
}

export const getControllerLogsData = async ({ serial_number, from_date = null, to_date = null, metric = null }) => {
  return true
}

export const setControllerProviderData = async (controller) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  let postData = { serial_number: controller.serial_number }
  return post(url.GET_CONTROLLER_PROVIDER, postData, { headers: headers })
}

export const assignDeviceToUser = async (serial_number, app_key) => {
  const user = localStorage.getItem("authUser")
  let parsedUser = JSON.parse(user);

  let accessToken = parsedUser.auth.access_token;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
  let postData = {
    app_key: app_key
  }

  const postUrl = (url.ASSIGN_DEVICE).replace('%s', serial_number);
  return post(postUrl, postData, { headers: headers })
}

// get schedule
export const getSchedule = ({ serial_number }) => {
  return get(`${url.GET_SCHEDULES}/${serial_number}`)
}

export const getAllSchedules = (sns) => {
  const user = localStorage.getItem("authUser")
  let parsedUser = JSON.parse(user);

  let accessToken = parsedUser.auth.access_token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
  let postData = {
    serial_numbers: sns
  }
  return post(url.GET_ALL_SCHEDULES, postData, { headers: headers })
}

export const createSchedule = (data) => post(url.CREATE_SCHEDULES, data)

export const updateSchedule = (data, id) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  const patchUrl = (url.UPDATE_SCHEDULES).replace('%s', id);
  return patch(patchUrl, data, { headers: headers })
}

export const deleteSchedule = (id) => {
  const postUrl = (url.DELETE_SCHEDULES).replace('%s', id);
  return del(`${postUrl}`)
}

export const getControllerSchedules = ({ serial_number }) => {
  const getUrl = (url.GET_CONTROLLER_SCHEDULE).replace('%s', serial_number);
  return get(getUrl)
}


// get rooms
export const getRooms = (data) => {
  return get(url.GET_ROOMS, data);
}

// get rooms
export const getRoom = ({ id }) => {
  return get(`${url.GET_ROOMS}/${id}`)
}

// get rooms
export const getRoomControllers = (data) => {
  return get(url.GET_ROOM_CONTROLLERS, { params: data })
}

export const createRoom = ({ name, color }) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  let formData = new FormData();
  formData.append('name', name);
  formData.append('color', color);
  return post(url.CREATE_ROOM, formData, { headers: headers })
}

export const updateRoom = ({ id, name, color }) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  const data = {
    name, color
  }
  // let formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('color', color);
  const patchUrl = (url.UPDATE_ROOM).replace('%s', id);
  return patch(patchUrl, data, { headers: headers })
}

export const deleteRoom = (id) => {
  const postUrl = (url.DELETE_ROOM).replace('%s', id);
  return del(`${postUrl}`)
}

export const deleteControllerRoom = (serialNumber) => {
  const deleteUrl = (url.DELETE_CONTROLLER_ROOM).replace('%s', serialNumber);
  return del(`${deleteUrl}`)
}

export const assignControllerRoom = ({ serial_number, room_id }) => {
  const data = { room_id }
  const postUrl = (url.ASSIGN_CONTROLLER_ROOM).replace('%s', serial_number);
  return post(postUrl, data)
}

export const reAssignControllerRoom = ({ serial_number, room_id }) => {
  const data = { room_id }
  const deleteUrl = (url.REASSIGN_CONTROLLER_ROOM).replace('%s', serial_number);
  return del(deleteUrl, data)
}

export const fetchBuildings = (data) => {
  return get(url.GET_BUILDINGS, data);
}

export const fetchDashboards = () => {
  return get(DASHBOARDS, {}, DefinedAxiosInstances.ENTERPRISE_URL);
}

export const fetchDashboardsByBuildingId = (id) => {
  return get(`${DASHBOARDS}building/${id}`, {}, DefinedAxiosInstances.ENTERPRISE_URL);
}

export const fetchBuildingAsset = ({ assetType, id }) => {
  return get(`${url.BUILDING_MANAGEMENT}/${assetType}/${id}`)
}

export const fetchBuildingUsers = ({ assetType, id }) => {
  return get(`${url.USER_MANAGEMENT}/${assetType}/${id}`)
}
export const createBuildingUser = ({ assetType, payload, id }) => {
  return post(`${url.USER_MANAGEMENT}/${assetType}/${id}`, payload)
}
export const editBuildingUser = ({ payload, id }) => {
  return patch(`${url.USER_MANAGEMENT}/${id}`, payload)
}
export const deleteBuildingsUser = ({ id }) => {
  return del(`${url.USER_MANAGEMENT}/${id}`)
}
export const createBuildingsAsset = ({ assetType, payload }) => {
  return post(`${url.BUILDING_MANAGEMENT}/${assetType}`, payload)
}
export const updateBuildingsAsset = ({ assetType, payload, id }) => {
  return patch(`${url.BUILDING_MANAGEMENT}/${assetType}/${id}`, payload)
}
export const deleteBuildingsAsset = ({ assetType, id }) => {
  return del(`${url.BUILDING_MANAGEMENT}/${assetType}/${id}`)
}
export const getAssetDevices = ({ assetType, data, id }) => {
  return get(`${url.DEVICE_MANAGEMENT}/${assetType}/${id}`, data)
}
export const createBuildingsDevice = ({ assetType, data, id }) => {
  return post(`${url.DEVICE_MANAGEMENT}/${assetType}/${id}`, data)
}
export const deleteBuildingsDevice = (id) => {
  return del(`${url.DEVICE_MANAGEMENT}/${id}`)
}
export const updateBuilding = (data, buildingId) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  const updateBuildingURL = (url.UPDATE_BUILDING).replace('%s', buildingId);
  return patch(updateBuildingURL, data, {headers: headers})
}

export const getBuildingsSubscriptions = () => {
  return get(`${url.GET_BUILDINGS_SUBSCRIPTIONS}`, {}, DefinedAxiosInstances.ENTERPRISE_URL)
}

export const getBuildingSubscriptions = (buildingId) => {
  return get(`${generatePath(url.GET_BUILDING_SUBSCRIPTIONS, {buildingId: buildingId})}`, {}, DefinedAxiosInstances.ENTERPRISE_URL)
}

// Floor plan
export const getFloorPlan = (floorId) => {
  return get(`${url.FLOOR_PLAN}/${floorId}`)
}
export const createFloorPlan = (data) => {
  return post(`${url.FLOOR_PLAN}`, data)
}
export const updateFloorPlan = (floorId, data) => {
  return post(`${url.FLOOR_PLAN}/${floorId}`, data)
}
export const deleteFloorPlan = (floorId) => {
  return del(`${url.FLOOR_PLAN}/${floorId}`)
}
// End of Floor plan

//  ENERGY MODEL
export const getControllerEnergyModel = (serial_number) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  const getUrl = (url.FETCH_CONTROLLER_ENERGY_MODEL).replace('%s', serial_number);
  return get(getUrl, { headers: headers })
}

export const changeControllerEnergyCalculationTime = (serial_number) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  const getUrl = (url.RESET_CONTROLLER_CALCULATIONS_TIME).replace('%s', serial_number);
  return get(getUrl, { headers: headers })
}

export const getWeatherInfo = ({lat, lng, appid = '82ff335b2fcd6b91cab67a80bb710fcd'}) => {
  if(lat && lng) return axios.get(`//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${appid}&units=metric`);
}


export const getSubscriptionPrices = (tag) => {
  return get(generatePath(GET_PRODUCT_PRICES, {productTag: tag}), {}, DefinedAxiosInstances.ENTERPRISE_URL)
}

export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
}
