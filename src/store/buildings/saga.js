import { call, put, takeEvery } from "redux-saga/effects"
import { push } from 'react-router-redux';

// Crypto Redux States
import {
  CREATE_BUILDING_ASSET, CREATE_BUILDING_ASSET_SUCCESS,
  GET_BUILDINGS, GET_BUILDING_ASSET, GET_BUILDING_USERS,
  UPDATE_BUILDING_ASSET, DELETE_BUILDING_ASSET,
  ASSIGN_BUILDING_USER, UPDATE_BUILDING_USER,
  DELETE_BUILDING_USER, UPDATE_BUILDING_DEVICES
} from "./actionTypes"

import {
  getBuildingsSuccess,
  getBuildingAssetSuccess,
  getBuildingUsersSuccess,
  createBuildingAssetSuccess,
  endSaving,
  updateBuildingAssetSuccess,
  deleteBuildingAssetSuccess,
  updateBuildingDevicesSuccess,
  assignBuildingUserSuccess
} from "./actions"

import { startLoading, endLoading } from "../buildings/actions";

//Include Both Helper File with needed methods
import {
  fetchBuildings,
  fetchBuildingAsset,
  fetchBuildingUsers,
  createBuildingsAsset,
  updateBuildingsAsset,
  deleteBuildingsAsset,
  createBuildingUser,
  editBuildingUser,
  deleteBuildingsUser,
  createBuildingsDevice,
  deleteBuildingsDevice,
  fetchDashboards,
  fetchDashboardsByBuildingId,
  getBuildingSubscriptions
} from "../../helpers/backend_helper"
import { addNToast, setNError } from "../layout/actions";
import { hideSpinner, showSpinner } from "../spinner/actions";
import { AllRoutes } from "../../routes/allRoutes";
import { generatePath } from "react-router-dom";

function* getAllBuildings({ payload }) {
  try {
    yield put(startLoading())
    yield put(showSpinner())

    const response = yield call(fetchBuildings, {});
    let buildings = [];

    if (response._embedded) {
      buildings = response._embedded.BuildingManagement;
      if (buildings.length > 0) {
        const dashboards = yield call(fetchDashboards);
        buildings.forEach(building => {
          building['dashboards'] = dashboards?.length > 0 ? dashboards.filter(dashboard => dashboard?.buildingId === building.id) : [];
        })
      }
    }

    yield put(getBuildingsSuccess(buildings))

    if (response.status === 401) {
      localStorage.removeItem("authUser")
    }

    yield put(endLoading())
    yield put(hideSpinner())
  } catch (error) {
    yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
    yield put(hideSpinner())
  }
}

function* getBuildingAsset({ assetType, id }) {
  try {
    yield put(startLoading())
    yield put(showSpinner())
    let dashboards;
    let subscriptions;
    const response = yield call(fetchBuildingAsset, { assetType, id })

    if (assetType === 'buildings') {
      dashboards = yield call(fetchDashboardsByBuildingId, id);
      subscriptions = yield call(getBuildingSubscriptions, id);
    }

    const data = response._embedded.BuildingManagement[0];
    data['dashboards'] = dashboards ?? [];
    data['subscriptions'] = subscriptions ?? [];

    yield put(getBuildingAssetSuccess(assetType, data))
    yield put(endLoading())
    yield put(hideSpinner())
  } catch (error) {
    console.log(error)
    yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
    yield put(hideSpinner())
  }
}

function* getBuildingUsers({ assetType, id }) {
  try {
    yield put(startLoading())
    const response = yield call(fetchBuildingUsers, { assetType, id })
    const users = response._embedded?.UserManagement;

    yield put(getBuildingUsersSuccess(users))

    yield put(endLoading())
  } catch (error) {
    console.log(error)
    yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
  }
}

function* assignBuildingUser({ assetType, payload, id }) {
  try {
    yield put(startLoading())
    const response = yield call(createBuildingUser, { assetType, payload, id })

    yield put(endSaving())
    yield put(endLoading())

    if ('status' in response) {
      if (response.status == 401) {
        yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
      } else if (response.status == 403) {
        console.log('ok')
        yield put(setNError({ error: true, message: 'The user you are trying to add does not exist.' }))
      }
    } else {
      let data = {
        ...response.UserManagement,
        ...payload
      }
      yield put(assignBuildingUserSuccess(assetType, data, id))
    }

  } catch (error) {
    if (error.status == 401) {
      yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
    } else {
      yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
    }
  }
}

function* updateBuildingUser({ payload, id, history }) {
  try {
    yield put(startLoading())
    const response = yield call(editBuildingUser, { payload, id })

    yield put(endSaving())
    yield put(endLoading())

    if (response.status == 401) {
      yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
    } else {
      history.goBack()
    }
  } catch (error) {
    if (error.status == 401) {
      yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
    } else {
      yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
    }
  }
}

function* deleteBuildingUser({ id, history, callback = false }) {
  try {
    yield put(startLoading())
    const response = yield call(deleteBuildingsUser, { id })

    yield put(endSaving())
    yield put(endLoading())

    if (response.status == 401) {
      yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
    } else if(history) {
      history.goBack()
    }else{
      if(callback) callback()
    }

  } catch (error) {
    if (error.status == 401) {
      yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
    } else {
      yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
    }
  }
}

