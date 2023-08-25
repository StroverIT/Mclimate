import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {ChromePicker} from "react-color";
import {InputTypes} from "../../../../components/GenericInput/InputUtils/InputUtils";
import {LightTooltip} from "../../../Buildings/ManageBuilding/FloorPlan/components/Device/Device";
import GenericInput from "../../../../components/GenericInput/Input/GenericInput";
import DashboardUtils from "../../DashboardUtils";
import eyeDropperIcon from '../../../../assets/images/common/eye-dropper.svg';
import paletteIcon from '../../../../assets/images/common/palette.svg';
import './customColorPicker.scss';

const CustomColorPicker = forwardRef(({updatedWidget, setWidgetSettings, mainKey, widgetKey}, ref) => {
  const [showColorPicker, _setShowColorPicker] = useState(false);
  const showColorPickerRef = useRef(false);

  useImperativeHandle(ref, () => ({
    hidePicker(event) {
      hideColorPicker(event);
    },
  }))

  const setShowColorPicker = (value) => {
    showColorPickerRef.current = value;
    _setShowColorPicker(value)
  }

  const renderColors = (key, widgetKey) => {
    return DashboardUtils.widgetColors.map(color => {
      return <div
        key={`${key}-${color}`}
        onClick={() => setWidgetSettings(widgetKey, color)}
        className={'color-picker'}
        style={{
          backgroundColor: color,
          boxShadow: 'RGB(0 0 0 / 25%) 0px 0px 5px',
          border: color === updatedWidget.config.settings[widgetKey] ? '2px solid white' : ''
        }}
      >
        <img
          src={eyeDropperIcon}
          alt='eye-dropper-icon'
          className='color-picker-icon'
          hidden={color !== updatedWidget.config.settings[widgetKey]}
        />
      </div>
    })
  }

  const hideColorPicker = (event) => {
    const picker = document.getElementById(`${mainKey}-${widgetKey}-picker`);
    if (showColorPickerRef.current === true && event.target.id !== `switch-color-picker-btn-${mainKey}-${widgetKey}` &&
      (picker && !picker.contains(event.target))) {
      setShowColorPicker(false);
    }
  }

  return <div className={'color-selection-container'}>
    {renderColors(mainKey, widgetKey)}
    <GenericInput
      elementType={InputTypes.TEXT_INPUT}
      classNameProp='color-selector-input'
      elementConfig={{disabled: true}}
      value={updatedWidget.config.settings[widgetKey]}
    />
    <LightTooltip
      title={
        <div id={`${mainKey}-${widgetKey}-picker`}>
          <ChromePicker
            color={updatedWidget.config.settings[widgetKey]}
            onChange={(color) => setWidgetSettings(widgetKey, color.hex)}
            disableAlpha={true}
          />
        </div>
      }
      arrow
      placement="top"
      open={showColorPicker}
      PopperProps={{
        disablePortal: true
      }}
    >
      <div
        id={`switch-color-picker-btn-${mainKey}-${widgetKey}`}
        onClick={() => setShowColorPicker(!showColorPicker)}
        className={'color-picker'}
        style={{backgroundColor: "#F1F0F5"}}
      >
        <img src={paletteIcon} alt='palette-icon' className='color-picker-icon'/>
      </div>
    </LightTooltip>
  </div>
})

export default CustomColorPicker;