import React from 'react';
import './text.scss'

const Text = ({config}) => {
  return (
    <div className={'text-widget-container CD-widget'} style={config.settings}>
      <p>{config.data.value}</p>
    </div>
  );
};

export default Text;