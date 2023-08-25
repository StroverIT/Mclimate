import {HIDE_SPINNER, SHOW_SPINNER} from "./actionTypes";

const initialState = {
  loading: false
}

const appSpinner = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SPINNER:
      return {
        loading: true
      }
    case HIDE_SPINNER:
      return {
        loading: false
      }
    default:
      return state
  }
}

export default appSpinner