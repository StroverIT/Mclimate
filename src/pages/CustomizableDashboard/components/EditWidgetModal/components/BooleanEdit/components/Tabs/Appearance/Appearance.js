import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import CustomColorPicker from "../../../../../../CustomColorPicker/CustomColorPicker";
import {useDispatch, useSelector} from "react-redux";
import {setBooleanWidgetValues} from "../../../../../../../../../store/booleanWidget/actions";
import InputUtils, {InputTypes} from "../../../../../../../../../components/GenericInput/InputUtils/InputUtils";
import AppUtils from "../../../../../../../../../common/AppUtils";
import GenericInput from "../../../../../../../../../components/GenericInput/Input/GenericInput";
import {useMediaQuery} from "@material-ui/core";
import './appearance.scss'

const formObj = {
  isFormValid: true,
  displayOnText: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: ''
  },
  displayOffText: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: ''
  }
}

const Appearance = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const widgetValues = useSelector((store) => store.booleanWidget.values);
  const displayOnColorRef = useRef();
  const displayOffColorRef = useRef();
  const backgroundColorRef = useRef();
  const textColorRef = useRef();
  const matchesSmallModal = useMediaQuery('(max-width:1200px)');

  useEffect(() => {
    setForm({
      ...form,
      isFormValid: true,
      displayOnText: {
        ...form['displayOnText'],
        value: widgetValues.displayOnText,
        valid: true
      },
      displayOffText: {
        ...form['displayOffText'],
        value: widgetValues.displayOffText,
        valid: true
      }
    })
  }, [widgetValues.displayOnText, widgetValues.displayOnText])

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const onChange = (inputId, event, inputType) => {
    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
    dispatch(setBooleanWidgetValues({...widgetValues, [inputId]: event.target.value}))
  }

  const handleOnChangeSettings = (key, event) => {
    dispatch(setBooleanWidgetValues({
      ...widgetValues,
      config: {
        ...widgetValues.config,
        settings: {
          ...widgetValues.config.settings,
          [key]: typeof event === 'string' ? event : event.target.value
        }
      }
    }))
  }

  const renderContent = () => {
    if (!matchesSmallModal) {
      return <>
        <div style={{height: 35}}/>
        <div style={{display: 'flex', width: '100%', gap: '4%'}}>
          <div style={{width: '48%'}}>
            <h6>Display ON text</h6>
          </div>
          <div style={{width: '48%'}}>
            <h6>Display ON color</h6>
          </div>
        </div>
        <hr/>
        <div style={{display: 'flex', width: '100%', gap: '4%'}}>
          <div style={{width: '47.5%'}}>
            <GenericInput
              value={form.displayOnText.value}
              label={''}
              valid={form.displayOnText.valid}
              errorMsg={form.displayOnText.errorMsg}
              onChange={(e) => onChange('displayOnText', e, InputTypes.TEXT_INPUT)}
              elementConfig={{
                type: 'text',
                placeholder: 'Display ON text',
                tabIndex: 1
              }}
            />
          </div>
          <div style={{width: '47.5%'}}>
            <CustomColorPicker
              ref={displayOnColorRef}
              updatedWidget={widgetValues}
              setWidgetSettings={handleOnChangeSettings}
              mainKey='displayOnColor'
              widgetKey='displayOnColor'
            />
          </div>
        </div>

        <div style={{height: 25}}/>
        <div style={{display: 'flex', width: '100%', gap: '4%'}}>
          <div style={{width: '48%'}}>
            <h6>Display OFF text</h6>
          </div>
          <div style={{width: '48%'}}>
            <h6>Display OFF color</h6>
          </div>
        </div>
        <hr/>
        <div style={{display: 'flex', width: '100%', gap: '4%'}}>
          <div style={{width: '47.5%'}}>
            <GenericInput
              value={form.displayOffText.value}
              label={''}
              valid={form.displayOffText.valid}
              errorMsg={form.displayOffText.errorMsg}
              onChange={(e) => onChange('displayOffText', e, InputTypes.TEXT_INPUT)}
              elementConfig={{
                type: 'text',
                placeholder: 'Display OFF text',
                tabIndex: 2
              }}
            />
          </div>
          <div style={{width: '47.5%'}}>
            <CustomColorPicker
              ref={displayOffColorRef}
              updatedWidget={widgetValues}
              setWidgetSettings={handleOnChangeSettings}
              mainKey='displayOffColor'
              widgetKey='displayOffColor'
            />
          </div>
        </div>

        <div style={{height: 25}}/>
        <div style={{display: 'flex', width: '100%', gap: '4%'}}>
          <div style={{width: '48%'}}>
            <h6>Background Color</h6>
          </div>
          <div style={{width: '48%'}}>
            <h6>Text Color</h6>
          </div>
        </div>
        <hr/>

        <div style={{display: 'flex', width: '100%', gap: '4%'}}>
          <div style={{width: '47.5%'}}>
            <CustomColorPicker
              ref={backgroundColorRef}
              updatedWidget={widgetValues}
              setWidgetSettings={handleOnChangeSettings}
              mainKey='backgroundColor'
              widgetKey='backgroundColor'
            />
          </div>
          <div style={{width: '47.5%'}}>
            <CustomColorPicker
              ref={textColorRef}
              updatedWidget={widgetValues}
              setWidgetSettings={handleOnChangeSettings}
              mainKey='titleColor'
              widgetKey='titleColor'
            />
          </div>
        </div>
      </>
    } else {
      return <div>
        <div style={{height: 35}}/>

        <h6>Display ON text</h6>
        <hr/>
        <div className={'boolean-widget-text-input-container'}>
          <GenericInput
            value={form.displayOnText.value}
            label={''}
            valid={form.displayOnText.valid}
            errorMsg={form.displayOnText.errorMsg}
            onChange={(e) => onChange('displayOnText', e, InputTypes.TEXT_INPUT)}
            elementConfig={{
              type: 'text',
              placeholder: 'Display ON text',
              tabIndex: 1
            }}
          />
        </div>

        <div style={{height: 25}}/>
        <h6>Display OFF text</h6>
        <hr/>
        <div className={'boolean-widget-text-input-container'}>
          <GenericInput
            value={form.displayOffText.value}
            label={''}
            valid={form.displayOffText.valid}
            errorMsg={form.displayOffText.errorMsg}
            onChange={(e) => onChange('displayOffText', e, InputTypes.TEXT_INPUT)}
            elementConfig={{
              type: 'text',
              placeholder: 'Display OFF text',
              tabIndex: 2
            }}
          />
        </div>

        <div style={{height: 25}}/>
        <div>
          <h6>Display ON color</h6>
          <hr/>
          <CustomColorPicker
            ref={displayOnColorRef}
            updatedWidget={widgetValues}
            setWidgetSettings={handleOnChangeSettings}
            mainKey='displayOnColor'
            widgetKey='displayOnColor'
          />
        </div>

        <div style={{height: 25}}/>
        <div>
          <h6>Display OFF color</h6>
          <hr/>
          <CustomColorPicker
            ref={displayOffColorRef}
            updatedWidget={widgetValues}
            setWidgetSettings={handleOnChangeSettings}
            mainKey='displayOffColor'
            widgetKey='displayOffColor'
          />
        </div>

        <div style={{height: 25}}/>
        <div>
          <h6>Background Color</h6>
          <hr/>
          <CustomColorPicker
            ref={backgroundColorRef}
            updatedWidget={widgetValues}
            setWidgetSettings={handleOnChangeSettings}
            mainKey='backgroundColor'
            widgetKey='backgroundColor'
          />
        </div>

        <div style={{height: 25}}/>
        <div>
          <h6>Text Color</h6>
          <hr/>
          <CustomColorPicker
            ref={textColorRef}
            updatedWidget={widgetValues}
            setWidgetSettings={handleOnChangeSettings}
            mainKey='titleColor'
            widgetKey='titleColor'
          />
        </div>
      </div>
    }
  }

  return renderContent()
});

export default Appearance;