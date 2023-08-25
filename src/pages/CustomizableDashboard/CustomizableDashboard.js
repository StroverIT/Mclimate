import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Row } from "reactstrap";
import { batch, useDispatch, useSelector } from "react-redux";
import {
  openCloseWidgetModal, setDashboard, setEditMode, setPendingForDataWidgets
} from "../../store/customizableDashboard/actions";
import Layout from "./components/Layout/Layout";
import WidgetsModal from "./components/WidgetsModal/WidgetsModal";
import DashboardUtils from "./DashboardUtils";
import { hideSpinner, showSpinner } from "../../store/spinner/actions";
import { showMessage } from "../../helpers/ui_helper";
import { unstable_batchedUpdates } from "react-dom";
import { usePrevious } from "../../Hooks/usePrevious";
import AppUtils from "../../common/AppUtils";
import { useMediaQuery } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import noWidgets from '../../assets/images/no-widgets.svg'
import refreshIcon from "../../assets/images/common/refresh-icon.svg";
import './customizableDashboard.scss'

export let initialDashboard = null;

const AddWidgetsTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: "0px 0px 29px 0px rgba(53, 53, 53, 0.07)",
    fontSize: 12,
    minWidth: 225,
    zIndex: 500,
    pointerEvents: 'auto',
    padding: 0,
    maxWidth: 1000,
    borderRadius: 17,
    marginTop: 18
  },
  popper: {
    zIndex: 500
  }
}))(Tooltip);

