import _ from 'lodash'
import {
  RESET,
  PROBLEMQUEST,
  PROBLEMLOAD,
  PROBLEMSELECTID,
  PROBLEMDELCONFRIM,
  PROBLEMLOADRESET,
  PROBLEMLISTMODEL,
  PROBLEMDETAILTOSHOW,
  PROBLEMDETAILRESET
} from '../actionTypes'

/**
 * 问题数据
 */
const initialState = {
  proList: [],
  isProReady: false,
  proToSelectId: null,
  listModel: true,
  // 单条问题详情页数据
  problemDatil: {
    requirementName: null,
    subProjectName: null,
    latitude: null,
    longitude: null,
    firstIndicator: null,
    secondIndicator: null,
    thridIndicator: null,
    problemDescription: null,
    pfUser: null,
    imgs: []
  }
}

export default function problem(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case PROBLEMDETAILRESET:
      const initialproblemDatil = _.assign(
        {},
        state.problemDatil,
        initialState.problemDatil
      )
      return _.assign({}, state, { problemDatil: initialproblemDatil })
    case PROBLEMDETAILTOSHOW:
      const problemDatil = _.assign({}, state.problemDatil, data)
      return _.assign({}, state, { problemDatil })
    case PROBLEMLOADRESET:
      return _.assign({}, state, { isProReady: true })
    case PROBLEMQUEST:
      return _.assign({}, state, { proList: data })
    case PROBLEMDELCONFRIM:
      const { proList, proToSelectId } = state
      const filterList = _.filter(proList, v => v.id !== proToSelectId)
      return _.assign({}, state, { proList: filterList })
    case PROBLEMSELECTID:
      return _.assign({}, state, { proToSelectId: data })
    case PROBLEMLOAD:
      return _.assign({}, state, { isProReady: data })
    case PROBLEMLISTMODEL:
      return _.assign({}, state, { listModel: !state.listModel })
    case RESET:
      return initialState
    default:
      return state
  }
}
