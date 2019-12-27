import React from 'react'
import { StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { Container, View } from 'native-base'
import ListTab from './ProList/ListTab'
import MapTab from './ProList/MapTab'
import Header from '../../components/Header'
import { problemListModelAction } from '../../store/actions/problemAction'
import { problemQuestAction } from '../../store/actions/requestAction'

StatusBar.setBackgroundColor('#3781C6')

const ProListHeader = props => {
  const {
    projectState: {
      projectSelect: { proName }
    },
    problemData: { listModel },
    problemListModelAction
  } = props
  return (
    <Header
      title={proName}
      leftIcon={null}
      type={!listModel ? 'FontAwesome' : 'MaterialIcons'}
      rightIcon={!listModel ? 'map' : 'format-list-bulleted'}
      onRightPress={() => problemListModelAction()}
    />
  )
}
const ProListHeaderWarp = connect(
  state => ({
    projectState: state.project,
    problemData: state.problem
  }),
  { problemListModelAction }
)(ProListHeader)

class ProList extends React.Component {
  static navigationOptions = {
    headerTitle: <ProListHeaderWarp />,
    headerStyle: {
      backgroundColor: '#3781C6'
    }
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const {
      projectState: { projectSelect },
      problemQuestAction
    } = this.props
    const assConstructionAssesId = projectSelect.assConstructionAsses[0].id
    problemQuestAction(assConstructionAssesId)
  }
  _onRefresh = () => {
    this.loadData()
  }

  render() {
    const {
      problemData: { listModel },
      navigation
    } = this.props
    return (
      <Container>
        <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
          <View style={{ flex: 1, display: listModel ? 'flex' : 'none' }}>
            <ListTab navigation={navigation} onRefresh={this._onRefresh} />
          </View>
          {!listModel && <MapTab navigation={navigation} />}
        </View>
      </Container>
    )
  }
}

export default connect(
  state => ({
    projectState: state.project,
    problemData: state.problem
  }),
  { problemQuestAction }
)(ProList)
