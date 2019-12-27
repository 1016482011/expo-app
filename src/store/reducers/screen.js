import _ from 'lodash'
import { RESET, SCREENUPDATE } from '../actionTypes'

/**
 * 所有页面的状态
 */
const initialState = {
  // 登录页面状态
  loginIsSubmit: false,
  // 问题提交状态
  problemAddIsSubmit: false
}

export default function screenData(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case SCREENUPDATE:
      return _.assign({}, state, data)
    case RESET:
      return initialState
    default:
      return state
  }
}
