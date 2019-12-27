import React, { Component } from 'react'
import { WebView, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Container } from 'native-base'
import ActionSheet from 'react-native-actionsheet'
import { getLocation } from '../../../helper/util'
import {
  problemSelectIdAction,
  problemDelConfrimAction
} from '../../../store/actions/problemAction'
import { problemDelMutationAction } from '../../../store/actions/requestAction'

const html = require('../../../../assets/html/map.html')

class ProMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: [116.405467, 39.907761]
    }
  }
  componentDidMount() {
    getLocation().then(v => {
      const { latitude, longitude } = v.coords
      this.setState({ location: [longitude, latitude] })
    })
  }

  _htmlLoad = () => {
    const { location } = this.state
    const {
      problemData: { proList }
    } = this.props
    this.refs.webView.postMessage(
      JSON.stringify({
        location,
        proList
      })
    )
  }

  _htmlMessage = e => {
    const { problemSelectIdAction } = this.props
    const data = JSON.parse(e.nativeEvent.data)
    problemSelectIdAction(data.id)
    this.ActionSheet.show()
  }

  _confirm = index => {
    const { problemDelMutationAction, navigation } = this.props
    if (index === 0) navigation.navigate('ReadProblemDetail')
    if (index === 1) navigation.navigate('ProblemEdit')
    if (index === 2) {
      Alert.alert(
        '警告',
        '删除后不可恢复，是否进行删除操作？',
        [
          { text: '否', onPress: () => {}, style: 'cancel' },
          {
            text: '是',
            onPress: () => problemDelMutationAction()
          }
        ],
        { cancelable: false }
      )
    }
  }

  render() {
    return (
      <Container>
        <WebView
          ref="webView"
          source={{ uri: 'http://111.231.56.231/html/map.html' }}
          //   source={html}
          style={{ flex: 1 }}
          onLoad={this._htmlLoad}
          onMessage={this._htmlMessage}
        />
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'请选择你的操作'}
          options={['查看', '编辑', '删除', '取消']}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={this._confirm}
        />
      </Container>
    )
  }
}

export default connect(
  state => ({
    projectData: state.project,
    problemData: state.problem
  }),
  {
    problemSelectIdAction,
    problemDelConfrimAction,
    problemDelMutationAction
  }
)(ProMap)
