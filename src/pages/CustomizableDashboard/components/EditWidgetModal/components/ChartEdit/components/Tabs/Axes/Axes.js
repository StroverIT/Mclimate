import React, {forwardRef, useImperativeHandle} from 'react';
import {useDispatch, useSelector} from "react-redux";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import AppUtils from "../../../../../../../../../common/AppUtils";
import ChartAxis from "./components/ChartAxis/ChartAxis";
import {setChartWidgetValues} from "../../../../../../../../../store/chartWidget/actions";
import './axes.scss'

const dateFormats = AppUtils.generateDropDownDateFormatsOptions();

const Axes = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => store.chartWidget.values);

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const onChange = (inputId, event) => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    widgetValuesCopy[inputId] = event;
    dispatch(setChartWidgetValues(widgetValuesCopy));
  }

  const handleSectionToggle = (event, inputId) => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    widgetValuesCopy[inputId] = event.target.checked
    dispatch(setChartWidgetValues(widgetValuesCopy));
  }

  return (
    <div>
      <div style={{height: 35}}/>
      {widgetValues.selectedDevices?.map((device, index) => {
        return device.selectedField ? <React.Fragment key={`axisSettingsFragment-${index}`}>
          <ChartAxis key={`axisSettings-${index}`}
                     widgetValues={widgetValues}
                     axisSettings={device.deviceAxisSettings}
                     axisSettingsIndex={index}
                     color={widgetValues.selectedDevices[index].deviceAxisSettings.color}
          />
          <div style={{height: 15}} key={`axisSettings-block-separator-${index}`}/>
        </React.Fragment> : null
      })}

      <div style={{height: 25}}/>
      <div style={{display: 'flex', width: '100%', gap: '4%'}}>
        <div style={{width: '48%'}}>
          <h6>Date format</h6>
        </div>
        <div style={{width: '48%'}}>
          <h6>X Grid</h6>
        </div>
      </div>
      <hr/>
      <div style={{display: 'flex', width: '100%', gap: '4%'}}>
        <div style={{width: '47.5%'}}>
          <GenericInput
            elementType={InputTypes.SELECT}
            id='operation'
            name='operation'
            value={widgetValues.dateFormat}
            valid={true}
            errorMsg={''}
            onChange={(e) => onChange('dateFormat', e)}
            elementConfig={{
              options: dateFormats,
              placeholder: 'Select date format',
              classNamePrefix: 'select2-selection',
            }}
          />
        </div>
        <div style={{width: '47.5%'}}>
          <div className="chart-widget-switch-with-label">
            <p style={{marginBottom: 0}}>Show X Grid</p>
            <div className="form-check form-switch no-margin-switch">
              <input
                type="checkbox"
                className="form-check-input checkbox show-x-grid-checkbox"
                id={`x_grid_checkbox`}
                checked={widgetValues.xGrid}
                onChange={(e) => handleSectionToggle(e, 'xGrid')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Axes;