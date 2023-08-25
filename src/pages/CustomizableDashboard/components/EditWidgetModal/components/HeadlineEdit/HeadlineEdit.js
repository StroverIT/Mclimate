import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import DashboardUtils from "../../../../DashboardUtils";
import {Button} from "reactstrap";
import GenericInput from "../../../../../../components/GenericInput/Input/GenericInput";
import {InputTypes} from "../../../../../../components/GenericInput/InputUtils/InputUtils";
import CustomColorPicker from "../../../CustomColorPicker/CustomColorPicker";
import AppUtils from "../../../../../../common/AppUtils";
import alignLeftIcon from "../../../../../../assets/images/common/align-left.svg";
import alignCenterIcon from "../../../../../../assets/images/common/align-center.svg";
import alignRightIcon from "../../../../../../assets/images/common/align-right.svg";
import './headlineEdit.scss'

const HeadlineEdit = forwardRef(({widget}, ref) => {
  const [updatedWidget, setUpdatedWidget] = useState(widget);
  const backgroundColorPickerRef = useRef();
  const colorPickerRef = useRef();

  useImperativeHandle(ref, () => ({
    getWidgetData() {
      return updatedWidget;
    },
    checkFieldsValidity() {
      return true;
    }
  }))

  useEffect(() => {
    const modalBody = document.getElementsByClassName('modal-body')[0];
    if (modalBody) {
      modalBody.addEventListener("scroll", hideColorPicker)
    }

    return () => {
      if (modalBody) {
        modalBody.removeEventListener("scroll", hideColorPicker);
      }
    }
  }, [])

  const handleTextAlign = (alignment) => {
    setWidgetData('textAlign', alignment);
  }

  const handleHeadlineText = (event) => {
    setUpdatedWidget({
      ...updatedWidget,
      config: {
        ...updatedWidget.config,
        data: {
          value: event.target.value
        }
      }
    })
  }

  const handleSizeChange = (event) => {
    setWidgetData('size', event.value);
  }

  const setWidgetData = (key, value) => {
    setUpdatedWidget({
      ...updatedWidget,
      config: {
        ...updatedWidget.config,
        settings: {
          ...updatedWidget.config.settings,
          [key]: value
        }
      }
    })
  }

  const hideColorPicker = (event) => {
    colorPickerRef.current?.hidePicker(event);
    backgroundColorPickerRef.current?.hidePicker(event);
  }

  return (
    <div onClick={hideColorPicker}>
      <div>
        <textarea
          rows="1"
          className={'headline-textarea'}
          style={{
            fontSize: DashboardUtils.getFontSize(updatedWidget.config.settings.size),
            color: updatedWidget.config.settings.color,
            textAlign: updatedWidget.config.settings.textAlign,
            backgroundColor: updatedWidget.config.settings.backgroundColor
          }}
          onChange={handleHeadlineText}
          value={updatedWidget.config.data.value}
        />
      </div>
      <div style={{height: 15}}/>
      <div>
        <h6>Text align</h6>
        <hr/>
        <div className={'text-align-btns-container'}>
          <Button
            className={`${updatedWidget.config.settings.textAlign === 'start' ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => handleTextAlign('start')}
          >
            <img
              src={alignLeftIcon}
              alt='align-left-icon'
              className='widget-align-text-icon'
              style={{
                filter: updatedWidget.config.settings.textAlign === 'start' ?
                  AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#75788B')
              }}
            />&nbsp;Left
          </Button>
          <Button
            className={`${updatedWidget.config.settings.textAlign === 'center' ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => handleTextAlign('center')}
          >
            <img
              src={alignCenterIcon}
              alt='align-center-icon'
              className='widget-align-text-icon'
              style={{
                filter: updatedWidget.config.settings.textAlign === 'center' ?
                  AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#75788B')
              }}
            />&nbsp;Center
          </Button>
          <Button
            className={`${updatedWidget.config.settings.textAlign === 'end' ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => handleTextAlign('end')}
          >
            <img
              src={alignRightIcon}
              alt='align-right-icon'
              className='widget-align-text-icon'
              style={{
                filter: updatedWidget.config.settings.textAlign === 'end' ?
                  AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#75788B')
              }}
            />&nbsp;Right
          </Button>
        </div>
      </div>
      <div style={{height: 15}}/>
      <div>
        <h6>Size</h6>
        <hr/>
        <GenericInput
          elementType={InputTypes.SELECT}
          id='type'
          name='type'
          value={{value: updatedWidget.config.settings.size, label: `Size ${updatedWidget.config.settings.size}`}}
          valid={true}
          errorMsg={''}
          classNameProp={'select-size'}
          onChange={handleSizeChange}
          elementConfig={{
            options: [
              {value: 1, label: 'Size 1'},
              {value: 2, label: 'Size 2'},
              {value: 3, label: 'Size 3'},
              {value: 4, label: 'Size 4'},
              {value: 5, label: 'Size 5'},
              {value: 6, label: 'Size 6'},
            ],
            placeholder: 'Select size',
            classNamePrefix: 'select2-selection',
          }}
        />
      </div>
      <div style={{height: 35}}/>
      <div>
        <h6>Background Color</h6>
        <hr/>
        <CustomColorPicker
          ref={backgroundColorPickerRef}
          updatedWidget={updatedWidget}
          setWidgetSettings={setWidgetData}
          mainKey='background'
          widgetKey='backgroundColor'
        />
      </div>
      <div style={{height: 35}}/>
      <div>
        <h6>Text Color</h6>
        <hr/>
        <CustomColorPicker
          ref={colorPickerRef}
          updatedWidget={updatedWidget}
          setWidgetSettings={setWidgetData}
          mainKey='color'
          widgetKey='color'
        />
      </div>
    </div>
  );
});

export default HeadlineEdit;