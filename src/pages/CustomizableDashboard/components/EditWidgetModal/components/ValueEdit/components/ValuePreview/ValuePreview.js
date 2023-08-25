import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import Linear from "./components/Linear/Linear";
import Gauge from "./components/GaugeChart/Gauge";
import {v4 as uuidv4} from "uuid";
import './valuePreview.scss'

const ValuePreview = () => {
  const [component, setComponent] = useState(null);
  const type = useSelector((store) => store.widgetValueComponent.values.widgetType);
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);
  const value = useSelector((store) => store.widgetValueComponent.values.value);

  useEffect(() => {
    getComponent();
  }, [type, widgetValues, value])

  const getComponent = () => {
    switch (type){
      case 'linear': {
        setComponent(<Linear widgetValues={widgetValues} isShownOnDashboard={false}/>);
        break;
      }
      case 'circular': {
        setComponent(<Gauge key={uuidv4()} widgetValues={widgetValues} chartDivId={uuidv4()} isShownOnDashboard={false}/>);
        break;
      }
      default:
        setComponent(<Linear widgetValues={widgetValues} isShownOnDashboard={false}/>);
        break;
    }
  }

  return (
    <div className={'preview-wrapper'}>
      <div className={'preview-container'}>
        {component}
      </div>
    </div>
  );
};

export default ValuePreview;