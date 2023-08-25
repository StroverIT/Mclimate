import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {generatePath} from "react-router-dom";
import {AllRoutes} from "../../routes/allRoutes";

const DashboardNavigator = () => {
  const buildings = useSelector((store) => store.buildings.buildings);
  const history = useHistory();
  const {buildingId} = useParams();

  useEffect(() => {
    redirectToDashboard();
  }, [buildings.length, buildingId])

  const redirectToDashboard = () => {
    const currBuildingId = parseInt(buildingId);
    if (buildings.length > 0 && currBuildingId > -1) {
      const currBuilding = buildings.find(building => building.id === currBuildingId);
      if (currBuilding) {
        if (currBuilding.dashboards.length > 0) {
          history.push(generatePath(AllRoutes.CUSTOMIZABLE_DASHBOARD.path, {buildingId: currBuildingId, dashboardId: currBuilding.dashboards[0].id}))
        } else {
          history.push(generatePath(AllRoutes.UPLOAD_DASHBOARD.path, {buildingId: currBuildingId}));
        }
      } else {
        history.push('/404')
      }
    }
  }

  return <></>
};

export default DashboardNavigator;