const CustomizableDashboard = () => {
  const dispatch = useDispatch();
  const buildingId = 534;
  const dashboardId = 202;

  const dashboardEditMode = useSelector((store) => store.customizableDashboard.isEditMode);
  const loadingWidgets = useSelector((store) => store.customizableDashboard.pendingForDataWidgets);
  const dashboard = useSelector((store) => store.customizableDashboard.dashboard);
  const prevDashboardId = usePrevious(dashboardId);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const matches = useMediaQuery('(max-width:1200px)');

  useEffect(() => {
    if (typeof dashboardId !== 'undefined' && dashboardId !== prevDashboardId) {
      setDashboardUI();
    }
  }, [dashboardId])

  const setDashboardUI = () => {
    dispatch(showSpinner());
    const response = {
      "id": 202,
      "buildingId": buildingId,
      "name": "Office Temperature",
      "icon": "uil-temperature-half",
      "visibility": "Private",
      "createdAt": "2023-02-20T09:01:33.556Z",
      "updatedAt": "2023-02-20T09:13:02.000Z",
      "widgets": [...DashboardUtils.widgets, {
        "id": 396,
        "type": "headline",
        "coordinates": "[0,0]",
        "size": "[5,2]",
        "data": {
          "value": "Bedroom",
          "image": null
        },
        "settings": {
          "textAlign": "center",
          "size": 1,
          "backgroundColor": "#06432b",
          "color": "#fff9e0"
        },
        "image": null,
        "createdAt": "2023-01-25T13:46:30.833Z",
        "updatedAt": "2023-02-17T15:35:12.000Z",
        "dashboard": {
          "id": 202,
          "buildingId": 534,
          "name": "Home overview",
          "icon": "uil-home",
          "visibility": "Private",
          "createdAt": "2023-01-25T13:45:49.753Z",
          "updatedAt": "2023-02-17T15:35:11.000Z"
        }
      }],
      "report": null
    };

    if (response?.widgets?.length > 0) {
      if (isTooltipOpen) {
        setIsTooltipOpen(false);
      }

      const responses = response.widgets;

      DashboardUtils.widgets = responses.map(widget => {
        return { ...widget, coordinates: JSON.parse(widget.coordinates), size: JSON.parse(widget.size) }
      });
      
      const dashboard = { ...response, widgets: [...DashboardUtils.widgets] };
      initialDashboard = DashboardUtils.copyDashboard(dashboard);

      batch(() => {
        dispatch(setPendingForDataWidgets(DashboardUtils.widgets));
        dispatch(setDashboard(DashboardUtils.copyDashboard(dashboard)));
      })

      if (dashboardEditMode) {
        dispatch(setEditMode(false));
      }

      dispatch(hideSpinner());
      setRefresh(false)

    } else {
      DashboardUtils.widgets = [];
      const dashboard = { ...response, widgets: [...DashboardUtils.widgets] };
      initialDashboard = DashboardUtils.copyDashboard(dashboard);
      setRefresh(false);
      setIsTooltipOpen(true);
      batch(() => {
        dispatch(setDashboard(DashboardUtils.copyDashboard(dashboard)));
        dispatch(setEditMode(true));
        dispatch(hideSpinner());
      })
    }

  }

  const refreshDashboard = () => {
    console.log('refresh dashboard')
    setRefresh(true);
    initialDashboard = null;
    DashboardUtils.widgets = [];
    batch(() => {
      dispatch(setPendingForDataWidgets(null));
      dispatch(setDashboard({ widgets: [] }))
    })

    setTimeout(() => {
      setDashboardUI();
    }, 200)
  }

  const handleSaveDashboard = () => {
    dispatch(showSpinner());
    saveUpdateDashboard();
  }

  const saveUpdateDashboard = () => {
    const dashboardObject = DashboardUtils.copyDashboard(dashboard);
    const imagesForUpload = [];

    prepareWidgetsForSave(dashboardObject, imagesForUpload)

    const widgets = dashboardObject.widgets;

    if (widgets.length > 0) {
      dispatch(setEditMode(false));
    }

    saveWidgets(widgets, dashboard, imagesForUpload)
    dispatch(hideSpinner());
  }

  const prepareWidgetsForSave = (dashboardObjectRef, imagesForUpload) => {
    try {
      delete dashboardObjectRef?.createdAt;
      delete dashboardObjectRef?.updatedAt;

      dashboardObjectRef.widgets.forEach((widget, index) => {
        if (widget.type === 'image') {
          if (dashboard.widgets[index].file) {
            imagesForUpload.push(dashboard.widgets[index].file);
          }
          if (widget.image && widget.image.includes('https://s3')) {
            delete widget.image;
          }
          delete widget.file;
        }
        widget.size = JSON.stringify(widget.size);
        widget.coordinates = JSON.stringify(widget.coordinates);
        // delete widget.component;
        delete widget?.createdAt;
        delete widget?.updatedAt;
        // if (widget.id < 0) {
        //   delete widget.id;
        // }
      });
    } catch (e) {
      throw e;
    }
  }

  const saveWidgets = (widgets, dashboard, imagesForUpload) => {
    console.log(widgets, dashboard)
    let formData = new FormData();
    imagesForUpload.forEach(file => {
      formData.append('files[]', file);
    })
    formData.append('widgets', JSON.stringify(widgets));

    widgets?.forEach(widget => {
      widget.size = JSON.parse(widget.size);
      widget.coordinates = JSON.parse(widget.coordinates);
    })

    const dashboardCopy = DashboardUtils.copyDashboard(dashboard);
    dashboardCopy.widgets = widgets;
    initialDashboard = DashboardUtils.copyDashboard(dashboardCopy);
    dispatch(setDashboard(DashboardUtils.copyDashboard(dashboardCopy)));
    showMessage('Dashboard was successfully saved!', false);

    dispatch(hideSpinner());
  }


  const discardChanges = () => {
    const dashboardCopy = DashboardUtils.copyDashboard(initialDashboard);
    DashboardUtils.widgets = dashboardCopy.widgets;
    dispatch(setDashboard(DashboardUtils.copyDashboard(dashboardCopy)));
  }

  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      let dashboardElement = document.getElementById("dashboard-container");
      // current working methods
      if (dashboardElement.requestFullscreen) {
        dashboardElement.requestFullscreen()
      } else if (dashboardElement.mozRequestFullScreen) {
        dashboardElement.mozRequestFullScreen()
      } else if (dashboardElement.webkitRequestFullscreen) {
        dashboardElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
      }
      setFullscreen(true);
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
      setFullscreen(false);
    }
  }

  const getWidgetsStatus = () => {
    if (Object.keys(loadingWidgets).length === 0) {
      return 'no pending widgets'
    }

    let widgetsLoaded = false;
    let pendingWidgets = Object.values(loadingWidgets).filter(w => w.pending === true);
    if (pendingWidgets.length === 0) widgetsLoaded = true

    if (widgetsLoaded) {
      return 'widgets loaded'
    }

    return 'widgets pending'
  }

  return (
    <div id="dashboard-container" className={`page-content ${fullscreen ? 'fullscreen-padding' : ''}`}>
      <div className="container-fluid">
        {loadingWidgets ? <span hidden={true} id={'widgets-status'}>{getWidgetsStatus()}</span> : null}
        <Row className={'mb-3'}>
          <Col xl={8} lg={12} md={12} className={`d-flex ${matches ? 'mt-3' : 'justify-content-end'}`}>
            {dashboardEditMode ? <>
              <Button
                color=""
                className="cd-gray-btn"
                onClick={discardChanges}>
                Discard Changes
              </Button>
              <div style={{ width: 7 }} />
              <AddWidgetsTooltip
                title={
                  <div className={'add-widgets-tooltip'}>
                    <img src={noWidgets} style={{ height: 40 }} alt="no-widgets" />
                    <p className={'mt-3'}>Click here to add widgets to your Dashboard.</p>
                  </div>
                }
                arrow={true}
                placement="bottom-end"
                open={isTooltipOpen}
                PopperProps={{
                  disablePortal: true
                }}
              >
                <Button
                  color="primary"
                  className="btn btn-primary waves-effect waves-light float-md-end"
                  onClick={() => {
                    unstable_batchedUpdates(() => {
                      dispatch(openCloseWidgetModal(true));
                      setIsTooltipOpen(false);
                    })
                  }}
                >
                  <i className="uil-plus" />&nbsp; Add widget
                </Button>
              </AddWidgetsTooltip>
              <div style={{ width: 7 }} />
              <Button
                color="primary"
                className="btn btn-primary waves-effect waves-light float-md-end"
                onClick={handleSaveDashboard}
              >
                <i className="uil-save" />&nbsp; Save
              </Button>
            </> :
              <div style={{ display: 'flex' }}>
                <Button className={refresh ? 'btn btn-primary waves-effect waves-light' : 'cd-gray-btn'}
                  color={refresh ? 'primary' : ''}
                  onClick={() => refreshDashboard()}
                >
                  <img src={refreshIcon}
                    className={`${refresh ? 'fa-spin' : ''}`}
                    alt="refresh"
                    style={{
                      height: 20,
                      filter: `${refresh ? AppUtils.changeSVGColor('#fff') : AppUtils.changeSVGColor('#495057')}`,
                    }}
                  />
                  &nbsp;{refresh ? 'Updating...' : 'Update'}
                </Button>
                <div style={{ width: 7 }} />
                <Button onClick={toggleFullscreen} color="" className="cd-gray-icon-btn">
                  <i className={'uil-expand-arrows-alt toggle-fullscreen-icon'} />
                </Button>
                <div style={{ width: 7 }} />
                <div style={{ width: 7 }} />
                <Button
                  color="primary"
                  hidden={fullscreen}
                  className="btn btn-primary waves-effect waves-light float-md-end"
                  onClick={() => {
                    dispatch(setEditMode(true))
                  }}
                >
                  <i className="uil-edit" />&nbsp; Edit dashboard
                </Button>

              </div>}
          </Col>
        </Row>
        <Row>
          <div className={'grid-wrapper'} id={'GridWrapper'}>
            <Layout />
            <WidgetsModal />
          </div>
        </Row>
      </div>
    </div>
  );
};

export default CustomizableDashboard