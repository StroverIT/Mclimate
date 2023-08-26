import React from "react";
import "./iframeValuePreview.scss";

const IFrameValuePreview = ({ widgetValues }) => {

  console.log(widgetValues);
  return (
    <div
      className="boolean-preview-wrapper"
      style={{
        backgroundColor: widgetValues.isHiddenBg ? "#FFF" : widgetValues.config?.settings?.backgroundColor,
      // FOR THE INTERVIEW PURPOSE
        overflow: "hidden"
      }}
    >
      <div className={"boolean-widget-header"}>
        <p style={{ color: widgetValues.config?.settings?.titleColor }}>
          {widgetValues.title}
        </p>
      </div>

      {/* FOR THE INTERVIEW PURPOSE*/}
      {widgetValues.iframe && (
          <iframe
          title={widgetValues.title}
            className="iframe-container"
            style={{
              // height: `${widgetValues.isFullScreenHeight ? "100%" : ""}`,
              height: '100%',

            }}
            src={widgetValues.iframe}
          ></iframe>
      )}
    </div>
  );
};

export default IFrameValuePreview;
