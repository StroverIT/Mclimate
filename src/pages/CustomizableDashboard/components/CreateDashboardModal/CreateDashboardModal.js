import React, {useState} from 'react';
import {batch, useDispatch, useSelector} from "react-redux";
import {openCloseCreateDashboardModal} from "../../../../store/customizableDashboard/actions";
import {Button, Modal, ModalBody, ModalHeader} from "reactstrap";
import GenericInput from "../../../../components/GenericInput/Input/GenericInput";
import InputUtils, {InputTypes} from "../../../../components/GenericInput/InputUtils/InputUtils";
import lock from '../../../../assets/images/common/lock.svg'
import globe from '../../../../assets/images/common/globe.svg'
import AppUtils from "../../../../common/AppUtils";
import {icons} from "./Icons";
import {showMessage} from "../../../../helpers/ui_helper";
import {hideSpinner, showSpinner} from "../../../../store/spinner/actions";
import {unstable_batchedUpdates} from "react-dom";
import {useHistory} from "react-router-dom";
import {post} from "../../../../helpers/api_helper";
import {getBuildingAssetSuccess} from "../../../../store/buildings/actions";
import {generatePath} from "react-router-dom";
import {AllRoutes} from "../../../../routes/allRoutes";
import {closeCreateDashboardModal} from "../../../../store/customizableDashboard/reducer";
import {DefinedAxiosInstances} from "../../../../App";
import {DASHBOARDS} from "../../../../helpers/url_helper";
import './createDashboardModal.scss'

const formObj = {
  isFormValid: true,
  name: {
    value: '',
    regex: InputUtils.NON_EMPTY_STRING,
    valid: true,
    errorMsg: 'Invalid Dashboard Name'
  },
  filterIcon: {
    value: '',
    regex: '',
    valid: true,
    errorMsg: 'Invalid Dashboard Name'
  }
}

const initialDashboardSettings = {
  icon: 'uil-grid',
  visibility: 'Private'
}

