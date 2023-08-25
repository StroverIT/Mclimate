import * as React from 'react';
import MixChart from "./components/MixChart/MixChart";
import {v4 as uuidv4} from "uuid";
import MixChartHeader from "./components/MixChart/components/MixChartHeader/MixChartHeader";
import {useSelector} from "react-redux";
import "./chartPreview.scss";

const chartId = uuidv4();

export const ChartPreview = () => {
  const chartData = useSelector((store) => store.chartWidget.chartData);
  const showXGrid = useSelector(store => store.chartWidget.values.xGrid);
  const timezone = useSelector(store => store.chartWidget.values.timezone);
  const dateFormat =  useSelector(store => store.chartWidget.values.dateFormat);
  
  return (
    <div className={'preview-wrapper'}>
      <div className={'preview-container mix-chart-preview'}>
        <MixChartHeader/>
        <MixChart key={chartId} chartData={chartData} dateFormat={dateFormat} showXGrid={showXGrid} chartDivId={chartId} timezone={timezone}/>
      </div>
    </div>
  );
};