import React from "react";
import headlineIcon from "../../assets/images/common/heading_icon.svg";
import textIcon from "../../assets/images/common/text_icon.svg";
import imageIcon from "../../assets/images/common/image_photo_icon.svg";
import chartIcon from "../../assets/images/common/chart_line_analytics_icon.svg";
import booleanIcon from "../../assets/images/common/boolean_icon.svg";
import valueIcon from "../../assets/images/common/number_square_zero_bold_icon.svg";
import Headline from "./components/Widgets/Headline/Headline";
import Text from "./components/Widgets/Text/Text";
import Image from "./components/Widgets/Image/Image";
import Value from "./components/Widgets/Value/Value";
import Boolean from "./components/Widgets/Boolean/Boolean";
import Chart from "./components/Widgets/Chart/Chart";

export const Widgets = [
  {
    component: <Headline/>,
    type: 'headline',
    title: "Headline",
    description: "Displays a headline",
    icon: headlineIcon,
    data: {
      value: 'New Headline'
    },
    settings: {
      textAlign: "center",
      size: 1,
      backgroundColor: "#fff",
      color: "#55ADE1"
    }
  },
  {
    component: <Text/>,
    type: 'text',
    title: "Text",
    description: "Displays a text widget",
    icon: textIcon,
    data: {
      value: 'New Text'
    },
    settings: {
      textAlign: "center",
      backgroundColor: "#fff",
      color: "#000"
    }
  },
  {
    component: <Image/>,
    type: 'image',
    title: "Image",
    description: "Displays an image",
    icon: imageIcon,
    data: {
      value: null,
      showBackground: true,
      addLink: true,
      url: "",
      openInNewTab: true
    },
    settings: {
      backgroundSize: "contain",
      backgroundColor: "#fff"
    }
  },
  {
    component: <Value />,
    type: 'value',
    title: "Value",
    description: "Displays a measurement",
    icon: valueIcon
  },
  {
    component: <Boolean/>,
    type: 'boolean',
    title: "Boolean",
    description: "Displays a boolean state",
    icon: booleanIcon
  },
  {
    component: <Chart/>,
    type: 'chart',
    title: "Chart",
    description: "Displays a chart",
    icon: chartIcon
  },
]