function* createBuildingAsset({ assetType, payload }) {
  try {
    yield put(startLoading())
    switch (assetType) {
      case 'buildings':
        payload = buildingPayload(payload);
        break;
      default:
        break;
    }
    payload.name = payload.asset_name;
    delete (payload.asset_name);
    const response = yield call(createBuildingsAsset, { assetType, payload })

    if (response.status && response.status >= 300) {
      yield put(addNToast({ title: `Create ${assetType} error`, msg: `Failed to create the ${assetType.slice(0, -1)}.`, time: new Date() }))
      if (response.status === 401) {
        yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
      } else {
        yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
      }
    } else {
      yield put(createBuildingAssetSuccess({ assetType, asset: response.BuildingManagement }));
      yield put(addNToast({ title: `Create ${assetType} success`, msg: `The ${assetType.slice(0, -1)} is successfully created.`, time: new Date() }))
    }

    yield put(endLoading())
    yield put(endSaving())
  } catch (error) {
    yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
  }
}

function buildingPayload(payload) {
  if (!payload.use_floors) {
    delete (payload.floors)
  }
  if (payload.type === 'commercial') {
    payload.asset_type = "offices";
  }
  if (payload.use_apartments) {
    payload.asset_type = "apartments";
  }
  if (payload.type === 'residential') {
    payload.asset_type = "apartments";
  }
  delete (payload.use_floors)

  return payload;
}

function* updateBuildingAsset({ assetType, payload, id, buildingId, history }) {
  try {
    yield put(startLoading())
    switch (assetType) {
      case 'buildings':
        payload = buildingPayload(payload);
        break;
      default:
        break;
    }

    payload.name = payload.asset_name;
    delete (payload.asset_name);
    const response = yield call(updateBuildingsAsset, { assetType, payload, id })

    if (response.status === 401) {
      yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
    } else {
      yield put(updateBuildingAssetSuccess(assetType, payload, id, buildingId))
      history.goBack()
    }

    yield put(endSaving())
    yield put(endLoading())

  } catch (error) {
    yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
  }
}

function* deleteBuildingAsset({ assetType, id, buildingId, history, callback }) {
  try {
    const response = yield call(deleteBuildingsAsset, { assetType, id })
    yield put(endSaving())
    yield put(endLoading())

    if (response.status === 401) {
      yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
    } else {
      yield put(deleteBuildingAssetSuccess({ assetType, id, buildingId }))

      if (assetType === 'buildings') history.push(AllRoutes.BUILDINGS_LIST.path)
      else history.push(generatePath(AllRoutes.BUILDING_DETAIL.path, { buildingId: buildingId }));

      if (callback) callback()
    }

  } catch (error) {
    yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
  }
}

function* updateBuildingDevices({ assetType, data, id, buildingId, history, callback }) {
  try {
    yield put(startLoading())

    if (data.ext) {
      if (data.add) {
        let res = yield call(createBuildingsDevice, { assetType, data: { controller_id: data.id }, id })
        if (res.status == 403) {
          yield put(setNError({ error: true, message: 'This device is already assiged to another asset.' }))
        } else {
          yield put(updateBuildingDevicesSuccess(assetType, res, id, buildingId, 'add'))
          if (callback) callback();
        }
      } else if (data.delete) {
        let res = yield call(deleteBuildingsDevice, data.id);

        if (res.status === 403) {
          yield put(setNError({ error: true, message: 'This device is already assiged to another asset.' }))
        } else {
          yield put(updateBuildingDevicesSuccess(assetType, res, id, buildingId, 'add'))
          if (history.location.pathname === `/buildings/${buildingId}`) {
            history.go(0)
          } else {
            yield put(updateBuildingDevicesSuccess(assetType, data, id, buildingId, 'delete'))
            if (callback) callback();
          }
        }
      }
    }
    else {
      let new_controllers = data.new_controllers;
      let added = [];

      for (let index = 0; index < new_controllers.length; index++) {
        let data = {
          controller_id: new_controllers[index].id
        };

        let res = yield call(createBuildingsDevice, { assetType, data, id })

        if (res.status == 403) {
          yield put(setNError({ error: true, message: 'This device is already assiged to another asset.' }))
        } else {
          added.push(id);
          yield put(updateBuildingDevicesSuccess(assetType, res, id, buildingId, 'add'))

        }
      }

      let delete_controllers = data.delete_controllers;
      let removed = [];

      for (let index = 0; index < delete_controllers.length; index++) {
        let asset_id = delete_controllers[index].asset_id

        let res = yield call(deleteBuildingsDevice, asset_id);

        if (res.status == 403 || res.status == 401) {
          yield put(setNError({ error: true, message: 'You do not have permission for this action.' }))
        } else {
          removed.push(id);
          yield put(updateBuildingDevicesSuccess(assetType, data, id, buildingId, 'delete'))
        }
      }

    }

    if (!(history.location.pathname).includes('installation')) {
      history.go(0)
    } 

    yield put(endSaving())
    yield put(endLoading())

  } catch (error) {
    console.log(error)
    // yield put(getRoomsFail(error))
    yield put(setNError({ error: true, message: 'Something went wrong. Please try again.' }))
  }
}


function* buildingsSaga() {
  yield takeEvery(GET_BUILDINGS, getAllBuildings)
  yield takeEvery(GET_BUILDING_ASSET, getBuildingAsset)
  yield takeEvery(GET_BUILDING_USERS, getBuildingUsers)
  yield takeEvery(CREATE_BUILDING_ASSET, createBuildingAsset)
  yield takeEvery(CREATE_BUILDING_ASSET_SUCCESS, createBuildingAssetSuccess)
  yield takeEvery(UPDATE_BUILDING_ASSET, updateBuildingAsset)
  yield takeEvery(DELETE_BUILDING_ASSET, deleteBuildingAsset)
  yield takeEvery(ASSIGN_BUILDING_USER, assignBuildingUser)
  yield takeEvery(UPDATE_BUILDING_USER, updateBuildingUser)
  yield takeEvery(DELETE_BUILDING_USER, deleteBuildingUser)
  yield takeEvery(UPDATE_BUILDING_DEVICES, updateBuildingDevices)

}

export default buildingsSaga
