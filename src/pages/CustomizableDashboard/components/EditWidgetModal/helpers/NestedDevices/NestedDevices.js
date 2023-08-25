import React, {useLayoutEffect, useState} from 'react';
import GenericInput from "../../../../../../components/GenericInput/Input/GenericInput";
import NestedDynamicInput from "../../../../../../components/Common/NestedDynamicInput/NestedDynamicInput";

const NestedDevices = ({handleDeviceSearch, jsonData}) => {
  const [showMaskElement, setShowMaskElement] = useState(false);

  useLayoutEffect(() => {
    const el = document.getElementById("devices-container");
    if (el?.scrollHeight > el?.clientHeight) {
      setShowMaskElement(true);
    }
  }, [])

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 3;
    if (bottom) {
      setShowMaskElement(false);
    } else {
      setShowMaskElement(true);
    }
  }

  return (
    <>
      <div className="value-widget-data-top-row">
        <h6 className="mb-0 value-widget-data-device-label">Device</h6>
        <div className="search-for-devices-outer-container value-widget-search">
          <div className="search-box search-for-devices-inner-container">
            <div className="position-relative">
              <GenericInput
                classNameProp={'form-control search-for-devices-input'}
                elementConfig={{
                  type: "text",
                  placeholder: "Search for devices...",
                  onKeyUp: (e) => handleDeviceSearch(e.target.value)
                }}
              />
              <i className="mdi mdi-magnify search-icon"></i>
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-2 mt-0"/>
      <div id="devices-container" className="value-widget-devices-container" onScroll={handleScroll}>
        {!jsonData || jsonData?.length === 0 ?
          "No devices found" : <NestedDynamicInput key={"nested-input"} jsonData={jsonData} />
        }
        <div className={`${showMaskElement ? 'mask-element' : ''}`}></div>
      </div>
    </>
  );
};

export default NestedDevices;