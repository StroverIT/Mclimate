import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState} from 'react';
import {batch, useDispatch, useSelector} from "react-redux";
import {mapAssetDevices} from "../../helpers/mapAssetDevices";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import {contentMapping} from "../../../../../../../../../helpers/nested_elements_helper";
import AppUtils from "../../../../../../../../../common/AppUtils";
import {filterDevices, setValues} from "../../../../../../../../../store/valuePreview/actions";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import {controllerTypes} from "../../../../../../../../../common/data";
import NestedDevices from "../../../../../helpers/NestedDevices/NestedDevices";
import {showMessage} from "../../../../../../../../../helpers/ui_helper";
import {TIMEFRAME_TYPES} from "../Timeframe/Timeframe";
import {getControllerData, processData} from "../../helpers/apiHelper";
import {hideSpinner, showSpinner} from "../../../../../../../../../store/spinner/actions";
import {useParams} from "react-router-dom";
import './data.scss'

const formObj = {
  isFormValid: true,
  field: {
    value: '',
    regex: InputUtils.NON_EMPTY_STRING,
    valid: true,
    errorMsg: 'Field cannot be empty'
  },
  unit: {
    value: '',
    valid: true,
    errorMsg: 'Unit cannot be empty'
  },
  decimals: {
    value: 0,
    valid: true,
    errorMsg: 'Decimals must be in range (0-100)'
  }
}