const CreateDashboardModal = () => {
  const dispatch = useDispatch();
  const modalData = useSelector((store) => store.customizableDashboard.createDashboardModalData);
  const buildings = useSelector((store) => store.buildings.buildings);
  const [form, setForm] = useState(AppUtils.createObjectCopy(formObj));
  const [dashboardIcons, sedDashboardIcons] = useState(AppUtils.createObjectCopy(icons));
  const [dashboardSettings, setDashboardSettings] = useState(AppUtils.createObjectCopy(initialDashboardSettings));
  const history = useHistory();

  const closeModal = () => {
    unstable_batchedUpdates(() => {
      dispatch(openCloseCreateDashboardModal(closeCreateDashboardModal));
      setForm(AppUtils.createObjectCopy(formObj));
      setDashboardSettings(AppUtils.createObjectCopy(initialDashboardSettings));
      sedDashboardIcons(AppUtils.createObjectCopy(icons))
    })
  }

  const onChange = (inputId, event, inputType) => {
    setForm(InputUtils.inputOnChange(inputId, event, inputType, form, true))
    if (inputId === 'filterIcon') {
      applyFilter(event.target.value)
    }
  }

  const applyFilter = (value) => {
    if (value !== '') {
      const filtered = icons.filter(icon => icon.includes(value))
      sedDashboardIcons(filtered)
    } else {
      sedDashboardIcons(AppUtils.createObjectCopy(icons));
    }
  }

  const checkFieldValidity = (inputId) => {
    setForm(InputUtils.checkFieldValidity(inputId, form));
  }

  const handleOnChangeSettings = (value, key) => {
    setDashboardSettings({
      ...dashboardSettings,
      [key]: value
    })
  }

  const handleSave = () => {
    const formCopy = InputUtils.checkFormValidity(form);
    setForm(formCopy);
    if (formCopy.isFormValid) {
     if (dashboardSettings.icon === '') {
       showMessage('Please select an icon', true);
     } else {
       dispatch(showSpinner());
       const dashboard = {
         name: formCopy.name.value,
         visibility: dashboardSettings.visibility,
         icon: dashboardSettings.icon,
         buildingId: parseInt(modalData?.buildingId)
       }

       // Create Dashboard
       post(DASHBOARDS, dashboard, {}, DefinedAxiosInstances.ENTERPRISE_URL)
         .then(response => {
           if (response.status && (response.status < 200 || response.status >= 300)) {
             dispatch(hideSpinner());
             showMessage(response.data.message, true);
             closeModal();
           } else {
             dashboard.id = response?.id;
             const currBuilding = buildings.find(building => building.id === parseInt(modalData?.buildingId));

             batch(() => {
               if (currBuilding) {
                 currBuilding.dashboards.push(dashboard);
                 dispatch(getBuildingAssetSuccess('buildings', currBuilding));
               }
               dispatch(hideSpinner());
             })
             closeModal();

             setTimeout(() => {
               history.push(generatePath(AllRoutes.CUSTOMIZABLE_DASHBOARD.path, {buildingId: modalData.buildingId, dashboardId: dashboard.id}));
             }, 50)
           }
         })
         .catch((e) => {
           console.log(e);
           dispatch(hideSpinner());
           showMessage('Something went wrong while creating dashboard', true);
           closeModal();
         })
     }
    }
  }

  return (
    <Modal
      isOpen={modalData.isModalOpen}
      toggle={closeModal}
      centered
      zIndex={2000}
      autoFocus={false}
      scrollable={false}
      size="xl"
    >
      <ModalHeader className="widgets-modal-header">
        Create a new dashboard
        <button
          type="button"
          onClick={closeModal}
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </ModalHeader>
      <ModalBody>
        <GenericInput
          value={form.name.value}
          label={'Name'}
          valid={form.name.valid}
          errorMsg={form.name.errorMsg}
          onChange={(e) => onChange('name', e, InputTypes.TEXT_INPUT)}
          onBlur={() => checkFieldValidity('name')}
          elementConfig={{
            type: 'text',
            autoFocus: true,
            tabIndex: 1
          }}
        />
        <div style={{height: 25}}/>
        <GenericInput
          value={form.filterIcon.value}
          label={'Icon'}
          valid={form.filterIcon.valid}
          errorMsg={form.filterIcon.errorMsg}
          onChange={(e) => onChange('filterIcon', e, InputTypes.TEXT_INPUT)}
          onBlur={() => checkFieldValidity('filterIcon')}
          elementConfig={{
            type: 'text',
            placeholder: 'Search for an icon',
            tabIndex: 2
          }}
        />
        <div style={{height: 25}}/>
        <div className={'dashboard-icons icon-demo-content'}>
          {dashboardIcons.length > 0 ? dashboardIcons.map((iconName,idx) => {
            return <div key={`icon-${iconName}-${idx}`} className={'col-xl-1 col-lg-1 col-sm-6 dashboard-icon-container'} title={iconName}>
              <i className={`${iconName} icon-dashboard ${dashboardSettings.icon === iconName ? 'selected-icon' : ''}`} onClick={() => handleOnChangeSettings(iconName, 'icon')}/>
            </div>
          }) : <div className={'no-icons'}>
            <i className={'uil-annoyed'}/>
            <h4>No Icons Found</h4>
          </div>}
        </div>
        <div style={{height: 25}}/>
        <h6>Visibility</h6>
        <div className={'visibility-btns-container'}>
          <Button
            className={`${dashboardSettings.visibility === 'Private' ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => handleOnChangeSettings('Private', 'visibility')}
          >
            <img
              src={lock}
              alt={''}
              style={{height: 15, filter: dashboardSettings.visibility === 'Private' ? AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#8b8a8a')}}/>&nbsp;
            Private
          </Button>
          <Button
            className={`${dashboardSettings.visibility === 'Public' ? 'primary-white-btn-active' : 'primary-white-button'}`}
            onClick={() => handleOnChangeSettings('Public', 'visibility')}
          >
            <img
              src={globe}
              alt={''}
              style={{height: 15, filter: dashboardSettings.visibility === 'Public' ? AppUtils.changeSVGColor('#55AEE1') : AppUtils.changeSVGColor('#8b8a8a')}}/>&nbsp;
            Public
          </Button>
        </div>
      </ModalBody>
      <footer className={'modal-create-dashboard-footer'}>
        <Button
          color=""
          className="fp-gray-btn"
          onClick={closeModal}>
          Cancel
        </Button>
        <div style={{width: 7}}/>
        <Button
          color="primary"
          className="btn btn-primary waves-effect waves-light float-md-end widget-modal-save-btn"
          onClick={handleSave}
        >
         Create
        </Button>
      </footer>
    </Modal>
  );
};

export default CreateDashboardModal;