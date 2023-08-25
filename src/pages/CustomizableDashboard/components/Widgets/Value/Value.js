import React, { useEffect, useState } from 'react';
import { STYLE_TYPES } from "../../EditWidgetModal/components/ValueEdit/components/Tabs/Style/Style";
import Linear from "../../EditWidgetModal/components/ValueEdit/components/ValuePreview/components/Linear/Linear";
import Gauge from "../../EditWidgetModal/components/ValueEdit/components/ValuePreview/components/GaugeChart/Gauge";
import { v4 as uuidv4 } from "uuid";
import { usePrevious } from "../../../../../Hooks/usePrevious";
import { showMessage } from "../../../../../helpers/ui_helper";
import { getControllerData, processData, getFixedPercentage } from "../../EditWidgetModal/components/ValueEdit/components/helpers/apiHelper";
import { TIMEFRAME_TYPES } from "../../EditWidgetModal/components/ValueEdit/components/Tabs/Timeframe/Timeframe";
import { useDispatch, useSelector } from "react-redux";
import { setPendingForDataWidgets } from "../../../../../store/customizableDashboard/actions";
import "./value.scss"

const Value = ({ config }) => {
  const dispatch = useDispatch();
  const loadingWidgets = useSelector((store) => store.customizableDashboard.pendingForDataWidgets);
  const [widgetValues, setWidgetValues] = useState({ ...config.data, config: { ...config.settings } });
  const prevValues = usePrevious({ ...config.data, config: { ...config.settings } })

  useEffect(() => {
    const newValues = { ...config.data, config: { ...config.settings } };
    if (JSON.stringify(newValues) !== JSON.stringify(prevValues)) {
      getValueWidgetData(newValues);
    }
  }, [config])

  const getValueWidgetData = (newValues) => {
    // console.log(newValues)
    if (newValues.selectedDevice && newValues.field) {
      getControllerData(newValues)
        .then(response => {
          if (response && response.timeframeOperationType === TIMEFRAME_TYPES.CURRENT_VALUE) {
            if (newValues.field == 'motorPosition') {
              const data = getFixedPercentage([response.data.provider.motorRange, response.data.provider.motorPosition])
              setWidgetValues({ ...newValues, value: data, online: response.data.provider?.online })
            } else {
              setWidgetValues({ ...newValues, value: response.data.provider[newValues.field], online: response.data.provider?.online })
            }

          } else if (response && response.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS) {
            const data = processData(response.data, newValues.operation, newValues.field);
            setWidgetValues({ ...newValues, value: data, online: response.data.provider?.online })
          } else {
            setWidgetValues({ ...newValues, online: response.data.provider?.online });
          }
          updateWidgetPendingStatus();
        })
        .catch(() => {
          showMessage("Something went wrong while loading value widget data", true);
        })
    } else {
      setWidgetValues({ ...newValues })
    }
  }

  const updateWidgetPendingStatus = () => {
    if (loadingWidgets[config.id]) {
      loadingWidgets[config.id].pending = false;
    } else {
      loadingWidgets[config.id] = {
        pending: false
      }
    }
    dispatch(setPendingForDataWidgets({ ...loadingWidgets }))
  }

  const renderContent = () => {
    if (config.data.widgetType === STYLE_TYPES.LINEAR) {
      return <Linear
        widgetValues={widgetValues}
        isShownOnDashboard={true}
      />
    } else if (config.data.widgetType === STYLE_TYPES.CIRCULAR) {
      return <Gauge
        widgetValues={widgetValues}
        chartDivId={uuidv4()}
        key={uuidv4()}
        isShownOnDashboard={true}
      />
    }
  }

  return (
    <div className={'display-value-widget'}>
      {renderContent()}
    </div>
  );
};

export default Value;