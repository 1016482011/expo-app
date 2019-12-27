import { GraphQLClient } from 'graphql-request'
import { AsyncStorage } from 'react-native'
import { delayPromise } from './util'
let TOKEN = false

const getHeaders = () => {
  if (!TOKEN) {
    TOKEN =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamVmMWNraHEwMDAyMDE0OHE4ZWFib3FlIiwiaWF0IjoxNTIwMzIwMjc1fQ.qQkOpXvr7jTbTC7EymSIH7Ky5jGpJJe_sRdA4iWDjT8'
  }

  return {
    Authorization: `Bearer ${TOKEN}`
  }
}

const getClient = endpoint =>
  new GraphQLClient(endpoint, {
    headers: getHeaders()
  })

// 修改token
export const TokenModify = v => {
  AsyncStorage.setItem('token', v)
  TOKEN = v
}

//发送请求
export const request = (endpoint, res) => {
  return new Promise.race([
    delayPromise(10000),
    new Promise((resolve, reject) => {
      return getClient(endpoint)
        .request(res)
        .then(data => {
          resolve({ code: 1, result: data, msg: '请求成功' })
        })
        .catch(e => {
          reject({ code: 0, msg: '网络错误', error: e })
        })
    })
  ])
}
