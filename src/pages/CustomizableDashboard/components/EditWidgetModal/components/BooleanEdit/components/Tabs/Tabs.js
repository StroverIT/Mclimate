import {createRef} from "react";
import Basic from "./Basic/Basic";
import Data from "./Data/Data";
import Appearance from "./Appearance/Appearance";


export const TAB = {
  BASIC: 0,
  DATA: 1,
  APPEARANCE: 2,
}

export const booleanWidgetTabs = [
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
    component: <Appearance />,
    index: TAB.APPEARANCE
  },
]