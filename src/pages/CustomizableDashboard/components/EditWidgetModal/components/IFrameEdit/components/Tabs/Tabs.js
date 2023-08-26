import {createRef} from "react";
import Basic from "./Basic/Basic";
import Appearance from "./Appearance/Appearance";


export const TAB = {
  BASIC: 0,
  APPEARANCE: 1,
}

export const iframeWidgetTabs = [
  {
    ref: createRef(),
    component: <Basic />,
    index: TAB.BASIC
  },
 
  {
    ref: createRef(),
    component: <Appearance />,
    index: TAB.APPEARANCE
  },
]