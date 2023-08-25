import {createRef, forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Button} from "reactstrap";
import DynamicInput from "./DynamicInput";
import {IconButton} from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';
import {showMessage} from "../../../helpers/ui_helper";
import './dynamicInput.scss'
import {hideSpinner} from "../../../store/spinner/actions";
import {useDispatch} from "react-redux";

const DynamicInputsSet = forwardRef(({buttonText, initialSetOfInputs, updateInitialSet, maxInputs,
                                       createdInputs, inputsPlaceholder, defaultValue, deleteHandler, oneInputRequired} , ref) => {
  const dispatch = useDispatch();
  const [dynamicInputs, setDynamicInputs] = useState({
    elementsRef: [],
    inputsArray: []
  })

  useEffect(() => {
    if ((createdInputs && initialSetOfInputs) && (createdInputs.length > 0 && initialSetOfInputs === createdInputs.length) ) {
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
      } else if (initialSetOfInputs < dynamicInputs.inputsArray.length) {
        if (initialSetOfInputs >= 0 && !oneInputRequired) {
          removeInputs(initialSetOfInputs);
        } else if (initialSetOfInputs > 0 && oneInputRequired) {
          removeInputs(initialSetOfInputs);
        }
      }
    }
  }, [initialSetOfInputs, createdInputs])

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
        return ref.current?.getForm()
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

  const removeInputs = (setOfInputs) => {
    const dynamicInputsCopy = makeDynamicInputsCopy();
    if (setOfInputs >= 0) {
      const removedInputs = dynamicInputsCopy.elementsRef.splice(setOfInputs).map(removedInput => {
        return removedInput.current?.getForm().id;
      }).filter(removedField => removedField !== -1)
      dynamicInputsCopy.inputsArray.splice(setOfInputs)
      deleteHandler(...removedInputs)
        .then(() => {
          setDynamicInputs(dynamicInputsCopy);
        })
        .catch(error => {
          console.log(error);
          showMessage("Something went wrong with fields deletion", true);
        })
        .finally(() => {
          dispatch(hideSpinner());
        })
    }
  }

  const insertInput = (dynamicInputsRef, alreadyCreatedInput = null) => {
    dynamicInputsRef.elementsRef.push(createRef());
    const elementsRefLength = dynamicInputsRef.elementsRef.length;
    if (alreadyCreatedInput) {
      dynamicInputsRef.inputsArray.push(
        <DynamicInput ref={dynamicInputsRef.elementsRef[elementsRefLength - 1]}
                      key={uuidv4()}
                      defaultValue={`${alreadyCreatedInput.name}`}
                      id={alreadyCreatedInput.id}
                      placeholder={inputsPlaceholder}/>
      );
    } else {
      dynamicInputsRef.inputsArray.push(
        <DynamicInput ref={dynamicInputsRef.elementsRef[elementsRefLength - 1]}
                      key={uuidv4()}
                      defaultValue={`${defaultValue} ${elementsRefLength}`}
                      placeholder={inputsPlaceholder}/>
      );
    }
  }

  const deleteInput = (index) => {
    const dynamicInputsCopy = makeDynamicInputsCopy();
    const id = dynamicInputsCopy.elementsRef[index].current?.getForm().id;
    if (deleteHandler && id && id !== -1) {
      deleteHandler(id)
        .then(() => {
          removeInput(index, dynamicInputsCopy);
        })
        .catch(error => {
          console.log(error);
          showMessage("Something went wrong with field deletion", true);
        })
        .finally(() => {
          dispatch(hideSpinner());
        })
    } else {
      removeInput(index, dynamicInputsCopy);
    }
  }

  const removeInput = (index, dynamicInputsCopy) => {
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

  const getBtnClasses = () => {
    if (dynamicInputs.inputsArray.length === 0 && !oneInputRequired) {
      return 'add-new-input-expanded'
    } else if (dynamicInputs.inputsArray.length === 1 && oneInputRequired) {
      return 'add-new-input-expanded'
    } else {
      return ''
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
        return <div className={'dynamic-input-container'} key={item.key} id={item.key}>
          {item}
          <IconButton aria-label="delete"
                      hidden={isTrashHidden()}
                      className={'icon-button'}
                      onClick={() => deleteInput(index)}>
            <i className="uil-trash-alt"/>
          </IconButton>
        </div>
      })}
      {maxInputs && dynamicInputs.inputsArray.length >= maxInputs ? null :
        <Button className={`add-new-input ${getBtnClasses()}`}
              onClick={() => addNewInputs(1)}>
        {buttonText ?? 'Add New'}
      </Button>}
    </div>
  )
})
export default DynamicInputsSet