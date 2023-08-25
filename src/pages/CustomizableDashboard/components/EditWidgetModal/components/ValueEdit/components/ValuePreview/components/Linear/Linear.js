import React, { useEffect, useState } from 'react';
import AppUtils from "../../../../../../../../../../common/AppUtils";
import './linear.scss'

const Linear = ({ widgetValues, isShownOnDashboard }) => {
  const [rangeStyles, _setRangeStyles] = useState({});
  const [minMaxValues, setMinMaxValue] = useState({
    min: 0,
    max: 100
  });

  useEffect(() => {
    let colors = ''
    const settings = widgetValues.config?.chartSettings;

    if (settings.length > 0) {
      if (settings.length === 1) {
        colors = `${AppUtils.hexToRGB(settings[0].color, 1)} 0%, ${AppUtils.hexToRGB(settings[0].color, 1)} 100%`
      } else {
        settings.forEach((value, index) => {
          if (index === settings.length - 1) {
            colors += ` ${AppUtils.hexToRGB(value.color, 1)} 100%`
          } else {
            colors += ` ${AppUtils.hexToRGB(value.color, 1)} ${calculateGradientPercent(parseInt(value.value), parseInt(settings[settings.length - 1].value))}%,`
          }
        })
        setMinMaxValue({
          min: settings[0].value,
          max: settings[settings.length - 1].value
        })
      }
    }

    setRangeStyles(colors);
  }, [widgetValues.config?.chartSettings])

  const calculateGradientPercent = (value, maxValue) => {
    return (value / maxValue) * 100;
  }

  const setRangeStyles = (gradientColors) => {
    if (gradientColors !== '') {
      _setRangeStyles({
        ['--range-gradient']: `linear-gradient(45deg,${gradientColors})`
      })
    }
  }

  const widgetValue = parseFloat(widgetValues.value).toFixed(parseInt(widgetValues.decimals));

  return (
    <div className='widget-preview-wrapper' style={{ backgroundColor: widgetValues.config?.settings?.backgroundColor, borderRadius: 17 }}>
      <div className={'value-widget-header'}>
        <i className={widgetValues.config?.settings?.icon} style={{ fontSize: 16, color: widgetValues.config?.settings?.color, marginRight: 5 }} />
        <p style={{ color: widgetValues.config?.settings?.color }}>{widgetValues.widgetTitle}</p>
      </div>
      <div style={{ minWidth: 200, display: 'flex', alignItems: 'baseline' }}>
        <h1 className={'value-widget-value'} style={{ color: widgetValues.config?.settings?.color }} title={`Decimals: ${widgetValues.decimals}`}>
          {widgetValue}
        </h1>
        <p style={{ margin: 0, padding: 0, color: widgetValues.config?.settings?.color }}>&nbsp;{widgetValues.unit}</p>
      </div>
      {!widgetValues.online && <p style={{fontSize: '10px', margin: 0, padding: '0 0 0 10px'}}>&nbsp;Device is offline</p>}
      <div className={'range-container'} style={{ marginTop: isShownOnDashboard ? 18 : 30 }}>
        <div className={'input-shadow'} style={rangeStyles} />
        <input type="range"
          value={widgetValues.value}
          onChange={() => { }}
          style={rangeStyles}
          step="1"
          min={minMaxValues.min}
          max={minMaxValues.max}
          className={'range-input range'}
        />
        <div className={'input-range-values'}>
          {widgetValues.config.chartSettings.length > 1 ?
            <>
              <p style={{ color: widgetValues.config?.settings?.color }}>{widgetValues.config.chartSettings[0].value}</p>
              <p style={{ color: widgetValues.config?.settings?.color }}>{widgetValues.config.chartSettings[widgetValues.config.chartSettings.length - 1].value}</p>
            </> :
            <>
              <p style={{ color: widgetValues.config?.settings?.color }}>0</p>
              <p style={{ color: widgetValues.config?.settings?.color }}>
                {widgetValues.config.chartSettings.length === 0 ? 0 : widgetValues.config.chartSettings[widgetValues.config.chartSettings.length - 1].value}
              </p>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default Linear;