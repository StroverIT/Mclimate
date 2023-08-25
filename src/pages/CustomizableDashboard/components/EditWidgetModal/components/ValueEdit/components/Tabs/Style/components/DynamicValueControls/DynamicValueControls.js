import {createRef, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState} from "react";
import {Button} from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import ValueControls from "../ValueControls/ValueControls";
import AppUtils from "../../../../../../../../../../../common/AppUtils";
import {useDispatch, useSelector} from "react-redux";
import {setValues} from "../../../../../../../../../../../store/valuePreview/actions";
import './dynamicValueControls.css'

const DynamicValueControls = forwardRef(({buttonText, buttonIcon, initialSetOfInputs, updateInitialSet, maxInputs, createdInputs, oneInputRequired} , ref) => {
  const dispatch = useDispatch();
  const widgetValues = useSelector((store) => store.widgetValueComponent.values);
  const [dynamicInputs, setDynamicInputs] = useState({
    elementsRef: [],
    inputsArray: []
  })

  useEffect(() => {
    if (createdInputs && createdInputs.length > 0) {
      const newDynamicInputs = {
        elementsRef: [],
        inputsArray: []
      }
      createdInputs.forEach(input => {
        insertInput(newDynamicInputs, input)
      })
      setDynamicInputs(newDynamicInputs);
    } else {
      if (initialSetOfInputs && dynamicInputs.inputsArray.length < initialSetOfInputs) {
        addNewInputs(initialSetOfInputs);
      }
    }
  }, [])

  useLayoutEffect(() => {
    setReduxWidgetSettings(dynamicInputs);
  }, [dynamicInputs])

  useImperativeHandle(ref, () => ({
    checkInputsValidity() {
      for (let index in dynamicInputs.elementsRef) {
        if (dynamicInputs.elementsRef[index].current?.checkForm().isFormValid === false) {
          return false
        }
      }
      return true
    },
    getData() {
      return dynamicInputs.elementsRef.map(ref => {
        return ref.current?.getData()
      }).filter(item => item !== undefined)
    }
  }));

  const makeDynamicInputsCopy = () => {
    return {
      elementsRef: dynamicInputs.elementsRef.map(item => {return item}),
      inputsArray: dynamicInputs.inputsArray.map(item => {return {...item}}),
    }
  }

  const addNewInputs = (setOfInputs) => {
    const dynamicInputsCopy = makeDynamicInputsCopy();
    if (setOfInputs > 0 && setOfInputs > dynamicInputs.inputsArray.length) {
      for (let i = 0; i < setOfInputs - dynamicInputs.inputsArray.length; i++) {
        insertInput(dynamicInputsCopy);
      }
      setDynamicInputs(dynamicInputsCopy);
      updateInitialSetOfInputs(dynamicInputsCopy.inputsArray.length)
    } else {
      insertInput(dynamicInputsCopy);
      setDynamicInputs(dynamicInputsCopy);
      updateInitialSetOfInputs(dynamicInputsCopy.inputsArray.length)
    }
  }

  const setReduxWidgetSettings = (dynamicInputsCopy) => {
    let reduxChartSettingsCopy = AppUtils.createObjectArrayCopy(widgetValues.config.chartSettings);
    if (dynamicInputsCopy.inputsArray.length < reduxChartSettingsCopy.length) {
      const remainingElements = [];
      dynamicInputsCopy.inputsArray.forEach(input => {
        const found = reduxChartSettingsCopy.find(element => element.id === input.ref.current.getId());
        if (found) {
          remainingElements.push(found);
        }
      })
      reduxChartSettingsCopy = remainingElements;
    } else {
      dynamicInputsCopy.inputsArray.forEach(inputComponent => {
        reduxChartSettingsCopy.push({
          id: inputComponent.ref.current.getId(),
          value: inputComponent.props.value !== 0 ? inputComponent.props.value : 0,
          color: inputComponent.props.color !== '#DDDDDD' ? inputComponent.props.color : '#DDDDDD'
        });
      })
    }

    const unique = AppUtils.removeDuplicateObjects(reduxChartSettingsCopy, 'id').sort((a, b) => {
      return parseInt(a.value) - parseInt(b.value);
    });

    dispatch(setValues({
      ...widgetValues,
      config: {
        ...widgetValues.config,
        chartSettings: unique
      }
    }))
  }

  const insertInput = (dynamicInputsRef, alreadyCreatedInput = null) => {
    dynamicInputsRef.elementsRef.push(createRef());
    const elementsRefLength = dynamicInputsRef.elementsRef.length;
    const key = uuidv4();
    if (alreadyCreatedInput) {
      dynamicInputsRef.inputsArray.push(
        <ValueControls
          ref={dynamicInputsRef.elementsRef[elementsRefLength - 1]}
          key={key}
          value={alreadyCreatedInput.value}
          color={alreadyCreatedInput.color}
          id={alreadyCreatedInput.id}
        />
      );
    } else {
      dynamicInputsRef.inputsArray.push(
        <ValueControls
          ref={dynamicInputsRef.elementsRef[elementsRefLength - 1]}
          key={key}
          id={key}
          value={0}
          color={'#DDDDDD'}
        />
      );
    }
  }


  const removeInput = (index) => {
    const dynamicInputsCopy = makeDynamicInputsCopy();
    dynamicInputsCopy.elementsRef.splice(index, 1);
    dynamicInputsCopy.inputsArray.splice(index, 1);
    setDynamicInputs(dynamicInputsCopy);
    updateInitialSetOfInputs(dynamicInputsCopy.inputsArray.length)
  }

  const updateInitialSetOfInputs = (numberOfInputs) => {
    if (updateInitialSet) {
      updateInitialSet(numberOfInputs);
    }
  }

  const isTrashHidden = () => {
    if (dynamicInputs.inputsArray.length === 0 && !oneInputRequired) {
      return false
    } else if (dynamicInputs.inputsArray.length === 1 && oneInputRequired) {
      return true
    } else {
      return false
    }
  }

  return (
    <div>
      {dynamicInputs.inputsArray.map((item, index) => {
        return <div key={item.key}>
          <div className={'dynamic-input-container'} key={item.key} id={item.key}>
            {item}
            <div aria-label="delete"
                    hidden={isTrashHidden()}
                    className={'delete-value-button'}
                    onClick={() => removeInput(index)}>
              <i className="uil-trash-alt" style={{fontSize: 15}}/>
            </div>
          </div>
          <hr/>
        </div>
      })}
      {maxInputs && dynamicInputs.inputsArray.length >= maxInputs ? null :
        <Button className={`add-new-value-control`}
              onClick={() => addNewInputs(1)}>
          {buttonIcon ? <img src={buttonIcon} alt={''} style={{filter: AppUtils.changeSVGColor('#57AFDF'), width: 12, margin: '0 7px 2px 0'}}/> : null}
        {buttonText ?? 'Add New'}
      </Button>}
    </div>
  )
})
export default DynamicValueControls