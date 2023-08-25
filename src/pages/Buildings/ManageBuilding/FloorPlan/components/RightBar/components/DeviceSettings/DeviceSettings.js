import * as React from 'react';
import GenericInput from "../../../../../../../../components/GenericInput/Input/GenericInput";
import {InputTypes} from "../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import {useDispatch, useSelector} from "react-redux";
import controllerTypes from "../../../../../../../../common/data/controllers-types";
import {setFloorPlan} from "../../../../../../../../store/floorPlan/actions";
import "./deviceSettings.scss";

export const DeviceSettings = () => {
  const dispatch = useDispatch();
  const selectedDevice = useSelector((store) => store.floorPlan.device);
  const plan = useSelector((store) => store.floorPlan.plan);

  const handleDeviceAttributeToggle = (event, key, visibilityAttr) => {
    selectedDevice.settings[key][visibilityAttr] = event.target.checked
    dispatch(setFloorPlan({...plan}))
  }

  const handleSectionToggle = (event, section) => {
    selectedDevice[section].show = event.target.checked;
    dispatch(setFloorPlan({...plan}))
  }

  const handleCauseChange = (section) => {
    selectedDevice[section].showWhen = selectedDevice[section].showWhen === "active" ? "hover" : "active";
    dispatch(setFloorPlan(({...plan})))
  }

  const renderDeviceAttributes = (section, visibilityAttribute) => {
    if (selectedDevice) {
      const foundType = controllerTypes.find(item => item.type === selectedDevice.type);
      if (foundType) {
        const settingsKeys = Object.keys(selectedDevice.settings);
        const checkboxes = [];
        settingsKeys.forEach(key => {
          const checkBoxSpecificProps = {
            labelContent: foundType.table.find(element => element.key === key)?.name ?? 'N/A'
          }
          checkboxes.push(
            <GenericInput
              id={`${key}-${InputTypes.CHECKBOX}`}
              key={`${key}-${InputTypes.CHECKBOX}`}
              elementType={InputTypes.CHECKBOX}
              wrapperClass={'form-check'}
              classNameProp={'form-check-input device-settings-checkbox-cursor'}
              value={selectedDevice.settings[key][visibilityAttribute]}
              valid={true}
              errorMsg={''}
              onChange={(e) => handleDeviceAttributeToggle(e, key, visibilityAttribute)}
              checkboxSpecificProps={checkBoxSpecificProps}
            />
          )
        })

        return <div className="visibility-section-container">
          <hr/>
          <div className="visibility-section-header">
            <p className="mb-0">Visibility</p>
            <label className="toggle">
              <input
                id={`visibility_checkbox_${section}`}
                type="checkbox"
                checked={selectedDevice && selectedDevice[section].showWhen === "active"}
                onChange={() => handleCauseChange(section)}
              />
              <span className="slider"></span>
              <span className="labels" data-on="Active" data-off="Hover"></span>
            </label>
          </div>
          {checkboxes}
        </div>
      }
    }
    return null;
  }

  const renderDeviceSettingsSection = (section, sectionHeader, visibilityAttr) => {
    return <>
      <div className="device-attributes-section-container"
           style={section === "infoBlock" ? {marginBottom: !selectedDevice.infoBlock.show ? 20 : 0} : null}>
        <p className="device-attributes-section-header">{sectionHeader}</p>
        <div className="form-check form-switch no-margin-switch">
          <input
            type="checkbox"
            className="form-check-input checkbox device-settings-checkbox"
            id={`${section}_checkbox`}
            checked={selectedDevice[section].show}
            onChange={(e) => handleSectionToggle(e, section)}
          />
        </div>
      </div>
      {selectedDevice[section].show ?
        <>
          {renderDeviceAttributes(section, visibilityAttr)}
          <hr className="mt-0"/>
        </> :
        section === "tooltipBadges" ? <hr/> : null
      }
    </>
  }

  return (
    <div>
      {selectedDevice ?
        <>
          <p className="device-settings-header">Device settings</p>
          <hr/>
          {renderDeviceSettingsSection('tooltipBadges', 'Tooltip badges', 'badgeVisibility')}
          {renderDeviceSettingsSection('infoBlock', 'Device info block', 'infoBlockVisibility')}
        </> : null}
    </div>
  );
};