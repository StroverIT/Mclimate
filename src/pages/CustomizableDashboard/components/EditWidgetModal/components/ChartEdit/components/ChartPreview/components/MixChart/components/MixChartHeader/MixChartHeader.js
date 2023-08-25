import React from 'react';
import { useSelector } from "react-redux";

const MixChartHeader = () => {
  const widgetValues = useSelector((store) => store.chartWidget.values);
  
  return (
    <div className={'mix-chart-widget-header'}>
      <i className={`mix-chart-header-icon ${widgetValues.config?.settings?.icon}`}
        style={{ color: widgetValues.config?.settings?.color }} />
      <p style={{ color: widgetValues.config?.settings?.color }}>{widgetValues.widgetTitle}</p>
    </div>
  );
};

export default MixChartHeader;