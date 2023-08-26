import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// buildings
import buildings from "./buildings/reducer"

import appSpinner from "./spinner/reducer";
import floorPlan from "./floorPlan/reducer";
import customizableDashboard from "./customizableDashboard/reducer";
import widgetValueComponent from "./valuePreview/reducer";
import chartWidget from "./chartWidget/reducer";
import booleanWidget from "./booleanWidget/reducer";
import iframeWidget from "./iframeWidget/reducer";


const rootReducer = combineReducers({
  Layout,
  buildings,
  floorPlan,
  appSpinner,
  customizableDashboard,
  widgetValueComponent,
  chartWidget,
  booleanWidget,
  iframeWidget

})

export default rootReducer
