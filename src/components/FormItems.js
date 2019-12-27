import React from 'react'
import { Modal } from 'react-native'
import { Text, View, Textarea, ActionSheet as NBActionSheet } from 'native-base'
import Image from 'react-native-image-progress'
import { Divider } from 'react-native-elements'
import ActionSheet from 'react-native-actionsheet'
import ImageViewer from 'react-native-image-zoom-viewer'
import _ from 'lodash'
import { Feather } from '@expo/vector-icons'
import TouchFeedback from './TouchFeedback'
import { getImageLibrary, getCamera, showToast } from '../helper/util'

// 点击选择
export const SelectItem = props => {
  const { label, rightText, error, errorTip } = props
  return (
    <View>
      <TouchFeedback
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20
        }}
        onPress={() => props.onPress()}
      >
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <Text style={{ fontSize: 18, lineHeight: 42 }}>{label}</Text>
          <Text style={{ color: '#FF0000', lineHeight: 42 }}>*</Text>
          <Text style={{ lineHeight: 42 }}>:</Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 5
          }}
        >
          {error ? (
            <Text style={{ fontSize: 18, lineHeight: 42, color: '#FF0000' }}>
              {errorTip || '请选择'}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 18,
                lineHeight: 24,
                color: errorTip === rightText ? '#ccc' : '#000'
              }}
              numberOfLines={1}
            >
              {rightText}
            </Text>
          )}
        </View>
      </TouchFeedback>
      <Divider style={{ backgroundColor: error ? '#FF0000' : '#E4E4E4' }} />
    </View>
  )
}

// 单行展示list
export const TextItem = props => {
  const { color, label, rightText, numberOfLines } = props
  return (
    <View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 10
        }}
      >
        <View>
          <Text style={{ fontSize: 18, color }}>{label}</Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 5 }}>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 24,
              color
            }}
            numberOfLines={numberOfLines ? numberOfLines : 9}
          >
            {_.isNil(rightText) || rightText === 'null' ? '' : rightText}
          </Text>
        </View>
      </View>
      <Divider style={{ backgroundColor: '#E4E4E4' }} />
    </View>
  )
}

// 多行输入文本
export const TextareaItem = props => {
  const { label, placeholder, value } = props
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 5,
          height: 54
        }}
      >
        <Text style={{ fontSize: 18, lineHeight: 24 }}>{label}</Text>
        <View style={{ flex: 1, paddingHorizontal: 5 }}>
          <Textarea
            rowSpan={2}
            placeholder={placeholder}
            value={value}
            style={{ fontSize: 18 }}
            onChangeText={v => props.onChangeText(v)}
          />
        </View>
      </View>
      <Divider style={{ backgroundColor: '#E4E4E4' }} />
    </View>
  )
}

// 图片添加(最多3张)
export class ImgItem extends React.Component {
  constructor(props) {
    super(props)
    this.photoSelect = null
    this.state = {
      visible: false,
      images: [],
      index: 0
    }
  }

  _photoSelect = (url, index) => () => {
    const { files } = this.props
    this.photoSelect = url
    this.setState({ images: _.map(files, v => ({ url: v })), index })
    this.ActionSheet.show()
  }
  _confirm = index => {
    if (index === 0) this.setState({ visible: true })
    if (index === 1) this.props.onImgDel(this.photoSelect)
  }
  _takePhoto = () => {
    const { files } = this.props
    if (files.length > 2) return false
    NBActionSheet.show(
      {
        options: ['相册', '拍照'],
        title: '请选择模式'
      },
      index => {
        if (index === 0) {
          getImageLibrary().then(v => {
            if (v.uri) this.props.onImgAdd(v.uri)
          })
        }
        if (index === 1) {
          getCamera().then(v => {
            if (v.uri) this.props.onImgAdd(v.uri)
          })
        }
      }
    )
  }

  onBack = () => {
    this.setState({ visible: false })
  }

  render() {
    const props = this.props
    const { label, files } = props
    const { visible, images, index } = this.state
    return (
      <View>
        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={this.onBack}
        >
          <ImageViewer
            imageUrls={images}
            index={index}
            saveToLocalByLongPress={false}
          />
        </Modal>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'请选择你的操作'}
          options={['查看', '删除', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this._confirm}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 15
          }}
        >
          <Text style={{ fontSize: 18, lineHeight: 24 }}>{label}</Text>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 5,
              flexDirection: 'row'
            }}
          >
            {files.map((v, index) => (
              <TouchFeedback
                key={index}
                style={{
                  width: '23%',
                  height: 60,
                  marginRight: '2%'
                }}
                onPress={this._photoSelect(v, index)}
              >
                <Image
                  style={{ flex: 1, resizeMode: 'cover' }}
                  source={{
                    uri: v
                  }}
                  onError={e => {
                    showToast('图片加载错误!')
                    console.log(e)
                  }}
                />
              </TouchFeedback>
            ))}
            {files.length === 0 && (
              <TouchFeedback
                style={{
                  width: '23%',
                  height: 60,
                  marginRight: '2%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 0.8,
                  borderColor: '#D9D9D9',
                  borderStyle: 'dashed',
                  borderRadius: 0.1
                }}
                onPress={this._takePhoto}
              >
                <Feather name={'camera'} size={30} color={'#D9D9D9'} />
                <Text style={{ color: '#D9D9D9', fontSize: 12 }}>添加图片</Text>
              </TouchFeedback>
            )}
            {files.length > 0 && files.length < 3 && (
              <TouchFeedback
                style={{
                  width: '23%',
                  height: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 0.8,
                  borderColor: '#D9D9D9',
                  borderStyle: 'dashed',
                  borderRadius: 0.1
                }}
                onPress={this._takePhoto}
              >
                <Feather name={'camera'} size={30} color={'#D9D9D9'} />
                <Text style={{ color: '#D9D9D9', fontSize: 12 }}>
                  {files.length}/3
                </Text>
              </TouchFeedback>
            )}
          </View>
        </View>
      </View>
    )
  }
}
