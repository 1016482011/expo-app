import _ from 'lodash'
import { AsyncStorage } from 'react-native'
import { RESET } from '../actionTypes'
import { ModifyServer } from '../../helper/api'
import { TokenModify } from '../../helper/client'

export const restAction = data => {
  return { type: RESET, data }
}

export const restStoreAction = data => async dispatch => {
  let keys = ['proSelect', 'token', 'domain']
  await AsyncStorage.multiRemove(keys)
  ModifyServer(null)
  TokenModify(null)
  dispatch(restAction())
  return true
}
