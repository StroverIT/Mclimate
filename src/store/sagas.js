import { all, fork } from "redux-saga/effects"

//public
import LayoutSaga from "./layout/saga"
import buildingsSaga from "./buildings/saga"

export default function* rootSaga() {
  yield all([
    fork(LayoutSaga),
    fork(buildingsSaga)
  ])
}
