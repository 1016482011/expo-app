import React from 'react'
import { connect } from 'react-redux'
import { Container, View, Text } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import Header from '../../components/Header'
import { problemQuestAction } from '../../store/actions/requestAction'

class Result extends React.Component {
  static navigationOptions = {
    headerTitle: <Header title={'录入问题'} leftIcon={null} />
  }

  componentDidMount() {
    this.props.problemQuestAction([])
    this.timer = setTimeout(() => {
      this.props.navigation.replace('Home')
    }, 1000)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            padding: 20,
            paddingBottom: 50,
            backgroundColor: '#F5F5F9'
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 3,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesome
              name="check-circle"
              size={80}
              color="#3781C6"
              style={{ marginBottom: 10 }}
            />
            <Text>提交成功!</Text>
          </View>
        </View>
      </Container>
    )
  }
}

export default connect(
  state => ({
    state
  }),
  { problemQuestAction }
)(Result)
