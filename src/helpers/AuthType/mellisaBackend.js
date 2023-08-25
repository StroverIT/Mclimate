import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import * as url from "../url_helper"
import accessToken from "../jwt-token-access/accessToken"

import {
  calenderDefaultCategories,
  chats,
  contacts,
  comments,
  events,
  groups,
  messages,
  orders,
  productsData,
  customerData,
  shops,
  invoiceList,
  cartData,
  users as members,
  userProfile,
} from "../../common/data"

let users = [
  {
    "client_id" : "6062d8a17f26e",
    "client_secret" : "6062d8a17f1ce",
    "username" : "office@seemelissa.com",
    "password" : "officeTest123"
  }
]

// let apiUrl = 'https://developer-api.seemelissa.com/v1';

const mellisaBackend = () => {
  // axios.defaults.baseURL = apiUrl;

  // Important: If axios is used with multiple domains, the AUTH_TOKEN will be sent to all of them.
  // See below for an example using Custom instance defaults instead.
  // axios.defaults.headers.common['Authorization'] = 'Bearer c131ac5a57f792775b422ec4779252d256086345';

  // axios.defaults.headers.get['Content-Type'] = 'application/json';
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axios,  { retry: 5, retryDelay: 1000, delayResponse: 2000, onNoMatch: "throwException" })

  mock.onPost(url.POST_LOGIN).reply(data => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // console.log('data:', data);
        resolve([200, {}])
      })
    })
  })

  mock.onGet(url.GET_CONTROLLERS).reply(config => {
    console.log('mock:', url.GET_CONTROLLERS);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('GET_CONTROLLERS:', config);
        resolve([200, {}])
      })
    })
  })
  mock.onGet(url.GET_CONTROLLERS).networkError();
  mock.onGet(url.GET_CONTROLLERS).timeout();
}

export default mellisaBackend
