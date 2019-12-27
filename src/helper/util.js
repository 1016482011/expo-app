import { Toast } from 'native-base'
import { Location, Permissions, ImagePicker } from 'expo'
import _ from 'lodash'

// nativebase错误提示
export const toastTip = (text, type) => {
  Toast.show({
    text: text,
    buttonText: '确认',
    type: type || 'success',
    duration: 3000
  })
}

// 获取地理位置
export const getLocation = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION)
  if (status !== 'granted') {
    console.log('Permission to access location was denied')
    return false
  }
  let location = await Location.getCurrentPositionAsync({
    enableHighAccuracy: true
  })
  return location
}

// 相册选择照片
export const getImageLibrary = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'Images',
    quality: 0.1,
    allowsEditing: true,
    aspect: [4, 3]
  })
  return result
}

// 拍照
export const getCamera = async () => {
  let { status } = await Permissions.askAsync(Permissions.CAMERA)
  let { status: rollStatus } = await Permissions.askAsync(
    Permissions.CAMERA_ROLL
  )
  if (status !== 'granted' || rollStatus !== 'granted') {
    console.log('Permission to access location was denied')
    return false
  }
  let result = await ImagePicker.launchCameraAsync({
    quality: 0.1,
    allowsEditing: true,
    aspect: [4, 3]
  })
  return result
}

// promise超时处理
export const delayPromise = ms => {
  return new Promise((resolve, reject) => {
    setTimeout(reject, ms, { code: 2, msg: '连接超时' })
  })
}

// 得到本地文件的blob数据
export const getBlob = uri =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function() {
      resolve(xhr.response)
    }
    xhr.onerror = function() {
      reject(new TypeError('Network request failed'))
    }
    xhr.responseType = 'blob'
    xhr.open('GET', uri, true)
    xhr.send(null)
  })
