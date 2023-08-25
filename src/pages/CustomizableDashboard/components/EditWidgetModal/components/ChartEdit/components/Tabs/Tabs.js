import {createRef} from "react";
import Basic from "./Basic/Basic";
import Data from "./Data/Data";
import Axes from "./Axes/Axes";
import Timeframe from "./Timeframe/Timeframe";

export const TAB = {
  BASIC: 0,
  DATA: 1,
  AXES: 2,
  TIMEFRAME: 3
}

export const chartWidgetTabs = [
  {
    ref: createRef(),
    component: <Basic />,
    index: TAB.BASIC
  },
  {
    ref: createRef(),
    component: <Data />,
    index: TAB.DATA
  },
  {
    ref: createRef(),
    component: <Axes />,
    index: TAB.AXES
  },
  {
    ref: createRef(),
    component: <Timeframe />,
    index: TAB.TIMEFRAME
  },
]