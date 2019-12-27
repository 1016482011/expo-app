import React, { Component } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Container, View, Content, ActionSheet } from 'native-base'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Divider } from 'react-native-elements'
import Placeholder from 'rn-placeholder'
import {
  SelectItem,
  TextareaItem,
  ImgItem,
  TextItem
} from '../../components/FormItems'
import FullButton from '../../components/FullButton'
import Header from '../../components/Header'
import { getLocation } from '../../helper/util'
import { projectCheckAction } from '../../store/actions/projectAction'
import {
  problemAddPreDataAction,
  conIndicatorsQueryAction,
  problemSubmitAction
} from '../../store/actions/requestAction'
import { showToast } from '../../helper/toast'

const form = {
  user: null,
  problemDescription: null,
  latitude: null,
  longitude: null,
  assConstructionAsse: null,
  conIndicatorsRequirement: null,
  happenTime: null,
  conRoadSection: null
}

class ProAdd extends Component {
  static navigationOptions = {
    headerTitle: <Header title={'录入问题'} leftIcon={null} />,
    headerStyle: {
      backgroundColor: '#3781C6'
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      user: '请选择专家',
      problemDescription: null,
      latitude: '0',
      longitude: '0',
      conIndicatorsRequirement: null,
      subProject: '请选择子项目',
      firstIndicator: '请选择一级指标',
      secondIndicator: null,
      thridIndicator: null,
      imgPicked: [],
      userError: false,
      subProjectError: false,
      firstIndicatorError: false,
      secondIndicatorError: false,
      thridIndicatorError: false,
      conIndicatorsRequirementError: false,
      isReady: false
    }
    this.$data = {}
  }
  componentDidMount() {
    this.$data.form = _.assign({}, {}, form)
    const { data, isEdit } = this.props
    // 编辑页面填充数据
    if (isEdit) {
      this.setState({
        user: data.pfUser,
        problemDescription: data.problemDescription,
        conIndicatorsRequirement: data.requirementName,
        subProject: data.subProjectName,
        firstIndicator: data.firstIndicator,
        secondIndicator: data.secondIndicator,
        thridIndicator: data.thridIndicator,
        imgPicked: data.imgsExist
      })
      this.$data.indicatorSelect = _.last(data.indicators).conId
      this.$data.form.conIndicatorsRequirement = data.requirementId
    }
    // 获取经纬度
    getLocation().then(v => {
      const {
        coords: { latitude, longitude }
      } = v
      this.setState({ latitude, longitude })
      this.$data.form.latitude = latitude
      this.$data.form.longitude = longitude
    })
    this.loadData()
      .then(v => {
        this.setState({ isReady: true })
      })
      .catch(e => {
        showToast('数据解析错误')
        this.setState({ isReady: true })
      })
  }
  loadData = async () => {
    const { data, isEdit, problemAddPreDataAction } = this.props
    const problemAddPreDataResult = await problemAddPreDataAction()
    const {
      assesId,
      users,
      subProjectData,
      conIndicatorScoresData
    } = problemAddPreDataResult
    this.$data.form.assConstructionAsse = assesId
    this.$data.user = users
    this.$data.subProject = subProjectData
    this.$data.conIndicatorScores = conIndicatorScoresData
    // 设置一级指标
    const firstIndicatorData = _.filter(conIndicatorScoresData, {
      upIndicatorId: ''
    })
    this.$data.firstIndicator = {
      text: _.map(firstIndicatorData, 'name'),
      value: _.map(firstIndicatorData, 'id')
    }
    if (isEdit) {
      // 设置二三级指标
      const scoendIndicatorData = _.filter(conIndicatorScoresData, {
        upIndicatorId: data.indicators[0].conId
      })
      const thridIndicatorData = _.filter(conIndicatorScoresData, {
        upIndicatorId: data.indicators[1].conId
      })
      if (data.indicators[1]) {
        this.$data.secondIndicator = {
          text: _.map(scoendIndicatorData, 'name'),
          value: _.map(scoendIndicatorData, 'id')
        }
      }
      if (data.indicators[2]) {
        this.$data.thridIndicator = {
          text: _.map(thridIndicatorData, 'name'),
          value: _.map(thridIndicatorData, 'id')
        }
      }
    }
    return true
  }
  _userSelect = () => {
    const { text, value } = this.$data.user
    ActionSheet.show(
      {
        options: text,
        title: '请选择专家'
      },
      index => {
        if (!text[index]) return
        this.setState({ user: text[index], userError: false })
        this.$data.form.user = value[index]
      }
    )
  }
  _subProjectSelect = () => {
    const { text, value } = this.$data.subProject
    ActionSheet.show(
      {
        options: text,
        title: '请选择子项目'
      },
      index => {
        if (!text[index]) return
        this.setState({ subProject: text[index], subProjectError: false })
        this.$data.form.conRoadSection = value[index]
      }
    )
  }
  _firstIndicatorSelect = () => {
    const { text, value } = this.$data.firstIndicator
    ActionSheet.show(
      {
        options: text,
        title: '请选择一级指标'
      },
      index => {
        if (!text[index]) return
        this.setState({
          firstIndicator: text[index],
          firstIndicatorError: false
        })
        this.$data.indicatorSelect = value[index]
        this.$data.form.conIndicatorsRequirement = null
        const secondIndicatorData = _.filter(
          this.$data.conIndicatorScores,
          v => v.upIndicatorId === this.$data.indicatorSelect
        )
        const isIndicatorEmpty = secondIndicatorData.length > 0
        this.setState({
          secondIndicator: isIndicatorEmpty ? '请选择二级指标' : null,
          conIndicatorsRequirement: isIndicatorEmpty ? null : '请选择指标要求',
          thridIndicator: null
        })
        if (isIndicatorEmpty)
          this.$data.secondIndicator = {
            text: _.map(secondIndicatorData, 'name'),
            value: _.map(secondIndicatorData, 'id')
          }
      }
    )
  }
  _secondIndicatorSelect = () => {
    const { text, value } = this.$data.secondIndicator
    ActionSheet.show(
      {
        options: text,
        title: '请选择二级指标'
      },
      index => {
        if (!text[index]) return
        this.setState({
          secondIndicator: text[index],
          secondIndicatorError: false
        })
        this.$data.indicatorSelect = value[index]
        this.$data.form.conIndicatorsRequirement = null
        const thridIndicatorData = _.filter(
          this.$data.conIndicatorScores,
          v => v.upIndicatorId === this.$data.indicatorSelect
        )
        const isIndicatorEmpty = thridIndicatorData.length > 0
        this.setState({
          thridIndicator: isIndicatorEmpty ? '请选择三级指标' : null,
          conIndicatorsRequirement: isIndicatorEmpty ? null : '请选择指标要求'
        })
        if (isIndicatorEmpty)
          this.$data.thridIndicator = {
            text: _.map(thridIndicatorData, 'name'),
            value: _.map(thridIndicatorData, 'id')
          }
      }
    )
  }
  _thridIndicatorSelect = () => {
    const { text, value } = this.$data.thridIndicator
    ActionSheet.show(
      {
        options: text,
        title: '请选择三级指标'
      },
      index => {
        if (!text[index]) return
        this.setState({
          thridIndicator: text[index],
          conIndicatorsRequirement: '请选择指标要求',
          thridIndicatorError: false
        })
        this.$data.indicatorSelect = value[index]
        this.$data.form.conIndicatorsRequirement = null
      }
    )
  }
  _conIndicatorsRequirementSelect = () => {
    const { conIndicatorsQueryAction } = this.props
    conIndicatorsQueryAction(this.$data.indicatorSelect)
      .then(v => {
        const { text, value } = v
        ActionSheet.show(
          {
            options: text,
            title: '请选择指标要求'
          },
          index => {
            if (!text[index]) return
            this.setState({
              conIndicatorsRequirement: text[index],
              conIndicatorsRequirementError: false
            })
            this.$data.form.conIndicatorsRequirement = value[index]
          }
        )
      })
      .catch(e => {
        showToast('数据解析错误')
      })
  }
  _submit = () => {
    const { imgPicked } = this.state
    const { problemAddIsSubmit } = this.props
    if (this.props.isEdit) {
      if (this.checkFormField()) {
        this.props.onSubmit(this.$data.form, imgPicked)
      }
      return
    }
    if (problemAddIsSubmit) return false
    if (this.checkFormField()) {
      this.$data.form.happenTime = JSON.stringify(new Date())
      this.props.problemSubmitAction(this.$data.form, imgPicked)
    }
  }

