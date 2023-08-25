import React from 'react';
import noImage from '../../../../../assets/images/no-image.png'

const Image = ({ config }) => {

  const getImageUrl = () => {
    if (config.data?.image && config.data?.image.includes('https://s3')) {
      return `url(${config.data.image})`;
    } else if (config.data.value) {
      return `url(${config.data.value?.src})`;
    }
    return `url(${noImage})`
  }

  const getImage = () => {
    if (config.data?.image && config.data?.image.includes('https://s3')) {
      return `${config.data.image}`;
    } else if (config.data.value) {
      return `${config.data.value?.src}`;
    }
    return `${noImage})`
  }

  return (
    // <>
      <div style={{
      ...config.settings,
      backgroundImage: getImageUrl(),
      width: '100%',
      height: '100%',
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
    </div>

      //  <img src={getImage()} crossOrigin="Anonymos" /> 
    // </>
  );
};

export default Image;