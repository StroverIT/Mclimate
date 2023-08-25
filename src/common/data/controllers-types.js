const controllerTypes = [
  {
    type: 'vicki_lorawan',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},
      { name: 'Device name', key: 'name' },
      { name: 'Target t°', key: 'displayDigits', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Measured t°', key: 'temperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Humidity', key: 'humidity', suffix: '%', isNumber: true },
      { name: 'Valve opening', key: 'motorPosition', suffix: '%', isNumber: true },
      { name: 'Bat. voltage', key: 'batteryVoltage', suffix: 'V', isNumber: true },
      { name: 'Open Window', key: 'openWindow' },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Child lock', key: 'childLock', dontShowInGraphs: true, isBool: true, dontShowInTable: true },
      // { name: 'Broken sensor', key: 'brokenSensor', dontShowInGraphs: true, isBool: true, dontShowInTable: true },
      { name: 'High motor consumption', key: 'highMotorConsumption', dontShowInGraphs: true, isBool: true, dontShowInTable: true, dontShowAsAdditionalInfo: true },
      { name: 'Low motor consumption', key: 'lowMotorConsumption', dontShowInGraphs: true, isBool: true, dontShowInTable: true, dontShowAsAdditionalInfo: true }
    ],
    title: "Vicki LoRaWAN Devices",
    controls: {
      keepalive_time: 'keepalive_time',
      network_join_retry_period: 'join_retry_period',
      uplink_type: 'uplink_type'
    },
    commands: {
      child_lock: { command: 'child_lock', value_keys: ['enabled'] },
      operation_mode: { command: 'set_operational_mode', value_keys: ['mode'] },
      algorithm: { command: 'set_vicki_mode', value_keys: ['mode'] },
      initiate_recalibration: { command: 'recalibrate_motor', value_keys: [] },
      keepalive_time: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      join_retry_period: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      initiate_force_close: { command: 'force_close_vicki' },
      open_window_params: { command: 'set_open_window', value_keys: ['enabled', 'close_time', 'motor_position', 'delta'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      internal_algo_params: { command: 'set_offline_algo_params', value_keys: ['period', 'p_first_last', 'p_next'], type: 'int' },
      activate_led: { command: 'set_aqi_led', value_keys: ['red_behavior', 'red_duration', 'green_behavior', 'green_duration', 'blue_behavior', 'blue_duration'] },
      activate_buzzer: { command: 'set_buzzer', value_keys: ['volume', 'frequency', 'active_time', 'on_time', 'off_time'] },
      tdiff_params: { command: 'set_offline_algo_tdiff_params', value_keys: ['warm', 'cold'] },
      request_update: { command: 'get_device_version', value_keys: [] },
      target_temperature: { command: 'set_motor_position', value_keys: ['position'] },
      uplink_type: { command: 'set_uplink_type', value_keys: ['type'] },
      set_external_sensor: { command: 'set_ext_sensor', value_keys: ['ext_sensor'] },
      remove_external_sensor: { command: 'remvove_ext_sensor', value_keys: ['ext_sensor'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 'ht_sensor',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'Measured t°', key: 'sensorTemperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Humidity', key: 'relativeHumidity', suffix: '%', isNumber: true },
      { name: 'Bat. voltage', key: 'batteryVoltage', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true , dontShowAsAdditionalInfo: true},
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true }
    ],
    title: "HT LoRaWAN Sensors",
    controls: {
      keepalive_time: 'keepAliveTime',
      network_join_retry_period: 'joinRetryPeriod',
      uplink_type: 'uplinkType'
    },
    commands: {
      child_lock: { command: 'child_lock', value_keys: ['enabled'] },
      operation_mode: { command: 'set_operational_mode', value_keys: ['mode'] },
      initiate_recalibration: { command: 'recalibrate_motor', value_keys: [] },
      keepAliveTime: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      joinRetryPeriod: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      initiate_force_close: { command: 'force_close_vicki' },
      open_window_params: { command: 'set_open_window', value_keys: ['enabled', 'close_time', 'motor_position', 'delta'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      internal_algo_params: { command: 'set_offline_algo_params', value_keys: ['period', 'p_first_last', 'p_next'], type: 'int' },
      activate_led: { command: 'set_aqi_led', value_keys: ['red_behavior', 'red_duration', 'green_behavior', 'green_duration', 'blue_behavior', 'blue_duration'] },
      activate_buzzer: { command: 'set_buzzer', value_keys: ['volume', 'frequency', 'active_time', 'on_time', 'off_time'] },
      tdiff_params: { command: 'set_offline_algo_tdiff_params', value_keys: ['warm', 'cold'] },
      request_update: { command: 'get_device_version', value_keys: [] },
      uplinkType: { command: 'set_uplink_type', value_keys: ['type'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 'aqi_sensor',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'AQI', key: 'AQI', isNumber: true },
      { name: 'Accuracy', key: 'accuracy_aqi', suffix: '%', isNumber: true },
      // {name: 'CO2eq', key: 'CO2eq'},
      { name: 'VOC', key: 'VOC', suffix: 'ppm', isNumber: true },
      { name: 'Measured t°', key: 'temperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Humidity', key: 'relative_humidity', suffix: '%', isNumber: true },
      { name: 'Barometric Pressure', key: 'pressure', suffix: 'hPa', isNumber: true },
      { name: 'Voltage', key: 'voltage', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true }
    ],
    title: "AQI Sensor LoRaWAN",
    controls: {
      keepalive_time: 'keepAliveTime',
      network_join_retry_period: 'joinRetryPeriod',
      uplink_type: 'uplinkType'
    },
    commands: {
      child_lock: { command: 'child_lock', value_keys: ['enabled'] },
      operation_mode: { command: 'set_operational_mode', value_keys: ['mode'] },
      initiate_recalibration: { command: 'recalibrate_motor', value_keys: [] },
      keepAliveTime: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      joinRetryPeriod: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      initiate_force_close: { command: 'force_close_vicki' },
      open_window_params: { command: 'set_open_window', value_keys: ['enabled', 'close_time', 'motor_position', 'delta'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      internal_algo_params: { command: 'set_offline_algo_params', value_keys: ['period', 'p_first_last', 'p_next'], type: 'int' },
      activate_led: { command: 'set_aqi_led', value_keys: ['red_behavior', 'red_duration', 'green_behavior', 'green_duration', 'blue_behavior', 'blue_duration'] },
      activate_buzzer: { command: 'set_buzzer', value_keys: ['volume', 'frequency', 'active_time', 'on_time', 'off_time'] },
      tdiff_params: { command: 'set_offline_algo_tdiff_params', value_keys: ['warm', 'cold'] },
      request_update: { command: 'get_device_version', value_keys: [] },
      uplinkType: { command: 'set_uplink_type', value_keys: ['type'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 't_flood',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'Flood', key: 'flood', isBool: true },
      { name: 'Temperature', key: 'temperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Battery', key: 'battery', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Box tamper', key: 'boxTamper', isBool: true, dontShowInGraphs: true, dontShowInTable: true, dontShowAsAdditionalInfo: true }
    ],
    title: "Flood Sensor LoRaWAN",
    controls: {
      // keepalive_time: 'keepAliveTime',
      // network_join_retry_period: 'joinRetryPeriod'
    },
    commands: {
      child_lock: { command: 'child_lock', value_keys: ['enabled'] },
      operation_mode: { command: 'set_operational_mode', value_keys: ['mode'] },
      initiate_recalibration: { command: 'recalibrate_motor', value_keys: [] },
      keepAliveTime: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      joinRetryPeriod: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      initiate_force_close: { command: 'force_close_vicki' },
      open_window_params: { command: 'set_open_window', value_keys: ['enabled', 'close_time', 'motor_position', 'delta'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      internal_algo_params: { command: 'set_offline_algo_params', value_keys: ['period', 'p_first_last', 'p_next'], type: 'int' },
      activate_led: { command: 'set_aqi_led', value_keys: ['red_behavior', 'red_duration', 'green_behavior', 'green_duration', 'blue_behavior', 'blue_duration'] },
      activate_buzzer: { command: 'set_buzzer', value_keys: ['volume', 'frequency', 'active_time', 'on_time', 'off_time'] },
      tdiff_params: { command: 'set_offline_algo_tdiff_params', value_keys: ['warm', 'cold'] },
      request_update: { command: 'get_device_version', value_keys: [] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 't_valve',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'Measured t°', key: 'ambientTemp', suffix: '℃', isNumber: true },
      { name: 'Battery', key: 'battery', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true },
      { name: 'Box tamper', key: 'boxTamper', isBool: true, dontShowInGraphs: true, dontShowInTable: true },
      { name: 'Alarm validated', key: 'alarmValidated', isBool: true, dontShowInGraphs: true, dontShowInTable: true },
      { name: 'Flood Detection Wire State', key: 'floodDetectionWireState', isBool: true, dontShowInGraphs: true, dontShowInTable: true, dontShowAsAdditionalInfo: true },
      { name: 'Flood', key: 'flood', isBool: true, dontShowInGraphs: true, dontShowInTable: true, dontShowAsAdditionalInfo: true },
      { name: 'Manual Close Indicator', key: 'manualCloseIndicator', isBool: true, dontShowInGraphs: true, dontShowInTable: true, dontShowAsAdditionalInfo: true },
      { name: 'Manual Open Indicator', key: 'manualOpenIndicator', isBool: true, dontShowInGraphs: true, dontShowInTable: true, dontShowAsAdditionalInfo: true },
      { name: 'Valve State', key: 'valveState', isBool: true, dontShowInGraphs: true, dontShowInTable: true }
    ],
    title: "T-Valve LoRaWAN",
    controls: {
      // openTime: 'open_close_time',
      // closeTime: 'open_close_time',

      // network_join_retry_period: 'joinRetryPeriod'
    },
    commands: {
      child_lock: { command: 'child_lock', value_keys: ['enabled'] },
      operation_mode: { command: 'set_operational_mode', value_keys: ['mode'] },
      initiate_recalibration: { command: 'recalibrate_motor', value_keys: [] },
      keepAliveTime: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      joinRetryPeriod: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      initiate_force_close: { command: 'force_close_vicki' },
      open_window_params: { command: 'set_open_window', value_keys: ['enabled', 'close_time', 'motor_position', 'delta'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      internal_algo_params: { command: 'set_offline_algo_params', value_keys: ['period', 'p_first_last', 'p_next'], type: 'int' },
      activate_led: { command: 'set_aqi_led', value_keys: ['red_behavior', 'red_duration', 'green_behavior', 'green_duration', 'blue_behavior', 'blue_duration'] },
      activate_buzzer: { command: 'set_buzzer', value_keys: ['volume', 'frequency', 'active_time', 'on_time', 'off_time'] },
      tdiff_params: { command: 'set_offline_algo_tdiff_params', value_keys: ['warm', 'cold'] },
      request_update: { command: 'get_device_version', value_keys: [] },
      open_close_time: { command: 'set_open_close_time', value_keys: ['opening_time', 'closing_time'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 'co2_sensor',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'CO2', key: 'CO2', suffix: 'ppm', isNumber: true },
      { name: 'Measured t°', key: 'temperature', suffix: '℃', isNumber: true },
      { name: 'Humidity', key: 'humidity', suffix: '%', isNumber: true },
      { name: 'Voltage', key: 'voltage', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true }
    ],
    title: "C02 LoRaWAN",
    controls: {
      keepalive_time: 'keepAliveTime',
      network_join_retry_period: 'joinRetryPeriod'
    },
    commands: {
      keepAliveTime: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      // request_update: {command: 'get_device_version', value_keys: []}
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 'thermostat',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'Measured t°', key: 'temperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Target t°', key: 'target_temperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Bat. percentage', key: 'battery_status', suffix: '%', isNumber: true },
      { name: 'Relay status', key: 'relay_status', dontShowInGraphs: true, isBool: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true }
    ],
    title: "Tring LoTe",
    controls: {
      // keepalive_time: 'keepAliveTime',
      target_temperature: 'target_temperature',
    },
    commands: {
      // keepalive_time: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      thermostat_config: { command: 'set_thermostat_config', value_keys: ['time', 'temp_span', 'temp_sampling', 'target'] },
      thermostat_target: { command: 'set_thermostat_target', value_keys: ['target'], type: 'int' },
      add_vicki_to_thermostat: { command: 'add_vicki_to_thermostat', value_keys: ['vicki'] },
      remove_vicki_from_thermostat: { command: 'remove_vicki_from_thermostat', value_keys: ['vicki'] }
    }
  },
  {
    type: 'dsk_device',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'Target t°', key: 'target_temperature', symbol: '℃', suffix: '℃', isNumber: true, dontShowInGraphs: false},
      { name: 'Measured t°', key: 'sensorTemperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Status', key: 'status', symbol: '', suffix: '', isNumber: true},
      { name: 'Properly connected thermistor', key: 'thermistorProperlyConnected', symbol: '', suffix: '', isBool: true, dontShowInGraphs: true },
      { name: 'Power Supply Voltage', key: 'powerSupplyVoltage', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
    ],
    title: "DSK LoRaWAN Devices",
    controls: {
      keepalive_time: 'keepalive_time',
      network_join_retry_period: 'join_retry_period',
      uplink_type: 'uplink_type'
    },
    commands: {
      set_vrv_status: { command: 'set_vrv_status', value_keys: ['status'] },
      set_vrv_on_time: { command: 'set_vrv_on_time', value_keys: ['time'] },
      set_vrv_off_time: { command: 'set_vrv_off_time', value_keys: ['time'] },
      keepalive_time: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      join_retry_period: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      request_update: { command: 'get_device_version', value_keys: [] },
      uplink_type: { command: 'set_uplink_type', value_keys: ['type'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] },
      set_ext_sensor: { command: 'set_ext_sensor', value_keys: ['ext_sensor'] },
      remove_ext_sensor: { command: 'remove_ext_sensor', value_keys: ['ext_sensor'] },
      set_thermostat_target_temperature: {command: 'set_thermostat_target_temperature', value_keys: ['temp']}
    }
  },
  {
    type: 'mc_button',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},

      { name: 'Device name', key: 'name' },
      { name: 'Battery Voltage', key: 'batteryVoltage', suffix: 'V', isNumber: true },
      { name: 'Press event', key: 'pressEvent', suffix: '', isNumber: false, dontShowInTable: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
    ],
    title: "Button LoRaWAN Devices",
    controls: {
      keepalive_time: 'keepalive_time',
      network_join_retry_period: 'join_retry_period',
      uplink_type: 'uplink_type'
    },
    commands: {
      keepalive_time: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      join_retry_period: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      request_update: { command: 'get_device_version', value_keys: [] },
      uplink_type: { command: 'set_uplink_type', value_keys: ['type'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 'open_close_sensor',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},
      { name: 'Device name', key: 'name' },
      { name: 'Measured t°', key: 'sensorTemperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Status', key: 'status', suffix: '', isNumber: false, isBool: true },
      { name: 'Open/close events count', key: 'counter', suffix: '', isNumber: true, isBool: false,  dontShowInGraphs: true },
      { name: 'Properly connected thermistor', key: 'thermistorProperlyConnected', symbol: '', suffix: '', isBool: true, dontShowInGraphs: true },
      { name: 'Battery Voltage', key: 'batteryVoltage', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Event', key: 'event', suffix: '', isNumber: false, isBool: false, dontShowInTable: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
    ],
    title: "Open/Close LoRaWAN Devices",
    controls: {
      keepalive_time: 'keepAliveTime',
      network_join_retry_period: 'joinRetryPeriod',
      uplink_type: 'uplinkType'
    },
    commands: {
      keepalive_time: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },
      notification_blind_time: { command: 'set_notification_blind_time', value_keys: ['time'], type: 'int' },
      join_retry_period: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      request_update: { command: 'get_device_version', value_keys: [] },
      uplink_type: { command: 'set_uplink_type', value_keys: ['type'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  },
  {
    type: 'wireless_thermostat',
    items: [],
    table: [
      { name: '', key: 'quickLook',  dontShowInGraphs: true},
      { name: 'Device name', key: 'name' },
      { name: 'Target t°', key: 'targetTemperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Measured t°', key: 'sensorTemperature', symbol: '℃', suffix: '℃', isNumber: true },
      { name: 'Humidity', key: 'relativeHumidity', suffix: '%', isNumber: true },
      { name: 'Heating status', key: 'heatingStatus', suffix: '', isNumber: true, dontShowInGraphs: true },
      { name: 'Bat. voltage', key: 'batteryVoltage', suffix: 'V', isNumber: true },
      { name: 'RSSI', key: 'rssi', isNumber: true },
      { name: 'SF', key: 'spf', suffix: 'SF', isNumber: true },
      { name: 'Frame Count', key: 'frameCount', suffix: 'fc', isNumber: true },
      { name: 'Join Requests Count', key: 'joinRequestCount', suffix: '', dontShowInGraphs: true },
      { name: 'Last active', key: 'lastActive', suffix: '', dontShowInGraphs: true },
      { name: 'Online', key: 'online', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Building', key: 'building', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Floor', key: 'floor', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Space', key: 'space', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Room', key: 'room', suffix: '', dontShowInGraphs: true, dontShowAsAdditionalInfo: true },
      { name: 'Child lock', key: 'childLock', dontShowInGraphs: true, isBool: true, dontShowInTable: true }
    ],
    title: "Wireless Thermostat LoRaWAN Devices",
    controls: {
      target_temperature: 'set_wireless_thermostat_target',
      // keepalive_time: 'keepAliveTime',
      keepalive_time: 'keepalive_time',
      network_join_retry_period: 'joinRetryPeriod',
      uplink_type: 'uplinkType',
    },
    commands: {
      target_temperature: {command: 'set_wireless_thermostat_target', value_keys: ['temp']},
      child_lock: { command: 'child_lock', value_keys: ['enabled'] },
      keepalive_time: { command: 'set_keepalive_time', value_keys: ['time'], type: 'int' },

      target_send_delay: {command: 'set_target_send_delay', value_keys: ['time'], type: 'int'}, // in seconds
      heating_status: {command: 'set_heating_status', value_keys: ['status'], type: 'int', dontShowInGraphs: true}, // on - 1, off - 0
      display_refresh_period: {command: 'set_display_refresh_period', value_keys: ['period'], type: 'int'}, // in hours, the default is 10hours. range(1hour – 24hours).
     
      // no info in provider? cannot work with this now
      min_max_range: {command: 'set_range', value_keys: ['min', 'max']}, // 5 - min, 30 - max

      join_retry_period: { command: 'set_join_retry_period', value_keys: ['period'], type: 'int' },
      watch_dog_params: { command: 'set_watch_dog_params', value_keys: ['period_confirmen_uplinks', 'period_unconfirmen_uplinks'], type: 'int' },
      internal_algo_params: { command: 'set_offline_algo_params', value_keys: ['period', 'p_first_last', 'p_next'], type: 'int' },
      request_update: { command: 'get_device_version', value_keys: [] },
      uplink_type: { command: 'set_uplink_type', value_keys: ['type'] },
      send_custom_hex_command: { command: 'send_custom_hex_command', value_keys: ['hex'] }
    }
  }
];

export default controllerTypes;