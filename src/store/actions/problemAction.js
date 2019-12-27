import _ from 'lodash'
import {
  PROBLEMQUEST,
  PROBLEMLOAD,
  PROBLEMSELECTID,
  PROBLEMDELCONFRIM,
  PROBLEMLOADRESET,
  PROBLEMLISTMODEL,
  PROBLEMDETAILTOSHOW,
  PROBLEMDETAILRESET
} from '../actionTypes'

export const problemListAction = data => {
  const list = _.map(data, v => ({
    requirementName: v.conIndicatorsRequirement.name,
    subProjectName: v.conRoadSection.subProject.subProjectName,
    fileToken: v.fileToken,
    id: v.id,
    latitude: v.latitude,
    longitude: v.longitude,
    happenTime: v.happenTime,
    problemDescription: v.problemDescription,
    pfUser: v.user.realName
  }))
  return { type: PROBLEMQUEST, data: list }
}

export const problemLoadAction = data => {
  return { type: PROBLEMLOAD, data }
}

export const problemSelectIdAction = data => {
  return { type: PROBLEMSELECTID, data }
}

// 删除选择的问题
export const problemDelConfrimAction = data => {
  return { type: PROBLEMDELCONFRIM, data }
}

export const problemLoadRest = data => {
  return { type: PROBLEMLOADRESET, data }
}

export const problemListModelAction = data => {
  return { type: PROBLEMLISTMODEL, data }
}

export const problemDetailToShowAction = data => {
  return { type: PROBLEMDETAILTOSHOW, data }
}

export const problemDetailResetAction = data => {
  return { type: PROBLEMDETAILRESET, data }
}
