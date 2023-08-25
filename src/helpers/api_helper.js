import axios from "axios"
import authHeader from "./jwt-token-access/auth-token-header"
import { Redirect } from "react-router-dom"
import {DefinedAxiosInstances} from "../App";

export let AxiosInstances = {}
export const API_ENTERPRISE_URL = process.env.REACT_APP_ENVIRONMENT === 'development' ? "" : ""
export const API_URL = ""
export const V1_POSTFIX = '/v1'


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  })

  failedQueue = [];
}


const getAuthToken = () => {
  if(localStorage.getItem("authUser")) { 
    const obj = JSON.parse(localStorage.getItem("authUser"))
    if(obj && obj.auth && obj.auth.access_token) {
      return obj.auth.access_token
    }
  }
  return null
}

/**
 * Summary:
 * Creates axios instances.
 * Note: create your instances in the App file
 */
export function createInstances(...instances) {
  const axiosInstances = {}
  instances.forEach(instance => {
    axiosInstances[instance.name] = axios.create(instance.config)
    interceptorsConfig(axiosInstances[instance.name]);
  })
  AxiosInstances = {...axiosInstances};
}

function interceptorsConfig(axiosInstance) {
  axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      if (error?.response?.data.status === 401 && !originalRequest?._retry) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({resolve, reject})
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          })
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          refreshToken(axiosInstance, error.config)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }
      console.log('error.response:', error.status)
      const errResponse = typeof error.response != "undefined" ? error.response : undefined
      return Promise.reject(errResponse);
    }
  )
}

const refreshToken = (axios, config) => {
	return new Promise((resolve, reject) => {
    const obj = JSON.parse(localStorage.getItem("authUser"))
    if (obj && obj.auth.refresh_token) {   
      const headers = {
        'Content-Type': 'application/json',
      } 
      post('/auth/renew', {
        client_id : process.env.REACT_APP_CLIENTID,
        client_secret : process.env.REACT_APP_CLIENTSECRET,
        refresh_token: obj.auth.refresh_token
      }, {headers: headers})
      .then((res) => {
        const newAccessToken = res.auth.access_token;
        const newConfig =  Object.assign({}, {...obj},{auth: {...obj.auth, access_token: newAccessToken}})
        localStorage.setItem("authUser", JSON.stringify(newConfig));
        setTimeout(() => {
            config.headers = authHeader();
            axios
              .request(config) // Repeat the initial request
            	.then((result) => {
                processQueue(null, newAccessToken);
            		return resolve(result);
            	})
            	.catch((err) => {
                processQueue(err, null);
                // localStorage.setItem("authUser", "")
                return (
                  <Redirect
                    to={{ pathname: "/" }}
                  />
                )
            	})
              .finally(() => { isRefreshing = false })
        });
			})
			.catch((err) => {
				console.log(err);
        // localStorage.setItem("authUser", "")
        return (
          <Redirect
            to={{ pathname: "/" }}
          />
        )        
			});
    }
	});
};

export async function get(url, config = {}, axiosInstance = DefinedAxiosInstances.BASE_URL) {
  if(getAuthToken()) {
    let headers = typeof config.headers != "undefined" ? {...config.headers} : {} 
    if(getAuthToken()) {
      Object.assign(headers, {Authorization: 'Bearer ' + getAuthToken()})
    }
    Object.assign(config, {headers: {...headers}})
  }

  return await AxiosInstances[axiosInstance]({
    method: 'get',
    url: url,
    ...config
  }).then(response => response.data).catch(e => e)
}

export async function post(url, data, config = {}, axiosInstance = DefinedAxiosInstances.BASE_URL) {
  let postData = { ...data };
  if (data instanceof FormData) {
    postData = data;
  }

  if(getAuthToken()) {
    let headers = typeof config.headers != "undefined" ? {...config.headers} : {} 
    if(getAuthToken()) {
      Object.assign(headers, {Authorization: 'Bearer ' + getAuthToken()})
    }
    Object.assign(config, {headers: {...headers}})
  }
  
  return await AxiosInstances[axiosInstance]({
    method: 'post',
    url: url,
    data: postData,
    ...config
  }).then(response => response.data).catch(e => e)
}

export async function patch(url, data, config = {}, axiosInstance = DefinedAxiosInstances.BASE_URL) {
  let postData = { ...data };
  if (data instanceof FormData) {
    postData = data;
  }

  if(getAuthToken()) {
    let headers = typeof config.headers != "undefined" ? {...config.headers} : {} 
    if(getAuthToken()) {
      Object.assign(headers, {Authorization: 'Bearer ' + getAuthToken()})
    }
    Object.assign(config, {headers: {...headers}})
  }

  return await AxiosInstances[axiosInstance]({
    method: 'patch',
    url: url,
    data: postData,
    ...config
  }).then(response => response.data)
}

export async function put(url, data, config = {},  axiosInstance = DefinedAxiosInstances.BASE_URL) {
  if(getAuthToken()) {
    let headers = typeof config.headers != "undefined" ? {...config.headers} : {} 
    if(getAuthToken()) {
      Object.assign(headers, {Authorization: 'Bearer ' + getAuthToken()})
    }
    Object.assign(config, {headers: {...headers}})
  }

  return await AxiosInstances[axiosInstance]({
    method: 'put',
    url: url,
    data: data,
    ...config
  }).then(response => response.data)
}

export async function del(url, config = {}, axiosInstance = DefinedAxiosInstances.BASE_URL) {
  if(getAuthToken()) {
    let headers = typeof config.headers != "undefined" ? {...config.headers} : {} 
    if(getAuthToken()) {
      Object.assign(headers, {Authorization: 'Bearer ' + getAuthToken()})
    }
    Object.assign(config, {headers: {...headers}})
  }

  return await AxiosInstances[axiosInstance]({
    method: 'delete',
    url: url,
    ...config
  }).then(response => response.data)
}
