import {createRef} from "react";
import Basic from "./Basic/Basic";
import Data from "./Data/Data";
import Appearance from "./Appearance/Appearance";
import Style from "./Style/Style";
import Timeframe from "./Timeframe/Timeframe";

export const TAB = {
  BASIC: 0,
  DATA: 1,
  APPEARANCE: 2,
  STYLE: 3,
  TIMEFRAME: 4
}

export const ValueWidgetTabs = [
  {
    ref: createRef(),
    component: <Basic/>,
    index: TAB.BASIC
  },
  {
    ref: createRef(),
    component: <Data/>,
    index: TAB.DATA
  },
  {
    ref: createRef(),
    component: <Appearance/>,
    index: TAB.APPEARANCE
  },
  {
    ref: createRef(),
    component: <Style/>,
    index: TAB.STYLE
  },
  {
    ref: createRef(),
    component: <Timeframe/>,
    index: TAB.TIMEFRAME
  },
]