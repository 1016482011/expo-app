import _ from 'lodash'
import { AsyncStorage } from 'react-native'
import { PROJECTS, PROSELECT } from '../actionTypes'

export const projectAssessmentAction = data => {
  return { type: PROJECTS, data }
}

export const proSelectAction = data => {
  AsyncStorage.setItem('proSelect', JSON.stringify(data))
  return { type: PROSELECT, data }
}
