import React, {useEffect, useState} from 'react';
import BooleanValuePreview from "../../EditWidgetModal/components/BooleanEdit/components/BooleanPreview/components/BooleanValuePreview/BooleanValuePreview";
import {setControllerProviderData} from "../../../../../helpers/backend_helper";
import {showMessage} from "../../../../../helpers/ui_helper";
import {usePrevious} from "../../../../../Hooks/usePrevious";
import {setPendingForDataWidgets} from "../../../../../store/customizableDashboard/actions";
import {useDispatch, useSelector} from "react-redux";
import './boolean.scss'

const Boolean = ({config}) => {
  const dispatch = useDispatch();
  const loadingWidgets = useSelector((store) => store.customizableDashboard.pendingForDataWidgets);
  const [widgetValues, setWidgetValues] = useState({...config.data, config: {...config.settings}});
  const prevValues = usePrevious({...config.data, config: {...config.settings}})

  useEffect(() => {
    const newValues = {...config.data, config: {...config.settings}};
    if (JSON.stringify(newValues) !== JSON.stringify(prevValues)) {
      getBooleanData(newValues);
    }
  }, [config])

  const getBooleanData = (newValues) => {
    if (newValues.selectedDevice && newValues.selectedDevice.selectedField) {
      setControllerProviderData({serial_number: newValues.selectedDevice.serialNumber})
        .then(response => {
          setWidgetValues({...newValues, widgetValue: response.provider[newValues.selectedDevice.selectedField.value]});
          updateWidgetPendingStatus();
        })
        .catch(() => {
          showMessage("Something went wrong while loading boolean widget data", true);
        })
    } else {
      setWidgetValues({...newValues})
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
    dispatch(setPendingForDataWidgets({...loadingWidgets}))
  }

  return (
    <div className={'boolean-widget'}>
      <BooleanValuePreview widgetValues={widgetValues}/>
    </div>
  );
};

export default Boolean;