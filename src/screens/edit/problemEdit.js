import React from 'react'
import { Container, View, Content } from 'native-base'
import { connect } from 'react-redux'
import _ from 'lodash'
import Header from '../../components/Header'
import ProblemAdd from '../../screens/home/ProAdd'
import {
  errorToast,
  problemEditAction
} from '../../store/actions/requestAction'
import { ProblemDtailApi } from '../../helper/wrapperApi'

class ProblemEdit extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Header
          title={'问题编辑'}
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
      requirementName: null,
      subProjectName: null,
      requirementId: null,
      latitude: null,
      longitude: null,
      happenTime: null,
      firstIndicator: null,
      secondIndicator: null,
      thridIndicator: null,
      problemDescription: null,
      pfUser: null,
      indicators: [],
      isLoaded: false,
      isSubmit: false,
      imgsExist: []
    }
    this.$data = {
      imgFiles: []
    }
  }
  componentDidMount() {
    this.$data.imgFiles = []
    const {
      problemData: { proToSelectId }
    } = this.props
    ProblemDtailApi(proToSelectId)
      .then(data => {
        if (!_.isEmpty(data.imgs)) {
          this.$data.imgFiles = data.imgs
          this.setState({
            imgsExist: _.map(data.imgs, v => v.downloadUrl)
          })
        }
        const indicatorsArr = data.indicators
        const len = indicatorsArr.length
        this.setState({
          firstIndicator: len > 0 ? indicatorsArr[0].name : '请选择一级指标',
          secondIndicator: len > 1 ? indicatorsArr[1].name : null,
          thridIndicator: len > 2 ? indicatorsArr[2].name : null,
          indicators: indicatorsArr,
          isLoaded: true,
          requirementName: data.requirementName,
          subProjectName: data.subProjectName,
          requirementId: data.requirementId,
          latitude: data.latitude,
          longitude: data.longitude,
          happenTime: data.happenTime,
          problemDescription: data.problemDescription,
          pfUser: data.pfUser
        })
      })
      .catch(e => {
        errorToast(e)
        this.props.navigation.goBack()
      })
  }
  _submit = (v, imgPicked) => {
    const {
      problemEditAction,
      screenData: { problemAddIsSubmit }
    } = this.props
    const {
      user,
      problemDescription,
      latitude,
      longitude,
      conIndicatorsRequirement,
      conRoadSection
    } = v
    if (problemAddIsSubmit) return
    let formData = {
      latitude: latitude,
      longitude: longitude
    }

    if (user) formData.user = { connect: { id: user } }
    if (problemDescription) formData.problemDescription = problemDescription
    if (conIndicatorsRequirement)
      formData.conIndicatorsRequirement = {
        connect: { id: conIndicatorsRequirement }
      }
    if (conRoadSection)
      formData.conRoadSection = { connect: { id: conRoadSection } }
    const { imgFileToUploadUrls, imgFileDelUrls } = this.compareImgs(imgPicked)
    problemEditAction(formData, imgFileToUploadUrls, imgFileDelUrls)
  }
  compareImgs = imgPicked => {
    const imgFileUrls = _.map(this.$data.imgFiles, 'downloadUrl')
    const fileToDel = _.difference(imgFileUrls, imgPicked)
    const imgFileToUploadUrls = _.difference(imgPicked, imgFileUrls)
    const imgFileDelUrls = _.map(
      _.filter(
        this.$data.imgFiles,
        v => _.indexOf(fileToDel, v.downloadUrl) > -1
      ),
      'deleteUrl'
    )
    return {
      imgFileToUploadUrls,
      imgFileDelUrls
    }
  }
  render() {
    const { isLoaded } = this.state
    return (
      <Container>
        <Content style={{ backgroundColor: '#F5F5F9' }}>
          {isLoaded && (
            <ProblemAdd
              isEdit={true}
              data={this.state}
              onSubmit={this._submit}
            />
          )}
        </Content>
      </Container>
    )
  }
}

export default connect(
  state => ({
    problemData: state.problem,
    screenData: state.screen
  }),
  { problemEditAction }
)(ProblemEdit)
