import React from 'react'
import {
  Container,
  View,
  Content,
  CardItem,
  Body,
  Text,
  Card
} from 'native-base'
import { connect } from 'react-redux'
import Header from '../components/Header'
import { proSelectAction } from '../store/actions/projectAction'

const ProItem = props => {
  const { title } = props
  return (
    <Card>
      <CardItem button onPress={() => props.onPress()}>
        <Body>
          <View
            style={{
              width: '100%',
              paddingVertical: 25,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>{title}</Text>
          </View>
        </Body>
      </CardItem>
    </Card>
  )
}
class Project extends React.Component {
  static navigationOptions = {
    headerTitle: <Header title={'项目选择'} leftIcon={null} />
  }
  _proSelect = data => () => {
    const { proSelectAction } = this.props
    proSelectAction(data)
    this.props.navigation.navigate('Home')
  }
  render() {
    const {
      projectState: { projects }
    } = this.props
    return (
      <Container>
        <Content padder>
          {projects.map(v => (
            <ProItem
              key={v.id}
              title={v.proName}
              onPress={this._proSelect(v)}
            />
          ))}
        </Content>
      </Container>
    )
  }
}

export default connect(
  state => ({
    projectState: state.project
  }),
  { proSelectAction }
)(Project)
