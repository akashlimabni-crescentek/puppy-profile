import { all } from 'redux-saga/effects'
import { watchAuth } from './authSaga'
import { watchPuppy } from './puppySaga'

export function* rootSaga() {
  yield all([watchAuth(), watchPuppy()])
}