const Data = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const allBuildings = useSelector((store) => store.buildings.buildings);
  const filterText = useSelector((store) => store.widgetValueComponent.filterDeviceText);
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);

  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const [allDevices, setAllDevices] = useState({assetDevices: null, buildingDevices: null});
  const [contentMappedDevices, setContentMappedDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const {buildingId} = useParams();

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  useEffect(() => {
    if (widgetValues.selectedDevice && widgetValues.selectedDevice.id && widgetValues.selectedDevice.type) {
      handleDeviceChange(widgetValues.selectedDevice.id, widgetValues.selectedDevice, false)
    }

    const getFieldOption = (val) => {
      if (widgetValues.selectedDevice && widgetValues.selectedDevice.type) {
        const fieldLabel = getDeviceFields(widgetValues.selectedDevice.type).find(fld =>
          fld.key === val)?.name ?? "";
        return {label: fieldLabel, value: val}
      } else {
        return ""
      }
    }

    let reduxFormObj = {
      isFormValid: true
    }

    Object.keys(formObj).filter(key => key !== 'isFormValid').forEach(key => {
      reduxFormObj = {
        ...reduxFormObj,
        [key]: {
          ...form[key],
          value: key === "field" ? getFieldOption(widgetValues[key]) : widgetValues[key],
          valid: true
        }
      }
    })
    setForm(reduxFormObj)

    return () => {
      dispatch(filterDevices(""));
    }
  }, [])

  useEffect(() => {
    getCurrentBuilding();
  }, [allBuildings])

  useEffect(() => {
    if (allDevices.assetDevices && allDevices.buildingDevices) {
      const mappedDevices = contentMapping(allDevices, renderDOMElement);
      setContentMappedDevices(mappedDevices.assetDevices);
    }
  }, [allDevices])

  useEffect(() => {
    callMapBuildingsData();
  }, [filterText, selectedDevice])

  const getCurrentBuilding = (updatedBuildings = null) => {
    const buildings = updatedBuildings ?? allBuildings;
    const currentBuilding = buildings.find(building => building.id === parseInt(buildingId));
    if (currentBuilding) {
      mapBuildingsData([currentBuilding]);
    } else {
      mapBuildingsData(buildings); // in case of missing building
    }
  }

  const onChange = (inputId, event, inputType) => {
    const widgetValuesCopy = AppUtils.createObjectCopy(widgetValues);
    if (inputId === 'decimals' && event.target.value !== '' &&
      (isNaN(parseInt(event.target.value)) || parseInt(event.target.value) < 0 || parseInt(event.target.value) > 100)) {
      setForm({
        ...form,
        decimals: {
          ...form.decimals,
          valid: false
        }
      })
    } else {
      if (inputId === 'field') {
        const fieldUnit = selectedDevice.fields.find(fld => fld.key === event.value)?.unit ?? '';
        setForm({
          isFormValid: true,
          field: {
            ...form.field,
            value: event,
          },
          unit: {
            ...form.unit,
            value: fieldUnit,
          },
          decimals: {
            ...form.decimals,
            value: '0',
          }
        })
        widgetValuesCopy.field = event.value;
        widgetValuesCopy.unit = fieldUnit;
        widgetValuesCopy.decimals = '0';
        dispatch(showSpinner());
        getControllerData(widgetValuesCopy)
          .then(response => {
            if (response && response.timeframeOperationType === TIMEFRAME_TYPES.CURRENT_VALUE) {
              widgetValuesCopy.value = response.data.provider[event.value];
            } else if (response && response.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS) {
              widgetValuesCopy.value = processData(response.data, widgetValues.operation, event.value);
            }
          })
          .catch(() => {
            showMessage("Something went wrong while loading value widget data", true);
          })
          .finally(() => {
            batch(() => {
              dispatch(hideSpinner());
              dispatch(setValues(widgetValuesCopy));
            })
          })
      } else {
        setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true));
        dispatch(setValues({...widgetValues, [inputId]: event.target.value}))
      }
    }
  }

  const checkFieldValidity = (inputId) => {
    setForm(InputUtils.checkFieldValidity(inputId, form));
  }

  const callMapBuildingsData = () => {
    if (allBuildings !== null && typeof allBuildings !== "undefined") {
      const allBuildingsCopy = allBuildings.map(el => {return {...el}});

      allBuildingsCopy.forEach(building => {
        let devicesCopy = building.devices.map(el => {return {...el}});
        if (filterText !== '') {
          devicesCopy = devicesCopy.filter(device => {
            return device.controller.name.toLowerCase().includes(filterText.toLowerCase()) ||
              device.controller.serial_number.toLowerCase().includes(filterText.toLowerCase())
          })
        }
        building.devices = devicesCopy;
      })

      getCurrentBuilding(allBuildingsCopy);
    }
  }

  const getDeviceFields = (deviceType) => {
    let deviceFields = [];
    const foundController = controllerTypes.find(el => el.type.toLowerCase() === deviceType.toLowerCase());
    if (foundController) {
      const filteredFields = foundController.table.filter(el =>
        typeof el.dontShowInGraphs === "undefined" && el.isNumber === true).map(el => {
        return {
          name: el.name,
          key: el.key,
          unit: el.suffix
        }
      })
      deviceFields = deviceFields.concat(filteredFields);
    }
    return deviceFields;
  }

  const handleDeviceChange = (id, device, isClick) => {
    const deviceFields = getDeviceFields(device.type);
    if (id !== selectedDevice?.id) {
      setForm(AppUtils.createObjectCopy(formObj));
    }
    const deviceObj = {
      id: id,
      type: device.type,
      serialNumber: device.serialNumber,
      fields: deviceFields
    }
    setSelectedDevice(deviceObj);
    const fieldObj = isClick ? {
      field: "",
      unit: "",
      decimals: 0
    } : null
    dispatch(setValues({
      ...widgetValues,
      selectedDevice: {
        id: deviceObj.id,
        type: deviceObj.type,
        serialNumber: deviceObj.serialNumber
      },
      ...fieldObj
    }))
  }

  const renderDOMElement = (key, devices, isOuter) => {
    return <div
      id={key}
      key={key}
      unselectable="on"
      onClick={() => handleDeviceChange(key, devices[key], true)}
      className={`device-list-item non-draggable-list-item` +
        ` ${isOuter ? 'outer-list-item' : ''} ${selectedDevice?.id === key ? 'selected-device' : ''}`}
    >
      <img
        src={AppUtils.getDeviceImage(devices[key].type)}
        className="device-list-image"
        alt="device-icon"
        style={selectedDevice?.id === key ? {filter: AppUtils.changeSVGColor('#55AEE1')} : null}
      />
      {devices[key].title}
    </div>
  }

  const mapBuildingsData = (buildings) => {
    let assetDevices = [];
    buildings.forEach(building => {
      const mappedAssetDevices = [];
      building.devices.forEach(device => {
        mapAssetDevices(building, device, mappedAssetDevices);
      })
      assetDevices = assetDevices.concat(mappedAssetDevices)
    })
    setAllDevices({
      assetDevices: assetDevices,
      buildingDevices: {}
    })
  }

  const handleDeviceSearch = (value) => {
    dispatch(filterDevices(value));
  }

  const getFieldOptions = () => {
    if (selectedDevice && selectedDevice.fields?.length > 0) {
      return selectedDevice.fields.map(el => {
        return {
          value: el.key,
          label: el.name
        }
      })
    }
    return [];
  }

  return (
    <div className="value-widget-data-container">
      <NestedDevices handleDeviceSearch={handleDeviceSearch} jsonData={contentMappedDevices} />
      <div style={{display: "flex", width: "100%", marginTop: 30}}>
        <div className={'field-wrapper'}>
          <h6 className='value-widget-data-element'>Field</h6>
          <hr/>
          <GenericInput
            elementType={InputTypes.SELECT}
            id='field'
            name='field'
            value={form.field.value}
            label={''}
            valid={form.field.valid}
            errorMsg={form.field.errorMsg}
            onChange={(e) => onChange('field', e, InputTypes.SELECT)}
            onBlur={() => checkFieldValidity('field')}
            wrapperClass={'value-widget-data-element'}
            elementConfig={{
              options: getFieldOptions(),
              placeholder: 'Select field',
              classNamePrefix: 'select2-selection',
              noOptionsMessage: "Please, select device first"
            }}
          />
        </div>
        <div className={'field-wrapper'}>
          <h6 className='value-widget-data-element'>Unit</h6>
          <hr/>
          <GenericInput
            value={form.unit.value}
            label={''}
            valid={form.unit.valid}
            errorMsg={form.unit.errorMsg}
            onChange={(e) => onChange('unit', e, InputTypes.TEXT_INPUT)}
            onBlur={() => checkFieldValidity('unit')}
            wrapperClass={'value-widget-data-element'}
            elementConfig={{
              placeholder: 'Unit',
              type: 'text',
              maxlength: '12'
            }}
          />
        </div>
        <div className={'field-wrapper'}>
          <h6 className='value-widget-data-element'>Decimals</h6>
          <hr/>
          <GenericInput
            value={form.decimals.value}
            label={''}
            valid={form.decimals.valid}
            errorMsg={form.decimals.errorMsg}
            onChange={(e) => onChange('decimals', e, InputTypes.TEXT_INPUT)}
            onBlur={() => checkFieldValidity('decimals')}
            wrapperClass={'value-widget-data-element'}
            elementConfig={{
              placeholder: 'Decimals',
              type: 'number',
              min: 0,
              max: 100
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default Data;