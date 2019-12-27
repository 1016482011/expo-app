import React, { Component } from 'react'
import { StyleSheet, Modal, StatusBar } from 'react-native'
import Image from 'react-native-image-progress'
import { Container, View, Content, Text } from 'native-base'
import { connect } from 'react-redux'
import Placeholder from 'rn-placeholder'
import ImageViewer from 'react-native-image-zoom-viewer'
import _ from 'lodash'
import Header from '../../components/Header'
import { TextItem } from '../../components/FormItems'
import TouchFeedback from '../../components/TouchFeedback'
import { problemDetailAction } from '../../store/actions/requestAction'
import { problemDetailResetAction } from '../../store/actions/problemAction'
import { showToast } from '../../helper/util'

class ProblemDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Header
          title={'问题详情'}
          leftIcon={'angle-left'}
          onBackPress={() => navigation.goBack()}
        />
      ),
      headerStyle: {
        backgroundColor: '#3781C6'
      }
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      imagesIndex: 0
    }
  }
  componentDidMount() {
    this.props.problemDetailAction()
  }
  componentWillUnmount() {
    this.props.problemDetailResetAction()
  }
  onBack = () => {
    this.setState({ visible: false })
  }
  _imgView = index => () => {
    this.setState({
      imagesIndex: index,
      visible: true
    })
  }
  render() {
    const { visible, imagesIndex } = this.state
    const {
      problemDatil: {
        requirementName,
        subProjectName,
        latitude,
        longitude,
        problemDescription,
        firstIndicator,
        secondIndicator,
        thridIndicator,
        pfUser,
        imgs
      }
    } = this.props.problemData
    const images = _.map(imgs, v => ({ url: v.downloadUrl }))
    return (
      <Container>
        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={this.onBack}
        >
          <ImageViewer
            imageUrls={images}
            index={imagesIndex}
            saveToLocalByLongPress={false}
          />
        </Modal>
        <Content style={{ backgroundColor: '#F5F5F9' }}>
          <Placeholder.Paragraph
            lineNumber={8}
            textSize={40}
            lineSpacing={5}
            color="#fff"
            animate="fade"
            width="100%"
            lastLineWidth="100%"
            firstLineWidth="100%"
            onReady={true}
          >
            <View style={{ backgroundColor: '#fff', paddingBottom: 20 }}>
              <TextItem
                color={'#333'}
                label={'专家:'}
                rightText={pfUser}
                numberOfLines={1}
              />
              <TextItem
                color={'#333'}
                label={'地理位置:'}
                rightText={`经度--${_.isNil(longitude) ? 0 : longitude} 纬度--${
                  _.isNil(latitude) ? 0 : latitude
                }`}
                numberOfLines={1}
              />
              <TextItem
                color={'#333'}
                label={'问题所属子项目:'}
                rightText={subProjectName}
                numberOfLines={1}
              />
              {firstIndicator && (
                <TextItem
                  color={'#333'}
                  label={'一级指标:'}
                  rightText={firstIndicator.name}
                  numberOfLines={1}
                />
              )}
              {secondIndicator && (
                <TextItem
                  color={'#333'}
                  label={'二级指标:'}
                  rightText={secondIndicator.name}
                  numberOfLines={1}
                />
              )}
              {thridIndicator && (
                <TextItem
                  color={'#333'}
                  label={'三级指标:'}
                  rightText={thridIndicator.name}
                  numberOfLines={1}
                />
              )}
              <TextItem
                color={'#333'}
                label={'指标要求:'}
                rightText={requirementName}
              />
              <TextItem
                color={'#333'}
                label={'问题描述:'}
                rightText={problemDescription}
              />
              {!_.isEmpty(imgs) && (
                <View style={styles.flexRow}>
                  <Text style={styles.flexRowLeft}>图片: </Text>
                  <View style={styles.flexRowRight}>
                    {imgs.map((v, index) => (
                      <TouchFeedback
                        key={index}
                        style={styles.imgList}
                        onPress={this._imgView(index)}
                      >
                        <Image
                          style={{
                            resizeMode: 'contain',
                            width: '100%',
                            height: 50
                          }}
                          onError={e => {
                            showToast('图片加载错误!')
                            console.log(e)
                          }}
                          source={{
                            uri: v.downloadUrl
                          }}
                        />
                      </TouchFeedback>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </Placeholder.Paragraph>
        </Content>
      </Container>
    )
  }
}

export default connect(
  state => ({
    problemData: state.problem
  }),
  { problemDetailAction, problemDetailResetAction }
)(ProblemDetail)

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  flexRowLeft: { width: 80 },
  flexRowRight: { flex: 1, flexDirection: 'row' },
  imgList: {
    width: '30%',
    height: 50,
    marginRight: '3%'
  }
})