  checkFormField = () => {
    const { isEdit } = this.props
    const { user, conIndicatorsRequirement, conRoadSection } = this.$data.form
    const {
      firstIndicator,
      secondIndicator,
      thridIndicator,
      conIndicatorsRequirement: conIndicatorsRequirementState
    } = this.state
    if (_.isNil(user) && !isEdit) {
      this.setState({ userError: true })
      return false
    }
    if (_.isNil(conRoadSection) && !isEdit) {
      this.setState({ subProjectError: true })
      return false
    }
    if (_.isNil(conIndicatorsRequirement)) {
      if (!_.isNil(conIndicatorsRequirementState)) {
        this.setState({ conIndicatorsRequirementError: true })
        return false
      }
      if (_.isNil(conIndicatorsRequirementState) && !_.isNil(thridIndicator)) {
        this.setState({ thridIndicatorError: true })
        return false
      }
      if (_.isNil(conIndicatorsRequirementState) && !_.isNil(secondIndicator)) {
        this.setState({ secondIndicatorError: true })
        return false
      }
      if (_.isNil(conIndicatorsRequirementState) && !_.isNil(firstIndicator)) {
        this.setState({ firstIndicatorError: true })
        return false
      }
    }
    return true
  }

  _imgAdd = v => {
    const { imgPicked } = this.state
    imgPicked.push(v)
    this.setState({ imgPicked })
  }

