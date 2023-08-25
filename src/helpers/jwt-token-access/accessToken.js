const obj = localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser")) : null
let accessToken = null
if (obj && obj.auth.access_token) {
  accessToken = `${obj.auth.token_type} ${obj.auth.access_token}`
}
export default accessToken
