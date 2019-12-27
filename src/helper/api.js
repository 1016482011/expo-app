import { AsyncStorage } from 'react-native'
import _ from 'lodash'
import { request } from './client'

let DOMAIN = null

AsyncStorage.getItem('domain').then(v => {
  if (v) {
    DOMAIN = v
  }
})

const ModifyServer = domainServer => {
  AsyncStorage.setItem('domain', domainServer)
  DOMAIN = domainServer
}

export { DOMAIN, ModifyServer }

// 登录
export const LoginReq = (userName, userPwd) => {
  return new Promise((resolve, reject) => {
    request(
      DOMAIN,
      `
        mutation{
            login(userName:"${userName}",userPwd:"${userPwd}"){
              token
            }
        }
      `
    )
      .then(v => {
        resolve(v)
      })
      .catch(e => {
        reject({ code: 5, msg: '用户名密码错误', result: e })
      })
  })
}

// 查询项目
export const ProjectQuery = () => {
  return request(
    DOMAIN,
    `
    query{
      projectInfoes{
        id
        proName
        assConstructionAsses(orderBy:createdAt_DESC) {
          assStatus
          id
        }
      }
      currentUser {
        pfRoles{
          projectInfo{
            id
          }
        }
      }
    }    
    `
  )
}

// 查询指定项目下的所有指标
export const ConIndicatorScoresQuery = id => {
  return request(
    DOMAIN,
    `
    query {
      assConstructionAsses(where:{id: "${id}"}){
        conIndicatorScores{
          name
          id
          upIndicatorId
        }
      }
    }
    `
  )
}

// 查询项目下的所有问题
export const AssProblemsQuery = proId => {
  return request(
    DOMAIN,
    `
    query {
      assProblems(where:{assConstructionAsse:{id:"${proId}"}},orderBy:updatedAt_DESC) {
        happenTime
        id
        fileToken
        latitude
        longitude
        problemDescription
        user {
          realName
        }
        conIndicatorsRequirement {
          name
        }
        conRoadSection {
          subProject {
            id
            subProjectName
          }
        }
      }
    }
    
    `
  )
}

// 请求问题图片
export const AssProblemsImgQuery = fileToken => {
  return request(
    DOMAIN,
    `
    query {
      cosFiles(prefix: "${fileToken}") {
        downloadUrl,
        deleteUrl
      }
    }    
    `
  )
}

// 用户信息
export const UserInfoQuery = () => {
  return request(
    DOMAIN,
    `
    query{
      currentUser{
        id,
        realName,
        userName,
        userSex,
        userUnit,
        userPhone
      }
    }
    `
  )
}

// 提交问题
export const createAssProblem = data => {
  return request(
    DOMAIN,
    `
    mutation {
      createAssProblem(
        data: {
          user: { connect: { id: "${data.user}" } }
          problemDescription: ${JSON.stringify(data.problemDescription)}
          problemStatus: "0"
          latitude: ${data.latitude},
          longitude: ${data.longitude},
          assConstructionAsse:{connect:{id:"${data.assConstructionAsse}"}},
          conIndicatorsRequirement: {connect:{id:"${
            data.conIndicatorsRequirement
          }"}},
          conRoadSection:{connect:{id:"${data.conRoadSection}"}},
          happenTime: ${data.happenTime}
        }
      ) {
        id
      }
    }
  `
  )
}

// 编辑问题
export const UpdateAssProblem = (id, data) => {
  return request(
    DOMAIN,
    `
    mutation {
      updateAssProblem(where:{id:"${id}"}, data:${JSON.stringify(data).replace(
      /\"([^(\")"]+)\":/g,
      '$1:'
    )}){
        id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      }
    }
  `
  )
}

// 查取指定考核下的专家
export const assReviewGroups = id => {
  return request(
    DOMAIN,
    `
    query {
      assConstructionAsses(where:{id: "${id}"}){
        assReviewGroups{
          user{
            realName
            id
          }
        }
      }
    }
  `
  )
}

// 查取指定项目下的子项目
export const subProjects = id => {
  return request(
    DOMAIN,
    `
    query {
      projectInfoes(where: { id: "${id}" }) {
        subProjects {
          subProjectName
          conRoadSections {
            id
          }
        }
      }
    }
  `
  )
}

// 查取指定指标下的指标要求
export const conIndicatorsRequirementsQuery = id => {
  return request(
    DOMAIN,
    `
    query {
      conIndicatorScores(where: { id: "${id}" }) {
        conIndicatorsRequirements {
          id
          name
        }
      }
    }
    
    `
  )
}

// 删除问题
export const DeleteAssProblem = id => {
  return request(
    DOMAIN,
    `
    mutation {
      deleteAssProblem(where: { id: "${id}" }) {
        id
      }
    }
    `
  )
}

// 查询指定id问题
export const QueryAssProblemById = id => {
  return request(
    DOMAIN,
    `
    query {
      assProblems(where: { id: "${id}" }) {
        fileToken
        problemDescription
        latitude
        longitude
        user {
          id
          realName
        }
        conIndicatorsRequirement {
          id
          name
        }
        conRoadSection {
          subProject {
            id
            subProjectName
          }
        }
      }
    }
    `
  )
}

// 查询指定id指标要求下的第一级指标
export const QueryIndicatorsById = id => {
  return request(
    DOMAIN,
    `
    query{
      conIndicatorsRequirement(where:{id:"${id}"}){
        conIndicatorScores{
          id
          name
          upIndicatorId
        }
      }
    }
    `
  )
}

// 查询指定id的指标
export const QueryconIndicatorScores = id => {
  return request(
    DOMAIN,
    `
    query{
      conIndicatorScores(where:{id: "${id}"}){
        id,
        name,
        upIndicatorId
      }
    }
    `
  )
}

// 取得上传文件地址
export const GetUploadUrl = (problemId, fileName) => {
  return request(
    DOMAIN,
    `
    query {
      getUploadUrl(key:"AssessQuestionEntry/${problemId}/${fileName}"){
        url
      }
    }
    `
  )
}

// 更新文件token
export const UpdateProblemFileToken = id => {
  return request(
    DOMAIN,
    `
    mutation{
      updateAssProblem(where:{id:"${id}"},data:{fileToken:"AssessQuestionEntry/${id}"}){
        id
      }
    }
    `
  )
}

// 上传文件
export const UpLoadFile = (url, blob) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'PUT',
      body: blob
    })
      .then(v => {
        resolve(v)
      })
      .catch(e => {
        reject({ code: 3, msg: '图片上传错误', result: e })
      })
  })
}

// 删除文件
export const DelFile = url => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'DELETE'
    })
      .then(v => {
        resolve(v)
      })
      .catch(e => {
        reject({ code: 4, msg: '图片删除错误', result: e })
      })
  })
}
