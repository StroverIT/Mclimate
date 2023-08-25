import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import { Theme as am5themes_Animated } from "@amcharts/amcharts5";
import {unstable_batchedUpdates} from "react-dom";
import {useForceUpdate} from "../../../../../../../../../../Hooks/useForceUpdate";
import {v4 as uuidv4} from "uuid";
import './gauge.scss'

const Gauge = ({ widgetValues, chartDivId, isShownOnDashboard }) => {
  const [gaugeContainerClassName, setGaugeContainerClassName] = useState('');
  const [minMaxValuesPositions, setMinMaxValuesPositions] = useState({minPosition: 0, maxPosition: 0});
  const [minMaxValuesTopPosition, setMinMaxValuesTopPosition] = useState(0);
  const forceUpdate = useForceUpdate();
  const mountedRef = useRef(true);
  let root = useRef(null);
  let chart = useRef(null);
  const wrapperId = uuidv4();

  useEffect(() => {
    if (!root.current) {
      // Create root.current element
      root.current = am5.Root.new(chartDivId);
      createChart();
    } else {
      root.current.container.children.clear();
      createChart();
    }
    return () => {
      mountedRef.current = false;
      root.current?.dispose();
      root.current = null;
    }
  }, [])

  const createChart = () => {
    const container = document.getElementById(wrapperId);
    new ResizeObserver(gaugeResize).observe(container);

    root.current._logo.dispose();

    root.current.setThemes([
      am5themes_Animated.new(root.current)
    ]);

    // Create chart
    chart.current = root.current.container.children.push(
      am5radar.RadarChart.new(root.current, {
        panX: false,
        panY: false,
        startAngle: 180,
        endAngle: 360,
      })
    );

    // Create axis and its renderer
    let axisRenderer = am5radar.AxisRendererCircular.new(root.current, {
      innerRadius: -10,
      strokeOpacity: 1,
      // radius: 80,
      // minGridDistance: 10000,
      strokeWidth: 15,
      strokeGradient: am5.LinearGradient.new(root.current, {
        rotation: 0,
        stops: widgetValues.config?.chartSettings?.length === 1 ?
          [{color: am5.color('#DDDDDD')}, {color: am5.color(widgetValues.config.chartSettings[0].color)}] :
          widgetValues.config?.chartSettings?.map(value => {
            return {color: am5.color(value.color)}
          })
      }),
    });

    const valueAxisSettings = {
      maxDeviation: 0,
      ...getChartMinMaxValues(false),
      // strictMinMax: true,
      renderer: axisRenderer
    }

    let xAxis = chart.current.xAxes.push(
      am5xy.ValueAxis.new(root.current, valueAxisSettings),
    );

    // this will change color
    // axisRenderer.labels.template.setAll({ fill: widgetValues.config?.settings?.color})

    // this will hide them
    axisRenderer.labels.template.setAll({forceHidden: true})

    // Add clock hand
    let axisDataItem = xAxis.makeDataItem({});

    axisDataItem.set("value", widgetValues.value);
    let bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root.current, {
      sprite: am5radar.ClockHand.new(root.current, {
        radius: am5.percent(110),
        innerRadius: am5.percent(90),
        pinRadius: 0,
        topWidth: (container.offsetWidth + container.offsetHeight) / 100 - 1.5,
        bottomWidth: (container.offsetWidth + container.offsetHeight) / 100 - 1.5,
      })
    }));

    bullet.get("sprite").hand.setAll({
      fill: widgetValues.config?.settings?.color,
      fillOpacity: 0.9,
      layer: 100,
    });

    xAxis.createAxisRange(axisDataItem);
    axisDataItem.get("grid").set("visible", false);

    setTimeout(() => {
      chart.current.appear(1000, 100);
      positionMinMaxValues(chart.current);
    }, 500)
  }

  const positionMinMaxValues = (chart) => {
    if (mountedRef.current) {
      const radius = chart.getPrivate('radius');
      const chartWidth = chart.getPrivate('width');
      const chartHeight = chart.getPrivate('height');
      const diameter = radius * 2;
      const minValuePosition = (chartWidth - diameter) / 2 - 7;
      const maxValuePosition = ((chartWidth - diameter) / 2) + diameter - 7 ;
      unstable_batchedUpdates(() => {
        if (!isNaN(minValuePosition) && !isNaN(maxValuePosition)) {
          setMinMaxValuesPositions({minPosition: minValuePosition, maxPosition: maxValuePosition})
          setMinMaxValuesTopPosition(((chartHeight - radius) / 2) + radius + 3)
        } else {
          forceUpdate();
        }
      })
    }
  }

  const gaugeResize = () => {
    if (isShownOnDashboard) {
      const el = document.getElementById(wrapperId);
      if (el?.offsetHeight > 162) {
        setGaugeContainerClassName('block-preview');
      }
      if (el?.offsetWidth < 333 && el?.offsetHeight <= 162) {
        setGaugeContainerClassName('small-gauge');
      }
    }
  }

  const getChartMinMaxValues = (isForRender) => {
    if (widgetValues.config?.chartSettings?.length > 1) {
      return isForRender ? <>
          <p hidden={minMaxValuesTopPosition === 0} style={{
               color: widgetValues.config?.settings?.color,
               left: minMaxValuesPositions.minPosition,
               top: minMaxValuesTopPosition,
               position: 'absolute'
             }}
          >
            {widgetValues.config.chartSettings.length > 1 ? widgetValues.config.chartSettings[0].value : 0}
          </p>
          <p hidden={minMaxValuesTopPosition === 0} style={{
               color: widgetValues.config?.settings?.color,
               left: minMaxValuesPositions.maxPosition,
               top: minMaxValuesTopPosition,
               position: 'absolute'
             }}
          >
            {widgetValues.config.chartSettings.length > 1 ? widgetValues.config.chartSettings[widgetValues.config.chartSettings.length - 1].value : 100}
          </p>
        </>
        : {
          min: parseInt(widgetValues.config.chartSettings.length > 1 ? widgetValues.config.chartSettings[0].value : 0),
          max: parseInt(widgetValues.config.chartSettings.length > 1 ? widgetValues.config.chartSettings[widgetValues.config.chartSettings.length - 1].value : 100)
        }
    } else if (widgetValues.config?.chartSettings?.length === 1) {
      return isForRender ? <>
          <p hidden={minMaxValuesTopPosition === 0} style={{
               color: widgetValues.config?.settings?.color,
               left: minMaxValuesPositions.minPosition,
               top: minMaxValuesTopPosition,
               position: 'absolute'
             }}>0</p>
          <p hidden={minMaxValuesTopPosition === 0} style={{
               color: widgetValues.config?.settings?.color,
               left: minMaxValuesPositions.maxPosition,
               top: minMaxValuesTopPosition,
               position: 'absolute'
             }}
          >
            {widgetValues.config.chartSettings[0].value}
          </p>
        </>
        : {
          min: 0,
          max: parseInt(widgetValues.config.chartSettings[0].value)
        }
    }
    return isForRender ? <>
      <p hidden={minMaxValuesTopPosition === 0} style={{
        color: widgetValues.config?.settings?.color,
        left: minMaxValuesPositions.minPosition,
        top: minMaxValuesTopPosition,
        position: 'absolute'
      }}>0</p>
      <p hidden={minMaxValuesTopPosition === 0} style={{
        color: widgetValues.config?.settings?.color,
        left: minMaxValuesPositions.maxPosition,
        top: minMaxValuesTopPosition,
        position: 'absolute'
      }}>0</p>
    </> : {
      min: 0,
      max: 0
    }
  }

  const calculatePadding = () => {
    const maxValue = parseInt(widgetValues.config.chartSettings.length > 1 ? widgetValues.config.chartSettings[widgetValues.config.chartSettings.length - 1].value : 100)
    if (maxValue > 99999 && maxValue < 100000) {
      return 10
    }
    if (maxValue >= 100000 && maxValue < 1000000) {
      return 20
    }
    if (maxValue >= 1000000 && maxValue <= 9999999) {
      return 25
    }
    if (maxValue > 9999999) {
      return 50
    }
    return 0
  }

  const widgetValue = parseFloat(widgetValues.value).toFixed(parseInt(widgetValues.decimals));
  
  return (
    <div id={wrapperId}
      style={{
        width: '100%', height: '100%',
        borderRadius: 17,
        display: gaugeContainerClassName.includes('block-preview') ? 'block' : 'flex',
        overflow: 'hidden',
        backgroundColor: widgetValues.config?.settings?.backgroundColor
      }}>
      <div style={{ width: '100%' }}>
        <div className={'value-widget-header'}>
          <i className={widgetValues.config?.settings?.icon} style={{ fontSize: 16, color: widgetValues.config?.settings?.color, marginRight: 5 }} />
          <p style={{ color: widgetValues.config?.settings?.color }}>{widgetValues.widgetTitle}</p>
        </div>
        <div style={{ minWidth: 200, display: 'flex', alignItems: 'baseline' }}>
          <h1 className={'value-widget-value'} style={{ color: widgetValues.config?.settings?.color }} title={`Decimals: ${widgetValues.decimals}`}>
            {widgetValue}
          </h1>
          <p style={{margin: 0, padding: 0, color: widgetValues.config?.settings?.color}}>&nbsp;{widgetValues.unit}</p>
        </div>
        {!widgetValues.online && <p style={{fontSize: '10px', margin: 0, padding: '0 0 0 10px'}}>&nbsp;Device is offline</p>}
      </div>
      <div style={{ width: '90%', height: '100%', display: 'block', margin: '0 auto' }}>
        <div style={{
          width: gaugeContainerClassName.includes('block-preview') ? '100%' : gaugeContainerClassName.includes('small-gauge') ? '35%' : '100%',
          // height: gaugeContainerClassName.includes('block-preview') ? '100%' : 'unset',
          height: '100%',
          paddingBottom: gaugeContainerClassName.includes('block-preview') ? 35 : 0,
          display: gaugeContainerClassName.includes('block-preview') ? 'block' : 'flex',
          justifyContent: gaugeContainerClassName.includes('block-preview') ? '' : 'flex-end',
          paddingRight: gaugeContainerClassName.includes('block-preview') ? 0 : calculatePadding()
        }}>
          <div key={chartDivId} id={chartDivId}
            style={{
              width: gaugeContainerClassName.includes('block-preview') ? '100%' : 250,
              height: gaugeContainerClassName.includes('block-preview') ? '70%' : '100%',
              position: 'relative',
            }}>
            {getChartMinMaxValues(true)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gauge;