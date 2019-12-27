import _ from 'lodash'
import { USERDATAINFO } from '../actionTypes'

export const userDataInfoAddAction = data => {
  return { type: USERDATAINFO, data }
}
