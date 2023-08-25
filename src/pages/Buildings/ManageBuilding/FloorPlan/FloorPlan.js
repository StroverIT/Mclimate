import * as React from 'react';
import {useEffect, useState} from "react";
import MissingFloorPlan from "./MissingFloorPlan/MissingFloorPlan";
import EditFloorPlan from "./EditFloorPlan/EditFloorPlan";
import {useParams} from "react-router-dom";
import {FPUtils} from "./FPUtils";
import AppUtils from "../../../../common/AppUtils";
import {setEditMode, setFloorPlan, setInitialState} from "../../../../store/floorPlan/actions";
import {useDispatch, useSelector} from "react-redux";
import {mapDevices} from "./helpers/mapDevices";
import {getBuildingAsset} from "../../../../store/buildings/actions";
import {showMessage} from "../../../../helpers/ui_helper";
import {mapDevicesData} from "./helpers/mapDevicesData";
import {getFloorPlan} from "../../../../helpers/backend_helper";
import {unstable_batchedUpdates} from "react-dom";
import './floorPlan.scss';

export let initialFloorPlanValue = null;

const FloorPlan = () => {
  const dispatch = useDispatch();

  const plan = useSelector((store) => store.floorPlan.plan);
  const currentBuilding = useSelector((store) => store.buildings.building);
  const controllers = useSelector((store) => store.controllers.controllers);
  const filterText = useSelector((store) => store.floorPlan.filterDeviceText);

  const [devices, setDevices] = useState({assetDevices: null, buildingDevices: null});
  const [updatedFloorPlan, setUpdatedFloorPlan] = useState(null);
  const [isMissingFloorPlan, setIsMissingFloorPlan] = useState(false);

  const {buildingId, floorId} = useParams();

  useEffect(() => {
    if (buildingId) {
      if (typeof currentBuilding === "undefined" || currentBuilding.id !== parseInt(buildingId)) {
        dispatch(getBuildingAsset('buildings', buildingId));
      }
      if (controllers?.length === 0) {
        // dispatch(({provider: true}));
      }
    }
    return (() => {
      initialFloorPlanValue = null;
      dispatch(setInitialState());
    })
  }, [])

  useEffect(() => {
    if (currentBuilding !== null && typeof currentBuilding !== "undefined" && currentBuilding.id === parseInt(buildingId)) {
      FPUtils.allBuildingDevices = currentBuilding.devices;
      mapAllBuildingDevices(currentBuilding.devices);

      if (!initialFloorPlanValue) {
        getFloorPlan(floorId)
          .then(response => {
            if (response && response.FloorPlan) {
              response.FloorPlan.devices = JSON.parse(response.FloorPlan.devices);
              // Creating the floor plan device objects(#settings)
              mapDevicesData(response.FloorPlan, FPUtils.allBuildingDevices);
              dispatch(setFloorPlan(FPUtils.copyFPObject(response.FloorPlan)))
              initialFloorPlanValue = {...response.FloorPlan};
            } else {
              setIsMissingFloorPlan(true);
            }
          })
          .catch(() => {
            setIsMissingFloorPlan(true);
            showMessage("Something went wrong with floor plan loading", true);
          })
      }
    }
  }, [currentBuilding])

  useEffect(() => {
    if (plan) {
      mapPlanDevices(plan);
    }
  }, [plan])

  useEffect(() => {
    if (currentBuilding !== null && typeof currentBuilding !== "undefined") {
      let devicesCopy = currentBuilding.devices.map(el => {return {...el}});
      if (filterText !== '') {
        devicesCopy = devicesCopy.filter(device => {
          return device.controller.name.toLowerCase().includes(filterText.toLowerCase()) ||
            device.controller.serial_number.toLowerCase().includes(filterText.toLowerCase())
        })
      }
      mapAllBuildingDevices(devicesCopy);
    }
  }, [filterText])

  const mapAllBuildingDevices = (devices) => {
    const mappedAssetDevices = [];
    // mappedBuildingDevices are devices with floor_id = null which are attached directly to building
    const mappedBuildingDevices = {};
    devices.forEach(device => {
      mapDevices(currentBuilding, device, mappedAssetDevices, mappedBuildingDevices);
    })

    setDevices({
      assetDevices: mappedAssetDevices,
      buildingDevices: mappedBuildingDevices
    });
  }

  const mapPlanDevices = (planObj) => {
    FPUtils.floorPlanDevices = planObj.devices;
    const updatedPlanObj = {
      ...planObj,
      devices: planObj.devices.map(device => {
        return {
          x: device.coordinates[0], // X-coordinate of element
          y: device.coordinates[1], // Y-coordinate of element
          i: device.id, // Element key,
          image: device.image ?? AppUtils.getDeviceImage(device.type),
        }
      })
    }
    setUpdatedFloorPlan(updatedPlanObj);
  }

  const handleUploadFloorPlan = (image) => {
    const plan = {
      id: -1,
      image: image,
      devices: []
    }
    unstable_batchedUpdates(() => {
      dispatch(setFloorPlan(FPUtils.copyFPObject(plan)))
      dispatch(setEditMode(true));
    })
    initialFloorPlanValue = {...plan};
    setIsMissingFloorPlan(false);
  }

  const setInitialFloorPlan = (newPlanValue) => {
    initialFloorPlanValue = newPlanValue;
  }

  return (
    isMissingFloorPlan ? <MissingFloorPlan uploadFloorPlan={handleUploadFloorPlan} /> :
      !devices.buildingDevices || !devices.assetDevices || !updatedFloorPlan ? null :
      <EditFloorPlan devicesObj={devices} floorPlan={updatedFloorPlan} setInitialFloorPlan={setInitialFloorPlan}/>
  )
};

export default FloorPlan