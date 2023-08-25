import {
  GET_DEVICE,
  TRANSFORM_COMPONENT_ACTIVE,
  REMOVE_DEVICE,
  SET_UPDATE_DEVICE,
  SET_PLAN,
  SET_EDIT_MODE,
  OPEN_CLOSE_CONTROLLER_MODAL,
  FILTER_DEVICES,
  SET_INITIAL_STATE, SET_FP_SCALE,
  SAVE_BUILDING_FLOORPLANS
} from "./actionTypes";

const initialState = {
  plan: null,
  device: null,
  transformComponentActive: false,
  isEditMode: false,
  isControllerModalOpen: false,
  filterDeviceText: '',
  fpScale: { scale: 1 }
}

const floorPlan = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAN:
      return {
        ...state,
        plan: action.payload
      }
    case SET_UPDATE_DEVICE:
      return {
        ...state,
        device: action.payload
      }
    case GET_DEVICE:
      return {
        ...state,
        device: action.payload
      }
    case REMOVE_DEVICE:
      return {
        ...state,
        plan: {
          ...state.plan,
          devices: state.plan.devices.filter(device => device.id !== action.payload)
        },
        device: null
      }
    case TRANSFORM_COMPONENT_ACTIVE:
      return {
        ...state,
        transformComponentActive: action.payload
      }
    case SET_EDIT_MODE:
      return {
        ...state,
        isEditMode: action.payload
      }
    case OPEN_CLOSE_CONTROLLER_MODAL:
      return {
        ...state,
        isControllerModalOpen: action.payload
      }
    case FILTER_DEVICES:
      return {
        ...state,
        filterDeviceText: action.payload
      }
    case SET_INITIAL_STATE:
      return initialState;
    case SET_FP_SCALE:
      return {
        ...state,
        fpScale: action.payload
      }
    case SAVE_BUILDING_FLOORPLANS:
      {
        const { id, floorPlans } = action.payload;
        return {
          ...state,
          [id]: floorPlans.filter(fp => fp !== null ),
        }
      }
    default:
      return state
  }
}

export default floorPlan