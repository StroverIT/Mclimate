export default function authHeader() {
  const obj = localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser")) : null

  if (obj && obj.auth.access_token) {
    return { Authorization: `${obj.auth.token_type} ${obj.auth.access_token}` }
  } else {
    return {}
  }
}
