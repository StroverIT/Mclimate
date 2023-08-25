import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {InputTypes} from "../../../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import GenericInput from "../../../../../../../../../../../components/GenericInput/Input/GenericInput";
import {
  setChartData,
  setChartDevicesModal,
  setControllersFields,
  setChartWidgetValues
} from "../../../../../../../../../../../store/chartWidget/actions";
import {batch, useDispatch, useSelector} from "react-redux";
import CustomColorPicker from "../../../../../../../../CustomColorPicker/CustomColorPicker";
import {Button} from "reactstrap";
import AppUtils from "../../../../../../../../../../../common/AppUtils";
import {getControllerLogsData} from "../../../../../../../../../../../helpers/backend_helper";
import {
  controllersChartData,
  controllersData,
  createAxisSettings,
  generateChartData, generateTimeframe,
  removeFieldFromChartData
} from "../../../../../helpers";
import './deviceFragment.scss';
import {showMessage} from "../../../../../../../../../../../helpers/ui_helper";
import {hideSpinner, showSpinner} from "../../../../../../../../../../../store/spinner/actions";

export const CHART_TYPES = {
  LINE_CHART: 'Line chart',
  AREA_CHART: 'Area chart',
  BAR_CHART: 'Bar chart',
}

const DeviceFragment = forwardRef(({id, fragmentId, removeFragment, selectedDevice}, ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector(store => store.chartWidget.values);
  const controllersFields = useSelector(store => store.chartWidget.controllersFields);
  const colorPickerRef = useRef();

  useImperativeHandle(ref, () => ({
    getId() {
      return id;
    }
  }));

  const getDeviceData = async () => {
    const timeframe = generateTimeframe(widgetValues)
    let data = {
      serial_number: selectedDevice.serialNumber,
      from_date: timeframe.startDate,
      to_date: timeframe.endDate
    }

    return getControllerLogsData(data)
  }

  const onChange = (inputId, event, inputType) => {
    if (inputId === 'selectedField') {
      const selectedDeviceFound = widgetValues.selectedDevices.find(device => device.id === selectedDevice.id);
      const serialNumberFound = controllersChartData.find(device => device.serialNumber === selectedDevice.serialNumber);
      setReduxValues(event);
      if (selectedDeviceFound && !serialNumberFound) {
        dispatch(showSpinner());
        getDeviceData()
          .then((response) => {
            if (response._embedded) {
              const mixChartData = generateChartData(widgetValues,selectedDevice, event, fragmentId, response);;
              dispatch(setChartData([...mixChartData]));
            } else {
              showMessage("There is no data for the selected timeframe", true);
            }
          })
          .finally(() => {
            dispatch(hideSpinner());
          })
      } else {
        controllersChartData.push({
          field: event.value,
          displayField: event.label,
          serialNumber: selectedDevice.serialNumber,
          componentId: selectedDevice.componentId,
          data: controllersData[selectedDevice.serialNumber][event.value] ?? [],
          ...createAxisSettings(selectedDevice, fragmentId)
        });
        dispatch(setChartData([...controllersChartData]));
      }
    }
  }

  const setReduxValues = (event) => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    let prevSelectedField = widgetValuesCopy.selectedDevices[fragmentId].selectedField ?? null;
    widgetValuesCopy.selectedDevices[fragmentId].selectedField = event;
    widgetValuesCopy.selectedDevices[fragmentId].deviceAxisSettings = {
      ...widgetValuesCopy.selectedDevices[fragmentId].deviceAxisSettings,
      ...createAxisSettings(selectedDevice, fragmentId + 1)
    }
    removeFieldFromChartData(selectedDevice, prevSelectedField)
    batch(() => {
      dispatch(setChartWidgetValues(widgetValuesCopy));
      dispatch(setControllersFields(updateControllersFields(event, prevSelectedField)));
    })
  }

  const updateControllersFields = (selectedField, prevSelectedField) => {
    const controllersFieldsCopy = AppUtils.createObjectCopy(controllersFields);
    const fieldIndex = controllersFieldsCopy[selectedDevice.serialNumber].findIndex(field => field.value === selectedField.value);
    if (fieldIndex !== -1) {
      if (prevSelectedField) {
        controllersFieldsCopy[selectedDevice.serialNumber].push(prevSelectedField);
      }
      controllersFieldsCopy[selectedDevice.serialNumber].splice(fieldIndex, 1);
    }
    return controllersFieldsCopy
  }

  const handleOnChangeSettings = (key, event) => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    const chartDataDevice = controllersChartData.find(device => device.componentId === selectedDevice.componentId);
    if (chartDataDevice) {
      chartDataDevice[key] = event;
    }
    widgetValuesCopy.selectedDevices[fragmentId].deviceAxisSettings[key] = event;
    batch(() => {
      dispatch(setChartWidgetValues(widgetValuesCopy));
      dispatch(setChartData([...controllersChartData]));
    })
  }

  const openChartDevicesModal = (deviceIndex) => {
    dispatch(setChartDevicesModal({isOpen: true, selectedDeviceIndex: deviceIndex}));
  }

  const removeDeviceFragment = () => {
    restoreControllerField();
    setTimeout(() => {
      removeFragment();
    }, 50)
  }

  const restoreControllerField = () => {
    const controllersFieldsCopy = AppUtils.createObjectCopy(controllersFields);
    if (selectedDevice.selectedField) {
      removeFieldFromChartData(selectedDevice, selectedDevice.selectedField)
      controllersFieldsCopy[selectedDevice.serialNumber].push(selectedDevice.selectedField);
      batch(() => {
        dispatch(setControllersFields(controllersFieldsCopy));
        dispatch(setChartData([...controllersChartData]));
      })
    }
  }

  return (
    <>
      <div className={'chart-fragment-settings-container'}>
        <header className={'fragment-header'}>
            <div className={'selected-device-container'}>
              <img src={AppUtils.getDeviceImage(selectedDevice.type)} alt=""
                   style={{width: 17, filter: AppUtils.changeSVGColor('#75788B')}}/>
              <h6>{selectedDevice.title}</h6>
            </div>
          <div aria-label="delete" className={'delete-value-button'} onClick={removeDeviceFragment}>
            <i className="uil-trash-alt" style={{fontSize: 15}}/>
          </div>
        </header>
        <hr style={{marginTop: 0}}/>
        <div className={'device-field-labels-container'}>
          <div style={{width: '48%'}}>
            <h6>Device</h6>
          </div>
          <div style={{width: '48%'}}>
            <h6>Field</h6>
          </div>
        </div>
        <hr/>
        <div style={{display: "flex", gap: '4%'}}>
          <div onClick={() => openChartDevicesModal(fragmentId)} style={{width: '47.5%', cursor: "pointer"}}>
            <GenericInput
              elementType={InputTypes.SELECT}
              id='device'
              name='device'
              value={{label: selectedDevice.title, value: selectedDevice.id}}
              valid={true}
              errorMsg={''}
              elementConfig={{
                placeholder: 'Select device',
                menuIsOpen: false
              }}
            />
          </div>
          <div style={{width: '47.5%'}}>
            <GenericInput
              elementType={InputTypes.SELECT}
              value={selectedDevice.selectedField}
              valid={true}
              errorMsg={''}
              onChange={(e) => onChange('selectedField', e, InputTypes.SELECT)}
              // onBlur={() => checkFieldValidity('timezone')}
              elementConfig={{
                options: controllersFields[selectedDevice.serialNumber],
                placeholder: 'Select field',
                classNamePrefix: "select2-selection",
                menuPlacement: 'top'
              }}
            />
          </div>
        </div>

        <div style={{height: 25}}/>
        <div className={'device-field-labels-container'}>
          <div style={{width: '48%'}}>
            <h6>Type</h6>
          </div>
          <div style={{width: '48%'}}>
            <h6>Color</h6>
          </div>
        </div>
        <hr/>
        <div style={{display: "flex", gap: '4%'}}>
          <div style={{width: '47.5%', display: 'flex', gap: 7}}>
            <Button
              className={`wide-button ${selectedDevice.deviceAxisSettings.chartType === CHART_TYPES.LINE_CHART ? 'primary-white-btn-active' : 'primary-white-button'}`}
              onClick={() => handleOnChangeSettings('chartType', CHART_TYPES.LINE_CHART)}
            >
              {CHART_TYPES.LINE_CHART}
            </Button>
            <Button
              className={`wide-button ${selectedDevice.deviceAxisSettings.chartType === CHART_TYPES.AREA_CHART ? 'primary-white-btn-active' : 'primary-white-button'}`}
              onClick={() => handleOnChangeSettings('chartType', CHART_TYPES.AREA_CHART)}
            >
              {CHART_TYPES.AREA_CHART}
            </Button>
            <Button
              className={`wide-button ${selectedDevice.deviceAxisSettings.chartType === CHART_TYPES.BAR_CHART ? 'primary-white-btn-active' : 'primary-white-button'}`}
              onClick={() => handleOnChangeSettings('chartType', CHART_TYPES.BAR_CHART)}
            >
              {CHART_TYPES.BAR_CHART}
            </Button>
          </div>
          <div style={{width: '47.5%'}}>
            <CustomColorPicker
              ref={colorPickerRef}
              updatedWidget={{config: {settings: {color: selectedDevice.deviceAxisSettings.color}}}}
              setWidgetSettings={handleOnChangeSettings}
              mainKey='color'
              widgetKey='color'
            />
          </div>
        </div>
      </div>
    </>
  );
});

export default DeviceFragment;
