import axios from "axios"
import { forEach, reject } from "lodash"
import { post, del, get, put, patch } from "./api_helper"
import * as url from "./url_helper"

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

// get Products
export const getProducts = () => get(url.GET_PRODUCTS)

// get Product detail
export const getProductDetail = id =>
  get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } })

// get Events
export const getEvents = () => get(url.GET_EVENTS)

// add Events
export const addNewEvent = event => post(url.ADD_NEW_EVENT, event)

// update Event
export const updateEvent = event => put(url.UPDATE_EVENT, event)

// delete Event
export const deleteEvent = event =>
  del(url.DELETE_EVENT, { headers: { event } })

// get Categories
export const getCategories = () => get(url.GET_CATEGORIES)

// get chats
export const getChats = () => get(url.GET_CHATS)

// get groups
export const getGroups = () => get(url.GET_GROUPS)

// get Contacts
export const getContacts = () => get(url.GET_CONTACTS)

// get messages
export const getMessages = (roomId = "") =>
  get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } })

// post messages
export const addMessage = message => post(url.ADD_MESSAGE, message)

// get orders
export const getOrders = () => get(url.GET_ORDERS)

// get cart data
export const getCartData = () => get(url.GET_CART_DATA)

// get customers
export const getCustomers = () => get(url.GET_CUSTOMERS)

// get shops
export const getShops = () => get(url.GET_SHOPS)

// get wallet
export const getWallet = () => get(url.GET_WALLET)

// get crypto order
export const getCryptoOrder = () => get(url.GET_CRYPTO_ORDERS)

// get invoices
export const getInvoices = () => get(url.GET_INVOICES)

// get invoice details
export const getInvoiceDetail = id =>
  get(`${url.GET_INVOICE_DETAIL}/${id}`, { params: { id } })

// get project
export const getProjects = () => get(url.GET_PROJECTS)

// get project details
export const getProjectsDetails = id =>
  get(`${url.GET_PROJECT_DETAIL}/${id}`, { params: { id } })

// get tasks
export const getTasks = () => get(url.GET_TASKS)

// get contacts
export const getUsers = () => get(url.GET_USERS)

export const getUserProfile = () => get(url.GET_USER_PROFILE)



// post mellisa login
export const postMellisaLogin = (data) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  return post(url.POST_LOGIN, data, {headers: headers})  
}

// get controllers
export const getControllers = (data) => {
  let getData = {params: data}
  // console.log('getData:', getData);
  return get(url.GET_CONTROLLERS, getData)
}

export const getController = (serial_number) => get(`${url.GET_CONTROLLERS}/${serial_number}`)

export const updateController = (data, serialNumber) => {
  const postUrl = (url.SET_CONTROLLER_ROOM).replace('%s', serialNumber); 
  return post(postUrl, data)
}

export const getVickiActuations = (serial_number) => {
  const getUrl = (url.GET_VICKI_ACTUATIONS).replace('%s', serial_number); 
  return get(getUrl)
}

export const setControllerLogsData = async ({serial_number, logs_from_date, logs_to_date}) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  let getData = {params: {from_date: logs_from_date, to_date: logs_to_date}}
  const getUrl = (url.GET_CONTROLLER_LOGS).replace('%s', serial_number); 
  return get(getUrl,  {headers: headers, ...getData})
}

export const getControllerCommandLogsData = async ({serial_number}) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  const getData = {params: {limit: 10, sort: '-created'}}
  const getUrl = (url.GET_CONTROLLER_COMMAND_LOGS).replace('%s', serial_number); 
  return get(getUrl,  {headers: headers, ...getData})
}

export const setControllerProviderData = async (controller) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  let postData = {serial_number: controller.serial_number}
  return post(url.GET_CONTROLLER_PROVIDER, postData, {headers: headers})
}

// get schedule
export const getSchedule = ({serial_number}) => {
  // console.log('serial_numberid:', serial_number);
  return get(`${url.GET_SCHEDULES}/${serial_number}`)
}

export const createSchedule = (data) => post(url.CREATE_SCHEDULES, data)

export const updateSchedule = ({id, name, color, controllers}) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  let formData = new FormData();
    formData.append('name', name);
    formData.append('color', color);
  return new Promise((resolve, reject) => {
    // assign room controller
    controllers.forEach(controller => {
      getControllerSchedules({
        serial_number: controller.serial_number
      })
    }); 
    patch(`${url.UPDATE_SCHEDULES}/${id}`, formData, {headers: headers}).then(response => {
      resolve(true)
    }).catch(e => {      
      console.log('createRoom error:', e)
      reject(e)
    });
  })
}

export const deleteSchedule = (id) => {
  const postUrl = (url.DELETE_SCHEDULES).replace('%s', id); 
  return del(`${postUrl}`)
}

export const getControllerSchedules = ({serial_number}) => {
  const getUrl = (url.GET_CONTROLLER_SCHEDULE).replace('%s', serial_number); 
  return get(getUrl)
}


// get rooms
export const getRooms = (data) => {
  return get(url.GET_ROOMS, data);
}

// get rooms
export const getRoom = ({id}) => {
  return get(`${url.GET_ROOMS}/${id}`)
}

export const createRoom = ({name, color, controllers}) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  let formData = new FormData();
    formData.append('name', name);
    formData.append('color', color);
  return new Promise((resolve, reject) => {
    post(url.CREATE_ROOM, formData, {headers: headers}).then(response => {
      const { rooms  } = response
      const roomId = rooms.id;
      controllers.forEach(controller => {
        setControllerRoom({
          serial_number: controller.serial_number,
          room_id: roomId
        })
      });      
      resolve(rooms)
    }).catch(e => {      
      console.log('createRoom error:', e)
      reject(e)
    });
  }) 
  
}

export const updateRoom = ({id, name, color, controllers}) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  let formData = new FormData();
    formData.append('name', name);
    formData.append('color', color);
  return new Promise((resolve, reject) => {
    // assign room controller
    controllers.forEach(controller => {
      setControllerRoom({
        serial_number: controller.serial_number,
        room_id: controller.room_id // set in component
      })
    }); 
    patch(`${url.UPDATE_ROOM}/${id}`, formData, {headers: headers}).then(response => {
      resolve(true)
    }).catch(e => {      
      console.log('createRoom error:', e)
      reject(e)
    });
  })
}

export const deleteRoom = (id) => {
  const postUrl = (url.DELETE_ROOM).replace('%s', id); 
  return del(`${postUrl}`)
}

export const setControllerRoom = ({serial_number, room_id}) => {
  const data = {room_id: room_id}
  const postUrl = (url.SET_CONTROLLER_ROOM).replace('%s', serial_number); 
  return post(postUrl, data)
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
