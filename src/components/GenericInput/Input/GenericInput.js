import * as React from 'react';
import ReactSelect from "react-select";
import CreatableSelect from 'react-select/creatable'
import PropTypes from "prop-types";
import { InputTypes } from "../InputUtils/InputUtils";
import { Input } from "reactstrap";
import './generic-input.scss'

const GenericInput = (props) => {
  let inputElement = null;
  let validationError = null;
  let inputClasses = 'border-gray';
  let label = '';
  let wrapperClass = '';
  let labelExtraClass = '';
  let classNameProp = '';

  if (props.wrapperClass) {
    wrapperClass = props.wrapperClass;
  }

  if (props.labelExtraClass) {
    labelExtraClass = props.labelExtraClass;
  }

  if (props.classNameProp) {
    classNameProp = props.classNameProp;
  }

  if (props.label) {
    label = <label htmlFor={props.id} className={`${labelExtraClass} ${!props.valid ? 'error-label' : ''}`}>{props.label}</label>
  }

  if (typeof props.valid !== 'undefined' && !props.valid) {
    validationError = <p className='errorMsg'>{props.errorMsg}</p>;
    inputClasses = 'border-danger error-field';
  }

  switch (props.elementType) {
    case (InputTypes.TEXT_INPUT):
      inputElement = <Input
        {...props.elementConfig}
        value={props.value}
        id={props.id}
        onChange={props.onChange}
        onBlur={props.onBlur}
        style={{ paddingRight: props.elementConfig?.type === 'number' ? 5 : 35 }}
        className={`rounded ${classNameProp} ${inputClasses}`}
        maxLength={props.maxLength}
      />;
      break;
    case (InputTypes.SELECT):
      inputElement = <ReactSelect
        {...props.elementConfig}
        id={props.id}
        className={`${classNameProp}`}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        isMulti={props.elementConfig.isMulti ?? false}
        closeMenuOnSelect={props.elementConfig.closeMenuOnSelect ?? true}
        menuPlacement={props.elementConfig.menuPlacement ?? 'auto'}
        isDisabled={props.elementConfig.readOnlyInput ?? false}
        placeholder={props.elementConfig.placeholder ?? 'Select...'}
        isClearable={props.elementConfig.isClearable ?? false}
        isSearchable={true}
        noOptionsMessage={({ inputValue }) => !inputValue ? props.elementConfig.noOptionsMessage : "No results found"}
      // styles={{menu: (provided) => {
      //   return {...provided, position: props.selectInitialPosition ? 'initial' : 'absolute'}
      // }}}
      // menuIsOpen = {true}
      />;
      break;
    case (InputTypes.CHECKBOX):
      inputElement = <>
        <input
          {...props.elementConfig}
          id={props.id}
          type="checkbox"
          value={props.value}
          checked={typeof props.value !== 'undefined' ? props.value === true : undefined}
          onChange={props.onChange}
          className={classNameProp}
        />
        {typeof props.checkboxSpecificProps !== "undefined" ?
          <label htmlFor={props.id} className={props.checkboxSpecificProps.labelClassName}>
            {props.checkboxSpecificProps.labelContent}
          </label> : null
        }
      </>
      break;
    case (InputTypes.SELECT_CREATABLE):
      inputElement = <CreatableSelect
        {...props.elementConfig}
        id={props.id}
        className={`${classNameProp}`}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        isMulti={props.elementConfig.isMulti ?? false}
        closeMenuOnSelect={props.elementConfig.closeMenuOnSelect ?? true}
        menuPlacement={props.elementConfig.menuPlacement ?? 'auto'}
        isDisabled={props.elementConfig.readOnlyInput ?? false}
        placeholder={props.elementConfig.placeholder ?? 'Select...'}
        isClearable={props.elementConfig.isClearable ?? false}
        isSearchable={true}
        noOptionsMessage={({ inputValue }) => !inputValue ? props.elementConfig.noOptionsMessage : "No results found"}
      // styles={{menu: (provided) => {
      //   return {...provided, position: props.selectInitialPosition ? 'initial' : 'absolute'}
      // }}}
      // menuIsOpen = {true}
      />;
      break;
    default:
      inputElement = <Input
        {...props.elementConfig}
        value={props.value}
        id={props.id}
        onChange={props.onChange}
        onBlur={props.onBlur}
        style={{ paddingRight: props.elementConfig?.type === 'number' ? 5 : 35 }}
        className={`rounded ${classNameProp} ${inputClasses}`}
        maxLength={props.maxLength}
      />;
      break;
  }

  return (
    <div className={`input-group-container ${wrapperClass}`}>
      {label}
      {props.hr && <hr style={{ margin: '0 0 10px 0', color: '#F3F3F3' }} />}
      {inputElement}
      {validationError}
    </div>
  );

};

GenericInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string,
  valid: PropTypes.bool,
  elementConfig: PropTypes.any,
  elementType: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  classNameProp: PropTypes.string,
  errorMsg: PropTypes.string,
  maxLength: PropTypes.number,
  wrapperClass: PropTypes.string,
  labelExtraClass: PropTypes.string,
  itemType: PropTypes.any,
  customClass: PropTypes.string,
  styles: PropTypes.any,
  selectInitialPosition: PropTypes.bool,
  checkBoxSpecificProps: PropTypes.any
}

export default GenericInput;
