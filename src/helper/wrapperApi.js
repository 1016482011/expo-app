import _ from 'lodash'
import { TokenModify } from './client'
import * as request from './api'
import { getBlob } from './util'

// 查询此用户拥有权限项目以及存在考核的项目信息
export const ProjectQueryApi = async () => {
  const projectQueryResult = await request.ProjectQuery()
  const {
    projectInfoes,
    currentUser: { pfRoles }
  } = projectQueryResult.result
  // 过滤掉此用户无权限的项目
  let projectInfoesFilter = projectInfoes
  if (_.isNull(pfRoles[0].projectInfo)) {
    projectInfoesFilter = []
  } else {
    const pfProjectInfo = _.map(pfRoles, v => v.projectInfo.id)
    projectInfoesFilter = _.filter(
      projectInfoes,
      v => _.indexOf(pfProjectInfo, v.id) > -1
    )
  }
  // 过滤掉无考核的项目
  return _.filter(projectInfoesFilter, v => {
    return (
      v.assConstructionAsses.length !== 0 &&
      (v.assConstructionAsses[0].assStatus === 'AssStatus001' ||
        v.assConstructionAsses[0].assStatus === 'AssStatus002')
    )
  })
}

// 登录
export const LoginApi = async (userName, userPwd) => {
  // 登录
  const loginReqResult = await request.LoginReq(userName, userPwd)
  TokenModify(loginReqResult.result.login.token)
  // 请求个人信息
  const userInfoQueryResult = await request.UserInfoQuery()
  // 请求项目信息
  const projectQueryApiResult = await ProjectQueryApi()
  return {
    userInfo: userInfoQueryResult.result.currentUser,
    projectInfo: projectQueryApiResult
  }
}

// 查询问题详情
export const ProblemDtailApi = async id => {
  // 查询问题
  const assProblemsResult = await request.QueryAssProblemById(id)
  const data = assProblemsResult.result.assProblems[0]
  const requirementId = data.conIndicatorsRequirement.id
  let problemData = {
    requirementName: data.conIndicatorsRequirement.name,
    subProjectName: data.conRoadSection.subProject.subProjectName,
    requirementId,
    latitude: data.latitude,
    longitude: data.longitude,
    happenTime: data.happenTime,
    problemDescription: data.problemDescription,
    pfUser: data.user.realName
  }
  // 查询图片
  const imgQueryResult = await request.AssProblemsImgQuery(data.fileToken)
  if (!_.isEmpty(imgQueryResult.result.cosFiles)) {
    problemData.imgs = imgQueryResult.result.cosFiles
  }
  // 查询指标
  let indicatorsArr = []
  let indicatorsResult = await request.QueryIndicatorsById(requirementId)
  let {
    name,
    upIndicatorId,
    id: conId
  } = indicatorsResult.result.conIndicatorsRequirement.conIndicatorScores[0]
  indicatorsArr.push({ name, conId })
  if (_.isEmpty(upIndicatorId)) return indicatorsArr
  async function queryIndicator(id) {
    if (_.isEmpty(id)) return indicatorsArr
    let queryIndicatorsResult = await request.QueryconIndicatorScores(id)
    let {
      name,
      upIndicatorId,
      id: conId
    } = queryIndicatorsResult.result.conIndicatorScores[0]
    indicatorsArr.push({ name, conId })
    return await queryIndicator(upIndicatorId)
  }
  const upIndicatorIdResult = await queryIndicator(upIndicatorId)
  const arr = _.reverse(upIndicatorIdResult)
  problemData.indicators = arr
  problemData = _.assign({}, problemData, {
    firstIndicator: arr[0],
    secondIndicator: arr[1],
    thridIndicator: arr[2]
  })

  return problemData
}

// 录问题前置数据查询
export const problemAddPreDataApi = async (projectId, assesId) => {
  // 获取评审专家
  const assReviewGroupsResult = await request.assReviewGroups(assesId)
  const users =
    assReviewGroupsResult.result.assConstructionAsses[0].assReviewGroups
  // 获取子项目
  const subProjectResult = await request.subProjects(projectId)
  const subProjectData = subProjectResult.result.projectInfoes[0].subProjects
  // 获取考核下所有指标
  const conIndicatorScoresResult = await request.ConIndicatorScoresQuery(
    assesId
  )
  const conIndicatorScoresData =
    conIndicatorScoresResult.result.assConstructionAsses[0].conIndicatorScores
  return {
    assesId,
    users: {
      text: _.map(users, v => v.user.realName),
      value: _.map(users, v => v.user.id)
    },
    subProjectData: {
      text: _.map(subProjectData, 'subProjectName'),
      value: _.map(subProjectData, v => v.conRoadSections[0].id)
    },
    conIndicatorScoresData
  }
}

// 提交问题录入
export const problemSubmitApi = async (param, imgPicked) => {
  const createAssProblemResult = await request.createAssProblem(param)
  const { id } = createAssProblemResult.result.createAssProblem
  await request.UpdateProblemFileToken(id)
  const upload = async index => {
    if (index >= imgPicked.length) return index
    const file = _.last(_.split(imgPicked[index], '/'))
    const upUrl = await request.GetUploadUrl(id, file)
    const blob = await getBlob(imgPicked[index])
    await request.UpLoadFile(upUrl.result.getUploadUrl.url, blob)
    return await upload(++index)
  }
  await upload(0)
}

// 提交问题编辑
export const problemEditApi = async (id, param, imgToUp, imgToDel) => {
  const updateAssProblem = await request.UpdateAssProblem(id, param)
  const delImg = async index => {
    if (index >= imgToDel.length) return index
    const uploadResult = await request.DelFile(imgToDel[index])
    return await delImg(++index)
  }
  await delImg(0)
  const upload = async index => {
    if (index >= imgToUp.length) return index
    const file = _.last(_.split(imgToUp[index], '/'))
    const upUrl = await request.GetUploadUrl(id, file)
    const blob = await getBlob(imgToUp[index])
    await request.UpLoadFile(upUrl.result.getUploadUrl.url, blob)
    return await upload(++index)
  }
  await upload(0)
}
