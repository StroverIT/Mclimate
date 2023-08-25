import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Button} from "reactstrap";
import AppUtils from "../../../../../../common/AppUtils";
import noImage from '../../../../../../assets/images/no-image.png'
import {InputTypes} from "../../../../../../components/GenericInput/InputUtils/InputUtils";
import GenericInput from "../../../../../../components/GenericInput/Input/GenericInput";
import {showMessage} from "../../../../../../helpers/ui_helper";
import CustomColorPicker from "../../../CustomColorPicker/CustomColorPicker";
import fullScreenResizeIcon from "../../../../../../assets/images/common/full-screen-resize.svg";
import fitToWidthIcon from "../../../../../../assets/images/common/fit-to-width.svg";
import {v4 as uuidv4} from "uuid";
import './imageEdit.scss'

const ImageEdit = forwardRef(({widget}, ref) => {
  const [updatedWidget, setUpdatedWidget] = useState(widget);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const colorPickerRef = useRef();

  let uploadInput;

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

  const handleImageUpload = () => {
    uploadInput.click();
  }

  useImperativeHandle(ref, () => ({
    getWidgetData() {
      return updatedWidget;
    },
    checkFieldsValidity() {
      let areFieldsValid = true;
      if (updatedWidget.config.data.value === null) {
        showMessage("Please, upload an image", true);
        areFieldsValid = false;
      }
      if (updatedWidget.config.data.addLink && updatedWidget.config.data.url === "") {
        setIsUrlValid(false);
        areFieldsValid = false;
      }
      return areFieldsValid;
    }
  }))

  const onFileUpload = (event) => {
    const files = AppUtils.onFileUpload(event, ['image/jpg', 'image/jpeg', 'image/png']);
    if (files.length === 1) {
      try {
        const type = files[0].type.split('/')[1];
        const renamedFile = new File([files[0]], `${uuidv4()}.${type}`, {type: `image/${type}`});
        const newImage = new Image();
        newImage.src = URL.createObjectURL(files[0]);
        setUpdatedWidget(prevState => {
          return {
            ...prevState,
            image: renamedFile.name,
            file: renamedFile,
            config: {
              ...prevState.config,
              data: {
                ...prevState.config.data,
                image: renamedFile.name,
                value: {
                  src: newImage.src
                }
              }
            }
          }
        })
      } catch (error) {
        console.log(error);
        showMessage('Something went wrong with uploading the selected image.', true);
      }
    }
  }

  const setWidgetSettings = (key, value) => {
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

  const setWidgetData = (key, value) => {
    if ((key === "url" && !isUrlValid && value !== "") || (key === "addLink" && !isUrlValid && !value)) {
      setIsUrlValid(true);
    }
    setUpdatedWidget({
      ...updatedWidget,
      config: {
        ...updatedWidget.config,
        data: {
          ...updatedWidget.config.data,
          [key]: value
        }
      }
    })
  }

  const hideColorPicker = (event) => {
    colorPickerRef.current?.hidePicker(event);
  }

  const handleShowBackgroundToggle = (event) => {
    setUpdatedWidget({
      ...updatedWidget,
      config: {
        ...updatedWidget.config,
        data: {
          ...updatedWidget.config.data,
          showBackground: event.target.checked
        },
        settings: {
          ...updatedWidget.config.settings,
          backgroundColor: !event.target.checked ? "transparent" : updatedWidget.config.settings.backgroundColor
        }
      }
    })
  }

  const getImageUrl = () => {
    if (updatedWidget.config.data?.image && updatedWidget.config.data?.image.includes('https://s3')) {
      return updatedWidget.config.data.image;
    } else if (updatedWidget.config.data.value) {
      return updatedWidget.config.data.value?.src
    }
    return noImage
  }

  return (
    <div onClick={hideColorPicker}>
      <div className={'widget-image-container'} style={{backgroundColor: updatedWidget.config.settings.backgroundColor}}>
        <img src={getImageUrl()} alt=""/>
        <Button
          color=""
          className="upload-image-to-widget"
          onClick={handleImageUpload}>
          <i className={'uil-image'}/>&nbsp;
          Upload new Image
        </Button>
        <input
          type='file'
          id='imgUpload'
          style={{display: 'none'}}
          ref={el => uploadInput = el}
          accept={AppUtils.file_types.JPG + AppUtils.file_types.PNG}
          onChange={(event) => onFileUpload(event)}
        />
      </div>
      <div style={{height: 20}}/>
      <div>
        <h6 style={{marginBottom: 0}}>Image Size</h6>
        <hr style={{margin: "10px 0"}}/>
        <div className={'image-size-btns-container'}>
          <Button
            className={`${updatedWidget.config.settings.backgroundSize === 'contain' ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => setWidgetSettings('backgroundSize', 'contain')}
          >
            <img
              src={fullScreenResizeIcon}
              alt='full-screen-resize-icon'
              className='widget-image-size-icon'
              style={{
                filter: updatedWidget.config.settings.backgroundSize === 'contain' ?
                  AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#75788B')
              }}
            />&nbsp;Contain
          </Button>
          <Button
            className={`${updatedWidget.config.settings.backgroundSize === 'cover' ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => setWidgetSettings('backgroundSize', 'cover')}
          >
            <img
              src={fitToWidthIcon}
              alt='fit-to-width-icon'
              className='widget-image-size-icon'
              style={{
                filter: updatedWidget.config.settings.backgroundSize === 'cover' ?
                  AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#75788B')
              }}
            />&nbsp;Cover
          </Button>
        </div>
      </div>
      <div style={{height: 20}}/>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
          <h6 style={{marginBottom: 0}}>Show Background</h6>
          <div className="form-check form-switch no-margin-switch">
            <input
              type="checkbox"
              className="form-check-input checkbox device-settings-checkbox"
              id={`show_background_checkbox`}
              checked={updatedWidget.config.data.showBackground}
              onChange={handleShowBackgroundToggle}
            />
          </div>
        </div>
        <hr style={{margin: "10px 0"}}/>
        {updatedWidget.config.data.showBackground ?
          <CustomColorPicker
            ref={colorPickerRef}
            updatedWidget={updatedWidget}
            setWidgetSettings={setWidgetSettings}
            mainKey='background'
            widgetKey='backgroundColor'
          /> : null
        }
      </div>
      <div style={{height: 20}}/>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
          <h6 style={{marginBottom: 0}}>Add Link</h6>
          <div className="form-check form-switch no-margin-switch">
            <input
              type="checkbox"
              className="form-check-input checkbox device-settings-checkbox"
              id={`add_link_checkbox`}
              checked={updatedWidget.config.data.addLink}
              onChange={(event) => setWidgetData('addLink', event.target.checked)}
            />
          </div>
        </div>
        <hr style={{margin: "10px 0"}}/>
        {updatedWidget.config.data.addLink ?
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
            <GenericInput
              elementType={InputTypes.TEXT_INPUT}
              onChange={(event) => setWidgetData('url', event.target.value)}
              elementConfig={{placeholder: "Your url here..."}}
              valid={isUrlValid}
              errorMsg={"URL cannot be empty"}
              value={updatedWidget.config.data.url}
              wrapperClass='image-widget-url'
            />
            <p style={{marginBottom: 0}}>&nbsp;Open in new tab</p>
            <div className="form-check form-switch no-margin-switch">
              <input
                type="checkbox"
                className="form-check-input checkbox device-settings-checkbox"
                id={`new_tab_checkbox`}
                checked={updatedWidget.config.data.openInNewTab}
                onChange={(event) => setWidgetData('openInNewTab', event.target.checked)}
              />
            </div>
          </div>
        : null}
      </div>
    </div>
  );
});

export default ImageEdit;