  _imgDel = v => {
    const { imgPicked } = this.state
    if (!v) return
    const imgFilter = _.filter(imgPicked, val => val !== v)
    this.setState({ imgPicked: imgFilter })
  }

  render() {
    const {
      isReady,
      user,
      latitude,
      longitude,
      subProject,
      firstIndicator,
      secondIndicator,
      thridIndicator,
      imgPicked,
      conIndicatorsRequirement,
      userError,
      subProjectError,
      firstIndicatorError,
      secondIndicatorError,
      thridIndicatorError,
      conIndicatorsRequirementError,
      problemDescription
    } = this.state
    const {
      screenData: { problemAddIsSubmit }
    } = this.props
    return (
      <Container>
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
            onReady={isReady}
          >
            <View style={styles.proAddContent}>
              <SelectItem
                label={'专家'}
                rightText={user}
                error={userError}
                errorTip="请选择专家"
                onPress={this._userSelect}
              />
              <TextItem
                color={'#999999'}
                label={'问题位置:'}
                rightText={`经度--${longitude} 纬度--${latitude}`}
                numberOfLines={1}
              />
              <SelectItem
                label={'问题所属子项目'}
                rightText={subProject}
                error={subProjectError}
                errorTip="请选择子项目"
                onPress={this._subProjectSelect}
              />
              <SelectItem
                label={'一级指标'}
                rightText={firstIndicator}
                error={firstIndicatorError}
                errorTip="请选择一级指标"
                onPress={this._firstIndicatorSelect}
              />
              {!_.isNull(secondIndicator) && (
                <SelectItem
                  label={'二级指标'}
                  error={secondIndicatorError}
                  errorTip="请选择二级指标"
                  rightText={secondIndicator}
                  onPress={this._secondIndicatorSelect}
                />
              )}
              {!_.isNull(thridIndicator) && (
                <SelectItem
                  label={'三级指标'}
                  error={thridIndicatorError}
                  errorTip="请选择三级指标"
                  rightText={thridIndicator}
                  onPress={this._thridIndicatorSelect}
                />
              )}
              {!_.isNull(conIndicatorsRequirement) && (
                <SelectItem
                  label={'指标要求'}
                  error={conIndicatorsRequirementError}
                  errorTip="请选择指标要求"
                  rightText={conIndicatorsRequirement}
                  onPress={this._conIndicatorsRequirementSelect}
                />
              )}
              <TextareaItem
                placeholder="问题描述"
                label="问题描述:"
                value={problemDescription}
                onChangeText={v => {
                  this.setState({ problemDescription: v })
                  this.$data.form.problemDescription = v
                }}
              />
              <ImgItem
                label="图片:"
                files={imgPicked}
                onImgAdd={this._imgAdd}
                onImgDel={this._imgDel}
              />
              <Divider style={{ backgroundColor: '#E4E4E4' }} />
              <View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
                <FullButton
                  title={'提交'}
                  onPress={this._submit}
                  loading={problemAddIsSubmit}
                />
              </View>
            </View>
          </Placeholder.Paragraph>
        </Content>
      </Container>
    )
  }
}

export default connect(
  state => ({
    projectData: state.project,
    screenData: state.screen
  }),
  {
    projectCheckAction,
    problemAddPreDataAction,
    conIndicatorsQueryAction,
    problemSubmitAction
  }
)(ProAdd)

const styles = StyleSheet.create({
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3781C6'
  },
  proAddContent: {
    backgroundColor: '#fff'
  }
})
