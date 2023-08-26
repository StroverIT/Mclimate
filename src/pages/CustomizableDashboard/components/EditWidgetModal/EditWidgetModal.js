// Styles
import './editWidgetModal.scss'

// React 
import React, { createRef } from 'react';
import { useParams } from "react-router-dom";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";


// Utils
import { renderWidgetBody } from "./ModalHelper/ModalHelper";
import AppUtils from "../../../../common/AppUtils";

// Componenst
import DashboardUtils from "../../DashboardUtils";


// --- Redux ----
import { useDispatch, useSelector } from "react-redux"

// Actions
import { openCloseEditWidgetModal, setDashboard } from "../../../../store/customizableDashboard/actions";
import { hideSpinner, showSpinner } from "../../../../store/spinner/actions";

// Reducers
import { initialChartWidgetState } from "../../../../store/chartWidget/reducer";
import { initialBooleanWidgetState } from "../../../../store/booleanWidget/reducer";
import { initialIframeWidgetState } from '../../../../store/iframeWidget/reducer';
import { initialState } from "../../../../store/valuePreview/reducer";


const EditWidgetModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((store) => store.customizableDashboard.isEditWidgetModalOpen);
  const widget = useSelector((store) => store.customizableDashboard.widget);
  const dashboard = useSelector((store) => store.customizableDashboard.dashboard);
  const widgetRef = createRef();

  const closeModal = () => {
    dispatch(openCloseEditWidgetModal(false));
  }

  const handleSave = () => {
    const dashboardCopy = DashboardUtils.copyDashboard(dashboard);
    if (widgetRef.current.checkFieldsValidity()) {
      const updatedWidget = widgetRef.current.getWidgetData();
      let foundWidgetIndex = dashboardCopy.widgets.findIndex(widget => parseInt(widget.id) === parseInt(updatedWidget.i));

      if (foundWidgetIndex === -1) {
        // CREATE WIDGET
        let newDashboardWidget = {};
        switch (widget.type) {
          case 'value':
            const settings = {
              settings: updatedWidget.config.settings,
              chartSettings: updatedWidget.config.chartSettings
            }
            const data = getWidgetData(updatedWidget, initialState.values);
            // Create new widget
            newDashboardWidget = {
              id: widget.i,
              type: widget.type,
              coordinates: [widget.x, widget.y],
              size: [widget.w, widget.h],
              component: widget.component,
              settings: { ...settings },
              data: { ...data }
            }
            break;
          case 'chart':
            const chartSettings = {
              settings: updatedWidget.config.settings,
            }
            const chartData = getWidgetData(updatedWidget, initialChartWidgetState.values);
            newDashboardWidget = {
              id: widget.i,
              type: widget.type,
              coordinates: [widget.x, widget.y],
              size: [widget.w, widget.h],
              component: widget.component,
              settings: { ...chartSettings },
              data: { ...chartData }
            }
            break;
          case 'boolean':
            const booleanData = getWidgetData(updatedWidget, initialBooleanWidgetState.values);
            newDashboardWidget = {
              id: widget.i,
              type: widget.type,
              coordinates: [widget.x, widget.y],
              size: [widget.w, widget.h],
              component: widget.component,
              settings: { settings: { ...updatedWidget.config.settings } },
              data: { ...booleanData }
            }
            break;
            case 'iframe':
              const iframeData = getWidgetData(updatedWidget, initialIframeWidgetState.values);
              newDashboardWidget = {
                id: widget.i,
                type: widget.type,
                coordinates: [widget.x, widget.y],
                size: [widget.w, widget.h],
                component: widget.component,
                settings: { settings: { ...updatedWidget.config.settings } },
                data: { ...iframeData }
              }
              break;
          case 'image':
            newDashboardWidget = {
              id: updatedWidget.i,
              type: updatedWidget.type,
              coordinates: [updatedWidget.x, updatedWidget.y],
              size: [updatedWidget.w, updatedWidget.h],
              component: updatedWidget.component,
              file: updatedWidget.file,
              image: updatedWidget.image,
              ...updatedWidget.config
            }
            break;
          default:
            newDashboardWidget = {
              id: updatedWidget.i,
              type: updatedWidget.type,
              coordinates: [updatedWidget.x, updatedWidget.y],
              size: [updatedWidget.w, updatedWidget.h],
              component: updatedWidget.component,
              ...updatedWidget.config
            }
        }
        postWidget(newDashboardWidget, dashboardCopy);
      } else {
        switch (updatedWidget.type) {
          
          case 'value':
            const settings = {
              settings: updatedWidget.config.settings,
              chartSettings: updatedWidget.config.chartSettings
            }
            const data = getWidgetData(updatedWidget, initialState.values);
            dashboardCopy.widgets[foundWidgetIndex] = { ...dashboardCopy.widgets[foundWidgetIndex], settings: { ...settings }, data: { ...data } }
            DashboardUtils.widgets[foundWidgetIndex] = { ...DashboardUtils.widgets[foundWidgetIndex], settings: { ...settings }, data: { ...data } }
            break;
          case 'chart':
            const chartSettings = {
              settings: updatedWidget.config.settings,
            }
            const chartData = getWidgetData(updatedWidget, initialChartWidgetState.values);
            dashboardCopy.widgets[foundWidgetIndex] = { ...dashboardCopy.widgets[foundWidgetIndex], settings: { ...chartSettings }, data: { ...chartData } }
            DashboardUtils.widgets[foundWidgetIndex] = { ...DashboardUtils.widgets[foundWidgetIndex], settings: { ...chartSettings }, data: { ...chartData } }
            break;
          case 'boolean':
            const booleanData = getWidgetData(updatedWidget, initialBooleanWidgetState.values);
            dashboardCopy.widgets[foundWidgetIndex] = { ...dashboardCopy.widgets[foundWidgetIndex], settings: { settings: { ...updatedWidget.config.settings } }, data: { ...booleanData } }
            DashboardUtils.widgets[foundWidgetIndex] = { ...DashboardUtils.widgets[foundWidgetIndex], settings: { settings: { ...updatedWidget.config.settings } }, data: { ...booleanData } }
            break;
          case 'image':
            const config = { ...AppUtils.createObjectCopy(updatedWidget.config) };

            if (updatedWidget.image) {
              config.data.image = updatedWidget.image;
              dashboardCopy.widgets[foundWidgetIndex].image = updatedWidget.image
              DashboardUtils.widgets[foundWidgetIndex].image = updatedWidget.image
            } else {
              delete dashboardCopy.widgets[foundWidgetIndex].image
              delete DashboardUtils.widgets[foundWidgetIndex].image
            }

            dashboardCopy.widgets[foundWidgetIndex].file = updatedWidget.file ?? null
            DashboardUtils.widgets[foundWidgetIndex].file = updatedWidget.file ?? null
            dashboardCopy.widgets[foundWidgetIndex] = { ...dashboardCopy.widgets[foundWidgetIndex], ...config }
            DashboardUtils.widgets[foundWidgetIndex] = { ...DashboardUtils.widgets[foundWidgetIndex], ...config }
            break;
            case "iframe":
                const iFrameSettings = {
                  settings: updatedWidget.config.settings,
                }
                const iframeData = getWidgetData(updatedWidget, initialIframeWidgetState.values);
                console.log("updated data", iframeData);

                dashboardCopy.widgets[foundWidgetIndex] = { ...dashboardCopy.widgets[foundWidgetIndex], settings: { ...iFrameSettings }, data: { ...iframeData } }
                DashboardUtils.widgets[foundWidgetIndex] = { ...DashboardUtils.widgets[foundWidgetIndex], settings: { ...iFrameSettings }, data: { ...iframeData } }
                break;
          default:
            dashboardCopy.widgets[foundWidgetIndex] = { ...dashboardCopy.widgets[foundWidgetIndex], ...updatedWidget.config }
            DashboardUtils.widgets[foundWidgetIndex] = { ...DashboardUtils.widgets[foundWidgetIndex], ...updatedWidget.config }
        }

        dispatch(setDashboard(dashboardCopy));
      }
      setTimeout(() => {
        closeModal();
      }, 500)
    }
  }

  const postWidget = (widget, dashboardCopy) => {
    dispatch(showSpinner());
    const widgetCopy = { ...widget };
    widgetCopy['dashboardId'] = 202;

    let formData = new FormData();
    Object.keys(widgetCopy).forEach(key => {
      switch (key) {
        case 'size':
          widgetCopy[key] = JSON.stringify(widgetCopy[key]);
          break;
        case 'coordinates':
          widgetCopy[key] = JSON.stringify(widgetCopy[key]);
          break;
        case 'data':
          widgetCopy[key] = JSON.stringify(widgetCopy[key]);
          break;
        case 'settings':
          widgetCopy[key] = JSON.stringify(widgetCopy[key]);
          break;
      }
      formData.append(key, widgetCopy[key]);
    })

    let response = widgetCopy;

    if (response) {
      widget.id = dashboardCopy.widgets.length + 1;
      widget.image = response?.image;
      widget.data.image = response?.image;
      widget.dahboard = {
        "id": 202,
        "buildingId": 534,
        "name": "Home overview",
        "icon": "uil-home",
        "visibility": "Private",
        "createdAt": "2023-01-25T13:45:49.753Z",
        "updatedAt": "2023-02-17T15:35:11.000Z"
      };

      dashboardCopy.widgets.push(widget);
      DashboardUtils.widgets.push(widget);
      DashboardUtils.addWidget(widget);
      dispatch(setDashboard(dashboardCopy));
    }

    dispatch(hideSpinner());
  }

  const getWidgetData = (updatedWidget, reduxKeys) => {
    const data = {};
    Object.keys(reduxKeys).forEach(key => {
      if (key !== 'config') {
        data[key] = updatedWidget[key];
      }
    })
    return data;
  }

  return (
    <Modal
      isOpen={isModalOpen}
      toggle={closeModal}
      centered
      autoFocus={false}
      scrollable={false}
      size="xl"
    >
      <ModalHeader className="controller-modal-header">
        {widget?.i < 0 ? 'Add new ' : 'Edit'} {widget?.type} widget
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
        {renderWidgetBody(widget, widgetRef)}
      </ModalBody>
      <footer className={'modal-widget-footer'}>
        <Button
          color=""
          className="fp-gray-btn"
          onClick={() => {
            dispatch(openCloseEditWidgetModal(false));
          }}>
          Cancel
        </Button>
        <div style={{ width: 7 }} />
        <Button
          color="primary"
          className="btn btn-primary waves-effect waves-light float-md-end widget-modal-save-btn"
          onClick={handleSave}
        >
          <i className="uil-save" />&nbsp; Save
        </Button>
      </footer>
    </Modal>
  );
};

export default EditWidgetModal;