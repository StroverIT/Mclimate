import React from 'react';
import './headline.scss'

const Headline = ({config}) => {
  const styles = {
    justifyContent: config.settings.textAlign,
    backgroundColor: config.settings.backgroundColor,
  }

  const renderElement = () => {
    return React.createElement(
      `h${config.settings.size}`,
      {style: {color: config.settings.color, wordBreak: 'break-word'}},
      config.data.value,
    );
  }

  return (
    <div className={'headline-container CD-widget'} style={styles}>
      {renderElement()}
    </div>
  );
};

export default Headline;