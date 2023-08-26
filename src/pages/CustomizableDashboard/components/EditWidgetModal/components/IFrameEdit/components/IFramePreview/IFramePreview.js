import React from 'react';
import IFrameValuePreview from "./components/IFrameValuePreview/IFrameValuePreview";
import {useSelector} from "react-redux";

const IFramePreview = () => {
  const widgetValues = useSelector((store) => store.iframeWidget.values);
  return (
    <div className={'preview-wrapper'}>
      <div className={'preview-container'} style={{height: 240}}>
        <IFrameValuePreview widgetValues={widgetValues}/>
      </div>
    </div>
  );
};

export default IFramePreview;