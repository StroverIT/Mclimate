import React, {useEffect, useState} from 'react';
import MixChart from "../../EditWidgetModal/components/ChartEdit/components/ChartPreview/components/MixChart/MixChart";
import {v4 as uuidv4} from "uuid";
import {
  getDataForSelectedDevices, resetMixChartData,
  updateChartData
} from "../../EditWidgetModal/components/ChartEdit/helpers";
import {showMessage} from "../../../../../helpers/ui_helper";
import {hideSpinner, showSpinner} from "../../../../../store/spinner/actions";
import {useDispatch, useSelector} from "react-redux";
import {usePrevious} from "../../../../../Hooks/usePrevious";
import {setPendingForDataWidgets} from "../../../../../store/customizableDashboard/actions";
import './chart.scss'

const Chart = ({config}) => {
  const dispatch = useDispatch();
  const loadingWidgets = useSelector((store) => store.customizableDashboard.pendingForDataWidgets);
  const [chartData, setChartData] = useState([]);
  const prevDevices = usePrevious(config.data)

  useEffect(() => {
    if (JSON.stringify(prevDevices) !== JSON.stringify(config.data)) {
      const widgetValues = {
        ...config.data,
        config: {...config.settings}
      }
      dispatch(showSpinner());
      getDataForSelectedDevices(widgetValues)
        .then((responses) => {
          const chartData = [];
          widgetValues.selectedDevices.forEach(device => {
            if (device.selectedField) {
              const deviceResponse = responses.find(data => data._links.self.href.includes(device.serialNumber));
              if (deviceResponse) {
                updateChartData(widgetValues, device, deviceResponse, chartData, {});
              }
            }
          })
          setChartData(() => {
            const data = [...chartData];
            resetMixChartData();
            return data;
          })
          updateWidgetPendingStatus();
        })
        .catch((e) => {
          console.log(e);
          showMessage("Something went wrong while loading chart widget data", true);
        })
        .finally(() => {
          dispatch(hideSpinner());
        })
    }
  }, [config.data]);


  const updateWidgetPendingStatus = () => {
    if (loadingWidgets[config.id]) {
      loadingWidgets[config.id].pending = false;
    } else {
      loadingWidgets[config.id] = {
        pending: false
      }
    }
    dispatch(setPendingForDataWidgets({...loadingWidgets}))
  }

  return (
    <div className={'display-chart-widget'}>
      <div className={'mix-chart-widget-header'}>
        <i className={`mix-chart-header-icon ${config?.settings.settings.icon}`}
           style={{color: config?.settings.settings.color}}/>
        <p style={{color: config?.settings.settings.color}}>{config.data.widgetTitle}</p>
      </div>
      <MixChart key={uuidv4()}
                chartDivId={uuidv4()}
                showXGrid={config.data.xGrid}
                timezone={config.data.timezone}
                dateFormat={config.data.dateFormat}
                chartData={chartData}
      />
    </div>
  );
};

export default Chart;