import _ from 'lodash'
import { SCREENUPDATE } from '../actionTypes'

export const screeUpdateAcion = data => {
  return { type: SCREENUPDATE, data }
}
