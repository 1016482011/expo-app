import _ from 'lodash'
import { PROJECTS, PROSELECT, RESET } from '../actionTypes'

/**
 * 项目状态
 */
const initialState = {
  projects: null,
  projectSelect: null
}

export default function userData(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case PROJECTS:
      return _.assign({}, state, { projects: data })
    case PROSELECT:
      return _.assign({}, state, { projectSelect: data })
    case RESET:
      return initialState
    default:
      return state
  }
}
