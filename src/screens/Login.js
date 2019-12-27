import React from 'react'
import { StyleSheet, Dimensions, Image, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  H2,
  Text,
  View,
  Input,
  Item,
  ActionSheet
} from 'native-base'
import { BoxShadow } from 'react-native-shadow'
import { Button } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import _ from 'lodash'
import { ListSelect } from '../components/List'
import StatusBar from '../components/StatusBar'
import { ModifyServer, DOMAIN } from '../helper/api'
import { projectData } from '../helper/data'
import { proSelectAction } from '../store/actions/projectAction'
import { restStoreAction } from '../store/actions/resetAction'
import { loginAction } from '../store/actions/requestAction'
import Layout from '../constants/Layout'
import { showToast } from '../helper/toast'

const { statusBarHeight } = Layout
const { height, width } = Dimensions.get('window')
const bgHeight = 546 * (width / 720)
const loginLogoSide = width / 5

const shadowOption = {
  width: width * 0.75,
  height: (height - bgHeight) * 0.8,
  color: '#3164b2',
  border: 3,
  radius: 4,
  opacity: 0.1,
  x: 3,
  y: 3,
  style: {
    marginTop: (bgHeight * 5) / 6 - loginLogoSide - 115,
    marginVertical: 5
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listSelectContent: '请选择',
      userName: '',
      password: ''
    }
    this.$data = {
      actionSheetOption: projectData,
      selectOption: _.map(projectData, 'url')
    }
  }

  componentDidMount() {
    this.loadData()
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp()
      return false
    })
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  loadData = async () => {
    const { restStoreAction } = this.props
    await restStoreAction()
  }

  // 提交登录
  _submit = () => {
    if (_.isNil(DOMAIN)) {
      showToast('请选择所属系统')
      return false
    }
    const { loginAction, navigation } = this.props
    const { userName, password } = this.state
    loginAction({ userName, password, navigation })
  }

  // 底部弹出框
  _SelectAction = () => {
    const { actionSheetOption, selectOption } = this.$data
    ActionSheet.show(
      {
        options: actionSheetOption,
        cancelButtonIndex: 0,
        title: '请选择所属系统'
      },
      index => {
        ModifyServer(selectOption[index])
        this.setState({ listSelectContent: actionSheetOption[index].text })
      }
    )
  }

  render() {
    const { listSelectContent, userName, password } = this.state
    const {
      screenData: { loginIsSubmit }
    } = this.props
    return (
      <Container>
        <StatusBar />
        <Image
          style={styles.loginBg}
          source={require('../assets/imgs/m-login-bg.png')}
        />
        <View style={styles.loginContent}>
          <Image
            style={styles.loginLogo}
            source={require('../assets/imgs/m-login-logo.png')}
          />
          <Text style={styles.loginProName}>PPP绩效考核管理平台</Text>
          <BoxShadow setting={shadowOption}>
            <View style={styles.loginForm}>
              <H2 style={{ lineHeight: 40 }}>登录</H2>
              <ListSelect
                title={'所属系统'}
                content={listSelectContent}
                style={{ paddingVertical: 10 }}
                onPress={this._SelectAction}
              />
              <Item>
                <FontAwesome name="user-circle-o" size={20} color="#333" />
                <Input
                  placeholder={'请输入用户名'}
                  onChangeText={userName => this.setState({ userName })}
                  value={userName}
                  returnKeyType="next"
                  style={{ paddingLeft: 10, fontSize: 16, color: '#333' }}
                />
              </Item>
              <Item>
                <FontAwesome name="lock" size={26} color="#333" />
                <Input
                  placeholder={'请输入密码'}
                  onChangeText={password => this.setState({ password })}
                  secureTextEntry
                  value={password}
                  returnKeyType="next"
                  style={{ paddingLeft: 12, fontSize: 16, color: '#333' }}
                />
              </Item>
              <Button
                title="登录"
                containerStyle={styles.signUpButtonContainer}
                buttonStyle={styles.signUpButton}
                titleStyle={styles.signUpButtonText}
                loading={loginIsSubmit}
                onPress={this._submit}
              />
              <Image
                style={styles.loginFormbg}
                source={require('../assets/imgs/m-login-form-bg.png')}
              />
            </View>
          </BoxShadow>
        </View>
      </Container>
    )
  }
}

export default connect(
  state => ({
    userData: state.userData,
    screenData: state.screen
  }),
  { proSelectAction, restStoreAction, loginAction }
)(Login)

const styles = StyleSheet.create({
  loginContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: bgHeight / 5
  },
  loginProName: {
    paddingTop: 15,
    color: '#fff'
  },
  loginBg: {
    position: 'absolute',
    top: statusBarHeight,
    width,
    height: bgHeight,
    resizeMode: 'contain'
  },
  loginLogo: {
    width: loginLogoSide,
    height: loginLogoSide
  },
  loginForm: {
    width: width * 0.75,
    height: (height - bgHeight) * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  loginFormbg: {
    position: 'absolute',
    bottom: 0,
    width: width * 0.75,
    height: ((width * 0.75) / 550) * 167,
    resizeMode: 'contain'
  },
  signUpButtonText: {
    fontFamily: 'bold',
    fontSize: 14
  },
  signUpButton: {
    borderRadius: 4,
    marginTop: 30,
    marginLeft: -15,
    width: width * 0.75 - 40,
    height: 40,
    backgroundColor: '#3164B3',
    elevation: 3,
    zIndex: 99
  },
  signUpButtonContainer: {
    elevation: 1
  }
})
