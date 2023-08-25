import React from 'react';
import './booleanValuePreview.scss'

const BooleanValuePreview = ({ widgetValues }) => {

  return (
    <div className='boolean-preview-wrapper' style={{ backgroundColor: widgetValues.config?.settings?.backgroundColor }}>
      <div className={'boolean-widget-header'}>
        <i className={`boolean-header-icon ${widgetValues.config?.settings?.icon}`}
          style={{ color: widgetValues.config?.settings?.titleColor }} />
        <p style={{ color: widgetValues.config?.settings?.titleColor }}>{widgetValues.widgetTitle}</p>
      </div>
      {!widgetValues.online && <p style={{ fontSize: '10px', margin: 0, padding: '0 0 0 10px' }}>&nbsp;Device is offline</p>}
      {widgetValues.displayOnText !== '' || widgetValues.displayOffText !== '' ?
        <div className={'value-text-container'}>
          <div className={'value-circle'} style={{ backgroundColor: widgetValues.widgetValue ? widgetValues.config?.settings?.displayOnColor : widgetValues.config?.settings?.displayOffColor }} />
          <h1 className={'display-on-text'} style={{ color: widgetValues.widgetValue ? widgetValues.config?.settings?.displayOnColor : widgetValues.config?.settings?.displayOffColor }}>
            {widgetValues.widgetValue ? widgetValues.displayOnText : widgetValues.displayOffText}
          </h1>
        </div> : null}
    </div>
  );
};

export default BooleanValuePreview;