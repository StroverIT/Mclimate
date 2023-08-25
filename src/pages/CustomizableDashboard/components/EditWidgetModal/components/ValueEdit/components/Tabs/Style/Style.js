import React, {createRef, forwardRef, useImperativeHandle, useState} from 'react';
import {Button} from "reactstrap";
import linearIcon from "../../../../../../../../../assets/images/common/lenearIcon.svg";
import circularIcon from "../../../../../../../../../assets/images/common/circularIcon.svg";
import plusIcon from "../../../../../../../../../assets/images/common/plusIcon.svg";
import AppUtils from "../../../../../../../../../common/AppUtils";
import DynamicValueControls from "./components/DynamicValueControls/DynamicValueControls";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../../../../../../../store/valuePreview/actions";
import './style.scss'

export const STYLE_TYPES = {
  LINEAR: 'linear',
  CIRCULAR: 'circular',
  // FILL_LEVEL: 'Fill level',
}

const Style = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);
  const dynamicValueControlsRef = createRef();

  useImperativeHandle(ref, () => ({
    getData() {
      return widgetValues
    }
  }))

  const handleTypeChange = (type) => {
    dispatch(setValues({
      ...widgetValues,
      widgetType: type
    }))
  }

  return (
    <>
      <div style={{height: 35}}/>
      <h6>Style type</h6>
      <hr/>
      <div className={'types-btns-container'}>
        <Button
          className={`${widgetValues.widgetType === STYLE_TYPES.LINEAR ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTypeChange(STYLE_TYPES.LINEAR)}
        >
          <img
            src={linearIcon}
            alt={''}
            style={{height: 15, filter: widgetValues.widgetType === STYLE_TYPES.LINEAR ? AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#8b8a8a')}}/>&nbsp;
          Linear
        </Button>
        <Button
          className={`${widgetValues.widgetType === STYLE_TYPES.CIRCULAR ? 'primary-white-btn-active' : 'primary-white-button'}`}
          onClick={() => handleTypeChange(STYLE_TYPES.CIRCULAR)}
        >
          <img
            src={circularIcon}
            alt={''}
            style={{height: 15, filter: widgetValues.widgetType === STYLE_TYPES.CIRCULAR  ? AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#8b8a8a')}}/>&nbsp;
          Circular
        </Button>
        {/*<Button*/}
        {/*  className={`${styleType === STYLE_TYPES.FILL_LEVEL ? 'primary-white-btn-active' : 'primary-white-button'}`}*/}
        {/*  onClick={() => handleTypeChange(STYLE_TYPES.FILL_LEVEL)}*/}
        {/*>*/}
        {/*  <img*/}
        {/*    src={circleIcon}*/}
        {/*    alt={''}*/}
        {/*    style={{height: 15, filter: styleType === STYLE_TYPES.FILL_LEVEL  ? AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#8b8a8a')}}/>&nbsp;*/}
        {/*  Fill level*/}
        {/*</Button>*/}
      </div>
      <div style={{height: 25}}/>
      <div className={'value-controls-header'}>
        <h6>Values</h6>
        <h6>Colors</h6>
      </div>
      <hr/>
      <DynamicValueControls
        ref={dynamicValueControlsRef}
        buttonText={'Add a new value'}
        buttonIcon={plusIcon}
        initialSetOfInputs={2}
        updateInitialSet={() => {
        }}
        oneInputRequired={true}
        createdInputs={widgetValues.config.chartSettings}
        inputsPlaceholder={''}
        defaultValue={''}
        maxInputs={10}
      />
    </>
  );
});

export default Style;