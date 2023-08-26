import React from 'react';
import './iframe.scss'

const IFrame = ({config}) => {

  const styles = {
    justifyContent: config.settings.textAlign,
    backgroundColor: config.data?.isHiddenBg ? "#FFF" :  config.settings.backgroundColor,
  }


  
  return (
    
    <div className={'headline-container CD-widget'} style={styles}>
      <iframe title={config.data?.title}
      style={{
        width: "100%",
        // height: config.data?.isFullScreenHeight ? "100%" : "",
        height:  "100%",
        
      }}
      src={config.data?.iframe}
      >

      </iframe>
      {}
    </div>
  );
};

export default IFrame;