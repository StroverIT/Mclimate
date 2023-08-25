import React, {useEffect, useRef} from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import {Theme as am5themes_Animated} from "@amcharts/amcharts5";
import {CHART_TYPES} from "../../../Tabs/Data/components/DeviceFragment/DeviceFragment";
import {AXIS_ORIENTATION} from "../../../Tabs/Axes/components/ChartAxis/ChartAxis";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import moment from "moment";
import "./mixChart.scss";

const MixChart = ({chartData, showXGrid, chartDivId, dateFormat, timezone}) => {
  const root = useRef(null)
  const chart = useRef(null)
  
  const generateLineSeries = (controllersData, legend, xAxis) => {
    const min = controllersData.domainFrom.auto ? null : parseInt(controllersData.domainFrom.value);
    const max = controllersData.domainTo.auto ? null : parseInt(controllersData.domainTo.value);
    const yAxis = chart.current.yAxes.push(
      am5xy.ValueAxis.new(root.current, {
        maxDeviation: 0.1,
        marginRight: 5,
        numberFormat: `#  ${controllersData.unit}`,
        min,
        max,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root.current, {pan: "zoom", opposite: controllersData.axisOrientation === AXIS_ORIENTATION.RIGHT})
      })
    );

    yAxis.get("renderer").labels.template.set("fill", '#B3BAC0');
    yAxis.get("renderer").grid.template.set("forceHidden", !showXGrid);

    const series = chart.current.series.push(
      am5xy.LineSeries.new(root.current, {
        xAxis: xAxis,
        yAxis: yAxis,
        name: controllersData.displayField,
        valueYField: "value",
        categoryXField: "created_at",
        fill: controllersData.color,
        stroke: controllersData.color,
        visible: !controllersData.hidden,
        tooltip: am5.Tooltip.new(root.current, {
          pointerOrientation: "horizontal",
          labelText: "[bold]{name}: {valueY}"
        })
      })
    );

    series.strokes.template.setAll({
      strokeWidth: 2
    });

    series.data.setAll(controllersData.data);
    legend.data.push(series);
  }

  const generateAreaSeries = (controllersData, legend, xAxis) => {
    const min = controllersData.domainFrom.auto ? null : parseInt(controllersData.domainFrom.value);
    const max = controllersData.domainTo.auto ? null : parseInt(controllersData.domainTo.value);
    const yAxis = chart.current.yAxes.push(am5xy.ValueAxis.new(root.current, {
      maxDeviation: 1,
      marginRight: 5,
      numberFormat: `#  ${controllersData.unit}`,
      min,
      max,
      strictMinMax: true,
      renderer: am5xy.AxisRendererY.new(root.current, {pan: "zoom", opposite: controllersData.axisOrientation === AXIS_ORIENTATION.RIGHT})
    }));

    yAxis.get("renderer").labels.template.set("fill", '#B3BAC0');
    yAxis.get("renderer").grid.template.set("forceHidden", !showXGrid);

    const series = chart.current.series.push(am5xy.LineSeries.new(root.current, {
      name: controllersData.displayField,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      categoryXField: "created_at",
      stroke: controllersData.color,
      fill: `${controllersData.color}80`, // 80 is for 50% opacity
      visible: !controllersData.hidden,
      tooltip: am5.Tooltip.new(root.current, {
        pointerOrientation: "horizontal",
        labelText: "[bold]{name}: {valueY}"
      })
    }));

    series.strokes.template.set("strokeWidth", 2);
    series.fills.template.setAll({
      visible: true
    });

    series.data.setAll(controllersData.data);
    legend.data.push(series);
  }

  const generateBarSeries = (controllersData, legend, xAxis) => {
    const min = controllersData.domainFrom.auto ? null : parseInt(controllersData.domainFrom.value);
    const max = controllersData.domainTo.auto ? null : parseInt(controllersData.domainTo.value);
    const yAxis = chart.current.yAxes.push(
      am5xy.ValueAxis.new(root.current, {
        maxDeviation: 0.1,
        marginRight: 5,
        numberFormat: `#  ${controllersData.unit}`,
        min,
        max,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root.current, {pan: "zoom", opposite: controllersData.axisOrientation === AXIS_ORIENTATION.RIGHT})
      })
    );

    yAxis.get("renderer").labels.template.set("fill", '#B3BAC0');
    yAxis.get("renderer").grid.template.set("forceHidden", !showXGrid);

    const series = chart.current.series.unshift(
      am5xy.ColumnSeries.new(root.current, {
        xAxis: xAxis,
        yAxis: yAxis,
        name: controllersData.displayField,
        valueYField: "value",
        categoryXField: "created_at",
        fill: controllersData.color,
        stroke: controllersData.color,
        visible: !controllersData.hidden,
        tooltip: am5.Tooltip.new(root.current, {
          pointerOrientation: "horizontal",
          labelText: "[bold]{name}: {valueY}"
        })
      })
    );

    series.data.setAll(controllersData.data);
    legend.data.push(series);
  }

  const generateSeries = (legend, xAxis) => {
    let dataArr = [];
    chartData.forEach(controllersData => {
      dataArr = dataArr.concat(controllersData.data);
      switch (controllersData.chartType) {
        case CHART_TYPES.LINE_CHART:
          generateLineSeries(controllersData, legend, xAxis);
          break;
        case CHART_TYPES.BAR_CHART:
          generateBarSeries(controllersData, legend, xAxis);
          break;
        case CHART_TYPES.AREA_CHART:
          generateAreaSeries(controllersData, legend, xAxis)
          break;
        default:
          break;
      }
    })

    const arrayUniqueByKey = [...new Map(dataArr.map(item =>
      [item['created_at'], item])).values()].sort((field1, field2) => {
        return field1.created_at - field2.created_at;
      });

    xAxis.data.setAll(arrayUniqueByKey);
  }

  const createChart = () => {
    root.current._logo.dispose();

    // Set themes
    root.current.setThemes([
      am5themes_Animated.new(root.current)
    ]);

    // root.current.timezone = am5.Timezone.new(timezone ?? AppUtils.timezone);
    // root.current.utc = false;
    // Create xy-chart.current
    chart.current = root.current.container.children.push(
      am5xy.XYChart.new(root.current, {
        focusable: true,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        layout: root.current.verticalLayout
      })
    );

    let legend = chart.current.children.push(
      am5.Legend.new(root.current, {
        nameField: "categoryX",
        centerX: am5.percent(50),
        x: am5.percent(50),
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root.current, {
      minGridDistance: 25,
    });

    xRenderer.labels.template.setAll({
      rotation: -40,
      centerY: am5.p50,
      centerX: am5.p50,
    });

    const xAxis = chart.current.xAxes.push(
      am5xy.CategoryAxis.new(root.current, {
        categoryField: 'created_at',
        renderer: xRenderer,
      })
    );

    xAxis.get("renderer").labels.template.adapters.add("text", function (text, target) {
      if (target.dataItem && target.dataItem.dataContext) {
        if (dateFormat && dateFormat.value !== '') {
          return moment(target.dataItem.dataContext.created_at).format(dateFormat.value);
        }
        return moment(target.dataItem.dataContext.created_at).format('DD-MMM-YYYY HH:mm');
      }
    });

    // xAxis.get("renderer").labels.template.set("forceHidden", true);
    xAxis.get("renderer").grid.template.set("forceHidden", true);
    xAxis.get("renderer").labels.template.set("fill", '#B3BAC0');

    generateSeries(legend, xAxis);

    const cursor = chart.current.set("cursor", am5xy.XYCursor.new(root.current, {
      xAxis: xAxis
    }));

    // Exporting menu
    let exporting = am5plugins_exporting.Exporting.new(root.current, {
      menu: am5plugins_exporting.ExportingMenu.new(root.current, {}),
      pdfOptions: {
        includeData: true
      }
    });

    cursor.lineY.set("visible", false);
    chart.current.appear(1000, 100);
  }

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
      root.current.dispose();
      root.current = null;
    }
  }, [chartData, showXGrid, timezone, dateFormat])

  return (
      <div className='mix-chart-container-wrapper'>
        {chartData.length == 0 && <p style={{ fontSize: '10px', margin: 0, padding: '0 0 0 20px', width: '100%' }}>&nbsp;No data</p>}
        <div key={chartDivId} id={chartDivId} className='mix-chart-container'/>
      </div>
  )
};

export default MixChart;