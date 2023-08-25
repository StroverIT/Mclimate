import React from 'react';
import BooleanValuePreview from "./components/BooleanValuePreview/BooleanValuePreview";
import {useSelector} from "react-redux";

const BooleanPreview = () => {
  const widgetValues = useSelector((store) => store.booleanWidget.values);

  return (
    <div className={'preview-wrapper'}>
      <div className={'preview-container'} style={{height: 240}}>
        <BooleanValuePreview widgetValues={widgetValues}/>
      </div>
    </div>
  );
};

export default BooleanPreview;