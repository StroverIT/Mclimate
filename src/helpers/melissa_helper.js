class MClimateAuthBackend {
  constructor() {
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
    })
  }

  /**
   * Registers the user with given details
   */
  editProfileAPI = (email, password) => {
    return new Promise((resolve, reject) => {
      
    })
  }

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
     
    })
  }

  /**
   * forget Password user with given details
   */
  forgetPassword = email => {
    return new Promise((resolve, reject) => {
      
    })
  }

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      
    })
  }
  setLoggeedInUser = user => {
    localStorage.setItem("authUser", JSON.stringify(user))
  }

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null
    return JSON.parse(localStorage.getItem("authUser"))
  }

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message
    return errorMessage
  }
}

let _mclimateBackend = null

/**
 * Initilize the backend
 * @param {*} config
 */
const initMClimateBackend = config => {
  if (!_mclimateBackend) {
    _mclimateBackend = new MClimateAuthBackend(config)
  }
  return _mclimateBackend
}

/**
 * Returns the firebase backend
 */
const getMClimateBackend = () => {
  return _mclimateBackend
}

export { initMClimateBackend, getMClimateBackend }
