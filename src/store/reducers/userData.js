import _ from 'lodash'
import { RESET, USERDATAINFO } from '../actionTypes'

/**
 * 用户数据状态
 */
const initialState = {
  userInfo: {
    id: null,
    realName: null,
    userName: null,
    userSex: null,
    userUnit: null,
    userPhone: null
  }
}

export default function userData(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case USERDATAINFO:
      return _.assign({}, state, { userInfo: data })
    case RESET:
      return initialState
    default:
      return state
  }
}
