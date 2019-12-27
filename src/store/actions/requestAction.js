import _ from 'lodash'
import * as request from '../../helper/wrapperApi'
import navigationService from '../../navigation/NavigationService'
import { proSelectAction, projectAssessmentAction } from './projectAction'
import { userDataInfoAddAction } from './userDataAction'
import { screeUpdateAcion } from './screenAction'
import {
  problemListAction,
  problemLoadAction,
  problemDelConfrimAction,
  problemDetailToShowAction
} from './problemAction'
import { showToast } from '../../helper/toast'
import {
  UserInfoQuery,
  AssProblemsQuery,
  DeleteAssProblem,
  conIndicatorsRequirementsQuery
} from '../../helper/api'

export const errorToast = e => {
  console.log(e)
  _.isNil(e.code) ? showToast('数据处理错误') : showToast(e.msg)
}

// 登录
export const loginAction = ({ userName, password, navigation }) => dispatch => {
  dispatch(screeUpdateAcion({ loginIsSubmit: true }))
  request
    .LoginApi(userName, password)
    .then(v => {
      dispatch(screeUpdateAcion({ loginIsSubmit: false }))
      const { projectInfo, userInfo } = v
      const proLen = projectInfo.length
      dispatch(userDataInfoAddAction(userInfo))
      if (proLen === 0) {
        showToast('暂无考核项目')
      } else if (proLen === 1) {
        dispatch(proSelectAction(projectInfo[0]))
        navigation.replace('Home')
      } else {
        dispatch(projectAssessmentAction(projectInfo))
        navigation.replace('Project')
      }
    })
    .catch(e => {
      dispatch(screeUpdateAcion({ loginIsSubmit: false }))
      errorToast(e)
    })
}

// 切换项目时确认项目信息
export const projectInfoAction = () => dispatch => {
  request
    .ProjectQueryApi()
    .then(v => {
      const proLen = v.length
      if (proLen === 0) {
        showToast('当前项目考核已失效')
        navigationService.navigate('Login')
      } else if (proLen === 1) {
        showToast('项目已切换')
        dispatch(proSelectAction(v[0]))
        navigationService.navigate('ProListStack')
      } else {
        dispatch(projectAssessmentAction(v))
        navigationService.navigate('Project')
      }
    })
    .catch(e => {
      errorToast(e)
    })
}

// 请求用户信息
export const userDataInfoAction = data => dispatch => {
  return UserInfoQuery()
    .then(v => {
      dispatch(userDataInfoAddAction(v.result.currentUser))
    })
    .catch(e => {
      errorToast(e)
    })
}

// 请求问题列表
export const problemQuestAction = id => {
  return function(dispatch) {
    dispatch(problemLoadAction(false))
    return AssProblemsQuery(id)
      .then(v => {
        dispatch(problemListAction(v.result.assProblems))
        dispatch(problemLoadAction(true))
      })
      .catch(e => {
        errorToast(e)
        dispatch(problemLoadAction(true))
      })
  }
}

// 检查当前项目是否尚在考核
export const projectCheckAction = data => async (dispatch, getState) => {
  try {
    const state = getState()
    const {
      project: { projectSelect }
    } = state
    const project = await request.ProjectQueryApi()
    const projectSelected = _.find(project, { id: projectSelect.id })
    return (
      project.length > 0 &&
      projectSelected.assConstructionAsses[0].id ===
        projectSelect.assConstructionAsses[0].id
    )
  } catch (e) {
    console.log(e)
    showToast('项目校验错误')
    navigationService.navigate('Login')
    return false
  }
}

// 删除问题
export const problemDelMutationAction = () => (dispatch, getState) => {
  const state = getState()
  const {
    problem: { proToSelectId }
  } = state
  dispatch(projectCheckAction()).then(val => {
    if (!val) return false
    DeleteAssProblem(proToSelectId)
      .then(v => {
        showToast('删除成功')
        dispatch(problemDelConfrimAction(proToSelectId))
      })
      .catch(e => {
        errorToast(e)
      })
  })
}

// 查看问题
export const problemDetailAction = () => (dispatch, getState) => {
  const state = getState()
  const {
    problem: { proToSelectId }
  } = state
  request
    .ProblemDtailApi(proToSelectId)
    .then(data => {
      dispatch(problemDetailToShowAction(data))
    })
    .catch(e => {
      errorToast(e)
    })
}

// 新增问题前置查询
export const problemAddPreDataAction = () => (dispatch, getState) => {
  const state = getState()
  const {
    project: { projectSelect }
  } = state
  const assConstructionAssesId = projectSelect.assConstructionAsses[0].id
  return new Promise((resolve, reject) => {
    request
      .problemAddPreDataApi(projectSelect.id, assConstructionAssesId)
      .then(v => {
        resolve(v)
      })
      .catch(e => {
        reject(false)
        errorToast(e)
      })
  })
}

// 查询指标要求
export const conIndicatorsQueryAction = id => async (dispatch, getState) => {
  const conIndicatorsRequirementsResult = await conIndicatorsRequirementsQuery(
    id
  )
  const conIndicatorsRequirementsData =
    conIndicatorsRequirementsResult.result.conIndicatorScores[0]
      .conIndicatorsRequirements
  const text = _.map(conIndicatorsRequirementsData, 'name')
  const value = _.map(conIndicatorsRequirementsData, 'id')
  return {
    text,
    value
  }
}

// 提交问题
export const problemSubmitAction = (param, imgPicked) => async (
  dispatch,
  getState
) => {
  dispatch(projectCheckAction()).then(val => {
    if (!val) return false
    dispatch(screeUpdateAcion({ problemAddIsSubmit: true }))
    request
      .problemSubmitApi(param, imgPicked)
      .then(v => {
        dispatch(screeUpdateAcion({ problemAddIsSubmit: false }))
        navigationService.navigate('MiddlePageResult')
      })
      .catch(e => {
        dispatch(screeUpdateAcion({ problemAddIsSubmit: false }))
        errorToast(e)
      })
  })
}

// 问题编辑提交
export const problemEditAction = (
  param,
  imgFileToUploadUrls,
  imgFileDelUrls
) => async (dispatch, getState) => {
  const state = getState()
  const {
    problem: { proToSelectId }
  } = state
  dispatch(projectCheckAction()).then(val => {
    if (!val) return false
    dispatch(screeUpdateAcion({ problemAddIsSubmit: true }))
    request
      .problemEditApi(proToSelectId, param, imgFileToUploadUrls, imgFileDelUrls)
      .then(v => {
        dispatch(screeUpdateAcion({ problemAddIsSubmit: false }))
        navigationService.navigate('MiddlePageResult')
      })
      .catch(e => {
        dispatch(screeUpdateAcion({ problemAddIsSubmit: false }))
        errorToast(e)
      })
  })
}
