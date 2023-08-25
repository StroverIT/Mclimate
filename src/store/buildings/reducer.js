import { SET_DASHBOARD } from "../customizableDashboard/actionTypes";
import {
  CLEAR_BUILDINGS,
  GET_BUILDINGS_SUCCESS,
  GET_BUILDING_ASSET_SUCCESS,
  GET_BUILDING_USERS_SUCCESS,
  UPDATE_BUILDING_ASSET_SUCCESS,
  CREATE_BUILDING_ASSET_SUCCESS,
  DELETE_BUILDING_ASSET_SUCCESS,
  ASSIGN_BUILDING_USER_SUCCESS,
  SET_SELECTED_BUILDING_ID,
  START_LOAD_BUILDINGS,
  END_LOAD_BUILDINGS,
  UPDATE_BUILDING_DEVICES_SUCCESS,
} from "./actionTypes"

const INIT_STATE = {
  buildings: [],
  selectedBuildingId: 0,
  selectedAssetId: 0,
  loading: false,
  floorPlans: []
}

const buildings = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SET_DASHBOARD:
      return {
        ...state,
        buildings: [{
          "id": 534,
          "name": "Main Office Building",
          "address": "bul. \"Vitosha\", Sofia, Bulgaria",
          "type": "commercial",
          "asset_type": "offices",
          "latitude": 42.685905,
          "longitude": 23.317925,
          "use_floors": 1,
          "use_spaces": 1,
          "use_rooms": 0,
          "deleted_at": null,
          "floor_plans": 1,
          "onlineDevices": 6,
          "floors": [
            {
              "id": 189471,
              "building_id": 534,
              "name": "Floor 1",
              "deleted_at": null
            },
            {
              "id": 189472,
              "building_id": 534,
              "name": "Floor 2",
              "deleted_at": null
            }
          ],
          "spaces": [
            {
              "id": 1435,
              "name": "Office 2",
              "building_id": 534,
              "floor_id": 189471,
              "deleted_at": null
            },
            {
              "id": 1436,
              "name": "Office 1",
              "building_id": 534,
              "floor_id": 189471,
              "deleted_at": null
            },
            {
              "id": 1437,
              "name": "Office 2",
              "building_id": 534,
              "floor_id": 189472,
              "deleted_at": null
            },
            {
              "id": 1438,
              "name": "Office 1",
              "building_id": 534,
              "floor_id": 189472,
              "deleted_at": null
            },
            {
              "id": 1439,
              "name": "Office 3",
              "building_id": 534,
              "floor_id": 189471,
              "deleted_at": null
            },
            {
              "id": 1440,
              "name": "Office 3",
              "building_id": 534,
              "floor_id": 189472,
              "deleted_at": null
            }
          ],
          "rooms": [
            {
              "id": 2003,
              "name": "Room",
              "building_id": 534,
              "space_id": 1435,
              "deleted_at": null
            },
            {
              "id": 2004,
              "name": "Room",
              "building_id": 534,
              "space_id": 1436,
              "deleted_at": null
            },
            {
              "id": 2005,
              "name": "Room",
              "building_id": 534,
              "space_id": 1437,
              "deleted_at": null
            },
            {
              "id": 2006,
              "name": "Room",
              "building_id": 534,
              "space_id": 1438,
              "deleted_at": null
            },
            {
              "id": 2007,
              "name": "Room",
              "building_id": 534,
              "space_id": 1439,
              "deleted_at": null
            },
            {
              "id": 2008,
              "name": "Room",
              "building_id": 534,
              "space_id": 1440,
              "deleted_at": null
            }
          ],
          "devices": [
            {
              "id": 4271,
              "controller_id": 92466,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:25",
              "deleted_at": null,
              "controller_log": {
                "network_provider": "the_things_industries",
                "application": "mclimate-dev",
                "keepAliveTime": 10,
                "extSensorOn": [],
                "extSensorIs": "",
                "webhook_url": "",
                "rssi": -73,
                "spf": "7",
                "joinRequestCount": 14,
                "frameCount": 5702,
                "deviceVersions": {
                  "hardware": 12,
                  "software": 11
                },
                "lastActive": "2023-02-20 12:37:54",
                "uplinkType": "01",
                "thermistorProperlyConnected": true,
                "pressEvent": "00",
                "batteryVoltage": 3.2,
                "sensorTemperature": 23.1,
                "activeFrom": "2022-08-11 13:46:04",
                "joinRetryPeriod": 10,
                "mac": "70B3D52DD6000063",
                "online": true,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 92466,
                "user_id": 12073,
                "serial_number": "CH3T924666V4C",
                "mac": "70B3D52DD6000063",
                "firmware_version": "1.2",
                "hardware_version": "0.0",
                "name": "Button LoRaWAN - CH3T924666V4C",
                "type": "mc_button",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2022-04-07 11:19:45",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4272,
              "controller_id": 168983,
              "building_id": 568,
              "floor_id": 189471,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:25",
              "deleted_at": null,
              "controller_log": {
                "activeFrom": "2023-02-01 13:54:41",
                "application": "software-dev",
                "batteryVoltage": 3.42,
                "frameCount": 77,
                "lastActive": "2023-02-20 12:36:18",
                "network_provider": "the_things_industries",
                "relativeHumidity": 28.13,
                "rssi": -56,
                "sensorTemperature": 22.8,
                "spf": "7",
                "targetTemperature": 20,
                "thermistorProperlyConnected": false,
                "uplinkType": "00",
                "keepAliveTime": 10,
                "joinRequestCount": 21,
                "childLock": false,
                "deviceVersions": {
                  "hardware": 19,
                  "software": 17
                },
                "displayRefreshPeriod": 12,
                "heatingStatus": 0,
                "joinRetryPeriod": 10,
                "sendTargetTempDelay": 10,
                "watchDogParams": {
                  "wdpC": 17,
                  "wdpUc": 24
                },
                "mac": "70B3D52DD8000005",
                "online": true,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 168983,
                "user_id": 12073,
                "serial_number": "P6XD1689835G9S",
                "mac": "70B3D52DD8000005",
                "firmware_version": "1.0",
                "hardware_version": "2.3",
                "name": "Wireless Thermostat LoRaWAN - P6XD1689835G9S",
                "type": "wireless_thermostat",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2023-01-31 15:16:03",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4273,
              "controller_id": 121237,
              "building_id": 568,
              "floor_id": 189471,
              "space_id": 1436,
              "room_id": null,
              "created_at": "2023-02-20 10:52:26",
              "deleted_at": null,
              "controller_log": {
                "mac": "70B3D52DD3008A10",
                "displayDigits": 0,
                "temperature": 0,
                "humidity": 0,
                "motorRange": 0,
                "motorPosition": 0,
                "batteryVoltage": 0,
                "openWindow": false,
                "childLock": {
                  "min": 5,
                  "max": 30
                },
                "highMotorConsumption": false,
                "lowMotorConsumption": false,
                "rssi": 0,
                "temeprature_range_settings": {
                  "min": 5,
                  "max": 30
                },
                "keepalive_time": 0,
                "open_window_params": {
                  "enabled": false,
                  "duration": 2,
                  "motorPosition": 0,
                  "delta": 1
                },
                "operational_mode": "03",
                "internal_algo_params": {
                  "period": 20,
                  "pFirstLast": 20,
                  "pNext": 20
                },
                "tdiff_params": {
                  "warm": 1,
                  "cold": 1
                },
                "uplink_type": "00",
                "join_retry_period": 5,
                "network_provider": "",
                "spf": "",
                "deviceVersions": {
                  "hardware": 0,
                  "software": 0,
                  "updatingToVersion": false
                },
                "watchDogParams": {
                  "wdpC": 0,
                  "wdpUc": 0
                },
                "frameCount": 0,
                "joinRequestCount": 0,
                "lastActive": "2022-09-28 12:08:56",
                "extSensorOn": [],
                "extSensorIs": "",
                "thermostatIs": "",
                "application": "",
                "proportionalAlgorithmParameters": {
                  "coefficient": 0,
                  "period": 0
                },
                "temperatureControlAlgorithm": "",
                "activeFrom": null,
                "online": false,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 121237,
                "user_id": 12073,
                "serial_number": "LAFU1212371JT7",
                "mac": "70B3D52DD3008A10",
                "firmware_version": "4.0",
                "hardware_version": "2.6.1",
                "name": "Vicki LoRaWAN - LAFU1212371JT7",
                "type": "vicki_lorawan",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2022-09-28 12:08:56",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4274,
              "controller_id": 86975,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:26",
              "deleted_at": null,
              "controller_log": {
                "mac": "70B3D52DD3004290",
                "displayDigits": 16,
                "temperature": 20.764730899683,
                "humidity": 30.46875,
                "motorRange": 0,
                "motorPosition": 0,
                "batteryVoltage": 3.5,
                "openWindow": false,
                "childLock": false,
                "highMotorConsumption": false,
                "lowMotorConsumption": false,
                "rssi": -66,
                "temeprature_range_settings": {
                  "min": 5,
                  "max": 30
                },
                "keepalive_time": 5,
                "open_window_params": {
                  "enabled": false,
                  "duration": 2,
                  "motorPosition": 0,
                  "delta": 1
                },
                "operational_mode": "01",
                "internal_algo_params": {
                  "period": 10,
                  "pFirstLast": 20,
                  "pNext": 20
                },
                "tdiff_params": {
                  "warm": 1,
                  "cold": 1
                },
                "uplink_type": "00",
                "join_retry_period": 3,
                "network_provider": "thingpark",
                "spf": "7",
                "deviceVersions": {
                  "hardware": 26,
                  "software": 68
                },
                "watchDogParams": {
                  "wdpC": 17,
                  "wdpUc": 24
                },
                "frameCount": 6415,
                "joinRequestCount": 3,
                "lastActive": "2022-04-18 09:44:33",
                "extSensorOn": [],
                "extSensorIs": "",
                "thermostatIs": "58208AFFFE400A5D",
                "application": null,
                "proportionalAlgorithmParameters": [],
                "temperatureControlAlgorithm": null,
                "activeFrom": "2022-02-28 14:22:56",
                "online": false,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 86975,
                "user_id": 12073,
                "serial_number": "W76J86975NTAG",
                "mac": "70B3D52DD3004290",
                "firmware_version": "3.6",
                "hardware_version": "0.0",
                "name": "Vicki LoRaWAN - W76J86975NTAG",
                "type": "vicki_lorawan",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2022-02-28 13:59:48",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4275,
              "controller_id": 41086,
              "building_id": 568,
              "floor_id": 189471,
              "space_id": 1436,
              "room_id": null,
              "created_at": "2023-02-20 10:52:26",
              "deleted_at": null,
              "controller_log": {
                "network_provider": "the_things_industries",
                "extSensorOn": [],
                "extSensorIs": "",
                "rssi": -73,
                "spf": "8",
                "CO2": 2952,
                "temperature": 24.3,
                "humidity": 37.5,
                "voltage": 3.5,
                "uplinkType": "00",
                "keepAliveTime": 10,
                "joinRetryPeriod": 3,
                "deviceVersions": {
                  "hardware": 15,
                  "software": 12
                },
                "watchDogParams": {
                  "wdpC": 17,
                  "wdpUc": 24
                },
                "lastActive": "2023-01-11 14:17:24",
                "buzzerNotification": {
                  "duration_good_beeping": 0,
                  "duration_good_loud": 500,
                  "duration_good_silent": 500,
                  "duration_medium_beeping": 0,
                  "duration_medium_loud": 500,
                  "duration_medium_silent": 500,
                  "duration_bad_beeping": 0,
                  "duration_bad_loud": 500,
                  "duration_bad_silent": 500
                },
                "frameCount": 3,
                "application": "mclimate-co2",
                "activeFrom": "2021-07-20 12:51:36",
                "autoZeroPeriod": 192,
                "autoZeroValue": 1242,
                "boundaryLevels": {
                  "good_medium": 900,
                  "medium_bad": 1500
                },
                "measurementPeriod": {
                  "good_zone": 10,
                  "medium_zone": 10,
                  "bad_zone": 10
                },
                "notifyPeriod": {
                  "good_zone": 0,
                  "medium_zone": 1,
                  "bad_zone": 2
                },
                "mac": "70B3D52DD500003A",
                "online": false,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 41086,
                "user_id": 12073,
                "serial_number": "S4KZ410868XSM",
                "mac": "70B3D52DD500003A",
                "firmware_version": "1.10",
                "hardware_version": "0.0",
                "name": "Co2_sensor - S4KZ410868XSM",
                "type": "co2_sensor",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2021-07-15 08:21:14",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4276,
              "controller_id": 67046,
              "building_id": 568,
              "floor_id": 189471,
              "space_id": 1436,
              "room_id": null,
              "created_at": "2023-02-20 10:52:26",
              "deleted_at": null,
              "controller_log": {
                "mac": "70B3D52DD30037BC",
                "displayDigits": 20,
                "temperature": 23.588263633251,
                "humidity": 30.078125,
                "motorRange": 616,
                "motorPosition": 616,
                "batteryVoltage": 3.5,
                "openWindow": false,
                "childLock": false,
                "highMotorConsumption": false,
                "lowMotorConsumption": false,
                "rssi": -72,
                "temeprature_range_settings": {
                  "min": 5,
                  "max": 30
                },
                "keepalive_time": 255,
                "open_window_params": {
                  "enabled": false,
                  "duration": 2,
                  "motorPosition": 0,
                  "delta": 1
                },
                "operational_mode": "01",
                "internal_algo_params": {
                  "period": 10,
                  "pFirstLast": 20,
                  "pNext": 20
                },
                "tdiff_params": {
                  "warm": 1,
                  "cold": 1
                },
                "uplink_type": "00",
                "join_retry_period": 21.25,
                "network_provider": "the_things_industries",
                "spf": "7",
                "deviceVersions": {
                  "hardware": 26,
                  "software": 40
                },
                "watchDogParams": {
                  "wdpC": false,
                  "wdpUc": 255
                },
                "frameCount": 48027,
                "joinRequestCount": 6,
                "lastActive": "2023-02-20 12:42:32",
                "extSensorOn": [],
                "extSensorIs": "",
                "thermostatIs": "",
                "application": "mclimate-marketing",
                "proportionalAlgorithmParameters": {
                  "coefficient": 3,
                  "period": 10
                },
                "temperatureControlAlgorithm": "proportional",
                "activeFrom": "2022-08-11 13:32:22",
                "online": true,
                "scheduleInfo": {
                  "inSchedule": true,
                  "mainTarget": 22,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 67046,
                "user_id": 12073,
                "serial_number": "90K3670463LFX",
                "mac": "70B3D52DD30037BC",
                "firmware_version": "4.0",
                "hardware_version": "2.6.1",
                "name": "Vicki_lorawan - 90K3670463LFX",
                "type": "vicki_lorawan",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2021-10-18 07:04:39",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4277,
              "controller_id": 86212,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:27",
              "deleted_at": null,
              "controller_log": {
                "mac": "3731323851307706",
                "displayDigits": 22,
                "temperature": 23.411792837403,
                "humidity": 32.8125,
                "motorRange": 0,
                "motorPosition": 0,
                "batteryVoltage": 3.1,
                "openWindow": false,
                "childLock": false,
                "highMotorConsumption": false,
                "lowMotorConsumption": false,
                "rssi": -76,
                "temeprature_range_settings": {
                  "min": 5,
                  "max": 30
                },
                "keepalive_time": 1,
                "open_window_params": {
                  "enabled": false,
                  "duration": 2,
                  "motorPosition": 0,
                  "delta": 1
                },
                "operational_mode": "01",
                "internal_algo_params": {
                  "period": 10,
                  "pFirstLast": 20,
                  "pNext": 20
                },
                "tdiff_params": {
                  "warm": 2,
                  "cold": 2
                },
                "uplink_type": "00",
                "join_retry_period": 10,
                "network_provider": "the_things_industries",
                "spf": "12",
                "deviceVersions": {
                  "hardware": 26,
                  "software": 41
                },
                "watchDogParams": {
                  "wdpC": 17,
                  "wdpUc": 24
                },
                "frameCount": 1,
                "joinRequestCount": 0,
                "lastActive": "2023-01-30 14:19:15",
                "extSensorOn": [],
                "extSensorIs": "",
                "thermostatIs": "58208AFFFE400A5D",
                "application": "mclimate-dev",
                "proportionalAlgorithmParameters": {
                  "coefficient": 3,
                  "period": 10
                },
                "temperatureControlAlgorithm": "proportional",
                "activeFrom": "2022-11-02 08:16:54",
                "online": false,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 86212,
                "user_id": 12073,
                "serial_number": "NFVE86212DSNG",
                "mac": "3731323851307706",
                "firmware_version": "3.6",
                "hardware_version": "0.0",
                "name": "Vicki LoRaWAN - NFVE86212DSNG",
                "type": "vicki_lorawan",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2022-02-15 14:17:56",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4278,
              "controller_id": 41056,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:27",
              "deleted_at": null,
              "controller_log": {
                "network_provider": "the_things_industries",
                "extSensorOn": [],
                "extSensorIs": "",
                "rssi": -114,
                "spf": "8",
                "CO2": 586,
                "temperature": 18.5,
                "humidity": 97.27,
                "voltage": 3.44,
                "uplinkType": "00",
                "keepAliveTime": 11,
                "joinRetryPeriod": 3,
                "deviceVersions": {
                  "hardware": 15,
                  "software": 12
                },
                "watchDogParams": {
                  "wdpC": 17,
                  "wdpUc": 24
                },
                "lastActive": "2022-06-18 05:04:57",
                "buzzerNotification": {
                  "duration_good_beeping": 0,
                  "duration_good_loud": 500,
                  "duration_good_silent": 500,
                  "duration_medium_beeping": 0,
                  "duration_medium_loud": 500,
                  "duration_medium_silent": 500,
                  "duration_bad_beeping": 0,
                  "duration_bad_loud": 500,
                  "duration_bad_silent": 500
                },
                "frameCount": 4393,
                "notifyPeriod": {
                  "good_zone": 0,
                  "medium_zone": 1,
                  "bad_zone": 2
                },
                "measurementPeriod": {
                  "good_zone": 10,
                  "medium_zone": 10,
                  "bad_zone": 10
                },
                "autoZeroPeriod": 192,
                "autoZeroValue": 1255,
                "boundaryLevels": {
                  "good_medium": 900,
                  "medium_bad": 1500
                },
                "application": "mclimate-co2",
                "activeFrom": "2021-07-20 12:50:31",
                "mac": "70B3D52DD500001C",
                "online": false,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 41056,
                "user_id": 12073,
                "serial_number": "SJ9741056T12M",
                "mac": "70B3D52DD500001C",
                "firmware_version": "1.10",
                "hardware_version": "0.0",
                "name": "Co2_sensor - SJ9741056T12M",
                "type": "co2_sensor",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2021-07-15 08:21:14",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4279,
              "controller_id": 35767,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:27",
              "deleted_at": null,
              "controller_log": {
                "network_provider": "the_things_industries",
                "rssi": -71,
                "spf": "7",
                "valveState": false,
                "boxTamper": false,
                "floodDetectionWireState": true,
                "flood": false,
                "magnet": false,
                "alarmValidated": false,
                "manualOpenIndicator": true,
                "manualCloseIndicator": true,
                "closeTime": 1,
                "openTime": 0,
                "waterTemp": 23,
                "ambientTemp": 23,
                "battery": 2.376,
                "lastActive": "2023-02-20 12:43:13",
                "joinRequestCount": 64,
                "frameCount": 1417,
                "application": "mclimate-marketing",
                "activeFrom": "2022-02-23 09:10:55",
                "floodSensors": [
                  "70B3D52DD10000C4"
                ],
                "tValves": [],
                "uplinkType": "01",
                "keepAliveTime": 0,
                "mac": "70B3D52DD000003F",
                "online": true,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 35767,
                "user_id": 12073,
                "serial_number": "W0MW35767CZ0A",
                "mac": "70B3D52DD000003F",
                "firmware_version": "V1SHTHF",
                "hardware_version": "0.0",
                "name": "T_valve - W0MW35767CZ0A",
                "type": "t_valve",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2021-03-08 09:20:35",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4280,
              "controller_id": 36084,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:27",
              "deleted_at": null,
              "controller_log": {
                "network_provider": "the_things_industries",
                "rssi": -82,
                "spf": "7",
                "boxTamper": false,
                "flood": false,
                "temperature": 25,
                "battery": 3.056,
                "lastActive": "2023-02-20 12:42:35",
                "joinRequestCount": 58,
                "application": "mclimate-dev",
                "frameCount": 553,
                "activeFrom": "2022-11-22 09:04:41",
                "tValves": [
                  "70B3D52DD000003F"
                ],
                "uplinkType": "01",
                "keepAliveTime": 0,
                "mac": "70B3D52DD10000C4",
                "online": true,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 36084,
                "user_id": 12073,
                "serial_number": "VCVN36084GZYG",
                "mac": "70B3D52DD10000C4",
                "firmware_version": "V1SHTHF",
                "hardware_version": "0.0",
                "name": "T_flood - VCVN36084GZYG",
                "type": "t_flood",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2021-03-26 08:50:12",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4281,
              "controller_id": 32444,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:27",
              "deleted_at": null,
              "controller_log": {
                "mac": "70B3D52DD30009E1",
                "displayDigits": 26,
                "temperature": 23.80859375,
                "humidity": 25.78125,
                "motorRange": 319,
                "motorPosition": 319,
                "batteryVoltage": 2.2,
                "openWindow": false,
                "childLock": false,
                "highMotorConsumption": false,
                "lowMotorConsumption": false,
                "rssi": -66,
                "temeprature_range_settings": {
                  "min": 5,
                  "max": 30
                },
                "keepalive_time": 1,
                "open_window_params": {
                  "enabled": false,
                  "duration": 2,
                  "motorPosition": 0,
                  "delta": 1
                },
                "operational_mode": "01",
                "internal_algo_params": {
                  "period": 15,
                  "pFirstLast": 80,
                  "pNext": 10
                },
                "tdiff_params": {
                  "warm": 1,
                  "cold": 1
                },
                "uplink_type": "01",
                "join_retry_period": 3,
                "network_provider": "tektelic",
                "spf": "7",
                "deviceVersions": {
                  "hardware": 24,
                  "software": 34
                },
                "watchDogParams": {
                  "wdpC": null,
                  "wdpUc": 24
                },
                "frameCount": null,
                "joinRequestCount": null,
                "lastActive": "2021-04-21 11:30:23",
                "extSensorOn": [],
                "extSensorIs": null,
                "thermostatIs": null,
                "application": null,
                "proportionalAlgorithmParameters": [],
                "temperatureControlAlgorithm": null,
                "activeFrom": "2021-02-23 14:07:29",
                "online": false,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 32444,
                "user_id": 12073,
                "serial_number": "Y9HV32444OFX8",
                "mac": "70B3D52DD30009E1",
                "firmware_version": "V1SHTHF",
                "hardware_version": "0.0",
                "name": "Vicki_lorawan - Y9HV32444OFX8",
                "type": "vicki_lorawan",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2020-12-24 12:40:10",
                "assigned_at": null,
                "deleted_at": null
              }
            },
            {
              "id": 4282,
              "controller_id": 168979,
              "building_id": 568,
              "floor_id": null,
              "space_id": null,
              "room_id": null,
              "created_at": "2023-02-20 10:52:28",
              "deleted_at": null,
              "controller_log": {
                "activeFrom": "2023-02-09 10:22:57",
                "application": "mclimate-testing",
                "batteryVoltage": 3.57,
                "frameCount": 552,
                "lastActive": "2023-02-20 12:42:53",
                "network_provider": "the_things_industries",
                "relativeHumidity": 17.19,
                "rssi": -54,
                "sensorTemperature": 24.4,
                "spf": "7",
                "targetTemperature": 20,
                "thermistorProperlyConnected": false,
                "uplinkType": "00",
                "keepAliveTime": 10,
                "deviceVersions": {
                  "hardware": 19,
                  "software": 17
                },
                "joinRequestCount": 20,
                "childLock": false,
                "displayRefreshPeriod": 12,
                "heatingStatus": 0,
                "joinRetryPeriod": 10,
                "sendTargetTempDelay": 10,
                "watchDogParams": {
                  "wdpC": 17,
                  "wdpUc": 24
                },
                "mac": "70B3D52DD8000003",
                "online": true,
                "scheduleInfo": {
                  "inSchedule": false,
                  "mainTarget": null,
                  "inPriority": false
                }
              },
              "controller": {
                "id": 168979,
                "user_id": 12073,
                "serial_number": "UFTW1689793KRT",
                "mac": "70B3D52DD8000003",
                "firmware_version": "1.0",
                "hardware_version": "2.3",
                "name": "Wireless Thermostat LoRaWAN - UFTW1689793KRT",
                "type": "wireless_thermostat",
                "device_group": "lorawan",
                "status_push": 0,
                "room_id": null,
                "owner_id": null,
                "created": "2023-01-30 15:13:18",
                "assigned_at": null,
                "deleted_at": null
              }
            }
          ],
          "_links": {
            "self": {
              "href": ""
            }
          }
        }]
      }
    case GET_BUILDINGS_SUCCESS:
      return {
        ...state,
        buildings: action.payload
      }

    case GET_BUILDING_ASSET_SUCCESS:
      let id = action.payload.id;

      switch (action.assetType) {
        case 'buildings':
          return {
            ...state,
            building: action.payload,
            buildings: state.buildings.map(building => building.id === id
              ? action.payload
              : building
            )
          }
        case 'floors':
          return {
            ...state,
            floor: action.payload,
            buildings: state.buildings.map(b => b.id === action.payload.building_id
              ? {
                ...b,
                floors: [...b.floors].map((floor) => {
                  if (floor.id == action.payload.id) return action.payload
                  else return floor
                }
                )
              } : b),
            selectedBuildingId: action.payload.building_id
          }
        case 'spaces':
          return {
            ...state,
            space: action.payload,
            buildings: state.buildings.map(b => b.id === action.payload.building_id
              ? {
                ...b,
                spaces: [...b.spaces].map((space) => {
                  if (space.id == action.payload.id) return action.payload
                  else return space
                }
                )
              }
              : b)
          }
        case 'rooms':
          return {
            ...state,
            room: action.payload,
            buildings: state.buildings.map(b => b.id === action.payload.building_id
              ? {
                ...b,
                rooms: [...b.rooms].map((room) => {
                  if (room.id == action.payload.id) return action.payload
                  else return room
                }
                )
              }
              : b)
          }
      }
      break;

    case GET_BUILDING_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload
      }

    case CREATE_BUILDING_ASSET_SUCCESS:
      {
        if (action.payload.assetType == 'buildings') {
          let newBuilding = { ...action.payload.asset, floors: [], rooms: [], spaces: [], devices: [] }
          return {
            ...state,
            buildings: [...state.buildings, newBuilding]

          }
        } else {
          let buildingId = action.payload.asset.building_id;
          let selectedBuilding = state.buildings.filter(building => building.id == buildingId)[0];
          let selectedBuildingSelectedAsset = selectedBuilding[action.payload.assetType];
          let users = [JSON.parse(action.payload.asset.building_user)];

          let assetToPass = { ...action.payload.asset, users }
          return {
            ...state,
            buildings: state.buildings.map(building => building.id === buildingId ?
              { ...building, [action.payload.assetType]: [...selectedBuildingSelectedAsset, assetToPass] }
              : building
            ),
            building: { ...state.buildings.filter(building => building.id === buildingId)[0], [action.payload.assetType]: [...selectedBuildingSelectedAsset, assetToPass] }

          }
        }
      }

    case DELETE_BUILDING_ASSET_SUCCESS:
      {
        if (action.assetType.assetType == 'buildings') {
          return {
            ...state,
            buildings: state.buildings.filter(building => building.id !== action.assetType.buildingId)
          }
        } else {
          let buildingId = action.assetType.buildingId;
          let selectedBuilding = state.buildings.filter(building => building.id == buildingId)[0];
          let selectedBuildingSelectedAsset = selectedBuilding[action.assetType.assetType];

          return {
            ...state,
            buildings: state.buildings.map(building => building.id === buildingId ?
              { ...building, [action.assetType.assetType]: selectedBuildingSelectedAsset.filter(asset => asset.id !== Number(action.assetType.id)) }
              : building
            )
          }
        }
      }

    case UPDATE_BUILDING_ASSET_SUCCESS:
      {
        if (action.assetType == 'buildings') {
          return {
            ...state,
            buildings: state.buildings.map(building => building.id === Number(action.id) ?
              { ...building, name: action.payload.name, address: action.payload.address, asset_type: action.payload.asset_type, type: action.payload.type }
              : building
            )
          }
        } else {

          let buildingId = action.buildingId;
          let selectedBuilding = state.buildings.filter(building => building.id == buildingId)[0];
          let selectedBuildingSelectedAsset = selectedBuilding[action.assetType];

          return {
            ...state,
            buildings: state.buildings.map(building => building.id === buildingId ?
              {
                ...building,
                [action.assetType]:
                  selectedBuildingSelectedAsset.map(asset => asset.id === Number(action.id)
                    ? { ...asset, name: action.payload.name }
                    : asset)
              }
              : building
            )
          }
        }
      }

    // case UPDATE_BUILDING_DEVICES_SUCCESS:
    //   {
    //     // TODO: update devices in redux store
    //     console.log(action)
    //     let buildingId = Number(action.buildingId);

    //     if (action.action == 'add') {
    //       return {
    //         ...state,
    //         buildings: state.buildings.map(building => building.id === Number(buildingId) ?
    //           {
    //             ...building,
    //             devices: [...building.devices, action.data.DeviceManagement]
    //           }
    //           : building
    //         )

    //       }
    //     } else if (action.action == 'delete') {
    //       let devicesIds = [];

    //       action.data.delete_controllers?.forEach(device => {
    //         devicesIds.push(device.id)
    //       })

    //       console.log(devicesIds)

    //       return {
    //         ...state,
    //         buildings: state.buildings.map(building => building.id === Number(buildingId) ?
    //           {
    //             ...building,
    //             devices: building.devices.filter(d => !devicesIds.includes(d.id) )
    //           }
    //           : building
    //         )

    //       }

    //     }

    //     return {
    //       ...state
    //     }
    //   }


    case ASSIGN_BUILDING_USER_SUCCESS:
      {
        return {
          ...state,
          users: [...state.users, action.payload],
          buildings: state.buildings.map(building => building.id === Number(action.id) ?
            {
              ...building,
              users: building.users ? [...building.users, action.payload] : action.payload
            }
            : building
          )
        }
      }

    case SET_SELECTED_BUILDING_ID:
      {
        return {
          ...state,
          selectedBuildingId: action.payload.buildingId,
          selectedAssetId: action.payload.assetId
        }
      }

    case CLEAR_BUILDINGS:
      return {
        ...state,
        buildings: []
      }

    case START_LOAD_BUILDINGS:
      {
        return {
          ...state,
          loading: true
        }
      }

    case END_LOAD_BUILDINGS:
      {
        return {
          ...state,
          loading: false
        }
      }

    default:
      return state
  }
}

export default buildings
