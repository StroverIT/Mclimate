import React, { useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from "react-redux";
import GridLayout from "react-grid-layout";
import DashboardUtils from "../../DashboardUtils";
import {
  openCloseEditWidgetModal,
  setDashboard,
  setEditMode,
  setEditWidget
} from "../../../../store/customizableDashboard/actions";
import { showMessage } from "../../../../helpers/ui_helper";
import EditWidgetModal from "../EditWidgetModal/EditWidgetModal";
import { initialDashboard } from "../../CustomizableDashboard";
import duplicateIcon from '../../../../assets/images/common/DuplicateIcon.svg'
import trashIcon from '../../../../assets/images/common/trashIcon.svg'
import editIcon from '../../../../assets/images/common/EditIcon.svg'
import AppUtils from "../../../../common/AppUtils";
import { renderToStaticMarkup } from "react-dom/server";
import { setValues } from "../../../../store/valuePreview/actions";
import { setChartData, setChartWidgetEditMode, setChartWidgetValues } from "../../../../store/chartWidget/actions";
import {
  controllersChartData,
  getDataForSelectedDevices,
  updateChartData
} from "../EditWidgetModal/components/ChartEdit/helpers";
import { setControllerProviderData } from "../../../../helpers/backend_helper";
import { setBooleanWidgetValues } from "../../../../store/booleanWidget/actions";
import { getControllerData, processData, getFixedPercentage } from "../EditWidgetModal/components/ValueEdit/components/helpers/apiHelper";
import { TIMEFRAME_TYPES } from "../EditWidgetModal/components/ValueEdit/components/Tabs/Timeframe/Timeframe";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import './layout.scss'
import { hideSpinner, showSpinner } from "../../../../store/spinner/actions";
import { setIframeWidgetValues } from '../../../../store/iframeWidget/actions';

let newWidgetId = -1;

const Layout = () => {
  const dispatch = useDispatch();
  const dashboardEditMode = useSelector((store) => store.customizableDashboard.isEditMode);
  const dashboard = useSelector((store) => store.customizableDashboard.dashboard);
  const [layout, setLayout] = useState([]);
  const [layoutWidth, setLayoutWidth] = useState(-1);
  const [gridItem, setGridItem] = useState(
    <svg viewBox="0, 0 142.5, 48" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#E8EAF0" rx="17" width="142.5" height="48" />
    </svg>
  );

  const defaultProps = {
    className: "layout",
    rowHeight: 48,
    onLayoutChange: () => { },
    cols: 12,
  };

  useEffect(() => {
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize);
    if (dashboard) {
      setLayout(generateLayout());
    }
  }, [dashboard, dashboardEditMode])

  const onResize = () => {
    try {
      const layoutWrapper = document.getElementById('GridWrapper');
      if (layoutWrapper) {
        setLayoutWidth(layoutWrapper.offsetWidth);
        const svgString = encodeURIComponent(renderToStaticMarkup(getGridItemSvg(layoutWrapper)));
        setGridItem(svgString);
      }
    } catch (error) {
      console.log(error);
      showMessage('Something went wrong while rendering React Grid Layout.', true);
    }
  }

  const getGridItemSvg = (layoutWrapper) => {
    const width = (layoutWrapper.offsetWidth / 12) - 20;
    return <svg viewBox={`"0, 0 ${width}, 48"`} xmlns="http://www.w3.org/2000/svg">
      <rect fill="#E8EAF0" rx="17" width={width} height="48" />
    </svg>
  }

  const onDragStop = (elements) => {
    if (dashboardEditMode) {
      updateWidget(elements);
    }
  }

  const onResizeStop = (elements) => {
    if (dashboardEditMode) {
      updateWidget(elements);
    }
  }

  const updateWidget = (elements) => {
    try {
      const widgets = elements.map(element => {
        const foundWidget = DashboardUtils.findWidgetById(parseInt(element.i));
        if (foundWidget) {
          return {
            ...foundWidget,
            coordinates: [element.x, element.y],
            size: [element.w, element.h]
          }
        } else {
          throw new Error("Widget not found");
        }
      });
      dispatch(setDashboard({ ...dashboard, widgets: widgets }));
    } catch(e) {
      showMessage("Problem occurred while interacting with widget", true);
      dispatch(setDashboard(DashboardUtils.copyDashboard(initialDashboard)));
      dispatch(setEditMode(false));
    }
  }

  const onLayoutChange = (layout) => {
    console.log('on layout change')
    defaultProps.onLayoutChange(layout);
  }

  const handleWidgetClick = (widget) => {
    if (!dashboardEditMode && widget.type === 'image' && widget.config.data?.addLink === true) {
      widget.config.data?.openInNewTab === true ?
        window.open(DashboardUtils.appendUrlProtocol(widget.config.data?.url), '_blank') :
        window.location.href = DashboardUtils.appendUrlProtocol(widget.config.data?.url)
    }
  }

  const getWidgetBackgroundColor = (widget) => {
    if (widget.config?.settings.settings?.backgroundColor) {
      return widget.config?.settings.settings?.backgroundColor
    }
    if (widget.config?.settings?.backgroundColor) {
      return widget.config?.settings?.backgroundColor
    }
    return '#F5F6F8'
  }

  const getMinDimensionsForWidget = (widget) => {
    // console.log("widget", widget, widget.type);
    switch (widget.type) {
      case 'value':
        return {
          w: 2,
          h: 4
        }
      case 'chart':
        return {
          w: 3,
          h: 6
        }
      default:
        return {
          w: 2,
          h: 2
        }
    }
  }

  const generateDOM = () => {
    return layout.length > 0 ? layout.map(widget => {
      const minMaxDimensions = getMinDimensionsForWidget(widget);
      return <div
        onClick={() => handleWidgetClick(widget)}
        key={widget.i}
        id={widget.i}
        className={widget.type === 'image' ? 'image-widget-wrapper' : dashboardEditMode ? 'widget-wrapper-edit' : 'widget-wrapper'}
        style={{
          backgroundColor: getWidgetBackgroundColor(widget),
          cursor: !dashboardEditMode && widget.type === 'image' && widget.config.data?.addLink === true ? "pointer" : "default",
        }}
        data-grid={{
          x: parseInt(widget.x),
          y: parseInt(widget.y),
          w: parseInt(widget.w),
          h: parseInt(widget.h),
          minH: minMaxDimensions.h,
          minW: minMaxDimensions.w,
          isResizable: widget.isResizable
        }}
      >
        <div className={'widget-tools'} hidden={!dashboardEditMode}>
          <button onClick={() => openEditWidgetModal(widget)} className={'widget-tool-button'}>
            <img src={editIcon} alt={''} className={'widget-tool'}
              style={{ cursor: 'pointer', width: 13, marginBottom: 3, filter: AppUtils.changeSVGColor('#636363') }}
              title={'Edit Widget'} />
          </button>

          <span style={{ color: '#BBBBBC' }}>|</span>

          <button className={'widget-tool-button'} onClick={() => duplicateWidget(widget.i)}>
            <img src={duplicateIcon} alt={''} className={'widget-tool'}
              style={{ cursor: 'pointer', width: 14, marginBottom: 3, filter: AppUtils.changeSVGColor('#636363') }}
              title={'Duplicate Widget'} />
          </button>

          <span style={{ color: '#BBBBBC' }}>|</span>

          <button onClick={() => removeWidget(widget.i)} className={'widget-tool-button'}>
            <img src={trashIcon} alt={''} className={'widget-tool'}
              style={{ cursor: 'pointer', width: 13, marginBottom: 5, filter: AppUtils.changeSVGColor('#636363') }}
              title={'Delete Widget'} />
          </button>
        </div>
        <div className={'widget-container'} style={{ cursor: dashboardEditMode ? 'grab' : '' }}>
          {renderWidgetComponent(widget)}
        </div>
      </div>
    }) : []
  }

  const renderWidgetComponent = (widget) => {
    try {
      return React.cloneElement(widget.component, { config: { ...widget.config, id: widget.id } })
    } catch (е) {
      console.log(е);
      showMessage(`Something went wrong while rendering dashboard widgets`, true);
    }
  }

  const openEditWidgetModal = (widget) => {
    let widgetData = widget;
    console.log(widget.type);
    if (widget.type === "value") {
      editValueWidget(widget);
    }
    if (widget.type === "chart") {
      dispatch(setChartWidgetEditMode(true))
      editChartWidget(widget);
    }
    if (widget.type === "boolean") {
      editBooleanWidget(widget);
    }
    if(widget.type === "iframe"){
      editIframeWidget(widget);

    }
    batch(() => {
      dispatch(setEditWidget(widgetData));
      dispatch(openCloseEditWidgetModal(true));
    })
  }

  const generateLayout = () => {
    return dashboard.widgets.map(widget => {
      if (widget.type === 'image') {
        if (widget.image) {
          widget.data['image'] = widget.image;
        }
      }
      return {
        x: parseInt(widget.coordinates[0]), // X-coordinate of element
        y: parseInt(widget.coordinates[1]), // Y-coordinate of element
        w: parseInt(widget.size[0]), // Fixed element width
        h: parseInt(widget.size[1]), // Fixed element height
        i: widget.id, // Element key
        isResizable: dashboardEditMode,
        component: widget.component,
        config: {
          data: widget.data,
          settings: widget.settings
        },
        type: widget.type
      };
    })
  }

  const editValueWidget = (widget) => {
    dispatch(showSpinner());
    const widgetData = {
      type: widget.type,
      i: widget.i,
      h: parseInt(widget.h),
      w: parseInt(widget.w),
      x: parseInt(widget.x),
      y: parseInt(widget.y),
      component: widget.component,
      isResizable: widget.isResizable,
      ...widget.config.data,
      config: { ...widget.config.settings }
    }

    if (widgetData.selectedDevice && widgetData.field) {
      getControllerData(widgetData)
        .then(response => {
          if (response && response.timeframeOperationType === TIMEFRAME_TYPES.CURRENT_VALUE) {

            if (widgetData.field == 'motorPosition') {
              const data = getFixedPercentage([response.data.provider.motorRange, response.data.provider.motorPosition])
              widgetData.value = data;
            } else {
              widgetData.value = response.data.provider[widgetData.field];
            }

          } else if (response && response.timeframeOperationType === TIMEFRAME_TYPES.TIMERANGE_OPERATIONS) {
            widgetData.value = processData(response.data, widgetData.operation, widgetData.field);
          }
          batch(() => {
            dispatch(setValues(widgetData));
            dispatch(hideSpinner());
          })
        })
        .catch(() => {
          showMessage("Something went wrong while loading value widget data", true);
          batch(() => {
            dispatch(setEditWidget(null));
            dispatch(openCloseEditWidgetModal(false));
            dispatch(hideSpinner());
          })
        })
    } else {
      dispatch(setValues(widgetData));
    }
  }

  const editBooleanWidget = (widget) => {
    const widgetData = {
      type: widget.type,
      i: widget.i,
      h: parseInt(widget.h),
      w: parseInt(widget.w),
      x: parseInt(widget.x),
      y: parseInt(widget.y),
      component: widget.component,
      isResizable: widget.isResizable,
      ...widget.config.data,
      config: { ...widget.config.settings }
    }

    if (widgetData.selectedDevice?.selectedField) {
      setControllerProviderData({ serial_number: widgetData.selectedDevice.serialNumber })
        .then(response => {
          widgetData.widgetValue = response.provider[widgetData.selectedDevice.selectedField.value];
          widgetData.displayOnText = `${widgetData.selectedDevice.selectedField.label}: True`;
          widgetData.displayOffText = `${widgetData.selectedDevice.selectedField.label}: False`;
          dispatch(setBooleanWidgetValues(widgetData));
        })
        .catch(() => {
          showMessage("Something went wrong while loading boolean widget data", true);
          batch(() => {
            dispatch(setEditWidget(null));
            dispatch(openCloseEditWidgetModal(false));
          })
        })
    } else {
      dispatch(setBooleanWidgetValues(widgetData));
    }
  }
 
  const editChartWidget = (widget) => {
    dispatch(showSpinner());
    const widgetData = {
      type: widget.type,
      i: widget.i,
      h: parseInt(widget.h),
      w: parseInt(widget.w),
      x: parseInt(widget.x),
      y: parseInt(widget.y),
      component: widget.component,
      isResizable: widget.isResizable,
      ...widget.config.data,
      config: { ...widget.config.settings }
    }
    getDataForSelectedDevices(widgetData)
      .then((responses) => {
        widgetData.selectedDevices.forEach(device => {
          if (device.selectedField) {
            const deviceResponse = responses.find(data => data._links.self.href.includes(device.serialNumber));
            if (deviceResponse) {
              updateChartData(widgetData, device, deviceResponse);
            }
          }
        })
        batch(() => {
          dispatch(setChartWidgetValues(widgetData));
          dispatch(setChartData([...controllersChartData]));
          dispatch(hideSpinner());
        })
      })
      .catch((e) => {
        console.log(e);
        showMessage("Something went wrong while loading chart widget data", true);
        batch(() => {
          dispatch(setEditWidget(null));
          dispatch(openCloseEditWidgetModal(false));
          dispatch(setChartWidgetEditMode(false));
          dispatch(hideSpinner());
        })
      })
  }
  const editIframeWidget = (widget) => {
    const widgetData = {
      type: widget.type,
      i: widget.i,
      h: parseInt(widget.h),
      w: parseInt(widget.w),
      x: parseInt(widget.x),
      y: parseInt(widget.y),
      component: widget.component,
      isResizable: widget.isResizable,
      ...widget.config.data,
      config: { ...widget.config.settings }
    }
    dispatch(setIframeWidgetValues(widgetData));

   
  }
  const removeWidget = (id) => {
    const dashboardCopy = DashboardUtils.copyDashboard(dashboard);
    const index = dashboardCopy.widgets.findIndex(widget => widget.id === id);
    if (index !== -1) {
      dashboardCopy.widgets.splice(index, 1);
      DashboardUtils.widgets.splice(index, 1);
      dispatch(setDashboard(dashboardCopy));
    }
  }

  const duplicateWidget = (id) => {
    const dashboardCopy = DashboardUtils.copyDashboard(dashboard);
    const widget = dashboard.widgets.find(widget => widget.id === id);
    if (widget) {
      dashboardCopy.widgets.push({ ...widget, id: newWidgetId-- })
      DashboardUtils.widgets = dashboardCopy.widgets;
      dispatch(setDashboard(dashboardCopy));
    }
  }

  const getBackgroundSize = () => {
    const width = (layoutWidth / 12) - 2;
    return `${width}px 58px`
  }

  return (
    layoutWidth === -1 ? null :
      <>
        <GridLayout
          layout={layout}
          onLayoutChange={onLayoutChange}
          isResizable={dashboardEditMode}
          isBounded={false}
          isDraggable={dashboardEditMode}
          width={layoutWidth - 41}
          style={{
            width: layoutWidth - 41,
            minHeight: '100%',
            backgroundSize: dashboardEditMode ? `${getBackgroundSize()}` : '',
            backgroundImage: `url(${dashboardEditMode ? `"data:image/svg+xml,${gridItem}"` : ''}) `,
            backgroundAttachment: 'local'
          }}
          // compactType={'horizontal'}
          onDragStop={onDragStop}
          onResizeStop={onResizeStop}
          resizeHandles={["se"]}
          verticalCompact={false}
          containerPadding={[0, 0]}
          margin={[10, 10]}
          transformScale={1}
          useCSSTransforms={true}
          autoSize={true}
          resizeHandle={(handleAxis, ref) =>
            <i ref={ref}
              className={`resize-icon uil-arrows-maximize react-resizable-handle react-resizable-handle-${handleAxis}`} />
          }
          {...defaultProps}
        >
          {generateDOM()}
        </GridLayout>
        <EditWidgetModal />
      </>
  );
};

export default Layout;